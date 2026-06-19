import { useState, useEffect } from "react";
import "./App.css";
import { useAuth } from "./context/AuthContext.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { signOut, updateProfile, uploadProfilePhoto, uploadFoodExperiencePhoto, getFoodExperiences, shareFoodExperience, deleteFoodExperience, getPeople, passProfile, getOrCreateConnection, getConnections, getMessages, sendMessage } from "./lib/supabase.js";

// ─── LOGO ────────────────────────────────────────────────────────────────────
function NearMetLogo({ size = 28, dark = false }) {
  return (
    <span className="nm-logo" style={{ fontSize: size }}>
      <span style={{ color: dark ? "#f5f5f0" : "#1a2e1a" }}>Near</span>
      <span style={{ color: dark ? "#8aad6e" : "#2d6a2d" }}>Met</span>
    </span>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CITIES = {
  nyc: {
    label: "New York City", cur: "$",
    food: [
      { id:1, name:"Olive Bistro", cuisine:"Italian", price:"$1,500 for two", rating:4.7, tag:"High rated", hood:"West Village", desc:"A cozy Italian bistro with warm lighting and exceptional pasta.", phone:"+1 212-555-0101", img:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", photos:["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80"], menu:[{item:"Truffle Pasta",price:"$28"},{item:"Branzino",price:"$34"},{item:"Tiramisu",price:"$12"},{item:"Margherita",price:"$18"}] },
      { id:2, name:"Sakura Sushi", cuisine:"Japanese", price:"$1,200 for two", rating:4.6, tag:"Near you", hood:"East Village", desc:"A cozy sushi place offering authentic Japanese cuisine with a modern touch.", phone:"+1 212-555-0202", img:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80", photos:["https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80"], menu:[{item:"Spicy Tuna Roll",price:"$18"},{item:"Salmon Sashimi",price:"$22"},{item:"Dragon Roll",price:"$24"},{item:"Miso Ramen",price:"$16"}] },
      { id:3, name:"La Pizzeria", cuisine:"Italian", price:"$1,000 for two", rating:4.5, tag:"Best for dinner", hood:"Brooklyn", desc:"Wood-fired Neapolitan pizza made with imported Italian ingredients.", phone:"+1 718-555-0303", img:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80", photos:["https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80"], menu:[{item:"Margherita",price:"$16"},{item:"Truffle Pizza",price:"$24"},{item:"Burrata",price:"$14"},{item:"Tiramisu",price:"$10"}] },
      { id:4, name:"Truffle House", cuisine:"Continental", price:"$1,800 for two", rating:4.4, tag:"Popular", hood:"Midtown", desc:"Fine dining with an emphasis on truffle-infused seasonal ingredients.", phone:"+1 212-555-0404", img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", photos:["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80"], menu:[{item:"Truffle Risotto",price:"$42"},{item:"Wagyu Beef",price:"$68"},{item:"Lobster Bisque",price:"$28"},{item:"Crème Brûlée",price:"$16"}] },
      { id:5, name:"Bunna Cafe", cuisine:"Ethiopian", price:"$800 for two", rating:4.8, tag:"Hidden gem", hood:"Bushwick", desc:"Authentic Ethiopian food in a warm communal setting.", phone:"+1 347-555-0505", img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80"], menu:[{item:"Injera Platter",price:"$24"},{item:"Tibs",price:"$18"},{item:"Kitfo",price:"$20"},{item:"Tej Honey Wine",price:"$8"}] },
      { id:6, name:"Saravana Bhavan", cuisine:"Indian", price:"$600 for two", rating:4.7, tag:"Family fav", hood:"Murray Hill", desc:"South Indian classics done right. The masala dosa is legendary.", phone:"+1 212-555-0606", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80", photos:["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Masala Dosa",price:"$12"},{item:"Idli Sambar",price:"$9"},{item:"Thali",price:"$16"},{item:"Filter Coffee",price:"$4"}] },
    ],
    mapPlaces: [
      {id:1,name:"Olive Bistro",rating:4.7,top:"28%",left:"18%"},{id:2,name:"Sakura Sushi",rating:4.6,top:"32%",left:"62%"},{id:3,name:"Safar's Eats",rating:4.5,top:"45%",left:"35%"},{id:4,name:"La Pizzeria",rating:4.5,top:"50%",left:"65%"},{id:5,name:"Goodfellas Cafe",rating:4.4,top:"58%",left:"22%"},{id:6,name:"Bastian",rating:4.4,top:"62%",left:"68%"},{id:7,name:"Truffle House",rating:4.4,top:"70%",left:"42%"},{id:8,name:"The Daily All Day",rating:4.3,top:"78%",left:"32%"},{id:9,name:"PizzaExpress",rating:4.3,top:"87%",left:"72%"},
    ],
    events: [
      { id:1, name:"Indie Night Live Concert", cats:["Music","Nightlife"], date:"24", mon:"May", fullDate:"24 May 2025", time:"7:00 PM – 10:30 PM", loc:"Bandra Fort Amphitheatre, NYC", entry:"Free Entry", interested:1800, img:"https://images.unsplash.com/photo-1501386761578-eaa54b02c811?w=700&q=80", desc:"An evening of indie music featuring local artists. Great vibes, great crowd.", organizer:"The Habitat", mapTop:"28%", mapLeft:"22%" },
      { id:2, name:"Art Festival 2025", cats:["Art & Culture","Festivals"], date:"25", mon:"May", fullDate:"25 May 2025", time:"11:00 AM – 7:00 PM", loc:"Jio World Garden, BKC", entry:"Paid", interested:2300, img:"https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=700&q=80", desc:"A celebration of contemporary art featuring 80+ artists from across the city.", organizer:"Art Collective NYC", mapTop:"35%", mapLeft:"58%" },
      { id:3, name:"Rooftop Social Mixer", cats:["Networking","Nightlife"], date:"26", mon:"May", fullDate:"26 May 2025", time:"6:30 PM – 10:00 PM", loc:"AER Bar, Midtown", entry:"Paid", interested:950, img:"https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=700&q=80", desc:"Meet interesting people over drinks with a stunning city view.", organizer:"Social NYC", mapTop:"50%", mapLeft:"40%" },
      { id:4, name:"Jazz in the Park", cats:["Music"], date:"25", mon:"May", fullDate:"25 May 2025", time:"6:00 PM – 9:00 PM", loc:"Five Gardens, Central Park", entry:"Free Entry", interested:640, img:"https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=700&q=80", desc:"An evening of smooth jazz, good vibes and great company under the open sky.", organizer:"Park Events NYC", mapTop:"44%", mapLeft:"72%" },
      { id:5, name:"Open Mic Night", cats:["Comedy","Music"], date:"30", mon:"May", fullDate:"30 May 2025", time:"8:00 PM – 11:00 PM", loc:"Alt Media Centre, Queens", entry:"Free Entry", interested:180, img:"https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=700&q=80", desc:"NYC's most loved open mic. Comedians, musicians, poets — all welcome.", organizer:"Alt Media", mapTop:"32%", mapLeft:"54%" },
    ],
    thirdPlaces: [
      { id:1, name:"Cafe Aranya", cats:["Cafe","Community"], dist:"700 m", desc:"A cozy cafe with open seating and great coffee.", visitors:56, img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", addedBy:"Sarah K." },
      { id:2, name:"Greenview Park", cats:["Nature","Relaxation"], dist:"1.2 km", desc:"Peaceful park perfect for a walk or some quiet time.", visitors:128, img:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80", addedBy:"Mike R." },
      { id:3, name:"City Central Library", cats:["Study & Work"], dist:"1.6 km", desc:"Quiet space to read, study and focus.", visitors:94, img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80", addedBy:"Jin L." },
      { id:4, name:"Kala Street Art Lane", cats:["Art & Culture"], dist:"1.9 km", desc:"Vibrant street art and creative community vibes.", visitors:76, img:"https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80", addedBy:"Priya S." },
    ],
    people: [
      { id:1, ini:"R", name:"Rohit", age:26, city:"New York", color:"#e8f0e8", tc:"#2d6a2d",
        photos:["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80","https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"],
        interests:["Travel","Books","Live Music","Food & Dining","Art & Culture","Photography","Fitness","Films"],
        sharedInterests:["Live Music","Food & Dining","Photography"],
        prompts:[{q:"What recent incident changed your perspective on something and how?",a:"Solo backpacking in the Himalayas taught me to slow down and truly appreciate the little things."},{q:"If you were the mayor for a day what's one thing you'd change about your city?",a:"I'd make public spaces more vibrant and accessible for everyone."},{q:"What's something you've been curious about recently?",a:"I've been trying to understand how AI can actually make everyday life better."}],
        cityWants:["Run half marathon","Learn guitar","Go for trekking","Watch stand-up comedy","Try new restaurants"],
        sharedThings:["Attend a live music gig","Try new restaurants"],
        songs:[{title:"The Night We Met",artist:"Lord Huron"},{title:"Yellow",artist:"Coldplay"},{title:"Choo Lo",artist:"The Local Train"}],
        recs:[{title:"Interstellar",type:"Movie"},{title:"Breaking Bad",type:"Series"},{title:"Cosmos",type:"Documentary"}],
        foodRecs:[{name:"The Bombay Canteen, Lower Parel",desc:"Modern Indian cuisine with a twist",img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&q=80"},{name:"Bastian, Bandra",desc:"Seafood · Great ambience",img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80"},{name:"Leopold Cafe, Colaba",desc:"Classic vibes and comfort food",img:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80"}],
        cityRecs:[{name:"Marine Drive",desc:"Perfect sunset walks and sea breeze",img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80"},{name:"Worli Sea Face",desc:"Peaceful evenings by the sea",img:"https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=200&q=80"},{name:"Sanjay Gandhi National Park",desc:"Best for a morning trek",img:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80"}],
      },
      { id:2, ini:"A", name:"Aisha", age:24, city:"New York", color:"#f0e8e8", tc:"#8b2020",
        photos:["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80","https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80","https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80"],
        interests:["Art & Culture","Photography","Food & Dining","Books","Wellness","Films"],
        sharedInterests:["Photography","Food & Dining"],
        prompts:[{q:"What recent incident changed your perspective on something and how?",a:"Watching sunrise at the Hudson taught me that the best moments are the unplanned ones."},{q:"If you were the mayor for a day what's one thing you'd change?",a:"I'd convert every empty lot into a community garden. Green spaces change how people feel."}],
        cityWants:["Take a pottery class","Find the best bagel in NYC","See a Broadway show","Join a book club","Learn to skateboard"],
        sharedThings:["Explore hidden bookstores"],
        songs:[{title:"Heat Waves",artist:"Glass Animals"},{title:"Blinding Lights",artist:"The Weeknd"}],
        recs:[{title:"Everything Everywhere",type:"Movie"},{title:"Fleabag",type:"Series"}],
        foodRecs:[{name:"Russ & Daughters, Lower East Side",desc:"Iconic NYC deli since 1914",img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=200&q=80"},{name:"Superiority Burger, East Village",desc:"Best vegetarian burger in the city",img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80"}],
        cityRecs:[{name:"The High Line",desc:"Best walk in Manhattan",img:"https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&q=80"},{name:"Brooklyn Bridge at sunset",desc:"Worth the walk every time",img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80"}],
      },
      { id:3, ini:"M", name:"Marcus", age:28, city:"New York", color:"#e8eef5", tc:"#1a3a5c",
        photos:["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80","https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80","https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80"],
        interests:["Live Music","Films","Books","Outdoors","Food & Dining"],
        sharedInterests:["Live Music","Books"],
        prompts:[{q:"What school activity do you still miss?",a:"Jazz band rehearsals. There's something about creating something together in real time that can't be replicated."},{q:"What myth would you change society's view on?",a:"That you need to be extroverted to build genuine connections. The deepest ones I have are with fellow introverts."}],
        cityWants:["Brooklyn Bridge at sunset","Find best jazz bar","Try Ethiopian food in Bushwick","Take a cooking class","Run a 10k"],
        sharedThings:["Attend a live music gig"],
        songs:[{title:"So What",artist:"Miles Davis"},{title:"Redbone",artist:"Childish Gambino"}],
        recs:[{title:"Moonlight",type:"Movie"},{title:"The Wire",type:"Series"},{title:"13th",type:"Documentary"}],
        foodRecs:[{name:"Bunna Cafe, Bushwick",desc:"Authentic Ethiopian — get the injera platter",img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=200&q=80"},{name:"Di Fara Pizza, Brooklyn",desc:"Best slice in New York, no contest",img:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80"}],
        cityRecs:[{name:"Prospect Park, Brooklyn",desc:"The real Central Park",img:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80"},{name:"DUMBO at night",desc:"Manhattan Bridge view is unreal",img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80"}],
      },
    ],
  },
  mumbai: {
    label: "Mumbai", cur: "₹",
    food: [
      { id:1, name:"Leopold Cafe", cuisine:"Multi-cuisine", price:"₹2600 for two", rating:4.2, tag:"Trending", hood:"Colaba", address:"Shahid Bhagat Singh Road, Colaba Causeway, Apollo Bandar, Colaba, Mumbai, Maharashtra 400001", desc:"Multi-cuisine spot in Colaba. Known for chicken tikka, sizzlers.", phone:"+91 85858 28201", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Chicken Tikka",price:"₹—"},{item:"Sizzlers",price:"₹—"},{item:"Beer",price:"₹—"},{item:"Club Sandwich",price:"₹—"}] },
      { id:2, name:"Mag St.", cuisine:"Café & Restaurant", price:"₹2000-2900 for two", rating:4.4, tag:"Must visit", hood:"Colaba", address:"Mag St., 4, Mandlik Rd, Apollo Bandar, Colaba, Mumbai, Maharashtra 400001", desc:"A popular Colaba café known for its inviting atmosphere, excellent bakery selection and diverse menu — a favourite for everything from casual meals to weekend outings.", phone:"+91 72085 44366", img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Lobster Roll",price:"₹—"},{item:"Truffle Fries",price:"₹—"},{item:"Wasabi Prawns",price:"₹—"},{item:"Avocado Salad",price:"₹—"}] },
      { id:3, name:"Aram Vada Pav", cuisine:"Street Food", price:"₹200 for two", rating:4.3, tag:"Popular", hood:"CST", address:"Capital Cinema Building, 126, Dr Dadabhai Naoroji Rd, opp. CSMT, Fort, Mumbai, Maharashtra 400001", desc:"Street Food spot in CST. Known for vada pav, cheese vada pav.", phone:"+91 86557 12155", img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Vada Pav",price:"₹—"},{item:"Cheese Vada Pav",price:"₹—"},{item:"Butter Vada Pav",price:"₹—"},{item:"Samosa Pav",price:"₹—"}] },
      { id:4, name:"Araku Coffee", cuisine:"Specialty Coffee Café", price:"₹2000 for two", rating:4.2, tag:"Local fav", hood:"Colaba", address:"Sunny House, Mandlik Rd, Apollo Bandar, Colaba, Mumbai, Maharashtra 400001", desc:"Specialty Coffee Café spot in CST. Known for pour over coffee, nitro cold brew.", phone:"+91 73372 05222", img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Pour Over Coffee",price:"₹—"},{item:"Nitro Cold Brew",price:"₹—"},{item:"Cappuccino",price:"₹—"},{item:"Banana Bread",price:"₹—"}] },
      { id:5, name:"Mockingbird Café Bar", cuisine:"Café & Bar", price:"₹1700-2600 for two", rating:4.4, tag:"Worth the trip", hood:"Churchgate", address:"80, Veer Nariman Rd, Churchgate, Mumbai, Maharashtra 400020", desc:"Café & Bar spot in Churchgate. Known for flowerpot tiramisu, spicy cajun chicken.", phone:"+91 80976 06010", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Flowerpot Tiramisu",price:"₹—"},{item:"Spicy Cajun Chicken",price:"₹—"},{item:"Beetroot Hummus",price:"₹—"},{item:"Akuri on Toast",price:"₹—"}] },
      { id:6, name:"Kyani & Co.", cuisine:"Irani Café & Bakery", price:"₹300 for two", rating:4.1, tag:"Iconic", hood:"Marine Lines", address:"Jer Mahal Building, 657, Jagannath Shankar Seth Rd, Marine Lines, Mumbai, Maharashtra 400002", desc:"Irani Café & Bakery spot in Marine Lines. Known for bun maska, irani chai.", phone:"+91 89286 16793", img:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Bun Maska",price:"₹—"},{item:"Irani Chai",price:"₹—"},{item:"Keema Pav",price:"₹—"},{item:"Mawa Cake",price:"₹—"}] },
      { id:7, name:"Ashok Vada Pav", cuisine:"Street Food", price:"₹150 for two", rating:4.2, tag:"Late night", hood:"Dadar", address:"Kashinath Dhuru Marg, Dadar West, Mumbai, Maharashtra 400028", desc:"Street Food spot in Dadar. Known for vada pav, cheese vada pav.", phone:"+91 85918 94170", img:"https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Vada Pav",price:"₹—"},{item:"Cheese Vada Pav",price:"₹—"},{item:"Chura Vada Pav",price:"₹—"},{item:"Misal Pav",price:"₹—"}] },
      { id:8, name:"Muthu Dosa Corner", cuisine:"South Indian Street Food", price:"₹150-200 for two", rating:4.3, tag:"Cozy spot", hood:"Dadar", address:"St Paul St, Hindmata, Dadar East, Mumbai, Maharashtra 400014", desc:"South Indian Street Food spot in Dadar. Known for mysore masala dosa, cheese masala dosa.", phone:"+91 22-0000-0000", img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Mysore Masala Dosa",price:"₹—"},{item:"Cheese Masala Dosa",price:"₹—"},{item:"Rava Dosa",price:"₹—"},{item:"Filter Coffee",price:"₹—"}] },
      { id:9, name:"Brooke Bond Taj Mahal Tea House", cuisine:"Tea House", price:"₹600-900 for two", rating:4.5, tag:"Top rated", hood:"Bandra", address:"Sanatan Pereira Bungalow, 36/A, St John Baptist Rd, Mount Mary, Bandra West, Mumbai, Maharashtra 400050", desc:"Tea House spot in Bandra. Known for parsi brun maska, kashmiri saffron chai.", phone:"+91 84339 53420", img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Parsi Brun Maska",price:"₹—"},{item:"Kashmiri Saffron Chai",price:"₹—"},{item:"Apple Crumble",price:"₹—"},{item:"Fluffy Omelette",price:"₹—"}] },
      { id:10, name:"Café Irani Chaii", cuisine:"Café", price:"₹400 for two", rating:4.4, tag:"Hidden gem", hood:"Mahim", address:"Rosary Building, Mia Mohd Chhotani Rd, Geeta Nagar, Mahim West, Mumbai, Maharashtra 400016", desc:"Café spot in Bandra. Known for bun maska, irani chai.", phone:"+91 98202 85577", img:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Bun Maska",price:"₹—"},{item:"Irani Chai",price:"₹—"},{item:"Berry Pulao",price:"₹—"},{item:"Mutton Dhansak",price:"₹—"}] },
      { id:11, name:"The Nutcracker", cuisine:"Café", price:"₹1800-1900 for two", rating:4.4, tag:"Trending", hood:"Bandra", address:"St John Baptist Rd, St Sebastian Colony, Mount Mary, Bandra West, Mumbai, Maharashtra 400050", desc:"Café spot in Bandra. Known for buttermilk pancakes, belgian hot chocolate.", phone:"+91 93217 67726", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Buttermilk Pancakes",price:"₹—"},{item:"Belgian Hot Chocolate",price:"₹—"},{item:"Black Bean Burger",price:"₹—"},{item:"Eggs Kejriwal",price:"₹—"}] },
      { id:12, name:"Bombay Brioche", cuisine:"Café & Bakery", price:"₹1200 for two", rating:4.6, tag:"Must visit", hood:"Bandra", address:"Simple Apts, 1, 16th Rd, Bandra West, Mumbai, Maharashtra 400050", desc:"Café & Bakery spot in Bandra. Known for truffle mushroom croissant, san sebastián cheesecake.", phone:"+91 98196 54950", img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Truffle Mushroom Croissant",price:"₹—"},{item:"San Sebastián Cheesecake",price:"₹—"},{item:"Korean Egg Sando",price:"₹—"},{item:"Nutella Bomboloni",price:"₹—"}] },
      { id:13, name:"Shakey Wakey", cuisine:"Café & Fast Food", price:"₹400-550 for two", rating:3.9, tag:"Popular", hood:"Bandra", address:"Elko Arcade Shopping Centre, Waterfield Rd, Bandra West, Mumbai, Maharashtra 400050", desc:"Café & Fast Food spot in Bandra. Known for oreo thick shake, chicken hot garlic roll.", phone:"+91 98200 07442", img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Oreo Thick Shake",price:"₹—"},{item:"Chicken Hot Garlic Roll",price:"₹—"},{item:"Mango Django Juice",price:"₹—"},{item:"Chocolate Brownie Sundae",price:"₹—"}] },
      { id:14, name:"Candies", cuisine:"Café & Bakery", price:"₹400-850 for two", rating:4.3, tag:"Local fav", hood:"Bandra", address:"5AA, Pali Hill, next to Learners Academy School, Bandra West, Mumbai, Maharashtra 400050", desc:"Café & Bakery spot in Bandra. Known for chicken lasagna, chocolate mousse.", phone:"+91 85911 49713", img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Chicken Lasagna",price:"₹—"},{item:"Chocolate Mousse",price:"₹—"},{item:"Blueberry Cheesecake",price:"₹—"},{item:"Banoffee Pie",price:"₹—"}] },
      { id:15, name:"Aromas Café", cuisine:"Café", price:"₹1000-1300 for two", rating:4.3, tag:"Worth the trip", hood:"Bandra", address:"Ground Floor, Mamta Building, Waterfield Rd, near National College, Bandra West, Mumbai, Maharashtra 400050", desc:"Café spot in Bandra. Known for peri peri chicken sandwich, nutella pancakes.", phone:"+91 22 6897 6429", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Peri Peri Chicken Sandwich",price:"₹—"},{item:"Nutella Pancakes",price:"₹—"},{item:"Alfredo Pasta",price:"₹—"},{item:"Sizzling Brownie",price:"₹—"}] },
      { id:16, name:"Boojee Cafe", cuisine:"Café", price:"₹1200-1300 for two", rating:4.4, tag:"Iconic", hood:"Bandra", address:"Shop No 6, 29, New Kantwadi Rd, off Perry Cross Rd, Bandra West, Mumbai, Maharashtra 400050", desc:"Café spot in Bandra. Known for truffled avocado toast, turkish eggs.", phone:"+91 99302 03882", img:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Truffled Avocado Toast",price:"₹—"},{item:"Turkish Eggs",price:"₹—"},{item:"Hot Chocolate",price:"₹—"},{item:"Pistachio Baklava Croissant",price:"₹—"}] },
      { id:17, name:"Bombay Coffee House", cuisine:"Café", price:"₹900-950 for two", rating:4.2, tag:"Late night", hood:"Bandra", address:"Neelkamal Building, 248, Waterfield Rd, opp. National College, Bandra West, Mumbai, Maharashtra 400050", desc:"Café spot in Bandra. Known for iced caramel coffee, eggs benedict.", phone:"+91 77180 42147", img:"https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Iced Caramel Coffee",price:"₹—"},{item:"Eggs Benedict",price:"₹—"},{item:"Keema Pulao",price:"₹—"},{item:"Irish Cream Coffee",price:"₹—"}] },
      { id:18, name:"Brevé Bakery", cuisine:"Café & Bakery", price:"₹1050 for two", rating:4.0, tag:"Cozy spot", hood:"Bandra", address:"Shop No.12, Pearl Haven, Chapel Rd, St Sebastian Colony, Mount Mary, Bandra West, Mumbai, Maharashtra 400050", desc:"Café & Bakery spot in Bandra. Known for bandra basque cheesecake, pistachio cheesecake.", phone:"+91 90825 87137", img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Bandra Basque Cheesecake",price:"₹—"},{item:"Pistachio Cheesecake",price:"₹—"},{item:"Vietnamese Cold Coffee",price:"₹—"},{item:"Avocado Chicken Sandwich",price:"₹—"}] },
      { id:19, name:"Kepchaki Momos", cuisine:"Momos & Tibetan", price:"₹400 for two", rating:4.0, tag:"Top rated", hood:"Bandra", address:"73, Waroda Rd, Ranwar, Bandra West, Mumbai, Maharashtra 400050", desc:"Momos & Tibetan spot in Bandra. Known for pork momos, chicken & basil momos.", phone:"+91 88280 80796", img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Pork Momos",price:"₹—"},{item:"Chicken & Basil Momos",price:"₹—"},{item:"Jhol Momos",price:"₹—"},{item:"Mushroom & Cheese Momos",price:"₹—"}] },
      { id:20, name:"Hit & Run Lebanese and Mughal", cuisine:"Lebanese & Mughlai", price:"₹1000 for two", rating:4.2, tag:"Hidden gem", hood:"Bandra", address:"Shop No-1, Sunbeam Apartment, 64, Chapel Rd, near Lilavati Hospital, Bandra West, Mumbai, Maharashtra 400050", desc:"Lebanese & Mughlai spot in Bandra. Known for chicken shawarma, hummus falafel roll.", phone:"+91 91520 39821", img:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Chicken Shawarma",price:"₹—"},{item:"Hummus Falafel Roll",price:"₹—"},{item:"Mutton Biryani",price:"₹—"},{item:"Lebanese Platters",price:"₹—"}] },
      { id:21, name:"Kuuraku", cuisine:"Japanese", price:"₹2000-2100 for two", rating:4.7, tag:"Trending", hood:"Bandra", address:"Suburbia Building, between Linking Road, Swami Vivekanand Rd, Bandra West, Mumbai, Maharashtra 400050", desc:"Japanese spot in Bandra. Known for kuuraku ramen, tan tan men ramen.", phone:"+91 73044 96623", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Kuuraku Ramen",price:"₹—"},{item:"Tan Tan Men Ramen",price:"₹—"},{item:"Teppan Gyoza",price:"₹—"},{item:"Crunchy Ebi Roll",price:"₹—"}] },
      { id:22, name:"Jay Sandwich", cuisine:"Street Food", price:"₹200-250 for two", rating:4.3, tag:"Must visit", hood:"Bandra", address:"36th Rd, Khar West, Mumbai, Maharashtra 400050", desc:"Street Food spot in Bandra. Known for cheese chilli toast sandwich, chocolate sandwich.", phone:"+91 93249 57757", img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Cheese Chilli Toast Sandwich",price:"₹—"},{item:"Chocolate Sandwich",price:"₹—"},{item:"Pizza Sandwich",price:"₹—"},{item:"Schezwan Grilled Sandwich",price:"₹—"}] },
      { id:23, name:"DRNK", cuisine:"Beverage Café", price:"₹1300 for two", rating:4.3, tag:"Popular", hood:"Bandra", address:"Shop number 6, Shakti Raj premise, Pali Rd, opp. Two Rose, Bandra West, Mumbai, Maharashtra 400050", desc:"Beverage Café spot in Bandra. Known for matcha latte, spanish latte.", phone:"+91 8591409819", img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Matcha Latte",price:"₹—"},{item:"Spanish Latte",price:"₹—"},{item:"Tiramisu Latte",price:"₹—"},{item:"Basque Cheesecake",price:"₹—"}] },
      { id:24, name:"Jai Jawan", cuisine:"Street Food", price:"₹500-550 for two", rating:4.4, tag:"Local fav", hood:"Bandra", address:"Linking Rd, opp. National College, Khar, Bandra West, Mumbai, Maharashtra 400050", desc:"Street Food spot in Bandra. Known for chicken tikka roll, paneer tikka roll.", phone:"+91 98205 03355", img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Chicken Tikka Roll",price:"₹—"},{item:"Paneer Tikka Roll",price:"₹—"},{item:"Chicken Shawarma",price:"₹—"},{item:"Veg Schezwan Roll",price:"₹—"}] },
      { id:25, name:"Vanilla Miel", cuisine:"Café & Pâtisserie", price:"₹1200-1400 for two", rating:4.4, tag:"Worth the trip", hood:"Bandra", address:"18A, 16th Rd, Pali Village, Bandra West, Mumbai, Maharashtra 400050", desc:"A cozy hidden gem tucked into Pali Village with minimal decor, known for its prawn rolls, avocado chicken sandwich and rich desserts.", phone:"+91 73049 16702", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Prawn Roll",price:"₹—"},{item:"Avocado Chicken Sandwich",price:"₹—"},{item:"Almond Croissant",price:"₹—"},{item:"Pineapple Tres Leches",price:"₹—"}] },
      { id:26, name:"SodaBottleOpenerWala", cuisine:"Parsi & Iranian", price:"₹1300-1600 for two", rating:4.2, tag:"Iconic", hood:"BKC", address:"Ground, The Capital, 02, G Block Rd, BKC, Bandra East, Mumbai, Maharashtra 400051", desc:"Parsi & Iranian spot in BKC. Known for berry pulao, chicken farcha.", phone:"+91 72088 71560", img:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Berry Pulao",price:"₹—"},{item:"Chicken Farcha",price:"₹—"},{item:"Mutton Dhansak",price:"₹—"},{item:"Eggs Kejriwal",price:"₹—"}] },
      { id:27, name:"Kale & Kaffe", cuisine:"Healthy Café", price:"₹1000-1300 for two", rating:4.4, tag:"Late night", hood:"Khar", address:"3R8J+FW9, Bandra West, Mumbai, Maharashtra 400052", desc:"Healthy Café spot in Khar. Known for truffle mushroom toast, acai bowl.", phone:"+91 22-0000-0000", img:"https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Truffle Mushroom Toast",price:"₹—"},{item:"Acai Bowl",price:"₹—"},{item:"Eggs Benedict",price:"₹—"},{item:"Grilled Chicken Salad",price:"₹—"}] },
      { id:28, name:"Kill No Kalorie", cuisine:"Healthy Café", price:"₹950 for two", rating:4.0, tag:"Cozy spot", hood:"Khar", address:"Kulkarni CHS, Ghantali Devi Rd, near Sai Baba Mandir, Naupada, Thane West, Thane, Maharashtra 400602", desc:"Healthy Café spot in Khar. Known for protein pancakes, grilled chicken sandwich.", phone:"+91 80821 60869", img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Protein Pancakes",price:"₹—"},{item:"Grilled Chicken Sandwich",price:"₹—"},{item:"Smoothie Bowls",price:"₹—"},{item:"Avocado Toast",price:"₹—"}] },
      { id:29, name:"Prithvi Cafe", cuisine:"Café", price:"₹500-700 for two", rating:4.4, tag:"Top rated", hood:"Juhu", address:"Prithvi Theatre, 20, Juhu Rd, Janki Kutir, Juhu, Mumbai, Maharashtra 400049", desc:"Café spot in Juhu. Known for irish coffee, suleimani chai.", phone:"+91 70459 40218", img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Irish Coffee",price:"₹—"},{item:"Suleimani Chai",price:"₹—"},{item:"Keema Pav",price:"₹—"},{item:"Cheese Chilli Paratha",price:"₹—"}] },
      { id:30, name:"Bayleaf Cafe", cuisine:"Café", price:"₹1050 for two", rating:4.2, tag:"Hidden gem", hood:"Juhu", address:"32, Juhu Church Rd, Janki Kutir, Juhu, Mumbai, Maharashtra 400049", desc:"Café spot in Juhu. Known for avocado toast, tiramisu.", phone:"+91 22-0000-0000", img:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Avocado Toast",price:"₹—"},{item:"Tiramisu",price:"₹—"},{item:"Bayleaf Tiramisu Pancake",price:"₹—"},{item:"Fried Nutella Toast & Banana Brûlée",price:"₹—"}] },
      { id:31, name:"Silver Beach Cafe", cuisine:"Café", price:"₹1300-2100 for two", rating:4.3, tag:"Trending", hood:"Juhu", address:"Jal Darshan Building, 94/6, Shri GB Jukar Marg, beside Juhu Tara, Juhu, Mumbai, Maharashtra 400049", desc:"Café spot in Juhu. Known for cilantro pizza, breakfast platter.", phone:"+91 98199 66495", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Cilantro Pizza",price:"₹—"},{item:"Breakfast Platter",price:"₹—"},{item:"Chocolate Fondue",price:"₹—"},{item:"Gnocchi",price:"₹—"}] },
      { id:32, name:"Shree Siddhivinayak Fast Food", cuisine:"Street Food", price:"₹250-500 for two", rating:4.5, tag:"Must visit", hood:"Juhu", address:"1, Juhu Tara Rd, Nazir Wadi, Theosophical Housing Colony, Juhu, Mumbai, Maharashtra 400049", desc:"Street Food spot in Juhu. Known for pav bhaji, cheese pav bhaji.", phone:"+91 98673 81333", img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Pav Bhaji",price:"₹—"},{item:"Cheese Pav Bhaji",price:"₹—"},{item:"Tawa Pulao",price:"₹—"},{item:"Hakka Noodles",price:"₹—"}] },
      { id:33, name:"Café Arpan", cuisine:"Café", price:"₹500 for two", rating:4.8, tag:"Popular", hood:"Vile Parle", address:"Shop No. 3, Zee Jayshree, Prarthana Samaj Rd, Navpada, Vile Parle East, Mumbai, Maharashtra 400057", desc:"Café spot in Vile Parle. Known for creamy mushroom sandwich, falafel.", phone:"+91 74004 90008", img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Creamy Mushroom Sandwich",price:"₹—"},{item:"Falafel",price:"₹—"},{item:"Filter Coffee",price:"₹—"},{item:"Masala Fries",price:"₹—"}] },
      { id:34, name:"Bombay to Barcelona Library Café", cuisine:"Library Café", price:"₹500-900 for two", rating:4.6, tag:"Local fav", hood:"Andheri", address:"Timmy Arcade, 778, Makwana Rd, Gamdevi, Marol, Andheri East, Mumbai, Maharashtra 400059", desc:"Library Café spot in Andheri. Known for spanish hot chocolate, pancakes.", phone:"+91 77384 46788", img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Spanish Hot Chocolate",price:"₹—"},{item:"Pancakes",price:"₹—"},{item:"Nutella Crepes",price:"₹—"},{item:"Cheesecake",price:"₹—"}] },
      { id:35, name:"The Backyard Brew", cuisine:"Café", price:"₹1200-1700 for two", rating:4.4, tag:"Worth the trip", hood:"Andheri", address:"Shop No. 1 & 2, Poseidon Apartment, Inlaks Nagar, Versova, Andheri West, Mumbai, Maharashtra 400061", desc:"Café spot in Andheri. Known for spicy buttermilk fried chicken burger, burnt basque cheesecake.", phone:"+91 89767 66771", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Spicy Buttermilk Fried Chicken Burger",price:"₹—"},{item:"Burnt Basque Cheesecake",price:"₹—"},{item:"Peruvian Chicken Skewers",price:"₹—"},{item:"Eggs Benedict",price:"₹—"}] },
      { id:36, name:"Kefi Eatery & Cafe", cuisine:"Café", price:"₹1000-1150 for two", rating:4.2, tag:"Iconic", hood:"Andheri", address:"Inlaks Nagar, Versova, Andheri West, Mumbai, Maharashtra 400061", desc:"Café spot in Andheri. Known for truffle kefi fries, kefi house fried chicken.", phone:"+91 22-0000-0000", img:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Truffle Kefi Fries",price:"₹—"},{item:"Kefi House Fried Chicken",price:"₹—"},{item:"Butter Garlic Prawns",price:"₹—"},{item:"Classic Cheesecake",price:"₹—"}] },
      { id:37, name:"Jessiea's – Good Vibes", cuisine:"Café", price:"₹1400-1600 for two", rating:4.2, tag:"Late night", hood:"Andheri", address:"Shop No. G-216 G217 G218, Shree Ashtavinayak CHS, DN Nagar, Andheri West, Mumbai, Maharashtra 400053", desc:"Café spot in Andheri. Known for padron pesto pizza, impossible burger.", phone:"+91 91361 09369", img:"https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Padron Pesto Pizza",price:"₹—"},{item:"Impossible Burger",price:"₹—"},{item:"Pumpkin & Ricotta Tortellini Pasta",price:"₹—"},{item:"Japanese Cheesecake",price:"₹—"}] },
      { id:38, name:"Grandmama's Cafe", cuisine:"Café", price:"₹1600-1700 for two", rating:4.2, tag:"Cozy spot", hood:"Chembur", address:"Ground Floor, Sunny Estate, Sion-Trombay Rd, Borla, Union Park, Chembur, Mumbai, Maharashtra 400071", desc:"Café spot in Chembur. Known for signature hot chocolate, pesto basilico pasta.", phone:"+91 85910 73470", img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Signature Hot Chocolate",price:"₹—"},{item:"Pesto Basilico Pasta",price:"₹—"},{item:"Crusty Mac & Cheese",price:"₹—"},{item:"Khao Suey",price:"₹—"}] },
      { id:39, name:"Le Café", cuisine:"Café", price:"₹1800-2000 for two", rating:4.4, tag:"Top rated", hood:"Chembur", address:"Jewel of Chembur, Rd No. 1, opp. BMC Office, near Natraj Cinema, Chembur, Mumbai, Maharashtra 400071", desc:"Café spot in Chembur. Known for three mushroom risotto, nachos.", phone:"+91 22 6709 9977", img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Three Mushroom Risotto",price:"₹—"},{item:"Nachos",price:"₹—"},{item:"Butter Garlic Prawns",price:"₹—"},{item:"Lamb Chops",price:"₹—"}] },
      { id:40, name:"Mumbai Express", cuisine:"Café / Deli", price:"₹1600 for two", rating:4.2, tag:"Hidden gem", hood:"Powai", address:"The Westin, Plot No 2 & 3B, near Chinmayanand Ashram, Powai, Mumbai, Maharashtra 400087", desc:"Café / Deli spot in Powai. Known for cappuccino, tuna sandwich.", phone:"+91 22 6692 7567", img:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Cappuccino",price:"₹—"},{item:"Tuna Sandwich",price:"₹—"},{item:"Salmon Croissant",price:"₹—"},{item:"Cold Brew Coffee",price:"₹—"}] },
      { id:41, name:"Earth Soul Cafe", cuisine:"Healthy Café", price:"₹850-1000 for two", rating:4.7, tag:"Trending", hood:"CBD Belapur", address:"Shop No. 13, Progressive's Sea Lounge, Plot No.44, Sector 15, CBD Belapur, Navi Mumbai, Maharashtra 400614", desc:"Healthy Café spot in CBD Belapur. Known for kale & avocado salad, basil pesto risotto.", phone:"+91 96194 09696", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Kale & Avocado Salad",price:"₹—"},{item:"Basil Pesto Risotto",price:"₹—"},{item:"Avocado Toast",price:"₹—"},{item:"Cold-Pressed Juices",price:"₹—"}] },
      { id:42, name:"Mamledar Misal", cuisine:"Maharashtrian", price:"₹200-250 for two", rating:4.2, tag:"Must visit", hood:"Thane", address:"opp. Zilla Parishad, Talav Pali, Jambli Naka, Thane West, Thane, Maharashtra 400602", desc:"Maharashtrian spot in Thane. Known for mamledar misal, dahi misal.", phone:"+91 95948 47929", img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Mamledar Misal",price:"₹—"},{item:"Dahi Misal",price:"₹—"},{item:"Extra Tari Misal",price:"₹—"},{item:"Batata Vada",price:"₹—"}] },
      { id:43, name:"Prashant Corner", cuisine:"Mithai & Street Food", price:"₹200-400 for two", rating:4.4, tag:"Popular", hood:"Thane", address:"Shop No. 17 & 18, Gagangiri Society, Bhakti Mandir, Panch Pakhadi, Thane West, Thane, Maharashtra 400602", desc:"Mithai & Street Food spot in Thane. Known for khaman dhokla, kothimbir vadi.", phone:"+91 88792 79757", img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Khaman Dhokla",price:"₹—"},{item:"Kothimbir Vadi",price:"₹—"},{item:"Ragda Pattice",price:"₹—"},{item:"Pani Puri",price:"₹—"}] },
      { id:44, name:"The Pantry", cuisine:"Café", price:"₹1100 for two", rating:4.7, tag:"Local fav", hood:"Kala Ghoda", address:"Ground floor, Bansi Lal Building, 15-A, Homi Modi St, opp. Bombay House, Kala Ghoda, Fort, Mumbai, Maharashtra 400001", desc:"Café spot in Kala Ghoda. Known for avocado toast, eggs benedict.", phone:"+91 82917 70401", img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Avocado Toast",price:"₹—"},{item:"Eggs Benedict",price:"₹—"},{item:"Ricotta Hotcakes",price:"₹—"},{item:"Truffle Fries",price:"₹—"}] },
      { id:45, name:"Kala Ghoda Cafe", cuisine:"Café", price:"₹400-1300 for two", rating:4.4, tag:"Worth the trip", hood:"Kala Ghoda", address:"10, Rope Walk Ln, Kala Ghoda, Fort, Mumbai, Maharashtra 400001", desc:"Café spot in Kala Ghoda. Known for chicken salad sandwich, almond cake.", phone:"+91 98338 03418", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Chicken Salad Sandwich",price:"₹—"},{item:"Almond Cake",price:"₹—"},{item:"Chicken Schnitzel",price:"₹—"},{item:"Mint Tea",price:"₹—"}] },
      { id:46, name:"Bake House Cafe", cuisine:"Café & Bakery", price:"₹800-2000 for two", rating:4.4, tag:"Iconic", hood:"Kala Ghoda", address:"Chamber of Commerce Ln, Kala Ghoda, Fort, Mumbai, Maharashtra 400001", desc:"Café & Bakery spot in Kala Ghoda. Known for eggs benedict, white sauce pasta.", phone:"+91 22 2202 0146", img:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Eggs Benedict",price:"₹—"},{item:"White Sauce Pasta",price:"₹—"},{item:"Wood-Fired Pizza",price:"₹—"},{item:"Pain au Chocolat",price:"₹—"}] },
      { id:47, name:"Britannia & Co. Restaurant", cuisine:"Parsi", price:"₹1000 for two", rating:4.1, tag:"Late night", hood:"Fort", address:"Wakefield House, 11-16, SS Ram Gulam Marg, opp. New Indian Customs House, Ballard Estate, Fort, Mumbai, Maharashtra 400001", desc:"Parsi spot in Fort. Known for berry pulao, sali boti.", phone:"+91 22 2261 5264", img:"https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Berry Pulao",price:"₹—"},{item:"Sali Boti",price:"₹—"},{item:"Caramel Custard",price:"₹—"},{item:"Chicken Berry Pulao",price:"₹—"}] },
      { id:48, name:"Banyan Tree Café", cuisine:"Café", price:"₹650-1400 for two", rating:4.3, tag:"Cozy spot", hood:"Fort", address:"7, 9, Calicut Rd, Ballard Estate, Fort, Mumbai, Maharashtra 400001", desc:"Café spot in Fort. Known for banoffee pie, quiche.", phone:"+91 96190 33000", img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Banoffee Pie",price:"₹—"},{item:"Quiche",price:"₹—"},{item:"Chicken Sandwich",price:"₹—"},{item:"Blueberry Cheesecake",price:"₹—"}] },
      { id:49, name:"Yazdani Bakery & Restaurant", cuisine:"Irani Café & Bakery", price:"₹200-250 for two", rating:4.2, tag:"Top rated", hood:"Fort", address:"11A, Cawasji Patel St, Kala Ghoda, Fort, Mumbai, Maharashtra 400001", desc:"Irani Café & Bakery spot in Fort. Known for brun maska, mawa cake.", phone:"+91 22-0000-0000", img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Brun Maska",price:"₹—"},{item:"Mawa Cake",price:"₹—"},{item:"Apple Cinnamon Pie",price:"₹—"},{item:"Irani Chai",price:"₹—"}] },
      { id:50, name:"Nandan Coffee", cuisine:"Specialty Coffee Café", price:"₹700-750 for two", rating:4.4, tag:"Hidden gem", hood:"Kala Ghoda", address:"Mulla House, 34, Homi Modi St, opp. Central Bank Head Office, Kala Ghoda, Fort, Mumbai, Maharashtra 400001", desc:"Specialty Coffee Café spot in Fort. Known for mari-wala scramble, nandan tiramisu french toast.", phone:"+91 77380 69879", img:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Mari-wala Scramble",price:"₹—"},{item:"Nandan Tiramisu French Toast",price:"₹—"},{item:"Bombay Bagel",price:"₹—"},{item:"Vietnamese Iced Coffee",price:"₹—"}] },
      { id:51, name:"Zen Cafe", cuisine:"Café", price:"₹1000-1200 for two", rating:4.2, tag:"Trending", hood:"Kala Ghoda", address:"Fort Foundation Building, Bake House Ln, Kala Ghoda, Fort, Mumbai, Maharashtra 400001", desc:"Café spot in Fort. Known for belgian hot chocolate, sushi platter.", phone:"+91 91677 68950", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Belgian Hot Chocolate",price:"₹—"},{item:"Sushi Platter",price:"₹—"},{item:"Avocado Toast",price:"₹—"},{item:"Vegetarian Sushi Rolls",price:"₹—"}] },
      { id:52, name:"Abokado", cuisine:"Japanese Café", price:"₹600-1000 for two", rating:4.4, tag:"Hidden gem", hood:"Bandra", address:"Shop No.1, Sefa House, Pali Mala Rd, Bandra West, Mumbai, Maharashtra 400049", desc:"A cozy Japanese inspired café in Bandra known for its welcoming atmosphere and consistently well received food. Guests often appreciate the attentive service and intimate setting making it a favorite for those looking for something different from the usual café experience.", phone:"+91 83699 36468", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", photos:["https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80"], menu:[{item:"Avocado Toast Set",price:"₹—"},{item:"Salmon Sushi Roll",price:"₹—"},{item:"Katsu Curry",price:"₹—"},{item:"Matcha Latte",price:"₹—"}] },
      { id:53, name:"Akhoi Manipuri Kitchen", cuisine:"Manipuri / Northeast Indian", price:"₹600-1000 for two", rating:4.2, tag:"Unique find", hood:"Andheri", address:"D4, Shree Brahma Chaitanya CHS, BD 77, near Om Shelter, SV Patel Nagar, Andheri West, Mumbai, Maharashtra 400053", desc:"A well-loved eatery in Versova known for its authentic Manipuri cuisine and homely flavors. Guests often appreciate the traditional preparation, warm hospitality and genuine dining experience that offers a taste of Northeast India in Mumbai.", phone:"+91 60096 86422", img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", photos:["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80"], menu:[{item:"Chicken Momos",price:"₹—"},{item:"Hawaijar Pork",price:"₹—"},{item:"Smoked Bamboo Shoot Curry",price:"₹—"},{item:"Chak-hao Kheer",price:"₹—"}] },
      { id:54, name:"Anand Stall", cuisine:"Street Food", price:"₹800-1300 for two", rating:4.2, tag:"College favourite", hood:"Vile Parle", address:"VM Road, opp. Options Mall, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400049", desc:"A popular Vile Parle eatery known for its wide variety of street food and long-standing local following. Guests often appreciate the quick service, affordable offerings and familiar flavours that have made it a favorite among students and locals for years.", phone:"+91 91674 72737", img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", photos:["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80"], menu:[{item:"Butter Vada Pav",price:"₹—"},{item:"Mysore Masala Dosa",price:"₹—"},{item:"Schezwan Vada Pav",price:"₹—"},{item:"Cheese Grill Sandwich",price:"₹—"}] },
      { id:55, name:"ARBAB", cuisine:"Lebanese Restaurant", price:"₹1800-3000 for two", rating:4.0, tag:"Open-air", hood:"Bandra", address:"Plot no 117, Shop no 4, 28th Rd, Bandra West, Mumbai, Maharashtra 400050", desc:"A popular Bandra eatery known for its authentic Middle Eastern flavors and generous portions. Guests often appreciate the quality of the food, consistent experience and flavorful offerings that have earned it a loyal following.", phone:"+91 99208 30008", img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Hummus Beiruty",price:"₹—"},{item:"Shish Tawouk",price:"₹—"},{item:"Mezze Platter",price:"₹—"},{item:"Baklava",price:"₹—"}] },
      { id:56, name:"Bayview Cafe", cuisine:"Café", price:"₹1800-3000 for two", rating:4.2, tag:"Sea view", hood:"Colaba", address:"Hotel Harbour View, 25, PJ Ramchandani Marg, Apollo Bandar, Colaba, Mumbai, Maharashtra 400001", desc:"A Colaba café known for its stunning views of the Arabian Sea and the Gateway of India. Guests often appreciate the relaxed atmosphere, friendly service and scenic setting that make it a memorable spot in South Mumbai.", phone:"+91 22 6119 2222", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80", photos:["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80","https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80"], menu:[{item:"Breakfast Buffet",price:"₹—"},{item:"Mushroom Dishes",price:"₹—"},{item:"Milkshakes",price:"₹—"},{item:"Tandoori Platter",price:"₹—"}] },
      { id:57, name:"Benne", cuisine:"South Indian / Dosa", price:"₹800-1300 for two", rating:4.4, tag:"Authentic", hood:"Bandra", address:"Shop no. 1, plot 85, TPS 3, Louis Bell Building, 16th Rd, opp. Shree Sagar, Bandra West, Mumbai, Maharashtra 400050", desc:"A popular Bandra café known for its South Indian-inspired offerings and comforting flavours. Guests often appreciate the quality of the food, welcoming atmosphere and thoughtfully crafted experience that sets it apart from the neighborhood’s usual café scene.", phone:"+91 90049 88941", img:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80", photos:["https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80","https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80","https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80"], menu:[{item:"Ghee Podi Dosa",price:"₹—"},{item:"Thatte Idli",price:"₹—"},{item:"Garlic Roast Dosa",price:"₹—"},{item:"Filter Kaapi",price:"₹—"}] },
      { id:58, name:"Bokka Coffee", cuisine:"Specialty Coffee Café", price:"₹600-1000 for two", rating:4.2, tag:"Local fav", hood:"Bandra", address:"Shop no. 6 and 7, Silver Croft, 16th Rd, near Khane Khas, Bandra West, Mumbai, Maharashtra 400050", desc:"A cozy Bandra café known for its excellent coffee and thoughtfully prepared breakfast offerings. Guests often praise the quality of the food, friendly service and welcoming atmosphere that keeps them coming back.", phone:"+91 83558 05500", img:"https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=600&q=80", photos:["https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80","https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80","https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80"], menu:[{item:"Cold Brew",price:"₹—"},{item:"Truffle Shroom Dosa",price:"₹—"},{item:"Lamb Toast",price:"₹—"},{item:"Hibiscus Iced Tea",price:"₹—"}] },
      { id:59, name:"Bombay Island Coffee Company", cuisine:"Specialty Coffee Roastery", price:"₹800-1300 for two", rating:4.5, tag:"Office favourite", hood:"Vikhroli", address:"Shop #4, Tower C, Retail Street, The Trees, Godrej One, Pirojshanagar, Vikhroli East, Mumbai, Maharashtra 400079", desc:"A specialty coffee café in Vikhroli known for its freshly roasted coffee and relaxed atmosphere. Guests often appreciate the quality of the beverages, welcoming service, and the unique experience of seeing the coffee-making process up close.", phone:"+91 22 4003 4931", img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80", photos:["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80","https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80"], menu:[{item:"French Press Coffee",price:"₹—"},{item:"Hazelnut Cold Coffee",price:"₹—"},{item:"Mediterranean Sandwich",price:"₹—"},{item:"Croissant Sandwich",price:"₹—"}] },
      { id:60, name:"C D' Souza", cuisine:"East Indian / Goan", price:"₹600-1000 for two", rating:4.4, tag:"Family-run", hood:"Marine Lines", address:"314, Dr Cawasji Hormusji St, opp. Our Lady of Dolours Church, Sonapur, Marine Lines, Mumbai, Maharashtra 400002", desc:"A long-standing Marine Lines restaurant known for its authentic East Indian cuisine and homely atmosphere. Guests often appreciate the traditional flavors, generous portions and comforting dining experience that has earned it a loyal following over the years.", phone:"+91 22 3194 8380", img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80", photos:["https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"], menu:[{item:"Pork Sorpotel",price:"₹—"},{item:"Kingfish Rava Fry",price:"₹—"},{item:"Goan Chorizo Fry",price:"₹—"},{item:"Fruit Pie",price:"₹—"}] },
      { id:61, name:"Cafe Trofima", cuisine:"Café", price:"₹800-1300 for two", rating:4.2, tag:"Shivaji Park staple", hood:"Dadar", address:"Raja Badhe Chowk, Lady Jamshedji Rd, Shivaji Park Road No. 2, Mumbai, Maharashtra 400028", desc:"A well-loved café in Shivaji Park known for its warm ambience and wide-ranging menu. Guests often appreciate the quality of the food, friendly service, and inviting atmosphere that has made it a neighbourhood favourite over the years.", phone:"+91 82910 19988", img:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Jalapeño Hummus with Pita",price:"₹—"},{item:"Watermelon Feta Salad",price:"₹—"},{item:"White Sauce Pasta",price:"₹—"},{item:"Lotus Stem Starter",price:"₹—"}] },
      { id:62, name:"Chetana", cuisine:"Vegetarian Thali Restaurant", price:"₹800-1300 for two", rating:4.0, tag:"Since 1946", hood:"Kala Ghoda", address:"34, K Dubash Marg, Kala Ghoda, Fort, Mumbai, Maharashtra 400023", desc:"A long-standing Kala Ghoda restaurant known for its regional Indian vegetarian cuisine. Guests often appreciate the authentic flavors, traditional preparations and distinctive dining experience that showcases India's diverse culinary heritage.", phone:"+91 22 2284 4968", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", photos:["https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80"], menu:[{item:"Gujarati Thali",price:"₹—"},{item:"Rajasthani Thali",price:"₹—"},{item:"Maharashtrian Thali",price:"₹—"},{item:"Wine (limited bar)",price:"₹—"}] },
      { id:63, name:"Cloud 9 Bar & Cafe", cuisine:"Rooftop Bar & Café", price:"₹800-1300 for two", rating:3.8, tag:"City views", hood:"Colaba", address:"Hotel Godwin 41, Garden Rd, Apollo Bandar, Colaba, Mumbai, Maharashtra 400001", desc:"A rooftop spot in Colaba known for its relaxed atmosphere and city views. Guests often appreciate the friendly service, enjoyable ambience and easy-going setting that makes it a popular place to unwind.", phone:"+91 22 2287 2050", img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", photos:["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80"], menu:[{item:"Bar Snacks",price:"₹—"},{item:"Green Salad",price:"₹—"},{item:"Chicken Tikka",price:"₹—"},{item:"Evening Cocktails",price:"₹—"}] },
      { id:64, name:"Earth Cafe", cuisine:"Café (Vegan-friendly)", price:"₹600-1000 for two", rating:4.8, tag:"Top rated", hood:"Churchgate", address:"Ground Floor, Ram Mahal, Dinshaw Vacha Rd, near KC College, Churchgate, Mumbai, Maharashtra 400020", desc:"A well-loved café near Churchgate known for its fresh vegetarian offerings and relaxed atmosphere. Guests often appreciate the wholesome food, friendly service and comfortable setting that make it a popular choice in South Mumbai.", phone:"+91 90818 81844", img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", photos:["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80"], menu:[{item:"Orange Chocolate Cake",price:"₹—"},{item:"Rose Matcha",price:"₹—"},{item:"Hot Mocha",price:"₹—"},{item:"Strawberry Cream",price:"₹—"}] },
      { id:65, name:"Ettarra Coffee House", cuisine:"Café", price:"₹600-1000 for two", rating:4.6, tag:"Filter coffee special", hood:"Juhu", address:"Ground Floor, Juhu Residency Boutique Hotel, Juhu, Mumbai, Maharashtra 400049", desc:"A cosy Juhu café known for its distinctive coffee offerings and warm hospitality. Guests often appreciate the welcoming service, relaxed atmosphere, and thoughtful details that make every visit feel a little more personal.", phone:"+91 86558 05815", img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"South Indian Filter Coffee Frappe",price:"₹—"},{item:"Matka Cheesecake",price:"₹—"},{item:"Kacha Nimbu Tartlet",price:"₹—"},{item:"Iced Filter Coffee",price:"₹—"}] },
      { id:66, name:"Gajalee", cuisine:"Seafood Restaurant", price:"₹1800-3000 for two", rating:4.3, tag:"Coastal classic", hood:"Vile Parle", address:"Kadamgiri Complex, Hanuman Rd, next to ICICI Bank, Vile Parle East, Mumbai, Maharashtra 400057", desc:"A well-known seafood restaurant in Vile Parle celebrated for its fresh seafood and authentic coastal flavours. Guests often appreciate the consistent quality, attentive service, and reliable dining experience that has earned it a loyal following over the years.", phone:"+91 22 2616 6470", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80", photos:["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80","https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80"], menu:[{item:"Prawns Koliwada",price:"₹—"},{item:"Bombil Fry",price:"₹—"},{item:"Pomfret Khoshimbir",price:"₹—"},{item:"Fish Thali",price:"₹—"}] },
      { id:67, name:"Gaylord", cuisine:"Multi-cuisine Restaurant", price:"₹1800-3000 for two", rating:4.2, tag:"Old world charm", hood:"Churchgate", address:"V N Rd, Churchgate, Mumbai, Maharashtra 400020", desc:"A long-standing Churchgate restaurant known for its elegant atmosphere and enduring charm. Guests often appreciate the attentive service, quality food and consistent experience that has made it a Mumbai favorite for generations.", phone:"+91 70455 56060", img:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80", photos:["https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80","https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80","https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80"], menu:[{item:"Vegetable Tandoor Platter",price:"₹—"},{item:"Mushroom Cheese Lasagna",price:"₹—"},{item:"Crème Brûlée",price:"₹—"},{item:"Pizza",price:"₹—"}] },
      { id:68, name:"Gypsy Chinese", cuisine:"Chinese Restaurant", price:"₹600-1000 for two", rating:3.7, tag:"Old favourite", hood:"Dadar", address:"Dadar West, Dadar, Mumbai, Maharashtra 400014", desc:"A long-standing restaurant in Dadar known for its flavorful Chinese cuisine and consistent quality. Guests often appreciate the generous portions, efficient service and familiar flavors that have made it a favorite among locals for years.", phone:"+91 86550 06855", img:"https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=600&q=80", photos:["https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80","https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80","https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80"], menu:[{item:"Chilli Chicken",price:"₹—"},{item:"Chicken Lollipop",price:"₹—"},{item:"Udon Noodles",price:"₹—"},{item:"Manchow Soup",price:"₹—"}] },
      { id:69, name:"Hardeep Punjab", cuisine:"Punjabi / Tandoor", price:"₹800-1300 for two", rating:4.2, tag:"Tandoor specialist", hood:"Sion", address:"Om Shiv Shakti, GTB Nagar, J.K. Bhasin Marg, Sion Koliwada, Sion East, Mumbai, Maharashtra 400037", desc:"A popular Punjabi restaurant in Sion Koliwada known for its authentic flavors and generous portions. Guests often appreciate the consistent quality, quick service and satisfying meals that have made it a favorite among locals for years.", phone:"+91 80808 08002", img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80", photos:["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80","https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80"], menu:[{item:"HP Special Tandoor",price:"₹—"},{item:"Matka Biryani",price:"₹—"},{item:"Fish Amritsari Fry",price:"₹—"},{item:"Non-Veg Platter",price:"₹—"}] },
      { id:70, name:"Hot Momos", cuisine:"Momos / Street Food", price:"₹800-1300 for two", rating:4.3, tag:"Local favourite", hood:"Kharghar", address:"Shop no 14, Swarna CHS, Plot no 13/14, Sector 7, Kharghar, Panvel, Maharashtra 410210", desc:"A popular Kharghar eatery known for its flavorful food and generous portions. Guests often appreciate the quick service, consistent quality and satisfying experience that has earned it a loyal local following.", phone:"+91 87676 81828", img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80", photos:["https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"], menu:[{item:"Chicken Kurkure Momos",price:"₹—"},{item:"Chicken Steam Momos",price:"₹—"},{item:"Veg Cheese Kurkure Momos",price:"₹—"},{item:"Chicken Cocktail Momos",price:"₹—"}] },
      { id:71, name:"Journal Bombay", cuisine:"Café", price:"₹600-1000 for two", rating:4.5, tag:"Aesthetic spot", hood:"Santacruz", address:"396/3, Ground Floor, Parvati Building, N Ave Rd, Santacruz West, Mumbai, Maharashtra 400054", desc:"A Santacruz café known for its calm atmosphere and welcoming service. Guests often appreciate the quality of the food and coffee along with the comfortable setting that makes it easy to settle in and enjoy the experience at your own pace.", phone:"+91 90046 99654", img:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Banana Oats Pancakes",price:"₹—"},{item:"Double Meat Margarita Pizza",price:"₹—"},{item:"Thai Curry Bowl",price:"₹—"},{item:"Iced Latte",price:"₹—"}] },
      { id:72, name:"K. Rustom & Co.", cuisine:"Ice Cream Parlour", price:"₹300-500 for two", rating:4.4, tag:"Iconic since decades", hood:"Churchgate", address:"Brabourne Stadium, 86, Veer Nariman Rd, Churchgate, Mumbai, Maharashtra 400020", desc:"A legendary Churchgate ice cream parlour known for its signature ice cream sandwiches. Guests return for the nostalgic experience, wide variety of flavors and a taste that has remained a Mumbai favorite for generations.", phone:"+91 22 2282 1768", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", photos:["https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80"], menu:[{item:"Ice Cream Sandwich",price:"₹—"},{item:"King Mango",price:"₹—"},{item:"Pista",price:"₹—"},{item:"Walnut",price:"₹—"}] },
      { id:73, name:"Leaping Windows", cuisine:"Café & Bar with Library", price:"₹800-1300 for two", rating:4.5, tag:"Books + booze", hood:"Andheri", address:"Corner View 3, Dr. Ashok Chopra Marg, opp. Bianca Towers, Amit Nagar, Versova, Andheri West, Mumbai, Maharashtra 400061", desc:"A unique café in Versova known for its extensive comic book collection and cozy reading spaces. Guests often appreciate the relaxed atmosphere, friendly service and the experience of spending time surrounded by books and creativity.", phone:"+91 97699 98972", img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", photos:["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80"], menu:[{item:"Grilled Chicken Skewers",price:"₹—"},{item:"Pesto Pasta",price:"₹—"},{item:"Tenderloin Steak",price:"₹—"},{item:"Vietnamese Coffee",price:"₹—"}] },
      { id:74, name:"Maasoli Lunch Home", cuisine:"Seafood Restaurant", price:"₹800-1300 for two", rating:4.1, tag:"Konkan flavours", hood:"Byculla", address:"2nd, 1st Cross Ln, Byculla West, Mumbai, Maharashtra 400027", desc:"A popular seafood restaurant in Byculla known for its fresh coastal flavors and homely cooking. Guests often appreciate the consistent quality, generous portions and straightforward dining experience that has made it a favorite among seafood lovers.", phone:"+91 87795 61588", img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", photos:["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80"], menu:[{item:"Bombil Fry",price:"₹—"},{item:"Prawn Curry",price:"₹—"},{item:"Solkadhi",price:"₹—"},{item:"Pomfret Fry",price:"₹—"}] },
      { id:75, name:"Mahesh Lunch Home", cuisine:"Seafood Restaurant", price:"₹1800-3000 for two", rating:4.2, tag:"Mangalorean classics", hood:"Juhu", address:"Next to JW Marriott Mumbai Juhu, Juhu Tara, Juhu, Mumbai, Maharashtra 400049", desc:"A well-known seafood restaurant in Juhu celebrated for its fresh seafood and authentic coastal flavors. Guests often appreciate the consistent quality, attentive service and reliable dining experience that has made it a Mumbai favorite for years.", phone:"+91 90046 55554", img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Butter Garlic Prawns",price:"₹—"},{item:"Wok Fried Crab",price:"₹—"},{item:"Pomfret Tawa Fry",price:"₹—"},{item:"Neer Dosa",price:"₹—"}] },
      { id:76, name:"Mainland China", cuisine:"Chinese Restaurant", price:"₹1800-3000 for two", rating:4.3, tag:"Buffet favourite", hood:"Andheri", address:"Shalimar Morya Park, Ground Floor, off New Link Rd, Andheri West, Mumbai, Maharashtra 400053", desc:"A well-known Chinese restaurant in Andheri known for its consistent quality and refined dining experience. Guests often appreciate the flavorful food, attentive service and reliable experience that has made it a favorite for years.", phone:"+91 93204 78302", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80", photos:["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80","https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80"], menu:[{item:"Peking Poached Dumplings",price:"₹—"},{item:"Sticky Korean Fried Shrimp",price:"₹—"},{item:"Prawns Hunan Style",price:"₹—"},{item:"Dragon Fried Rice",price:"₹—"}] },
      { id:77, name:"MAZI - Coffee Bar | Kitchen", cuisine:"Café", price:"₹600-1000 for two", rating:4.4, tag:"Cozy hangout", hood:"Santacruz", address:"27C, Sujata Rajpipla CHS, Juhu Tara Rd, Hasmukh Nagar, Santacruz West, Mumbai, Maharashtra 400054", desc:"A stylish café in Santacruz known for its welcoming atmosphere. Guests often appreciate the quality of the food, comfortable setting and friendly service making it one of the area's well-loved cafés.", phone:"+91 86938 43243", img:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80", photos:["https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80","https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80","https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80"], menu:[{item:"Tiramisu Cappuccino",price:"₹—"},{item:"Chicken Sando",price:"₹—"},{item:"Parmesan Fondue Lasagne",price:"₹—"},{item:"Basque Cheesecake",price:"₹—"}] },
      { id:78, name:"Miya Kebabs", cuisine:"Kebab Restaurant", price:"₹600-1000 for two", rating:4.6, tag:"Insta-famous", hood:"Kala Ghoda", address:"Ali Chambers, Flora Fountain, 81-82, M Shetty Marg, Kala Ghoda, Fort, Mumbai, Maharashtra 400023", desc:"A popular eatery in Kala Ghoda known for its flavourful food and generous portions. Guests often appreciate the consistent quality, quick service, and satisfying meals that have made it a favourite among regulars in the area.", phone:"+91 88477 47644", img:"https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=600&q=80", photos:["https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80","https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80","https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80"], menu:[{item:"Butter Chicken Shawarma",price:"₹—"},{item:"Changezi Chicken Tikka",price:"₹—"},{item:"Cheesy Chicken Legs",price:"₹—"},{item:"Za'atar Naan with Hummus",price:"₹—"}] },
      { id:79, name:"Mizu", cuisine:"Japanese Restaurant", price:"₹600-1000 for two", rating:4.4, tag:"Sushi spot", hood:"Khar", address:"Ground Floor, Ganga Jamuna Building, 14th Rd, Khar West, Mumbai, Maharashtra 400052", desc:"A Japanese restaurant in Khar known for its elegant atmosphere and attention to detail. Guests often appreciate the quality of the food, attentive service and refined dining experience that has made it a favourite among Japanese cuisine enthusiasts.", phone:"+91 93720 23641", img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80", photos:["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80","https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80"], menu:[{item:"Dragon Roll Sushi",price:"₹—"},{item:"Pork Belly Bao",price:"₹—"},{item:"Spicy Prawn Donburi",price:"₹—"},{item:"Mini Pork Ramen",price:"₹—"}] },
      { id:80, name:"Modern Lunch Home", cuisine:"Mangalorean Seafood", price:"₹800-1300 for two", rating:4.1, tag:"Tulunadu classic", hood:"Sion", address:"Harak Niwas, 5, Station Rd, opp. Bank of Baroda, Sion Railway Colony, Sion West, Mumbai, Maharashtra 400022", desc:"A well-known restaurant in Sion celebrated for its fresh seafood and consistent quality. Guests often appreciate the generous portions, attentive service and reliable dining experience that has made it a favorite among locals for years.", phone:"+91 22 2409 7942", img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80", photos:["https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"], menu:[{item:"Surmai Pulimunchi",price:"₹—"},{item:"Prawns Ghee Roast",price:"₹—"},{item:"Kori Roti with Chicken",price:"₹—"},{item:"Neer Dosa",price:"₹—"}] },
      { id:81, name:"Mokai", cuisine:"Café", price:"₹600-1000 for two", rating:4.4, tag:"Aesthetic & matcha", hood:"Bandra", address:"600,601,602, Hill Crest Building, Dr Ambedkar Rd, Pali Naka, Bandra West, Mumbai, Maharashtra 400050", desc:"A lively café in Pali Hill known for its modern atmosphere and well-rounded menu. Guests often appreciate the quality of the food and coffee, friendly service and vibrant setting that has made it a popular spot in Bandra.", phone:"+91 98200 62166", img:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Raspberry Mochi Matcha",price:"₹—"},{item:"Lavender Matcha",price:"₹—"},{item:"Kimchi Fried Rice",price:"₹—"},{item:"Chicken Banh Mi",price:"₹—"}] },
      { id:82, name:"PAASHH", cuisine:"Organic / Vegetarian Café", price:"₹600-1000 for two", rating:4.3, tag:"All-organic", hood:"Bandra", address:"Ceillia Shelter, Rajan Cater Rd, opp. Aura Building, Shirley, Pali Hill, Bandra West, Mumbai, Maharashtra 400050", desc:"A thoughtfully designed café in Pali Hill known for its peaceful bungalow setting and vegetarian offerings. Guests often appreciate the warm hospitality, relaxed atmosphere, and the sense of slowing down that makes the experience feel special.", phone:"+91 95458 10001", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", photos:["https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80"], menu:[{item:"Paash Burrata",price:"₹—"},{item:"Purple Potato Tostada",price:"₹—"},{item:"Corn Gnocchi",price:"₹—"},{item:"Hazelnut Croissant",price:"₹—"}] },
      { id:83, name:"Ramen Bar Wagamama", cuisine:"Japanese / Asian Restaurant", price:"₹600-1000 for two", rating:4.8, tag:"Global chain favourite", hood:"Churchgate", address:"Cambata, Maharshi Karve Rd, Churchgate, Mumbai, Maharashtra 400020", desc:"A popular Japanese restaurant in Churchgate known for its authentic flavours and comforting dining experience. Guests often appreciate the quality of the food, attentive service and consistent experience that keeps regulars coming back.", phone:"+91 97027 03111", img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", photos:["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80"], menu:[{item:"Khao Soi Chicken Ramen",price:"₹—"},{item:"Gyoza",price:"₹—"},{item:"Gochujang Chicken Rice",price:"₹—"},{item:"Kokopanko Chicken",price:"₹—"}] },
      { id:84, name:"Roofberries Rooftop", cuisine:"Rooftop Bar", price:"₹600-1000 for two", rating:4.1, tag:"Celebration spot", hood:"Bandra", address:"Rooftop, Crystal Shoppers Paradise, Junction of 24th and 33rd Rd, off Linking Rd, Bandra West, Mumbai, Maharashtra 400050", desc:"A rooftop spot in Bandra known for its lively atmosphere and city views. Guests often appreciate the vibrant setting, attentive service and enjoyable dining experience making it a popular choice for evenings out with friends and family.", phone:"+91 73043 55403", img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", photos:["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80","https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80"], menu:[{item:"Mini Burgers",price:"₹—"},{item:"Dim Sum",price:"₹—"},{item:"Salmon Crostini",price:"₹—"},{item:"Signature Cocktails",price:"₹—"}] },
      { id:85, name:"Taftoon Bar & Kitchen", cuisine:"North Indian / Afghani", price:"₹1800-3000 for two", rating:4.3, tag:"BKC fine dine", hood:"BKC", address:"Naman Centre, G Block Rd, opp. SIDBI, BKC, Bandra East, Mumbai, Maharashtra 400051", desc:"An acclaimed restaurant in BKC known for showcasing regional Indian flavours from across the country. Guests often appreciate the quality of the food, attentive service and thoughtfully crafted dining experience that celebrates India's diverse culinary traditions.", phone:"+91 22 4973 5748", img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=600&q=80", photos:["https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=400&q=80","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80"], menu:[{item:"Dahi Ke Kebab",price:"₹—"},{item:"Mirchi Ke Pakode",price:"₹—"},{item:"Dal Bati Churma",price:"₹—"},{item:"Paan Chocolate",price:"₹—"}] },
      { id:86, name:"Yoko Sizzlers", cuisine:"Sizzler Restaurant", price:"₹800-1300 for two", rating:4.3, tag:"Old-school sizzlers", hood:"Santacruz", address:"10, 11, Swami Vivekanand Rd, Saraswat Nagar, Santacruz West, Mumbai, Maharashtra 400054", desc:"A long-standing restaurant in Santacruz known for its signature sizzlers and generous portions. Guests often appreciate the consistent quality, lively dining experience, and familiar flavors that have made it a favorite across generations.", phone:"+91 91678 68641", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80", photos:["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80","https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80","https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80","https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80"], menu:[{item:"Yoko Special Chicken Sizzler",price:"₹—"},{item:"Prawns Fried Rice",price:"₹—"},{item:"Paneer Sizzler",price:"₹—"},{item:"Exotic Veg Sizzler",price:"₹—"}] },
      { id:87, name:"Mia Cuccinna", cuisine:"Italian Restaurant", price:"₹1200-1800 for two", rating:4.1, tag:"Wood-fired Italian", hood:"Bandra West", address:"C'est la Vie Club, 164, Hill Rd, next to Holy Family Hospital, Bandra West, Mumbai, Maharashtra 400050", desc:"A cozy Bandra spot with a European-inspired ambience, known for wood-fired pizzas, fresh pastas and a well-loved tiramisu. A popular pick for casual lunches and celebrations alike.", phone:"+91 96199 54545", img:"https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=600&q=80", photos:["https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80","https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80","https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80"], menu:[{item:"Pesto Tagliatelle",price:"₹—"},{item:"Penne Arrabiata",price:"₹—"},{item:"Wood-fired Pizzetta",price:"₹—"},{item:"Tiramisu",price:"₹—"}] },
      { id:88, name:"Salt Water Cafe", cuisine:"Continental", price:"₹1800-3000 for two", rating:4.3, tag:"Bandra institution", hood:"Bandra West", address:"Annexe, 87, Rose Minar, Chapel Rd, Reclamation, Bandra West, Mumbai, Maharashtra 400050", desc:"A long-running Bandra café known for generous portions and a consistently strong menu spanning pastas, burgers and hearty breakfasts. A reliable favorite for both casual brunches and bigger appetites.", phone:"+91 86575 31985", img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80", photos:["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80","https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80"], menu:[{item:"Fish Burger",price:"₹—"},{item:"Fish & Chips",price:"₹—"},{item:"Flourless Chocolate Fudge",price:"₹—"},{item:"Tiramisu",price:"₹—"}] },
      { id:89, name:"Maiz Mexican Kitchen", cuisine:"Mexican Restaurant", price:"₹1200-1800 for two", rating:4.5, tag:"Fresh Mexican bowls", hood:"Lower Parel", address:"Gala 21A, Lakshmi Industrial Estate, Shankar Rao Naram Path, Lower Parel, Mumbai, Maharashtra 400013", desc:"A Lower Parel kitchen serving customizable burrito bowls, tacos and nachos made with fresh, quality ingredients. Known for generous portions and well-balanced house sauces.", phone:"+91 98922 89611", img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80", photos:["https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"], menu:[{item:"Burrito Bowl",price:"₹—"},{item:"Tofu Quesadilla",price:"₹—"},{item:"Loaded Nachos",price:"₹—"},{item:"Chipotle Tacos",price:"₹—"}] },
      { id:90, name:"Mezcalita Bandra", cuisine:"Mexican Restaurant", price:"₹1200-1800 for two", rating:4.7, tag:"Mexican cantina", hood:"Bandra West", address:"320, Madhu Milan Building, Dr Ambedkar Road, Pali Hill Rd, Bandra West, Mumbai, Maharashtra 400051", desc:"A bright, lively Mexican cantina in Bandra blending creative and traditional flavors, with a vibrant menu of tacos, guacamole and margaritas. A go-to spot for a fun night out.", phone:"+91 91520 17980", img:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", photos:["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80","https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80","https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"], menu:[{item:"Guacamole",price:"₹—"},{item:"Chicken Taco",price:"₹—"},{item:"Margarita",price:"₹—"},{item:"Elote (Mexican Street Corn)",price:"₹—"}] }
    ],
    mapPlaces: [
      {id:1,name:"Leopold Cafe",rating:4.2,top:"15%",left:"55%"},{id:2,name:"Brooke Bond Taj Mahal Tea House",rating:4.5,top:"28%",left:"18%"},{id:3,name:"Britannia & Co. Restaurant",rating:4.1,top:"28%",left:"65%"},{id:4,name:"Gajalee",rating:4.3,top:"42%",left:"32%"},{id:5,name:"Prithvi Cafe",rating:4.4,top:"48%",left:"62%"},{id:6,name:"Mahesh Lunch Home",rating:4.2,top:"56%",left:"22%"},{id:7,name:"Bombay Coffee House",rating:4.2,top:"60%",left:"66%"},{id:8,name:"Mamledar Misal",rating:4.2,top:"68%",left:"40%"},
    ],
    events: [
      { id:1, name:"Indie Night Live Concert", cats:["Music","Nightlife"], date:"24", mon:"May", fullDate:"24 May 2025", time:"7:00 PM – 10:30 PM", loc:"Bandra Fort Amphitheatre, Mumbai", entry:"Free Entry", interested:1800, img:"https://images.unsplash.com/photo-1501386761578-eaa54b02c811?w=700&q=80", desc:"An evening of indie music featuring local artists.", organizer:"The Habitat", mapTop:"30%", mapLeft:"18%" },
      { id:2, name:"Jazz in the Park", cats:["Music"], date:"25", mon:"May", fullDate:"25 May 2025", time:"6:00 PM – 9:00 PM", loc:"Five Gardens, Shivaji Park", entry:"Free Entry", interested:640, img:"https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=700&q=80", desc:"An evening of smooth jazz under the open sky.", organizer:"The Habitat", mapTop:"55%", mapLeft:"35%" },
      { id:3, name:"Acoustic Sundays", cats:["Music","Workshops"], date:"26", mon:"May", fullDate:"26 May 2025", time:"4:00 PM – 8:00 PM", loc:"Blue Door Café, Bandra West", entry:"Paid", interested:320, img:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700&q=80", desc:"Intimate acoustic sessions every Sunday.", organizer:"Blue Door", mapTop:"40%", mapLeft:"58%" },
      { id:4, name:"Beachside Gig", cats:["Music","Outdoors"], date:"26", mon:"May", fullDate:"26 May 2025", time:"5:00 PM – 8:00 PM", loc:"Versova Beach", entry:"Free Entry", interested:890, img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80", desc:"Live music with the sea as your backdrop.", organizer:"Beach Events", mapTop:"22%", mapLeft:"12%" },
      { id:5, name:"Sunset Beats", cats:["Music","Nightlife"], date:"26", mon:"May", fullDate:"26 May 2025", time:"5:00 PM – 8:00 PM", loc:"Worli Sea Face", entry:"Paid", interested:450, img:"https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=700&q=80", desc:"Electronic music meets Worli sea face.", organizer:"Sunset Events", mapTop:"68%", mapLeft:"62%" },
      { id:6, name:"Live Band Night", cats:["Music","Nightlife"], date:"31", mon:"May", fullDate:"31 May 2025", time:"9:00 PM – 1:00 AM", loc:"Bandra Pub", entry:"Paid", interested:560, img:"https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=700&q=80", desc:"Four bands, one night. Mumbai's best live music venue.", organizer:"Bandra Pub", mapTop:"75%", mapLeft:"30%" },
    ],
    thirdPlaces: [
      { id:1, name:"Cafe Aranya", cats:["Cafe","Community"], dist:"700 m", desc:"A cozy cafe with open seating and great coffee.", visitors:56, img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", addedBy:"Neha S." },
      { id:2, name:"Greenview Park", cats:["Nature","Relaxation"], dist:"1.2 km", desc:"Peaceful park perfect for a walk or some quiet time.", visitors:128, img:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80", addedBy:"Arjun M." },
      { id:3, name:"City Central Library", cats:["Study & Work"], dist:"1.6 km", desc:"Quiet space to read, study and focus.", visitors:94, img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80", addedBy:"Kavya R." },
      { id:4, name:"Kala Street Art Lane", cats:["Art & Culture"], dist:"1.9 km", desc:"Vibrant street art and creative community vibes.", visitors:76, img:"https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80", addedBy:"Rohit P." },
    ],
    people: [
      { id:1, ini:"A", name:"Ananya", age:26, city:"Mumbai", color:"#e8f0e8", tc:"#2d6a2d",
        photos:["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80","https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80","https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80"],
        interests:["Live Music","Food & Dining","Travel","Books","Art & Culture","Photography","Fitness","Films"],
        sharedInterests:["Live Music","Food & Dining","Photography"],
        prompts:[{q:"What recent incident changed your perspective on something and how?",a:"Losing my wallet while traveling alone taught me to be more adaptable and trust that things usually work out."},{q:"If you were the mayor for a day what's one thing you'd change about your city?",a:"I'd make public transport free for a day to see how much lighter the city feels without traffic."},{q:"What's something you've been curious about recently?",a:"How sustainable living can actually be affordable for everyone."}],
        cityWants:["Run a half marathon","Attend a live music gig","Explore hidden bookstores","Try new restaurants","Plan a road trip"],
        sharedThings:["Attend a live music gig","Try new restaurants"],
        songs:[{title:"Lose Yourself",artist:"Eminem"},{title:"Heat Waves",artist:"Glass Animals"},{title:"The Night We Met",artist:"Lord Huron"}],
        recs:[{title:"Interstellar",type:"Movie"},{title:"Breaking Bad",type:"Series"},{title:"Our Planet",type:"Documentary"}],
        foodRecs:[{name:"The Bombay Canteen, Lower Parel",desc:"Modern Indian cuisine with a twist",img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&q=80"},{name:"Bastian, Bandra",desc:"Seafood · Great ambience",img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80"},{name:"Leopold Cafe, Colaba",desc:"Classic vibes and comfort food",img:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80"}],
        cityRecs:[{name:"Marine Drive",desc:"Perfect sunset walks and sea breeze",img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80"},{name:"Worli Sea Face",desc:"Peaceful evenings by the sea",img:"https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=200&q=80"},{name:"Sanjay Gandhi National Park",desc:"Best for a morning trek",img:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80"}],
      },
      { id:2, ini:"R", name:"Rohit", age:27, city:"Mumbai", color:"#e8eef5", tc:"#1a3a5c",
        photos:["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80","https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"],
        interests:["Tech","Fitness","Travel","Food & Dining","Live Music","Films"],
        sharedInterests:["Live Music","Food & Dining"],
        prompts:[{q:"What recent incident changed your perspective on something and how?",a:"Solo backpacking in the Himalayas taught me to slow down and truly appreciate the little things."},{q:"If you were the mayor for a day what's one thing you'd change about your city?",a:"I'd make public spaces more vibrant and accessible for everyone."},{q:"What's something you've been curious about recently?",a:"I've been trying to understand how AI can actually make everyday life better."}],
        cityWants:["Run half marathon","Learn guitar","Go for trekking","Watch stand-up comedy","Try new restaurants"],
        sharedThings:["Try new restaurants","Attend a live music gig"],
        songs:[{title:"The Night We Met",artist:"Lord Huron"},{title:"Yellow",artist:"Coldplay"},{title:"Choo Lo",artist:"The Local Train"}],
        recs:[{title:"Interstellar",type:"Movie"},{title:"Breaking Bad",type:"Series"},{title:"Cosmos",type:"Documentary"}],
        foodRecs:[{name:"Prithvi Café, Juhu",desc:"Best chai and a literary crowd",img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80"},{name:"Bademiya, Colaba",desc:"Late night seekh kebabs — unmissable",img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=200&q=80"},{name:"Haji Ali Juice, Haji Ali",desc:"Fresh juices with a legendary view",img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&q=80"}],
        cityRecs:[{name:"Bandstand Promenade",desc:"Best evening walk in Bandra",img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80"},{name:"Colaba Causeway",desc:"Shopping and heritage in one stretch",img:"https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=200&q=80"},{name:"Versova Beach at dawn",desc:"Empty, calm, and absolutely beautiful",img:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80"}],
      },
    ],
  },
};

const CUISINES_LIST = ["All","Indian","Italian","Chinese","Japanese","Mexican","Thai","Continental","Dessert","Cafe","Middle Eastern","Korean","Mediterranean","Healthy","Street Food"];
const THIRD_CATS = ["All","Nature","Study & Work","Community","Art & Culture","Wellness"];
const CAT_FILTERS = ["All","Music","Art & Culture","Workshops","Sports","Festivals","Networking","Comedy","Outdoors","Food & Dining","Nightlife"];

// NEW — interest & things chips for onboarding
const INTEREST_OPTIONS = [
  {id:"music",label:"Live Music",icon:"🎵"},{id:"art",label:"Art & Culture",icon:"🎨"},{id:"food",label:"Food & Dining",icon:"🍽️"},{id:"fitness",label:"Fitness",icon:"🏃"},{id:"comedy",label:"Comedy",icon:"😂"},{id:"books",label:"Books",icon:"📚"},{id:"travel",label:"Travel",icon:"✈️"},{id:"photography",label:"Photography",icon:"📷"},{id:"networking",label:"Networking",icon:"🤝"},{id:"sports",label:"Sports",icon:"⚽"},{id:"wellness",label:"Wellness",icon:"🧘"},{id:"tech",label:"Tech",icon:"💻"},{id:"film",label:"Films",icon:"🎬"},{id:"festivals",label:"Festivals",icon:"🎉"},{id:"workshops",label:"Workshops",icon:"✏️"},{id:"outdoors",label:"Outdoors",icon:"🌿"},
];
const THINGS_OPTIONS = [
  "Attend a live music gig","Explore hidden bookstores","Try a new restaurant","Join a running club","Visit an art gallery","Attend a comedy show","Go hiking","Take a cooking class","Watch a play","Plan a road trip","Join a sports team","Attend a film screening","Try pottery or a craft class","Go to a food festival","Explore street art","Attend a rooftop event","Join a book club","Try open mic night",
];
const CUISINE_OPTIONS = [
  {id:"Indian",label:"Indian",icon:"🍛"},{id:"Street Food",label:"Street Food",icon:"🌮"},{id:"Cafe & Coffee",label:"Café & Coffee",icon:"☕"},{id:"Bakery & Desserts",label:"Bakery & Desserts",icon:"🧁"},{id:"Seafood",label:"Seafood",icon:"🦐"},{id:"Chinese",label:"Chinese",icon:"🥢"},{id:"Japanese",label:"Japanese",icon:"🍣"},{id:"Continental & Italian",label:"Continental & Italian",icon:"🍝"},{id:"Momos & Tibetan",label:"Momos & Tibetan",icon:"🥟"},{id:"Lebanese & Middle Eastern",label:"Lebanese & Middle Eastern",icon:"🧆"},{id:"Bar & Rooftop",label:"Bar & Rooftop",icon:"🍹"},{id:"Irani & Parsi Cafe",label:"Irani & Parsi Café",icon:"🫖"},
];
// Maps each onboarding cuisine tag to substrings matched (case-insensitive) against a food place's `cuisine` field
const CUISINE_TAG_MAP = {
  "Indian": ["indian","punjabi","maharashtrian","parsi","gujarati","rajasthani","north indian","south indian","tandoor","thali","multi-cuisine"],
  "Street Food": ["street food","vada pav","fast food","chaat","pav bhaji"],
  "Cafe & Coffee": ["café","cafe","coffee","tea house"],
  "Bakery & Desserts": ["bakery","pâtisserie","patisserie","ice cream","dessert"],
  "Seafood": ["seafood","mangalorean","coastal","goan"],
  "Chinese": ["chinese"],
  "Japanese": ["japanese","sushi","ramen ","sizzler"],
  "Continental & Italian": ["continental","italian","pizza","multi-cuisine","ethiopian"],
  "Momos & Tibetan": ["momos","tibetan"],
  "Lebanese & Middle Eastern": ["lebanese","middle eastern","kebab","mughlai","afghani"],
  "Bar & Rooftop": ["rooftop","bar"],
  "Irani & Parsi Cafe": ["irani","parsi"],
};
const BUDGET_OPTIONS = [
  {id:"budget",label:"Budget-friendly",sub:"Mostly under ₹600 for two",icon:"🪙"},
  {id:"mid",label:"Mid-range",sub:"₹600–1500 for two",icon:"💳"},
  {id:"premium",label:"Premium",sub:"₹1500+ for two",icon:"💎"},
  {id:"flexible",label:"Flexible",sub:"Depends on the day",icon:"🎲"},
];
// Estimates a 1–3 price level from a place's free-text price string (e.g. "₹800-1300 for two")
function priceLevelFromString(priceStr) {
  if (!priceStr) return 2;
  const nums = (priceStr.match(/\d+/g) || []).map(Number);
  if (nums.length === 0) return 2;
  const avg = nums.reduce((a,b)=>a+b,0) / nums.length;
  if (avg < 600) return 1;
  if (avg < 1500) return 2;
  return 3;
}
const BUDGET_TO_LEVEL = { budget:1, mid:2, premium:3, flexible:null };


// ─── ONBOARDING ── NEW: tap chips, no typing ──────────────────────────────────
function Onboarding({ onDone, onShowSignIn, onBackToLanding, initialCity, initialName }) {
  const skipBasics = !!(initialCity && initialName);
  const [step, setStep] = useState(skipBasics ? 3 : 1); // skip straight to interests if signup already collected city+name
  const [city, setCity] = useState(initialCity || "");
  const [name, setName] = useState(initialName || ""); const [age, setAge] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState("");
  const [selInterests, setSelInterests] = useState([]);
  const [selThings, setSelThings] = useState([]);
  const [selCuisines, setSelCuisines] = useState([]); // order = priority, first tapped = top preference
  const [budget, setBudget] = useState("");
  const togI = id => setSelInterests(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]);
  const togT = t  => setSelThings(p  => p.includes(t)  ? p.filter(x=>x!==t)  : [...p, t]);
  const togC = id => setSelCuisines(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]);
  const moveCuisine = (id, dir) => setSelCuisines(p => {
    const idx = p.indexOf(id); const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= p.length) return p;
    const next = [...p]; [next[idx], next[newIdx]] = [next[newIdx], next[idx]]; return next;
  });

  // Step 0 — Landing
  if (step === 0) return (
    <div className="ob-root">
      <div className="ob-hero">
        <div className="ob-hero-img" style={{backgroundImage:`url(https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800&q=80)`}}/>
        <div className="ob-hero-overlay"/>
        <div className="ob-hero-content"><div className="ob-logo-hero"><NearMetLogo size={52} dark/></div><p className="ob-hero-tagline">Explore your city.<br/>Find genuine connections.</p></div>
        <div className="ob-hero-bottom">
          <button className="ob-cta-primary" onClick={()=>setStep(1)}>Create an account</button>
          <button className="ob-cta-secondary" onClick={()=>onShowSignIn()}>I have an account</button>
          <p className="ob-legal">By signing up, you agree to our <span className="ob-link">Terms & Conditions</span> and <span className="ob-link">Privacy Policy</span>.</p>
        </div>
      </div>
    </div>
  );

  // Step 1 — City (only shown if not already known from signup)
  if (step === 1) return (
    <div className="ob-step-wrap">
      <div className="ob-step-progress"><div className="ob-progress-bar" style={{width:"15%"}}/></div>
      <div className="ob-step-body">
        <div className="ob-step-label">STEP 1 OF 6 — YOUR CITY</div>
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
      </div>
      <div className="ob-step-nav"><button className="ob-btn-ghost" onClick={()=>{ if(onBackToLanding) onBackToLanding(); else onShowSignIn(); }}>Back</button><button className="ob-btn-primary" disabled={!city} onClick={()=>setStep(2)}>Next →</button></div>
    </div>
  );

  // Step 2 — Basic info (Name + Age) — only shown if not already known from signup
  if (step === 2) return (
    <div className="ob-step-wrap">
      <div className="ob-step-progress"><div className="ob-progress-bar" style={{width:"30%"}}/></div>
      <div className="ob-step-body">
        <div className="ob-step-label">STEP 2 OF 6 — ABOUT YOU</div>
        <h2 className="ob-step-title">What should we call you?</h2>
        <p className="ob-step-sub">This appears on your profile.</p>
        <div className="ob-form">
          <div className="ob-field"><label className="ob-field-label">NAME</label><input className="ob-input" type="text" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)}/></div>
          <div className="ob-field"><label className="ob-field-label">AGE</label><input className="ob-input" type="number" placeholder="18+" value={age} onChange={e=>setAge(e.target.value)}/></div>
        </div>
      </div>
      <div className="ob-step-nav"><button className="ob-btn-ghost" onClick={()=>setStep(1)}>Back</button><button className="ob-btn-primary" disabled={!name.trim() || !age || parseInt(age)<18} onClick={()=>setStep(3)}>Next →</button></div>
    </div>
  );

  // Step 3 — Interests (tap chips) — entry point when coming from signup
  if (step === 3) return (
    <div className="ob-step-wrap">
      <div className="ob-step-progress"><div className="ob-progress-bar" style={{width: skipBasics ? "25%" : "45%"}}/></div>
      <div className="ob-step-body" style={{overflowY:"auto"}}>
        <div className="ob-step-label">{skipBasics ? "STEP 1 OF 4" : "STEP 3 OF 6"} — YOUR INTERESTS</div>
        <h2 className="ob-step-title">What are you into?</h2>
        <p className="ob-step-sub">Tap to select. This builds your feed and helps us find your people.</p>
        <div className="ob-chips-grid">
          {INTEREST_OPTIONS.map(i=>(
            <button key={i.id} className={`ob-chip ${selInterests.includes(i.id)?"active":""}`} onClick={()=>togI(i.id)}>
              <span className="ob-chip-icon">{i.icon}</span>
              <span className="ob-chip-label">{i.label}</span>
              {selInterests.includes(i.id) && <span className="ob-chip-check">✓</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="ob-step-nav"><button className="ob-btn-ghost" onClick={()=>{ if(skipBasics){ if(onBackToLanding) onBackToLanding(); else onShowSignIn(); } else setStep(2); }}>Back</button><button className="ob-btn-primary" disabled={selInterests.length===0} onClick={()=>setStep(4)}>Next →</button></div>
    </div>
  );

  // Step 4 — Things to do (tap chips)
  if (step === 4) return (
    <div className="ob-step-wrap">
      <div className="ob-step-progress"><div className="ob-progress-bar" style={{width: skipBasics ? "50%" : "67%"}}/></div>
      <div className="ob-step-body" style={{overflowY:"auto"}}>
        <div className="ob-step-label">{skipBasics ? "STEP 2 OF 4" : "STEP 4 OF 6"} — THINGS TO DO</div>
        <h2 className="ob-step-title">What do you want to do?</h2>
        <p className="ob-step-sub">Tap everything that excites you. This is how we match you with the right people.</p>
        <div className="ob-things-grid">
          {THINGS_OPTIONS.map(t=>(
            <button key={t} className={`ob-thing-chip ${selThings.includes(t)?"active":""}`} onClick={()=>togT(t)}>
              {t}{selThings.includes(t) && <span className="ob-chip-check">✓</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="ob-step-nav"><button className="ob-btn-ghost" onClick={()=>setStep(3)}>Back</button><button className="ob-btn-primary" disabled={selThings.length===0} onClick={()=>setStep(5)}>Next →</button></div>
    </div>
  );

  // Step 5 — Cuisines (ranked priority list: tap to add, reorder with arrows; first = top preference)
  if (step === 5) return (
    <div className="ob-step-wrap">
      <div className="ob-step-progress"><div className="ob-progress-bar" style={{width: skipBasics ? "75%" : "83%"}}/></div>
      <div className="ob-step-body" style={{overflowY:"auto"}}>
        <div className="ob-step-label">{skipBasics ? "STEP 3 OF 4" : "STEP 5 OF 6"} — FOOD PREFERENCES</div>
        <h2 className="ob-step-title">What do you love to eat?</h2>
        <p className="ob-step-sub">Tap to add a cuisine, then reorder so your favorite is on top. We'll use this to recommend places you'll actually like.</p>
        <div className="ob-chips-grid">
          {CUISINE_OPTIONS.filter(c=>!selCuisines.includes(c.id)).map(c=>(
            <button key={c.id} className="ob-chip" onClick={()=>togC(c.id)}>
              <span className="ob-chip-icon">{c.icon}</span>
              <span className="ob-chip-label">{c.label}</span>
            </button>
          ))}
        </div>
        {selCuisines.length>0 && (
          <div className="ob-ranked-list">
            <div className="ob-ranked-label">Your ranking (top = most preferred)</div>
            {selCuisines.map((id,i)=>{ const c=CUISINE_OPTIONS.find(o=>o.id===id); return (
              <div key={id} className="ob-ranked-row">
                <span className="ob-ranked-num">{i+1}</span>
                <span className="ob-ranked-icon">{c?.icon}</span>
                <span className="ob-ranked-label-text">{c?.label}</span>
                <div className="ob-ranked-actions">
                  <button className="ob-ranked-btn" disabled={i===0} onClick={()=>moveCuisine(id,-1)}>↑</button>
                  <button className="ob-ranked-btn" disabled={i===selCuisines.length-1} onClick={()=>moveCuisine(id,1)}>↓</button>
                  <button className="ob-ranked-btn ob-ranked-remove" onClick={()=>togC(id)}>×</button>
                </div>
              </div>
            );})}
          </div>
        )}
      </div>
      <div className="ob-step-nav"><button className="ob-btn-ghost" onClick={()=>setStep(4)}>Back</button><button className="ob-btn-primary" disabled={selCuisines.length===0} onClick={()=>setStep(6)}>Next →</button></div>
    </div>
  );

  // Step 6 — Budget
  if (step === 6) return (
    <div className="ob-step-wrap">
      <div className="ob-step-progress"><div className="ob-progress-bar" style={{width: skipBasics ? "90%" : "95%"}}/></div>
      <div className="ob-step-body" style={{overflowY:"auto"}}>
        <div className="ob-step-label">{skipBasics ? "STEP 4 OF 4" : "STEP 6 OF 6"} — YOUR BUDGET</div>
        <h2 className="ob-step-title">What's your usual budget for two?</h2>
        <p className="ob-step-sub">This helps us surface places that fit how you like to spend.</p>
        <div className="ob-city-list">
          {BUDGET_OPTIONS.map(b=>(
            <button key={b.id} className={`ob-city-item ${budget===b.id?"active":""}`} onClick={()=>setBudget(b.id)}>
              <span className="ob-city-flag">{b.icon}</span>
              <div><div className="ob-city-name">{b.label}</div><div className="ob-city-sub">{b.sub}</div></div>
              <div className={`ob-radio ${budget===b.id?"filled":""}`}/>
            </button>
          ))}
        </div>
      </div>
      <div className="ob-step-nav"><button className="ob-btn-ghost" onClick={()=>setStep(5)}>Back</button><button className="ob-btn-primary" disabled={!budget} onClick={()=>setStep(7)}>Next →</button></div>
    </div>
  );

  // Step 7 — Done
  return (
    <div className="ob-step-wrap">
      <div className="ob-step-progress"><div className="ob-progress-bar" style={{width:"100%"}}/></div>
      <div className="ob-done-screen">
        <div className="ob-done-check">✓</div>
        <h2 className="ob-done-title">You're in, {name}.</h2>
        <p className="ob-done-sub">Your feed is ready. Explore events happening in {city==="nyc"?"New York":"Mumbai"} and find people who share your world.</p>
        <div className="ob-done-interests">
          {selInterests.slice(0,6).map(id=>{ const i=INTEREST_OPTIONS.find(o=>o.id===id); return <span key={id} className="ob-done-chip">{i?.icon} {i?.label}</span>; })}
        </div>
        <button className="ob-btn-primary ob-btn-full" style={{marginTop:32}} onClick={()=>onDone({city,name,interests:selInterests,things:selThings,cuisines:selCuisines,budget})}>Go to my feed →</button>
      </div>
    </div>
  );
}

// ─── FOOD DETAIL ──────────────────────────────────────────────────────────────
function FoodDetail({ restaurant, onBack, userId, userName, isSaved, onToggleSave }) {
  const [shareFeedback, setShareFeedback] = useState("");
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [note, setNote] = useState("");
  const [favoriteItem, setFavoriteItem] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");
    getFoodExperiences(restaurant.name)
      .then(data => { if (active) setExperiences(data || []); })
      .catch(e => { console.error("Failed to load experiences:", e); if (active) setLoadError("Couldn't load community experiences right now."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [restaurant.name]);

  const handlePhotoPick = (file) => {
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleShare = async () => {
    const shareText = `${restaurant.name} — ${restaurant.cuisine} in ${restaurant.hood}`;
    const shareUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address || restaurant.name + " " + restaurant.hood)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: restaurant.name, text: shareText, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setShareFeedback("Link copied!");
        setTimeout(()=>setShareFeedback(""), 2000);
      }
    } catch (e) {
      if (e.name !== "AbortError") console.error("Share failed:", e); // AbortError = user cancelled the share sheet, not an error
    }
  };

  const handleSubmit = async () => {
    if (!userId) { setSubmitError("Sign in to share your experience."); return; }
    if (!photoFile && !note.trim() && !favoriteItem.trim()) { setSubmitError("Add a photo, a note, or a favorite item before sharing."); return; }
    setSubmitting(true);
    setSubmitError("");
    try {
      let photoUrl = null;
      if (photoFile) photoUrl = await uploadFoodExperiencePhoto(userId, photoFile);
      const saved = await shareFoodExperience(userId, userName || "Someone", restaurant.name, { photoUrl, note: note.trim(), favoriteItem: favoriteItem.trim() });
      setExperiences(prev => [saved, ...prev]);
      setNote(""); setFavoriteItem(""); setPhotoFile(null); setPhotoPreview(null); setFormOpen(false);
    } catch (e) {
      console.error("Failed to share experience:", e);
      setSubmitError("Couldn't share that — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const prev = experiences;
    setExperiences(experiences.filter(e => e.id !== id));
    try { await deleteFoodExperience(id); } catch (e) { console.error("Delete failed:", e); setExperiences(prev); }
  };

  return (
    <div className="detail-root">
      <div className="detail-header">
        <button className="detail-back" onClick={onBack}>←</button>
        <div className="detail-header-title"><div>Spot details</div><div className="detail-header-sub">Click on a spot to view details</div></div>
        <div className="detail-header-actions"><button className="detail-action-btn" onClick={()=>onToggleSave(restaurant.name)}>{isSaved ? "🔖" : "📑"}</button><button className="detail-action-btn" onClick={handleShare}>↗</button></div>
      </div>
      <div className="detail-hero-img-wrap"><img src={restaurant.img} alt={restaurant.name} className="detail-hero-img"/></div>
      <div className="detail-body">
        <div className="detail-name-row"><div className="detail-name">{restaurant.name}</div><div className="detail-rating-pill">★ {restaurant.rating}</div></div>
        <div className="detail-meta">{restaurant.cuisine} • {restaurant.hood}</div>
        {shareFeedback && <div className="share-feedback">✓ {shareFeedback}</div>}
        <div className="detail-actions-row">
          <a className="detail-act-item" href={`tel:${restaurant.phone}`}><span className="detail-act-icon">📞</span><span className="detail-act-label">Call</span></a>
          <a className="detail-act-item" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address || restaurant.name + " " + restaurant.hood)}`} target="_blank" rel="noopener noreferrer"><span className="detail-act-icon">📍</span><span className="detail-act-label">Directions</span></a>
          <button className="detail-act-item" onClick={handleShare}><span className="detail-act-icon">↗</span><span className="detail-act-label">Share</span></button>
          <button className="detail-act-item" onClick={()=>onToggleSave(restaurant.name)}><span className="detail-act-icon">{isSaved ? "🔖" : "📑"}</span><span className="detail-act-label">{isSaved ? "Saved" : "Save"}</span></button>
        </div>
        <div className="detail-divider"/>
        <div className="detail-section-title">About</div>
        <p className="detail-about">{restaurant.desc}</p>
        {restaurant.address && <p className="detail-about-meta">📍 {restaurant.address}</p>}
        {restaurant.phone && <p className="detail-about-meta">📞 {restaurant.phone}</p>}
        <div className="detail-divider"/>

        <div className="detail-photos-header">
          <span className="detail-section-title">Community experiences</span>
          <button className="detail-viewall" onClick={()=>setFormOpen(o=>!o)}>{formOpen ? "Cancel" : "Share your experience"}</button>
        </div>
        <p className="detail-experiences-sub">Real photos and moments from people who've been here — not stock photos.</p>

        {formOpen && (
          <div className="experience-form">
            {submitError && <div className="profile-save-error" style={{marginTop:0}}>⚠️ {submitError}</div>}
            <label className="experience-photo-picker">
              {photoPreview ? <img src={photoPreview} alt="" className="experience-photo-preview"/> : <span>📷 Add a photo (optional)</span>}
              <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>handlePhotoPick(e.target.files?.[0] || null)}/>
            </label>
            <input className="ob-input" style={{marginTop:10}} placeholder="Your favorite item here (optional)" value={favoriteItem} onChange={e=>setFavoriteItem(e.target.value)}/>
            <textarea className="ob-input experience-textarea" style={{marginTop:10}} placeholder="What was it like? (optional)" value={note} onChange={e=>setNote(e.target.value)} rows={3}/>
            <button className="filter-apply" style={{marginTop:12}} disabled={submitting} onClick={handleSubmit}>{submitting ? "Sharing…" : "Share with the community"}</button>
          </div>
        )}

        {loading && <div className="food-empty-state" style={{padding:"20px 0"}}>Loading experiences…</div>}
        {!loading && loadError && <div className="food-empty-state" style={{padding:"20px 0"}}>{loadError}</div>}
        {!loading && !loadError && experiences.length === 0 && (
          <div className="food-empty-state" style={{padding:"20px 0"}}>No one's shared an experience here yet — be the first.</div>
        )}
        {!loading && experiences.map(exp => (
          <div key={exp.id} className="experience-card">
            {exp.photo_url && <img src={exp.photo_url} alt="" className="experience-card-img"/>}
            <div className="experience-card-body">
              <div className="experience-card-row">
                <span className="experience-card-user">{exp.user_name}</span>
                {userId === exp.user_id && <button className="experience-delete" onClick={()=>handleDelete(exp.id)}>Remove</button>}
              </div>
              {exp.favorite_item && <div className="experience-card-fav">⭐ Favorite: {exp.favorite_item}</div>}
              {exp.note && <p className="experience-card-note">{exp.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAP VIEW (food map) ──────────────────────────────────────────────────────
function MapView({ city, onBack, onSelectPlace }) {
  const cd = CITIES[city];
  const [filterOpen, setFilterOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState(["All"]);
  const [selectedAreas, setSelectedAreas] = useState(["All"]);
  const [sortBy, setSortBy] = useState("Recommended");
  const [addForm, setAddForm] = useState({name:"",cuisine:"",address:"",phone:"",note:""});
  const cityAreas = ["All", ...Array.from(new Set(cd.food.map(r=>r.hood)))];
  const toggleCuisine = c => { if(c==="All"){setSelectedCuisines(["All"]);return;} setSelectedCuisines(prev=>{const w=prev.filter(x=>x!=="All");return w.includes(c)?w.filter(x=>x!==c)||["All"]:[...w,c];}); };
  const toggleArea = a => { if(a==="All"){setSelectedAreas(["All"]);return;} setSelectedAreas(prev=>{const w=prev.filter(x=>x!=="All");return w.includes(a)?w.filter(x=>x!==a)||["All"]:[...w,a];}); };
  return (
    <div className="map-root">
      <div className="map-header"><button className="detail-back" onClick={onBack}>←</button><div><div className="map-header-title">Food near me</div><div className="map-header-sub">Recommendations for you</div></div></div>
      <div className="map-canvas" style={{position:"relative",height:520}}>
        <img
          src={city==="mumbai" ? "https://images.unsplash.com/photo-1562979314-bee7453e911c?w=1400&q=80" : "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1400&q=80"}
          alt="city map"
          style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",display:"block",filter:"saturate(0.7) brightness(1.05)"}}
        />
        {cd.mapPlaces.map(p=>(
          <button key={p.id} className="map-pin" style={{top:p.top,left:p.left,position:"absolute"}} onClick={()=>{const found=cd.food.find(f=>f.name===p.name);if(found) onSelectPlace(found);}}>
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
      {filterOpen&&(<div className="modal-bg" onClick={()=>setFilterOpen(false)}><div className="modal-sheet filter-sheet" onClick={e=>e.stopPropagation()}><div className="filter-header"><button className="filter-close" onClick={()=>setFilterOpen(false)}>✕</button><div className="filter-title">Filter</div><button className="filter-reset" onClick={()=>{setSelectedCuisines(["All"]);setSelectedAreas(["All"]);}}>Reset</button></div><div className="filter-section-title">Area</div><div className="filter-chips">{cityAreas.map(a=><button key={a} className={`filter-chip-item ${selectedAreas.includes(a)?"active":""}`} onClick={()=>toggleArea(a)}>{a}</button>)}</div><div className="filter-divider"/><div className="filter-section-title">Cuisines</div><div className="filter-chips">{CUISINES_LIST.map(c=><button key={c} className={`filter-chip-item ${selectedCuisines.includes(c)?"active":""}`} onClick={()=>toggleCuisine(c)}>{c}</button>)}</div><div className="filter-divider"/><div className="filter-section-title">Sort by</div>{["Recommended","Highest Rated","Nearest"].map(s=><div key={s} className="filter-radio-row" onClick={()=>setSortBy(s)}><div className={`filter-radio ${sortBy===s?"active":""}`}/><span className="filter-radio-label">{s}</span></div>)}<button className="filter-apply" onClick={()=>setFilterOpen(false)}>Apply Filters</button></div></div>)}
      {addOpen&&(<div className="modal-bg" onClick={()=>setAddOpen(false)}><div className="modal-sheet add-sheet" onClick={e=>e.stopPropagation()}><div className="filter-header"><button className="filter-close" onClick={()=>setAddOpen(false)}>✕</button><div className="filter-title">Add a new place</div><div/></div><div className="add-photo-area"><span className="add-photo-icon">📷</span><div className="add-photo-label">Add photos<br/><span style={{fontSize:12,color:"#999"}}>(Up to 5 photos)</span></div></div>{[["Place name*","text","e.g. Your Place Name","name"],["Address*","text","e.g. Street, Area, City","address"],["Contact number","tel","e.g. 98765 43210","phone"]].map(([lbl,type,ph,key])=><div key={key} className="add-field"><label className="add-label">{lbl}</label><input className="ob-input" type={type} placeholder={ph} value={addForm[key]} onChange={e=>setAddForm({...addForm,[key]:e.target.value})}/></div>)}<div className="add-field"><label className="add-label">Cuisine*</label><select className="ob-input ob-select" value={addForm.cuisine} onChange={e=>setAddForm({...addForm,cuisine:e.target.value})}><option value="">Select cuisine</option>{CUISINES_LIST.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}</select></div><button className="add-location-btn">📍 Use current location</button><div className="add-field"><label className="add-label">Add a note (optional)</label><input className="ob-input" placeholder="Share more about this place" value={addForm.note} onChange={e=>setAddForm({...addForm,note:e.target.value})}/></div><button className="filter-apply" onClick={()=>setAddOpen(false)}>Submit</button></div></div>)}
    </div>
  );
}

// ─── FOOD SCREEN (unchanged) ──────────────────────────────────────────────────
// Scores a food place against the user's ranked cuisine preferences and budget.
// Cuisine match: higher-ranked preferences score more (rank 0 = top pick = most weight).
// Budget match: places within 1 price-level of the user's budget score well; farther away scores lower.
function scoreFoodPlace(place, userCuisines, userBudget) {
  let score = 0;
  if (userCuisines && userCuisines.length > 0) {
    for (let i = 0; i < userCuisines.length; i++) {
      const tag = userCuisines[i];
      const subs = CUISINE_TAG_MAP[tag] || [];
      const isMatch = subs.some(s => place.cuisine.toLowerCase().includes(s.toLowerCase()));
      if (isMatch) {
        score += (userCuisines.length - i) * 10; // top pick worths most, decays by rank
        break; // count each place once for its best-matching cuisine rank
      }
    }
  }
  const targetLevel = BUDGET_TO_LEVEL[userBudget];
  if (targetLevel != null) {
    const placeLevel = priceLevelFromString(place.price);
    const diff = Math.abs(placeLevel - targetLevel);
    score += diff === 0 ? 8 : diff === 1 ? 3 : 0;
  }
  score += place.rating; // slight tie-break toward better-rated places
  return score;
}

// Scores how good a match two people are, highest weight first:
// 1) shared saved food places (highest — proxy for "shared recommendations" until
//    events/third-place saving exist, at which point those should be added here too)
// 2) shared things-to-do
// 3) shared interests (lowest)
// Prompt-theme overlap is intentionally NOT included yet — no real user has
// ever been able to answer a prompt anywhere in the app, so there's nothing to match on.
function scoreConnection(me, other) {
  const sharedFood = (me.saved_food_places || []).filter(f => (other.saved_food_places || []).includes(f));
  const sharedThings = (me.things || []).filter(t => (other.things || []).includes(t));
  const sharedInterests = (me.interests || []).filter(i => (other.interests || []).includes(i));
  const score = sharedFood.length * 30 + sharedThings.length * 12 + sharedInterests.length * 5;
  return { score, sharedFood, sharedThings, sharedInterests };
}

// Maps "Browse by category" pills to substrings matched against a place's cuisine field
const CATEGORY_TAG_MAP = {
  Cafes: ["café","cafe","coffee","tea house"],
  Nightlife: ["rooftop","bar"],
  Desserts: ["bakery","ice cream","dessert","pâtisserie","mithai"],
  Buffet: ["thali","buffet"],
  // "Restaurants" has no map — it's the catch-all for anything not matched above
};
// Maps "Explore cuisines" circles to substrings matched against a place's cuisine field
const CIRCLE_TAG_MAP = {
  Indian: ["indian","punjabi","maharashtrian","parsi","gujarati","rajasthani","north indian","south indian","tandoor","thali","seafood","mangalorean","goan","manipuri","street food","mithai"],
  Italian: ["italian","pizza","continental"],
  Chinese: ["chinese"],
  Mexican: ["mexican"],
  Japanese: ["japanese","sushi","sizzler"],
};
function matchesCategory(place, category) {
  const subs = CATEGORY_TAG_MAP[category];
  if (!subs) return !Object.values(CATEGORY_TAG_MAP).flat().some(s => place.cuisine.toLowerCase().includes(s)); // Restaurants = catch-all
  return subs.some(s => place.cuisine.toLowerCase().includes(s));
}
function matchesCircle(place, circle) {
  const subs = CIRCLE_TAG_MAP[circle] || [];
  return subs.some(s => place.cuisine.toLowerCase().includes(s));
}

function FoodScreen({ city, onOpenMap, onOpenDetail, userCuisines, userBudget }) {
  const [likes, setLikes] = useState({});
  const [activeCat, setActiveCat] = useState(null);
  const [activeCircle, setActiveCircle] = useState(null);
  const [activeArea, setActiveArea] = useState("All");
  const [justRefreshed, setJustRefreshed] = useState(false);
  const cd = CITIES[city];
  const CATS = [{name:"Restaurants",icon:"🍴"},{name:"Cafes",icon:"☕"},{name:"Nightlife",icon:"🍸"},{name:"Buffet",icon:"🥘"},{name:"Desserts",icon:"🍰"}];
  const CUISINE_CIRCLES = [{name:"Indian",img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&q=80"},{name:"Italian",img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80"},{name:"Chinese",img:"https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=200&q=80"},{name:"Mexican",img:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&q=80"},{name:"Japanese",img:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&q=80"}];
  const cityAreas = ["All", ...Array.from(new Set(cd.food.map(r=>r.hood)))];
  let filteredFood = activeArea==="All" ? cd.food : cd.food.filter(r=>r.hood===activeArea);
  if (activeCat) filteredFood = filteredFood.filter(r=>matchesCategory(r, activeCat));
  if (activeCircle) filteredFood = filteredFood.filter(r=>matchesCircle(r, activeCircle));
  const hasPrefs = userCuisines && userCuisines.length > 0;
  // Recomputed fresh on every render — always reflects the latest cuisine ranking/budget from the profile.
  const recommendedFood = hasPrefs
    ? [...filteredFood].sort((a,b)=>scoreFoodPlace(b,userCuisines,userBudget) - scoreFoodPlace(a,userCuisines,userBudget))
    : filteredFood;
  const activeFilterLabel = [activeCat, activeCircle].filter(Boolean).join(" + ");
  const handleRefresh = () => { setJustRefreshed(true); setTimeout(()=>setJustRefreshed(false), 1500); };
  return (
    <div className="screen-body">
      <div className="section-hdr">
        <div>
          <div className="sec-title">Recommendations for you</div>
          <div className="sec-sub">{justRefreshed ? "✓ Updated to match your latest preferences" : hasPrefs ? "Matched to your cuisine picks & budget" : "Based on your taste and favorites"}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="refresh-circ-btn" onClick={handleRefresh} title="Refresh recommendations">↻</button>
          <button className="arrow-circ-btn" onClick={onOpenMap}>→</button>
        </div>
      </div>
      <div className="area-filter-row">
        {cityAreas.map(a=><button key={a} className={`area-filter-chip ${activeArea===a?"active":""}`} onClick={()=>setActiveArea(a)}>{a}</button>)}
      </div>
      <div className="food-hscroll">
        {recommendedFood.map(r=>(
          <div key={r.id} className="food-card" onClick={()=>onOpenDetail(r)}>
            <div className="food-card-img-wrap"><img src={r.img} alt={r.name} className="food-card-img"/><button className="heart-btn" onClick={e=>{e.stopPropagation();setLikes(p=>({...p,[r.id]:!p[r.id]}))}}>{likes[r.id]?"❤️":"🤍"}</button><span className="food-tag-pill">{r.tag}</span></div>
            <div className="food-card-body"><div className="food-name">{r.name}</div><div className="food-card-hood">📍 {r.hood}</div><div className="food-price">{r.price}</div><div className="food-rating">⭐ {r.rating}</div></div>
          </div>
        ))}
        {recommendedFood.length===0 && <div className="food-empty-state">No {activeFilterLabel ? `${activeFilterLabel} ` : ""}places found{activeArea!=="All" ? ` in ${activeArea}` : ""} yet.</div>}
      </div>
      <div className="section-hdr" style={{marginTop:8}}><div className="sec-title">Browse by category</div></div>
      <div className="sec-sub" style={{marginBottom:14}}>Find the perfect spot for any craving</div>
      <div className="cat-row">{CATS.map(c=><button key={c.name} className={`cat-circle-btn ${activeCat===c.name?"active":""}`} onClick={()=>setActiveCat(activeCat===c.name?null:c.name)}><div className="cat-circle-icon">{c.icon}</div><div className="cat-circle-label">{c.name}</div></button>)}</div>
      <div className="section-hdr" style={{marginTop:24}}><div><div className="sec-title">Explore cuisines</div><div className="sec-sub">Discover flavors from around the world</div></div></div>
      <div className="cuisine-circles-row">{CUISINE_CIRCLES.map(c=><button key={c.name} className={`cuisine-circle ${activeCircle===c.name?"active":""}`} onClick={()=>setActiveCircle(activeCircle===c.name?null:c.name)}><img src={c.img} alt={c.name} className="cuisine-circle-img"/><div className="cuisine-circle-name">{c.name}</div></button>)}</div>
      <div className="section-hdr" style={{marginTop:24}}><div><div className="sec-title">Top offers near you</div><div className="sec-sub">Great food at great prices</div></div><button className="arrow-circ-btn">→</button></div>
      <div className="offers-row">{cd.food.slice(0,3).map((r,i)=><div key={r.id} className="offer-card" onClick={()=>onOpenDetail(r)}><img src={r.img} alt={r.name} className="offer-img"/><button className="heart-btn offer-heart" onClick={e=>{e.stopPropagation();setLikes(p=>({...p,[`o${r.id}`]:!p[`o${r.id}`]}))}}>{likes[`o${r.id}`]?"❤️":"🤍"}</button><span className="discount-pill">{["20% OFF","15% OFF","25% OFF"][i]}</span></div>)}</div>
    </div>
  );
}

// ─── EVENTS MAP SCREEN (new) ──────────────────────────────────────────────────
function EventDetail({ event, onBack }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="evd-root">
      <div className="evd-header"><button className="evd-back" onClick={onBack}>←</button><button className="evd-share">↗ Share</button></div>
      <div className="evd-hero"><img src={event.img} alt={event.name} className="evd-hero-img"/></div>
      <div className="evd-body">
        <div className="evd-cats">{event.cats.map(c=><span key={c} className="evd-cat-pill">{c}</span>)}</div>
        <h1 className="evd-title">{event.name}</h1>
        <p className="evd-desc">{event.desc}</p>
        <div className="evd-details">
          <div className="evd-row"><span className="evd-row-icon">📅</span><div><div className="evd-row-label">Date</div><div className="evd-row-val">{event.fullDate}</div></div><div className="evd-row-right"><div className="evd-row-label">Day</div><div className="evd-row-val">{["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date(event.fullDate).getDay()]}</div></div></div>
          <div className="evd-row"><span className="evd-row-icon">🕐</span><div><div className="evd-row-label">Time</div><div className="evd-row-val">{event.time}</div></div></div>
          <div className="evd-row"><span className="evd-row-icon">📍</span><div><div className="evd-row-label">Location</div><div className="evd-row-val">{event.loc}</div></div></div>
          <div className="evd-row"><span className="evd-row-icon">🎟️</span><div><div className="evd-row-label">Entry</div><div className="evd-row-val" style={{color:event.entry==="Free Entry"?"var(--green2)":"#e74c3c",fontWeight:700}}>{event.entry}</div></div></div>
        </div>
        <div className="evd-organizer">
          <div className="evd-org-avatar">🏛️</div>
          <div><div className="evd-org-name">{event.organizer}</div><div className="evd-org-sub">Community · {event.loc.split(",").slice(-1)[0].trim()}</div><div className="evd-org-tagline">Bringing people together through live experiences.</div></div>
          <button className="evd-view-profile">View Profile</button>
        </div>
        <div className="evd-interested"><div className="event-avatars" style={{marginRight:8}}><div className="ea"/><div className="ea"/><div className="ea"/></div><span>{event.interested>=1000?(event.interested/1000).toFixed(1)+"K":event.interested} interested</span></div>
        <button className="evd-rsvp-btn" onClick={()=>setSaved(s=>!s)}>{saved?"✓ Saved":"I'm Interested"}</button>
      </div>
    </div>
  );
}

function EventsMapScreen({ city }) {
  const [openEvent, setOpenEvent] = useState(null);
  const [showMap, setShowMap] = useState(false); // false = list (default)
  const [activeCat, setActiveCat] = useState("All");
  const [freeOnly, setFreeOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState({});
  const events = CITIES[city].events;
  const filtered = events.filter(e=>{
    if (activeCat!=="All" && !e.cats.includes(activeCat)) return false;
    if (freeOnly && e.entry!=="Free Entry") return false;
    return true;
  });

  if (openEvent) return <EventDetail event={openEvent} onBack={()=>setOpenEvent(null)}/>;

  return (
    <div className="emap-root">
      {/* Top bar — always visible */}
      <div className="emap-topbar">
        <div className="emap-topbar-left">
          <div className="emap-cats-inline">
            {CAT_FILTERS.slice(0,6).map(c=><button key={c} className={`emap-cat ${activeCat===c?"active":""}`} onClick={()=>setActiveCat(c)}>{c==="All"&&<span style={{marginRight:4}}>⊞</span>}{c}</button>)}
          </div>
        </div>
        <div className="emap-topbar-right">
          <button className={`emap-view-toggle ${showMap?"active":""}`} onClick={()=>setShowMap(v=>!v)}>
            {showMap ? "☰ List" : "🗺 Map"}
          </button>
          <button className="emap-create-btn">+ Create an Event</button>
        </div>
      </div>

      {/* Sub-filters — always visible */}
      <div className="emap-subfilters">
        <button className="emap-subfilter-btn">⚙ Filter</button>
        <select className="emap-subfilter-btn" style={{paddingLeft:8}}><option>This Week</option><option>This Weekend</option><option>This Month</option></select>
        <label className="emap-toggle-label"><div className={`emap-toggle ${freeOnly?"on":""}`} onClick={()=>setFreeOnly(f=>!f)}><div className="emap-toggle-thumb"/></div><span style={{color:"var(--green2)"}}>Free Event</span></label>
        <label className="emap-toggle-label"><div className="emap-toggle"><div className="emap-toggle-thumb"/></div><span style={{color:"#e74c3c"}}>Paid Event</span></label>
      </div>

      {/* LIST VIEW (default) */}
      {!showMap && (
        <div className="screen-body" style={{paddingTop:0}}>
          <div className="section-hdr"><div><div className="sec-title">Events near you</div><div className="sec-sub">Happening this week in {city==="nyc"?"New York":"Mumbai"}</div></div><button className="see-all-link">See all ›</button></div>
          <div className="events-list">
            {filtered.map(e=>(
              <div key={e.id} className="event-list-item" style={{cursor:"pointer"}} onClick={()=>setOpenEvent(e)}>
                <div className="event-list-img-wrap">
                  <img src={e.img} alt={e.name} className="event-list-img"/>
                  <div className="event-date-chip"><div className="event-date-num">{e.date}</div><div className="event-date-mon">{e.mon}</div></div>
                </div>
                <div className="event-list-body">
                  <div className="event-list-name">{e.name}</div>
                  <div className="event-list-cats">{e.cats.map((c,i)=><span key={c}>{i>0&&" • "}<span style={{color:"var(--green2)"}}>{c}</span></span>)}</div>
                  <div className="event-list-meta">📅 {e.fullDate}</div>
                  <div className="event-list-meta">🕐 {e.time}</div>
                  <div className="event-list-meta">📍 {e.loc}</div>
                  <div className="event-list-interested">
                    <div className="event-avatars"><div className="ea"/><div className="ea"/><div className="ea"/></div>
                    <span className="event-interested-count">{e.interested>=1000?(e.interested/1000).toFixed(1)+"K":e.interested} interested</span>
                    <span className={`event-entry-badge ${e.entry==="Free Entry"?"free":"paid"}`}>{e.entry}</span>
                  </div>
                </div>
                <button className="event-bookmark" onClick={ev=>{ev.stopPropagation();setBookmarks(b=>({...b,[e.id]:!b[e.id]}));}}>🔖</button>
              </div>
            ))}
          </div>
          <div className="create-event-cta">
            <div className="create-event-icon">📅</div>
            <div><div className="create-event-title">Create an event</div><div className="create-event-sub">Host your own event and invite people to join.</div></div>
            <button className="create-event-btn">Create Event</button>
          </div>
        </div>
      )}

      {/* MAP VIEW (toggled) */}
      {showMap && (
        <div className="emap-canvas" style={{position:"relative",height:520}}>
          <img
            src={city==="mumbai" ? "https://images.unsplash.com/photo-1562979314-bee7453e911c?w=1400&q=80" : "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1400&q=80"}
            alt="city map"
            style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",display:"block",filter:"saturate(0.7) brightness(1.05)"}}
          />
                    <div className="emap-map-overlay" style={{pointerEvents:"none"}}/>
          {city==="mumbai"&&<>
            <div className="emap-area-label" style={{top:"14%",left:"30%"}}>ANDHERI WEST</div>
            <div className="emap-area-label" style={{top:"47%",left:"10%"}}>JUHU</div>
            <div className="emap-area-label" style={{top:"58%",left:"14%"}}>BANDRA WEST</div>
            <div className="emap-area-label" style={{top:"72%",left:"42%"}}>WORLI</div>
          </>}
          <div className="emap-user-dot" style={{top:"44%",left:"46%",position:"absolute"}}/>
          {filtered.map(e=>(
            <button key={e.id} className={`emap-pin ${e.entry==="Free Entry"?"free":"paid"}`}
              style={{top:e.mapTop,left:e.mapLeft,position:"absolute"}} onClick={()=>setOpenEvent(e)}>
              <div className="emap-pin-body">
                <div className="emap-pin-name">{e.name}</div>
                <div className="emap-pin-meta">{e.fullDate} · {e.time.split("–")[0].trim()}</div>
                <div className="emap-pin-loc">📍 {e.loc.split(",")[0]}</div>
                <div className={`emap-pin-badge ${e.entry==="Free Entry"?"free":"paid"}`}>{e.entry}</div>
              </div>
            </button>
          ))}
          <div className="emap-zoom" style={{position:"absolute",bottom:16,right:16}}>
            <button className="emap-zoom-btn">+</button>
            <button className="emap-zoom-btn">−</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DISCOVERY — Events & Third Places subtabs (unchanged) ───────────────────
function DiscoveryEventsTab({ city }) {
  const [interestsSelected, setInterestsSelected] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [bookmarks, setBookmarks] = useState({});
  const cd = CITIES[city];
  const EVENT_INTERESTS = [{name:"Music",icon:"🎵"},{name:"Art & Culture",icon:"🎨"},{name:"Workshops",icon:"✏️"},{name:"Sports",icon:"⚽"},{name:"Festivals",icon:"🎉"},{name:"Nightlife",icon:"🍸"},{name:"Health & Wellness",icon:"🌿"},{name:"Tech",icon:"💻"},{name:"Networking",icon:"👥"}];
  if (interestsSelected===null) return (
    <div className="events-interests-screen">
      <div className="events-interests-title">What interests you?</div>
      <div className="events-interests-sub">Select categories you enjoy. We'll show you events you'll love.</div>
      <div className="interests-grid">
        {EVENT_INTERESTS.map(i=>(
          <button key={i.name} className={`interest-grid-item ${selectedInterests.includes(i.name)?"active":""}`} onClick={()=>setSelectedInterests(prev=>prev.includes(i.name)?prev.filter(x=>x!==i.name):[...prev,i.name])}>
            <span className="interest-grid-icon">{i.icon}</span><span className="interest-grid-name">{i.name}</span><div className={`interest-grid-radio ${selectedInterests.includes(i.name)?"active":""}`}/>
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
            <div className="event-list-img-wrap"><img src={e.img} alt={e.name} className="event-list-img"/><div className="event-date-chip"><div className="event-date-num">{e.date}</div><div className="event-date-mon">{e.mon}</div></div></div>
            <div className="event-list-body">
              <div className="event-list-name">{e.name}</div>
              <div className="event-list-cats">{e.cats.map((c,i)=><span key={c}>{i>0&&" • "}<span style={{color:"var(--green2)"}}>{c}</span></span>)}</div>
              <div className="event-list-meta">📅 {e.fullDate}</div>
              <div className="event-list-meta">🕐 {e.time}</div>
              <div className="event-list-meta">📍 {e.loc}</div>
              <div className="event-list-interested"><div className="event-avatars"><div className="ea"/><div className="ea"/><div className="ea"/></div><span className="event-interested-count">{e.interested>=1000?(e.interested/1000).toFixed(1)+"K":e.interested} interested</span></div>
            </div>
            <button className="event-bookmark" onClick={()=>setBookmarks(b=>({...b,[e.id]:!b[e.id]}))}>🔖</button>
          </div>
        ))}
      </div>
      <div className="create-event-cta"><div className="create-event-icon">📅</div><div><div className="create-event-title">Create an event</div><div className="create-event-sub">Host your own event and invite people to join the experience.</div></div><button className="create-event-btn">Create Event</button></div>
    </div>
  );
}

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
      <div className="tp-header-row"><div><div className="sec-title" style={{fontSize:22}}>Nearby third places</div><div className="sec-sub">Relax, connect & recharge</div></div><button className="tp-filter-btn">⚙ Filter</button></div>
      <div className="filter-scroll-row">{THIRD_CATS.map(c=><button key={c} className={`filter-pill ${activeCat===c?"active":""}`} onClick={()=>setActiveCat(c)}>{c==="All"&&<span style={{marginRight:4}}>⊞</span>}{c}</button>)}</div>
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
            <button className="event-bookmark" onClick={()=>setBookmarks(b=>({...b,[p.id]:!b[p.id]}))}>🔖</button>
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
          <div className="add-tp-step"><span className="add-tp-step-icon">✏️</span><span>Tell us about the place</span></div>
        </div>
      </div>
      {addOpen&&(<div className="modal-bg" onClick={()=>setAddOpen(false)}><div className="modal-sheet add-sheet" onClick={e=>e.stopPropagation()}><div className="filter-header"><button className="filter-close" onClick={()=>setAddOpen(false)}>✕</button><div className="filter-title">Add a new place</div><div/></div><div className="add-photo-area"><span className="add-photo-icon">📷</span><div className="add-photo-label">Add photos<br/><span style={{fontSize:12,color:"#999"}}>(Up to 5 photos)</span></div></div>{[["Place name*","text","e.g. Your Place Name","name"],["Address*","text","e.g. Street, Area, City","address"],["Contact number","tel","e.g. 98765 43210","phone"]].map(([lbl,type,ph,key])=><div key={key} className="add-field"><label className="add-label">{lbl}</label><input className="ob-input" type={type} placeholder={ph} value={addForm[key]} onChange={e=>setAddForm({...addForm,[key]:e.target.value})}/></div>)}<button className="add-location-btn">📍 Use current location</button><div className="add-field"><label className="add-label">Add a note (optional)</label><input className="ob-input" placeholder="Share more about this place" value={addForm.note} onChange={e=>setAddForm({...addForm,note:e.target.value})}/></div><button className="filter-apply" onClick={()=>setAddOpen(false)}>Submit</button></div></div>)}
    </div>
  );
}

// ─── DISCOVERY SCREEN (unchanged structure) ───────────────────────────────────
function DiscoveryScreen({ city, userCuisines, userBudget, userId, userName, savedPlaces, onToggleSave }) {
  const [subTab, setSubTab] = useState("food");
  const [mapOpen, setMapOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(null);
  if (mapOpen) return <MapView city={city} onBack={()=>setMapOpen(false)} onSelectPlace={r=>{setMapOpen(false);setDetailOpen(r);}}/>;
  if (detailOpen) return <FoodDetail restaurant={detailOpen} onBack={()=>setDetailOpen(null)} userId={userId} userName={userName} isSaved={(savedPlaces||[]).includes(detailOpen.name)} onToggleSave={onToggleSave}/>;
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
              <span className="sub-tab-icon">{icon}</span><span className="sub-tab-label">{lbl}</span>
            </button>
          ))}
        </div>
      </div>
      {subTab==="food"   && <FoodScreen city={city} onOpenMap={()=>setMapOpen(true)} onOpenDetail={setDetailOpen} userCuisines={userCuisines} userBudget={userBudget}/>}
      {subTab==="events" && <DiscoveryEventsTab city={city}/>}
      {subTab==="places" && <ThirdPlacesScreen city={city}/>}
    </div>
  );
}

// ─── CONNECTION — updated with yellow shared highlights + food/city recs ──────
function ChatView({ connectionId, person, userId, onBack }) {
  const [chatInput, setChatInput] = useState("");
  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatLoading, setChatLoading] = useState(true);
  const [chatError, setChatError] = useState("");

  useEffect(() => {
    let active = true;
    setChatLoading(true);
    getMessages(connectionId)
      .then(msgs => { if (active) setChatMsgs(msgs || []); })
      .catch(e => { console.error("Failed to load messages:", e); if (active) setChatError("Couldn't load this conversation."); })
      .finally(() => { if (active) setChatLoading(false); });
    return () => { active = false; };
  }, [connectionId]);

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setChatInput("");
    setChatError("");
    try {
      const msg = await sendMessage(connectionId, userId, text);
      setChatMsgs(prev => [...prev, msg]);
    } catch (e) {
      console.error("Send failed:", e);
      setChatError("Couldn't send that — please try again.");
    }
  };

  return (
    <div className="chat-root">
      <div className="chat-header"><button className="chat-back" onClick={onBack}>←</button><div className="chat-avatar">{(person.name||"?").slice(0,2).toUpperCase()}</div><div><div className="chat-uname">{person.name}</div><div className="chat-ustatus">● Connected</div></div></div>
      <div className="chat-msgs">
        {chatLoading && <div className="chat-empty"><p>Loading conversation…</p></div>}
        {!chatLoading && chatMsgs.length===0 && <div className="chat-empty"><div style={{fontSize:28}}>✦</div><p>Connected with {person.name}. Say hello.</p></div>}
        {!chatLoading && chatMsgs.map((m,i)=><div key={m.id||i} className={`chat-bubble ${m.sender_id===userId?"me":""}`}>{m.text}</div>)}
      </div>
      {chatError && <div className="profile-save-error" style={{margin:"0 16px"}}>⚠️ {chatError}</div>}
      <div className="chat-input-row"><input className="chat-input" value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChatMessage()} placeholder="Say something..."/><button className="chat-send" onClick={sendChatMessage}>Send</button></div>
    </div>
  );
}

function MessagesPanel({ userId, onClose }) {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [openChat, setOpenChat] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");
    getConnections(userId)
      .then(data => { if (active) setConnections(data || []); })
      .catch(e => { console.error("Failed to load connections:", e); if (active) setLoadError("Couldn't load your messages right now."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [userId]);

  if (openChat) {
    return (
      <div className="msgs-overlay">
        <div className="msgs-overlay-bg" onClick={onClose}/>
        <div className="msgs-panel msgs-panel-chat">
          <ChatView connectionId={openChat.id} person={openChat.otherPerson} userId={userId} onBack={()=>setOpenChat(null)}/>
        </div>
      </div>
    );
  }

  const visibleConnections = connections.filter(c => {
    const otherPerson = c.user1_id === userId ? c.user2 : c.user1;
    return otherPerson && otherPerson.id !== userId; // defensive: never show a "conversation" with yourself
  });

  return (
    <div className="msgs-overlay">
      <div className="msgs-overlay-bg" onClick={onClose}/>
      <div className="msgs-panel">
        <div className="msgs-panel-header"><div className="msgs-panel-title">Messages</div><button className="msgs-panel-close" onClick={onClose}>×</button></div>
        <div className="msgs-list">
          {loading && <div className="conn-empty" style={{padding:"40px 16px"}}><p>Loading messages…</p></div>}
          {!loading && loadError && <div className="conn-empty" style={{padding:"40px 16px"}}><p>{loadError}</p></div>}
          {!loading && !loadError && visibleConnections.length===0 && (
            <div className="conn-empty" style={{padding:"40px 16px"}}>
              <div style={{fontSize:36}}>💬</div>
              <div className="conn-empty-title">No conversations yet</div>
              <p style={{color:"var(--text3)",fontSize:13,marginTop:6}}>Message someone from the Connection tab to start chatting.</p>
            </div>
          )}
          {!loading && visibleConnections.map(c => {
            const otherPerson = c.user1_id === userId ? c.user2 : c.user1;
            const initials = (otherPerson.name||"?").slice(0,2).toUpperCase();
            const photo = (otherPerson.photo_urls||[]).filter(Boolean)[0];
            return (
              <button key={c.id} className="msgs-list-row" onClick={()=>setOpenChat({ id: c.id, otherPerson })}>
                {photo ? <img src={photo} alt="" className="msgs-list-avatar-img"/> : <div className="msgs-list-avatar">{initials}</div>}
                <div className="msgs-list-info"><div className="msgs-list-name">{otherPerson.name}{otherPerson.age ? `, ${otherPerson.age}` : ""}</div><div className="msgs-list-sub">Tap to open conversation</div></div>
                <span className="msgs-list-chevron">›</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ConnectionScreen({ city, userId, me }) {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [idx, setIdx] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [openProfile, setOpenProfile] = useState(null);
  const [chatOpen, setChatOpen] = useState(null);
  const [connectError, setConnectError] = useState("");
  const [connecting, setConnecting] = useState(false);
  const cd = CITIES[city];

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    let active = true;
    setLoading(true);
    setLoadError("");
    getPeople(city, userId)
      .then(data => {
        if (!active) return;
        const ranked = (data || [])
          .map(p => ({ ...p, _match: scoreConnection(me, p) }))
          .sort((a,b) => b._match.score - a._match.score);
        setPeople(ranked);
      })
      .catch(e => { console.error("Failed to load people:", e); if (active) setLoadError("Couldn't load people right now."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [city, userId]);

  const current = people[idx];

  const passProfileAndNext = async () => {
    if (!current) return;
    setIdx(i => i+1); setPhotoIdx(0);
    try { await passProfile(userId, current.id); } catch (e) { console.error("Pass failed:", e); }
  };

  const openChat = async (person) => {
    setConnectError(""); setConnecting(true);
    try {
      const conn = await getOrCreateConnection(userId, person.id);
      setChatOpen({ person, connectionId: conn.id });
    } catch (e) {
      console.error("Failed to open chat:", e);
      setConnectError("Couldn't start that conversation — please try again.");
    } finally {
      setConnecting(false);
    }
  };

  if (!userId) {
    return (
      <div className="conn-root">
        <div className="conn-empty">
          <div style={{fontSize:42}}>👋</div>
          <div className="conn-empty-title">Sign in to connect with people</div>
          <p style={{color:"var(--text3)",fontSize:13,marginTop:6}}>Connections are matched between real registered NearMet users, so this needs a real account.</p>
        </div>
      </div>
    );
  }

  // Chat screen
  if (chatOpen) {
    return <ChatView connectionId={chatOpen.connectionId} person={chatOpen.person} userId={userId} onBack={()=>setChatOpen(null)}/>;
  }

  // Full profile view
  if (openProfile) {
    const p = openProfile;
    const sharedFood = (me.saved_food_places||[]).filter(f=>(p.saved_food_places||[]).includes(f));
    const sharedThings = (me.things||[]).filter(t=>(p.things||[]).includes(t));
    const sharedInterests = (me.interests||[]).filter(i=>(p.interests||[]).includes(i));
    const recommendedPlaces = (p.saved_food_places||[]).map(name=>cd.food.find(f=>f.name===name)).filter(Boolean);
    return (
      <div className="pv-root">
        <div className="pv-header"><button className="pv-back" onClick={()=>setOpenProfile(null)}>←</button></div>
        <div className="pv-photos-strip">
          <div className="pv-photos">{(p.photo_urls&&p.photo_urls.length>0) ? p.photo_urls.filter(Boolean).map((ph,i)=><img key={i} src={ph} alt="" className="pv-photo"/>) : <div className="pv-photo pv-photo-placeholder">{(p.name||"?").slice(0,2).toUpperCase()}</div>}</div>
        </div>
        <div className="pv-name">{p.name}{p.age ? `, ${p.age}` : ""}</div>
        <div className="pv-city">📍 {cd.label}</div>

        <div className="pv-section-title">Interests</div>
        <div className="pv-interest-chips">
          {(p.interests||[]).length===0 && <span style={{fontSize:13,color:"var(--text3)"}}>No interests added yet.</span>}
          {(p.interests||[]).map(i=>{ const opt=INTEREST_OPTIONS.find(o=>o.id===i); return <span key={i} className={`pv-interest-chip ${sharedInterests.includes(i)?"shared":""}`}>{opt?.icon} {opt?.label||i}</span>; })}
        </div>

        <div className="pv-section-title">Things I want to do</div>
        <div className="pv-things-list">
          {(p.things||[]).length===0 && <span style={{fontSize:13,color:"var(--text3)"}}>No selections yet.</span>}
          {(p.things||[]).map(t=><div key={t} className={`pv-thing-row ${sharedThings.includes(t)?"shared":""}`}><span className="pv-thing-icon">📌</span><span>{t}</span></div>)}
        </div>

        <div className="pv-section-title">Food places recommendation <span className="pv-rec-count">{recommendedPlaces.length} saved</span></div>
        {recommendedPlaces.length===0 && <p style={{fontSize:13,color:"var(--text3)",marginBottom:12}}>Hasn't saved any food places yet.</p>}
        {recommendedPlaces.map(r=>(
          <div key={r.id} className={`pv-rec-item ${sharedFood.includes(r.name)?"shared":""}`}><img src={r.img} alt={r.name} className="pv-rec-img"/><div><div className="pv-rec-name">{r.name}</div><div className="pv-rec-desc">{r.cuisine} · {r.hood}</div></div></div>
        ))}

        {connectError && <div className="profile-save-error">⚠️ {connectError}</div>}
        <button className="pv-chat-btn" disabled={connecting} onClick={()=>openChat(p)}>{connecting ? "Connecting…" : `Message ${p.name} →`}</button>
      </div>
    );
  }

  // Main feed
  return (
    <div className="conn-root">
      {loading && <div className="conn-empty"><p>Finding people near you…</p></div>}
      {!loading && loadError && <div className="conn-empty"><p>{loadError}</p></div>}
      {!loading && !loadError && current ? (
        <div className="conn-layout">
          <div className="conn-card">
            <div className="conn-img-wrap">
              {(current.photo_urls&&current.photo_urls.filter(Boolean).length>0) ? (
                <img src={current.photo_urls.filter(Boolean)[photoIdx]||current.photo_urls.filter(Boolean)[0]} alt={current.name} className="conn-img"/>
              ) : (
                <div className="conn-img conn-img-placeholder">{(current.name||"?").slice(0,2).toUpperCase()}</div>
              )}
              <div className="conn-info"><div className="conn-name">{current.name}{current.age ? `, ${current.age}` : ""}</div><div className="conn-city">{cd.label}</div></div>
            </div>
            <button className="conn-view-profile" onClick={()=>setOpenProfile(current)}>Tap to view the profile</button>
          </div>
          <div className="conn-prompts">
            {current._match.sharedFood.length>0 && (
              <div className="conn-shared-banner"><span style={{fontSize:16}}>🍽️</span><span>You both love <strong>{current._match.sharedFood.slice(0,2).join(", ")}</strong></span></div>
            )}
            {current._match.sharedInterests.length>0 && (
              <div className="conn-shared-banner"><span style={{fontSize:16}}>✨</span><span>You both like <strong>{current._match.sharedInterests.map(i=>INTEREST_OPTIONS.find(o=>o.id===i)?.label||i).join(", ")}</strong></span></div>
            )}
            {current._match.sharedThings.length>0 && (
              <div className="conn-shared-things">
                <div className="conn-shared-things-label">Also wants to</div>
                {current._match.sharedThings.map(t=><div key={t} className="conn-shared-thing-row">✦ {t}</div>)}
              </div>
            )}
            {current._match.score===0 && <p style={{fontSize:13,color:"var(--text3)"}}>No overlap yet — but everyone starts somewhere.</p>}
            {connectError && <div className="profile-save-error">⚠️ {connectError}</div>}
            <button className="conn-chat-btn" disabled={connecting} onClick={()=>openChat(current)}>{connecting ? "Connecting…" : `Message ${current.name} →`}</button>
            <button className="conn-pass-btn" onClick={passProfileAndNext}>Pass ›</button>
          </div>
        </div>
      ) : (!loading && !loadError && <div className="conn-empty"><div style={{fontSize:42}}>🎉</div><div className="conn-empty-title">You're all caught up!</div><p style={{color:"var(--text3)",fontSize:13,marginTop:6}}>No more registered people to show in {cd.label} right now.</p></div>)}
    </div>
  );
}

// ─── PROFILE SCREEN — updated with food/city recs ────────────────────────────
function EditableField({ label, value, onSave, type="text", icon }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  useEffect(()=>{ setDraft(value); }, [value]);
  const commit = () => {
    setEditing(false);
    if (draft !== value && draft !== "" && draft != null) onSave(draft);
    else setDraft(value);
  };
  return (
    <div className="profile-field">
      <label>{label}</label>
      {editing ? (
        <input
          className="profile-field-input"
          type={type}
          value={draft}
          autoFocus
          onChange={e=>setDraft(type==="number" ? e.target.value : e.target.value)}
          onBlur={commit}
          onKeyDown={e=>{ if(e.key==="Enter") commit(); if(e.key==="Escape"){ setDraft(value); setEditing(false); } }}
        />
      ) : (
        <div className="profile-field-val profile-field-editable" onClick={()=>setEditing(true)}>{value || "—"} {icon} <span className="profile-field-edit-hint">✏️</span></div>
      )}
    </div>
  );
}

function ProfileScreen({ user, userId, onSignOut, onUpdateProfile }) {
  const cd = CITIES[user.city];
  const p = cd.people[0]; // sample person — still used for Food/In-City recs sections below (not yet wired to real user data)
  const [cuisines, setCuisines] = useState(user.cuisines || []);
  const [budget, setBudget] = useState(user.budget || "flexible");
  const [things, setThings] = useState(user.things || []);
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [photos, setPhotos] = useState(user.photo_urls || []);
  const [uploadingSlot, setUploadingSlot] = useState(null);
  useEffect(()=>{ setCuisines(user.cuisines || []); setBudget(user.budget || "flexible"); }, [user.cuisines, user.budget]);
  useEffect(()=>{ setPhotos(user.photo_urls || []); }, [user.photo_urls]);
  useEffect(()=>{ setThings(user.things || []); }, [user.things]);

  const save = async (updates, revert) => {
    setSaveError("");
    try {
      if (onUpdateProfile) await onUpdateProfile(updates);
    } catch (e) {
      console.error("Profile save failed:", e);
      setSaveError("Couldn't save that change — please try again.");
      if (revert) revert();
    }
  };
  const addThing = (t) => { const prev = things; const next = [...things, t]; setThings(next); save({ city_wants: next }, ()=>setThings(prev)); };
  const removeThing = (t) => { const prev = things; const next = things.filter(x=>x!==t); setThings(next); save({ city_wants: next }, ()=>setThings(prev)); };
  const handlePhotoSelect = async (slot, file) => {
    if (!file) return;
    setSaveError("");
    setUploadingSlot(slot);
    try {
      let url;
      if (userId) {
        url = await uploadProfilePhoto(userId, file, slot);
      } else {
        url = URL.createObjectURL(file); // local demo mode: preview-only, not persisted
      }
      const next = [...photos]; next[slot] = url; setPhotos(next);
      await save({ photo_urls: next });
    } catch (e) {
      console.error("Photo upload failed:", e);
      setSaveError("Couldn't upload that photo — please try again.");
    } finally {
      setUploadingSlot(null);
    }
  };
  const removePhoto = async (slot) => {
    const prev = photos; const next = [...photos]; next[slot] = null;
    setPhotos(next); await save({ photo_urls: next.filter(Boolean) }, ()=>setPhotos(prev));
  };
  const moveCuisine = (id, dir) => {
    const prev = cuisines;
    const idx = prev.indexOf(id); const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= prev.length) return;
    const next = [...prev]; [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    setCuisines(next);
    save({ cuisines: next }, ()=>setCuisines(prev));
  };
  const removeCuisine = id => {
    const prev = cuisines; const next = cuisines.filter(c=>c!==id);
    setCuisines(next); save({ cuisines: next }, ()=>setCuisines(prev));
  };
  const addCuisine = id => {
    const prev = cuisines; const next = [...cuisines, id];
    setCuisines(next); save({ cuisines: next }, ()=>setCuisines(prev));
  };

  return (
    <div className="profile-root">
      <div className="profile-header-row"><div className="profile-title">Complete your profile</div><div className="profile-progress"><svg width="44" height="44"><circle cx="22" cy="22" r="18" fill="none" stroke="#e0e0e0" strokeWidth="3"/><circle cx="22" cy="22" r="18" fill="none" stroke="#2d6a2d" strokeWidth="3" strokeDasharray="113" strokeDashoffset="28" strokeLinecap="round" transform="rotate(-90 22 22)"/><text x="22" y="26" textAnchor="middle" fontSize="10" fontWeight="700" fill="#2d6a2d">75%</text></svg></div></div>
      <div className="profile-header-sub">Add a few details to help others know the real you.</div>
      {saveError && <div className="profile-save-error">⚠️ {saveError}</div>}

      {/* 1 Basic info */}
      <div className="profile-section">
        <div className="profile-sec-num">1</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Basic info <span className="profile-sec-note">This will be visible on your profile. Tap any field to edit.</span></div>
          <div className="profile-basic-grid">
            <EditableField label="Name" value={user.name} icon="👤" onSave={v=>save({name:v})}/>
            <EditableField label="Age" value={user.age} type="number" icon="📅" onSave={v=>{ const n=parseInt(v); if(n>=18) save({age:n}); }}/>
            <div className="profile-field">
              <label>City</label>
              <div className="profile-field-val profile-field-editable" onClick={()=>setCityPickerOpen(o=>!o)}>{cd.label} 📍 <span className="profile-field-edit-hint">✏️</span></div>
              {cityPickerOpen && (
                <div className="profile-city-picker">
                  {[{id:"nyc",name:"New York City"},{id:"mumbai",name:"Mumbai"}].map(c=>(
                    <button key={c.id} className={`profile-city-opt ${user.city===c.id?"active":""}`} onClick={()=>{ save({city:c.id}); setCityPickerOpen(false); }}>{c.name}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2 Photos */}
      <div className="profile-section">
        <div className="profile-sec-num">2</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Personal photos <span className="profile-sec-count">{photos.filter(Boolean).length}/3 photos added</span></div>
          <div className="profile-sec-sub">Add 3 photos to help others recognize you.</div>
          <div className="photos-grid">
            {[0,1,2].map(i=>(
              <label key={i} className="photo-slot" style={{cursor:"pointer"}}>
                <div className="photo-num">{i+1}</div>
                {photos[i] ? (
                  <>
                    <img src={photos[i]} alt={`Photo ${i+1}`} className="photo-img"/>
                    <button type="button" className="photo-remove" onClick={e=>{e.preventDefault();removePhoto(i);}}>×</button>
                  </>
                ) : uploadingSlot===i ? (
                  <div className="photo-placeholder">⏳</div>
                ) : (
                  <div className="photo-placeholder">📷</div>
                )}
                <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>handlePhotoSelect(i, e.target.files?.[0])}/>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Things */}
      <div className="profile-section">
        <div className="profile-sec-num">3</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Things I want to do in the city <span className="profile-sec-count">{things.length} added</span></div>
          <div className="ob-tags-row">{things.map((w,i)=><span key={i} className="ob-tag">{w}<button onClick={()=>removeThing(w)}>×</button></span>)}</div>
          {things.length===0 && <p className="profile-sec-sub" style={{marginTop:8}}>No selections yet — add a few below.</p>}
          <div className="ob-chips-grid" style={{marginTop:14}}>
            {THINGS_OPTIONS.filter(t=>!things.includes(t)).map(t=>(
              <button key={t} className="ob-thing-chip" onClick={()=>addThing(t)}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Cuisine preferences + budget — drives food recommendations */}
      <div className="profile-section">
        <div className="profile-sec-num">4</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Food preferences <span className="profile-sec-count">{cuisines.length} cuisine{cuisines.length===1?"":"s"}</span></div>
          <div className="profile-sec-sub">This powers your food recommendations. Reorder to update your priority.</div>
          {cuisines.length>0 && (
            <div className="ob-ranked-list" style={{marginTop:4}}>
              {cuisines.map((id,i)=>{ const c=CUISINE_OPTIONS.find(o=>o.id===id); return (
                <div key={id} className="ob-ranked-row">
                  <span className="ob-ranked-num">{i+1}</span>
                  <span className="ob-ranked-icon">{c?.icon}</span>
                  <span className="ob-ranked-label-text">{c?.label}</span>
                  <div className="ob-ranked-actions">
                    <button className="ob-ranked-btn" disabled={i===0} onClick={()=>moveCuisine(id,-1)}>↑</button>
                    <button className="ob-ranked-btn" disabled={i===cuisines.length-1} onClick={()=>moveCuisine(id,1)}>↓</button>
                    <button className="ob-ranked-btn ob-ranked-remove" onClick={()=>removeCuisine(id)}>×</button>
                  </div>
                </div>
              );})}
            </div>
          )}
          <div className="ob-chips-grid" style={{marginTop:cuisines.length>0?14:4}}>
            {CUISINE_OPTIONS.filter(c=>!cuisines.includes(c.id)).map(c=>(
              <button key={c.id} className="ob-chip" onClick={()=>addCuisine(c.id)}>
                <span className="ob-chip-icon">{c.icon}</span><span className="ob-chip-label">{c.label}</span>
              </button>
            ))}
          </div>
          <div className="profile-sec-title" style={{marginTop:20,fontSize:14}}>Your budget</div>
          <div className="profile-budget-row">
            {BUDGET_OPTIONS.map(b=>(
              <button key={b.id} className={`profile-budget-chip ${budget===b.id?"active":""}`} onClick={()=>{ const prevBudget=budget; setBudget(b.id); save({budget:b.id}, ()=>setBudget(prevBudget)); }}>
                <span>{b.icon}</span>{b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5 Food recs */}
      <div className="profile-section">
        <div className="profile-sec-num">5</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Your top food matches <span className="profile-sec-count">Based on your ranking above</span></div>
          <div className="profile-sec-sub">The same recommendation logic used on the Discovery tab — reorder your cuisines above and this updates instantly.</div>
          {cuisines.length === 0 ? (
            <p className="profile-sec-sub" style={{marginTop:8}}>Add a cuisine above to see matches here.</p>
          ) : (
            [...cd.food].sort((a,b)=>scoreFoodPlace(b,cuisines,budget)-scoreFoodPlace(a,cuisines,budget)).slice(0,3).map(r=>(
              <div key={r.id} className="profile-rec-row"><img src={r.img} alt={r.name} className="profile-rec-img"/><div><div className="profile-rec-name">{r.name}</div><div className="profile-rec-desc">{r.cuisine} · {r.hood}</div></div></div>
            ))
          )}
        </div>
      </div>

      {/* 6 City recs */}
      <div className="profile-section">
        <div className="profile-sec-num">6</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">In-City recommendations <span className="profile-sec-count">3/3 added</span></div>
          <div className="profile-sec-sub">Share places you love in {cd.label}.</div>
          {(p.cityRecs||[]).map((r,i)=>(
            <div key={i} className="profile-rec-row"><img src={r.img} alt={r.name} className="profile-rec-img"/><div><div className="profile-rec-name">{r.name}</div><div className="profile-rec-desc">{r.desc}</div></div><button className="profile-rec-actions">⚙ ✏️ ×</button></div>
          ))}
          <button className="profile-rec-add">⊕ Add in-city place</button>
        </div>
      </div>

      <button className="profile-signout" onClick={onSignOut}>Sign Out</button>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const { session, profile, loading, refreshProfile } = useAuth();
  const [localUser, setLocalUser] = useState(null);
  const [tab, setTab] = useState("discovery");
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [screen, setScreen] = useState("landing"); // landing | signin | onboarding | app

  async function handleSignOut() {
    try { await signOut(); } catch(e) { console.error(e); }
    setLocalUser(null);
    setScreen("landing");
  }

  // ── Supabase session loading ──
  if (loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f7f7f5"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:32,fontWeight:800,letterSpacing:"-0.04em",marginBottom:12}}>
          <span style={{color:"#1a2e1a"}}>Near</span><span style={{color:"#2d6a2d"}}>Met</span>
        </div>
        <div style={{fontSize:13,color:"#999"}}>Loading…</div>
      </div>
    </div>
  );

  // ── Signed in via Supabase ──
  if (session) {
    // Profile complete — show main app
    if (profile?.profile_complete) {
      const user = {
        city: profile.city || "mumbai",
        name: profile.name || "User",
        age: profile.age || null,
        interests: profile.interests || [],
        things: profile.city_wants || [],
        cuisines: profile.cuisines || [],
        budget: profile.budget || "flexible",
        photo_urls: profile.photo_urls || [],
        saved_food_places: profile.saved_food_places || [],
      };
      return (
        <div className="app-root">
          <header className="topnav">
            <div className="topnav-inner">
              <NearMetLogo size={26}/>
              <nav className="topnav-links">
                {[["discovery","Discovery"],["events","Events"],["connection","Connection"],["profile","Profile"]].map(([id,lbl])=>(
                  <button key={id} className={`tnav-link ${tab===id?"active":""}`} onClick={()=>setTab(id)}>{lbl}</button>
                ))}
              </nav>
              <div className="topnav-right">
                <span className="city-pill">📍 {user.city==="nyc"?"NYC":"Mumbai"}</span>
                <button className="topnav-msg-btn" onClick={()=>setMessagesOpen(true)} title="Messages">💬</button>
                <div className="user-chip">{(user.name||"U").slice(0,2).toUpperCase()}</div>
              </div>
            </div>
          </header>
          {messagesOpen && <MessagesPanel userId={session.user.id} onClose={()=>setMessagesOpen(false)}/>}
          <main className="site-main">
            {tab==="discovery"  && <DiscoveryScreen city={user.city} userCuisines={user.cuisines} userBudget={user.budget} userId={session.user.id} userName={user.name} savedPlaces={user.saved_food_places} onToggleSave={async(name)=>{ const cur=user.saved_food_places||[]; const next=cur.includes(name)?cur.filter(n=>n!==name):[...cur,name]; try{ await updateProfile(session.user.id,{saved_food_places:next}); await refreshProfile(); }catch(e){ console.error("Save toggle failed:",e); } }}/>}
            {tab==="events"     && <EventsMapScreen city={user.city}/>}
            {tab==="connection" && <ConnectionScreen city={user.city} userId={session.user.id} me={user}/>}
            {tab==="profile"    && <ProfileScreen user={user} userId={session.user.id} onSignOut={handleSignOut} onUpdateProfile={async(updates)=>{ await updateProfile(session.user.id, updates); await refreshProfile(); }}/>}
          </main>
        </div>
      );
    }
    // Signed in but profile not complete — run onboarding (interests/things only) then save
    return <Onboarding
      initialCity={profile?.city}
      initialName={profile?.name}
      onShowSignIn={handleSignOut}
      onBackToLanding={handleSignOut}
      onDone={async (u) => {
        try {
          await updateProfile(session.user.id, {
            city: u.city, name: u.name,
            interests: u.interests, city_wants: u.things,
            cuisines: u.cuisines, budget: u.budget,
            profile_complete: true, last_active: new Date().toISOString(),
          });
          await refreshProfile();
        } catch(e) {
          console.error("Profile save error:", e);
        }
      }}
    />;
  }

  // ── Not signed in ──

  // Show sign in page
  if (screen === "signin") return <AuthPage mode="signin" onBack={()=>setScreen("landing")}/>;

  // Show sign up page (collects email+password, then triggers onboarding)
  if (screen === "signup") return <AuthPage mode="signup" onBack={()=>setScreen("landing")} onSignedUp={()=>{ /* AuthContext will pick up session, profile_complete=false triggers onboarding */ }}/>;

  // Local demo user — show main app
  if (localUser) {
    return (
      <div className="app-root">
        <header className="topnav">
          <div className="topnav-inner">
            <NearMetLogo size={26}/>
            <nav className="topnav-links">
              {[["discovery","Discovery"],["events","Events"],["connection","Connection"],["profile","Profile"]].map(([id,lbl])=>(
                <button key={id} className={`tnav-link ${tab===id?"active":""}`} onClick={()=>setTab(id)}>{lbl}</button>
              ))}
            </nav>
            <div className="topnav-right">
              <span className="city-pill">📍 {localUser.city==="nyc"?"NYC":"Mumbai"}</span>
              <button className="topnav-msg-btn" disabled title="Sign in to use messaging" onClick={()=>alert("Messaging needs a real account — sign up to chat with people.")}>💬</button>
              <div className="user-chip">{(localUser.name||"U").slice(0,2).toUpperCase()}</div>
            </div>
          </div>
        </header>
        <main className="site-main">
          {tab==="discovery"  && <DiscoveryScreen city={localUser.city} userCuisines={localUser.cuisines||[]} userBudget={localUser.budget||"flexible"} userId={null} userName={localUser.name} savedPlaces={localUser.saved_food_places||[]} onToggleSave={(name)=>{ setLocalUser(u=>{ const cur=u.saved_food_places||[]; const next=cur.includes(name)?cur.filter(n=>n!==name):[...cur,name]; return {...u, saved_food_places:next}; }); }}/>}
          {tab==="events"     && <EventsMapScreen city={localUser.city}/>}
          {tab==="connection" && <ConnectionScreen city={localUser.city} userId={null} me={localUser}/>}
          {tab==="profile"    && <ProfileScreen user={localUser} userId={null} onSignOut={()=>{setLocalUser(null);setScreen("landing");}} onUpdateProfile={async(updates)=>{ setLocalUser(u=>({...u,...updates})); }}/>}
        </main>
      </div>
    );
  }

  // Onboarding for new local user
  if (screen === "onboarding") return <Onboarding
    onShowSignIn={()=>setScreen("signin")}
    onBackToLanding={()=>setScreen("landing")}
    onDone={u=>{ setLocalUser(u); setTab("discovery"); }}
  />;

  // Landing screen
  return (
    <div className="ob-root">
      <div className="ob-hero">
        <div className="ob-hero-img" style={{backgroundImage:`url(https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=900&q=80)`}}/>
        <div className="ob-hero-overlay"/>
        <div className="ob-hero-content">
          <NearMetLogo size={56} dark/>
          <p className="ob-hero-tagline">Explore your city.<br/>Find genuine connections.</p>
        </div>
        <div className="ob-hero-bottom">
          <button className="ob-cta-primary" onClick={()=>setScreen("signup")}>Create an account</button>
          <button className="ob-cta-secondary" onClick={()=>setScreen("signin")}>I have an account</button>
          <p className="ob-legal">By continuing you agree to our <span className="ob-link">Terms</span> &amp; <span className="ob-link">Privacy Policy</span>.</p>
        </div>
      </div>
    </div>
  );
}