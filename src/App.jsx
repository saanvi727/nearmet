import { useState, useEffect } from "react";
import "./App.css";
import { useAuth } from "./context/AuthContext.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { signOut, updateProfile, uploadProfilePhoto, uploadFoodExperiencePhoto, getFoodExperiences, shareFoodExperience, deleteFoodExperience, getPeople, passProfile, resetPasses, getOrCreateConnection, getConnections, getMessages, sendMessage, getCommunityPlaces, uploadCommunityPlacePhoto, submitCommunityPlace } from "./lib/supabase.js";

// ─── LOGO ────────────────────────────────────────────────────────────────────
function NearMetLogo({ size = 28, dark = false }) {
  return (
    <span className="nm-logo" style={{ fontSize: size }}>
      <span style={{ color: dark ? "#f5f5f0" : "#1a2e1a" }}>Near</span>
      <span style={{ color: dark ? "#8aad6e" : "#2d6a2d" }}>Met</span>
    </span>
  );
}

// ─── PRODUCT TOUR ──────────────────────────────────────────────────────────────
// Diverse mixed names for the seeded shared experience on food detail pages
const SHARED_EXP_NAMES = ["Rohan","Priya","Arjun","Meera","Karan","Aditi","Rahul","Ishaan","Pooja","Vikram","Nisha","Aarav","Kavya","Dev","Sanya","Nikhil","Riya","Aman","Sneha","Yash","Ananya","Aditya","Zara","Kabir","Tanvi","Siddharth","Diya","Mihir","Simran","Neil"];

const TOUR_STEPS = [
  { icon:"👋", title:"Welcome to NearMet", body:"Quick tour — find food spots worth trying, meet people nearby who share your taste, and discover what's happening in your city. Takes about a minute." },
  { icon:"🍽️", title:"Food Places", body:"Browse curated food spots across Mumbai — cafés, restaurants, street food, bakeries and more. Filter by area or category, or search by name and cuisine." },
  { icon:"⭐", title:"Recommendations for you", body:"The more you set up your food preferences in your profile, the more personalized your recommendations get — matched to your exact cuisines and budget." },
  { icon:"📸", title:"Community experiences", body:"Every place has real shared experiences from people like you — the dish they tried, what they loved, and photos. Tap any place to explore it." },
  { icon:"🎟️", title:"Events", body:"See what's happening around the city — gigs, festivals, open mics and meetups — matched to your interests from your profile." },
  { icon:"👥", title:"Connections", body:"Meet other registered NearMet users nearby. We rank matches by shared food places, things you both want to do, and shared interests — no random strangers." },
  { icon:"💬", title:"Direct messaging", body:"Tap 'Message' on any profile to start a real conversation. All your chats are accessible from the 💬 icon in the top bar, from any screen." },
  { icon:"🧭", title:"Your profile", body:"Set your food preferences, cuisines, and budget here — this directly powers what you see recommended on the Food Places screen. It gets better the more you fill in." },
  { icon:"✅", title:"You're all set!", body:"Explore the city, find your people, and share your favorite spots. You can replay this tour anytime from your Profile tab." },
];

function TourOverlay({ stepIndex, onNext, onBack, onSkip }) {
  const step = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;
  const progress = ((stepIndex + 1) / TOUR_STEPS.length) * 100;
  return (
    <div className="tour-modal-bg">
      <div className="tour-modal">
        <div className="tour-progress-bar"><div className="tour-progress-fill" style={{width:`${progress}%`}}/></div>
        <div className="tour-step-icon">{step.icon}</div>
        <div className="tour-card-step">{stepIndex+1} / {TOUR_STEPS.length}</div>
        <div className="tour-card-title">{step.title}</div>
        <p className="tour-card-body">{step.body}</p>
        <div className="tour-card-footer">
          <button className="tour-skip-btn" onClick={onSkip}>Skip tour</button>
          <div className="tour-nav-btns">
            {stepIndex > 0 && <button className="tour-back-btn" onClick={onBack}>Back</button>}
            <button className="tour-next-btn" onClick={onNext}>{isLast ? "Start exploring →" : "Next →"}</button>
          </div>
        </div>
      </div>
    </div>
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
      { id:1, name:"Aram Vada Pav", cuisine:"Street Food", price:"Rs.50-150 for two", rating:4.6, tag:"Legendary since 1939", hood:"CST", address:"Capital Cinema Building, Opposite CSMT, Azad Maidan, Fort, Mumbai 400001", phone:"8655712155", desc:"Experience a taste of tradition at Aram Vada Pav - Mumbai's legendary spot for authentic Maharashtrian street food since 1939. Known for the original vada pav, Misal Pav, Thalipeeth and the traditional sweet drink Piyush.", sharedExp:"Tried the vada pav and had a great experience. The vada was crispy, the pav was soft and the chutney added a flavorful spicy kick.", tryThis:"Vada Pav", img:"/places/aram-vada-pav/photo1.webp", photos:["/places/aram-vada-pav/photo2.jpg"] },
      { id:2, name:"ARAKU Coffee", cuisine:"Cafe", price:"Rs.800-1200 for two", rating:4.5, tag:"Farm-to-cup", hood:"Colaba", address:"Sunny House, Mandlik Rd, Apollo Bandar, Colaba, Mumbai 400001", phone:"7337205222", desc:"ARAKU Coffee sources 100% organic single-origin Arabica coffee from Araku Valley. The menu includes artisanal bakes, all-day breakfast, seasonal dishes, and a curated selection of cocktails and wines.", sharedExp:"The coffee was great and the food was both delicious and beautifully presented with plenty of options to choose from.", tryThis:"Pistachio and Rhubarb Cake", img:"/places/araku-coffee/photo1.jpg", photos:[] },
      { id:3, name:"Mag St. Cafe", cuisine:"Cafe", price:"Rs.800-1500 for two", rating:4.4, tag:"Local favorite", hood:"Colaba", address:"4, Mandlik Rd, Apollo Bandar, Colaba, Mumbai 400001", phone:"7208544366", desc:"A beloved destination for Mumbaikars seeking casual and comforting dining. From Lobster Rolls and Truffle Fries to artisanal pizzas - fresh locally sourced ingredients meet international culinary offerings.", sharedExp:"Absolutely delicious food with generous portions for the price. Great service and the whole experience was enjoyable.", tryThis:"Udon Noodles and Korean Cheese Bun", img:"/places/mag-st-cafe/photo1.webp", photos:["/places/mag-st-cafe/photo2.jpg","/places/mag-st-cafe/photo3.webp"] },
      { id:4, name:"Leopold Cafe", cuisine:"Multi-cuisine", price:"Rs.1000-1500 for two", rating:4.4, tag:"Iconic landmark", hood:"Colaba", address:"Shahid Bhagat Singh Road, Colaba Causeway, Apollo Bandar, Colaba, Mumbai 400001", phone:"8585828201", desc:"An iconic cafe in Colaba known for its historic charm and lively atmosphere. One of Mumbai's most celebrated landmarks with a diverse menu and vibrant setting.", sharedExp:"Great lively atmosphere and an extensive menu featuring Indian, continental and Chinese dishes. Tasty food in generous portions.", tryThis:"Chicken Chilli and Grilled Chicken Sandwich", img:"/places/leopold-cafe/photo3.webp", photos:["/places/leopold-cafe/photo1.webp","/places/leopold-cafe/photo2.webp"] },
      { id:5, name:"Woodside Inn", cuisine:"Gastropub", price:"Rs.1500-2500 for two", rating:4.5, tag:"Best gastropub", hood:"Colaba", address:"Indian Mercantile Mansion, Wodehouse Road, Opposite Regal Cinema, Colaba, Mumbai 400001", phone:"9321728192", desc:"Cosy, warmly decorated gastropub serving a range of global dishes. Never forced - great food, great drinks, great atmosphere.", sharedExp:"My favorite thing about Woodside is that it never feels forced. You can come here after a long day, order a beer and some truffle fries and lose track of time.", tryThis:"Draft Beer and Chicken Poppers", img:"/places/woodside-inn/photo2.webp", photos:["/places/woodside-inn/photo1.jpeg"] },
      { id:6, name:"Cafe Mondegar", cuisine:"Cafe", price:"Rs.800-1500 for two", rating:4.3, tag:"Vintage classic", hood:"Colaba", address:"Metro House, Colaba Causeway, near Regal Cinema, Apollo Bandar, Colaba, Mumbai 400001", phone:"9833322277", desc:"A legendary South Mumbai landmark famous for its vibrant Mario Miranda murals and retro jukebox. The ultimate vintage spot for a chilled beer and classic comfort food.", sharedExp:"Incredible food, great music and good service. Highly recommended.", tryThis:"Paneer Croquettes and Spring Rolls", img:"/places/cafe-mondegar/photo1.jpg", photos:["/places/cafe-mondegar/photo2.webp"] },
      { id:7, name:"Kuai Kitchen", cuisine:"Chinese Restaurant", price:"Rs.600-1200 for two", rating:4.4, tag:"Best Oriental", hood:"Colaba", address:"Shop No. 16/A Cusrow Baug, Main Road Colaba Causeway, Shahid Bhagat Singh Rd, Colaba, Mumbai 400001", phone:"9819045664", desc:"Kuai Kitchen is a vibrant casual restaurant dedicated to being the ultimate destination for delicious and affordable Oriental cuisine.", sharedExp:"Top-tier food paired with flawless hospitality. Highly recommend for Asian cuisine.", tryThis:"Kuai Special Roll and Pinacolada", img:"/places/kuai-kitchen/photo1.jpg", photos:["/places/kuai-kitchen/photo2.webp","/places/kuai-kitchen/photo3.webp"] },
      { id:8, name:"Nandan Coffee", cuisine:"Specialty Coffee Cafe", price:"Rs.600-1000 for two", rating:4.7, tag:"Specialty coffee", hood:"Kala Ghoda", address:"Mulla House, 34, Homi Modi St, opposite Central Bank Head Office, Kala Ghoda, Fort, Mumbai 400001", phone:"7738069879", desc:"Nandan Coffee has earned a reputation for offering more than just exceptional coffee. Its specialty coffee is sourced straight from an organic estate in Kodaikanal. Warm hospitality and a calm atmosphere.", sharedExp:"The interior is incredible and the specialty coffee is sourced straight from their organic estate in Kodaikanal. The service is friendly too.", tryThis:"Tiramisu French Toast and Mediterranean Spiced Eggs", img:"/places/nandan-coffee/photo1.jpg", photos:["/places/nandan-coffee/photo2.jpg","/places/nandan-coffee/photo3.webp"] },
      { id:9, name:"Zen Cafe", cuisine:"Cafe", price:"Rs.500-900 for two", rating:4.5, tag:"Work-friendly", hood:"Kala Ghoda", address:"Fort Foundation Building, Bake House Ln, Kala Ghoda, Fort, Mumbai 400001", phone:"9167768950", desc:"Single origin coffees brewed with precision and served with freshly baked sourdough and a global menu at this trendy work-friendly venue.", sharedExp:"Highly recommend checking this place out! The staff is super friendly and welcoming.", tryThis:"Coffee and Hummus", img:"/places/zen-cafe/photo1.jpg", photos:["/places/zen-cafe/photo2.jpg","/places/zen-cafe/photo3.png"] },
      { id:10, name:"Miya Kebabs", cuisine:"Kebab Restaurant", price:"Rs.400-800 for two", rating:4.3, tag:"Consistent quality", hood:"Kala Ghoda", address:"Ali Chambers, Flora Fountain, 81-82, M Shetty Marg, Kala Ghoda, Fort, Mumbai 400023", phone:"8847747644", desc:"A popular eatery in Kala Ghoda known for its flavorful food and generous portions. Consistent quality, quick service and satisfying meals.", sharedExp:"Had a great experience and the food was tasty.", tryThis:"Chicken Changezi", img:"/places/miya-kebabs/photo1.jpg", photos:["/places/miya-kebabs/photo1.jpg"] },
      { id:11, name:"Kala Ghoda Cafe", cuisine:"Cafe", price:"Rs.600-1000 for two", rating:4.5, tag:"Neighbourhood gem", hood:"Kala Ghoda", address:"10, Rope Walk Ln, Kala Ghoda, Fort, Mumbai 400001", phone:"9833803418", desc:"A charming cafe in Kala Ghoda known for its warm atmosphere and comforting food. Friendly service and relaxed setting.", sharedExp:"The food was fantastic and the restaurant has a very welcoming vibe. The perfect place to enjoy quality time with friends.", tryThis:"Chocolate Profiteroles and Cottage Cheese Burger", img:"/places/kala-ghoda-cafe/photo1.webp", photos:["/places/kala-ghoda-cafe/photo2.webp","/places/kala-ghoda-cafe/photo3.webp"] },
      { id:12, name:"The Nutcracker", cuisine:"Cafe", price:"Rs.700-1200 for two", rating:4.6, tag:"All-day breakfast", hood:"Kala Ghoda", address:"One Forbes Building, Modern House, Dr. V.B. Gandhi Marg, Kala Ghoda, Fort, Mumbai", phone:"9321759393", desc:"The Nutcracker serves wholesome comfort food and all-day breakfast. Renowned for its extensive egg menu, gourmet burgers and decadent desserts.", sharedExp:"Delicious food, great coffee and excellent service. Highly recommend a visit.", tryThis:"Paprika Penne Pasta with Garlic Bread and Cream Cheese Bagel", img:"/places/the-nutcracker/photo1.jpg", photos:["/places/the-nutcracker/photo2.webp","/places/the-nutcracker/photo3.webp"] },
      { id:13, name:"HnH Salad Co.", cuisine:"Healthy Cafe", price:"Rs.500-900 for two", rating:4.4, tag:"Healthy and delicious", hood:"Kala Ghoda", address:"Ground floor, Khattau Buildings, General Vaidya Road, 7, Shahid Bhagat Singh Rd, Kala Ghoda, Fort, Mumbai 400001", phone:"7045989242", desc:"HnH Salad Co. is redefining healthy eating by serving chef-crafted, flavor-packed nutritious dishes that prove wellness is never bland.", sharedExp:"Healthy food that actually tastes amazing. A fantastic spot for a delicious and wholesome meal.", tryThis:"Salad Bowl", img:"/places/hnh-salad/photo1.webp", photos:["/places/hnh-salad/photo2.jpg"] },
      { id:14, name:"Cafe Trofima", cuisine:"Cafe", price:"Rs.600-1000 for two", rating:4.4, tag:"Neighbourhood favorite", hood:"Dadar", address:"Raja Badhe Chowk, Opp. Raja Rani Travels, Shivaji Park Road No. 2, Lady Jamshedji Rd, Mumbai 400028", phone:"8291019988", desc:"A well-loved cafe in Shivaji Park known for its warm ambience and wide-ranging menu. Quality food, friendly service and an inviting atmosphere.", sharedExp:"This is a great place to hang out with friends. The staff is friendly and the food is absolutely delicious.", tryThis:"White Sauce Pasta", img:"/places/cafe-trofima/photo1.jpg", photos:["/places/cafe-trofima/photo2.jpg"] },
      { id:15, name:"Ashok Vada Pav", cuisine:"Street Food", price:"Rs.50-150 for two", rating:4.5, tag:"Mumbai must-try", hood:"Dadar", address:"Kashinath Dhuru Marg, Near Kirti College, Dadar West, Mumbai 400028", phone:"8591894170", desc:"A popular Dadar eatery known for its flavorful vada pav and long-standing local following. Consistent quality and fresh preparation.", sharedExp:"A must-visit spot for vada pav lovers. Enjoyed it and would recommend to everyone.", tryThis:"Vada Pav", img:"/places/ashok-vada-pav/photo1.jpg", photos:["/places/ashok-vada-pav/photo2.jpg"] },
      { id:16, name:"Earth Cafe", cuisine:"Healthy Cafe", price:"Rs.600-1000 for two", rating:4.8, tag:"Top rated", hood:"Churchgate", address:"Ground Floor, Ram Mahal, Dinshaw Vacha Rd, near KC College, Churchgate, Mumbai 400020", phone:"9081881844", desc:"Earth Cafe's menu features a wide variety of dishes made with fresh and high-quality ingredients. From hearty meals to refreshing smoothies and guilt-free desserts.", sharedExp:"The vegan food here is delicious and the hospitality was excellent.", tryThis:"Rainbow Sandwich and Orange Chocolate Cake", img:"/places/earth-cafe/photo2.webp", photos:["/places/earth-cafe/photo1.webp","/places/earth-cafe/photo3.webp"] },
      { id:17, name:"K. Rustom and Co.", cuisine:"Ice Cream Parlour", price:"Rs.200-400 for two", rating:4.7, tag:"Mumbai institution", hood:"Churchgate", address:"Brabourne Stadium 86, Veer Nariman Rd, Churchgate, Mumbai 400020", phone:"02222821768", desc:"Mumbai's most beloved ice cream shop, specializing in wafer-biscuit ice cream sandwiches. A Churchgate landmark for generations.", sharedExp:"Hands down one of the best ice creams I've ever tasted. The quality and flavor are outstanding.", tryThis:"Mango Ice Cream Sandwich", img:"/places/k-rustom/photo1.png", photos:["/places/k-rustom/photo2.webp"] },
      { id:18, name:"Ramen Bar Wagamama", cuisine:"Japanese Restaurant", price:"Rs.1200-2000 for two", rating:4.5, tag:"Best ramen", hood:"Churchgate", address:"42, Cambata Building, Maharshi Karve Road, Near Eros Theatre, Churchgate, Mumbai 400020", phone:"9702703111", desc:"A popular Japanese restaurant in Churchgate known for its authentic flavors and comforting dining experience. Attentive service and consistent quality.", sharedExp:"Had a truly wonderful experience here! The food was outstanding, and the service was friendly.", tryThis:"Bang Bang Cauliflower and Gyozas", img:"/places/ramen-wagamama/photo1.jpg", photos:["/places/ramen-wagamama/photo2.jpg","/places/ramen-wagamama/photo3.webp"] },
      { id:19, name:"Mezcalita Churchgate", cuisine:"Mexican Restaurant", price:"Rs.1500-2500 for two", rating:4.7, tag:"Mexican cantina", hood:"Churchgate", address:"Nagin Mahal, 82, Veer Nariman Rd, Churchgate, Mumbai 400020", phone:"8657512648", desc:"Discover an authentic taste of Mexico at Mezcalita. From sizzling fajitas to zesty tacos and refreshing cocktails - each dish transports you straight to the heart of Mexico.", sharedExp:"A vibrant spot that absolutely nails the energy of a modern Mexican cantina. The tacos are consistently excellent and the cocktails make it one of Mumbai's most fun dining experiences.", tryThis:"Tacos", img:"/places/mezcalita-cg/photo1.jpeg", photos:["/places/mezcalita-cg/photo2.jpg"] },
      { id:20, name:"Pizza By The Bay", cuisine:"Restaurant", price:"Rs.1200-2000 for two", rating:4.5, tag:"Sea view dining", hood:"Churchgate", address:"Soona Mahal, 143, Marine Dr, Churchgate, Mumbai 400020", phone:"7718838749", desc:"One of Mumbai's most iconic dining institutions since 1968, famous for its prime location overlooking the Arabian Sea.", sharedExp:"Delicious food and friendly service. The spectacular sea view makes this place an absolute must-visit.", tryThis:"Pollo Arabiata Pizza", img:"/places/pizza-by-the-bay/photo2.webp", photos:["/places/pizza-by-the-bay/photo1.webp"] },
      { id:21, name:"Mockingbird Cafe Bar", cuisine:"Cafe", price:"Rs.800-1500 for two", rating:4.3, tag:"Chill vibes", hood:"Churchgate", address:"80, Veer Nariman Rd, Churchgate, Mumbai 400020", phone:"8097606010", desc:"Mockingbird Cafe Bar is a great place to chill with great ambiance, a wide range of wonderful cuisine and reasonably priced drinks.", sharedExp:"Delicious food, good service and a wonderful atmosphere. The perfect place to spend quality time with friends or loved ones.", tryThis:"Garden Fresh Pizza and Peri Peri French Fries", img:"/places/mockingbird/photo1.jpg", photos:["/places/mockingbird/photo2.webp","/places/mockingbird/photo3.webp"] },
      { id:22, name:"Coffee Island", cuisine:"Cafe", price:"Rs.400-800 for two", rating:4.4, tag:"European-style cafe", hood:"Churchgate", address:"Shop No 10/11 Ground Floor, Eros Cinema, 42, Maharshi Karve Rd, Churchgate, Mumbai 400020", phone:"9211729505", desc:"A vibrant European-style cafe popular for artisanal brews like the signature Islander Cold Coffee, fresh pastries, and late-night workspaces.", sharedExp:"It was an amazing experience with beautiful ambience and great service.", tryThis:"Flatbread and Islander Cold Coffee", img:"/places/coffee-island/photo1.webp", photos:["/places/coffee-island/photo2.webp"] },
      { id:23, name:"Gaylord Restaurant", cuisine:"Multi-cuisine Restaurant", price:"Rs.1500-2500 for two", rating:4.4, tag:"Fine dining", hood:"Churchgate", address:"V N Rd, Churchgate, Mumbai 400020", phone:"7045556060", desc:"Buzzing spot with indoor and outdoor seating with an extensive menu of multi-cuisine fare and snacks. Elegant interiors, perfect for a fine dining experience.", sharedExp:"Elegant interiors and an excellent atmosphere make this the perfect spot for a fine dining experience.", tryThis:"Mushroom Cheese Lasagna and Creme Brulee", img:"/places/gaylord/photo1.jpeg", photos:["/places/gaylord/photo2.webp","/places/gaylord/photo3.webp"] },
      { id:24, name:"Boojee Cafe", cuisine:"Cafe", price:"Rs.800-1500 for two", rating:4.6, tag:"Brunch spot", hood:"Bandra West", address:"Shop No. 6, 29, New Kantwadi Road, Off Perry Cross Road, Bandra West, Mumbai 400050", phone:"9930203882", desc:"A Bandra cafe known for its specialty coffee, delicious brunch offerings and inviting atmosphere. Quality food, friendly service and stylish interiors.", sharedExp:"It was an amazing experience from start to finish. The food was incredible and full of flavor.", tryThis:"Bombay Burger and Nachos", img:"/places/boojee-cafe/photo3.webp", photos:["/places/boojee-cafe/photo1.jpeg","/places/boojee-cafe/photo2.jpg"] },
      { id:25, name:"Bokka Coffee", cuisine:"Cafe", price:"Rs.500-900 for two", rating:4.5, tag:"Coffee perfection", hood:"Bandra West", address:"Shop No. 6 and 7, Silver Croft, 16th Road, Near Khane Khas, Bandra West, Mumbai 400050", phone:"8355805500", desc:"A cozy Bandra cafe known for its excellent coffee and thoughtfully prepared breakfast offerings. Quality food, friendly service and a welcoming atmosphere.", sharedExp:"Absolutely loved this place. The coffee was brewed to perfection and all the desserts were fantastic.", tryThis:"Specialty Cake", img:"/places/bokka-coffee/photo1.webp", photos:["/places/bokka-coffee/photo2.webp"] },
      { id:26, name:"Abokado", cuisine:"Japanese Cafe", price:"Rs.800-1400 for two", rating:4.5, tag:"Must-try sushi", hood:"Bandra West", address:"Shop No. 1, Sefa House, Pali Mala Rd, Bandra West, Mumbai 400049", phone:"8369936468", desc:"A cozy Japanese inspired cafe in Bandra known for its welcoming atmosphere and consistently well-received food. Authentic flavors in an intimate setting.", sharedExp:"Truly authentic flavors and the Japanese sushi here is absolutely amazing. A must-visit spot for all sushi lovers.", tryThis:"Sushi", img:"/places/abokado/photo2.jpg", photos:["/places/abokado/photo1.webp"] },
      { id:27, name:"Veronica", cuisine:"Cafe", price:"Rs.600-1200 for two", rating:4.6, tag:"Best sandwiches", hood:"Bandra West", address:"9, Waroda Rd, Beside Agna Square, Ranwar, Bandra West, Mumbai 400050", phone:"9372981697", desc:"Veronica's is a vibrant trend-setting Bandra deli famous for its massive, premium artisanal sandwiches and high-energy neighbourhood vibe.", sharedExp:"One of Mumbai's finest sandwich and bakery spots. The bread is exceptional and even the simplest dishes feel memorable.", tryThis:"Dirty Fries with Cheese", img:"/places/veronica/photo2.webp", photos:["/places/veronica/photo1.webp"] },
      { id:28, name:"Miyo Dessert Bar", cuisine:"Bakery and Desserts", price:"Rs.600-1000 for two", rating:4.6, tag:"Make It Your Own", hood:"Bandra West", address:"Shop 3, Silvercroft, Junction of 16th and 33rd Rd, Bandra West, Mumbai 400050", phone:"9004502803", desc:"Miyo Dessert Bar is a freestyle dessert bar operating on a unique MIYO concept - an anti-menu philosophy where you fully customize your sweet treats.", sharedExp:"Creative, elegant and consistently impressive. Beautifully plated and perfectly balanced sophisticated flavors.", tryThis:"Belgian Chocolate Gelato", img:"/places/miyo-dessert/photo2.jpeg", photos:["/places/miyo-dessert/photo1.webp"] },
      { id:29, name:"GIGI Bombay", cuisine:"Japanese Restaurant", price:"Rs.2000-3500 for two", rating:4.7, tag:"Premium fusion", hood:"Bandra West", address:"14th Rd, Bandra West, Mumbai 400050", phone:"8976943116", desc:"Gigi Bombay is a trendy Japanese-European fusion restaurant and cocktail bar in Bandra West. Every dish feels carefully executed.", sharedExp:"A near-perfect combination of ambience, service and food. Every dish feels carefully executed making it one of the city's most premium dining experiences.", tryThis:"Chilli Garlic Edamame, Pumpkin Ravioli and Salmon Sushi", img:"/places/gigi-bombay/photo1.jpg", photos:["/places/gigi-bombay/photo2.webp","/places/gigi-bombay/photo3.webp"] },
      { id:30, name:"Pomodoro", cuisine:"Italian Restaurant", price:"Rs.1000-1800 for two", rating:4.6, tag:"Hand-rolled pasta", hood:"Bandra West", address:"Shop No. 2, 16th Rd, Bandra West, Mumbai 400050", phone:"7887886327", desc:"Your cozy neighbourhood pasta bar specializing in hand-rolled pastas and specialty coffee. Authentic Italian comfort food at its best.", sharedExp:"Authentic Italian comfort food at its best. The pasta is consistently excellent, the flavors are clean and honest.", tryThis:"Tiramisu and Parmesan Truffle Fries", img:"/places/pomodoro/photo1.webp", photos:["/places/pomodoro/photo2.webp","/places/pomodoro/photo3.webp"] },
      { id:31, name:"Hot Momos", cuisine:"Momos and Tibetan", price:"Rs.150-400 for two", rating:4.6, tag:"Best momos", hood:"Kharghar", address:"Shop No. 14, Swarna CHS, Plot No. 13/14, Sector 7, Kharghar, Panvel, Maharashtra 410210", phone:"8767681828", desc:"A popular Kharghar eatery known for its flavorful food and generous portions. Quick service, consistent quality and a loyal local following.", sharedExp:"Hands down the best momos in Kharghar! The momos here are absolutely delicious.", tryThis:"Chicken Kurkure Momos", img:"/places/hot-momos/photo1.jpg", photos:["/places/hot-momos/photo2.webp"] },
      { id:32, name:"Luuma House", cuisine:"Continental", price:"Rs.2000-3500 for two", rating:4.5, tag:"Fine dining", hood:"Vile Parle", address:"Plot No.47, Gulmohar Rd, JVPD Scheme, Vile Parle West, Mumbai 400049", phone:"7891991936", desc:"Experience elevated global dining at Luuma House - a premier fine dining restaurant and cocktail bar. A unique blend of Mediterranean, Pan-Asian, and Modern Indian cuisines with live music.", sharedExp:"My experience here was fantastic. The food was delicious and the staff was welcoming.", tryThis:"Dim Sum and Black Rice Sushi", img:"/places/luuma-house/photo1.jpg", photos:["/places/luuma-house/photo2.webp","/places/luuma-house/photo3.webp"] },
      { id:33, name:"Gattu Chinese", cuisine:"Chinese Restaurant", price:"Rs.400-800 for two", rating:4.4, tag:"Street-style Chinese", hood:"Vile Parle", address:"Shop No. 3, Iria, Irla, Vile Parle West, Mumbai 400056", phone:"8655110777", desc:"Casual locale serving street-style Chinese snacks and rice dishes. Great food quality, generous portions and very reasonably priced.", sharedExp:"Great food quality, generous portion sizes and very reasonably priced.", tryThis:"Special Fried Rice Chicken and Chicken Lollipop", img:"/places/gattu-chinese/photo2.webp", photos:["/places/gattu-chinese/photo2.webp","/places/gattu-chinese/photo3.webp"] },
      { id:34, name:"Prithvi Cafe", cuisine:"Cafe", price:"Rs.500-900 for two", rating:4.8, tag:"Hidden gem", hood:"Juhu", address:"Alongside Prithvi Theatre, 20, Juhu Rd, Janki Kutir, Juhu, Mumbai 400049", phone:"7045940218", desc:"A charming culinary haven nestled alongside the iconic Prithvi Theatre. Cafe classics, hearty meals and expertly brewed coffee in a vibrant literary atmosphere.", sharedExp:"A wonderful spot to relax and enjoy a fantastic meal. The food quality is excellent.", tryThis:"Chole Kulche, Beer Chhas and Kitkat Shake", img:"/places/prithvi-cafe/photo1.png", photos:["/places/prithvi-cafe/photo2.png","/places/prithvi-cafe/photo3.webp"] },
      { id:35, name:"Benne - Bangalore Dosa", cuisine:"South Indian", price:"Rs.200-500 for two", rating:4.7, tag:"Best South Indian", hood:"Juhu", address:"Ground floor, Nirav apartment, 1, Gulmohar Rd, Gulmohar Colony, Juhu, Mumbai 400049", phone:"", desc:"A popular minimalist South Indian eatery in Juhu famous for authentic Bengaluru-style butter dosas. The best South Indian breakfast in Juhu.", sharedExp:"Hands down the best South Indian breakfast in Juhu. The food is incredibly tasty and the quality is excellent.", tryThis:"Benne Masala Dosa", img:"/places/benne-dosa/photo2.webp", photos:["/places/benne-dosa/photo1.jpg"] },
      { id:36, name:"One8 Commune", cuisine:"Multi-cuisine Restaurant", price:"Rs.2000-3500 for two", rating:4.6, tag:"Trendy", hood:"Juhu", address:"Kishore Kumar Bunglow, 18/B, Juhu Tara Rd, Shivaji Nagr, Juhu, Mumbai 400049", phone:"8108411818", desc:"One8 Commune is known for its vibrant ambiance with eclectic decor, experimental cocktails and signature dishes like the Mushroom Googly Dimsums.", sharedExp:"Beautiful aesthetics paired with good food. Everything was plated elegantly and the ingredients tasted wonderfully fresh.", tryThis:"Mushroom Dimsums", img:"/places/one8-commune/photo2.jpg", photos:["/places/one8-commune/photo1.png"] },
      { id:37, name:"Ettarra Coffee House", cuisine:"Cafe", price:"Rs.500-900 for two", rating:4.5, tag:"South Indian coffee", hood:"Juhu", address:"Ground Floor, boutique hotel, Juhu residency, Juhu Tara, Juhu, Mumbai 400049", phone:"8655805815", desc:"South Indian filter coffee crafted to capture flavorful notes and refreshing aromatic servings with every cup. A beautifully designed space with food that matches the aesthetic.", sharedExp:"A beautifully designed space with food that matches the aesthetic. Thoughtful flavors, great presentation and a calm atmosphere.", tryThis:"Baked Soya Keema Pav", img:"/places/ettarra-coffee/photo1.jpg", photos:["/places/ettarra-coffee/photo2.jpeg"] },
      { id:38, name:"The Bombay Canteen", cuisine:"Indian", price:"Rs.2000-3000 for two", rating:4.8, tag:"Must visit", hood:"Lower Parel", address:"Unit-1, Process House, S.B. Road, Kamala Mills, Lower Parel, Mumbai 400013", phone:"8880802424", desc:"Bombay Canteen brings to you the bright and vibrant flavors of authentic Indian food. Beautifully plated and exceptionally fresh - a celebration of India's regional cuisines.", sharedExp:"Incredible food and top-tier service. The dishes are beautifully plated and taste exceptionally fresh.", tryThis:"Chilled Sea Bass Sev Puri and Coffee Rasgulla Sundae", img:"/places/bombay-canteen/photo1.jpg", photos:["/places/bombay-canteen/photo2.webp","/places/bombay-canteen/photo3.webp"] },
      { id:39, name:"Si Nonna's", cuisine:"Italian Restaurant", price:"Rs.1500-2500 for two", rating:4.5, tag:"Naples in Mumbai", hood:"Lower Parel", address:"B, Kamala Mills Compound, Shop 12 and 13, Trade World, Senapati Bapat Marg, Lower Parel, Mumbai 400013", phone:"9136693001", desc:"Si Nonna's is where the authentic taste of Naples meets your cravings. Mouthwatering Italian delights with multiple outlets across Mumbai.", sharedExp:"Delicious food, great options and multiple outlets.", tryThis:"Pizza Number 4 and Tiramisu", img:"/places/si-nonnas/photo3.webp", photos:["/places/si-nonnas/photo1.jpeg","/places/si-nonnas/photo2.jpeg"] },
      { id:40, name:"Queen Margherita", cuisine:"Italian Restaurant", price:"Rs.1200-2000 for two", rating:4.5, tag:"Wood-fired pizza", hood:"Lower Parel", address:"Neeru Silk Mills, Mathuradas Mill Compound, 11/B, Gr Floor, Lower Parel, Mumbai 400013", phone:"9137537902", desc:"Pizza, pasta and Italian food served at an informal eatery with a wood-fired oven.", sharedExp:"Fantastic spot for amazing pizza.", tryThis:"Classic Chicken Queen Margherita and Tiramisu", img:"/places/queen-margherita/photo1.webp", photos:["/places/queen-margherita/photo2.webp","/places/queen-margherita/photo3.webp"] },
      { id:41, name:"Britannia and Co.", cuisine:"Parsi", price:"Rs.800-1500 for two", rating:4.6, tag:"Parsi heritage", hood:"Fort", address:"Wakefield House, 11 16, SS Ram Gulam Marg, opp. New Indian Customs House, Ballard Estate, Fort, Mumbai 400001", phone:"02222615264", desc:"If you want a taste of Mumbai's rich culinary history, Britannia and Co. is a mandatory stop. Serving phenomenal authentic Parsi cuisine since 1923.", sharedExp:"Fantastic experience - the food is good and if you want authentic Parsi flavors then this is the place to go.", tryThis:"Mutton Berry Pulao", img:"/places/britannia/photo2.jpg", photos:["/places/britannia/photo1.webp"] },
      { id:42, name:"Mokai", cuisine:"Cafe", price:"Rs.1000-1800 for two", rating:4.5, tag:"Pinterest-worthy", hood:"Pali Hill", address:"Pali Mala Rd, Pali Hill, Mumbai 400050", phone:"9820983607", desc:"Mokai in Bandra is known for its Pinterest-y aesthetics and delectable drinks and food. Shifting the conventions of the traditional brunch system.", sharedExp:"A great blend of chic ambience and comforting food. The flavors are approachable yet elevated making it a place you'll want to revisit.", tryThis:"Laksa Curry Wontons", img:"/places/mokai/photo1.webp", photos:["/places/mokai/photo2.webp"] },
      { id:43, name:"Earth Soul Cafe", cuisine:"Cafe", price:"Rs.500-900 for two", rating:4.7, tag:"Trending", hood:"CBD Belapur", address:"Shop No. 13, Progressive's Sea Lounge, Plot No.44, Sector 15, CBD Belapur, Navi Mumbai 400614", phone:"9619409696", desc:"Earth Soul Cafe is an all-day cafe in Navi Mumbai. Fresh cold-press juices, smoothies, salads, sandwiches and always-brewing coffee. Perfect for slowing down surrounded by plants.", sharedExp:"This is the place you go when you want to slow down for a few hours. Surrounded by plants and tucked away from the city's chaos - a mini escape.", tryThis:"Pink Sauce Pasta", img:"/places/earth-soul-cafe/photo2.webp", photos:["/places/earth-soul-cafe/photo1.webp"] },
      { id:44, name:"The Kerala Table", cuisine:"Seafood Restaurant", price:"Rs.1000-1800 for two", rating:4.6, tag:"South Indian fine dining", hood:"Vashi", address:"First Floor, Palm Beach Galleria Mall, 109 and 110, Plot No. 17, Sector 19D, Vashi, Navi Mumbai 400703", phone:"9090939348", desc:"Experience true South Indian fine dining with rich flavors of Kerala food and Malabar delicacies. Kerala-style fish fry and aromatic biryani.", sharedExp:"If you're craving authentic Keralite food that feels like it was made at someone's home rather than a commercial kitchen, this is the place.", tryThis:"Pepper Garlic Chicken and Paal Porotta Prawns", img:"/places/kerala-table/photo3.webp", photos:["/places/kerala-table/photo1.jpeg","/places/kerala-table/photo2.jpg"] },
      { id:45, name:"HAV Coffee", cuisine:"Specialty Coffee Cafe", price:"Rs.400-800 for two", rating:4.5, tag:"Specialty brews", hood:"Chowpatty", address:"1, Dr N A Purandare Marg, next to Mahendra Car Showroom, Charni Road East, Chowpatty, Girgaon, Mumbai 400007", phone:"", desc:"HAV Coffee is known for premium specialty brews like the popular Spanish Latte. Artisan croissants and dedicated Jain-friendly options - perfect post-walk hangout.", sharedExp:"I absolutely enjoyed my experience here. The food was delicious and the ambience was lovely.", tryThis:"Chilli Cheese Toast and Paneer Tikka Sandwiches", img:"/places/hav-coffee/photo1.jpg", photos:["/places/hav-coffee/photo2.webp","/places/hav-coffee/photo3.webp"] },
      { id:46, name:"Shree Thaker Bhojanalay", cuisine:"Vegetarian Thali Restaurant", price:"Rs.500-900 for two", rating:4.7, tag:"Legendary thali", hood:"Marine Lines", address:"Building No 31, Purshottam Niwas, Dadiseth Agiyari Ln, Marine Lines East, Kalbadevi, Mumbai 400002", phone:"02222069916", desc:"Long-running Indian restaurant offering a selection of traditional Gujarati thalis. Renowned for exceptional thali.", sharedExp:"Renowned for its exceptional thali and the food lived up to the hype - absolutely delicious.", tryThis:"Vegetarian Gujarati Thali", img:"/places/shree-thaker/photo1.webp", photos:["/places/shree-thaker/photo2.webp"] }
    ],
    mapPlaces: [
      {id:4,name:"Leopold Cafe",rating:4.4,top:"15%",left:"55%"},{id:8,name:"Nandan Coffee",rating:4.7,top:"22%",left:"28%"},{id:11,name:"Kala Ghoda Cafe",rating:4.5,top:"28%",left:"65%"},{id:34,name:"Prithvi Cafe",rating:4.8,top:"40%",left:"32%"},{id:38,name:"The Bombay Canteen",rating:4.8,top:"50%",left:"62%"},{id:24,name:"Boojee Cafe",rating:4.6,top:"58%",left:"22%"},{id:29,name:"GIGI Bombay",rating:4.7,top:"62%",left:"66%"},{id:41,name:"Britannia and Co.",rating:4.6,top:"70%",left:"42%"},
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
      <div className="detail-hero-img-wrap">{restaurant.img ? <img src={restaurant.img} alt={restaurant.name} className="detail-hero-img"/> : <div className="detail-hero-img detail-hero-img-placeholder">📍</div>}</div>
      <div className="detail-body">
        <div className="detail-name-row">
          <div>
            <div className="detail-name">{restaurant.name}</div>
            {restaurant.hood && <div className="detail-place-area">📍 {restaurant.hood}, Mumbai</div>}
          </div>
          
        </div>
        <div className="detail-meta">{restaurant.cuisine}</div>
        <p className="detail-about">{restaurant.desc}</p>
        {shareFeedback && <div className="share-feedback">✓ {shareFeedback}</div>}

        {/* Action buttons */}
        <div className="detail-actions-row">
          {restaurant.phone && <a className="detail-act-item" href={`tel:${restaurant.phone}`}><span className="detail-act-icon">📞</span><span className="detail-act-label">Call</span></a>}
          <a className="detail-act-item" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address || restaurant.name + " " + restaurant.hood)}`} target="_blank" rel="noopener noreferrer"><span className="detail-act-icon">🗺️</span><span className="detail-act-label">Directions</span></a>
          <button className="detail-act-item" onClick={handleShare}><span className="detail-act-icon">↗</span><span className="detail-act-label">Share</span></button>
          <button className="detail-act-item" onClick={()=>onToggleSave(restaurant.name)}><span className="detail-act-icon">{isSaved ? "🔖" : "📑"}</span><span className="detail-act-label">{isSaved ? "Saved" : "Save"}</span></button>
        </div>

        {/* Address + Phone card */}
        {(restaurant.address || restaurant.phone) && (
          <div className="detail-info-card">
            {restaurant.address && <div className="detail-info-row"><span className="detail-info-icon">📍</span><span>{restaurant.address}</span></div>}
            {restaurant.address && restaurant.phone && <div className="detail-info-divider"/>}
            {restaurant.phone && <div className="detail-info-row"><span className="detail-info-icon">📞</span><span>{restaurant.phone}</span></div>}
          </div>
        )}

        {/* Curated Shared Experience from dataset */}
        {restaurant.sharedExp && (
          <>
            <div className="detail-section-title" style={{marginTop:22}}>Shared Experience</div>
            <div className="detail-shared-exp-card">
              <div className="detail-shared-exp-user">
                <div className="detail-shared-exp-avatar">{SHARED_EXP_NAMES[restaurant.id % SHARED_EXP_NAMES.length].slice(0,2).toUpperCase()}</div>
                <span className="detail-shared-exp-name">{SHARED_EXP_NAMES[restaurant.id % SHARED_EXP_NAMES.length]}</span>
              </div>
              <p className="detail-shared-exp-text">{restaurant.sharedExp}</p>
            </div>
          </>
        )}

        {/* Try These */}
        {restaurant.tryThis && (
          <>
            <div className="detail-section-title" style={{marginTop:22}}>Try These</div>
            <div className="detail-try-items">
              {restaurant.tryThis.split(' and ').map((item, i) => (
                <div key={i} className="detail-try-item">
                  {restaurant.photos[i] ? (
                    <img src={restaurant.photos[i]} alt={item.trim()} className="detail-try-img"/>
                  ) : (
                    <div className="detail-try-img detail-try-img-placeholder">🍽️</div>
                  )}
                  <div className="detail-try-label">{item.trim()}</div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="detail-divider" style={{marginTop:24}}/>

        {/* User-submitted community experiences from Supabase */}
        <div className="detail-photos-header">
          <span className="detail-section-title">Community experiences</span>
          <button className="detail-viewall" onClick={()=>setFormOpen(o=>!o)}>{formOpen ? "Cancel" : "Add yours"}</button>
        </div>
        <p className="detail-experiences-sub">Real moments from people who've been here.</p>

        {formOpen && (
          <div className="experience-form">
            {submitError && <div className="profile-save-error" style={{marginTop:0}}>⚠️ {submitError}</div>}
            <label className="experience-photo-picker">
              {photoPreview ? <img src={photoPreview} alt="" className="experience-photo-preview"/> : <span>📷 Add a photo</span>}
              <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>handlePhotoPick(e.target.files?.[0] || null)}/>
            </label>
            <input className="ob-input" style={{marginTop:10}} placeholder="Your favorite item" value={favoriteItem} onChange={e=>setFavoriteItem(e.target.value)}/>
            <textarea className="ob-input experience-textarea" style={{marginTop:10}} placeholder="What was it like?" value={note} onChange={e=>setNote(e.target.value)} rows={3}/>
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

        <div style={{height:90}}/>
      </div>

      {/* Sticky Share CTA at bottom */}
      <div className="detail-share-cta" onClick={()=>setFormOpen(o=>!o)}>
        <span className="detail-share-cta-icon">✏️</span>
        <div><div className="detail-share-cta-title">Share your experience</div><div className="detail-share-cta-sub">Help others discover great places in the city.</div></div>
        <span className="detail-share-cta-arrow">›</span>
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
      {addOpen&&(<div className="modal-bg" onClick={()=>setAddOpen(false)}><div className="modal-sheet add-sheet" onClick={e=>e.stopPropagation()}><div className="filter-header"><button className="filter-close" onClick={()=>setAddOpen(false)}>✕</button><div className="filter-title">Add a new place</div><div/></div><div className="add-photo-area"><span className="add-photo-icon">📷</span><div className="add-photo-label">Add photos<br/><span style={{fontSize:12,color:"#999"}}>(Up to 5 photos)</span></div></div>{[["Place name*","text","e.g. Your Place Name","name"],["Address*","text","e.g. Street, Area, City","address"],["Contact number","tel","e.g. 98765 43210","phone"]].map(([lbl,type,ph,key])=><div key={key} className="add-field"><label className="add-label">{lbl}</label><input className="ob-input" type={type} placeholder={ph} value={addForm[key]} onChange={e=>setAddForm({...addForm,[key]:e.target.value})}/></div>)}<div className="add-field"><label className="add-label">Cuisine*</label><select className="ob-input ob-select" value={addForm.cuisine} onChange={e=>setAddForm({...addForm,cuisine:e.target.value})}><option value="">Select cuisine</option>{CUISINES_LIST.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}</select></div><button className="add-location-btn">📍 Use current location</button><div className="add-field"><label className="add-label">Share more about this place</label><input className="ob-input" placeholder="Share more about this place" value={addForm.note} onChange={e=>setAddForm({...addForm,note:e.target.value})}/></div><button className="filter-apply" onClick={()=>setAddOpen(false)}>Submit</button></div></div>)}
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

// Maps "Explore food around you" category cards to substrings matched against a place's cuisine field
const FOOD_CATEGORY_TAG_MAP = {
  Cafés: ["café","cafe","coffee","tea house"],
  "Street Food": ["street food","vada pav","fast food","chaat","pav bhaji"],
  Bakeries: ["bakery","pâtisserie","patisserie"],
  Desserts: ["ice cream","dessert","mithai"],
  // "Restaurants" has no map — it's the catch-all for anything not matched above
};
const FOOD_CATEGORY_ICONS = {
  Cafés: "☕", Restaurants: "🍽️", "Street Food": "🛒", Bakeries: "🧁", Desserts: "🍰", More: "⊞",
};
function matchesFoodCategory(place, category) {
  const subs = FOOD_CATEGORY_TAG_MAP[category];
  if (!subs) return !Object.values(FOOD_CATEGORY_TAG_MAP).flat().some(s => place.cuisine.toLowerCase().includes(s)); // Restaurants = catch-all
  return subs.some(s => place.cuisine.toLowerCase().includes(s));
}

// Maps "Explore cuisines" circles to substrings matched against a place's cuisine field
const CIRCLE_TAG_MAP = {
  Indian: ["indian","punjabi","maharashtrian","parsi","gujarati","rajasthani","north indian","south indian","tandoor","thali","seafood","mangalorean","goan","manipuri","street food","mithai"],
  Italian: ["italian","pizza","continental"],
  Chinese: ["chinese"],
  Mexican: ["mexican"],
  Japanese: ["japanese","sushi","sizzler"],
};
function matchesCircle(place, circle) {
  const subs = CIRCLE_TAG_MAP[circle] || [];
  return subs.some(s => place.cuisine.toLowerCase().includes(s));
}

function FoodScreen({ city, onOpenDetail, userCuisines, userBudget, userId, userName }) {
  const [likes, setLikes] = useState({});
  const [activeArea, setActiveArea] = useState("All");
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [communityPlaces, setCommunityPlaces] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [submitOpen, setSubmitOpen] = useState(false);
  const cd = CITIES[city];

  useEffect(() => {
    let active = true;
    getCommunityPlaces(city)
      .then(data => { if (active) setCommunityPlaces(data || []); })
      .catch(e => console.error("Failed to load community places:", e))
      .finally(() => { if (active) setCommunityLoading(false); });
    return () => { active = false; };
  }, [city]);

  const normalizedCommunity = communityPlaces.map(p => ({
    id: `community-${p.id}`, name: p.name, cuisine: p.cuisine || "Community pick",
    hood: p.area, desc: p.description || `Added by ${p.submitter_name}.`,
    img: p.photo_url || null, rating: null, phone: null, address: null, price: null,
    isCommunity: true, submitterName: p.submitter_name, sharedExp: p.description, tryThis: null,
  }));

  const cityAreas = ["All", ...Array.from(new Set(cd.food.map(r => r.hood)))];

  const matchesSearch = (p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return (p.name||"").toLowerCase().includes(q) || (p.cuisine||"").toLowerCase().includes(q) || (p.hood||"").toLowerCase().includes(q);
  };
  const matchesArea = (p) => activeArea === "All" || p.hood === activeArea;

  const filtered = cd.food.filter(r => matchesArea(r) && matchesSearch(r) && (!activeCategory || matchesFoodCategory(r, activeCategory)));
  const hasPrefs = userCuisines && userCuisines.length > 0;
  const sorted = hasPrefs
    ? [...filtered].sort((a,b) => scoreFoodPlace(b,userCuisines,userBudget) - scoreFoodPlace(a,userCuisines,userBudget))
    : filtered;

  const recommended = sorted.slice(0, 10);
  const exploreList = sorted.slice(10);
  const allExplore = [...exploreList, ...normalizedCommunity.filter(r => matchesArea(r) && matchesSearch(r))];

  return (
    <div className="screen-body" style={{paddingBottom:80}}>

      {/* Row 1: area dropdown + search bar */}
      <div className="food-top-row" data-tour="food-search">
        <div className="food-area-dropdown-wrap">
          <select className="food-area-dropdown" value={activeArea} onChange={e=>setActiveArea(e.target.value)}>
            {cityAreas.map(a => <option key={a} value={a}>{a === "All" ? "All areas" : a}</option>)}
          </select>
        </div>
        <div className="food-search-inner">
          <span className="food-search-icon">🔍</span>
          <input className="food-search-input" placeholder="Search food places" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
          {searchQuery && <button className="food-search-clear" onClick={()=>setSearchQuery("")}>×</button>}
        </div>
      </div>

      {/* Hero banner */}
      <div className="food-hero-banner">
        <div className="food-hero-title">Discover the city's best places</div>
        <div className="food-hero-sub">Community driven shared experiences</div>
      </div>

      {/* Category cards */}
      <div className="food-cat-section" data-tour="food-categories">
        <div className="food-cat-row">
          {["Cafés","Restaurants","Street Food","Bakeries","Desserts","More"].map(cat => (
            <button key={cat} className={`food-cat-card ${activeCategory===cat?"active":""}`}
              onClick={()=> cat==="More" ? null : setActiveCategory(activeCategory===cat ? null : cat)}>
              <span className="food-cat-icon">{FOOD_CATEGORY_ICONS[cat]}</span>
              <span className="food-cat-label">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations — top 10, horizontally scrollable */}
      <div className="section-hdr" data-tour="food-recommended" style={{marginTop:4}}>
        <div className="sec-title">Recommendations for you</div>
      </div>
      <div className="food-hscroll">
        {recommended.length === 0 && <div className="food-empty-state">No matches{searchQuery ? ` for "${searchQuery}"` : ""}{activeArea!=="All" ? ` in ${activeArea}` : ""}.</div>}
        {recommended.map((r, idx) => (
          <div key={r.id} className="food-card" data-tour={idx===0?"food-first-card":undefined} onClick={()=>onOpenDetail(r)}>
            <div className="food-card-img-wrap">
              {r.img ? <img src={r.img} alt={r.name} className="food-card-img"/> : <div className="food-card-img food-card-img-placeholder">🍽️</div>}
              <button className="heart-btn" onClick={e=>{e.stopPropagation();setLikes(p=>({...p,[r.id]:!p[r.id]}))}}>{likes[r.id]?"❤️":"🤍"}</button>
            </div>
            <div className="food-card-body">
              <div className="food-name">{r.name}</div>
              <div className="food-card-hood">📍 {r.hood}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Explore Experiences — vertical list matching reference */}
      {allExplore.length > 0 && (
        <>
          <div className="sec-title" style={{marginTop:28,marginBottom:14}} data-tour="food-community">Explore Experiences</div>
          {allExplore.map(r => (
            <div key={r.id} className="exp-list-row" onClick={()=>onOpenDetail(r)}>
              <div className="exp-list-img-wrap">
                {r.img ? <img src={r.img} alt={r.name} className="exp-list-img"/> : <div className="exp-list-img exp-list-img-placeholder">🍽️</div>}
              </div>
              <div className="exp-list-body">
                <div className="exp-list-top">
                  <span className="exp-list-name">{r.name}</span>
                  <span className="exp-list-cuisine">{r.cuisine}</span>
                </div>
                <div className="exp-list-area">📍 {r.hood}</div>
                {r.sharedExp && <p className="exp-list-exp">{r.sharedExp.length > 90 ? r.sharedExp.slice(0,90)+"…" : r.sharedExp}</p>}
                {r.tryThis && <div className="exp-list-try"><span className="exp-list-try-label">Try:</span> {r.tryThis.split(" and ").slice(0,2).join(" and ")}</div>}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Sticky Share CTA */}
      <div className="food-share-sticky" onClick={()=>setSubmitOpen(o=>!o)}>
        <span className="food-share-sticky-icon">✏️</span>
        <div>
          <div className="food-share-sticky-title">Share Your Experience</div>
          <div className="food-share-sticky-sub">Help others discover great places in the city.</div>
        </div>
        <span className="food-share-sticky-plus">{submitOpen ? "×" : "+"}</span>
      </div>

      {/* Bottom sheet */}
      {submitOpen && (
        <ShareBottomSheet
          city={city}
          userId={userId}
          userName={userName}
          onClose={()=>setSubmitOpen(false)}
          onSubmitted={place => { setCommunityPlaces(prev => [place, ...prev]); setSubmitOpen(false); }}
          onExperienceShared={()=>setSubmitOpen(false)}
        />
      )}
    </div>
  );
}

function ShareBottomSheet({ city, userId, userName, onClose, onSubmitted, onExperienceShared }) {
  const [activeTab, setActiveTab] = useState("experience"); // "experience" | "place"
  const cd = CITIES[city];

  return (
    <div className="share-sheet-overlay" onClick={onClose}>
      <div className="share-sheet" onClick={e=>e.stopPropagation()}>
        <div className="share-sheet-handle"/>
        <div className="share-sheet-tabs">
          <button className={`share-sheet-tab ${activeTab==="experience"?"active":""}`} onClick={()=>setActiveTab("experience")}>Share an Experience</button>
          <button className={`share-sheet-tab ${activeTab==="place"?"active":""}`} onClick={()=>setActiveTab("place")}>Add a New Place</button>
        </div>
        {activeTab === "experience"
          ? <ShareExperienceForm city={city} userId={userId} userName={userName} onDone={onExperienceShared}/>
          : <SubmitPlaceForm city={city} userId={userId} userName={userName} onSubmitted={onSubmitted}/>
        }
      </div>
    </div>
  );
}

function ShareExperienceForm({ city, userId, userName, onDone }) {
  const cd = CITIES[city];
  const [selectedPlace, setSelectedPlace] = useState("");
  const [note, setNote] = useState("");
  const [favoriteItem, setFavoriteItem] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!userId) { setError("Sign in to share your experience."); return; }
    if (!selectedPlace) { setError("Please select a food place first."); return; }
    if (!photoFile && !note.trim() && !favoriteItem.trim()) { setError("Add a photo, a note, or a favorite item."); return; }
    setSubmitting(true); setError("");
    try {
      let photoUrl = null;
      if (photoFile) photoUrl = await uploadFoodExperiencePhoto(userId, photoFile);
      await shareFoodExperience(userId, userName || "Someone", selectedPlace, { photoUrl, note: note.trim(), favoriteItem: favoriteItem.trim() });
      setDone(true);
      setTimeout(onDone, 1200);
    } catch (e) {
      console.error("Failed to share experience:", e);
      setError("Couldn't share that — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return <div style={{textAlign:"center",padding:"24px 0"}}><div style={{fontSize:32}}>✓</div><div style={{fontWeight:700,marginTop:6}}>Thanks for sharing!</div></div>;

  return (
    <div style={{paddingBottom:8}}>
      {error && <div className="profile-save-error">⚠️ {error}</div>}
      <select className="ob-input ob-select" style={{marginBottom:10}} value={selectedPlace} onChange={e=>setSelectedPlace(e.target.value)}>
        <option value="">Select a place...</option>
        {cd.food.map(p => <option key={p.id} value={p.name}>{p.name} — {p.hood}</option>)}
      </select>
      <label className="experience-photo-picker">
        {photoPreview ? <img src={photoPreview} alt="" className="experience-photo-preview"/> : <span>📷 Add a photo</span>}
        <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];setPhotoFile(f||null);setPhotoPreview(f?URL.createObjectURL(f):null);}}/>
      </label>
      <input className="ob-input" style={{marginTop:10}} placeholder="Your favorite item" value={favoriteItem} onChange={e=>setFavoriteItem(e.target.value)}/>
      <textarea className="ob-input experience-textarea" style={{marginTop:10}} placeholder="What was it like?" value={note} onChange={e=>setNote(e.target.value)} rows={3}/>
      <button className="filter-apply" style={{marginTop:12}} disabled={submitting} onClick={handleSubmit}>{submitting ? "Sharing…" : "Share with the community"}</button>
    </div>
  );
}

function SubmitPlaceForm({ city, userId, userName, onSubmitted }) {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handlePhotoPick = (file) => {
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async () => {
    if (!userId) { setError("Sign in to add a place."); return; }
    if (!name.trim() || !area.trim()) { setError("Name and area are required."); return; }
    setSubmitting(true);
    setError("");
    try {
      let photoUrl = null;
      if (photoFile) photoUrl = await uploadCommunityPlacePhoto(userId, photoFile);
      const place = await submitCommunityPlace(userId, userName || "Someone", {
        city, name: name.trim(), area: area.trim(), cuisine: cuisine.trim(), description: description.trim(), photoUrl,
      });
      setDone(true);
      onSubmitted(place);
    } catch (e) {
      console.error("Failed to submit place:", e);
      setError("Couldn't submit that — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="experience-form" style={{textAlign:"center",padding:24}}>
        <div style={{fontSize:32}}>✓</div>
        <div style={{fontWeight:700,marginTop:6}}>Added! Thanks for sharing.</div>
        <p style={{fontSize:13,color:"var(--text3)",marginTop:4}}>Your place is now visible to the community.</p>
      </div>
    );
  }

  return (
    <div className="experience-form">
      {error && <div className="profile-save-error" style={{marginTop:0}}>⚠️ {error}</div>}
      <label className="experience-photo-picker">
        {photoPreview ? <img src={photoPreview} alt="" className="experience-photo-preview"/> : <span>📷 Add a photo</span>}
        <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>handlePhotoPick(e.target.files?.[0] || null)}/>
      </label>
      <input className="ob-input" style={{marginTop:10}} placeholder="Place name" value={name} onChange={e=>setName(e.target.value)}/>
      <input className="ob-input" style={{marginTop:10}} placeholder="Area / neighborhood" value={area} onChange={e=>setArea(e.target.value)}/>
      <input className="ob-input" style={{marginTop:10}} placeholder="Cuisine" value={cuisine} onChange={e=>setCuisine(e.target.value)}/>
      <textarea className="ob-input experience-textarea" style={{marginTop:10}} placeholder="What's your experience there?" value={description} onChange={e=>setDescription(e.target.value)} rows={3}/>
      <button className="filter-apply" style={{marginTop:12}} disabled={submitting} onClick={handleSubmit}>{submitting ? "Adding…" : "Add this place"}</button>
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
      {addOpen&&(<div className="modal-bg" onClick={()=>setAddOpen(false)}><div className="modal-sheet add-sheet" onClick={e=>e.stopPropagation()}><div className="filter-header"><button className="filter-close" onClick={()=>setAddOpen(false)}>✕</button><div className="filter-title">Add a new place</div><div/></div><div className="add-photo-area"><span className="add-photo-icon">📷</span><div className="add-photo-label">Add photos<br/><span style={{fontSize:12,color:"#999"}}>(Up to 5 photos)</span></div></div>{[["Place name*","text","e.g. Your Place Name","name"],["Address*","text","e.g. Street, Area, City","address"],["Contact number","tel","e.g. 98765 43210","phone"]].map(([lbl,type,ph,key])=><div key={key} className="add-field"><label className="add-label">{lbl}</label><input className="ob-input" type={type} placeholder={ph} value={addForm[key]} onChange={e=>setAddForm({...addForm,[key]:e.target.value})}/></div>)}<button className="add-location-btn">📍 Use current location</button><div className="add-field"><label className="add-label">Share more about this place</label><input className="ob-input" placeholder="Share more about this place" value={addForm.note} onChange={e=>setAddForm({...addForm,note:e.target.value})}/></div><button className="filter-apply" onClick={()=>setAddOpen(false)}>Submit</button></div></div>)}
    </div>
  );
}

// ─── DISCOVERY SCREEN (unchanged structure) ───────────────────────────────────
function DiscoveryScreen({ city, userCuisines, userBudget, userId, userName, savedPlaces, onToggleSave }) {
  const [subTab, setSubTab] = useState("food");
  const [detailOpen, setDetailOpen] = useState(null);
  if (detailOpen) return <FoodDetail restaurant={detailOpen} onBack={()=>setDetailOpen(null)} userId={userId} userName={userName} isSaved={(savedPlaces||[]).includes(detailOpen.name)} onToggleSave={onToggleSave}/>;
  return (
    <div className="discovery-root">
      <div className="disc-tab-row">
        {[["food","🍽️","Food Places"],["events","🎟️","Events"],["places","🌳","Third Places"]].map(([id,icon,lbl])=>(
          <button key={id} className={`disc-tab ${subTab===id?"active":""}`} onClick={()=>setSubTab(id)}>
            <span className="disc-tab-icon">{icon}</span>
            <span className="disc-tab-label">{lbl}</span>
          </button>
        ))}
      </div>
      {subTab==="food"   && <FoodScreen onOpenDetail={setDetailOpen} city={city} userCuisines={userCuisines} userBudget={userBudget} userId={userId} userName={userName}/>}
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
  const [resetting, setResetting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
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
        setIdx(0);
      })
      .catch(e => { console.error("Failed to load people:", e); if (active) setLoadError("Couldn't load people right now."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [city, userId, reloadKey]);


  const current = people[idx];
  const canGoBack = idx > 0;

  const passProfileAndNext = async () => {
    if (!current) return;
    setIdx(i => i+1); setPhotoIdx(0);
    try { await passProfile(userId, current.id); } catch (e) { console.error("Pass failed:", e); }
  };

  const goToPrevious = () => {
    if (!canGoBack) return;
    setIdx(i => i-1); setPhotoIdx(0);
  };

  const browseAgain = async () => {
    setResetting(true);
    try {
      await resetPasses(userId);
      setReloadKey(k => k+1);
    } catch (e) {
      console.error("Failed to reset passes:", e);
      setLoadError("Couldn't reset your browsing history — please try again.");
    } finally {
      setResetting(false);
    }
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
          <div className="conn-card" data-tour="conn-card">
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
            <div className="conn-nav-row">
              <button className="conn-back-btn" disabled={!canGoBack} onClick={goToPrevious}>‹ Back</button>
              <button className="conn-pass-btn" onClick={passProfileAndNext}>Pass ›</button>
            </div>
          </div>
        </div>
      ) : (!loading && !loadError && (
        <div className="conn-empty">
          <div style={{fontSize:42}}>🎉</div>
          <div className="conn-empty-title">You're all caught up!</div>
          <p style={{color:"var(--text3)",fontSize:13,marginTop:6}}>No more registered people to show in {cd.label} right now.</p>
          <button className="conn-browse-again-btn" disabled={resetting} onClick={browseAgain}>{resetting ? "Resetting…" : "↻ Browse profiles again"}</button>
        </div>
      ))}
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

function ProfileScreen({ user, userId, onSignOut, onUpdateProfile, onReplayTour }) {
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
      <div className="profile-section" data-tour="profile-food-prefs">
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

      {onReplayTour && <button className="profile-replay-tour" onClick={onReplayTour}>↻ Replay the tour</button>}
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
  const [tourStep, setTourStep] = useState(null); // null = not running
  const [screen, setScreen] = useState("landing"); // landing | signin | onboarding | app

  useEffect(() => {
    // Auto-start for any completed profile that hasn't explicitly finished the tour.
    // Catches both tour_completed=false (new users, migration ran) and tour_completed=null
    // (migration not yet run, or users who signed up before this feature).
    if (profile?.profile_complete && !profile?.tour_completed && tourStep === null) {
      setTourStep(0);
    }
  }, [profile?.profile_complete, profile?.tour_completed]);

  const finishTour = async () => {
    setTourStep(null);
    if (session?.user?.id) {
      try { await updateProfile(session.user.id, { tour_completed: true }); await refreshProfile(); }
      catch (e) { console.error("Failed to save tour completion:", e); }
    }
  };

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
        tour_completed: profile.tour_completed,
      };
      return (
        <div className="app-root">
          <header className="topnav">
            <div className="topnav-inner">
              <NearMetLogo size={26}/>
              <div className="topnav-right">
                <span className="city-pill">📍 {user.city==="nyc"?"NYC":"Mumbai"}</span>
                <button data-tour="nav-messages" className="topnav-msg-btn" onClick={()=>setMessagesOpen(true)} title="Messages">💬</button>
                <div className="user-chip">{(user.name||"U").slice(0,2).toUpperCase()}</div>
              </div>
            </div>
          </header>
          <nav className="section-tab-bar">
            {[["connection","👥","Connections"],["discovery","🍽️","Food Places"],["events","🗓","Events"],["profile","👤","Profile"]].map(([id,icon,lbl])=>(
              <button key={id} data-tour={`nav-${id}`} className={`section-tab ${tab===id?"active":""}`} onClick={()=>setTab(id)}>
                <span className="section-tab-icon">{icon}</span>
                <span className="section-tab-label">{lbl}</span>
              </button>
            ))}
          </nav>
          {messagesOpen && <MessagesPanel userId={session.user.id} onClose={()=>setMessagesOpen(false)}/>}
          {tourStep !== null && (
            <TourOverlay
              stepIndex={tourStep}
              onNext={()=>{ if (tourStep >= TOUR_STEPS.length-1) finishTour(); else setTourStep(s=>s+1); }}
              onBack={()=>setTourStep(s=>Math.max(0,s-1))}
              onSkip={finishTour}
            />
          )}
          <main className="site-main">
            {tab==="discovery"  && <DiscoveryScreen city={user.city} userCuisines={user.cuisines} userBudget={user.budget} userId={session.user.id} userName={user.name} savedPlaces={user.saved_food_places} onToggleSave={async(name)=>{ const cur=user.saved_food_places||[]; const next=cur.includes(name)?cur.filter(n=>n!==name):[...cur,name]; try{ await updateProfile(session.user.id,{saved_food_places:next}); await refreshProfile(); }catch(e){ console.error("Save toggle failed:",e); } }}/>}
            {tab==="events"     && <EventsMapScreen city={user.city}/>}
            {tab==="connection" && <ConnectionScreen city={user.city} userId={session.user.id} me={user}/>}
            {tab==="profile"    && <ProfileScreen user={user} userId={session.user.id} onSignOut={handleSignOut} onUpdateProfile={async(updates)=>{ await updateProfile(session.user.id, updates); await refreshProfile(); }} onReplayTour={()=>setTourStep(0)}/>}
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
            <div className="topnav-right">
              <span className="city-pill">📍 {localUser.city==="nyc"?"NYC":"Mumbai"}</span>
              <button data-tour="nav-messages" className="topnav-msg-btn" disabled title="Sign in to use messaging" onClick={()=>alert("Messaging needs a real account — sign up to chat with people.")}>💬</button>
              <div className="user-chip">{(localUser.name||"U").slice(0,2).toUpperCase()}</div>
            </div>
          </div>
        </header>
        <nav className="section-tab-bar">
          {[["connection","👥","Connections"],["discovery","🍽️","Food Places"],["events","🗓","Events"],["profile","👤","Profile"]].map(([id,icon,lbl])=>(
            <button key={id} data-tour={`nav-${id}`} className={`section-tab ${tab===id?"active":""}`} onClick={()=>setTab(id)}>
              <span className="section-tab-icon">{icon}</span>
              <span className="section-tab-label">{lbl}</span>
            </button>
          ))}
        </nav>
        {tourStep !== null && (
          <TourOverlay
            stepIndex={tourStep}
            onNext={()=>{ if (tourStep >= TOUR_STEPS.length-1) setTourStep(null); else setTourStep(s=>s+1); }}
            onBack={()=>setTourStep(s=>Math.max(0,s-1))}
            onSkip={()=>setTourStep(null)}
          />
        )}
        <main className="site-main">
          {tab==="discovery"  && <DiscoveryScreen city={localUser.city} userCuisines={localUser.cuisines||[]} userBudget={localUser.budget||"flexible"} userId={null} userName={localUser.name} savedPlaces={localUser.saved_food_places||[]} onToggleSave={(name)=>{ setLocalUser(u=>{ const cur=u.saved_food_places||[]; const next=cur.includes(name)?cur.filter(n=>n!==name):[...cur,name]; return {...u, saved_food_places:next}; }); }}/>}
          {tab==="events"     && <EventsMapScreen city={localUser.city}/>}
          {tab==="connection" && <ConnectionScreen city={localUser.city} userId={null} me={localUser}/>}
          {tab==="profile"    && <ProfileScreen user={localUser} userId={null} onSignOut={()=>{setLocalUser(null);setScreen("landing");}} onUpdateProfile={async(updates)=>{ setLocalUser(u=>({...u,...updates})); }} onReplayTour={()=>setTourStep(0)}/>}
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