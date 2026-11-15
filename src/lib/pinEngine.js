// ─────────────────────────────────────────────────────────────────────────────
// Today's Pin — the planning engine.
//
// Pure functions: no React, no database. The only network call is the optional
// weather lookup. Everything is deterministic for (user, day, variant), so a pin
// is stable across reloads, different tomorrow, and "Different pin" gives a
// fresh one.
//
// Search history and pin state live in localStorage on the user's own device —
// nothing here is sent to your database.
//
// Put this file at: src/lib/pinEngine.js
// ─────────────────────────────────────────────────────────────────────────────

// Turn this off to skip the weather lookup entirely (plans then use time of day
// only). NOTE: Open-Meteo's free tier is for non-commercial use — check their
// current terms before launching commercially.
export const WEATHER_ENABLED = true

const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '')
const words = s => (s || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)

// ─── Small helpers ───────────────────────────────────────────────────────────

function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
// Pick among the best few candidates. Near-ties vary day to day; a clear favourite
// (say, a place you saved) usually wins. Never picks something clearly poor.
function pickWeighted(rng, scored, k = 3, temp = 2.5) {
  const top = scored.slice(0, k)
  if (!top.length) return null
  const max = top[0].score
  const weights = top.map(t => Math.exp((t.score - max) / temp))
  let r = rng() * weights.reduce((a, b) => a + b, 0)
  for (let i = 0; i < top.length; i++) { r -= weights[i]; if (r <= 0) return top[i] }
  return top[top.length - 1]
}

const ls = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v) } catch { return fallback }
  },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* private mode / full */ } },
  remove(key) { try { localStorage.removeItem(key) } catch { /* ignore */ } },
}

// ─── City clock, sunset, weather ─────────────────────────────────────────────

const CITY_TZ = { mumbai: 'Asia/Kolkata', dubai: 'Asia/Dubai' }
const CITY_COORDS = { mumbai: [19.076, 72.8777], dubai: [25.2048, 55.2708] }
// Approximate Mumbai sunset (local hour) by month — used only if the weather
// lookup fails, so plans still land on sensible hours.
const SUNSET_BY_MONTH = { mumbai: [18.5, 18.8, 18.9, 19.0, 19.1, 19.3, 19.3, 19.1, 18.8, 18.5, 18.2, 18.2] }
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function cityClock(city, now = new Date()) {
  const tz = CITY_TZ[city] || 'Asia/Kolkata'
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', weekday: 'long', hourCycle: 'h23',
  }).formatToParts(now)
  const get = t => parts.find(p => p.type === t)?.value
  const hour = (parseInt(get('hour'), 10) % 24) + parseInt(get('minute'), 10) / 60
  const dowName = get('weekday')
  return { y: +get('year'), m: +get('month'), d: +get('day'), hour, dowName, dow: DAYS.indexOf(dowName) }
}

export function dateKeyOf(clock) {
  return `${clock.y}-${String(clock.m).padStart(2, '0')}-${String(clock.d).padStart(2, '0')}`
}
export function shiftDateKey(key, days) {
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + days))
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`
}

export function weatherKind(code, temp) {
  if (code == null) return 'unknown'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95) return 'rain'
  if (temp != null && temp >= 34) return 'hot'
  if (code === 0 || code === 1) return 'clear'
  return 'cloudy'
}

// Returns { code, temp, sunset } or null. Cached for 20 minutes per session.
export async function fetchWeather(city) {
  if (!WEATHER_ENABLED) return null
  const c = CITY_COORDS[city]
  if (!c || typeof fetch !== 'function') return null
  const cacheKey = `nearmet:wx:v1:${city}`
  try {
    const cached = JSON.parse(sessionStorage.getItem(cacheKey) || 'null')
    if (cached && Date.now() - cached.t < 20 * 60 * 1000) return cached.v
  } catch { /* ignore */ }
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${c[0]}&longitude=${c[1]}` +
      `&current=temperature_2m,weather_code&daily=sunset&timezone=auto&forecast_days=1`
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 3000)
    const res = await fetch(url, { signal: ctrl.signal })
    clearTimeout(timer)
    if (!res.ok) return null
    const j = await res.json()
    const v = { code: j.current?.weather_code ?? null, temp: j.current?.temperature_2m ?? null, sunset: j.daily?.sunset?.[0] ?? null }
    try { sessionStorage.setItem(cacheKey, JSON.stringify({ t: Date.now(), v })) } catch { /* ignore */ }
    return v
  } catch { return null }
}

const PART_LABEL = { morning: 'morning', afternoon: 'afternoon', golden: 'golden hour', evening: 'evening' }
const WEATHER_LABEL = { clear: 'clear skies', cloudy: 'cloudy', rain: 'rainy', hot: 'hot out' }
const PART_EMOJI = { morning: '🌅', afternoon: '☀️', golden: '🌇', evening: '🌙' }
const WHEN_PHRASE = { morning: 'this morning', afternoon: 'this afternoon', golden: 'around golden hour today', evening: 'this evening' }

export function momentPhrase(m) {
  if (m.isTomorrow) return 'tomorrow morning'
  const adj = { clear: 'clear', rain: 'rainy', hot: 'hot', cloudy: 'cloudy' }[m.weather]
  return `a ${[adj, m.dowName, PART_LABEL[m.part]].filter(Boolean).join(' ')}`
}

// What kind of moment is it, in the city's own time?
export function getMoment({ city = 'mumbai', now = new Date(), weather = null } = {}) {
  const clock = cityClock(city, now)
  let hour = clock.hour
  let dow = clock.dow
  const isFriEvening = clock.dow === 5 && hour >= 17

  // Late at night, plan the next morning instead of a closed-up city.
  const isTomorrow = hour >= 22.5 || hour < 5
  if (hour >= 22.5) dow = (dow + 1) % 7
  if (isTomorrow) hour = 10

  let sunset = (SUNSET_BY_MONTH[city] || [])[clock.m - 1] ?? 18.5
  if (weather?.sunset && /T\d\d:\d\d/.test(weather.sunset)) {
    sunset = parseInt(weather.sunset.slice(11, 13), 10) + parseInt(weather.sunset.slice(14, 16), 10) / 60
  }

  let part
  if (hour < 11.5) part = 'morning'
  else if (hour < sunset - 1.5) part = 'afternoon'
  else if (hour < sunset + 0.4) part = 'golden'
  else part = 'evening'

  const wk = isTomorrow ? 'unknown' : weatherKind(weather?.code, weather?.temp)
  const isWeekend = dow === 0 || dow === 6 || (isFriEvening && !isTomorrow)
  const dowName = DAYS[dow]
  const label = [isTomorrow ? 'Tomorrow' : dowName, PART_LABEL[part], WEATHER_LABEL[wk]].filter(Boolean).join(' · ')

  return {
    part, weather: wk, temp: weather?.temp ?? null, hour, isWeekend, isTomorrow, dowName, label,
    emoji: wk === 'rain' ? '🌧️' : PART_EMOJI[part],
    when: isTomorrow ? 'tomorrow morning' : WHEN_PHRASE[part],
    key: `${part}|${wk}|${isWeekend ? 'we' : 'wd'}`,
  }
}

// ─── Geography ───────────────────────────────────────────────────────────────
// Approximate neighbourhood centres, used only to keep a plan's stops in the
// same part of the city. Never shown to users as distances.

const AREA_COORDS = {
  mumbai: {
    'colaba': [18.9067, 72.8147], 'cuffe parade': [18.9170, 72.8190], 'nariman point': [18.9256, 72.8242],
    'kala ghoda': [18.9285, 72.8317], 'fort': [18.9340, 72.8350], 'cst': [18.9398, 72.8355],
    'churchgate': [18.9322, 72.8264], 'marine lines': [18.9441, 72.8231], 'south mumbai': [18.9440, 72.8230],
    'crawford market': [18.9473, 72.8340], 'chowpatty': [18.9547, 72.8143], 'girgaon': [18.9540, 72.8120],
    'malabar hill': [18.9548, 72.7985], 'tardeo': [18.9702, 72.8130], 'byculla': [18.9764, 72.8326],
    'parel': [18.9980, 72.8400], 'lower parel': [18.9937, 72.8303], 'worli': [19.0176, 72.8156],
    'dadar': [19.0187, 72.8434], 'matunga': [19.0270, 72.8570], 'mahim': [19.0409, 72.8400],
    'bandra west': [19.0596, 72.8295], 'pali hill': [19.0699, 72.8294], 'khar': [19.0715, 72.8363],
    'bandra kurla complex': [19.0675, 72.8697], 'santacruz': [19.0805, 72.8355], 'vile parle': [19.1000, 72.8440],
    'juhu': [19.1075, 72.8263], 'andheri west': [19.1364, 72.8296], 'versova': [19.1315, 72.8147],
    'andheri east': [19.1136, 72.8697], 'powai': [19.1176, 72.9060], 'goregaon': [19.1663, 72.8526],
    'malad west': [19.1860, 72.8485], 'kandivali': [19.2070, 72.8520], 'borivali west': [19.2307, 72.8567],
    'borivali east': [19.2288, 72.8654], 'chembur': [19.0622, 72.8997], 'ghatkopar': [19.0860, 72.9090],
    'thane': [19.2183, 72.9781], 'vashi': [19.0771, 72.9988], 'cbd belapur': [19.0230, 73.0397],
    'kharghar': [19.0474, 73.0699], 'navi mumbai': [19.0330, 73.0297], 'alibaug': [18.6414, 72.8722],
  },
}

export function areaCoords(city, name) {
  const table = AREA_COORDS[city]
  if (!table || !name) return null
  const n = name.toLowerCase().trim()
  if (table[n]) return table[n]
  const keys = Object.keys(table).sort((a, b) => b.length - a.length)
  const hit = keys.find(k => n.includes(k))
  return hit ? table[hit] : null
}

export function distanceKm(a, b) {
  if (!a || !b) return null
  const R = 6371, rad = x => x * Math.PI / 180
  const dLat = rad(b[0] - a[0]), dLon = rad(b[1] - a[1])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// ─── What each food spot / place is ──────────────────────────────────────────

const tokenSet = (...parts) => new Set(parts.flatMap(p => Array.isArray(p) ? p.flatMap(words) : words(p)))

export function foodMeta(f) {
  const cu = (f.cuisine || '').toLowerCase()
  const nm = (f.name || '').toLowerCase()
  const blob = `${cu} ${(f.tag || '').toLowerCase()} ${nm}`
  const isCafe = /caf[eé]|coffee/.test(cu) || /caf[eé]|coffee/.test(nm)
  const isDessert = /dessert|bakery|gelato|ice ?cream|patisserie/.test(blob)
  const isStreet = /street food|momos|chaat|vada|snack/.test(blob)
  const isBar = /\bbar\b|pub|resto bar|lounge|brew/.test(cu)
  const isBrunch = isCafe || isDessert || /brunch|breakfast|south indian|udupi|irani|parsi/.test(blob)
  return { isCafe, isDessert, isStreet, isBar, isBrunch, isMeal: !isCafe && !isDessert, tokens: tokenSet(f.cuisine, f.tag, f.name) }
}

export function placeMeta(p) {
  const tags = (p.tags || []).map(t => t.toLowerCase())
  const cat = (p.category || '').toLowerCase()
  const has = (...ks) => ks.some(k => tags.includes(k) || cat === k)
  const trip = has('weekend trip', 'day trip', 'ferry ride', 'navi mumbai') || /alibaug|navi mumbai|uran/i.test(`${p.area || ''} ${p.name || ''}`)
  const indoor = cat === 'museum' || cat === 'indoor bouldering'
  return {
    trip, indoor,
    museum: cat === 'museum',
    bouldering: cat === 'indoor bouldering',
    beach: cat === 'beach',
    park: cat === 'park',
    promenade: cat === 'promenade',
    nature: cat === 'nature',
    sunset: !trip && !indoor && (has('sunset', 'sea view', 'waterfront', 'views') || cat === 'promenade' || cat === 'beach'),
    walk: !trip && !indoor && (cat === 'park' || cat === 'nature' || cat === 'promenade' || has('morning walk', 'walking trail', 'night walk', 'peaceful') || (cat === 'beach')),
    culture: has('heritage', 'history', 'art', 'museum') || cat === 'museum',
    heritage: has('heritage', 'history', 'parsi heritage', 'buddhist heritage'),
    art: has('art', 'modern art'),
    // Busy, lit evening spots only — we don't send anyone to an empty beach after dark.
    eveningWalk: !trip && (has('night walk') || (cat === 'beach' && has('street food'))),
    tokens: tokenSet(p.category, p.tags, p.name),
  }
}

// Activities (from your "Things I Want to Do" list) that a stop satisfies —
// this is how we find people who'd enjoy the same plan.
const TIME_BOUND = { 'Watch the sunset': ['golden'], 'Evening walk': ['golden', 'evening'] }

export function activitiesFor(kind, meta, moment) {
  const out = []
  if (kind === 'food') {
    if (meta.isCafe) out.push('Coffee Hopping')
    if (meta.isDessert) out.push('Explore dessert spots')
    out.push('Explore food spots')
  } else {
    if (meta.sunset) out.push('Watch the sunset')
    if (meta.beach) out.push('Play at the beach')
    if (meta.beach || meta.promenade) out.push('Evening walk')
    if (meta.park) out.push('Walk in a park', 'Picnic')
    if (meta.museum) out.push('Visit a museum')
    if (meta.art) out.push('Visit an art gallery')
    if (meta.heritage) out.push('Explore historical places')
    if (meta.bouldering) out.push('Rock climbing')
  }
  const list = [...new Set(out)]
  // Nobody watches the sunset at 10am — only count time-bound activities at the right time.
  return moment ? list.filter(a => !TIME_BOUND[a] || TIME_BOUND[a].includes(moment.part)) : list
}

const ALIASES = {
  watchthesunset: ['watchthesunriseorsunset'],
  explorefoodspots: ['explorehiddenfoodspots', 'trynewrestaurants', 'tryanewrestaurant'],
  explorehistoricalplaces: ['explorehistoricalmonuments'],
  coffeehopping: ['explorecafes'],
  attendalivemusicconcert: ['attendalivemusicgig'],
}
export function sameActivity(a, b) {
  const na = norm(a), nb = norm(b)
  if (na === nb) return true
  return (ALIASES[na] || []).includes(nb) || (ALIASES[nb] || []).includes(na)
}
const hasActivity = (list, a) => (list || []).some(x => sameActivity(x, a))
const peopleThings = p => p.city_wants || p.things || p.cityWants || []

const ACTIVITY_PHRASE = {
  'Evening walk': 'go for an evening walk', 'Coffee Hopping': 'do some coffee hopping', 'Picnic': 'go on a picnic',
  'Hiking': 'go hiking', 'Cycling': 'go cycling', 'Painting': 'paint', 'Video games': 'play video games',
  'Live match Screening': 'catch a live match screening',
}
export function activityPhrase(label) { return ACTIVITY_PHRASE[label] || (label || '').toLowerCase() }

// ─── Plan templates ──────────────────────────────────────────────────────────
// Each slot says what role it plays and what to look for (best match first,
// then fallbacks). Museum hours and daylight are why this depends on the hour.

function templateFor(m) {
  const rainy = m.weather === 'rain'
  const hot = m.weather === 'hot'
  const museumOpen = m.hour >= 10 && m.hour < 17
  const slots = []
  const add = (role, kind, ...needs) => slots.push({ role, kind, needs })

  if (m.part === 'morning') {
    add('start', 'food', 'cafe')
    if (!rainy) add('main', 'place', 'walk', 'outdoor')
    else if (museumOpen) add('main', 'place', 'indoor')
    else add('main', 'food', 'brunch', 'cafe')
    if (m.isWeekend) add('finish', 'food', 'brunch', 'cafe')
  } else if (m.part === 'afternoon') {
    add('start', 'food', 'meal', 'any')
    if ((rainy || hot) && museumOpen) add('main', 'place', 'indoor')
    else if (!rainy && !hot) add('main', 'place', 'culture', 'indoor', 'park')
    else add('main', 'food', 'dessertOrCafe', 'cafe')
    if (m.isWeekend) add('finish', 'food', 'dessertOrCafe', 'cafe')
  } else if (m.part === 'golden') {
    if (rainy) {
      add('start', 'food', 'cafe')
      add('main', 'food', 'meal', 'any')
      add('finish', 'food', 'dessert', 'dessertOrCafe')
    } else {
      if (m.isWeekend) add('start', 'food', 'cafe')
      add('main', 'place', 'sunset', 'beachOrPark')
      add('finish', 'food', 'street', 'meal')
    }
  } else { // evening
    if (!rainy && m.isWeekend) add('start', 'place', 'eveningWalk')
    add('main', 'food', 'meal', 'any')
    add('finish', 'food', 'dessertOrCafe', 'cafe')
  }
  return slots
}

function matchesNeed(need, kind, meta) {
  if (kind === 'food') {
    switch (need) {
      case 'cafe': return meta.isCafe
      case 'meal': return meta.isMeal
      case 'brunch': return meta.isBrunch
      case 'dessert': return meta.isDessert
      case 'dessertOrCafe': return meta.isDessert || meta.isCafe
      case 'street': return meta.isStreet
      case 'any': return true
      default: return false
    }
  }
  switch (need) {
    case 'sunset': return meta.sunset
    case 'beachOrPark': return meta.beach || meta.park
    case 'indoor': return meta.indoor
    case 'walk': return meta.walk
    case 'outdoor': return !meta.indoor
    case 'culture': return meta.culture
    case 'park': return meta.park
    case 'eveningWalk': return meta.eveningWalk
    default: return false
  }
}

// Optional: give any food spot or place an `hours: [open, close]` (24h clock, close may
// pass midnight, e.g. [18, 26]) and the engine will only suggest it while it's open.
// Spots without `hours` are assumed open — we can't know.
export function isOpenAt(item, hour) {
  const h = item && item.hours
  if (!Array.isArray(h) || h.length !== 2) return true
  const [open, close] = h
  return (hour >= open && hour < close) || (hour + 24 >= open && hour + 24 < close)
}
const ROLE_OFFSET = { start: 0, main: 0.5, finish: 1.5 }

// Hard rules that apply to every candidate, whatever the slot.
function allowed(kind, item, meta, m, role) {
  if (!item || item.id == null || !item.name) return false
  if (!isOpenAt(item, m.hour + (ROLE_OFFSET[role] || 0))) return false
  if (kind === 'food') return !(meta.isBar && m.part !== 'evening')
  if (meta.trip) return false
  if (m.weather === 'rain' && !meta.indoor) return false
  if (m.part === 'evening' && !meta.indoor && !meta.eveningWalk) return false
  if (meta.museum && !(m.hour >= 10 && m.hour < 17)) return false
  if (m.weather === 'hot' && m.part === 'afternoon' && !meta.indoor) return false
  return true
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

const W = {
  saved: 8, similarSaved: 3, thing: 4, search: 4, interest: 2.5, dismissed: -6, noImg: -1.5,
  proxAnchor: [4, 2, 0, -3], proxUser: [3, 1, 0, -3],
}
const proxBonus = (km, table) => km == null ? 0 : km <= 3 ? table[0] : km <= 6 ? table[1] : km <= 9 ? table[2] : table[3]

const INTEREST_HINTS = {
  photography: ['sunset', 'views', 'art', 'heritage'], painting: ['art'], digitalart: ['art'],
  travel: ['heritage', 'history', 'nature', 'museum', 'caves'], fitness: ['active', 'trekking', 'bouldering'],
  sports: ['active'], books: ['museum'], philosophy: ['peaceful'], psychology: ['peaceful'],
  animals: ['park', 'nature'], gardening: ['park', 'nature'], interiordesign: ['heritage', 'art', 'bungalow'],
  fashion: ['art'], food: ['street', 'gem', 'favorite', 'visit', 'rated'],
}

function buildContext(input) {
  const { user = {}, people = [], searches = [], dismissed = {}, scoreFood, city, moment = null, recent = {} } = input
  const savedFood = new Set(user.saved_food_places || [])
  const savedPlaces = new Set((user.saved_explore_places || []).map(String))
  const things = user.things || user.city_wants || []
  const interestKeys = (user.interests || []).map(norm)
  const popFood = {}, popPlace = {}
  people.forEach(p => {
    const w = 1 + Math.min(p._score || 0, 10) / 5
    ;(p.saved_food_places || []).forEach(n => { popFood[n] = (popFood[n] || 0) + w })
    ;(p.saved_explore_places || []).forEach(id => { popPlace[String(id)] = (popPlace[String(id)] || 0) + w })
  })
  const searchTokens = { food: new Set(), places: new Set() }
  searches.forEach(s => words(s.q).filter(w => w.length >= 3).forEach(w => searchTokens[s.kind === 'places' ? 'places' : 'food'].add(w)))
  return {
    user, city, moment, recent, savedFood, savedPlaces, things, interestKeys, popFood, popPlace, searchTokens, dismissed,
    userCoords: areaCoords(city, user.location), scoreFood,
  }
}

function avgPrice(str) {
  const nums = (str || '').match(/\d+/g)
  if (!nums) return null
  return nums.map(Number).reduce((a, b) => a + b, 0) / nums.length
}

function scoreCandidate(kind, item, meta, ctx, anchorCoords) {
  let s = 0
  const hay = `${item.name} ${item.cuisine || ''} ${item.tag || ''} ${item.tryThis || ''} ${(item.tags || []).join(' ')} ${item.category || ''}`.toLowerCase()
  if (kind === 'food') {
    try { s += Math.min(10, (ctx.scoreFood ? ctx.scoreFood(item, ctx.user.cuisines, ctx.user.budget) : (item.rating || 0)) / 4) } catch { /* ignore */ }
    if (ctx.savedFood.has(item.name)) s += W.saved
    else if (ctx.savedFoodCuisineSet.has(norm(item.cuisine))) s += W.similarSaved
    s += Math.min(5, ctx.popFood[item.name] || 0)
    s += Math.max(0, Math.min(3, ((item.rating || 4) - 4) * 4))
    // These are casual hangs — don't default people into a tasting menu unless they asked for premium.
    const avg = avgPrice(item.price)
    if (ctx.user.budget !== 'premium' && avg != null) { if (avg > 2500) s -= 9; else if (avg > 1800) s -= 4 }
  } else {
    if (ctx.savedPlaces.has(String(item.id))) s += W.saved
    else if (ctx.savedPlaceCategorySet.has(norm(item.category))) s += W.similarSaved
    s += Math.min(5, ctx.popPlace[String(item.id)] || 0)
  }
  const acts = activitiesFor(kind, meta, ctx.moment)
  s += Math.min(2, acts.filter(a => a !== 'Explore food spots' && hasActivity(ctx.things, a)).length) * W.thing
  // Interests only steer places (a love of Books says nothing about which café) — except "Food" for food.
  const hints = ctx.interestKeys.filter(k => kind === 'food' ? k === 'food' : k !== 'food').flatMap(k => INTEREST_HINTS[k] || [])
  if (hints.some(h => meta.tokens.has(h))) s += W.interest
  const st = ctx.searchTokens[kind === 'food' ? 'food' : 'places']
  s += Math.min(2, [...st].filter(t => hay.includes(t)).length) * W.search
  if (!item.img) s += W.noImg
  const dKey = `${kind === 'food' ? 'food' : 'place'}:${item.id}`
  if (ctx.dismissed[dKey]) s += W.dismissed
  // Keep it fresh: lean away from spots in the last few days' pins.
  const back = ctx.recent[dKey]
  if (back != null) s += back === 1 ? -5 : back <= 3 ? -3 : -1.5
  const coords = areaCoords(ctx.city, kind === 'food' ? item.hood : item.area)
  if (anchorCoords) s += proxBonus(distanceKm(coords, anchorCoords), W.proxAnchor)
  else s += proxBonus(distanceKm(coords, ctx.userCoords), W.proxUser)
  return s
}

const coordsOfPick = (ctx, p) => areaCoords(ctx.city, p.kind === 'food' ? p.item.hood : p.item.area)

function nearbyCount(ctx, pool, coords) {
  if (!coords) return Infinity
  let n = 0
  for (const f of pool.food) { const km = distanceKm(areaCoords(ctx.city, f.hood), coords); if (km != null && km <= 8) n++ }
  for (const p of pool.places) {
    if (placeMeta(p).trip) continue
    const km = distanceKm(areaCoords(ctx.city, p.area), coords); if (km != null && km <= 8) n++
  }
  return n
}

function pickForSlot(slot, ctx, pool, m, rng, used, placed) {
  const anchor = placed[0] || null
  const anchorCoords = anchor ? coordsOfPick(ctx, anchor) : null
  const placedCoords = placed.map(p => coordsOfPick(ctx, p)).filter(Boolean)
  const items = slot.kind === 'food' ? pool.food : pool.places
  const metaOf = slot.kind === 'food' ? foodMeta : placeMeta
  for (const maxKm of placedCoords.length ? [9, 12] : [Infinity]) {
    for (const need of slot.needs) {
      const scored = []
      for (const item of items) {
        if (used.has(`${slot.kind}:${item.id}`) || used.has(`name:${norm(item.name)}`)) continue
        const meta = metaOf(item)
        if (!allowed(slot.kind, item, meta, m, slot.role) || !matchesNeed(need, slot.kind, meta)) continue
        if (placedCoords.length) {
          const c = areaCoords(ctx.city, slot.kind === 'food' ? item.hood : item.area)
          if (c && placedCoords.some(pc => distanceKm(c, pc) > maxKm)) continue
        }
        let score = scoreCandidate(slot.kind, item, meta, ctx, anchorCoords)
        // Choosing the main stop? Prefer somewhere with a neighbourhood around it, so the rest of the plan can exist.
        if (!anchorCoords && nearbyCount(ctx, pool, areaCoords(ctx.city, slot.kind === 'food' ? item.hood : item.area)) < 4) score -= 5
        scored.push({ item, meta, score })
      }
      scored.sort((a, b) => b.score - a.score)
      const pick = pickWeighted(rng, scored)
      if (pick) return { kind: slot.kind, role: slot.role, item: pick.item, meta: pick.meta, score: pick.score }
    }
  }
  return null
}

// ─── Companions + openers ────────────────────────────────────────────────────

const prettify = s => (s || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

function promptHook(person, funQuestions) {
  if (person.privacy_settings?.hide_prompts) return null
  let entries = []
  const pr = person.prompts
  if (Array.isArray(pr)) entries = pr.filter(p => p && p.q && p.a).map(p => [p.q, p.a])
  else if (pr && typeof pr === 'object') entries = Object.entries(pr)
  entries = entries.filter(([q, a]) => funQuestions.includes(q) && typeof a === 'string' && a.trim() && a.trim().length <= 40)
  return entries.length ? entries[0][1].trim() : null
}

export function buildOpener({ person, stop, when, sharedActivity, sharedThing, sharedInterest, funQuestions = [] }) {
  const first = (person.name || '').split(' ')[0] || 'there'
  const hook = promptHook(person, funQuestions)
  const lead = `Hey ${first}! ${hook ? `I saw you're into ${hook} 😄 ` : ''}`
  let text
  if (sharedActivity) text = `${lead}I'm heading to ${stop.name} ${when} — looks like you also want to ${activityPhrase(sharedActivity)}. Want to join?`
  else if (sharedThing) text = `${lead}I'm heading to ${stop.name} ${when}. Looks like we both want to ${activityPhrase(sharedThing)} — want to join?`
  else if (sharedInterest) text = `${lead}We both like ${prettify(sharedInterest)}. I'm heading to ${stop.name} ${when} — want to join?`
  else text = `${lead}I'm heading to ${stop.name} ${when} and thought you might be up for it. Want to join?`
  return text.length > 240 ? text.slice(0, 237).trimEnd() + '…' : text
}

function pickCompanions({ people, user, planActivities, mainStop, when, blockedIds, funQuestions, rng, limit = 3 }) {
  const blocked = new Set(blockedIds || [])
  const myThings = user.things || user.city_wants || []
  const myInterests = (user.interests || [])
  const ranked = []
  for (const p of people) {
    if (!p || !p.id || blocked.has(p.id) || p.id === user.id || !p.name) continue
    const their = peopleThings(p)
    const overlap = planActivities.filter(a => hasActivity(their, a))
    const sharedThingsList = their.filter(t => hasActivity(myThings, t))
    const sharedThings = sharedThingsList.length
    const sharedInts = (p.interests || []).filter(i => myInterests.some(mi => norm(mi) === norm(i)))
    if (!overlap.length && !(sharedThings >= 1 || sharedInts.length >= 2)) continue
    const score = overlap.length * 5 + sharedThings * 2 + sharedInts.length * 1.5 + (p._score || 0) * 0.3 +
      ((p.photo_urls || []).filter(Boolean).length ? 1 : 0) + rng() * 0.5
    ranked.push({ person: p, overlap, sharedThingsList, sharedInts, score })
  }
  ranked.sort((a, b) => (b.overlap.length > 0) - (a.overlap.length > 0) || b.score - a.score)
  return ranked.slice(0, limit).map(r => {
    const sharedActivity = r.overlap[0] || null
    const sharedThing = !sharedActivity && r.sharedThingsList[0] ? r.sharedThingsList[0] : null
    const sharedInterest = !sharedActivity && !sharedThing && r.sharedInts[0] ? r.sharedInts[0] : null
    return {
      person: r.person, sharedActivity, sharedThing, sharedInterest,
      opener: buildOpener({ person: r.person, stop: mainStop, when, sharedActivity, sharedThing, sharedInterest, funQuestions }),
    }
  })
}

// ─── Wildcard ────────────────────────────────────────────────────────────────

const ADJACENT = {
  painting: ['Attend a pottery workshop', 'Visit an art gallery'], photography: ['Visit an art gallery', 'Explore historical places', 'Watch the sunset'],
  music: ['Attend a live music concert', 'Learn to play an instrument', 'Sing karaoke'], singing: ['Sing karaoke', 'Attend a live music concert'],
  dance: ['Attend a dance workshop', 'Attend a DJ night'], books: ['Discuss a Novel', 'Attend a Shayari event'], poetry: ['Attend a Shayari event', 'Discuss a Novel'],
  standupcomedy: ['Attend a comedy show'], fitness: ['Cycling', 'Hiking', 'Go for a run', 'Rock climbing'], sports: ['Play football', 'Play cricket', 'Play badminton', 'Live match Screening'],
  formula1: ['Live match Screening', 'Play board games'], food: ['Explore dessert spots', 'Coffee Hopping'], travel: ['Explore historical places', 'Visit a museum', 'Hiking'],
  animals: ['Walk in a park', 'Picnic'], gardening: ['Walk in a park', 'Join a tree plantation drive', 'Picnic'], pottery: ['Attend a pottery workshop'],
  movies: ['Live match Screening', 'Attend a comedy show'], tvseries: ['Play board games', 'Attend a comedy show'], anime: ['Play board games', 'Go to an arcade'],
  psychology: ['Discuss a Novel', 'Play chess'], philosophy: ['Discuss a Novel', 'Play chess'], interiordesign: ['Visit an art gallery', 'Explore historical places'],
}

function pickWildcard({ user, people, activities, dismissed, exclude = [], rng }) {
  const myThings = user.things || user.city_wants || []
  const interestKeys = (user.interests || []).map(norm)
  const scored = []
  for (const a of activities) {
    if (hasActivity(myThings, a) || hasActivity(exclude, a)) continue
    const count = people.filter(p => hasActivity(peopleThings(p), a)).length
    if (count < 1) continue
    const via = interestKeys.find(k => (ADJACENT[k] || []).includes(a))
    let score = (via ? 3 : 0) + Math.min(count, 6) * 0.8
    if (dismissed[`act:${a}`]) score -= 6
    scored.push({ activity: a, count, via, score })
  }
  scored.sort((a, b) => b.score - a.score)
  const pick = pickWeighted(rng, scored)
  return pick ? { activity: pick.activity, peopleCount: pick.count, viaInterest: pick.via || null } : null
}

// ─── The pin ─────────────────────────────────────────────────────────────────

export function buildPin(input) {
  const {
    userId, city = 'mumbai', dateKey, variant = 0, moment, user = {}, food = [], places = [],
    people = [], blockedIds = [], searches = [], dismissed = {}, activities = [], funQuestions = [], scoreFood, recent = {},
  } = input
  const base = `${userId || 'anon'}|${dateKey}|${variant}|${city}`
  const rngFor = label => mulberry32(hashString(`${base}|${label}`))

  const ctx = buildContext({ user, people, searches, dismissed, scoreFood, city, moment, recent })
  ctx.savedFoodCuisineSet = new Set(food.filter(f => ctx.savedFood.has(f.name)).map(f => norm(f.cuisine)))
  ctx.savedPlaceCategorySet = new Set(places.filter(p => ctx.savedPlaces.has(String(p.id))).map(p => norm(p.category)))

  const pool = { food, places }
  const slots = templateFor(moment)
  const used = new Set()
  const picks = new Array(slots.length).fill(null)

  const mainIdx = slots.findIndex(s => s.role === 'main')
  const main = pickForSlot(slots[mainIdx], ctx, pool, moment, rngFor('main'), used, [])
  if (!main) return null
  picks[mainIdx] = main
  used.add(`${main.kind}:${main.item.id}`); used.add(`name:${norm(main.item.name)}`)
  const placed = [main]
  slots.forEach((slot, i) => {
    if (i === mainIdx) return
    const p = pickForSlot(slot, ctx, pool, moment, rngFor(`slot${i}`), used, placed)
    if (p) { picks[i] = p; placed.push(p); used.add(`${p.kind}:${p.item.id}`); used.add(`name:${norm(p.item.name)}`) }
  })

  const stops = picks.filter(Boolean).map(p => {
    const isFood = p.kind === 'food'
    const area = isFood ? p.item.hood : p.item.area
    const sub = isFood ? (p.item.tag || p.item.cuisine) : (p.item.tags || []).find(t => t !== p.item.category && t.toLowerCase() !== (area || '').toLowerCase()) || p.item.category
    return {
      kind: p.kind, role: p.role, id: p.item.id, name: p.item.name, area, img: p.item.img || '',
      line: [area, sub].filter(Boolean).join(' · '), activities: activitiesFor(p.kind, p.meta, moment), item: p.item,
    }
  })
  const mainStop = stops.find(s => s.role === 'main') || stops[0]

  // Activities this plan satisfies, most specific first (the main stop's own).
  const planActivities = [...new Set([...mainStop.activities, ...stops.flatMap(s => s.activities)])]
    .sort((a, b) => (a === 'Explore food spots') - (b === 'Explore food spots'))

  const companions = pickCompanions({
    people, user: { ...user, id: userId || user.id }, planActivities, mainStop, when: moment.when,
    blockedIds, funQuestions, rng: rngFor('companions'),
  })
  const wildcard = pickWildcard({ user, people, activities, dismissed, exclude: planActivities, rng: rngFor('wildcard') })

  // The "because" line: the strongest one or two reasons that actually apply.
  const reasons = []
  const savedStop = stops.find(s => (s.kind === 'food' ? ctx.savedFood.has(s.name) : ctx.savedPlaces.has(String(s.id))))
  if (savedStop) reasons.push({ w: 10, t: `you saved ${savedStop.name}` })
  const thing = planActivities.find(a => a !== 'Explore food spots' && hasActivity(ctx.things, a))
  if (thing) reasons.push({ w: 8, t: `“${thing}” is on your list` })
  const st = [...ctx.searchTokens.food, ...ctx.searchTokens.places]
  const searchHit = st.find(t => stops.some(s => `${s.name} ${s.item.cuisine || ''} ${s.item.tag || ''} ${s.item.tryThis || ''} ${(s.item.tags || []).join(' ')}`.toLowerCase().includes(t)))
  if (searchHit) reasons.push({ w: 7, t: `you searched for “${searchHit}”` })
  const hints = ctx.interestKeys.find(k => (INTEREST_HINTS[k] || []).some(h => stops.some(s =>
    s.kind === 'place' ? k !== 'food' && placeMeta(s.item).tokens.has(h) : k === 'food' && foodMeta(s.item).tokens.has(h))))
  if (hints) reasons.push({ w: 5, t: `you're into ${prettify((user.interests || []).find(i => norm(i) === hints))}` })
  const pop = stops.find(s => (s.kind === 'food' ? ctx.popFood[s.name] : ctx.popPlace[String(s.id)]) >= 2)
  if (pop) reasons.push({ w: 4, t: `${pop.name} is popular with people like you` })
  reasons.sort((a, b) => b.w - a.w)
  const top = reasons.slice(0, 2).map(r => r.t)
  const reasonLine = top.length ? `Because ${top.join(' and ')}` : `Picked for ${momentPhrase(moment)}`

  return {
    key: `${dateKey}:${variant}`, dateKey, variant, moment, stops, mainStop, wildcard,
    companions, isGroup: companions.length >= 2, planActivities, reasonLine,
  }
}

// A plain-JSON copy of a pin, safe to store. Once someone commits to a plan
// (says they're going / sends an invite) we freeze this for the day, so the plan
// they agreed to doesn't change underneath them when the hour or their saves change.
export function serializePin(pin) {
  if (!pin) return null
  return {
    key: pin.key, variant: pin.variant, reasonLine: pin.reasonLine,
    moment: { label: pin.moment.label, emoji: pin.moment.emoji, part: pin.moment.part },
    stops: pin.stops.map(s => ({ kind: s.kind, id: s.id, role: s.role, name: s.name, area: s.area, img: s.img, line: s.line })),
    mainStop: { kind: pin.mainStop.kind, id: pin.mainStop.id, name: pin.mainStop.name, area: pin.mainStop.area },
    wildcard: pin.wildcard,
    companions: pin.companions.map(c => ({
      id: c.person.id, name: c.person.name, photo: (c.person.photo_urls || []).filter(Boolean)[0] || '',
      sharedActivity: c.sharedActivity, sharedThing: c.sharedThing, sharedInterest: c.sharedInterest, opener: c.opener,
    })),
  }
}

export const pinStopKey = s => `${s.kind === 'food' ? 'food' : 'place'}:${s.id}`

// ─── Local state: searches, pin status, dismissals, follow-ups ───────────────

const K = {
  searches: uid => `nearmet:searches:v1:${uid || 'anon'}`,
  gapDismissed: uid => `nearmet:gapdismissed:v1:${uid || 'anon'}`,
  pin: (uid, key) => `nearmet:pin:v1:${uid || 'anon'}:${key}`,
  dismissed: uid => `nearmet:pindismissed:v1:${uid || 'anon'}`,
}
const DAY = 24 * 60 * 60 * 1000

export function recordSearch(userId, query, resultCount, kind = 'food') {
  const q = (query || '').trim().toLowerCase()
  if (q.length < 3) return
  const list = ls.get(K.searches(userId), [])
  const last = list[list.length - 1]
  // Typing "vegan" fires "veg", "vega", "vegan" — keep only the final one.
  if (last && last.kind === kind && Date.now() - last.t < 20 * 1000 && q.startsWith(last.q.slice(0, 3)) && (q.startsWith(last.q) || last.q.startsWith(q))) list.pop()
  list.push({ q, n: resultCount, kind, t: Date.now() })
  ls.set(K.searches(userId), list.slice(-40))
}
export function readSearches(userId, maxAgeDays = 14) {
  const cutoff = Date.now() - maxAgeDays * DAY
  return ls.get(K.searches(userId), []).filter(s => s && s.t >= cutoff)
}
export function clearSearchHistory(userId) {
  ls.remove(K.searches(userId)); ls.remove(K.gapDismissed(userId))
}
// The most recent thing the user searched for that came up empty (and hasn't
// since been found or dismissed) — this is the "know a spot? drop a pin" prompt.
export function findGap(userId) {
  const dismissed = new Set(ls.get(K.gapDismissed(userId), []))
  const list = readSearches(userId).slice().reverse()
  const seen = new Set()
  for (const s of list) {
    const id = `${s.kind}:${s.q}`
    if (seen.has(id)) continue
    seen.add(id)
    if (s.n === 0 && !dismissed.has(id)) return { q: s.q, kind: s.kind }
  }
  return null
}
export function dismissGap(userId, gap) {
  const d = ls.get(K.gapDismissed(userId), [])
  d.push(`${gap.kind}:${gap.q}`)
  ls.set(K.gapDismissed(userId), d.slice(-40))
}

export function loadPinState(userId, dateKey) {
  return {
    variant: 0, status: 'shown', invitedIds: [], shownVariants: [], followupDone: false, stop: null, snapshot: null, stopKeys: [],
    ...ls.get(K.pin(userId, dateKey), {}),
  }
}
export function savePinState(userId, dateKey, patch) {
  const next = { ...loadPinState(userId, dateKey), ...patch }
  ls.set(K.pin(userId, dateKey), next)
  return next
}
export function loadDismissed(userId) {
  const cutoff = Date.now() - 14 * DAY
  const raw = ls.get(K.dismissed(userId), {})
  return Object.fromEntries(Object.entries(raw).filter(([, t]) => t >= cutoff))
}
export function addDismissed(userId, keys) {
  const cur = loadDismissed(userId)
  keys.forEach(k => { cur[k] = Date.now() })
  ls.set(K.dismissed(userId), cur)
  return cur
}

// Spots shown in the last few days' pins -> how many days ago (1 = yesterday).
export function loadRecentStops(userId, todayKey, days = 5) {
  const out = {}
  for (let back = 1; back <= days; back++) {
    const st = ls.get(K.pin(userId, shiftDateKey(todayKey, -back)), null)
    ;(st?.stopKeys || []).forEach(k => { if (out[k] == null) out[k] = back })
  }
  return out
}

// A plan the user said yes to on a previous day and hasn't reviewed yet.
export function findFollowup(userId, todayKey) {
  for (let back = 1; back <= 3; back++) {
    const key = shiftDateKey(todayKey, -back)
    const st = ls.get(K.pin(userId, key), null)
    if (st && (st.status === 'going' || st.status === 'invited') && st.stop && !st.followupDone) return { dateKey: key, stop: st.stop }
  }
  return null
}