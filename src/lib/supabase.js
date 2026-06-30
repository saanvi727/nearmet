
import { createClient } from '@supabase/supabase-js'
 
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
  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      name,
      age: parseInt(age),
      city,
      phone,
      email,
      created_at: new Date().toISOString(),
    })
    if (profileError) console.error('Profile create error:', profileError)
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
    .single()
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
async function compressImage(file, { maxWidth = 1200, maxHeight = 1200, quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
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
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); }
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
 
// ─── EVENTS ───────────────────────────────────────────────────────────────────
 
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
  const { data: passed } = await supabase
    .from('profile_passes')
    .select('passed_id')
    .eq('user_id', userId)
 
  const passedIds = (passed || []).map(p => p.passed_id)
 
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('city', city)
    .eq('profile_complete', true)
    .neq('id', userId)
    .order('last_active', { ascending: false })
    .limit(20)
 
  if (passedIds.length > 0) {
    query = query.not('id', 'in', `(${passedIds.join(',')})`)
  }
 
  const { data, error } = await query
  if (error) throw error
  return data
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
 
  const { data, error } = await supabase
    .from('connections')
    .insert({ user1_id: userId, user2_id: otherId })
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