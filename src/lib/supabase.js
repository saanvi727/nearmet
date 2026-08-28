import { createClient } from '@supabase/supabase-js'
import heic2any from 'heic2any'
 
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
 
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
 
// ─── AUTH ─────────────────────────────────────────────────────────────────────
 
export async function signUp({ email, password, name, age, city, phone }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, age, city, phone } },
  })
  if (error) throw error
  // Create profile immediately — works whether email confirm is on or off.
  // If user.identities is empty, the email already exists.
  if (data.user && data.user.identities?.length !== 0) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      name: name || '',
      age: parseInt(age) || null,
      city: city || 'mumbai',
      phone: phone || '',
      email,
      created_at: new Date().toISOString(),
    })
    // Ignore duplicate key errors (profile may already exist)
    if (profileError && profileError.code !== '23505') {
      console.error('Profile create error:', profileError)
    }
  }
  return data
}

 
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}
 
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
 
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle() // returns null instead of 406 if no row exists
  if (error) throw error
  return data
}
 
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}
 
// ─── IMAGE COMPRESSION ────────────────────────────────────────────────────────
// Compresses a File/Blob using the browser Canvas API before uploading.
// maxWidth/maxHeight: resize if larger (preserves aspect ratio)
// quality: JPEG quality 0–1
// Returns a Blob ready to upload, always as image/jpeg.
// iPhones default to saving photos as HEIC/HEIF, which browsers cannot decode
// natively via <img>/Canvas. Convert to JPEG first so compressImage below can
// always work with a format every browser understands.
async function toDecodableBlob(file) {
  const isHeic = file.type === 'image/heic' || file.type === 'image/heif' ||
    /\.hei[cf]$/i.test(file.name || '')
  if (!isHeic) return file
  try {
    const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 })
    // heic2any returns an array if the HEIC container holds multiple images (e.g. Live Photos)
    return Array.isArray(converted) ? converted[0] : converted
  } catch (e) {
    throw new Error('This photo format (HEIC) could not be converted — please try a JPEG or PNG instead.')
  }
}

async function compressImage(file, { maxWidth = 1200, maxHeight = 1200, quality = 0.82 } = {}) {
  const decodableFile = await toDecodableBlob(file)
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(decodableFile)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      const ratio = Math.min(maxWidth / width, maxHeight / height, 1)
      width = Math.round(width * ratio)
      height = Math.round(height * ratio)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => {
        if (blob) resolve(blob)
        else reject(new Error('Canvas compression failed'))
      }, 'image/jpeg', quality)
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed — please try a different photo (JPEG or PNG work best).')); }
    img.src = url
  })
}
 
export async function uploadProfilePhoto(userId, file, slot) {
  // Profile photos: max 800px, quality 0.80 — shown at small sizes, high compression fine
  const compressed = await compressImage(file, { maxWidth: 800, maxHeight: 800, quality: 0.80 })
  const path = `${userId}/photo_${slot}.jpg`
  const { error } = await supabase.storage
    .from('profile-photos')
    .upload(path, compressed, { upsert: true, contentType: 'image/jpeg' })
  if (error) throw error
  const { data } = supabase.storage.from('profile-photos').getPublicUrl(path)
  return data.publicUrl
}
 
// ─── FOOD EXPERIENCES (community photos/notes on food places) ────────────────
 
export async function uploadFoodExperiencePhoto(userId, file) {
  // Experience photos: max 1200px, quality 0.82 — shown larger in detail view
  const compressed = await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.82 })
  const path = `experiences/${userId}/${Date.now()}.jpg`
  const { error } = await supabase.storage
    .from('place-photos')
    .upload(path, compressed, { upsert: false, contentType: 'image/jpeg' })
  if (error) throw error
  const { data } = supabase.storage.from('place-photos').getPublicUrl(path)
  return data.publicUrl
}
 
export async function getFoodExperiences(foodPlaceKey) {
  const { data, error } = await supabase
    .from('food_experiences')
    .select('*')
    .eq('food_place_key', foodPlaceKey)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
 
export async function shareFoodExperience(userId, userName, foodPlaceKey, { photoUrl, note, favoriteItem }) {
  const { data, error } = await supabase
    .from('food_experiences')
    .insert({
      food_place_key: foodPlaceKey,
      user_id: userId,
      user_name: userName,
      photo_url: photoUrl || null,
      note: note || null,
      favorite_item: favoriteItem || null,
    })
    .select()
    .single()
  if (error) throw error
  return data
}
 
export async function deleteFoodExperience(experienceId) {
  const { error } = await supabase.from('food_experiences').delete().eq('id', experienceId)
  if (error) throw error
}
 
// ─── COMMUNITY PLACES (user-submitted food places) ────────────────────────────
 
export async function getCommunityPlaces(city) {
  const { data, error } = await supabase
    .from('community_places')
    .select('*')
    .eq('city', city)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
 
export async function uploadCommunityPlacePhoto(userId, file) {
  // Community place photos: max 1200px, quality 0.82
  const compressed = await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.82 })
  const path = `community-places/${userId}/${Date.now()}.jpg`
  const { error } = await supabase.storage
    .from('place-photos')
    .upload(path, compressed, { upsert: false, contentType: 'image/jpeg' })
  if (error) throw error
  const { data } = supabase.storage.from('place-photos').getPublicUrl(path)
  return data.publicUrl
}
 
export async function submitCommunityPlace(userId, userName, { city, name, area, cuisine, description, photoUrl }) {
  const { data, error } = await supabase
    .from('community_places')
    .insert({
      city, name, area,
      cuisine: cuisine || null,
      description: description || null,
      photo_url: photoUrl || null,
      submitted_by: userId,
      submitter_name: userName,
      status: 'pending', // requires admin approval before showing publicly — getCommunityPlaces only returns status='approved'
    })
    .select()
    .single()
  if (error) throw error
  return data
}
 
// ─── RESTAURANTS ──────────────────────────────────────────────────────────────
 
export async function getRestaurants(city, filters = {}) {
  let query = supabase
    .from('restaurants')
    .select('*')
    .eq('city', city)
    .eq('approved', true)
 
  if (filters.cuisine && filters.cuisine !== 'All') {
    query = query.eq('cuisine', filters.cuisine)
  }
  if (filters.sort === 'Highest Rated') {
    query = query.order('rating', { ascending: false })
  } else {
    query = query.order('search_count', { ascending: false })
  }
 
  const { data, error } = await query
  if (error) throw error
  return data
}
 
export async function toggleRestaurantLike(userId, restaurantId) {
  const { data: existing } = await supabase
    .from('restaurant_likes')
    .select('id')
    .eq('user_id', userId)
    .eq('restaurant_id', restaurantId)
    .single()
 
  if (existing) {
    await supabase.from('restaurant_likes').delete().eq('id', existing.id)
    return false
  } else {
    await supabase.from('restaurant_likes').insert({ user_id: userId, restaurant_id: restaurantId })
    return true
  }
}
 
// ─── EVENTS (legacy curated events table — unused by current "What's Happening" UI) ──
 
export async function getEvents(city) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('city', city)
    .order('event_date', { ascending: true })
  if (error) throw error
  return data
}
 
export async function createEvent(userId, eventData) {
  const { data, error } = await supabase
    .from('events')
    .insert({ ...eventData, created_by: userId })
    .select()
    .single()
  if (error) throw error
  return data
}
 
export async function toggleEventInterest(userId, eventId) {
  const { data: existing } = await supabase
    .from('event_interests')
    .select('id')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .single()
 
  if (existing) {
    await supabase.from('event_interests').delete().eq('id', existing.id)
    return false
  } else {
    await supabase.from('event_interests').insert({ user_id: userId, event_id: eventId })
    return true
  }
}
 
// ─── THIRD PLACES ─────────────────────────────────────────────────────────────
 
export async function getThirdPlaces(city, category = 'All') {
  let query = supabase
    .from('third_places')
    .select('*')
    .eq('city', city)
    .eq('approved', true)
    .order('visitor_count', { ascending: false })
 
  if (category !== 'All') {
    query = query.contains('categories', [category])
  }
 
  const { data, error } = await query
  if (error) throw error
  return data
}
 
export async function submitThirdPlace(userId, placeData) {
  const { data, error } = await supabase
    .from('third_places')
    .insert({ ...placeData, submitted_by: userId, approved: false })
    .select()
    .single()
  if (error) throw error
  return data
}
 
// ─── CONNECTION ───────────────────────────────────────────────────────────────
 
export async function getPeople(city, userId) {
  const [passedResult, myProfileResult] = await Promise.all([
    supabase.from('profile_passes').select('passed_id').eq('user_id', userId),
    supabase.from('profiles').select('interests,city_wants').eq('id', userId).single(),
  ])

  const passedIds = (passedResult.data || []).map(p => p.passed_id)
  const me = myProfileResult.data || {}

  let query = supabase
    .from('profiles')
    .select('*')
    .eq('city', city)
    .eq('profile_complete', true)
    .neq('id', userId)
    .limit(60) // fetch more so we can sort by match score

  if (passedIds.length > 0) {
    query = query.not('id', 'in', `(${passedIds.join(',')})`)
  }

  const { data, error } = await query
  if (error) throw error

  const myInterests = me.interests || []
  const myThings = me.city_wants || []

  // Normalise for flexible matching across old IDs and new label-based values
  const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  const matches = (a, b) => norm(a) === norm(b)

  // Score each person by overlap with the current user
  const scored = (data || []).map(person => {
    const sharedInterests = (person.interests || []).filter(i =>
      myInterests.some(mi => matches(i, mi))
    ).length
    const sharedThings = (person.city_wants || []).filter(t =>
      myThings.some(mt => matches(t, mt))
    ).length
    const hasPhoto = (person.photo_urls || []).filter(Boolean).length > 0 ? 1 : 0
    const hasPrompts = Object.keys(person.prompts || {}).length > 0 ? 1 : 0
    const score = (sharedThings * 3) + (sharedInterests * 2) + hasPhoto + hasPrompts
    return { ...person, _score: score }
  })

  // Sort by score desc, then by last_active as tiebreaker
  scored.sort((a, b) => {
    if (b._score !== a._score) return b._score - a._score
    return new Date(b.last_active || 0) - new Date(a.last_active || 0)
  })

  return scored.slice(0, 20)
}
 
export async function passProfile(userId, passedId) {
  await supabase.from('profile_passes').insert({
    user_id: userId,
    passed_id: passedId,
    passed_at: new Date().toISOString(),
  })
}
 
export async function resetPasses(userId) {
  const { error } = await supabase.from('profile_passes').delete().eq('user_id', userId)
  if (error) throw error
}
 
export async function sendResonance(fromUserId, toUserId, promptIndex, message) {
  const { data, error } = await supabase
    .from('resonances')
    .insert({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      prompt_index: promptIndex,
      message,
      status: 'pending',
      created_at: new Date().toISOString(),
    })
    .select()
    .single()
  if (error) throw error
  return data
}
 
export async function getOrCreateConnection(userId, otherId) {
  const { data: existing } = await supabase
    .from('connections')
    .select('*')
    .or(`and(user1_id.eq.${userId},user2_id.eq.${otherId}),and(user1_id.eq.${otherId},user2_id.eq.${userId})`)
    .maybeSingle()
  if (existing) return existing

  // New connection starts as 'pending' — recipient must accept before full chat opens
  const { data, error } = await supabase
    .from('connections')
    .insert({ user1_id: userId, user2_id: otherId, requester_id: userId, status: 'pending' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getConnections(userId) {
  const { data, error } = await supabase
    .from('connections')
    .select(`*, user1:profiles!user1_id(id,name,age,city,photo_urls,prompts), user2:profiles!user2_id(id,name,age,city,photo_urls,prompts), messages(count)`)
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getPendingRequests(userId) {
  const { data, error } = await supabase
    .from('connections')
    .select(`*, user1:profiles!user1_id(id,name,age,city,photo_urls,prompts,interests), user2:profiles!user2_id(id,name,age,city,photo_urls,prompts,interests)`)
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .eq('status', 'pending')
    .neq('requester_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function acceptRequest(connectionId) {
  const { error } = await supabase
    .from('connections')
    .update({ status: 'accepted' })
    .eq('id', connectionId)
  if (error) throw error
}

export async function rejectRequest(connectionId) {
  const { error } = await supabase
    .from('connections')
    .delete()
    .eq('id', connectionId)
  if (error) throw error
}

// ─── BLOCK ────────────────────────────────────────────────────────────────────

export async function blockUser(blockerId, blockedId) {
  // Insert both directions so each user hides the other
  await supabase.from('blocks').insert([
    { blocker_id: blockerId, blocked_id: blockedId },
    { blocker_id: blockedId, blocked_id: blockerId },
  ]).select() // suppress duplicate errors

  // Remove any connection between them
  await supabase.from('connections').delete()
    .or(`and(user1_id.eq.${blockerId},user2_id.eq.${blockedId}),and(user1_id.eq.${blockedId},user2_id.eq.${blockerId})`)
}

export async function getBlockedIds(userId) {
  // Get IDs the user has blocked
  const { data, error } = await supabase
    .from('blocks')
    .select('blocked_id')
    .eq('blocker_id', userId)
  if (error) throw error
  return (data || []).map(b => b.blocked_id)
}
 
// ─── MESSAGES ─────────────────────────────────────────────────────────────────
 
export async function getMessages(connectionId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('connection_id', connectionId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}
 
export async function sendMessage(connectionId, senderId, text) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ connection_id: connectionId, sender_id: senderId, text, read: false })
    .select()
    .single()
  if (error) throw error
  return data
}
 
export function subscribeToMessages(connectionId, callback) {
  return supabase
    .channel(`messages:${connectionId}`)
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'messages',
      filter: `connection_id=eq.${connectionId}`,
    }, payload => callback(payload.new))
    .subscribe()
}

// ─── COMMUNITY EVENTS ("What's Happening") ───────────────────────────────────
// Mirrors the community_places pattern: user-submitted, requires approval
// (status: 'pending' | 'approved') before showing publicly, for safety/spam control.

export async function uploadEventPhoto(userId, file) {
  const compressed = await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.82 })
  const path = `events/${userId}/${Date.now()}.jpg`
  const { error } = await supabase.storage
    .from('place-photos') // reuse existing public bucket
    .upload(path, compressed, { upsert: false, contentType: 'image/jpeg' })
  if (error) throw error
  const { data } = supabase.storage.from('place-photos').getPublicUrl(path)
  return data.publicUrl
}

export async function getCommunityEvents(city) {
  const { data, error } = await supabase
    .from('community_events')
    .select('*')
    .eq('city', city)
    .eq('status', 'approved')
    .order('event_date', { ascending: true })
  if (error) throw error
  return data
}

export async function submitCommunityEvent(userId, userName, eventData) {
  const { data, error } = await supabase
    .from('community_events')
    .insert({
      ...eventData,
      submitted_by: userId,
      submitter_name: userName,
      status: 'approved', // events go live immediately — no review needed
      created_at: new Date().toISOString(),
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function toggleCommunityEventInterest(userId, eventId) {
  const { data: existing } = await supabase
    .from('community_event_interests')
    .select('id')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .single()

  if (existing) {
    await supabase.from('community_event_interests').delete().eq('id', existing.id)
    return false
  } else {
    await supabase.from('community_event_interests').insert({ user_id: userId, event_id: eventId })
    return true
  }
}

export async function getCommunityEventInterestCount(eventId) {
  const { count, error } = await supabase
    .from('community_event_interests')
    .select('id', { count: 'exact', head: true })
    .eq('event_id', eventId)
  if (error) throw error
  return count || 0
}

// ─── PASSPORT (personal food/places/activities record + anonymous community feed) ──
// passport_entries: id, user_id, city, category ('food'|'places'|'activities'),
// place_name, location, photo_url, note, tags (text[]), created_at.
// The community feed reads from passport_entries_public — a view that never
// exposes user_id, so entries are genuinely anonymous to other users.

export async function uploadPassportPhoto(userId, file) {
  const compressed = await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.82 })
  const path = `passport/${userId}/${Date.now()}.jpg`
  const { error } = await supabase.storage
    .from('place-photos')
    .upload(path, compressed, { upsert: false, contentType: 'image/jpeg' })
  if (error) throw error
  const { data } = supabase.storage.from('place-photos').getPublicUrl(path)
  return data.publicUrl
}

export async function addPassportEntry(userId, city, category, { placeName, location, photoUrl, note, tags }) {
  const { data, error } = await supabase
    .from('passport_entries')
    .insert({
      user_id: userId,
      city,
      category,
      place_name: placeName,
      location: location || null,
      photo_url: photoUrl || null,
      note: note || null,
      tags: tags || [],
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getPassportFeed(city, category, limit = 20) {
  const { data, error } = await supabase
    .from('passport_entries_public')
    .select('*')
    .eq('city', city)
    .eq('category', category)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function getMyPassportEntries(userId, category) {
  let query = supabase.from('passport_entries').select('*').eq('user_id', userId)
  if (category) query = query.eq('category', category)
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getMyPassportCounts(userId) {
  const { data, error } = await supabase.from('passport_entries').select('category').eq('user_id', userId)
  if (error) throw error
  const counts = { food: 0, places: 0, activities: 0 }
  ;(data || []).forEach(r => { if (counts[r.category] != null) counts[r.category]++ })
  return counts
}

export async function togglePassportSave(userId, entryId) {
  const { data: existing } = await supabase
    .from('passport_saves')
    .select('id')
    .eq('user_id', userId)
    .eq('entry_id', entryId)
    .maybeSingle()

  if (existing) {
    await supabase.from('passport_saves').delete().eq('id', existing.id)
    return false
  } else {
    await supabase.from('passport_saves').insert({ user_id: userId, entry_id: entryId })
    return true
  }
}

export async function getPassportSavedIds(userId) {
  const { data, error } = await supabase.from('passport_saves').select('entry_id').eq('user_id', userId)
  if (error) throw error
  return (data || []).map(r => r.entry_id)
}

export async function deletePassportEntry(entryId) {
  const { error } = await supabase.from('passport_entries').delete().eq('id', entryId)
  if (error) throw error
}

export async function getMyInterestedEvents(userId) {
  const { data, error } = await supabase
    .from('community_event_interests')
    .select('event:community_events(*)')
    .eq('user_id', userId)
  if (error) throw error
  return (data || []).map(r => r.event).filter(Boolean)
}

export async function setSecurityQuestion(question, answer) {
  const { error } = await supabase.rpc('set_security_question', { p_question: question, p_answer: answer })
  if (error) throw error
}
export async function getSecurityQuestion(email) {
  const { data, error } = await supabase.rpc('get_security_question', { p_email: email })
  if (error) throw error
  return data
}
export async function verifySecurityAnswer(email, answer) {
  const { data, error } = await supabase.rpc('verify_security_answer', { p_email: email, p_answer: answer })
  if (error) throw error
  return !!data
}
export async function resetPasswordWithSecurityAnswer(email, answer, newPassword) {
  const { data, error } = await supabase.rpc('reset_password_with_security_answer', { p_email: email, p_answer: answer, p_new_password: newPassword })
  if (error) throw error
  return !!data
}