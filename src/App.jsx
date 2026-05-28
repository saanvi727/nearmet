import { useState } from "react";
import "./App.css";

// ─── LOGO ────────────────────────────────────────────────────────────────────
function NearMetLogo({ size = 28, dark = false }) {
  return (
    <span className="nm-logo" style={{ fontSize: size }}>
      <span style={{ color: dark ? "#f5f5f0" : "#1a2e1a" }}>Near</span>
      <span style={{ color: dark ? "#8aad6e" : "#2d6a2d" }}>Met</span>
    </span>
  );
}

// ─── CITY DATA ───────────────────────────────────────────────────────────────
const CITIES = {
  nyc: {
    label: "New York City", cur: "$",
    food: [
      { id:1, name:"Olive Bistro", cuisine:"Italian", price:"$1,500 for two", rating:4.7, tag:"High rated", hood:"West Village", desc:"A cozy Italian bistro with warm lighting and exceptional pasta.", phone:"+1 212-555-0101", img:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", photos:["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80"], menu:[{item:"Truffle Pasta",price:"$28"},{item:"Branzino",price:"$34"},{item:"Tiramisu",price:"$12"},{item:"Margherita",price:"$18"}] },
      { id:2, name:"Sakura Sushi", cuisine:"Japanese", price:"$1,200 for two", rating:4.6, tag:"Near you", hood:"East Village", desc:"A cozy sushi place offering authentic Japanese cuisine with a modern touch.", phone:"+1 212-555-0202", img:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80", photos:["https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80"], menu:[{item:"Spicy Tuna Roll",price:"$18"},{item:"Salmon Sashimi",price:"$22"},{item:"Dragon Roll",price:"$24"},{item:"Miso Ramen",price:"$16"}] },
      { id:3, name:"La Pizzeria", cuisine:"Italian", price:"$1,000 for two", rating:4.5, tag:"Best for dinner", hood:"Brooklyn", desc:"Wood-fired Neapolitan pizza made with imported Italian ingredients.", phone:"+1 718-555-0303", img:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80", photos:["https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80"], menu:[{item:"Margherita",price:"$16"},{item:"Truffle Pizza",price:"$24"},{item:"Burrata",price:"$14"},{item:"Tiramisu",price:"$10"}] },
      { id:4, name:"Truffle House", cuisine:"Continental", price:"$1,800 for two", rating:4.4, tag:"Popular", hood:"Midtown", desc:"Fine dining with an emphasis on truffle-infused seasonal ingredients.", phone:"+1 212-555-0404", img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", photos:["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80"], menu:[{item:"Truffle Risotto",price:"$42"},{item:"Wagyu Beef",price:"$68"},{item:"Lobster Bisque",price:"$28"},{item:"Crème Brûlée",price:"$16"}] },
      { id:5, name:"Bunna Cafe", cuisine:"Ethiopian", price:"$800 for two", rating:4.8, tag:"Hidden gem", hood:"Bushwick", desc:"Authentic Ethiopian food in a warm communal setting. Share the injera platter.", phone:"+1 347-555-0505", img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80"], menu:[{item:"Injera Platter",price:"$24"},{item:"Tibs",price:"$18"},{item:"Kitfo",price:"$20"},{item:"Tej Honey Wine",price:"$8"}] },
      { id:6, name:"Saravana Bhavan", cuisine:"Indian", price:"$600 for two", rating:4.7, tag:"Family fav", hood:"Murray Hill", desc:"South Indian classics done right. The masala dosa is legendary.", phone:"+1 212-555-0606", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80", photos:["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Masala Dosa",price:"$12"},{item:"Idli Sambar",price:"$9"},{item:"Thali",price:"$16"},{item:"Filter Coffee",price:"$4"}] },
    ],
    mapPlaces: [
      {id:1,name:"Olive Bistro",rating:4.7,top:"28%",left:"18%"},{id:2,name:"Sakura Sushi",rating:4.6,top:"32%",left:"62%"},{id:3,name:"Safar's Eats",rating:4.5,top:"45%",left:"35%"},{id:4,name:"La Pizzeria",rating:4.5,top:"50%",left:"65%"},{id:5,name:"Goodfellas Cafe",rating:4.4,top:"58%",left:"22%"},{id:6,name:"Bastian",rating:4.4,top:"62%",left:"68%"},{id:7,name:"Truffle House",rating:4.4,top:"70%",left:"42%"},{id:8,name:"The Daily All Day",rating:4.3,top:"78%",left:"32%"},{id:9,name:"PizzaExpress",rating:4.3,top:"87%",left:"72%"},
    ],
    events: [
      { id:1, name:"Indie Night Live Concert", cats:["Music","Nightlife"], date:"24 May, 2024", time:"7:00 PM – 10:30 PM", loc:"Bandra Fort Amphitheatre", city:"New York", interested:1800, img:"https://images.unsplash.com/photo-1501386761578-eaa54b02c811?w=600&q=80" },
      { id:2, name:"Art Festival 2025", cats:["Art & Culture","Festivals"], date:"25 May, 2024", time:"11:00 AM – 7:00 PM", loc:"Jio World Garden, BKC", city:"New York", interested:2300, img:"https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80" },
      { id:3, name:"Rooftop Social Mixer", cats:["Nightlife","Networking"], date:"26 May, 2024", time:"6:30 PM – 10:00 PM", loc:"AER, Worli", city:"New York", interested:950, img:"https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600&q=80" },
    ],
    thirdPlaces: [
      { id:1, name:"Cafe Aranya", cats:["Cafe","Community"], dist:"700 m", desc:"A cozy cafe with open seating and great coffee.", visitors:56, img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", addedBy:"Sarah K." },
      { id:2, name:"Greenview Park", cats:["Nature","Relaxation"], dist:"1.2 km", desc:"Peaceful park perfect for a walk or some quiet time.", visitors:128, img:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80", addedBy:"Mike R." },
      { id:3, name:"City Central Library", cats:["Study & Work"], dist:"1.6 km", desc:"Quiet space to read, study and focus.", visitors:94, img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80", addedBy:"Jin L." },
      { id:4, name:"Kala Street Art Lane", cats:["Art & Culture"], dist:"1.9 km", desc:"Vibrant street art and creative community vibes.", visitors:76, img:"https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80", addedBy:"Priya S." },
    ],
    people: [
      { id:1, ini:"R", name:"Rohit", age:26, city:"New York", color:"#e8f0e8", tc:"#2d6a2d", photos:["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80","https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"], prompts:[{q:"What recent incident changed your perspective on something and how?",a:"Solo backpacking in the Himalayas taught me to slow down and truly appreciate the little things."},{q:"If you were the mayor for a day what's one thing you'd change about your city?",a:"I'd make public spaces more vibrant and accessible for everyone."},{q:"What's something you've been curious about recently?",a:"I've been trying to understand how AI can actually make everyday life better."}], cityWants:["Run half marathon","Learn guitar","Go for trekking","Watch stand-up comedy","Try new restaurants"], songs:[{title:"The Night We Met",artist:"Lord Huron"},{title:"Yellow",artist:"Coldplay"},{title:"Choo Lo",artist:"The Local Train"}], recs:[{title:"Interstellar",type:"Movie"},{title:"Breaking Bad",type:"Series"},{title:"Cosmos",type:"Documentary"}] },
      { id:2, ini:"A", name:"Aisha", age:24, city:"New York", color:"#f0e8e8", tc:"#8b2020", photos:["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80","https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80","https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80"], prompts:[{q:"What recent incident changed your perspective on something and how?",a:"Watching sunrise at the Hudson taught me that the best moments are the unplanned ones."},{q:"If you were the mayor for a day what's one thing you'd change?",a:"I'd convert every empty lot into a community garden. Green spaces change how people feel."}], cityWants:["Take a pottery class","Find the best bagel in NYC","See a Broadway show","Join a book club","Learn to skateboard"], songs:[{title:"Heat Waves",artist:"Glass Animals"},{title:"Blinding Lights",artist:"The Weeknd"}], recs:[{title:"Everything Everywhere",type:"Movie"},{title:"Fleabag",type:"Series"}] },
      { id:3, ini:"M", name:"Marcus", age:28, city:"New York", color:"#e8eef5", tc:"#1a3a5c", photos:["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80","https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80","https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80"], prompts:[{q:"What school activity do you still miss?",a:"Jazz band rehearsals. There's something about creating something together in real time that can't be replicated."},{q:"What myth would you change society's view on?",a:"That you need to be extroverted to build genuine connections. The deepest ones I have are with fellow introverts."}], cityWants:["Brooklyn Bridge at sunset","Find best jazz bar","Try Ethiopian food in Bushwick","Take a cooking class","Run a 10k"], songs:[{title:"So What",artist:"Miles Davis"},{title:"Redbone",artist:"Childish Gambino"}], recs:[{title:"Moonlight",type:"Movie"},{title:"The Wire",type:"Series"},{title:"13th",type:"Documentary"}] },
    ],
  },
  mumbai: {
    label: "Mumbai", cur: "₹",
    food: [
      { id:1, name:"Café Mondegar", cuisine:"Continental", price:"₹1,500 for two", rating:4.6, tag:"Iconic", hood:"Colaba", desc:"Mumbai institution since 1932. The murals, jukebox, and cold coffee.", phone:"+91 22-2202-0591", img:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Chicken Tikka Pizza",price:"₹450"},{item:"Cold Coffee",price:"₹180"},{item:"Cheese Sandwich",price:"₹280"},{item:"Masala Fries",price:"₹220"}] },
      { id:2, name:"Bastian Bandra", cuisine:"Seafood", price:"₹2,800 for two", rating:4.7, tag:"Trending", hood:"Bandra West", desc:"Bandra's most talked-about seafood spot. Butter garlic prawns alone justify the tab.", phone:"+91 22-2604-2222", img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", photos:["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80"], menu:[{item:"Butter Garlic Prawns",price:"₹980"},{item:"Lobster Bisque",price:"₹780"},{item:"Fish Tacos",price:"₹650"},{item:"Truffle Fries",price:"₹380"}] },
      { id:3, name:"Bombay Canteen", cuisine:"Indian", price:"₹1,600 for two", rating:4.8, tag:"Must visit", hood:"Lower Parel", desc:"India's regional cuisines reimagined without apology. The cocktail menu is as thoughtful as the food.", phone:"+91 22-4966-0666", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80", photos:["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Pork Vindaloo",price:"₹680"},{item:"Kokum Gimlet",price:"₹480"},{item:"Goan Fish Curry",price:"₹720"},{item:"Meetha Paan Dessert",price:"₹280"}] },
      { id:4, name:"Prithvi Café", cuisine:"Cafe", price:"₹400 for two", rating:4.8, tag:"Hidden gem", hood:"Juhu", desc:"The most literary café in Mumbai, attached to Prithvi Theatre.", phone:"+91 22-2614-9546", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", photos:["https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"], menu:[{item:"Irani Chai",price:"₹60"},{item:"Keema Pav",price:"₹180"},{item:"Bun Maska",price:"₹80"},{item:"Cold Coffee",price:"₹150"}] },
      { id:5, name:"Bademiya", cuisine:"Street Food", price:"₹350 for two", rating:4.7, tag:"Late night", hood:"Colaba", desc:"Open till 3am. The seekh kebab roll is what Bombay nights taste like.", phone:"+91 22-2283-3636", img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80"], menu:[{item:"Seekh Kebab Roll",price:"₹120"},{item:"Chicken Tikka",price:"₹180"},{item:"Mutton Boti",price:"₹200"},{item:"Masala Chai",price:"₹30"}] },
      { id:6, name:"Haji Ali Juice", cuisine:"Cafe", price:"₹200 for two", rating:4.9, tag:"Classic", hood:"Haji Ali", desc:"The pilgrimage that has nothing to do with religion. Juices served with a view.", phone:"+91 22-2353-3373", img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80", photos:["https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"], menu:[{item:"Mixed Fruit Juice",price:"₹80"},{item:"Milkshake",price:"₹120"},{item:"Fruit Chaat",price:"₹60"},{item:"Fresh Coconut Water",price:"₹40"}] },
    ],
    mapPlaces: [
      {id:1,name:"The Bombay Canteen",rating:4.6,top:"15%",left:"55%"},{id:2,name:"Olive Bistro",rating:4.7,top:"28%",left:"18%"},{id:3,name:"Sakura Sushi",rating:4.6,top:"28%",left:"65%"},{id:4,name:"Safar's Eats",rating:4.5,top:"42%",left:"32%"},{id:5,name:"La Pizzeria",rating:4.5,top:"48%",left:"62%"},{id:6,name:"Goodfellas Cafe",rating:4.4,top:"56%",left:"22%"},{id:7,name:"Bastian",rating:4.4,top:"60%",left:"66%"},{id:8,name:"Truffle House",rating:4.4,top:"68%",left:"40%"},{id:9,name:"The Daily All Day",rating:4.3,top:"76%",left:"30%"},{id:10,name:"PizzaExpress",rating:4.3,top:"85%",left:"68%"},
    ],
    events: [
      { id:1, name:"Koli Seafood Festival", cats:["Food & Culture","Festivals"], date:"31 May, 2024", time:"12:00 PM – 8:00 PM", loc:"Versova Beach, Andheri", city:"Mumbai", interested:3200, img:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80" },
      { id:2, name:"Indie Music Night", cats:["Music","Nightlife"], date:"30 May, 2024", time:"8:00 PM – 12:00 AM", loc:"antiSOCIAL, Lower Parel", city:"Mumbai", interested:890, img:"https://images.unsplash.com/photo-1501386761578-eaa54b02c811?w=600&q=80" },
      { id:3, name:"Bandra Flea Market", cats:["Community","Shopping"], date:"1 Jun, 2024", time:"11:00 AM – 6:00 PM", loc:"Mount Mary Steps, Bandra", city:"Mumbai", interested:1400, img:"https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80" },
    ],
    thirdPlaces: [
      { id:1, name:"Cafe Aranya", cats:["Cafe","Community"], dist:"700 m", desc:"A cozy cafe with open seating and great coffee.", visitors:56, img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", addedBy:"Neha S." },
      { id:2, name:"Greenview Park", cats:["Nature","Relaxation"], dist:"1.2 km", desc:"Peaceful park perfect for a walk or some quiet time.", visitors:128, img:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80", addedBy:"Arjun M." },
      { id:3, name:"City Central Library", cats:["Study & Work"], dist:"1.6 km", desc:"Quiet space to read, study and focus.", visitors:94, img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80", addedBy:"Kavya R." },
      { id:4, name:"Kala Street Art Lane", cats:["Art & Culture"], dist:"1.9 km", desc:"Vibrant street art and creative community vibes.", visitors:76, img:"https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80", addedBy:"Rohit P." },
    ],
    people: [
      { id:1, ini:"A", name:"Ananya", age:26, city:"Mumbai", color:"#e8f0e8", tc:"#2d6a2d", photos:["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80","https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80","https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80"], prompts:[{q:"What recent incident changed your perspective on something and how?",a:"Losing my wallet while traveling alone taught me to be more adaptable and trust that things usually work out."},{q:"If you were the mayor for a day what's one thing you'd change about your city?",a:"I'd make public transport free for a day to see how much lighter the city feels without traffic."},{q:"What's something you've been curious about recently?",a:"How sustainable living can actually be affordable for everyone."}], cityWants:["Run NYC marathon","Join dance class","Watch latest movie in theater","Go for trekking","Learn cooking"], songs:[{title:"Lose Yourself",artist:"Eminem"},{title:"Heat Waves",artist:"Glass Animals"},{title:"The Night We Met",artist:"Lord Huron"}], recs:[{title:"Interstellar",type:"Movie"},{title:"Breaking Bad",type:"Series"},{title:"Our Planet",type:"Documentary"}] },
      { id:2, ini:"R", name:"Rohit", age:27, city:"Mumbai", color:"#e8eef5", tc:"#1a3a5c", photos:["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80","https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"], prompts:[{q:"What recent incident changed your perspective on something and how?",a:"Solo backpacking in the Himalayas taught me to slow down and truly appreciate the little things."},{q:"If you were the mayor for a day what's one thing you'd change about your city?",a:"I'd make public spaces more vibrant and accessible for everyone."},{q:"What's something you've been curious about recently?",a:"I've been trying to understand how AI can actually make everyday life better."}], cityWants:["Run half marathon","Learn guitar","Go for trekking","Watch stand-up comedy","Try new restaurants"], songs:[{title:"The Night We Met",artist:"Lord Huron"},{title:"Yellow",artist:"Coldplay"},{title:"Choo Lo",artist:"The Local Train"}], recs:[{title:"Interstellar",type:"Movie"},{title:"Breaking Bad",type:"Series"},{title:"Cosmos",type:"Documentary"}] },
    ],
  },
};

const CUISINES_LIST = ["All","Indian","Italian","Chinese","Japanese","Mexican","Thai","Continental","Dessert","Cafe","Middle Eastern","Korean","Mediterranean","Healthy","Street Food"];
const THIRD_CATS = ["All","Nature","Study & Work","Community","Art & Culture","Wellness"];
const EVENT_INTERESTS = [
  {name:"Music",icon:"🎵"},{name:"Art & Culture",icon:"🎨"},{name:"Workshops",icon:"✏️"},
  {name:"Sports",icon:"⚽"},{name:"Festivals",icon:"🎉"},{name:"Nightlife",icon:"🍸"},
  {name:"Health & Wellness",icon:"🌿"},{name:"Tech",icon:"💻"},{name:"Networking",icon:"👥"},
];
const PROMPTS_BANK = [
  "What recent incident changed your perspective on something and how?",
  "If you were the mayor for a day what's one thing you'd change about your city and why?",
  "What's something you've been curious about recently?",
  "If you could build an AI tool to solve any problem, what would it do?",
  "What school activity do you still miss?",
  "What myth would you change society's view on?",
  "What's a place in this city most people walk past without noticing?",
  "What's the last thing that made you genuinely laugh out loud?",
];

// ─── ONBOARDING ──────────────────────────────────────────────────────────────
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [city, setCity] = useState("");
  const [form, setForm] = useState({ name:"", age:"", email:"", phone:"" });
  const [profile, setProfile] = useState({ prompts:[{q:null,a:""},{q:null,a:""},{q:null,a:""}], cityWants:[], wantInput:"", songs:[], songInput:"", recs:[], recInput:"", recType:"Movie" });
  const next = () => setStep(s=>s+1), back = () => setStep(s=>s-1);
  const addWant = () => { if(profile.wantInput.trim()&&profile.cityWants.length<5) setProfile(p=>({...p,cityWants:[...p.cityWants,p.wantInput.trim()],wantInput:""})); };

  if (step === 0) return (
    <div className="ob-root">
      <div className="ob-hero">
        <div className="ob-hero-img" style={{backgroundImage:`url(https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800&q=80)`}}/>
        <div className="ob-hero-overlay"/>
        <div className="ob-hero-content"><div className="ob-logo-hero"><NearMetLogo size={52} dark/></div><p className="ob-hero-tagline">Explore your city.<br/>Find genuine connections.</p></div>
        <div className="ob-hero-bottom">
          <button className="ob-cta-primary" onClick={next}>Create an account</button>
          <button className="ob-cta-secondary" onClick={()=>onDone({city:"mumbai",name:"Alex",profile})}>I have an account</button>
          <p className="ob-legal">By signing up, you agree to our <span className="ob-link">Terms & Conditions</span>. See how we use your data in our <span className="ob-link">Privacy Policy</span>.</p>
        </div>
      </div>
    </div>
  );
  if (step === 1) return (
    <div className="ob-root ob-step">
      <div className="ob-step-label">STEP 1 OF 5 — YOUR CITY</div>
      <h2 className="ob-step-title">Which city are you in?</h2>
      <p className="ob-step-sub">NearMet is live in two cities right now. More coming soon.</p>
      <div className="ob-city-list">
        {[{id:"nyc",flag:"🗽",name:"New York City",sub:"All 5 boroughs · Live now"},{id:"mumbai",flag:"🇮🇳",name:"Mumbai",sub:"All areas · Live now"}].map(c=>(
          <button key={c.id} className={`ob-city-item ${city===c.id?"active":""}`} onClick={()=>setCity(c.id)}>
            <span className="ob-city-flag">{c.flag}</span>
            <div><div className="ob-city-name">{c.name}</div><div className="ob-city-sub">{c.sub}</div></div>
            <div className={`ob-radio ${city===c.id?"filled":""}`}/>
          </button>
        ))}
      </div>
      <div className="ob-nav-row"><button className="ob-back" onClick={back}>Back</button><button className="ob-next" disabled={!city} onClick={next}>Next →</button></div>
    </div>
  );
  if (step === 2) return (
    <div className="ob-root ob-step">
      <div className="ob-step-label">STEP 2 OF 5 — ACCOUNT</div>
      <h2 className="ob-step-title">Create your account</h2>
      <p className="ob-step-sub">Email and phone to verify you're real. No spam — ever.</p>
      <div className="ob-form">
        {[["Name","text","What do people call you?","name"],["Age","number","18+","age"],["Email","email","you@example.com","email"],["Phone Number","tel","+1 or +91","phone"]].map(([lbl,type,ph,key])=>(
          <div key={key} className="ob-field"><label className="ob-field-label">{lbl.toUpperCase()}</label><input className="ob-input" type={type} placeholder={ph} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/></div>
        ))}
      </div>
      <div className="ob-nav-row"><button className="ob-back" onClick={back}>Back</button><button className="ob-next" disabled={!form.name||!form.email} onClick={next}>Next →</button></div>
    </div>
  );
  if (step === 3) return (
    <div className="ob-root ob-step ob-step-scroll">
      <div className="ob-step-label">STEP 3 OF 5 — YOUR PROFILE</div>
      <h2 className="ob-step-title">Complete your profile</h2>
      <p className="ob-step-sub">Add a few details to help others know the real you.</p>
      <div className="ob-profile-section">
        <div className="ob-section-num">1</div>
        <div className="ob-section-content">
          <div className="ob-section-title">Prompts <span className="ob-section-count">{profile.prompts.filter(p=>p.q!==null).length}/3 completed</span></div>
          <div className="ob-section-sub">Answer at least 2. The 3rd is optional.</div>
          {profile.prompts.map((pr,idx)=>(
            <div key={idx} className="ob-prompt-item">
              {pr.q ? (<><div className="ob-prompt-q-active">{idx===2&&<span className="ob-optional">Optional: </span>}{pr.q}<button className="ob-prompt-toggle" onClick={()=>setProfile(p=>{const ps=[...p.prompts];ps[idx]={q:null,a:""};return{...p,prompts:ps};})}>↑</button></div><textarea className="ob-textarea" rows={3} value={pr.a} onChange={e=>setProfile(p=>{const ps=[...p.prompts];ps[idx]={...ps[idx],a:e.target.value};return{...p,prompts:ps};})}/><div className="ob-char-count">{pr.a.length}/200</div></>)
              : (<select className="ob-select" onChange={e=>{if(e.target.value) setProfile(p=>{const ps=[...p.prompts];ps[idx]={q:e.target.value,a:""};return{...p,prompts:ps};})}}><option value="">{idx===2?"(Optional) Choose a prompt...":"Choose a prompt..."}</option>{PROMPTS_BANK.map(q=><option key={q} value={q}>{q}</option>)}</select>)}
            </div>
          ))}
        </div>
      </div>
      <div className="ob-profile-section">
        <div className="ob-section-num">2</div>
        <div className="ob-section-content">
          <div className="ob-section-title">Things I want to do in the city <span className="ob-section-count">{profile.cityWants.length}/5 added</span></div>
          <div className="ob-tags-row">{profile.cityWants.map((w,i)=><span key={i} className="ob-tag">{w}<button onClick={()=>setProfile(p=>({...p,cityWants:p.cityWants.filter((_,j)=>j!==i)}))}>×</button></span>)}</div>
          {profile.cityWants.length<5&&<div className="ob-add-row"><input className="ob-input ob-add-input" placeholder="Add something..." value={profile.wantInput} onChange={e=>setProfile(p=>({...p,wantInput:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addWant()}/><button className="ob-add-btn" onClick={addWant}>Add</button></div>}
        </div>
      </div>
      <div className="ob-profile-section">
        <div className="ob-section-num">3</div>
        <div className="ob-section-content">
          <div className="ob-section-title">Music & entertainment</div>
          <div className="ob-media-grid">
            <div><div className="ob-media-label">Songs <span className="ob-section-count">{profile.songs.length}/3</span></div>{profile.songs.map((s,i)=><div key={i} className="ob-media-item"><div className="ob-media-thumb">🎵</div><div><div className="ob-media-title">{s.title}</div><div className="ob-media-artist">{s.artist}</div></div><button className="ob-remove" onClick={()=>setProfile(p=>({...p,songs:p.songs.filter((_,j)=>j!==i)}))}>×</button></div>)}{profile.songs.length<3&&<div className="ob-add-row"><input className="ob-input ob-add-input" placeholder="Song · Artist" value={profile.songInput} onChange={e=>setProfile(p=>({...p,songInput:e.target.value}))} onKeyDown={e=>{if(e.key==="Enter"&&profile.songInput.trim()){const[t,...r]=profile.songInput.split("·");setProfile(p=>({...p,songs:[...p.songs,{title:t.trim(),artist:(r.join("·")||"").trim()}],songInput:""}))}}}/><button className="ob-add-btn" onClick={()=>{if(profile.songInput.trim()){const[t,...r]=profile.songInput.split("·");setProfile(p=>({...p,songs:[...p.songs,{title:t.trim(),artist:(r.join("·")||"").trim()}],songInput:""}))}}}>Add</button></div>}</div>
            <div><div className="ob-media-label">Recommendations <span className="ob-section-count">{profile.recs.length}/3</span></div>{profile.recs.map((r,i)=><div key={i} className="ob-media-item"><div className="ob-media-thumb">🎬</div><div><div className="ob-media-title">{r.title}</div><div className="ob-media-artist">{r.type}</div></div><button className="ob-remove" onClick={()=>setProfile(p=>({...p,recs:p.recs.filter((_,j)=>j!==i)}))}>×</button></div>)}{profile.recs.length<3&&<div className="ob-add-row"><input className="ob-input ob-add-input" style={{flex:1}} placeholder="Title" value={profile.recInput} onChange={e=>setProfile(p=>({...p,recInput:e.target.value}))} onKeyDown={e=>{if(e.key==="Enter"&&profile.recInput.trim()){setProfile(p=>({...p,recs:[...p.recs,{title:p.recInput.trim(),type:p.recType}],recInput:""}))}}}/><select className="ob-select-sm" value={profile.recType} onChange={e=>setProfile(p=>({...p,recType:e.target.value}))}><option>Movie</option><option>Series</option><option>Documentary</option></select><button className="ob-add-btn" onClick={()=>{if(profile.recInput.trim()) setProfile(p=>({...p,recs:[...p.recs,{title:p.recInput.trim(),type:p.recType}],recInput:""}));}}>Add</button></div>}</div>
          </div>
        </div>
      </div>
      <button className="ob-save-btn" onClick={next}>Save & Continue</button>
    </div>
  );
  const cd = CITIES[city]||CITIES.mumbai;
  return (
    <div className="ob-root ob-step">
      <div className="ob-done-check">✓</div>
      <h2 className="ob-done-title">You're in, {form.name||"there"}.</h2>
      <p className="ob-step-sub" style={{textAlign:"center"}}>Your personal city agent is ready.</p>
      <div className="ob-done-section">YOUR AGENT SUGGESTS</div>
      <div className="ob-done-item"><div className="ob-done-icon">🍽️</div><div><div className="ob-done-name">{cd.food[0].name}</div><div className="ob-done-sub">{cd.food[0].hood} · matches your picks</div></div></div>
      <div className="ob-done-item"><div className="ob-done-icon">🎭</div><div><div className="ob-done-name">{cd.events[0].name}</div><div className="ob-done-sub">{cd.events[0].date} · {cd.events[0].loc}</div></div></div>
      <div className="ob-done-section">PEOPLE NEAR YOU</div>
      <div className="ob-done-item"><div className="ob-done-avatar" style={{background:cd.people[0].color,color:cd.people[0].tc}}>{cd.people[0].ini}</div><div><div className="ob-done-name">{cd.people[0].name}, {cd.people[0].age} · {cd.people[0].city}</div><div className="ob-done-sub">Resonates: {cd.people[0].cityWants.slice(0,3).join(", ")}</div></div></div>
      <button className="ob-save-btn" style={{marginTop:28}} onClick={()=>onDone({city,name:form.name||"Alex",profile})}>Go to my feed →</button>
    </div>
  );
}

// ─── FOOD DETAIL ──────────────────────────────────────────────────────────────
function FoodDetail({ restaurant, onBack }) {
  const [saved, setSaved] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  return (
    <div className="detail-root">
      <div className="detail-header">
        <button className="detail-back" onClick={onBack}>←</button>
        <div className="detail-header-title"><div>Spot details</div><div className="detail-header-sub">Click on a spot to view details</div></div>
        <div className="detail-header-actions"><button className="detail-action-btn" onClick={()=>setSaved(s=>!s)}>{saved?"🔖":"🔖"}</button><button className="detail-action-btn">↗</button></div>
      </div>
      <div className="detail-hero-img-wrap">
        <img src={restaurant.img} alt={restaurant.name} className="detail-hero-img"/>
        <div className="detail-photo-counter">{photoIdx+1}/5</div>
      </div>
      <div className="detail-body">
        <div className="detail-name-row"><div className="detail-name">{restaurant.name}</div><div className="detail-rating-pill">★ {restaurant.rating}</div></div>
        <div className="detail-meta">{restaurant.cuisine} • {restaurant.cuisine === "Seafood" ? "Seafood" : restaurant.cuisine}<br/>{restaurant.hood}, {restaurant.hood.includes("NYC")||restaurant.hood.includes("West Village")||restaurant.hood.includes("Brooklyn")||restaurant.hood.includes("Midtown")||restaurant.hood.includes("Bushwick")||restaurant.hood.includes("Murray Hill")?"New York":"Mumbai"}</div>
        <div className="detail-actions-row">
          {[["📞","Call"],["📍","Directions"],["↗","Share"],["🔖","Save"]].map(([ic,lbl])=>(
            <button key={lbl} className="detail-act-item" onClick={()=>lbl==="Call"&&window.open(`tel:${restaurant.phone}`)}><span className="detail-act-icon">{ic}</span><span className="detail-act-label">{lbl}</span></button>
          ))}
        </div>
        <div className="detail-divider"/>
        <div className="detail-section-title">About</div>
        <p className="detail-about">{restaurant.desc}</p>
        <div className="detail-divider"/>
        <div className="detail-photos-header"><span className="detail-section-title">Photos</span><button className="detail-viewall">View all</button></div>
        <div className="detail-photos-grid">{restaurant.photos.map((p,i)=><img key={i} src={p} alt="" className="detail-photo-thumb" onClick={()=>setPhotoIdx(i)}/>)}</div>
        <div className="detail-divider"/>
        <div className="detail-section-title">Menu Highlights</div>
        <div className="detail-menu">{restaurant.menu.map((m,i)=><div key={i} className="detail-menu-row"><span className="detail-menu-dot">•</span><span className="detail-menu-item">{m.item}</span><span className="detail-menu-price">{m.price}</span></div>)}</div>
        <button className="detail-fullmenu">View full menu</button>
      </div>
    </div>
  );
}

// ─── MAP VIEW ─────────────────────────────────────────────────────────────────
function MapView({ city, onBack, onSelectPlace }) {
  const cd = CITIES[city];
  const [filterOpen, setFilterOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState(["All"]);
  const [sortBy, setSortBy] = useState("Recommended");
  const [addForm, setAddForm] = useState({name:"",cuisine:"",address:"",phone:"",note:""});

  const toggleCuisine = (c) => {
    if (c === "All") { setSelectedCuisines(["All"]); return; }
    setSelectedCuisines(prev => {
      const without = prev.filter(x=>x!=="All");
      return without.includes(c) ? without.filter(x=>x!==c)||["All"] : [...without,c];
    });
  };

  return (
    <div className="map-root">
      <div className="map-header">
        <button className="detail-back" onClick={onBack}>←</button>
        <div><div className="map-header-title">Food near me</div><div className="map-header-sub">Recommendations for you</div></div>
      </div>
      {/* Fake map */}
      <div className="map-canvas">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=60" alt="map" className="map-bg"/>
        <div className="map-overlay"/>
        {/* User dot */}
        <div className="map-user-dot" style={{top:"45%",left:"45%"}}/>
        {/* Place pins */}
        {cd.mapPlaces.map(p=>(
          <button key={p.id} className="map-pin" style={{top:p.top,left:p.left}} onClick={()=>{ const found=cd.food.find(f=>f.name===p.name); if(found) onSelectPlace(found); }}>
            <div className="map-pin-icon">🍴</div>
            <div className="map-pin-label"><div className="map-pin-name">{p.name}</div><div className="map-pin-rating">★ {p.rating}</div></div>
          </button>
        ))}
      </div>
      <div className="map-bottom">
        <button className="map-filter-btn" onClick={()=>setFilterOpen(true)}>⚙ Filter</button>
        <button className="map-add-btn" onClick={()=>setAddOpen(true)}>+ Add a place</button>
        <div className="map-hint">ⓘ Tap on any place to view details</div>
      </div>

      {/* Filter Modal */}
      {filterOpen && (
        <div className="modal-bg" onClick={()=>setFilterOpen(false)}>
          <div className="modal-sheet filter-sheet" onClick={e=>e.stopPropagation()}>
            <div className="filter-header"><button className="filter-close" onClick={()=>setFilterOpen(false)}>✕</button><div className="filter-title">Filter</div><button className="filter-reset" onClick={()=>setSelectedCuisines(["All"])}>Reset</button></div>
            <div className="filter-section-title">Cuisines</div>
            <div className="filter-chips">{CUISINES_LIST.map(c=><button key={c} className={`filter-chip-item ${selectedCuisines.includes(c)?"active":""}`} onClick={()=>toggleCuisine(c)}>{c}</button>)}</div>
            <div className="filter-divider"/>
            <div className="filter-section-title">Sort by</div>
            {["Recommended","Highest Rated","Nearest"].map(s=>(
              <div key={s} className="filter-radio-row" onClick={()=>setSortBy(s)}>
                <div className={`filter-radio ${sortBy===s?"active":""}`}/>
                <span className={`filter-radio-label ${sortBy===s?"":""}`}>{s}</span>
              </div>
            ))}
            <button className="filter-apply" onClick={()=>setFilterOpen(false)}>Apply Filters</button>
          </div>
        </div>
      )}

      {/* Add Place Modal */}
      {addOpen && (
        <div className="modal-bg" onClick={()=>setAddOpen(false)}>
          <div className="modal-sheet add-sheet" onClick={e=>e.stopPropagation()}>
            <div className="filter-header"><button className="filter-close" onClick={()=>setAddOpen(false)}>✕</button><div className="filter-title">Add a new place</div><div/></div>
            <div className="add-photo-area"><span className="add-photo-icon">📷</span><div className="add-photo-label">Add photos<br/><span style={{fontSize:12,color:"#999"}}>(Up to 5 photos)</span></div></div>
            {[["Place name*","text","e.g. Your Place Name","name"],["Address*","text","e.g. Street, Area, City","address"],["Contact number","tel","e.g. 98765 43210","phone"]].map(([lbl,type,ph,key])=>(
              <div key={key} className="add-field"><label className="add-label">{lbl}</label><input className="ob-input" type={type} placeholder={ph} value={addForm[key]} onChange={e=>setAddForm({...addForm,[key]:e.target.value})}/></div>
            ))}
            <div className="add-field"><label className="add-label">Cuisine*</label><select className="ob-input ob-select" value={addForm.cuisine} onChange={e=>setAddForm({...addForm,cuisine:e.target.value})}><option value="">Select cuisine</option>{CUISINES_LIST.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}</select></div>
            <button className="add-location-btn">📍 Use current location</button>
            <div className="add-field"><label className="add-label">Add a note (optional)</label><input className="ob-input" placeholder="Share more about this place" value={addForm.note} onChange={e=>setAddForm({...addForm,note:e.target.value})}/></div>
            <button className="filter-apply" onClick={()=>setAddOpen(false)}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FOOD SCREEN ──────────────────────────────────────────────────────────────
function FoodScreen({ city, onOpenMap, onOpenDetail }) {
  const [likes, setLikes] = useState({});
  const [activeCat, setActiveCat] = useState(null);
  const cd = CITIES[city];
  const toggleLike = id => setLikes(p=>({...p,[id]:!p[id]}));
  const CATS = [{name:"Restaurants",icon:"🍴"},{name:"Cafes",icon:"☕"},{name:"Nightlife",icon:"🍸"},{name:"Buffet",icon:"🥘"},{name:"Desserts",icon:"🍰"}];
  const CUISINE_CIRCLES = [{name:"Indian",img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&q=80"},{name:"Italian",img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80"},{name:"Chinese",img:"https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=200&q=80"},{name:"Mexican",img:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&q=80"},{name:"Japanese",img:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&q=80"}];
  return (
    <div className="screen-body">
      <div className="section-hdr">
        <div><div className="sec-title">Recommendations for you</div><div className="sec-sub">Based on your taste and favorites</div></div>
        <button className="arrow-circ-btn" onClick={onOpenMap}>→</button>
      </div>
      <div className="food-hscroll">
        {cd.food.map(r=>(
          <div key={r.id} className="food-card" onClick={()=>onOpenDetail(r)}>
            <div className="food-card-img-wrap">
              <img src={r.img} alt={r.name} className="food-card-img"/>
              <button className="heart-btn" onClick={e=>{e.stopPropagation();toggleLike(r.id)}}>{likes[r.id]?"❤️":"🤍"}</button>
              <span className="food-tag-pill">{r.tag}</span>
            </div>
            <div className="food-card-body">
              <div className="food-name">{r.name}</div>
              <div className="food-price">{r.price}</div>
              <div className="food-rating">⭐ {r.rating}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-hdr" style={{marginTop:8}}><div className="sec-title">Browse by category</div></div>
      <div className="sec-sub" style={{marginBottom:14}}>Find the perfect spot for any craving</div>
      <div className="cat-row">
        {CATS.map(c=>(
          <button key={c.name} className={`cat-circle-btn ${activeCat===c.name?"active":""}`} onClick={()=>setActiveCat(activeCat===c.name?null:c.name)}>
            <div className="cat-circle-icon">{c.icon}</div>
            <div className="cat-circle-label">{c.name}</div>
          </button>
        ))}
      </div>

      <div className="section-hdr" style={{marginTop:24}}><div><div className="sec-title">Explore cuisines</div><div className="sec-sub">Discover flavors from around the world</div></div></div>
      <div className="cuisine-circles-row">
        {CUISINE_CIRCLES.map(c=>(
          <div key={c.name} className="cuisine-circle">
            <img src={c.img} alt={c.name} className="cuisine-circle-img"/>
            <div className="cuisine-circle-name">{c.name}</div>
          </div>
        ))}
      </div>

      <div className="section-hdr" style={{marginTop:24}}>
        <div><div className="sec-title">Top offers near you</div><div className="sec-sub">Great food at great prices</div></div>
        <button className="arrow-circ-btn">→</button>
      </div>
      <div className="offers-row">
        {cd.food.slice(0,3).map((r,i)=>(
          <div key={r.id} className="offer-card" onClick={()=>onOpenDetail(r)}>
            <img src={r.img} alt={r.name} className="offer-img"/>
            <button className="heart-btn offer-heart" onClick={e=>{e.stopPropagation();toggleLike(`o${r.id}`)}}>{likes[`o${r.id}`]?"❤️":"🤍"}</button>
            <span className="discount-pill">{["20% OFF","15% OFF","25% OFF"][i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EVENTS SCREEN ────────────────────────────────────────────────────────────
function EventsScreen({ city }) {
  const [interestsSelected, setInterestsSelected] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [bookmarks, setBookmarks] = useState({});
  const cd = CITIES[city];

  if (interestsSelected === null) return (
    <div className="events-interests-screen">
      <div className="events-interests-title">What interests you?</div>
      <div className="events-interests-sub">Select categories you enjoy. We'll show you events you'll love.</div>
      <div className="interests-grid">
        {EVENT_INTERESTS.map(i=>(
          <button key={i.name} className={`interest-grid-item ${selectedInterests.includes(i.name)?"active":""}`} onClick={()=>setSelectedInterests(prev=>prev.includes(i.name)?prev.filter(x=>x!==i.name):[...prev,i.name])}>
            <span className="interest-grid-icon">{i.icon}</span>
            <span className="interest-grid-name">{i.name}</span>
            <div className={`interest-grid-radio ${selectedInterests.includes(i.name)?"active":""}`}/>
          </button>
        ))}
      </div>
      <button className="ob-save-btn" style={{marginTop:24}} onClick={()=>setInterestsSelected(selectedInterests)}>Next</button>
    </div>
  );

  return (
    <div className="screen-body">
      <div className="section-hdr"><div><div className="sec-title">Recommendations for you</div><div className="sec-sub">Events based on your interests</div></div><button className="see-all-link">See all ›</button></div>
      <div className="events-list">
        {cd.events.map(e=>(
          <div key={e.id} className="event-list-item">
            <div className="event-list-img-wrap">
              <img src={e.img} alt={e.name} className="event-list-img"/>
              <div className="event-date-chip"><div className="event-date-num">{e.date.split(" ")[0]}</div><div className="event-date-mon">{e.date.split(" ")[1]}</div></div>
            </div>
            <div className="event-list-body">
              <div className="event-list-name">{e.name}</div>
              <div className="event-list-cats">{e.cats.map((c,i)=><span key={c}>{i>0&&" • "}<span style={{color:"var(--green)"}}>{c}</span></span>)}</div>
              <div className="event-list-meta"><span>📅 {e.date}</span></div>
              <div className="event-list-meta"><span>🕐 {e.time}</span></div>
              <div className="event-list-meta"><span>📍 {e.loc}, {e.city}</span></div>
              <div className="event-list-interested"><div className="event-avatars"><div className="ea"/><div className="ea"/><div className="ea"/></div><span className="event-interested-count">{e.interested>=1000?(e.interested/1000).toFixed(1)+"K":e.interested} interested</span></div>
            </div>
            <button className="event-bookmark" onClick={()=>setBookmarks(b=>({...b,[e.id]:!b[e.id]}))}>{bookmarks[e.id]?"🔖":"🔖"}</button>
          </div>
        ))}
      </div>
      <div className="create-event-cta">
        <div className="create-event-icon">📅</div>
        <div><div className="create-event-title">Create an event</div><div className="create-event-sub">Host your own event and invite people to join the experience.</div></div>
        <button className="create-event-btn">Create Event</button>
      </div>
    </div>
  );
}

// ─── THIRD PLACES SCREEN ─────────────────────────────────────────────────────
function ThirdPlacesScreen({ city }) {
  const [activeCat, setActiveCat] = useState("All");
  const [bookmarks, setBookmarks] = useState({});
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({name:"",address:"",phone:"",note:""});
  const cd = CITIES[city];
  const filtered = activeCat==="All" ? cd.thirdPlaces : cd.thirdPlaces.filter(p=>p.cats.includes(activeCat));
  const catColorMap = {"Nature":"#2d6a2d","Relaxation":"#5a8a2d","Study & Work":"#8b6914","Community":"#2980b9","Art & Culture":"#e67e22","Cafe":"#6d4c41","Wellness":"#8e44ad","Shopping":"#c0392b"};

  return (
    <div className="screen-body">
      <div className="tp-header-row">
        <div><div className="sec-title" style={{fontSize:22}}>Nearby third places</div><div className="sec-sub">Relax, connect & recharge</div></div>
        <button className="tp-filter-btn">⚙ Filter</button>
      </div>
      <div className="filter-scroll-row">
        {THIRD_CATS.map(c=>(
          <button key={c} className={`filter-pill ${activeCat===c?"active":""}`} onClick={()=>setActiveCat(c)}>
            {c==="All"&&<span style={{marginRight:4}}>⊞</span>}{c}
          </button>
        ))}
      </div>
      <div className="tp-location-hint">📍 Near you • Within 5 km</div>
      <div className="tp-list">
        {filtered.map(p=>(
          <div key={p.id} className="tp-list-item">
            <img src={p.img} alt={p.name} className="tp-list-img"/>
            <div className="tp-list-body">
              <div className="tp-list-name">{p.name}</div>
              <div className="tp-list-cats">{p.cats.map((c,i)=><span key={c} style={{color:catColorMap[c]||"#2d6a2d"}}>{i>0&&" • "}{c}</span>)}</div>
              <div className="tp-list-dist">📍 {p.dist} away</div>
              <div className="tp-list-desc">{p.desc}</div>
              <div className="tp-list-visitors"><div className="event-avatars"><div className="ea"/><div className="ea"/><div className="ea"/></div><span style={{fontSize:12,color:"#666",marginLeft:4}}>{p.visitors} people visited</span></div>
            </div>
            <button className="event-bookmark" onClick={()=>setBookmarks(b=>({...b,[p.id]:!b[p.id]}))}>{bookmarks[p.id]?"🔖":"🔖"}</button>
          </div>
        ))}
      </div>

      <div className="add-tp-cta">
        <div className="add-tp-title">Add a third place</div>
        <div className="add-tp-sub">Know a great spot? Add it and help others discover amazing places.</div>
        <button className="add-tp-btn" onClick={()=>setAddOpen(true)}>Add a place</button>
        <div className="add-tp-steps">
          <div className="add-tp-step"><span className="add-tp-step-icon">📷</span><span>Add photos<br/>(Up to 5)</span></div>
          <div className="add-tp-step"><span className="add-tp-step-icon">📍</span><span>Add location<br/>(GPS)</span></div>
          <div className="add-tp-step"><span className="add-tp-step-icon">✏️</span><span>Tell us about the place<br/>(Name, type, description)</span></div>
        </div>
      </div>

      {addOpen&&(
        <div className="modal-bg" onClick={()=>setAddOpen(false)}>
          <div className="modal-sheet add-sheet" onClick={e=>e.stopPropagation()}>
            <div className="filter-header"><button className="filter-close" onClick={()=>setAddOpen(false)}>✕</button><div className="filter-title">Add a new place</div><div/></div>
            <div className="add-photo-area"><span className="add-photo-icon">📷</span><div className="add-photo-label">Add photos<br/><span style={{fontSize:12,color:"#999"}}>(Up to 5 photos)</span></div></div>
            {[["Place name*","text","e.g. Your Place Name","name"],["Address*","text","e.g. Street, Area, City","address"],["Contact number","tel","e.g. 98765 43210","phone"]].map(([lbl,type,ph,key])=>(
              <div key={key} className="add-field"><label className="add-label">{lbl}</label><input className="ob-input" type={type} placeholder={ph} value={addForm[key]} onChange={e=>setAddForm({...addForm,[key]:e.target.value})}/></div>
            ))}
            <button className="add-location-btn">📍 Use current location</button>
            <div className="add-field"><label className="add-label">Add a note (optional)</label><input className="ob-input" placeholder="Share more about this place" value={addForm.note} onChange={e=>setAddForm({...addForm,note:e.target.value})}/></div>
            <button className="filter-apply" onClick={()=>setAddOpen(false)}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DISCOVERY SCREEN ────────────────────────────────────────────────────────
function DiscoveryScreen({ city }) {
  const [subTab, setSubTab] = useState("food");
  const [mapOpen, setMapOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(null);

  if (mapOpen) return <MapView city={city} onBack={()=>setMapOpen(false)} onSelectPlace={r=>{setMapOpen(false);setDetailOpen(r);}}/>;
  if (detailOpen) return <FoodDetail restaurant={detailOpen} onBack={()=>setDetailOpen(null)}/>;

  return (
    <div className="discovery-root">
      <div className="search-wrap">
        <div className="search-box"><span className="search-icon">🔍</span><span className="search-placeholder">Start your search</span></div>
        <button className="search-filter-btn">⚙</button>
      </div>
      <div className="sub-tabs-wrap">
        <div className="sub-tabs">
          {[["food","🍔","Food"],["events","🎟️","Events"],["places","🌳","Third Places"]].map(([id,icon,lbl])=>(
            <button key={id} className={`sub-tab ${subTab===id?"active":""}`} onClick={()=>setSubTab(id)}>
              <span className="sub-tab-icon">{icon}</span>
              <span className="sub-tab-label">{lbl}</span>
            </button>
          ))}
        </div>
      </div>
      {subTab==="food"   && <FoodScreen city={city} onOpenMap={()=>setMapOpen(true)} onOpenDetail={setDetailOpen}/>}
      {subTab==="events" && <EventsScreen city={city}/>}
      {subTab==="places" && <ThirdPlacesScreen city={city}/>}
    </div>
  );
}

// ─── CONNECTION SCREEN ────────────────────────────────────────────────────────
function ConnectionScreen({ city }) {
  const cd = CITIES[city];
  const [passed, setPassed] = useState([]);
  const [openProfile, setOpenProfile] = useState(null);
  const [resonateModal, setResonateModal] = useState(null);
  const [resonateText, setResonateText] = useState("");
  const [resonated, setResonated] = useState({});
  const [accepted, setAccepted] = useState({});
  const [chatOpen, setChatOpen] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chats, setChats] = useState({});
  const [photoIdx, setPhotoIdx] = useState(0);

  const people = cd.people.filter(p=>!passed.includes(p.id));
  const current = people[0];

  const passProfile = () => { if(!current) return; setPassed(p=>[...p,current.id]); setPhotoIdx(0); };
  const sendResonate = () => {
    if (!resonateModal||resonateText.trim().length<5) return;
    const key=`${resonateModal.pid}-${resonateModal.qi}`;
    setResonated(r=>({...r,[key]:true})); const m=resonateModal; setResonateModal(null); setResonateText("");
    setTimeout(()=>setAccepted(a=>({...a,[m.pid]:true})),1500);
  };
  const sendChat = (pid) => {
    if (!chatInput.trim()) return;
    const replies=["That's so interesting!","Haha yes! We should do that.","Same! Let's plan something.","Okay now I really want to check that out."];
    setChats(c=>({...c,[pid]:[...(c[pid]||[]),{text:chatInput,me:true}]})); setChatInput("");
    setTimeout(()=>setChats(c=>({...c,[pid]:[...(c[pid]||[]),{text:replies[Math.floor(Math.random()*replies.length)],me:false}]})),900);
  };

  if (chatOpen) {
    const p=chatOpen; const msgs=chats[p.id]||[];
    return (
      <div className="chat-root">
        <div className="chat-header"><button className="chat-back" onClick={()=>setChatOpen(null)}>←</button><div className="chat-avatar" style={{background:p.color,color:p.tc}}>{p.ini}</div><div><div className="chat-uname">{p.name}</div><div className="chat-ustatus">● Connected</div></div></div>
        <div className="chat-msgs">{msgs.length===0&&<div className="chat-empty"><div style={{fontSize:28}}>✦</div><p>Connected with {p.name}. Say hello.</p></div>}{msgs.map((m,i)=><div key={i} className={`chat-bubble ${m.me?"me":""}`}>{m.text}</div>)}</div>
        <div className="chat-input-row"><input className="chat-input" value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat(p.id)} placeholder="Say something..."/><button className="chat-send" onClick={()=>sendChat(p.id)}>Send</button></div>
      </div>
    );
  }

  if (openProfile) {
    const p=openProfile;
    return (
      <div className="pv-root">
        <div className="pv-header"><button className="pv-back" onClick={()=>setOpenProfile(null)}>←</button><div className="pv-menu">···</div></div>
        <div className="pv-name">{p.name}, {p.age}</div><div className="pv-city">{p.city}</div>
        <div className="pv-photos">{p.photos.map((ph,i)=><img key={i} src={ph} alt="" className="pv-photo"/>)}</div>
        <div className="pv-section-title">Prompts</div>
        {p.prompts.map((pr,qi)=>{
          const key=`${p.id}-${qi}`;
          return (<div key={qi} className="pv-prompt" onClick={()=>{if(!resonated[key]){setResonateModal({pid:p.id,qi,text:pr.a});setResonateText("");}}}>
            <div className="pv-prompt-q">{pr.q}</div>
            <div className="pv-prompt-a">{pr.a}</div>
            {resonated[key]?<div className="pv-resonated">💬 Resonated</div>:<div className="pv-tap">💬 Tap to resonate</div>}
          </div>);
        })}
        <div className="pv-section-title">Things I want to do</div>
        <div className="pv-tags">{p.cityWants.map(w=><span key={w} className="pv-tag">{w}</span>)}</div>
        <div className="pv-section-title">Music & entertainment</div>
        <div className="pv-media-grid">
          <div><div className="pv-media-label">Songs</div>{p.songs.map((s,i)=><div key={i} className="pv-media-row"><div className="pv-thumb">🎵</div><div><div className="pv-mt">{s.title}</div><div className="pv-ma">{s.artist}</div></div></div>)}</div>
          <div><div className="pv-media-label">Recommendations</div>{p.recs.map((r,i)=><div key={i} className="pv-media-row"><div className="pv-thumb">🎬</div><div><div className="pv-mt">{r.title}</div><div className="pv-ma">{r.type}</div></div></div>)}</div>
        </div>
        {accepted[p.id]&&<button className="pv-chat-btn" onClick={()=>{setOpenProfile(null);setChatOpen(p);}}>Chat with {p.name} →</button>}
      </div>
    );
  }

  return (
    <div className="conn-root">
      {current ? (
        <div className="conn-layout">
          <div className="conn-card">
            <div className="conn-img-wrap">
              <img src={current.photos[photoIdx]||current.photos[0]} alt={current.name} className="conn-img"/>
              <div className="conn-nav-prev" onClick={()=>setPhotoIdx(i=>Math.max(0,i-1))}/>
              <div className="conn-nav-next" onClick={()=>setPhotoIdx(i=>Math.min(current.photos.length-1,i+1))}/>
              <div className="conn-info"><div className="conn-name">{current.name}, {current.age}</div><div className="conn-city">{current.city}</div></div>
              <div className="conn-dots">{current.photos.map((_,i)=><span key={i} className={`conn-dot ${i===photoIdx?"active":""}`}/>)}</div>
            </div>
            <button className="conn-view-profile" onClick={()=>setOpenProfile(current)}>Tap to view the profile</button>
          </div>
          <div className="conn-prompts">
            {current.prompts.slice(0,2).map((pr,qi)=>{
              const key=`${current.id}-${qi}`;
              return (<div key={qi} className="conn-prompt" onClick={()=>{if(!resonated[key]){setResonateModal({pid:current.id,qi,text:pr.a});setResonateText("");}}}>
                <div className="conn-prompt-q">{pr.q}</div>
                <div className="conn-prompt-a">{pr.a}</div>
                {resonated[key]?<div className="conn-resonated">✓ Resonated</div>:<div className="conn-tap-hint">💬 0</div>}
              </div>);
            })}
            {accepted[current.id]&&<button className="conn-chat-btn" onClick={()=>setChatOpen(current)}>Chat with {current.name} →</button>}
            <button className="conn-pass-btn" onClick={passProfile}>Pass ›</button>
          </div>
        </div>
      ) : <div className="conn-empty"><div style={{fontSize:42}}>🎉</div><div className="conn-empty-title">You're all caught up!</div></div>}

      {resonateModal&&(
        <div className="modal-bg" onClick={()=>setResonateModal(null)}>
          <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
            <div className="modal-handle"/>
            <div className="modal-label">Resonating with this answer</div>
            <div className="modal-quote">"{resonateModal.text}"</div>
            <textarea className="modal-ta" rows={3} value={resonateText} onChange={e=>setResonateText(e.target.value)} placeholder="What resonated with you? Be specific..."/>
            <div className="modal-footer"><span className="modal-count">{resonateText.length}/240</span><button className="modal-send" disabled={resonateText.trim().length<5} onClick={sendResonate}>Send</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────
function ProfileScreen({ user, onSignOut }) {
  const cd = CITIES[user.city];
  return (
    <div className="profile-root">
      <div className="profile-header-row"><div className="profile-title">Complete your profile</div><div className="profile-progress"><svg width="44" height="44"><circle cx="22" cy="22" r="18" fill="none" stroke="#e0e0e0" strokeWidth="3"/><circle cx="22" cy="22" r="18" fill="none" stroke="#2d6a2d" strokeWidth="3" strokeDasharray="113" strokeDashoffset="28" strokeLinecap="round" transform="rotate(-90 22 22)"/><text x="22" y="26" textAnchor="middle" fontSize="10" fontWeight="700" fill="#2d6a2d">75%</text></svg></div></div>
      <div className="profile-header-sub">Add a few details to help others know the real you.</div>
      <div className="profile-section">
        <div className="profile-sec-num">1</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Basic info <span className="profile-sec-note">This will be visible on your profile.</span></div>
          <div className="profile-basic-grid">
            <div className="profile-field"><label>Name</label><div className="profile-field-val">{user.name} 👤</div></div>
            <div className="profile-field"><label>Age</label><div className="profile-field-val">26 📅</div></div>
            <div className="profile-field"><label>City</label><div className="profile-field-val">{cd.label} 📍</div></div>
          </div>
        </div>
      </div>
      <div className="profile-section">
        <div className="profile-sec-num">2</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Personal photos <span className="profile-sec-count">3/3 photos added</span></div>
          <div className="profile-sec-sub">Add 3 photos to help others recognize you.</div>
          <div className="photos-grid">{[1,2,3].map(i=><div key={i} className="photo-slot"><div className="photo-num">{i}</div><div className="photo-placeholder">📷</div><div className="photo-remove">×</div></div>)}<div className="photo-add">📷<br/>Add Photo</div></div>
        </div>
      </div>
      <div className="profile-section">
        <div className="profile-sec-num">3</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Prompts <span className="profile-sec-count">2/3 completed</span></div>
          <div className="profile-sec-sub">Answer at least 2 prompts. The 3rd one is optional.</div>
          {cd.people[0].prompts.map((pr,i)=>(
            <div key={i} className="profile-prompt-item"><div className="profile-prompt-q">{i===2&&<span className="ob-optional">Optional: </span>}{pr.q}<span className="profile-prompt-chevron">↓</span></div><div className="profile-prompt-a">{pr.a}</div><div className="profile-prompt-count">{pr.a.length}/200</div></div>
          ))}
          <button className="ob-link-btn">🎲 Choose from 20 prompts</button>
        </div>
      </div>
      <div className="profile-section">
        <div className="profile-sec-num">4</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Things I want to do in the city <span className="profile-sec-count">5/5 added</span></div>
          <div className="ob-tags-row">{cd.people[0].cityWants.map((w,i)=><span key={i} className="ob-tag">{w}<button>×</button></span>)}</div>
        </div>
      </div>
      <div className="profile-section">
        <div className="profile-sec-num">5</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Music & entertainment</div>
          <div className="ob-media-grid">
            <div><div className="ob-media-label">Songs <span className="ob-section-count">3/3 added</span></div>{cd.people[0].songs.map((s,i)=><div key={i} className="ob-media-item"><div className="ob-media-thumb">🎵</div><div><div className="ob-media-title">{s.title}</div><div className="ob-media-artist">{s.artist}</div></div><span>×</span></div>)}</div>
            <div><div className="ob-media-label">Recommendations <span className="ob-section-count">3/3 added</span></div>{cd.people[0].recs.map((r,i)=><div key={i} className="ob-media-item"><div className="ob-media-thumb">🎬</div><div><div className="ob-media-title">{r.title}</div><div className="ob-media-artist">{r.type}</div></div><span>×</span></div>)}</div>
          </div>
        </div>
      </div>
      <button className="ob-save-btn">Save & Continue</button>
      <p style={{textAlign:"center",fontSize:12,color:"#999",margin:"8px 0 16px"}}>You can edit this later</p>
      <button className="profile-signout" onClick={onSignOut}>Sign Out</button>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("discovery");

  if (!user) return <Onboarding onDone={u=>{setUser(u);setTab("discovery");}}/>;

  return (
    <div className="app-root">
      <header className="topnav">
        <div className="topnav-inner">
          <NearMetLogo size={26}/>
          <nav className="topnav-links">
            {[["discovery","Discovery"],["connection","Connection"],["profile","Profile"]].map(([id,lbl])=>(
              <button key={id} className={`tnav-link ${tab===id?"active":""}`} onClick={()=>setTab(id)}>{lbl}</button>
            ))}
          </nav>
          <div className="topnav-right">
            <span className="city-pill">📍 {user.city==="nyc"?"NYC":"Mumbai"}</span>
            <div className="user-chip">{user.name.slice(0,2).toUpperCase()}</div>
          </div>
        </div>
      </header>
      <main className="site-main">
        {tab==="discovery"  && <DiscoveryScreen city={user.city}/>}
        {tab==="connection" && <ConnectionScreen city={user.city}/>}
        {tab==="profile"    && <ProfileScreen user={user} onSignOut={()=>setUser(null)}/>}
      </main>
    </div>
  );
}