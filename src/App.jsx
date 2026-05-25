import { useState } from "react";
import "./App.css";

// ── CITY DATA ────────────────────────────────────────────────────────────────

const CITY_DATA = {
  nyc: {
    label: "New York City",
    currency: "$",
    currencySymbol: "$",
    neighborhoods: ["Manhattan","Brooklyn","Queens","Bronx","Staten Island"],
    food: [
      { id:1, name:"Bunna Cafe", type:"Ethiopian", hood:"Bushwick, BK", tag:"Hidden gem", price:"$$ · $28 for two", rating:4.8, searches:47, trend:"+34%", img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=600&q=80", menu:["Injera platter","Tibs","Shiro","Kitfo","Tej honey wine"], desc:"Authentic Ethiopian in a warm communal setting. The injera platters are the real deal — share everything." },
      { id:2, name:"Xi'an Famous Foods", type:"Northwestern Chinese", hood:"Flushing, Queens", tag:"Affordable", price:"$ · $14 for two", rating:4.7, searches:134, trend:"+12%", img:"https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80", menu:["Spicy cumin lamb noodles","Liang pi cold skin noodles","Stewed pork burger","Hot & sour soup dumplings"], desc:"Hand-pulled noodles from China's northwest. The lamb noodles are worth every minute of the queue." },
      { id:3, name:"Abraço Espresso", type:"Cafe", hood:"East Village, Manhattan", tag:"Beloved local", price:"$ · $8 for two", rating:4.9, searches:89, trend:"+8%", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", menu:["Espresso","Cortado","Olive oil cake","Seasonal pastry"], desc:"Tiny, perfect coffee bar. The olive oil cake is legendary. Come early — it sells out by noon." },
      { id:4, name:"Tortilleria Nixtamal", type:"Mexican", hood:"Corona, Queens", tag:"Hidden gem", price:"$ · $18 for two", rating:4.8, searches:62, trend:"+22%", img:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80", menu:["Handmade tortillas","Tamales","Mole verde","Horchata"], desc:"Stone-ground masa made fresh daily. The best tortillas in the five boroughs, full stop." },
      { id:5, name:"Superiority Burger", type:"Vegetarian", hood:"East Village, Manhattan", tag:"Trending", price:"$ · $16 for two", rating:4.6, searches:78, trend:"+41%", img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80", menu:["Superiority burger","Sloppy Dave","Greek salad","Butterscotch pudding"], desc:"The vegetarian burger that convinced meat-eaters. Don't leave without the butterscotch pudding." },
      { id:6, name:"Saravana Bhavan", type:"South Indian", hood:"Murray Hill, Manhattan", tag:"Family fav", price:"$$ · $22 for two", rating:4.7, searches:103, trend:"+15%", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80", menu:["Masala dosa","Idli sambar","Thali","Filter coffee","Pongal"], desc:"Chennai institution now in NYC. The thali is a full meal for under $12. Filter coffee is non-negotiable." },
    ],
    events: [
      { id:1, name:"Jazz Night at Nowadays", date:"Sat May 31", loc:"Ridgewood, Queens", badge:"Free entry", emo:"🎷", host:"Marcus T.", going:34 },
      { id:2, name:"Sunrise Run Club", date:"Sun Jun 1", loc:"Prospect Park, BK", badge:"Outdoors · Free", emo:"🏃", host:"Priya K.", going:12 },
      { id:3, name:"Dumpling Making Class", date:"Sat May 31", loc:"Flushing, Queens", badge:"Paid · $25", emo:"🥟", host:"Chef Lin", going:8 },
      { id:4, name:"Brooklyn Night Bazaar", date:"Fri May 30", loc:"Greenpoint, BK", badge:"Free", emo:"🛍️", host:"BK Collective", going:210 },
      { id:5, name:"Rooftop Photography Walk", date:"Sun Jun 1", loc:"LIC, Queens", badge:"Free", emo:"📷", host:"Soph N.", going:18 },
      { id:6, name:"Salsa Dancing — Beginners", date:"Thu Jun 5", loc:"Bushwick, BK", badge:"Paid · $15", emo:"💃", host:"Carla M.", going:22 },
    ],
    people: [
      { id:1, name:"Priya", age:26, hood:"Astoria, Queens", ini:"P", color:"#e8f5e9", tc:"#2d6a4f", interests:["Football","Books","Cooking"], prompts:[{q:"What recent incident changed your perspective?",a:"Watching a documentary on fishermen in Kerala made me slow down and think about how much I take convenience for granted."},{q:"If you were mayor for a day, what would you change?",a:"I'd make the subway free before 8am and after 9pm. The people who need it most often travel at those hours."}], cityWant:"Watch a new film at an indie cinema — any genre, just no superhero movies", music:"Arooj Aftab — Vulture Prince", film:"All We Imagine as Light" },
      { id:2, name:"Marcus", age:29, hood:"Crown Heights, BK", ini:"M", color:"#e3f2fd", tc:"#1565c0", interests:["Jazz","Urban history","Running"], prompts:[{q:"What's something you've been curious about recently?",a:"Why every city seems to have a jazz moment and then loses it. I keep wondering what kills that culture and if it can come back."},{q:"What myth would you change society's view on?",a:"That gentrification is inevitable. It is not a weather pattern. It is a series of deliberate policy choices."}], cityWant:"Sunset walk across the Brooklyn Bridge — lived here 4 years, never done it", music:"Thelonious Monk — Monk's Dream", film:"MLK/FBI" },
      { id:3, name:"Sofia", age:24, hood:"Williamsburg, BK", ini:"S", color:"#fce4ec", tc:"#c62828", interests:["Architecture","Street food","Photography"], prompts:[{q:"What's something you've been curious about recently?",a:"Why the best street food is always near a market. I've started testing this theory in every city I visit."},{q:"What school activity do you still miss?",a:"Art class — sitting beside someone doing something completely different while both of you quietly made things."}], cityWant:"Find the best banh mi in the five boroughs — methodically, with a notebook", music:"Caroline Polachek — Desire, I Want to Turn Into You", film:"The Taste of Things" },
    ],
    offers: [
      { id:1, name:"The Breslin", discount:"20% OFF", img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80" },
      { id:2, name:"Superiority Burger", discount:"15% OFF", img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80" },
      { id:3, name:"Abraço Espresso", discount:"Buy 2 get 1", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80" },
    ],
    agentRestaurants: [
      { id:1, name:"Bunna Cafe", searches:47, trend:"+34%", type:"Ethiopian", hood:"Bushwick", menu:["Injera platter","Tibs","Shiro","Kitfo","Tej honey wine"], insights:[ {color:"green",title:"Demand gap spotted",body:"47 people searched 'Ethiopian food Bushwick' last month — only 2 results surfaced. You're one of them. Push discovery with better photos and an updated menu.",action:"Boost listing"}, {color:"amber",title:"Tej honey wine underperforming",body:"Your 'Tej honey wine' has a 1.2% click rate vs. your 8% menu average. Low-light photo and no description. Try a rewrite and a better image.",action:"Update photo"}, {color:"purple",title:"Trending: vegan injera",body:"Searches for 'vegan Ethiopian' in Brooklyn are up 180% in 3 weeks. Your Shiro dish qualifies — add a vegan tag to the listing.",action:"Add vegan tag"}, {color:"coral",title:"Weekend surge expected",body:"A 3,000-person outdoor festival is happening 0.8km away this Saturday. Pre-event dinner demand window: 5–7pm. Consider extending hours.",action:"Extend hours"} ], report:"Bunna Cafe is performing well in a low-competition search category — 47 monthly searches with only 2 competing results means high capture potential. Your biggest quick win is updating the Tej honey wine listing with better creative. Adding a vegan tag to Shiro could open a fast-growing search segment with zero additional cost." },
      { id:2, name:"Xi'an Famous Foods", searches:134, trend:"+12%", type:"Chinese", hood:"Flushing", menu:["Spicy cumin lamb noodles","Liang pi cold skin noodles","Stewed pork burger","Hot & sour soup dumplings"], insights:[ {color:"green",title:"High search volume, high competition",body:"134 monthly searches for Northwestern Chinese in Flushing — but 11 competing listings. Your advantage is authenticity signals. Push 'hand-pulled' and 'Xi'an-style' as keywords.",action:"Update keywords"}, {color:"amber",title:"Stewed pork burger — low discovery",body:"Only 3.1% of visitors who view your listing click on the pork burger. It's a signature item. Consider featuring it first on your menu.",action:"Reorder menu"}, {color:"purple",title:"Trending: cold noodles",body:"'Cold noodles NYC' searches up 290% in summer months. Your Liang pi is perfectly positioned — needs its own highlight section.",action:"Create highlight"}, {color:"coral",title:"Lunch gap — 12–2pm",body:"Discovery traffic for your hood peaks 12–2pm but your listing shows 'closed for lunch'. If you're open, update your hours — you're missing high-intent traffic.",action:"Fix hours"} ], report:"Xi'an Famous Foods has the highest raw search volume of any listing in Flushing's Northwestern Chinese category, but faces the most competition. The strategy is differentiation — leaning into 'hand-pulled' authenticity language and seasonal cold noodle promotion. Fixing lunch hours alone could recover an estimated 20% of missed discovery traffic." },
    ],
  },
  mumbai: {
    label: "Mumbai",
    currency: "₹",
    currencySymbol: "₹",
    neighborhoods: ["Bandra","Colaba","Juhu","Andheri","Lower Parel","Dadar","Worli"],
    food: [
      { id:1, name:"Café Mondegar", type:"Café & Bar", hood:"Colaba", tag:"Iconic", price:"₹₹ · ₹900 for two", rating:4.6, searches:112, trend:"+18%", img:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", menu:["Chicken tikka pizza","Cold coffee","Cheese burst sandwich","Beer","Jukebox vibes"], desc:"Colaba institution since 1932. The murals, the jukebox, the cold coffee. Come for lunch, stay till midnight." },
      { id:2, name:"Haji Ali Juice Centre", type:"Juice & Snacks", hood:"Haji Ali", tag:"Hidden gem", price:"$ · ₹200 for two", rating:4.9, searches:203, trend:"+9%", img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80", menu:["Mixed fruit juice","Milkshakes","Fruit chaat","Fresh coconut water"], desc:"The pilgrimage that has nothing to do with religion. Fresh juices served with a view of the dargah across the water." },
      { id:3, name:"Bastian", type:"Seafood & Bar", hood:"Bandra West", tag:"Trending", price:"₹₹₹ · ₹2,800 for two", rating:4.7, searches:178, trend:"+27%", img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", menu:["Butter garlic prawns","Lobster bisque","Fish tacos","Truffle fries","Cocktails"], desc:"Bandra's most talked-about seafood spot. The butter garlic prawns alone justify the tab. Book two weeks ahead." },
      { id:4, name:"Bombay Canteen", type:"Modern Indian", hood:"Lower Parel", tag:"Must visit", price:"₹₹ · ₹1,600 for two", rating:4.8, searches:145, trend:"+22%", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80", menu:["Pork vindaloo","Kokum gimlet","Parsi akuri","Goan fish curry","Meetha paan dessert"], desc:"India's regional cuisines reimagined without apology. The cocktail menu is as thoughtful as the food." },
      { id:5, name:"Bademiya", type:"Street Food", hood:"Colaba Causeway", tag:"Late night", price:"$ · ₹350 for two", rating:4.7, searches:88, trend:"+6%", img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=600&q=80", menu:["Seekh kebab rolls","Chicken tikka","Mutton boti","Roomali roti","Masala chai"], desc:"Open till 3am. The seekh kebab roll is what Bombay nights taste like. Queue is part of the experience." },
      { id:6, name:"Prithvi Café", type:"Café & Theater", hood:"Juhu", tag:"Hidden gem", price:"$ · ₹400 for two", rating:4.8, searches:67, trend:"+31%", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", menu:["Irani chai","Keema pav","Bun maska","Cold coffee","Almond cake"], desc:"The most literary café in Mumbai. Attached to Prithvi Theatre — come for the play, stay for the chai and the crowd." },
    ],
    events: [
      { id:1, name:"Koli Seafood Festival", date:"Sat May 31", loc:"Versova Beach, Andheri", badge:"Free entry", emo:"🦐", host:"Koli Fishermen Association", going:420 },
      { id:2, name:"Early Morning Yoga — Juhu Beach", date:"Sun Jun 1", loc:"Juhu Beach", badge:"Free · Outdoors", emo:"🧘", host:"Ananya S.", going:28 },
      { id:3, name:"Indie Music Night", date:"Fri May 30", loc:"antiSOCIAL, Lower Parel", badge:"Paid · ₹400", emo:"🎸", host:"SOCIAL Events", going:95 },
      { id:4, name:"Bandra Flea Market", date:"Sun Jun 1", loc:"Mount Mary Steps, Bandra", badge:"Free", emo:"🛍️", host:"BKC Collective", going:340 },
      { id:5, name:"Kathak Showcase — Open House", date:"Sat May 31", loc:"Prithvi Theatre, Juhu", badge:"Pay what you want", emo:"💃", host:"Aditi Dance Academy", going:64 },
      { id:6, name:"Dawn Running Club — Carter Road", date:"Sun Jun 1", loc:"Carter Road, Bandra", badge:"Free", emo:"🏃", host:"Raunak M.", going:19 },
    ],
    people: [
      { id:1, name:"Aisha", age:25, hood:"Bandra West", ini:"A", color:"#fff3e0", tc:"#e65100", interests:["Theatre","Street food","Jazz"], prompts:[{q:"What recent incident changed your perspective?",a:"Watching the Koli fisherwomen sell their catch at 5am in Versova. The city runs on people we never see — that stayed with me."},{q:"If you were mayor for a day, what would you change?",a:"I'd make the local train women's compartment bigger and add lighting on every platform. Simple things that change everything."}], cityWant:"Watch a play at Prithvi Theatre and then sit outside with chai until they kick us out", music:"Bombay Bicycle Club — So Long, See You Tomorrow", film:"Paroma" },
      { id:2, name:"Rohan", age:28, hood:"Lower Parel", ini:"R", color:"#e8f5e9", tc:"#2d6a4f", interests:["Food","Architecture","Running"], prompts:[{q:"What's something you've been curious about recently?",a:"Why Mumbai's art deco buildings are slowly being replaced and no one seems to notice. There's a whole city that existed before glass towers."},{q:"What myth would you change society's view on?",a:"That street food is unsafe. The safest food in this city is the stuff made fresh in front of you at 11pm on a footpath."}], cityWant:"Do a proper South Mumbai heritage walk — Ballard Estate to Colaba, early morning, before the traffic", music:"Shankar Ehsaan Loy — Dil Chahta Hai OST", film:"Court" },
      { id:3, name:"Meera", age:27, hood:"Juhu", ini:"M", color:"#f3e5f5", tc:"#6a1b9a", interests:["Dance","Cinema","Cooking"], prompts:[{q:"What's something you've been curious about recently?",a:"Why Bombay cinema stopped making films about Bombay itself. The city is the most interesting character and we keep exporting it to Switzerland."},{q:"What school activity do you still miss?",a:"Annual day rehearsals. Not the performance — the chaotic weeks before, all of us crammed into one hall figuring something out together."}], cityWant:"Find a rooftop in the city where you can see both the sea and the skyline at sunset", music:"Ritviz — Sage", film:"Lunchbox" },
    ],
    offers: [
      { id:1, name:"Bombay Canteen", discount:"20% OFF", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80" },
      { id:2, name:"Bastian Bandra", discount:"15% OFF", img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80" },
      { id:3, name:"Prithvi Café", discount:"Free chai with play ticket", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80" },
    ],
    agentRestaurants: [
      { id:1, name:"Prithvi Café", searches:67, trend:"+31%", type:"Café", hood:"Juhu", menu:["Irani chai","Keema pav","Bun maska","Cold coffee","Almond cake"], insights:[ {color:"green",title:"Fast-rising hidden gem",body:"67 searches/month with a +31% trend — but only 1 competing listing in the 'Juhu café' category. You have a clear window to dominate this search before others catch on.",action:"Claim category"}, {color:"amber",title:"Almond cake — invisible",body:"Zero clicks on almond cake in 30 days from 400+ listing views. It's a signature item with no photo. A single good image could turn this into your most-clicked dish.",action:"Add photo"}, {color:"purple",title:"Theatre crowd not being captured",body:"'Things to do after Prithvi Theatre' is searched 38 times/month in Juhu. Your café is the most logical answer — but you're not appearing in those results. Add 'near Prithvi Theatre' to your listing description.",action:"Update description"}, {color:"coral",title:"Post-show surge — Thu–Sat 9–11pm",body:"Theatre shows end at approximately 9:30pm. Your kitchen closes at 9pm. Extending by 90 minutes on show nights could capture 60–80 extra covers per week.",action:"Extend hours"} ], report:"Prithvi Café is the highest-growth hidden gem on nearmet's Mumbai listings. With a +31% search trend and virtually no competition in the Juhu café category, the main opportunity is discoverability — better photos, a keyword update, and extended kitchen hours on theatre nights. Small changes here have outsized revenue impact." },
      { id:2, name:"Bademiya", searches:88, trend:"+6%", type:"Street Food", hood:"Colaba", menu:["Seekh kebab rolls","Chicken tikka","Mutton boti","Roomali roti","Masala chai"], insights:[ {color:"green",title:"Late-night demand is yours",body:"'Late night food Colaba' is searched 94 times/month. You are the only listed option open after midnight. This is an uncontested category — promote your hours more aggressively.",action:"Promote hours"}, {color:"amber",title:"Mutton boti — underperforming",body:"Mutton boti gets 2.4% of menu clicks despite being a crowd favourite offline. The listing shows no photo and no description. Update it — this should be your #2 item.",action:"Update listing"}, {color:"purple",title:"Trending: late-night rolls",body:"Searches for 'rolls Colaba night' are up 210% on weekends. You make the best rolls in the city — your listing doesn't say that clearly enough.",action:"Add keyword"}, {color:"coral",title:"Weekend concert spillover",body:"Leopold Cafe hosts live music most Saturdays. Post-show foot traffic increases your natural walk-ins by ~40%. Add a 'post-concert menu' note to capture intentional customers.",action:"Add note"} ], report:"Bademiya is an institution, but its nearmet listing doesn't reflect that. The late-night food category in Colaba is effectively uncontested — 94 monthly searches with Bademiya as the only option open past midnight. The biggest opportunity is aggressively communicating hours and adding photos to the seekh kebab roll, which is what most people are actually searching for." },
    ],
  },
};

const CUISINES_NYC = [
  { id:1, name:"Ethiopian", img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=300&q=80", icon:"🇪🇹" },
  { id:2, name:"Chinese", img:"https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=300&q=80", icon:"🥢" },
  { id:3, name:"Mexican", img:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&q=80", icon:"🌮" },
  { id:4, name:"South Indian", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&q=80", icon:"🍛" },
  { id:5, name:"Vegetarian", img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80", icon:"🌿" },
];
const CUISINES_MUM = [
  { id:1, name:"Seafood", img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&q=80", icon:"🦐" },
  { id:2, name:"Street Food", img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=300&q=80", icon:"🍢" },
  { id:3, name:"Irani Café", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&q=80", icon:"☕" },
  { id:4, name:"Modern Indian", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&q=80", icon:"🍽️" },
  { id:5, name:"Coastal", img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&q=80", icon:"🌊" },
];

const CATEGORIES = [
  { id:1, name:"Fine Dining", icon:"🍽️" },
  { id:2, name:"Cafés", icon:"☕" },
  { id:3, name:"Street Food", icon:"🍢" },
  { id:4, name:"Bars", icon:"🍸" },
  { id:5, name:"Desserts", icon:"🍰" },
  { id:6, name:"Vegetarian", icon:"🌿" },
  { id:7, name:"Seafood", icon:"🦐" },
  { id:8, name:"Late Night", icon:"🌙" },
];

const PREFS = {
  food: ["Indian","Japanese","Vegetarian","Street food","Cafes","Ethiopian","Mexican","Seafood","Italian","Chinese","Coastal","Irani"],
  events: ["Jazz","Running clubs","Art","Comedy","Dance","Markets","Film","Theatre","Music","Food festivals","Photography","Yoga"],
  explore: ["Hidden gems","History","Night walks","Museums","Parks","Architecture","Street art","Beaches"],
};

const PROMPTS_BANK = [
  "What recent incident changed your perspective on something?",
  "If you could change society's view on one myth, what would it be?",
  "If you were mayor for a day, what's one thing you'd change?",
  "What's something you've been curious about recently?",
  "If you could build an AI tool to solve any problem, what would it do?",
  "What school activity do you still miss?",
  "What's a place in this city that most people walk past without noticing?",
  "What's the last thing that made you genuinely laugh?",
];

// ── MOCK AGENT LOGIC ──────────────────────────────────────────────────────────

function generateCityAgentResponse(query, city) {
  const q = query.toLowerCase();
  const cd = CITY_DATA[city];
  const cur = cd.currency;
  const isNYC = city === "nyc";

  if (q.includes("veg") || q.includes("plant")) {
    if (isNYC) return `Based on your preferences, I'd suggest **Superiority Burger** in East Village — the vegetarian burger that converted meat-eaters, trending +41% this month at ${cur}16 for two. If you want something lighter, **Saravana Bhavan** in Murray Hill does a full South Indian thali for under ${cur}12. Both are within 2km of your saved neighborhoods.`;
    return `For vegetarian in Mumbai, **Prithvi Café** in Juhu is your best hidden gem right now — chai, bun maska, and a literary crowd for under ${cur}400 for two. For a proper meal, **Bombay Canteen** in Lower Parel does regional Indian vegetarian that's genuinely exciting, around ${cur}1,400 for two.`;
  }
  if (q.includes("coffee") || q.includes("café") || q.includes("cafe") || q.includes("work")) {
    if (isNYC) return `For coffee and working, **Abraço Espresso** in East Village is the top pick — 4.9 stars, ${cur}8 for two, olive oil cake is legendary. It's small so go early. If you need more space, the nearby public library on 10th has great light and free wifi.`;
    return `**Prithvi Café** in Juhu is the closest thing Mumbai has to a perfect working café — Irani chai, good wifi, and the kind of crowd that makes you feel like you're doing something worthwhile. ${cur}400 for two. It fills up after Prithvi Theatre shows so go before 7pm.`;
  }
  if (q.includes("free") || q.includes("budget") || q.includes("cheap")) {
    const freeEvs = cd.events.filter(e => e.badge.toLowerCase().includes("free")).slice(0, 2);
    return `Free options this week: **${freeEvs[0]?.name}** (${freeEvs[0]?.loc}) and **${freeEvs[1]?.name}** (${freeEvs[1]?.loc}). For food, ${isNYC ? `Xi'an Famous Foods in Flushing at ${cur}14 for two is unbeatable value` : `Haji Ali Juice Centre and Bademiya are the classics — both under ${cur}350 for two`}.`;
  }
  if (q.includes("jazz") || q.includes("music") || q.includes("live")) {
    if (isNYC) return `**Jazz Night at Nowadays** in Ridgewood is free this Saturday — 34 people are going and it's consistently one of the best free nights in the city. Marcus from your Connection tab is going too. If you want something more intimate, check the Blue Note or Smalls Jazz Club for late-night sets.`;
    return `**Indie Music Night** at antiSOCIAL in Lower Parel is this Friday at ${cur}400 entry — 95 people going, good room, excellent sound. If you want free and outdoors, the evening at Bandra Bandstand sometimes has impromptu performances around sunset.`;
  }
  if (q.includes("tonight") || q.includes("now") || q.includes("tonight")) {
    const todayEv = cd.events[0];
    return `Tonight I'd suggest **${todayEv.name}** (${todayEv.loc}, ${todayEv.badge}) — ${todayEv.going} people are going. For food before or after, ${isNYC ? `Bunna Cafe in Bushwick is 1.2km away and matches your food preferences` : `Bademiya in Colaba is open till 3am and matches your late-night preferences`}.`;
  }
  if (q.includes("date") || q.includes("impress") || q.includes("special")) {
    if (isNYC) return `For a great evening: start at **Abraço** for coffee around 6pm, then walk to **Bunna Cafe** in Bushwick — the communal injera platter is a natural conversation starter. Check if Jazz Night at Nowadays is on afterward. Total cost under ${cur}60 for two.`;
    return `Classic Bombay evening: drinks and sunset at **Bastian** in Bandra (${cur}2,800 for two, worth it for a special night), then walk the Carter Road promenade. If budget is a factor, **Bombay Canteen** in Lower Parel is more forgiving at ${cur}1,600 and the food is actually better.`;
  }
  // Default
  const rec = cd.food[0];
  return `For "${query}" — my top suggestion is **${rec.name}** in ${rec.hood} (${rec.tag}, ${rec.price}). It's trending ${rec.trend} this month and matches your saved preferences. ${cd.events.length > 0 ? `This week there's also **${cd.events[0].name}** (${cd.events[0].badge}) if you're looking for something to do alongside it.` : ""}`;
}

// ── ICONS ────────────────────────────────────────────────────────────────────

function SearchIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
}
function HeartIcon({ filled }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill={filled?"#e53e3e":"none"} stroke={filled?"#e53e3e":"white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}
function StarIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="#f6ad55" stroke="#f6ad55" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
function ArrowRight() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
}
function CheckIcon() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}

// ── ONBOARDING ────────────────────────────────────────────────────────────────

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [city, setCity] = useState("");
  const [form, setForm] = useState({ name:"", age:"", email:"" });
  const [prefs, setPrefs] = useState([]);
  const [prompts, setPrompts] = useState([null, null]);
  const [promptAnswers, setPromptAnswers] = useState(["", ""]);
  const [cityWants, setCityWants] = useState([]);
  const [wantInput, setWantInput] = useState("");
  const [music, setMusic] = useState("");
  const [film, setFilm] = useState("");

  function togglePref(p) {
    setPrefs(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  }
  function addWant() {
    if (wantInput.trim() && cityWants.length < 5) {
      setCityWants(prev => [...prev, wantInput.trim()]);
      setWantInput("");
    }
  }

  // Step 0: Landing
  if (step === 0) return (
    <div className="ob-screen ob-landing">
      <div className="ob-logo">near<span>met</span></div>
      <p className="ob-tagline">Your city. Your people.<br/>No algorithm. No ads.</p>
      <button className="ob-btn-primary" onClick={() => setStep(1)}>Get started</button>
      <button className="ob-btn-secondary" onClick={() => onComplete({ city:"nyc", name:"Alex", prefs:[], cityWants:[], music:"", film:"", prompts:[], promptAnswers:[] })}>I already have an account</button>
    </div>
  );

  // Step 1: City
  if (step === 1) return (
    <div className="ob-screen">
      <div className="ob-step-label">STEP 1 OF 6 — YOUR CITY</div>
      <h2 className="ob-title">Which city are you in?</h2>
      <p className="ob-sub">nearmet is live in two cities right now. More coming soon.</p>
      <div className="ob-city-list">
        {[{id:"nyc",flag:"🗽",name:"New York City",sub:"All 5 boroughs · Live now"},{id:"mumbai",flag:"🇮🇳",name:"Mumbai",sub:"All areas · Live now"}].map(c => (
          <button key={c.id} className={`ob-city-item ${city===c.id?"ob-city-item--active":""}`} onClick={() => setCity(c.id)}>
            <span className="ob-city-flag">{c.flag}</span>
            <div className="ob-city-info"><div className="ob-city-name">{c.name}</div><div className="ob-city-sub">{c.sub}</div></div>
            <div className={`ob-radio ${city===c.id?"ob-radio--filled":""}`}/>
          </button>
        ))}
      </div>
      <div className="ob-nav"><div/><button className="ob-btn-primary ob-btn-next" disabled={!city} onClick={() => setStep(2)}>Next →</button></div>
    </div>
  );

  // Step 2: Account
  if (step === 2) return (
    <div className="ob-screen">
      <div className="ob-step-label">STEP 2 OF 6 — ACCOUNT</div>
      <h2 className="ob-title">Create your account</h2>
      <p className="ob-sub">Email to verify you're real. No spam — ever.</p>
      <div className="ob-form">
        <label className="ob-label">YOUR NAME</label>
        <input className="ob-input" placeholder="What do people call you?" value={form.name} onChange={e => setForm({...form,name:e.target.value})}/>
        <label className="ob-label">AGE</label>
        <input className="ob-input" placeholder="18+" type="number" min="18" value={form.age} onChange={e => setForm({...form,age:e.target.value})}/>
        <label className="ob-label">EMAIL</label>
        <input className="ob-input" placeholder="you@example.com" type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})}/>
      </div>
      <div className="ob-nav">
        <button className="ob-btn-back" onClick={() => setStep(1)}>Back</button>
        <button className="ob-btn-primary ob-btn-next" disabled={!form.name||!form.email||!form.age} onClick={() => setStep(3)}>Next →</button>
      </div>
    </div>
  );

  // Step 3: Preferences
  if (step === 3) return (
    <div className="ob-screen">
      <div className="ob-step-label">STEP 3 OF 6 — YOUR TASTE</div>
      <h2 className="ob-title">What do you love?</h2>
      <p className="ob-sub">Seeds your personal city agent. Pick as many as you like.</p>
      <div className="ob-prefs-scroll">
        {Object.entries(PREFS).map(([cat, items]) => (
          <div key={cat} className="ob-pref-group">
            <div className="ob-pref-cat">{cat.toUpperCase()}</div>
            <div className="ob-pref-chips">
              {items.map(p => (
                <button key={p} className={`ob-chip ${prefs.includes(p)?"ob-chip--active":""}`} onClick={() => togglePref(p)}>{p}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="ob-nav">
        <button className="ob-btn-back" onClick={() => setStep(2)}>Back</button>
        <button className="ob-btn-primary ob-btn-next" disabled={prefs.length===0} onClick={() => setStep(4)}>Next →</button>
      </div>
    </div>
  );

  // Step 4: Profile — Prompts
  if (step === 4) return (
    <div className="ob-screen">
      <div className="ob-step-label">STEP 4 OF 6 — YOUR PROFILE</div>
      <h2 className="ob-title">Build your profile</h2>
      <p className="ob-sub">This is how people get to know you — beyond a bio.</p>
      <div className="ob-section-label">PROMPTS (CHOOSE 2)</div>
      <p className="ob-section-sub">These are what people resonate with. Be honest.</p>
      <div className="ob-prompts-list">
        {PROMPTS_BANK.map((pq, i) => {
          const idx = prompts.indexOf(i);
          const selected = idx !== -1;
          return (
            <div key={i} className={`ob-prompt-item ${selected?"ob-prompt-item--active":""}`} onClick={() => {
              if (selected) {
                const np = [...prompts]; np[idx] = null; setPrompts(np);
              } else if (prompts.filter(x=>x!==null).length < 2) {
                const slot = prompts.indexOf(null);
                const np = [...prompts]; np[slot === -1 ? 0 : slot] = i; setPrompts(np);
              }
            }}>
              <div className="ob-prompt-q">{pq}</div>
              {selected && (
                <textarea className="ob-prompt-ans" placeholder="Your answer (40+ words encouraged)..." value={promptAnswers[idx]||""} onChange={e => { const pa=[...promptAnswers]; pa[idx]=e.target.value; setPromptAnswers(pa); }} onClick={e=>e.stopPropagation()} rows={3}/>
              )}
            </div>
          );
        })}
      </div>
      <div className="ob-nav">
        <button className="ob-btn-back" onClick={() => setStep(3)}>Back</button>
        <button className="ob-btn-primary ob-btn-next" disabled={prompts.filter(x=>x!==null).length<2} onClick={() => setStep(5)}>Next →</button>
      </div>
    </div>
  );

  // Step 5: City Intent
  if (step === 5) return (
    <div className="ob-screen">
      <div className="ob-step-label">STEP 5 OF 6 — CITY INTENT</div>
      <h2 className="ob-title">What do you want to do?</h2>
      <p className="ob-sub">Up to 5 things you want to do in the city — this helps us connect you with the right people.</p>
      <div className="ob-wants-list">
        {cityWants.map((w, i) => (
          <div key={i} className="ob-want-item">
            <span>{w}</span>
            <button className="ob-want-remove" onClick={() => setCityWants(prev => prev.filter((_,j)=>j!==i))}>×</button>
          </div>
        ))}
        {cityWants.length < 5 && (
          <div className="ob-want-add">
            <input className="ob-input" placeholder="+ Add something you want to do..." value={wantInput} onChange={e=>setWantInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addWant()}/>
            <button className="ob-add-btn" onClick={addWant}>Add</button>
          </div>
        )}
      </div>
      <div className="ob-section-label" style={{marginTop:20}}>CURRENTLY LISTENING</div>
      <input className="ob-input" placeholder="Artist · Song or Album" value={music} onChange={e=>setMusic(e.target.value)}/>
      <div className="ob-section-label" style={{marginTop:14}}>ONE FILM TO RECOMMEND</div>
      <input className="ob-input" placeholder="Film or series title" value={film} onChange={e=>setFilm(e.target.value)}/>
      <div className="ob-nav">
        <button className="ob-btn-back" onClick={() => setStep(4)}>Back</button>
        <button className="ob-btn-primary ob-btn-next" onClick={() => setStep(6)}>Next →</button>
      </div>
    </div>
  );

  // Step 6: Done
  const cd = CITY_DATA[city];
  const suggestedFood = cd.food[0];
  const suggestedEvent = cd.events[0];
  const suggestedPerson = cd.people[0];
  if (step === 6) return (
    <div className="ob-screen ob-done">
      <div className="ob-check-circle"><CheckIcon/></div>
      <h2 className="ob-done-title">You're in, {form.name || "there"}.</h2>
      <p className="ob-done-sub">Your personal city agent is ready. Here's your first feed.</p>
      <div className="ob-done-section-label">YOUR AGENT SUGGESTS</div>
      <div className="ob-done-list">
        <div className="ob-done-item">
          <span className="ob-done-item-emo">🍽️</span>
          <div><div className="ob-done-item-name">{suggestedFood.name}</div><div className="ob-done-item-sub">{suggestedFood.hood} · matches your picks</div></div>
        </div>
        <div className="ob-done-item">
          <span className="ob-done-item-emo">{suggestedEvent.emo}</span>
          <div><div className="ob-done-item-name">{suggestedEvent.name}</div><div className="ob-done-item-sub">{suggestedEvent.date} · {suggestedEvent.badge} · {suggestedEvent.loc.split(",")[0]}</div></div>
        </div>
      </div>
      <div className="ob-done-section-label">PEOPLE NEAR YOU</div>
      <div className="ob-done-list">
        <div className="ob-done-item">
          <div className="ob-done-avatar" style={{background:suggestedPerson.color,color:suggestedPerson.tc}}>{suggestedPerson.ini}</div>
          <div><div className="ob-done-item-name">{suggestedPerson.name}, {suggestedPerson.age} · {suggestedPerson.hood.split(",")[0]}</div><div className="ob-done-item-sub">Resonates: {suggestedPerson.interests.slice(0,3).join(", ")}</div></div>
        </div>
      </div>
      <button className="ob-btn-primary" style={{marginTop:28,width:"100%"}} onClick={() => onComplete({ city, name:form.name||"Alex", prefs, cityWants, music, film, prompts, promptAnswers })}>
        Go to my feed →
      </button>
    </div>
  );

  return null;
}

// ── DISCOVERY SCREEN ──────────────────────────────────────────────────────────

function DiscoveryScreen({ city }) {
  const [likes, setLikes] = useState({});
  const [activeCat, setActiveCat] = useState(null);
  const [subTab, setSubTab] = useState("food");
  const cd = CITY_DATA[city];
  const cuisines = city === "nyc" ? CUISINES_NYC : CUISINES_MUM;

  function toggleLike(id) { setLikes(prev=>({...prev,[id]:!prev[id]})); }

  const badgeCls = b => {
    const l = b.toLowerCase();
    if (l.includes("free")) return "ev-badge ev-badge--green";
    if (l.includes("paid")) return "ev-badge ev-badge--amber";
    if (l.includes("outdoor")) return "ev-badge ev-badge--blue";
    return "ev-badge ev-badge--gray";
  };

  return (
    <div className="food-screen">
      <div className="search-bar-wrap">
        <div className="search-bar"><SearchIcon/><span className="search-placeholder">Search restaurants, events, people…</span></div>
      </div>
      <div className="main-tabs">
        {[["food","🍽️","Food"],["events","🎭","Events"],["services","🔔","Services","NEW"]].map(([id,icon,lbl,badge])=>(
          <button key={id} className={`main-tab ${subTab===id?"main-tab--active":""}`} onClick={()=>setSubTab(id)}>
            <span className="main-tab-icon">{icon}</span>
            <span className="main-tab-label">{lbl}</span>
            {badge && <span className="new-badge">{badge}</span>}
          </button>
        ))}
      </div>

      {subTab === "food" && (<>
        <section className="section">
          <div className="section-header">
            <div><div className="section-title">Recommended for you</div><div className="section-sub">Based on your taste and favorites</div></div>
            <button className="see-all-btn"><ArrowRight/></button>
          </div>
          <div className="horiz-scroll">
            {cd.food.map(r=>(
              <div className="rec-card" key={r.id}>
                <div className="rec-img-wrap">
                  <img src={r.img} alt={r.name} className="rec-img" loading="lazy"/>
                  <button className="heart-btn" onClick={()=>toggleLike(r.id)}><HeartIcon filled={!!likes[r.id]}/></button>
                  <span className="rec-tag">{r.tag}</span>
                </div>
                <div className="rec-info">
                  <div className="rec-name">{r.name}</div>
                  <div className="rec-price">{r.price}</div>
                  <div className="rec-rating"><StarIcon/><span>{r.rating}</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div><div className="section-title">Explore new cuisine</div><div className="section-sub">Discover flavors from around the world</div></div>
            <button className="see-all-btn"><ArrowRight/></button>
          </div>
          <div className="horiz-scroll">
            {cuisines.map(c=>(
              <div className="cuisine-card" key={c.id}>
                <img src={c.img} alt={c.name} className="cuisine-img" loading="lazy"/>
                <div className="cuisine-overlay"><span className="cuisine-icon">{c.icon}</span><span className="cuisine-name">{c.name}</span></div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-title" style={{marginBottom:4}}>Browse by category</div>
          <div className="section-sub" style={{marginBottom:14}}>Find the perfect spot for any craving</div>
          <div className="categories-grid">
            {CATEGORIES.map(cat=>(
              <button key={cat.id} className={`cat-btn ${activeCat===cat.id?"cat-btn--active":""}`} onClick={()=>setActiveCat(activeCat===cat.id?null:cat.id)}>
                <span className="cat-icon">{cat.icon}</span><span className="cat-name">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="section section--last">
          <div className="section-header">
            <div><div className="section-title">Top offers near you</div><div className="section-sub">Great food at great prices</div></div>
            <button className="see-all-btn"><ArrowRight/></button>
          </div>
          <div className="horiz-scroll">
            {cd.offers.map(o=>(
              <div className="offer-card" key={o.id}>
                <div className="offer-img-wrap">
                  <img src={o.img} alt={o.name} className="offer-img" loading="lazy"/>
                  <button className="heart-btn" onClick={()=>toggleLike(`o${o.id}`)}><HeartIcon filled={!!likes[`o${o.id}`]}/></button>
                  <span className="discount-badge">{o.discount}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>)}

      {subTab === "events" && (
        <div style={{paddingTop:28}}>
          <div className="section-header" style={{marginBottom:18}}>
            <div><div className="section-title">Events near you</div><div className="section-sub">What's happening in {cd.label} this week</div></div>
            <button className="create-ev-inline">+ Create event</button>
          </div>
          <div className="ev-list">
            {cd.events.map(e=>(
              <div className="ev-item" key={e.id}>
                <div className="ev-icon-box">{e.emo}</div>
                <div className="ev-details">
                  <div className="ev-name">{e.name}</div>
                  <div className="ev-meta">{e.date} · {e.loc}</div>
                  <div className="ev-footer"><span className="ev-host">by {e.host} · {e.going} going</span><span className={badgeCls(e.badge)}>{e.badge}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === "services" && (
        <section className="section" style={{marginTop:28}}>
          <div className="section-header"><div><div className="section-title">Services near you</div><div className="section-sub">Food-related services from trusted local professionals</div></div></div>
          <div className="services-grid">
            {[{id:1,icon:"👨‍🍳",name:"Private Chef",desc:"Book a personal chef for dinners, parties, or meal prep.",price:`From ${cd.currency === "$" ? "$80" : "₹2,500"}`,badge:"Popular",bt:"green"},{id:2,icon:"📸",name:"Food Photography",desc:"Professional photography for menus and social media.",price:`From ${cd.currency === "$" ? "$120" : "₹3,000"}`,badge:"New",bt:"blue"},{id:3,icon:"🍱",name:"Catering",desc:"Full-service catering for events, weddings, and gatherings.",price:`From ${cd.currency === "$" ? "$25/head" : "₹500/head"}`,badge:"Popular",bt:"green"},{id:4,icon:"🧑‍🍳",name:"Cooking Classes",desc:"Learn a new cuisine with expert chefs. Group & private.",price:`From ${cd.currency === "$" ? "$45" : "₹800"}`,badge:"",bt:""},{id:5,icon:"📊",name:"Restaurant Consulting",desc:"Menu design, pricing strategy, and operational advice.",price:`From ${cd.currency === "$" ? "$200" : "₹5,000"}`,badge:"B2B",bt:"purple"},{id:6,icon:"🏛️",name:"Event Space Booking",desc:"Find unique dining venues for private events.",price:`From ${cd.currency === "$" ? "$300" : "₹8,000"}`,badge:"New",bt:"blue"}].map(s=>(
              <div className="service-card" key={s.id}>
                <div className="service-icon">{s.icon}</div>
                <div className="service-body">
                  <div className="service-header-row"><div className="service-name">{s.name}</div>{s.badge&&<span className={`service-badge service-badge--${s.bt}`}>{s.badge}</span>}</div>
                  <div className="service-desc">{s.desc}</div>
                  <div className="service-price">{s.price}</div>
                  <button className="service-btn">Book now →</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── CONNECTION SCREEN ─────────────────────────────────────────────────────────

function ConnectionScreen({ city}) {
  const [resonances, setResonances] = useState([]);
  const [modal, setModal] = useState(null);
  const [modalTxt, setModalTxt] = useState("");
  const [chats, setChats] = useState({});
  const [openChat, setOpenChat] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const cd = CITY_DATA[city];
  const people = cd.people;

  function openResonate(person, qi) {
    if (resonances.some(r=>r.pid===person.id&&r.qi===qi)) return;
    setModal({person,qi}); setModalTxt("");
  }
  function sendRes() {
    if (!modal||modalTxt.trim().length<10) return;
    setResonances(prev=>[...prev,{pid:modal.person.id,qi:modal.qi,accepted:false}]);
    const m = modal; setModal(null);
    setTimeout(()=>setResonances(prev=>prev.map(r=>r.pid===m.person.id&&r.qi===m.qi?{...r,accepted:true}:r)),1500);
  }
  function sendChat(pid) {
    if (!chatInput.trim()) return;
    const replies = ["That's so interesting! I hadn't thought about it that way.","Haha yes! We should definitely do that.","Okay now I really want to check that place out.","Same! Let's plan something this weekend.","That makes so much sense actually."];
    setChats(prev=>({...prev,[pid]:[...(prev[pid]||[]),{text:chatInput,me:true}]}));
    setChatInput("");
    setTimeout(()=>setChats(prev=>({...prev,[pid]:[...(prev[pid]||[]),{text:replies[Math.floor(Math.random()*replies.length)],me:false}]})),800+Math.random()*500);
  }

  if (openChat) {
    const p = openChat; const msgs = chats[p.id]||[];
    return (
      <div className="chat-screen">
        <div className="chat-topbar">
          <button className="back-btn" onClick={()=>setOpenChat(null)}>←</button>
          <div className="chat-avatar" style={{background:p.color,color:p.tc}}>{p.ini}</div>
          <div><div className="chat-name">{p.name}</div><div className="chat-status">● Connected</div></div>
        </div>
        <div className="chat-messages">
          {msgs.length===0&&<div className="chat-empty"><div style={{fontSize:28,marginBottom:8}}>✦</div><p>You connected with {p.name} through a shared resonance.</p><p style={{marginTop:4,opacity:0.6}}>Say hello.</p></div>}
          {msgs.map((m,i)=><div key={i} className={`chat-bubble ${m.me?"chat-bubble--me":""}`}>{m.text}</div>)}
        </div>
        <div className="chat-input-row">
          <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat(p.id)} placeholder="Say something..." className="chat-input"/>
          <button onClick={()=>sendChat(p.id)} className="chat-send">Send</button>
        </div>
      </div>
    );
  }

  return (
    <div className="generic-screen">
      <div className="generic-header">
        <h1 className="generic-title">People exploring {cd.label}</h1>
        <p className="generic-sub">Tap a quote to resonate. No swiping — just genuine connection.</p>
      </div>
      <div className="people-list">
        {people.map(p=>{
          const rc=resonances.filter(r=>r.pid===p.id).length;
          const accepted=resonances.some(r=>r.pid===p.id&&r.accepted);
          return (
            <div className="person-card" key={p.id}>
              <div className="person-header">
                <div className="person-avatar" style={{background:p.color,color:p.tc}}>{p.ini}</div>
                <div><div className="person-name">{p.name}, {p.age}</div><div className="person-hood">📍 {p.hood}</div></div>
              </div>
              <div className="interest-row">{p.interests.map(i=><span key={i} className="interest-chip">{i}</span>)}</div>
              {p.prompts.map((pr,qi)=>(
                <div key={qi} className="quote-card" onClick={()=>openResonate(p,qi)}>
                  <div className="quote-q">{pr.q}</div>
                  <div className="quote-a">"{pr.a}"</div>
                  {resonances.some(r=>r.pid===p.id&&r.qi===qi)&&<div className="res-sent">✓ Resonance sent</div>}
                </div>
              ))}
              <div className="city-want">
                <div className="city-want-label">Wants to do in {cd.label === "New York City" ? "NYC" : "Mumbai"}</div>
                <div className="city-want-text">"{p.cityWant}"</div>
              </div>
              <div className="person-media">
                <div className="person-media-item"><span className="person-media-label">Listening</span><span className="person-media-val">{p.music}</span></div>
                <div className="person-media-item"><span className="person-media-label">Watching</span><span className="person-media-val">{p.film}</span></div>
              </div>
              {rc>0&&<div className="resonance-count">✓ You resonated with {rc} thing{rc>1?"s":""}</div>}
              {accepted&&<button className="open-chat-btn" onClick={()=>setOpenChat(p)}>Chat with {p.name} →</button>}
            </div>
          );
        })}
      </div>
      {modal&&(
        <div className="modal-overlay" onClick={()=>setModal(null)}>
          <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
            <div className="modal-handle"/>
            <div className="modal-label">Resonating with {modal.person.name}</div>
            <div className="modal-quote">"{modal.person.prompts[modal.qi].a}"</div>
            <textarea className="modal-textarea" rows={3} placeholder="What resonated with you? Be specific..." maxLength={240} value={modalTxt} onChange={e=>setModalTxt(e.target.value)}/>
            <div className="modal-footer">
              <span className="modal-count">{modalTxt.length} / 240</span>
              <button className="modal-send-btn" disabled={modalTxt.trim().length<10} onClick={sendRes}>Send Resonance</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── AGENTS SCREEN ─────────────────────────────────────────────────────────────

function AgentsScreen({ city, userPrefs}) {
  const [agentTab, setAgentTab] = useState("city");
  const [selRestaurant, setSelRestaurant] = useState(null);
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentResult, setAgentResult] = useState(null);
  const [cityMessages, setCityMessages] = useState([]);
  const [cityInput, setCityInput] = useState("");
  const [cityLoading, setCityLoading] = useState(false);
  const cd = CITY_DATA[city];

  function runMenuAgent() {
    if (!selRestaurant) return;
    setAgentLoading(true); setAgentResult(null);
    setTimeout(() => { setAgentLoading(false); setAgentResult(selRestaurant); }, 1800);
  }

  function askCityAgent() {
    const q = cityInput.trim(); if (!q) return;
    const newMsgs = [...cityMessages, {text:q,me:true}];
    setCityMessages(newMsgs); setCityInput(""); setCityLoading(true);
    setTimeout(() => {
      const answer = generateCityAgentResponse(q, city, userPrefs);
      setCityMessages([...newMsgs, {text:answer,me:false}]);
      setCityLoading(false);
    }, 1200 + Math.random()*600);
  }

  const insightColors = { green:"var(--green)", amber:"var(--amber)", purple:"#6b21a8", coral:"#c0392b" };
  const insightBgs = { green:"var(--green-bg)", amber:"var(--amber-bg)", purple:"#f3e8ff", coral:"#fdedec" };

  return (
    <div className="generic-screen">
      <div className="generic-header">
        <h1 className="generic-title">AI Agents ✦</h1>
        <p className="generic-sub">Intelligence layer — no API key needed.</p>
      </div>
      <div className="agent-tabs">
        {[["city","⊙ City Agent"],["menu","✦ Menu Intelligence"],["events","🎷 Event Alerts"]].map(([id,lbl])=>(
          <button key={id} className={`agent-tab ${agentTab===id?"agent-tab--active":""}`} onClick={()=>setAgentTab(id)}>{lbl}</button>
        ))}
      </div>

      {agentTab === "city" && (
        <div className="agent-panel">
          <div className="wide-card">
            <div className="agent-card-label">Your personal city agent</div>
            <p style={{fontSize:13,color:"var(--text2)",marginBottom:14,lineHeight:1.6}}>Ask anything about {cd.label} — food, events, what to do tonight. The agent knows your preferences and the city's real-time data.</p>
            <div className="city-msgs">
              {cityMessages.map((m,i)=>(
                <div key={i} className={`city-bubble ${m.me?"city-bubble--me":""}`} dangerouslySetInnerHTML={{__html:m.me?m.text:m.text.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")}}/>
              ))}
              {cityLoading&&<div className="city-bubble"><span className="typing-dots"><span/><span/><span/></span></div>}
            </div>
            <div className="city-quick-btns">
              {[city==="nyc"?"Veg restaurant near me":"Vegetarian in Bandra",city==="nyc"?"Free events this week":"Free events Mumbai",city==="nyc"?"Coffee and work spot":"Best café to work from",city==="nyc"?"Late night food":"Late night food Mumbai"].map(s=>(
                <button key={s} className="quick-btn" onClick={()=>{setCityInput(s);setTimeout(()=>{ const newMsgs=[...cityMessages,{text:s,me:true}]; setCityMessages(newMsgs); setCityLoading(true); setTimeout(()=>{ setCityMessages([...newMsgs,{text:generateCityAgentResponse(s,city,userPrefs),me:false}]); setCityLoading(false); },1200); },0);}}>{s}</button>
              ))}
            </div>
            <div className="city-input-row">
              <input className="city-input" value={cityInput} onChange={e=>setCityInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&askCityAgent()} placeholder={`Ask about ${cd.label === "New York City" ? "NYC" : "Mumbai"}…`}/>
              <button className="city-send" onClick={askCityAgent}>Ask →</button>
            </div>
          </div>
        </div>
      )}

      {agentTab === "menu" && (
        <div className="agent-panel">
          <div className="wide-card" style={{marginBottom:14}}>
            <div className="agent-card-label">Select a restaurant</div>
            <div className="rest-selector">
              {cd.agentRestaurants.map(r=>(
                <button key={r.id} className={`rest-btn ${selRestaurant?.id===r.id?"rest-btn--active":""}`} onClick={()=>{setSelRestaurant(r);setAgentResult(null);}}>
                  {r.name}
                </button>
              ))}
            </div>
            {selRestaurant&&(
              <div style={{marginTop:14}}>
                <div style={{fontWeight:700,fontSize:15}}>{selRestaurant.name}</div>
                <div style={{fontSize:12,color:"var(--text3)",marginBottom:10}}>{selRestaurant.hood} · {selRestaurant.searches} searches/month · {selRestaurant.trend}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {selRestaurant.menu.map(d=><span key={d} className="menu-chip">{d}</span>)}
                </div>
              </div>
            )}
          </div>
          <button className="run-agent-btn" disabled={!selRestaurant||agentLoading} onClick={runMenuAgent}>
            {agentLoading?<span className="typing-dots"><span/><span/><span/></span>:"✦ Run Menu Intelligence Agent"}
          </button>
          {agentResult&&(
            <div style={{marginTop:16}}>
              <div className="metrics-row">
                <div className="metric-box"><div className="metric-val">{agentResult.searches}/mo</div><div className="metric-lbl">Searches</div></div>
                <div className="metric-box"><div className="metric-val">{agentResult.trend}</div><div className="metric-lbl">Trend</div></div>
                <div className="metric-box"><div className="metric-val">{agentResult.insights.length}</div><div className="metric-lbl">Insights</div></div>
              </div>
              {agentResult.insights.map((ins,i)=>(
                <div key={i} className="insight-card" style={{background:insightBgs[ins.color],borderLeftColor:insightColors[ins.color]}}>
                  <div className="insight-title" style={{color:insightColors[ins.color]}}>{ins.title}</div>
                  <p className="insight-body">{ins.body}</p>
                  <span className="insight-action" style={{color:insightColors[ins.color],border:`1px solid ${insightColors[ins.color]}`}}>{ins.action}</span>
                </div>
              ))}
              <div className="wide-card" style={{background:"var(--bg2)",marginTop:4}}>
                <div className="agent-card-label">Full report</div>
                <p style={{fontSize:13,color:"var(--text2)",lineHeight:1.65,margin:0}}>{agentResult.report}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {agentTab === "events" && (
        <div className="agent-panel">
          <div className="event-alert-card">
            <div className="alert-badge-pill">🔔 EVENT ALERT — 48h notice</div>
            <div className="alert-title">{cd.events[0].name}</div>
            <div className="alert-sub">{cd.events[0].loc} · {cd.events[0].date} · Est. {cd.events[0].going} attendees</div>
            <div className="alert-body">
              <strong>Restaurants within 1.5km of this event are being notified.</strong><br/>
              User searches for "food near {cd.events[0].loc.split(",")[0]}" are up 340% in the last 48 hours.<br/>
              Pre-event demand window: 5–8pm. Post-event: 10pm–midnight.
            </div>
            <div className="alert-recs">
              <div className="alert-recs-label">RECOMMENDATIONS</div>
              {["Schedule 2 extra servers for post-event shift","Pre-batch your most popular cocktails or mocktails","Open kitchen 30 min late","Estimated extra revenue: "+cd.currency+(city==="nyc"?"800–1,400":"18,000–30,000")].map(r=><div key={r} className="alert-rec-item">→ {r}</div>)}
            </div>
          </div>
          <div className="wide-card">
            <div className="agent-card-label">All events this week — impact forecast</div>
            {cd.events.map(e=>(
              <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:"1px solid var(--border2)"}}>
                <div><div style={{fontSize:14,fontWeight:600}}>{e.emo} {e.name}</div><div style={{fontSize:11,color:"var(--text3)"}}>{e.date} · {e.going} attending</div></div>
                <span className="ev-badge ev-badge--gray">{e.going > 100 ? "High impact" : e.going > 30 ? "Medium" : "Low"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── PROFILE SCREEN ────────────────────────────────────────────────────────────

function ProfileScreen({ user, onSignOut }) {
  const cd = CITY_DATA[user.city];
  return (
    <div className="generic-screen">
      <div className="profile-page-hero">
        <div className="profile-page-avatar">{user.name.slice(0,2).toUpperCase()}</div>
        <div className="profile-page-name">{user.name}</div>
        <div className="profile-page-sub">{cd.label} · Member since 2025</div>
      </div>
      <div className="profile-stats">
        {[["12","Places visited"],["5","Events attended"],[String(user.prefs.length),"Preferences set"]].map(([v,l])=>(
          <div key={l} className="profile-stat"><div className="profile-stat-val">{v}</div><div className="profile-stat-lbl">{l}</div></div>
        ))}
      </div>
      {user.cityWants.length > 0 && (
        <div style={{padding:"0 0 20px"}}>
          <div className="profile-section-title">City ambitions</div>
          {user.cityWants.map((w,i)=><div key={i} className="profile-want-item">{w}</div>)}
        </div>
      )}
      {user.music && <div style={{padding:"0 0 8px"}}><span className="profile-section-title">Listening: </span><span style={{fontSize:14,color:"var(--text2)"}}>{user.music}</span></div>}
      {user.film && <div style={{padding:"0 0 20px"}}><span className="profile-section-title">Watching: </span><span style={{fontSize:14,color:"var(--text2)"}}>{user.film}</span></div>}
      <div className="profile-section">
        {["Edit Profile","My Favorites","My Events","Notifications","Privacy Settings","Help & Support"].map(item=>(
          <div key={item} className="profile-row"><span>{item}</span><ArrowRight/></div>
        ))}
        <div className="profile-row" onClick={onSignOut} style={{color:"var(--accent)",cursor:"pointer"}}><span>Sign Out</span><ArrowRight/></div>
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("discovery");

  function handleOnboardingComplete(data) {
    setUser(data);
    setActiveTab("discovery");
  }

  if (!user) return <Onboarding onComplete={handleOnboardingComplete}/>;

  return (
    <div className="site-root">
      <header className="topnav">
        <div className="topnav-inner">
          <div className="topnav-logo">near<span>met</span></div>
          <nav className="topnav-links">
            {[["discovery","⊙","Discovery"],["connection","♡","Connection"],["agents","✦","Agents"],["profile","◯","Profile"]].map(([id,ic,lb])=>(
              <button key={id} className={`topnav-link ${activeTab===id?"topnav-link--active":""}`} onClick={()=>setActiveTab(id)}>
                <span style={{fontSize:14}}>{ic}</span>{lb}
              </button>
            ))}
          </nav>
          <div className="topnav-right">
            <span className="city-chip">📍 {user.city === "nyc" ? "NYC" : "Mumbai"}</span>
            <div className="user-avatar">{user.name.slice(0,2).toUpperCase()}</div>
          </div>
        </div>
      </header>
      <main className="site-main">
        {activeTab === "discovery"  && <DiscoveryScreen city={user.city}/>}
        {activeTab === "connection" && <ConnectionScreen city={user.city} userName={user.name}/>}
        {activeTab === "agents"     && <AgentsScreen city={user.city} userPrefs={user.prefs} userName={user.name}/>}
        {activeTab === "profile"    && <ProfileScreen user={user} onSignOut={()=>setUser(null)}/>}
      </main>
    </div>
  );
}
