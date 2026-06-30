// ─────────────────────────────────────────────────────────────────────────────
// App.jsx  — NearMet
// Sections:
//   • Connections → "For You" (one profile at a time, Back/Next, full profile view)
//                   "By Activity" (grouped by shared Things-to-Do)
//   • Places to Explore — curated city spots, user submissions require approval
//   • Food Places — recommendations, share experience, add a new place (requires approval)
//   • What's Happening — community-posted events (house parties, meetups, etc.)
//                         with photo, contact & payment info, interest sign-up;
//                         submissions require approval before going live
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import "./App.css";
import { useAuth } from "./context/AuthContext.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import {
  signOut, updateProfile, uploadProfilePhoto,
  uploadFoodExperiencePhoto, getFoodExperiences, shareFoodExperience,
  deleteFoodExperience, getPeople, passProfile, resetPasses,
  getOrCreateConnection, getConnections, getMessages, sendMessage,
  getCommunityPlaces, uploadCommunityPlacePhoto, submitCommunityPlace,
  getCommunityEvents, submitCommunityEvent, uploadEventPhoto,
  toggleCommunityEventInterest, getCommunityEventInterestCount,
} from "./lib/supabase.js";

// ─── LOGO ────────────────────────────────────────────────────────────────────
function NearMetLogo({ size = 28, dark = false }) {
  return (
    <span className="nm-logo" style={{ fontSize: size }}>
      <span style={{ color: dark ? "#f5f5f0" : "#1a2e1a" }}>Near</span>
      <span style={{ color: dark ? "#8aad6e" : "#2d6a2d" }}>Met</span>
    </span>
  );
}

// ─── TOUR ────────────────────────────────────────────────────────────────────
const TOUR_STEPS = [
  { icon: "👋", title: "Welcome to NearMet", body: "Quick tour — find people who want to do the same things as you, discover food spots worth trying, and explore the best of your city." },
  { icon: "👥", title: "Connections — For You", body: "Browse one person at a time. Scroll through their full profile — interests, things they want to do, food and city picks. Message anyone you resonate with." },
  { icon: "🎯", title: "Connections — By Activity", body: "Instead of creating events, we group people by what they already want to do. Want to go trekking? Open By Activity and instantly see everyone who's already up for it." },
  { icon: "🏙️", title: "Places to Explore", body: "A curated guide to the best spots in your city — beaches, parks, neighbourhoods, art lanes, and hidden gems. Users add their own picks too." },
  { icon: "🍽️", title: "Food Places", body: "Community-driven food recommendations with real shared experiences, photos, and tips on what to order." },
  { icon: "✅", title: "You're set!", body: "The more you fill in your profile — especially Things I Want To Do — the better your matches get. You can replay this tour from your profile any time." },
];

function TourOverlay({ stepIndex, onNext, onBack, onSkip }) {
  const step = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;
  const progress = ((stepIndex + 1) / TOUR_STEPS.length) * 100;
  return (
    <div className="tour-modal-bg">
      <div className="tour-modal">
        <div className="tour-progress-bar"><div className="tour-progress-fill" style={{ width: `${progress}%` }} /></div>
        <div className="tour-step-icon">{step.icon}</div>
        <div className="tour-card-step">{stepIndex + 1} / {TOUR_STEPS.length}</div>
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

// ── Places to Explore data ───────────────────────────────────────────────────
const PLACES_TO_EXPLORE = {
  mumbai: [

    // ── BEACHES ──────────────────────────────────────────────────────────────

    { id: 1, name: "Juhu Beach", area: "Juhu", category: "Beach",
      tag: "Mumbai's favourite beach", address: "Juhu Beach, Juhu Tara Road, Juhu, Mumbai 400049",
      desc: "Mumbai's most famous beach — chaotic, colourful and completely alive. Best in the early mornings or at sunset when the vendors set up and the city exhales.",
      img: "/places-explore/juhu-beach/photo1.jpeg",
      photos: ["/places-explore/juhu-beach/photo2.webp", "/places-explore/juhu-beach/photo3.webp", "/places-explore/juhu-beach/photo4.jpeg"],
      tags: ["Beach", "Sunset", "Street food"] },

    { id: 2, name: "Versova Beach", area: "Andheri West", category: "Beach",
      tag: "Community cleanup success story", address: "Versova Beach, Juhu Versova Link Road, Andheri West, Mumbai 400061",
      desc: "Once Mumbai's cleanest beach after a celebrated community cleanup. A quieter stretch with fishing boats, fresh seafood nearby, and a strong local neighbourhood feel.",
      img: "/places-explore/versova-beach/photo1.jpg",
      photos: ["/places-explore/versova-beach/photo2.jpeg"],
      tags: ["Beach", "Peaceful", "Local"] },

    { id: 3, name: "Dadar Chowpatty", area: "Dadar West", category: "Beach",
      tag: "Sunset & street food", address: "Dadar Chowpatty Beach, Kirti College Lane, Prabhadevi, Mumbai 400028",
      desc: "A lively neighbourhood beach in the heart of the city. Perfect for an evening walk — grab bhel puri or pav bhaji from the stalls, watch the sunset and feel the city slow down.",
      img: "/places-explore/dadar-chowpatty/photo1.jpg",
      photos: ["/places-explore/dadar-chowpatty/photo2.jpg", "/places-explore/dadar-chowpatty/photo3.jpg"],
      tags: ["Beach", "Sunset", "Street food"] },

    { id: 4, name: "Aksa Beach", area: "Malad West", category: "Beach",
      tag: "Quiet escape up north", address: "Aksa Village, Malad West, Mumbai 400095",
      desc: "One of the cleaner and more serene beaches in Mumbai. Popular with locals who make the trip up north for weekend mornings. Less crowded than Juhu with a real village feel.",
      img: "/places-explore/aksa-beach/photo1.jpg",
      photos: ["/places-explore/aksa-beach/photo2.webp", "/places-explore/aksa-beach/photo3.webp"],
      tags: ["Beach", "Peaceful", "Morning walk"] },

    { id: 5, name: "Manori Beach", area: "Malad West", category: "Beach",
      tag: "Hidden gem", address: "Manori Gorai Road, Manori Village, Malad West, Mumbai 400095",
      desc: "A secluded beach village accessible by ferry — one of Mumbai's best kept secrets. Low footfall, fishing community, and a completely different pace of life from the city.",
      img: "/places-explore/manori-beach/photo1.jpg",
      photos: ["/places-explore/manori-beach/photo2.avif", "/places-explore/manori-beach/photo3.jpg"],
      tags: ["Beach", "Hidden gem", "Ferry ride"] },

    { id: 6, name: "Madh Island Beach", area: "Malad West", category: "Beach",
      tag: "Scenic island getaway", address: "Madh Island Beach, Madh–Marve Road, Malad West, Mumbai 400061",
      desc: "A semi-island with a long stretch of beach, small resorts and seafood shacks. Reached via a short ferry ride — feels miles away from Mumbai even though it isn't.",
      img: "/places-explore/madh-island-beach/photo1.jpeg",
      photos: ["/places-explore/madh-island-beach/photo2.jpeg"],
      tags: ["Beach", "Ferry ride", "Seafood"] },

    { id: 7, name: "Gorai Beach", area: "Borivali West", category: "Beach",
      tag: "Near Essel World", address: "Gorai Beach, Gorai Road, Borivali West, Mumbai 400091",
      desc: "A wide sandy beach at the northern tip of Mumbai, also home to the Global Pagoda and Essel World. Popular for weekend picnics and a rare chance to find quiet patches of open shore.",
      img: "/places-explore/gorai-beach/photo1.webp",
      photos: ["/places-explore/gorai-beach/photo2.webp", "/places-explore/gorai-beach/photo3.webp", "/places-explore/gorai-beach/photo4.webp"],
      tags: ["Beach", "Picnic", "Weekend trip"] },

    { id: 8, name: "Uran Beach", area: "Navi Mumbai", category: "Beach",
      tag: "Off the beaten path", address: "Uran Beach, Kathe Aali, Nagaon, Uran, Navi Mumbai 400702",
      desc: "A rarely visited beach across the harbour in Navi Mumbai — completely unspoiled, dramatic views of the sea, and almost no crowds. Worth the trip for anyone who wants the real coastline.",
      img: "/places-explore/uran-beach/photo1.jpeg",
      photos: ["/places-explore/uran-beach/photo2.webp"],
      tags: ["Beach", "Off the beaten path", "Navi Mumbai"] },

    { id: 9, name: "Alibaug Beach", area: "Alibaug, Raigad", category: "Beach",
      tag: "Best day trip from Mumbai", address: "Alibaug Beach, Alibaug, Raigad District, Maharashtra 402201",
      desc: "The quintessential Mumbai day trip — a ferry from Gateway of India to Alibaug. Clean beach, the iconic Kolaba Fort in the sea, fresh seafood, and a proper escape from the city.",
      img: "/places-explore/alibaug-beach/photo1.jpeg",
      photos: ["/places-explore/alibaug-beach/photo2.jpeg"],
      tags: ["Beach", "Day trip", "Ferry ride"] },

    // ── PROMENADES & LANDMARKS ────────────────────────────────────────────────

    { id: 10, name: "Marine Drive", area: "South Mumbai", category: "Promenade",
      tag: "The Queen's Necklace", address: "Netaji Subhash Chandra Bose Road, South Mumbai 400020",
      desc: "Mumbai's beloved 3.6 km sea-facing promenade. At night the street lights curve into a perfect arc — giving it the name Queen's Necklace. Best experienced at sunset or late at night.",
      img: "/places-explore/marine-drive/photo1.jpg",
      photos: ["/places-explore/marine-drive/photo2.jpeg", "/places-explore/marine-drive/photo3.jpeg", "/places-explore/marine-drive/photo4.jpeg"],
      tags: ["Promenade", "Sunset", "Night walk"] },

    // ── PARKS & NATURE ────────────────────────────────────────────────────────

    { id: 11, name: "Sanjay Gandhi National Park", area: "Borivali East", category: "Nature",
      tag: "Forest inside the city", address: "Sanjay Gandhi National Park, Borivali East, Mumbai 400066",
      desc: "A 104 sq km forest sitting inside one of the world's most densely populated cities. Home to leopards, the ancient Kanheri Caves, butterflies, and miles of trekking trails.",
      img: "/places-explore/sanjay-gandhi-np/photo1.avif",
      photos: ["/places-explore/sanjay-gandhi-np/photo2.jpg", "/places-explore/sanjay-gandhi-np/photo3.jpg", "/places-explore/sanjay-gandhi-np/photo4.jpeg"],
      tags: ["Nature", "Trekking", "Borivali"] },

    { id: 12, name: "Malabar Hill Elevated Nature Trail", area: "Malabar Hill", category: "Nature",
      tag: "Best urban trek", address: "Siri Road, Near Kamala Nehru Park, Walkeshwar, Malabar Hill, Mumbai 400006",
      desc: "A beautiful elevated walking trail through forest cover in the heart of South Mumbai. Connects Kamala Nehru Park to the Banganga Tank area — one of Mumbai's best urban walking experiences.",
      img: "/places-explore/malabar-hill-trail/photo1.webp",
      photos: ["/places-explore/malabar-hill-trail/photo2.jpeg"],
      tags: ["Nature", "Walking trail", "South Mumbai"] },

    { id: 13, name: "Hanging Gardens", area: "Malabar Hill", category: "Park",
      tag: "Terraced gardens with sea views", address: "Pherozeshah Mehta Gardens, B G Kher Marg, Malabar Hill, Mumbai",
      desc: "Terraced gardens perched on top of a reservoir on Malabar Hill. Famous for its animal-shaped topiary and sweeping views of the Arabian Sea — one of the most peaceful spots in South Mumbai.",
      img: "/places-explore/hanging-gardens/photo1.webp",
      photos: ["/places-explore/hanging-gardens/photo2.jpg"],
      tags: ["Park", "Sea view", "Malabar Hill"] },

    { id: 14, name: "Kamala Nehru Park", area: "Malabar Hill", category: "Park",
      tag: "Views of Marine Drive", address: "B G Kher Marg, Malabar Hill, Mumbai",
      desc: "A small hilltop park next to Hanging Gardens offering one of the best views of Marine Drive and the Queen's Necklace. The giant 'Old Woman's Shoe' is a beloved landmark.",
      img: "/places-explore/kamala-nehru-park/photo1.jpg",
      photos: ["/places-explore/kamala-nehru-park/photo2.avif"],
      tags: ["Park", "Views", "Malabar Hill"] },

    { id: 15, name: "Cuffe Parade Park", area: "Colaba", category: "Park",
      tag: "Peaceful waterfront park", address: "Maker Towers, Near World Trade Centre, Cuffe Parade, Colaba, Mumbai 400005",
      desc: "A quiet waterfront park at the southern tip of Mumbai. Popular with Cuffe Parade residents for morning walks and evening sits — great views of the harbour with almost no tourists.",
      img: "/places-explore/cuffe-parade-park/photo1.jpg",
      photos: ["/places-explore/cuffe-parade-park/photo2.jpeg"],
      tags: ["Park", "Waterfront", "Peaceful"] },

    // ── CAVES ─────────────────────────────────────────────────────────────────

    { id: 16, name: "Kanheri Caves", area: "Borivali East", category: "Caves",
      tag: "Buddhist caves from the 1st century", address: "Sanjay Gandhi National Park, Borivali East, Mumbai 400066",
      desc: "Over 100 Buddhist rock-cut caves carved between the 1st and 9th centuries, hidden inside Sanjay Gandhi National Park. The combination of ancient history, forest, and near-silence makes this one of Mumbai's most underrated spots.",
      img: "/places-explore/kanheri-caves/photo1.jpg",
      photos: ["/places-explore/kanheri-caves/photo2.jpg", "/places-explore/kanheri-caves/photo3.jpeg"],
      tags: ["Caves", "History", "Nature"] },

    { id: 17, name: "Mahakali Caves", area: "Andheri East", category: "Caves",
      tag: "Ancient rock-cut caves", address: "Mahakali Caves Road, Andheri East, Mumbai 400093",
      desc: "A group of 19 rock-cut Buddhist monuments dating from the 1st to 6th centuries. Less visited than Elephanta or Kanheri but equally impressive — set in green hillside right in the middle of Andheri.",
      img: "/places-explore/mahakali-caves/photo1.jpg",
      photos: ["/places-explore/mahakali-caves/photo2.JPG", "/places-explore/mahakali-caves/photo3.avif"],
      tags: ["Caves", "History", "Buddhist heritage"] },

    // ── INDOOR BOULDERING ─────────────────────────────────────────────────────

    { id: 18, name: "The Indian Bouldering Company", area: "Fort", category: "Indoor Bouldering",
      tag: "Mumbai's first bouldering gym", address: "3rd Floor, Shreeniwas House, 27, Hazarimal Somani Rd, Azad Maidan, Fort, Mumbai 400001",
      phone: "7208758422",
      desc: "Mumbai's original indoor bouldering space — no ropes, just you, the wall, and the problem. Great beginner-friendly setting with a strong climbing community. Book a session to try it.",
      img: "/places-explore/indian-bouldering-company/photo1.jpg",
      photos: ["/places-explore/indian-bouldering-company/photo2.webp"],
      tags: ["Indoor Bouldering", "Active", "Fort"] },

    { id: 19, name: "High Rock", area: "Powai", category: "Indoor Bouldering",
      tag: "Bouldering in Hiranandani", address: "S4, A-Wing, Supreme Business Park, Hiranandani Gardens, Powai, Mumbai 400076",
      phone: "9004614937",
      desc: "A well-equipped bouldering gym inside Hiranandani Gardens in Powai. Good variety of routes across all skill levels, a regular crowd of climbers, and a clean well-maintained space.",
      img: "/places-explore/high-rock/photo1.jfif",
      photos: ["/places-explore/high-rock/photo2.jfif", "/places-explore/high-rock/photo3.jpeg"],
      tags: ["Indoor Bouldering", "Active", "Powai"] },

    // ── MUSEUMS ───────────────────────────────────────────────────────────────

    { id: 20, name: "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya", area: "Kala Ghoda, Fort", category: "Museum",
      tag: "Mumbai's premier museum", address: "159-161, Mahatma Gandhi Road, Kala Ghoda, Fort, Mumbai 400023",
      desc: "One of India's finest art and history museums with over 70,000 objects spanning from the Stone Age to the present. The building itself — a Grade I heritage structure — is worth visiting for the architecture alone.",
      img: "/places-explore/csmvs-museum/photo1.jfif",
      photos: ["/places-explore/csmvs-museum/photo2.jpg", "/places-explore/csmvs-museum/photo3.jfif", "/places-explore/csmvs-museum/photo4.jfif", "/places-explore/csmvs-museum/photo5.jpeg"],
      tags: ["Museum", "Heritage", "Art"] },

    { id: 21, name: "Dr. Bhau Daji Lad Museum", area: "Byculla", category: "Museum",
      tag: "Mumbai's oldest museum", address: "91A, Rani Baug, Dr Babasaheb Ambedkar Rd, Byculla East, Mumbai 400027",
      desc: "Mumbai's oldest museum, first opened in 1857 inside the stunning Rani Baug zoological garden. Houses a rare collection of decorative arts, maps, and artefacts chronicling early Bombay. Beautifully restored — worth visiting just for the building.",
      img: "/places-explore/bhau-daji-lad-museum/photo1.webp",
      photos: ["/places-explore/bhau-daji-lad-museum/photo2.webp", "/places-explore/bhau-daji-lad-museum/photo3.webp", "/places-explore/bhau-daji-lad-museum/photo4.webp"],
      tags: ["Museum", "Heritage", "Byculla"] },

    { id: 22, name: "National Gallery of Modern Art", area: "Fort", category: "Museum",
      tag: "Modern and contemporary art", address: "Jahangir Public Hall, Mahatma Gandhi Road, Fort, Mumbai 400032",
      desc: "Mumbai's home for modern and contemporary Indian art, opened in 1996. Rotating exhibitions alongside a permanent collection of paintings and sculptures from prominent Indian artists.",
      img: "/places-explore/ngma-mumbai/photo1.jpg",
      photos: ["/places-explore/ngma-mumbai/photo2.jpg", "/places-explore/ngma-mumbai/photo3.jpg", "/places-explore/ngma-mumbai/photo4.jpg"],
      tags: ["Museum", "Modern art", "Fort"] },

    { id: 23, name: "Framji Dadabhoy Alpaiwalla Museum", area: "Malabar Hill", category: "Museum",
      tag: "Parsi heritage museum", address: "N S Patkar Marg, Babulnath, Khareghat Colony, Malabar Hill, Mumbai 400007",
      desc: "A small, remarkable museum dedicated to the history and heritage of Mumbai's Zoroastrian (Parsi) community. Run by the Bombay Parsi Punchayet — artefacts, manuscripts, and cultural objects that tell the story of a community that shaped this city.",
      img: "/places-explore/alpaiwalla-museum/photo1.jfif",
      photos: ["/places-explore/alpaiwalla-museum/photo2.jpg"],
      tags: ["Museum", "Parsi heritage", "Malabar Hill"] },

  ],
  nyc: [
    { id: 1, name: "The High Line", area: "Chelsea / Meatpacking", tag: "Elevated park walk", desc: "A 1.45-mile elevated park built on a former freight rail line. Public art, Hudson River views, and some of the most interesting architecture in the city frame the walk.", img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80", tags: ["Outdoors", "Art", "Walking"] },
    { id: 2, name: "DUMBO", area: "Brooklyn", tag: "Best Manhattan views", desc: "Down Under the Manhattan Bridge Overpass — cobblestone streets, the iconic bridge-framed Manhattan view on Washington St, and a thriving arts and food scene.", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", tags: ["Views", "Photography", "Brooklyn"] },
    { id: 3, name: "Prospect Park", area: "Brooklyn", tag: "Brooklyn's green lung", desc: "Olmsted and Vaux's own favourite creation — they considered it better than Central Park. 585 acres of meadows, forest, a lake, and the Long Meadow.", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80", tags: ["Nature", "Outdoors", "Brooklyn"] },
    { id: 4, name: "Bushwick Collective", area: "Bushwick, Brooklyn", tag: "Open-air street art museum", desc: "A rotating outdoor gallery of world-class street art covering entire city blocks in Bushwick. New murals appear regularly — no two visits are the same.", img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80", tags: ["Art", "Street art", "Brooklyn"] },
    { id: 5, name: "Staten Island Ferry", area: "Lower Manhattan", tag: "Free Statue of Liberty views", desc: "The best free ride in New York — a 25-minute ferry between Manhattan and Staten Island with unobstructed views of the Statue of Liberty and the skyline.", img: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80", tags: ["Free", "Views", "Waterfront"] },
    { id: 6, name: "Coney Island Boardwalk", area: "Brooklyn", tag: "Classic NYC seaside", desc: "A 2.7-mile boardwalk along the Atlantic Ocean — the original American amusement park, Nathan's hot dogs, the Cyclone roller coaster, and the ocean.", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", tags: ["Beach", "Classic", "Brooklyn"] },
  ],
};

// Activity grouping for By Activity tab
const ACTIVITY_ICONS = {
  "Attend a live music gig": "🎵",
  "Explore hidden bookstores": "📚",
  "Try a new restaurant": "🍽️",
  "Join a running club": "🏃",
  "Visit an art gallery": "🎨",
  "Attend a comedy show": "😂",
  "Go hiking": "🥾",
  "Take a cooking class": "👨‍🍳",
  "Watch a play": "🎭",
  "Plan a road trip": "🚗",
  "Join a sports team": "⚽",
  "Attend a film screening": "🎬",
  "Try pottery or a craft class": "🏺",
  "Go to a food festival": "🍜",
  "Explore street art": "🖼️",
  "Attend a rooftop event": "🌆",
  "Join a book club": "📖",
  "Try open mic night": "🎤",
  "Run a half marathon": "🏅",
  "Learn guitar": "🎸",
  "Go for trekking": "🏔️",
  "Watch stand-up comedy": "🎙️",
  "Try new restaurants": "🍽️",
  "Play football": "⚽",
  "Go for a run": "👟",
  "Explore cafes": "☕",
};

const CITIES = {
  nyc: {
    label: "New York City", cur: "$",
    food: [
      { id: 1, name: "Olive Bistro", cuisine: "Italian", price: "$1,500 for two", rating: 4.7, tag: "High rated", hood: "West Village", desc: "A cozy Italian bistro with warm lighting and exceptional pasta.", phone: "+1 212-555-0101", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", photos: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80", "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80", "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80"], menu: [{ item: "Truffle Pasta", price: "$28" }, { item: "Branzino", price: "$34" }, { item: "Tiramisu", price: "$12" }, { item: "Margherita", price: "$18" }] },
      { id: 2, name: "Sakura Sushi", cuisine: "Japanese", price: "$1,200 for two", rating: 4.6, tag: "Near you", hood: "East Village", desc: "A cozy sushi place offering authentic Japanese cuisine with a modern touch.", phone: "+1 212-555-0202", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80", photos: [], menu: [] },
      { id: 3, name: "La Pizzeria", cuisine: "Italian", price: "$1,000 for two", rating: 4.5, tag: "Best for dinner", hood: "Brooklyn", desc: "Wood-fired Neapolitan pizza made with imported Italian ingredients.", phone: "+1 718-555-0303", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80", photos: [], menu: [] },
      { id: 4, name: "Bunna Cafe", cuisine: "Ethiopian", price: "$800 for two", rating: 4.8, tag: "Hidden gem", hood: "Bushwick", desc: "Authentic Ethiopian food in a warm communal setting.", phone: "+1 347-555-0505", img: "https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=600&q=80", photos: [], menu: [] },
      { id: 5, name: "Saravana Bhavan", cuisine: "Indian", price: "$600 for two", rating: 4.7, tag: "Family fav", hood: "Murray Hill", desc: "South Indian classics done right. The masala dosa is legendary.", phone: "+1 212-555-0606", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80", photos: [], menu: [] },
      { id: 6, name: "Truffle House", cuisine: "Continental", price: "$1,800 for two", rating: 4.4, tag: "Popular", hood: "Midtown", desc: "Fine dining with an emphasis on truffle-infused seasonal ingredients.", phone: "+1 212-555-0404", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", photos: [], menu: [] },
    ],
    people: [
      { id: 1, ini: "R", name: "Rohit", age: 26, city: "New York", color: "#e8f0e8", tc: "#2d6a2d", photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"], interests: ["Travel", "Books", "Live Music", "Food & Dining", "Photography"], sharedInterests: ["Live Music", "Food & Dining"], prompts: [{ q: "What recent incident changed your perspective on something?", a: "Solo backpacking in the Himalayas taught me to slow down and truly appreciate the little things." }, { q: "If you were mayor for a day, what would you change?", a: "I'd make public spaces more vibrant and accessible for everyone." }], cityWants: ["Attend a live music gig", "Explore hidden bookstores", "Go hiking", "Try new restaurants"], foodRecs: [{ name: "Bunna Cafe, Bushwick", desc: "Authentic Ethiopian — get the injera" }], cityRecs: [{ name: "The High Line", desc: "Best walk in Manhattan" }] },
      { id: 2, ini: "A", name: "Aisha", age: 24, city: "New York", color: "#f0e8e8", tc: "#8b2020", photos: ["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80"], interests: ["Art & Culture", "Photography", "Food & Dining", "Books", "Wellness"], sharedInterests: ["Photography", "Food & Dining"], prompts: [{ q: "What recent incident changed your perspective?", a: "Watching sunrise at the Hudson taught me the best moments are unplanned ones." }], cityWants: ["Take a cooking class", "Visit an art gallery", "Join a book club", "Attend a film screening"], foodRecs: [{ name: "Russ & Daughters", desc: "Iconic NYC deli since 1914" }], cityRecs: [{ name: "Brooklyn Bridge at sunset", desc: "Worth the walk every time" }] },
      { id: 3, ini: "M", name: "Marcus", age: 28, city: "New York", color: "#e8eef5", tc: "#1a3a5c", photos: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80"], interests: ["Live Music", "Films", "Books", "Outdoors"], sharedInterests: ["Live Music", "Books"], prompts: [{ q: "What school activity do you still miss?", a: "Jazz band rehearsals. Creating something together in real time can't be replicated." }], cityWants: ["Attend a live music gig", "Go hiking", "Try open mic night", "Join a running club"], foodRecs: [{ name: "Di Fara Pizza, Brooklyn", desc: "Best slice in New York, no contest" }], cityRecs: [{ name: "DUMBO at night", desc: "Manhattan Bridge view is unreal" }] },
    ],
  },
  mumbai: {
    label: "Mumbai", cur: "₹",
    food: [
      { id: 1, name: "Aram Vada Pav", cuisine: "Street Food", price: "Rs.50-150 for two", rating: 4.6, tag: "Legendary since 1939", hood: "CST", address: "Capital Cinema Building, Opposite CSMT, Fort, Mumbai 400001", phone: "8655712155", desc: "Experience a taste of tradition at Aram Vada Pav — Mumbai's legendary spot for authentic Maharashtrian street food since 1939.", sharedExp: "Tried the vada pav and had a great experience. The vada was crispy, the pav was soft and the chutney added a flavorful spicy kick.", tryThis: "Vada Pav", img: "/places/aram-vada-pav/photo1.webp", photos: ["/places/aram-vada-pav/photo2.jpg"] },
      { id: 2, name: "ARAKU Coffee", cuisine: "Cafe", price: "Rs.800-1200 for two", rating: 4.5, tag: "Farm-to-cup", hood: "Colaba", address: "Sunny House, Mandlik Rd, Colaba, Mumbai 400001", phone: "7337205222", desc: "ARAKU Coffee sources 100% organic single-origin Arabica coffee from Araku Valley. Artisanal bakes, all-day breakfast, and seasonal dishes.", sharedExp: "The coffee was great and the food was both delicious and beautifully presented.", tryThis: "Pistachio and Rhubarb Cake", img: "/places/araku-coffee/photo1.jpg", photos: [] },
      { id: 3, name: "Mag St. Cafe", cuisine: "Cafe", price: "Rs.800-1500 for two", rating: 4.4, tag: "Local favorite", hood: "Colaba", address: "4, Mandlik Rd, Colaba, Mumbai 400001", phone: "7208544366", desc: "A beloved destination for casual and comforting dining. Lobster Rolls, Truffle Fries, artisanal pizzas — fresh locally sourced ingredients.", sharedExp: "Absolutely delicious food with generous portions for the price. Great service.", tryThis: "Korean Cheese Bun and Udon Noodles", img: "/places/mag-st-cafe/photo2.jpg", photos: ["/places/mag-st-cafe/photo1.webp", "/places/mag-st-cafe/photo3.webp"] },
      { id: 4, name: "Leopold Cafe", cuisine: "Multi-cuisine", price: "Rs.1000-1500 for two", rating: 4.4, tag: "Iconic landmark", hood: "Colaba", address: "Shahid Bhagat Singh Road, Colaba Causeway, Mumbai 400001", phone: "8585828201", desc: "An iconic cafe in Colaba known for its historic charm and lively atmosphere. One of Mumbai's most celebrated landmarks.", sharedExp: "Great lively atmosphere and an extensive menu. Tasty food in generous portions.", tryThis: "Grilled Chicken Sandwich and Chicken Chilli", img: "/places/leopold-cafe/photo1.webp", photos: ["/places/leopold-cafe/photo2.webp", "/places/leopold-cafe/photo3.webp"] },
      { id: 5, name: "Woodside Inn", cuisine: "Gastropub", price: "Rs.1500-2500 for two", rating: 4.5, tag: "Best gastropub", hood: "Colaba", address: "Indian Mercantile Mansion, Wodehouse Road, Colaba, Mumbai 400001", phone: "9321728192", desc: "Cosy, warmly decorated gastropub. Never forced — great food, great drinks, great atmosphere.", sharedExp: "My favorite thing about Woodside is that it never feels forced. You can come here after a long day, order a beer and some truffle fries and lose track of time.", tryThis: "Draft Beer and Chicken Poppers", img: "/places/woodside-inn/photo2.webp", photos: ["/places/woodside-inn/photo1.jpeg"] },
      { id: 6, name: "Nandan Coffee", cuisine: "Specialty Coffee Cafe", price: "Rs.600-1000 for two", rating: 4.7, tag: "Specialty coffee", hood: "Kala Ghoda", address: "Mulla House, 34, Homi Modi St, Kala Ghoda, Fort, Mumbai 400001", phone: "7738069879", desc: "Nandan Coffee sources specialty coffee straight from an organic estate in Kodaikanal. Warm hospitality and a calm atmosphere.", sharedExp: "The interior is incredible and the specialty coffee is sourced straight from their organic estate in Kodaikanal. The service is friendly too.", tryThis: "Tiramisu French Toast and Mediterranean Spiced Eggs", img: "/places/nandan-coffee/photo3.webp", photos: ["/places/nandan-coffee/photo1.jpg", "/places/nandan-coffee/photo2.jpg"] },
      { id: 7, name: "Kala Ghoda Cafe", cuisine: "Cafe", price: "Rs.600-1000 for two", rating: 4.5, tag: "Neighbourhood gem", hood: "Kala Ghoda", address: "10, Rope Walk Ln, Kala Ghoda, Fort, Mumbai 400001", phone: "9833803418", desc: "A charming cafe in Kala Ghoda known for its warm atmosphere and comforting food.", sharedExp: "The food was fantastic and the restaurant has a very welcoming vibe. The perfect place to enjoy quality time with friends.", tryThis: "Chocolate Profiteroles and Cottage Cheese Burger", img: "/places/kala-ghoda-cafe/photo3.webp", photos: ["/places/kala-ghoda-cafe/photo1.webp", "/places/kala-ghoda-cafe/photo2.webp"] },
      { id: 8, name: "The Bombay Canteen", cuisine: "Indian", price: "Rs.2000-3000 for two", rating: 4.8, tag: "Must visit", hood: "Lower Parel", address: "Unit-1, Process House, S.B. Road, Kamala Mills, Lower Parel, Mumbai 400013", phone: "8880802424", desc: "Bombay Canteen brings the bright and vibrant flavors of authentic Indian food. Beautifully plated and exceptionally fresh.", sharedExp: "Incredible food and top-tier service. The dishes are beautifully plated and taste exceptionally fresh.", tryThis: "Chilled Sea Bass Sev Puri and Coffee Rasgulla Sundae", img: "/places/bombay-canteen/photo1.jpg", photos: ["/places/bombay-canteen/photo2.webp", "/places/bombay-canteen/photo3.webp"] },
      { id: 9, name: "Boojee Cafe", cuisine: "Cafe", price: "Rs.800-1500 for two", rating: 4.6, tag: "Brunch spot", hood: "Bandra West", address: "Shop No. 6, 29, New Kantwadi Road, Off Perry Cross Road, Bandra West, Mumbai 400050", phone: "9930203882", desc: "A Bandra cafe known for its specialty coffee, delicious brunch offerings and inviting atmosphere.", sharedExp: "It was an amazing experience from start to finish. The food was incredible and full of flavor.", tryThis: "Bombay Burger and Nachos", img: "/places/boojee-cafe/photo3.webp", photos: ["/places/boojee-cafe/photo1.jpeg", "/places/boojee-cafe/photo2.jpg"] },
      { id: 10, name: "GIGI Bombay", cuisine: "Japanese Restaurant", price: "Rs.2000-3500 for two", rating: 4.7, tag: "Premium fusion", hood: "Bandra West", address: "14th Rd, Bandra West, Mumbai 400050", phone: "8976943116", desc: "A trendy Japanese-European fusion restaurant and cocktail bar in Bandra West. Every dish feels carefully executed.", sharedExp: "A near-perfect combination of ambience, service and food. One of the city's most premium dining experiences.", tryThis: "Pumpkin Ravioli & Salmon Sushi and Chilli Garlic Edamame", img: "/places/gigi-bombay/photo1.jpg", photos: ["/places/gigi-bombay/photo2.webp", "/places/gigi-bombay/photo3.webp"] },
      { id: 11, name: "Prithvi Cafe", cuisine: "Cafe", price: "Rs.500-900 for two", rating: 4.8, tag: "Hidden gem", hood: "Juhu", address: "Alongside Prithvi Theatre, 20, Juhu Rd, Juhu, Mumbai 400049", phone: "7045940218", desc: "A charming culinary haven nestled alongside the iconic Prithvi Theatre. Cafe classics, hearty meals and expertly brewed coffee in a vibrant literary atmosphere.", sharedExp: "A wonderful spot to relax and enjoy a fantastic meal. The food quality is excellent.", tryThis: "Pasta and Chole Kulche and Kitkat Shake", img: "/places/prithvi-cafe/photo3.webp", photos: ["/places/prithvi-cafe/photo1.png", "/places/prithvi-cafe/photo2.png"] },
      { id: 12, name: "Earth Cafe", cuisine: "Healthy Cafe", price: "Rs.600-1000 for two", rating: 4.8, tag: "Top rated", hood: "Churchgate", address: "Ground Floor, Ram Mahal, Dinshaw Vacha Rd, near KC College, Churchgate, Mumbai 400020", phone: "9081881844", desc: "Earth Cafe features a wide variety of dishes made with fresh and high-quality ingredients — hearty meals to refreshing smoothies.", sharedExp: "The vegan food here is delicious and the hospitality was excellent.", tryThis: "Orange Chocolate Cake and Rainbow Sandwich", img: "/places/earth-cafe/photo3.webp", photos: ["/places/earth-cafe/photo1.webp", "/places/earth-cafe/photo2.webp"] },
      { id: 13, name: "Britannia and Co.", cuisine: "Parsi", price: "Rs.800-1500 for two", rating: 4.6, tag: "Parsi heritage", hood: "Fort", address: "Wakefield House, 11 16, SS Ram Gulam Marg, Ballard Estate, Fort, Mumbai 400001", phone: "02222615264", desc: "If you want a taste of Mumbai's rich culinary history, Britannia and Co. is a mandatory stop. Serving phenomenal authentic Parsi cuisine since 1923.", sharedExp: "Fantastic experience — the food is good and if you want authentic Parsi flavors then this is the place to go.", tryThis: "Mutton Berry Pulao", img: "/places/britannia/photo2.jpg", photos: ["/places/britannia/photo1.webp"] },
      // New places (IDs 14–25 — add all your new ones here)
      { id: 14, name: "Mary Lodge by Subko", cuisine: "Bakery Cafe", price: "Rs.600-1200 for two", rating: 4.6, tag: "Bungalow cafe", hood: "Bandra West", address: "Ground Floor, Mary Lodge, 21A, Chapel Rd, Ranwar, Bandra West, Mumbai", phone: "8591745691", desc: "Fusion of old and new in a charming bungalow. Unique coffee options, savory treats and indulgent bakery items. Perfect for work sessions or casual dates.", sharedExp: "Great food, beautiful interiors and welcoming staff. I had a truly delightful experience here.", tryThis: "Espresso Cream Croissant and Harissa Sandwich", img: "/places/mary-lodge-subko/photo1.jpg", photos: ["/places/mary-lodge-subko/photo2.webp", "/places/mary-lodge-subko/photo3.webp"] },
      { id: 15, name: "TÓA 66", cuisine: "Thai Restaurant", price: "Rs.3000-5000 for two", rating: 4.8, tag: "India's first Thai tasting menu", hood: "Churchgate", address: "Ground Floor, ADCB Rehman Manzil, 75, Veer Nariman Rd, Churchgate, Mumbai", phone: "9920820800", desc: "TÓA 66 brings India's first 7-course vegetarian Thai tasting menu to Mumbai. Designed by two master Thai chefs in an intimate 26-seater space.", sharedExp: "The 7-course Thai tasting menu is exceptional. The opening course and the two desserts were the absolute highlights. Highly recommended.", tryThis: "7-Course Thai Tasting Menu", img: "/places/toa-66/photo2.webp", photos: ["/places/toa-66/photo3.webp", "/places/toa-66/photo4.webp"] },
      { id: 16, name: "Trishna", cuisine: "Seafood Restaurant", price: "Rs.2000-3500 for two", rating: 4.7, tag: "Premium seafood", hood: "Kala Ghoda", address: "Birla Mansion, Sai Baba Mandir Marg, Kala Ghoda, Fort, Mumbai 400001", phone: "9206260260", desc: "Premium seafood restaurant in the heart of Mumbai.", sharedExp: "Excellent seafood restaurant with exceptional food quality. Highly recommended for seafood lovers.", tryThis: "Butter Garlic Crab", img: "/places/trishna/photo1.webp", photos: ["/places/trishna/photo2.webp"] },
      { id: 17, name: "Ekaa", cuisine: "Indian Restaurant", price: "Rs.3000-5000 for two", rating: 4.7, tag: "Open kitchen fine dining", hood: "Fort", address: "1st Floor, Kitab Mahal, D Sukhadwala Rd, Fort, Mumbai 400001", phone: "9987657989", desc: "Industrial-chic Indian spot with creative plates and an open kitchen concept — perfect for watching the culinary magic happen.", sharedExp: "Had an amazing time at Ekaa. The hospitality was wonderful and the food was absolutely great.", tryThis: "Awakening Tasting Menu", img: "/places/ekaa/photo1.webp", photos: ["/places/ekaa/photo2.webp", "/places/ekaa/photo3.webp"] },
    ],
    people: [
      { id: 1, ini: "A", name: "Ananya", age: 26, city: "Mumbai", color: "#e8f0e8", tc: "#2d6a2d", photos: ["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80"], interests: ["Live Music", "Food & Dining", "Travel", "Books", "Photography"], sharedInterests: ["Live Music", "Food & Dining", "Photography"], prompts: [{ q: "What recent incident changed your perspective?", a: "Losing my wallet while traveling alone taught me to be more adaptable and trust that things usually work out." }, { q: "One thing I've been wanting to do in Mumbai but haven't gotten around to is...", a: "Join a proper book club — the kind that meets in a cafe and argues about endings." }], cityWants: ["Attend a live music gig", "Try new restaurants", "Join a book club", "Explore street art", "Go to a food festival"], foodRecs: [{ name: "The Bombay Canteen, Lower Parel", desc: "Modern Indian cuisine with a twist" }, { name: "Prithvi Cafe, Juhu", desc: "Literary crowd, great chai" }], cityRecs: [{ name: "Marine Drive", desc: "Perfect sunset walks" }, { name: "Bandstand Promenade", desc: "Best evening walk in Bandra" }] },
      { id: 2, ini: "R", name: "Rohit", age: 27, city: "Mumbai", color: "#e8eef5", tc: "#1a3a5c", photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"], interests: ["Tech", "Fitness", "Travel", "Food & Dining", "Live Music"], sharedInterests: ["Live Music", "Food & Dining"], prompts: [{ q: "What recent incident changed your perspective?", a: "Solo backpacking in the Himalayas taught me to slow down and truly appreciate the little things." }, { q: "If I could get a group of people together to do one thing, it would be...", a: "A sunrise trek followed by the best chai you've ever had. No phones, just conversation." }], cityWants: ["Go hiking", "Attend a live music gig", "Try new restaurants", "Join a running club", "Go for a run"], foodRecs: [{ name: "Prithvi Cafe, Juhu", desc: "Best chai and a literary crowd" }, { name: "Nandan Coffee, Kala Ghoda", desc: "Incredible specialty coffee" }], cityRecs: [{ name: "Sanjay Gandhi National Park", desc: "Best morning trek in the city" }, { name: "Worli Sea Face", desc: "Peaceful evenings by the sea" }] },
      { id: 3, ini: "K", name: "Kavya", age: 25, city: "Mumbai", color: "#f5eef8", tc: "#6b3a8c", photos: ["https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80", "https://images.unsplash.com/photo-1548142813-c348350df52b?w=400&q=80"], interests: ["Art & Culture", "Books", "Photography", "Wellness", "Films"], sharedInterests: ["Art & Culture", "Books"], prompts: [{ q: "A place in Mumbai that makes me feel at home is...", a: "Kala Ghoda on a quiet weekday morning — coffee in hand, galleries just opening." }, { q: "Something I watched or read recently that stuck with me is...", a: "Parable of the Sower. I keep thinking about it." }], cityWants: ["Visit an art gallery", "Explore street art", "Try pottery or a craft class", "Join a book club", "Attend a film screening"], foodRecs: [{ name: "Kala Ghoda Cafe", desc: "Warmest cafe in South Mumbai" }], cityRecs: [{ name: "Kala Ghoda Art District", desc: "My favourite part of the city" }] },
      { id: 4, ini: "S", name: "Sameer", age: 29, city: "Mumbai", color: "#eef5e8", tc: "#2d6a2d", photos: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80"], interests: ["Fitness", "Sports", "Outdoors", "Food & Dining", "Travel"], sharedInterests: ["Food & Dining", "Outdoors"], prompts: [{ q: "If I could get a group together to do one thing, it would be...", a: "A 5-a-side football game in Bandra every Sunday morning. Consistent, casual, no pressure." }], cityWants: ["Join a sports team", "Join a running club", "Go hiking", "Go for a run", "Go to a food festival"], foodRecs: [{ name: "GIGI Bombay, Bandra", desc: "Best fusion food in the city" }], cityRecs: [{ name: "Bandstand Promenade", desc: "Best morning run in Mumbai" }] },
    ],
  },
};

const INTEREST_OPTIONS = [
  { id: "music", label: "Live Music", icon: "🎵" }, { id: "art", label: "Art & Culture", icon: "🎨" },
  { id: "food", label: "Food & Dining", icon: "🍽️" }, { id: "fitness", label: "Fitness", icon: "🏃" },
  { id: "comedy", label: "Comedy", icon: "😂" }, { id: "books", label: "Books", icon: "📚" },
  { id: "travel", label: "Travel", icon: "✈️" }, { id: "photography", label: "Photography", icon: "📷" },
  { id: "networking", label: "Networking", icon: "🤝" }, { id: "sports", label: "Sports", icon: "⚽" },
  { id: "wellness", label: "Wellness", icon: "🧘" }, { id: "tech", label: "Tech", icon: "💻" },
  { id: "film", label: "Films", icon: "🎬" }, { id: "festivals", label: "Festivals", icon: "🎉" },
  { id: "workshops", label: "Workshops", icon: "✏️" }, { id: "outdoors", label: "Outdoors", icon: "🌿" },
];

const THINGS_OPTIONS = [
  "Attend a live music gig", "Explore hidden bookstores", "Try a new restaurant", "Join a running club",
  "Visit an art gallery", "Attend a comedy show", "Go hiking", "Take a cooking class",
  "Watch a play", "Plan a road trip", "Join a sports team", "Attend a film screening",
  "Try pottery or a craft class", "Go to a food festival", "Explore street art",
  "Attend a rooftop event", "Join a book club", "Try open mic night",
];

const CUISINE_OPTIONS = [
  { id: "Indian", label: "Indian", icon: "🍛" }, { id: "Street Food", label: "Street Food", icon: "🌮" },
  { id: "Cafe & Coffee", label: "Café & Coffee", icon: "☕" }, { id: "Bakery & Desserts", label: "Bakery & Desserts", icon: "🧁" },
  { id: "Seafood", label: "Seafood", icon: "🦐" }, { id: "Chinese", label: "Chinese", icon: "🥢" },
  { id: "Japanese", label: "Japanese", icon: "🍣" }, { id: "Continental & Italian", label: "Continental & Italian", icon: "🍝" },
  { id: "Momos & Tibetan", label: "Momos & Tibetan", icon: "🥟" }, { id: "Lebanese & Middle Eastern", label: "Lebanese & Middle Eastern", icon: "🧆" },
  { id: "Bar & Rooftop", label: "Bar & Rooftop", icon: "🍹" }, { id: "Irani & Parsi Cafe", label: "Irani & Parsi Café", icon: "🫖" },
];

const BUDGET_OPTIONS = [
  { id: "budget", label: "Budget-friendly", sub: "Mostly under ₹600 for two", icon: "🪙" },
  { id: "mid", label: "Mid-range", sub: "₹600–1500 for two", icon: "💳" },
  { id: "premium", label: "Premium", sub: "₹1500+ for two", icon: "💎" },
  { id: "flexible", label: "Flexible", sub: "Depends on the day", icon: "🎲" },
];

const CUISINE_TAG_MAP = {
  "Indian": ["indian", "punjabi", "maharashtrian", "parsi", "gujarati", "south indian", "thali", "multi-cuisine"],
  "Street Food": ["street food", "vada pav", "fast food", "chaat"],
  "Cafe & Coffee": ["café", "cafe", "coffee", "tea house", "healthy cafe"],
  "Bakery & Desserts": ["bakery", "dessert", "ice cream"],
  "Seafood": ["seafood", "mangalorean", "coastal"],
  "Chinese": ["chinese"],
  "Japanese": ["japanese", "sushi", "ramen"],
  "Continental & Italian": ["continental", "italian", "pizza"],
  "Momos & Tibetan": ["momos", "tibetan", "dimsum"],
  "Lebanese & Middle Eastern": ["lebanese", "middle eastern", "kebab"],
  "Bar & Rooftop": ["rooftop", "bar", "gastropub", "resto bar"],
  "Irani & Parsi Cafe": ["irani", "parsi"],
};

const CONVERSATION_PROMPTS = [
  "If I could get a group of people together to do one thing, it would be...",
  "A place in Mumbai, or something I love doing here, that makes me feel at home is...",
  "Lately, I've found myself really curious about...",
  "One thing I've been wanting to do in Mumbai but still haven't gotten around to is...",
  "One of my favorite things to do in Mumbai that doesn't cost a thing is...",
  "Something I watched, read, or listened to recently that has stuck with me is...",
  "A topic I could spend hours hearing different opinions on is...",
  "When I need to slow down and reset, I usually...",
];

function priceLevelFromString(priceStr) {
  if (!priceStr) return 2;
  const nums = (priceStr.match(/\d+/g) || []).map(Number);
  if (!nums.length) return 2;
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return avg < 600 ? 1 : avg < 1500 ? 2 : 3;
}
const BUDGET_TO_LEVEL = { budget: 1, mid: 2, premium: 3, flexible: null };

function scoreFoodPlace(place, userCuisines, userBudget) {
  let score = 0;
  if (userCuisines?.length) {
    for (let i = 0; i < userCuisines.length; i++) {
      const subs = CUISINE_TAG_MAP[userCuisines[i]] || [];
      if (subs.some(s => place.cuisine.toLowerCase().includes(s))) {
        score += (userCuisines.length - i) * 10;
        break;
      }
    }
  }
  const targetLevel = BUDGET_TO_LEVEL[userBudget];
  if (targetLevel != null) {
    const diff = Math.abs(priceLevelFromString(place.price) - targetLevel);
    score += diff === 0 ? 8 : diff === 1 ? 3 : 0;
  }
  score += place.rating;
  return score;
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({ onDone, onShowSignIn, onBackToLanding, initialCity, initialName }) {
  const skipBasics = !!(initialCity && initialName);
  const [step, setStep] = useState(skipBasics ? 3 : 1);
  const [city, setCity] = useState(initialCity || "");
  const [name, setName] = useState(initialName || "");
  const [age, setAge] = useState("");
  const [selInterests, setSelInterests] = useState([]);
  const [selThings, setSelThings] = useState([]);
  const [selCuisines, setSelCuisines] = useState([]);
  const [budget, setBudget] = useState("");

  const togI = id => setSelInterests(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const togT = t => setSelThings(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  const togC = id => setSelCuisines(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const moveCuisine = (id, dir) => setSelCuisines(p => {
    const idx = p.indexOf(id); const ni = idx + dir;
    if (ni < 0 || ni >= p.length) return p;
    const n = [...p]; [n[idx], n[ni]] = [n[ni], n[idx]]; return n;
  });

  if (step === 0) return (
    <div className="ob-root">
      <div className="ob-hero">
        <div className="ob-hero-img" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800&q=80)` }} />
        <div className="ob-hero-overlay" />
        <div className="ob-hero-content"><div className="ob-logo-hero"><NearMetLogo size={52} dark /></div><p className="ob-hero-tagline">Explore your city.<br />Find genuine connections.</p></div>
        <div className="ob-hero-bottom">
          <button className="ob-cta-primary" onClick={() => setStep(1)}>Create an account</button>
          <button className="ob-cta-secondary" onClick={onShowSignIn}>I have an account</button>
          <p className="ob-legal">By signing up, you agree to our <span className="ob-link">Terms</span> and <span className="ob-link">Privacy Policy</span>.</p>
        </div>
      </div>
    </div>
  );

  if (step === 1) return (
    <div className="ob-step-wrap">
      <div className="ob-step-progress"><div className="ob-progress-bar" style={{ width: "15%" }} /></div>
      <div className="ob-step-body">
        <div className="ob-step-label">STEP 1 OF 6 — YOUR CITY</div>
        <h2 className="ob-step-title">Which city are you in?</h2>
        <p className="ob-step-sub">NearMet is live in two cities right now.</p>
        <div className="ob-city-list">
          {[{ id: "nyc", flag: "🗽", name: "New York City", sub: "All 5 boroughs · Live now" }, { id: "mumbai", flag: "🇮🇳", name: "Mumbai", sub: "All areas · Live now" }].map(c => (
            <button key={c.id} className={`ob-city-item ${city === c.id ? "active" : ""}`} onClick={() => setCity(c.id)}>
              <span className="ob-city-flag">{c.flag}</span>
              <div><div className="ob-city-name">{c.name}</div><div className="ob-city-sub">{c.sub}</div></div>
              <div className={`ob-radio ${city === c.id ? "filled" : ""}`} />
            </button>
          ))}
        </div>
      </div>
      <div className="ob-step-nav"><button className="ob-btn-ghost" onClick={() => { if (onBackToLanding) onBackToLanding(); else onShowSignIn(); }}>Back</button><button className="ob-btn-primary" disabled={!city} onClick={() => setStep(2)}>Next →</button></div>
    </div>
  );

  if (step === 2) return (
    <div className="ob-step-wrap">
      <div className="ob-step-progress"><div className="ob-progress-bar" style={{ width: "30%" }} /></div>
      <div className="ob-step-body">
        <div className="ob-step-label">STEP 2 OF 6 — ABOUT YOU</div>
        <h2 className="ob-step-title">What should we call you?</h2>
        <div className="ob-form">
          <div className="ob-field"><label className="ob-field-label">NAME</label><input className="ob-input" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} /></div>
          <div className="ob-field"><label className="ob-field-label">AGE</label><input className="ob-input" type="number" placeholder="18+" value={age} onChange={e => setAge(e.target.value)} /></div>
        </div>
      </div>
      <div className="ob-step-nav"><button className="ob-btn-ghost" onClick={() => setStep(1)}>Back</button><button className="ob-btn-primary" disabled={!name.trim() || !age || parseInt(age) < 18} onClick={() => setStep(3)}>Next →</button></div>
    </div>
  );

  if (step === 3) return (
    <div className="ob-step-wrap">
      <div className="ob-step-progress"><div className="ob-progress-bar" style={{ width: skipBasics ? "25%" : "45%" }} /></div>
      <div className="ob-step-body" style={{ overflowY: "auto" }}>
        <div className="ob-step-label">{skipBasics ? "STEP 1 OF 4" : "STEP 3 OF 6"} — YOUR INTERESTS</div>
        <h2 className="ob-step-title">What are you into?</h2>
        <p className="ob-step-sub">This builds your feed and helps us find your people.</p>
        <div className="ob-chips-grid">
          {INTEREST_OPTIONS.map(i => (
            <button key={i.id} className={`ob-chip ${selInterests.includes(i.id) ? "active" : ""}`} onClick={() => togI(i.id)}>
              <span className="ob-chip-icon">{i.icon}</span><span className="ob-chip-label">{i.label}</span>
              {selInterests.includes(i.id) && <span className="ob-chip-check">✓</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="ob-step-nav"><button className="ob-btn-ghost" onClick={() => { if (skipBasics) { if (onBackToLanding) onBackToLanding(); else onShowSignIn(); } else setStep(2); }}>Back</button><button className="ob-btn-primary" disabled={selInterests.length === 0} onClick={() => setStep(4)}>Next →</button></div>
    </div>
  );

  if (step === 4) return (
    <div className="ob-step-wrap">
      <div className="ob-step-progress"><div className="ob-progress-bar" style={{ width: skipBasics ? "50%" : "67%" }} /></div>
      <div className="ob-step-body" style={{ overflowY: "auto" }}>
        <div className="ob-step-label">{skipBasics ? "STEP 2 OF 4" : "STEP 4 OF 6"} — THINGS TO DO</div>
        <h2 className="ob-step-title">What do you want to do?</h2>
        <p className="ob-step-sub">This is how we match you with the right people in By Activity.</p>
        <div className="ob-things-grid">
          {THINGS_OPTIONS.map(t => (
            <button key={t} className={`ob-thing-chip ${selThings.includes(t) ? "active" : ""}`} onClick={() => togT(t)}>
              {t}{selThings.includes(t) && <span className="ob-chip-check">✓</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="ob-step-nav"><button className="ob-btn-ghost" onClick={() => setStep(3)}>Back</button><button className="ob-btn-primary" disabled={selThings.length === 0} onClick={() => setStep(5)}>Next →</button></div>
    </div>
  );

  if (step === 5) return (
    <div className="ob-step-wrap">
      <div className="ob-step-progress"><div className="ob-progress-bar" style={{ width: skipBasics ? "75%" : "83%" }} /></div>
      <div className="ob-step-body" style={{ overflowY: "auto" }}>
        <div className="ob-step-label">{skipBasics ? "STEP 3 OF 4" : "STEP 5 OF 6"} — FOOD PREFERENCES</div>
        <h2 className="ob-step-title">What do you love to eat?</h2>
        <p className="ob-step-sub">Tap to add. We'll use this to recommend food places you'll actually like.</p>
        <div className="ob-chips-grid">
          {CUISINE_OPTIONS.filter(c => !selCuisines.includes(c.id)).map(c => (
            <button key={c.id} className="ob-chip" onClick={() => togC(c.id)}>
              <span className="ob-chip-icon">{c.icon}</span><span className="ob-chip-label">{c.label}</span>
            </button>
          ))}
        </div>
        {selCuisines.length > 0 && (
          <div className="ob-ranked-list">
            <div className="ob-ranked-label">Your ranking (top = most preferred)</div>
            {selCuisines.map((id, i) => { const c = CUISINE_OPTIONS.find(o => o.id === id); return (
              <div key={id} className="ob-ranked-row">
                <span className="ob-ranked-num">{i + 1}</span><span className="ob-ranked-icon">{c?.icon}</span>
                <span className="ob-ranked-label-text">{c?.label}</span>
                <div className="ob-ranked-actions">
                  <button className="ob-ranked-btn" disabled={i === 0} onClick={() => moveCuisine(id, -1)}>↑</button>
                  <button className="ob-ranked-btn" disabled={i === selCuisines.length - 1} onClick={() => moveCuisine(id, 1)}>↓</button>
                  <button className="ob-ranked-btn ob-ranked-remove" onClick={() => togC(id)}>×</button>
                </div>
              </div>
            ); })}
          </div>
        )}
      </div>
      <div className="ob-step-nav"><button className="ob-btn-ghost" onClick={() => setStep(4)}>Back</button><button className="ob-btn-primary" disabled={selCuisines.length === 0} onClick={() => setStep(6)}>Next →</button></div>
    </div>
  );

  if (step === 6) return (
    <div className="ob-step-wrap">
      <div className="ob-step-progress"><div className="ob-progress-bar" style={{ width: "95%" }} /></div>
      <div className="ob-step-body" style={{ overflowY: "auto" }}>
        <div className="ob-step-label">{skipBasics ? "STEP 4 OF 4" : "STEP 6 OF 6"} — YOUR BUDGET</div>
        <h2 className="ob-step-title">What's your usual budget for two?</h2>
        <div className="ob-city-list">
          {BUDGET_OPTIONS.map(b => (
            <button key={b.id} className={`ob-city-item ${budget === b.id ? "active" : ""}`} onClick={() => setBudget(b.id)}>
              <span className="ob-city-flag">{b.icon}</span>
              <div><div className="ob-city-name">{b.label}</div><div className="ob-city-sub">{b.sub}</div></div>
              <div className={`ob-radio ${budget === b.id ? "filled" : ""}`} />
            </button>
          ))}
        </div>
      </div>
      <div className="ob-step-nav"><button className="ob-btn-ghost" onClick={() => setStep(5)}>Back</button><button className="ob-btn-primary" disabled={!budget} onClick={() => setStep(7)}>Next →</button></div>
    </div>
  );

  return (
    <div className="ob-step-wrap">
      <div className="ob-step-progress"><div className="ob-progress-bar" style={{ width: "100%" }} /></div>
      <div className="ob-done-screen">
        <div className="ob-done-check">✓</div>
        <h2 className="ob-done-title">You're in, {name}.</h2>
        <p className="ob-done-sub">Your feed is ready. Find people who want to do the same things as you in {city === "nyc" ? "New York" : "Mumbai"}.</p>
        <div className="ob-done-interests">
          {selInterests.slice(0, 6).map(id => { const i = INTEREST_OPTIONS.find(o => o.id === id); return <span key={id} className="ob-done-chip">{i?.icon} {i?.label}</span>; })}
        </div>
        <button className="ob-btn-primary ob-btn-full" style={{ marginTop: 32 }} onClick={() => onDone({ city, name, interests: selInterests, things: selThings, cuisines: selCuisines, budget })}>Go to my feed →</button>
      </div>
    </div>
  );
}

// ─── PROFILE SLIDESHOW ────────────────────────────────────────────────────────
function ProfileSlideshow({ photos, name, onBack }) {
  const [idx, setIdx] = useState(0);
  const touchStart = useRef(null);
  const prev = () => setIdx(i => Math.max(0, i - 1));
  const next = () => setIdx(i => Math.min((photos.length || 1) - 1, i + 1));
  const onTouchStart = e => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = e => {
    if (!touchStart.current) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (diff > 50) next(); else if (diff < -50) prev();
    touchStart.current = null;
  };
  if (!photos.length) return (
    <div className="pv-hero-wrap">
      <div className="pv-hero-placeholder">{(name || "?").slice(0, 2).toUpperCase()}</div>
      {onBack && <button className="pv-back-btn" onClick={onBack}>←</button>}
    </div>
  );
  return (
    <div className="pv-hero-wrap" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <img src={photos[idx]} alt={name} className="pv-hero-img" />
      {onBack && <button className="pv-back-btn" onClick={onBack}>←</button>}
      {photos.length > 1 && (
        <>
          {idx > 0 && <button className="pv-slide-btn pv-slide-prev" onClick={prev}>‹</button>}
          {idx < photos.length - 1 && <button className="pv-slide-btn pv-slide-next" onClick={next}>›</button>}
          <div className="pv-dots">{photos.map((_, i) => <div key={i} className={`pv-dot ${i === idx ? "active" : ""}`} />)}</div>
        </>
      )}
    </div>
  );
}

// ─── FULL PROFILE VIEW (shared between For You + By Activity) ─────────────────
function FullProfileView({ person, city, onBack, onMessage, connecting }) {
  const cd = CITIES[city];
  const allPhotos = (person.photo_urls || person.photos || []).filter(Boolean);
  const theirPrompts = person.prompts
    ? Array.isArray(person.prompts)
      ? person.prompts.filter(p => p.a)
      : Object.entries(person.prompts).filter(([, ans]) => ans?.trim()).map(([q, a]) => ({ q, a }))
    : [];
  const things = person.city_wants || person.cityWants || person.things || [];
  const interests = person.interests || [];
  const foodRecs = person.food_recs || person.foodRecs || [];
  const cityRecs = person.city_recs || person.cityRecs || [];

  return (
    <div className="pv-fullscreen">
      <ProfileSlideshow photos={allPhotos} name={person.name} onBack={onBack} />

      <div className="pv-content">
        <div className="pv-name-row">
          <div>
            <div className="pv-name">{person.name}{person.age ? `, ${person.age}` : ""}</div>
            <div className="pv-city">📍 {cd.label}</div>
          </div>
        </div>

        {theirPrompts.length > 0 && (
          <>
            <div className="pv-section-title">💬 In their words</div>
            {theirPrompts.map((p, i) => (
              <div key={i} className="pv-prompt-card">
                <div className="pv-prompt-q">{p.q}</div>
                <div className="pv-prompt-a">"{p.a}"</div>
              </div>
            ))}
          </>
        )}

        {interests.length > 0 && (
          <>
            <div className="pv-section-title">Interests</div>
            <div className="pv-interest-chips">
              {interests.map(i => { const opt = INTEREST_OPTIONS.find(o => o.id === i); return <span key={i} className="pv-interest-chip">{opt?.icon} {opt?.label || i}</span>; })}
            </div>
          </>
        )}

        {things.length > 0 && (
          <>
            <div className="pv-section-title">Things I want to do</div>
            <div className="pv-things-list">
              {things.map(t => (
                <div key={t} className="pv-thing-row">
                  <span className="pv-thing-icon">{ACTIVITY_ICONS[t] || "📌"}</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {foodRecs.length > 0 && (
          <>
            <div className="pv-section-title">Food picks in {cd.label}</div>
            {(Array.isArray(foodRecs) ? foodRecs : []).filter(r => r && (r.name || typeof r === "string")).map((r, i) => {
              const name = typeof r === "string" ? r : r.name;
              const desc = typeof r === "object" ? r.desc : null;
              if (!name) return null;
              return (
                <div key={i} className="pv-rec-item">
                  <div><div className="pv-rec-name">{name}</div>{desc && <div className="pv-rec-desc">{desc}</div>}</div>
                </div>
              );
            })}
          </>
        )}

        {cityRecs.length > 0 && (
          <>
            <div className="pv-section-title">City favourites</div>
            {(Array.isArray(cityRecs) ? cityRecs : []).filter(r => r && (r.name || typeof r === "string")).map((r, i) => {
              const name = typeof r === "string" ? r : r.name;
              const desc = typeof r === "object" ? r.desc : null;
              if (!name) return null;
              return (
                <div key={i} className="pv-rec-item">
                  <div><div className="pv-rec-name">{name}</div>{desc && <div className="pv-rec-desc">{desc}</div>}</div>
                </div>
              );
            })}
          </>
        )}

        <button className="pv-chat-btn" style={{ marginTop: 24, marginBottom: 40 }} disabled={connecting} onClick={onMessage}>
          {connecting ? "Connecting…" : `Message ${person.name} →`}
        </button>
      </div>
    </div>
  );
}

// ─── CHAT VIEW ────────────────────────────────────────────────────────────────
function ChatView({ connectionId, person, userId, onBack }) {
  const [chatInput, setChatInput] = useState("");
  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatLoading, setChatLoading] = useState(true);
  const [chatError, setChatError] = useState("");
  const [promptsExpanded, setPromptsExpanded] = useState(true);

  useEffect(() => {
    let active = true;
    setChatLoading(true);
    getMessages(connectionId)
      .then(msgs => { if (active) setChatMsgs(msgs || []); })
      .catch(e => { console.error(e); if (active) setChatError("Couldn't load this conversation."); })
      .finally(() => { if (active) setChatLoading(false); });
    return () => { active = false; };
  }, [connectionId]);

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const text = chatInput.trim(); setChatInput(""); setChatError("");
    try { const msg = await sendMessage(connectionId, userId, text); setChatMsgs(p => [...p, msg]); }
    catch (e) { console.error(e); setChatError("Couldn't send that — please try again."); }
  };

  const theirPrompts = person.prompts
    ? Array.isArray(person.prompts) ? person.prompts.filter(p => p.a)
      : Object.entries(person.prompts).filter(([, ans]) => ans?.trim()).map(([q, a]) => ({ q, a }))
    : [];

  return (
    <div className="chat-root">
      <div className="chat-header">
        <button className="chat-back" onClick={onBack}>←</button>
        <div className="chat-avatar">{(person.name || "?").slice(0, 2).toUpperCase()}</div>
        <div><div className="chat-uname">{person.name}</div><div className="chat-ustatus">● Connected</div></div>
      </div>
      {theirPrompts.length > 0 && (
        <div className="chat-prompts-banner">
          <button className="chat-prompts-toggle" onClick={() => setPromptsExpanded(o => !o)}>
            <span>💬 {person.name.split(" ")[0]}'s conversation starters</span>
            <span>{promptsExpanded ? "▲" : "▼"}</span>
          </button>
          {promptsExpanded && (
            <div className="chat-prompts-list">
              {theirPrompts.map((p, i) => (
                <div key={i} className="chat-prompt-card" onClick={() => { setChatInput(`Re: "${p.q.slice(0, 50)}…" — `); setPromptsExpanded(false); }}>
                  <div className="chat-prompt-q">{p.q}</div>
                  <div className="chat-prompt-a">"{p.a}"</div>
                  <div className="chat-prompt-hint">Tap to reply →</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="chat-msgs">
        {chatLoading && <div className="chat-empty"><p>Loading conversation…</p></div>}
        {!chatLoading && chatMsgs.length === 0 && <div className="chat-empty"><div style={{ fontSize: 28 }}>✦</div><p>Say hello to {person.name}.</p></div>}
        {!chatLoading && chatMsgs.map((m, i) => <div key={m.id || i} className={`chat-bubble ${m.sender_id === userId ? "me" : ""}`}>{m.text}</div>)}
      </div>
      {chatError && <div className="profile-save-error" style={{ margin: "0 16px" }}>⚠️ {chatError}</div>}
      <div className="chat-input-row">
        <input className="chat-input" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChatMessage()} placeholder="Say something..." />
        <button className="chat-send" onClick={sendChatMessage}>Send</button>
      </div>
    </div>
  );
}

// ─── MESSAGES PANEL ───────────────────────────────────────────────────────────
function MessagesPanel({ userId, onClose }) {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [openChat, setOpenChat] = useState(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    let active = true;
    getConnections(userId)
      .then(data => { if (active) setConnections(data || []); })
      .catch(e => { console.error(e); if (active) setLoadError("Couldn't load your messages right now."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [userId]);

  if (openChat) return (
    <div className="msgs-overlay">
      <div className="msgs-overlay-bg" onClick={onClose} />
      <div className="msgs-panel msgs-panel-chat">
        <ChatView connectionId={openChat.id} person={openChat.otherPerson} userId={userId} onBack={() => setOpenChat(null)} />
      </div>
    </div>
  );

  const visibleConnections = connections.filter(c => {
    const other = c.user1_id === userId ? c.user2 : c.user1;
    if (!other || other.id === userId) return false;
    const msgCount = Array.isArray(c.messages) ? (c.messages[0]?.count ?? 0) : 0;
    return msgCount > 0;
  });

  return (
    <div className="msgs-overlay">
      <div className="msgs-overlay-bg" onClick={onClose} />
      <div className="msgs-panel">
        <div className="msgs-panel-header"><div className="msgs-panel-title">Messages</div><button className="msgs-panel-close" onClick={onClose}>×</button></div>
        <div className="msgs-list">
          {loading && <div className="conn-empty" style={{ padding: "40px 16px" }}><p>Loading messages…</p></div>}
          {!loading && loadError && <div className="conn-empty" style={{ padding: "40px 16px" }}><p>{loadError}</p></div>}
          {!loading && !loadError && visibleConnections.length === 0 && (
            <div className="conn-empty" style={{ padding: "40px 16px" }}>
              <div style={{ fontSize: 36 }}>💬</div>
              <div className="conn-empty-title">No conversations yet</div>
              <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 6 }}>Message someone from Connections to start chatting.</p>
            </div>
          )}
          {!loading && visibleConnections.map(c => {
            const other = c.user1_id === userId ? c.user2 : c.user1;
            const initials = (other.name || "?").slice(0, 2).toUpperCase();
            const photo = (other.photo_urls || []).filter(Boolean)[0];
            return (
              <button key={c.id} className="msgs-list-row" onClick={() => setOpenChat({ id: c.id, otherPerson: other })}>
                {photo ? <img src={photo} alt="" className="msgs-list-avatar-img" /> : <div className="msgs-list-avatar">{initials}</div>}
                <div className="msgs-list-info"><div className="msgs-list-name">{other.name}{other.age ? `, ${other.age}` : ""}</div><div className="msgs-list-sub">Tap to open conversation</div></div>
                <span className="msgs-list-chevron">›</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── CONNECTIONS SCREEN ───────────────────────────────────────────────────────
function ConnectionsScreen({ city, userId, me }) {
  const [subTab, setSubTab] = useState("foryou"); // "foryou" | "byactivity"

  // For You state
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [idx, setIdx] = useState(0);
  const [viewProfile, setViewProfile] = useState(null);
  const [chatOpen, setChatOpen] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState("");
  const [resetting, setResetting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // By Activity state
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityProfileView, setActivityProfileView] = useState(null);

  const cd = CITIES[city];

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    let active = true;
    setLoading(true); setLoadError("");
    getPeople(city, userId)
      .then(data => {
        if (!active) return;
        setPeople(data || []);
        setIdx(0);
      })
      .catch(e => { console.error(e); if (active) setLoadError("Couldn't load people right now."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [city, userId, reloadKey]);

  // Use local seed people when no real users exist (demo)
  const displayPeople = people.length > 0 ? people : cd.people;

  // Build By Activity groups from local seed (+ real users when available)
  const allPeople = [...cd.people, ...people.filter(p => !cd.people.find(sp => sp.name === p.name))];
  const activityGroups = {};
  allPeople.forEach(person => {
    const things = person.city_wants || person.cityWants || person.things || [];
    things.forEach(t => {
      if (!activityGroups[t]) activityGroups[t] = [];
      if (!activityGroups[t].find(p => p.id === person.id)) activityGroups[t].push(person);
    });
  });
  // Sort activities by count desc
  const sortedActivities = Object.entries(activityGroups).sort((a, b) => b[1].length - a[1].length);

  const openChat = async (person) => {
    setConnectError(""); setConnecting(true);
    try {
      if (userId) {
        const conn = await getOrCreateConnection(userId, person.id);
        setChatOpen({ person, connectionId: conn.id });
      } else {
        // Demo mode: fake connection
        setChatOpen({ person, connectionId: `demo-${person.id}` });
      }
    } catch (e) {
      console.error(e);
      setConnectError("Couldn't start that conversation — please try again.");
    } finally { setConnecting(false); }
  };

  // Chat open
  if (chatOpen) return (
    <ChatView
      connectionId={chatOpen.connectionId}
      person={chatOpen.person}
      userId={userId}
      onBack={() => setChatOpen(null)}
    />
  );

  // Full profile view (from either tab)
  if (viewProfile) return (
    <FullProfileView
      person={viewProfile}
      city={city}
      onBack={() => setViewProfile(null)}
      onMessage={() => openChat(viewProfile)}
      connecting={connecting}
    />
  );

  if (activityProfileView) return (
    <FullProfileView
      person={activityProfileView}
      city={city}
      onBack={() => setActivityProfileView(null)}
      onMessage={() => openChat(activityProfileView)}
      connecting={connecting}
    />
  );

  const current = displayPeople[idx];

  return (
    <div style={{ paddingTop: 0 }}>
      {/* Header */}
      <div style={{ padding: "20px 0 8px" }}>
        {subTab === "foryou" ? (
          <>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4, color: "var(--text)" }}>Meet interesting people</h1>
            <p style={{ fontSize: 16, color: "var(--green2)", fontWeight: 700, margin: 0 }}>to explore your city.</p>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4, color: "var(--text)" }}>Find your people</h1>
            <p style={{ fontSize: 14, color: "var(--text3)", margin: 0 }}>People who want to do the same things as you</p>
          </>
        )}
      </div>

      {/* Tab toggle */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, border: "1.5px solid var(--border)", borderRadius: 14, overflow: "hidden", background: "var(--white)" }}>
        {[["foryou", "👤", "For You"], ["byactivity", "👥", "By Activity"]].map(([id, icon, lbl]) => (
          <button key={id}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 8px", fontSize: 14, fontWeight: 600, color: subTab === id ? "var(--green2)" : "var(--text3)", background: subTab === id ? "var(--green-light)" : "none", border: "none", borderRight: id === "foryou" ? "1px solid var(--border)" : "none", cursor: "pointer", transition: ".15s" }}
            onClick={() => { setSubTab(id); setSelectedActivity(null); }}>
            <span>{icon}</span><span>{lbl}</span>
          </button>
        ))}
      </div>

      {/* FOR YOU TAB */}
      {subTab === "foryou" && (
        <div>
          {loading && !userId && null}
          {loadError && <div className="conn-empty"><p>{loadError}</p></div>}

          {!userId && (
            <div style={{ background: "var(--green-light)", border: "1.5px solid var(--green2)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "var(--green2)", fontWeight: 600, marginBottom: 16 }}>
              Sign in to connect with real people in {cd.label}.
            </div>
          )}

          {current ? (
            <div style={{ background: "var(--white)", borderRadius: 20, overflow: "hidden", border: "1px solid var(--border)", boxShadow: "var(--shadow2)" }}>
              {/* Photo slideshow */}
              <ProfileSlideshow photos={(current.photo_urls || current.photos || []).filter(Boolean)} name={current.name} onBack={null} />

              {/* Name + location */}
              <div style={{ padding: "16px 20px 0" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{current.name}, {current.age}</div>
                    <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 2 }}>📍 {cd.label}, India</div>
                  </div>
                </div>

                {/* Interests */}
                {(current.interests || []).length > 0 && (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 14, marginBottom: 8 }}>Interests</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                      {(current.interests || []).slice(0, 7).map(i => {
                        const opt = INTEREST_OPTIONS.find(o => o.id === i);
                        return <span key={i} style={{ border: "1.5px solid var(--border)", borderRadius: 999, padding: "6px 12px", fontSize: 13, fontWeight: 500, color: "var(--text2)", background: "var(--white)" }}>{opt?.icon} {opt?.label || i}</span>;
                      })}
                    </div>
                  </>
                )}

                {/* Things to do together */}
                {(current.city_wants || current.cityWants || []).length > 0 && (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Things to do together</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 16 }}>
                      {(current.city_wants || current.cityWants || []).slice(0, 4).map(t => (
                        <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, color: "var(--text2)" }}>
                          <span style={{ fontSize: 18 }}>{ACTIVITY_ICONS[t] || "📌"}</span>
                          <span style={{ lineHeight: 1.3 }}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* View full profile + Back/Next */}
              <div style={{ padding: "12px 20px 20px", borderTop: "1px solid var(--border)" }}>
                <button style={{ width: "100%", background: "var(--green2)", color: "white", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 700, marginBottom: 10, border: "none", cursor: "pointer" }} onClick={() => openChat(current)}>
                  Message {current.name} →
                </button>
                <button style={{ width: "100%", border: "1.5px solid var(--border)", borderRadius: 12, padding: "11px", fontSize: 13, fontWeight: 600, color: "var(--text2)", background: "var(--white)", cursor: "pointer", marginBottom: 10 }} onClick={() => setViewProfile(current)}>
                  View full profile
                </button>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    style={{ flex: 1, border: "1.5px solid var(--border)", borderRadius: 12, padding: "11px", fontSize: 13, fontWeight: 600, color: idx === 0 ? "var(--text3)" : "var(--text2)", background: "var(--white)", cursor: idx === 0 ? "default" : "pointer", opacity: idx === 0 ? 0.5 : 1 }}
                    disabled={idx === 0}
                    onClick={() => setIdx(i => Math.max(0, i - 1))}>
                    ← Back
                  </button>
                  <button style={{ flex: 1, border: "1.5px solid var(--border)", borderRadius: 12, padding: "11px", fontSize: 13, fontWeight: 600, color: "var(--text2)", background: "var(--white)", cursor: "pointer" }} onClick={() => { setIdx(i => Math.min(displayPeople.length - 1, i + 1)); }}>
                    Next →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="conn-empty">
              <div style={{ fontSize: 42 }}>🎉</div>
              <div className="conn-empty-title">You're all caught up!</div>
              <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 6 }}>No more people to show right now.</p>
              <button className="conn-browse-again-btn" disabled={resetting} onClick={async () => {
                setResetting(true);
                try { if (userId) await resetPasses(userId); setIdx(0); setReloadKey(k => k + 1); }
                catch (e) { console.error(e); }
                finally { setResetting(false); }
              }}>{resetting ? "Resetting…" : "↻ Start over"}</button>
            </div>
          )}

          {connectError && <div className="profile-save-error" style={{ marginTop: 12 }}>⚠️ {connectError}</div>}
        </div>
      )}

      {/* BY ACTIVITY TAB */}
      {subTab === "byactivity" && !selectedActivity && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            {sortedActivities.map(([activity, actPeople]) => (
              <button key={activity}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, background: "var(--white)", border: "1px solid var(--border)", borderRadius: 16, boxShadow: "var(--shadow)", cursor: "pointer", textAlign: "left", width: "100%" }}
                onClick={() => setSelectedActivity(activity)}>
                {/* Icon circle */}
                <div style={{ width: 52, height: 52, borderRadius: 999, background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                  {ACTIVITY_ICONS[activity] || "📌"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>{activity}</div>
                  <div style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.4 }}>
                    {actPeople.length} {actPeople.length === 1 ? "person" : "people"} want to do this in {cd.label}
                  </div>
                </div>
                <div style={{ background: "var(--green-light)", color: "var(--green2)", borderRadius: 999, padding: "5px 12px", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {actPeople.length}
                </div>
                <span style={{ color: "var(--text3)", fontSize: 18 }}>›</span>
              </button>
            ))}
          </div>

          {/* Footer hint */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 16px", background: "var(--bg2)", borderRadius: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 18 }}>✨</span>
            <p style={{ fontSize: 13, color: "var(--text3)", margin: 0, lineHeight: 1.5 }}>
              Adding more things under "Things I want to do" in your profile helps you find people you resonate with.
            </p>
          </div>
        </div>
      )}

      {/* BY ACTIVITY — people list for selected activity */}
      {subTab === "byactivity" && selectedActivity && (
        <div>
          <button style={{ fontSize: 20, color: "var(--text2)", marginBottom: 16, background: "none", border: "none", cursor: "pointer", padding: 0 }} onClick={() => setSelectedActivity(null)}>← Back</button>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{selectedActivity}</h2>
          <p style={{ fontSize: 14, color: "var(--green2)", fontWeight: 600, marginBottom: 20 }}>
            {activityGroups[selectedActivity]?.length} {activityGroups[selectedActivity]?.length === 1 ? "person wants" : "people want"} to do this
          </p>

          {/* Activity banner */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--green-light)", border: "1.5px solid rgba(45,106,45,0.2)", borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
            <span style={{ fontSize: 28 }}>{ACTIVITY_ICONS[selectedActivity] || "📌"}</span>
            <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, lineHeight: 1.5 }}>
              Browse people who also want to {selectedActivity.toLowerCase()}.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {(activityGroups[selectedActivity] || []).map(person => {
              const photos = (person.photo_urls || person.photos || []).filter(Boolean);
              const initials = (person.name || "?").slice(0, 2).toUpperCase();
              const interests = (person.interests || []).slice(0, 4).map(i => INTEREST_OPTIONS.find(o => o.id === i)?.label || i);
              return (
                <button key={person.id}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid var(--border)", background: "none", border: "none", borderBottom: "1px solid var(--border)", cursor: "pointer", textAlign: "left", width: "100%" }}
                  onClick={() => setActivityProfileView(person)}>
                  {photos[0]
                    ? <img src={photos[0]} alt={person.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                    : <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--green-light)", color: "var(--green2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{initials}</div>
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{person.name}{person.age ? `, ${person.age}` : ""}</div>
                    <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{interests.join(" · ")}</div>
                  </div>
                  <span style={{ color: "var(--text3)", fontSize: 18, flexShrink: 0 }}>›</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PLACES TO EXPLORE SCREEN ─────────────────────────────────────────────────
function PlaceDetailView({ place, onBack, isSaved, onToggleSave }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const allPhotos = [place.img, ...(place.photos || [])].filter(Boolean);

  const handleShare = async () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address || place.name + " Mumbai")}`;
    try {
      if (navigator.share) await navigator.share({ title: place.name, url });
      else { await navigator.clipboard.writeText(url); }
    } catch (e) { if (e.name !== "AbortError") console.error(e); }
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0 14px", borderBottom: "1px solid var(--border)" }}>
        <button style={{ fontSize: 20, color: "var(--text2)", background: "none", border: "none", cursor: "pointer", padding: 0 }} onClick={onBack}>←</button>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }} onClick={() => onToggleSave(place.id)}>{isSaved ? "🔖" : "📑"}</button>
          <button style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }} onClick={handleShare}>↗</button>
        </div>
      </div>

      {/* Photo slideshow */}
      {allPhotos.length > 0 && (
        <div style={{ position: "relative", marginTop: 16, borderRadius: 16, overflow: "hidden", height: 260 }}>
          <img src={allPhotos[photoIdx]} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          {allPhotos.length > 1 && (
            <>
              {photoIdx > 0 && (
                <button onClick={() => setPhotoIdx(i => i - 1)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
              )}
              {photoIdx < allPhotos.length - 1 && (
                <button onClick={() => setPhotoIdx(i => i + 1)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
              )}
              {/* Dots */}
              <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
                {allPhotos.map((_, i) => (
                  <div key={i} onClick={() => setPhotoIdx(i)} style={{ width: i === photoIdx ? 18 : 7, height: 7, borderRadius: 4, background: i === photoIdx ? "white" : "rgba(255,255,255,0.5)", cursor: "pointer", transition: ".2s" }} />
                ))}
              </div>
              {/* Counter */}
              <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.5)", color: "white", borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 600 }}>{photoIdx + 1} / {allPhotos.length}</div>
            </>
          )}
        </div>
      )}

      {/* Name + area + category */}
      <div style={{ marginTop: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>{place.name}</h1>
            <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 3 }}>📍 {place.area}</div>
          </div>
          {place.category && (
            <span style={{ background: "var(--green-bg)", color: "var(--green2)", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{place.category}</span>
          )}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {place.tags.map(t => (
            <span key={t} style={{ background: "var(--bg2)", color: "var(--text2)", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 600 }}>{t}</span>
          ))}
        </div>

        {/* Description */}
        <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7, margin: "0 0 20px" }}>{place.desc}</p>

        {/* Address + phone if present */}
        {(place.address || place.phone) && (
          <div style={{ border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
            {place.address && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 16px", borderBottom: place.phone ? "1px solid var(--border)" : "none" }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>📍</span>
                <span style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>{place.address}</span>
              </div>
            )}
            {place.phone && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>📞</span>
                <span style={{ fontSize: 13, color: "var(--text2)" }}>{place.phone}</span>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {place.address && (
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address || place.name)}`} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", background: "var(--green2)", color: "white", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              🗺️ Directions
            </a>
          )}
          <button onClick={handleShare}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", background: "var(--white)", color: "var(--text)", border: "1.5px solid var(--border)", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            ↗ Share
          </button>
        </div>
      </div>
    </div>
  );
}

function PlacesToExploreScreen({ city, userId, userName }) {
  const places = PLACES_TO_EXPLORE[city] || [];
  const [saved, setSaved] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [openPlace, setOpenPlace] = useState(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitForm, setSubmitForm] = useState({ name: "", area: "", desc: "" });
  const [communityPlaces, setCommunityPlaces] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);

  const hasCategories = places.some(p => p.category);
  const allTags = hasCategories
    ? ["All", ...Array.from(new Set(places.map(p => p.category).filter(Boolean)))]
    : ["All", ...Array.from(new Set(places.flatMap(p => p.tags)))];

  const filtered = places.filter(p => {
    const matchSearch = !searchQuery.trim() || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.area.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchTag = activeTag === "All" || p.category === activeTag || p.tags.includes(activeTag);
    return matchSearch && matchTag;
  });

  const handleSubmit = async () => {
    if (!submitForm.name.trim() || !submitForm.area.trim()) return;
    setSubmitting(true);
    try {
      if (userId) {
        const place = await submitCommunityPlace(userId, userName || "Someone", {
          city, name: submitForm.name.trim(), area: submitForm.area.trim(),
          cuisine: "Place to Explore", description: submitForm.desc.trim(), photoUrl: null,
        });
        setCommunityPlaces(p => [place, ...p]);
      } else {
        setCommunityPlaces(p => [{ id: Date.now(), name: submitForm.name.trim(), area: submitForm.area.trim(), description: submitForm.desc.trim(), isCommunity: true }]);
      }
      setSubmitDone(true);
      setSubmitForm({ name: "", area: "", desc: "" });
      setTimeout(() => { setSubmitDone(false); setSubmitOpen(false); }, 1500);
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  // Show detail view
  if (openPlace) return (
    <PlaceDetailView
      place={openPlace}
      onBack={() => setOpenPlace(null)}
      isSaved={!!saved[openPlace.id]}
      onToggleSave={id => setSaved(s => ({ ...s, [id]: !s[id] }))}
    />
  );

  return (
    <div style={{ paddingTop: 20, paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>Places to explore</h1>
        <p style={{ fontSize: 13, color: "var(--text3)" }}>The best of {city === "nyc" ? "New York City" : "Mumbai"}, curated by the community</p>
      </div>

      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px solid var(--border)", borderRadius: 12, padding: "10px 14px", background: "var(--white)", marginBottom: 14 }}>
        <span style={{ fontSize: 14, color: "var(--text3)" }}>🔍</span>
        <input style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", background: "none", color: "var(--text)" }} placeholder="Search places or tags" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        {searchQuery && <button style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--bg2)", border: "none", fontSize: 14, cursor: "pointer" }} onClick={() => setSearchQuery("")}>×</button>}
      </div>

      {/* Category filter pills */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 14, marginBottom: 4 }}>
        {allTags.map(tag => (
          <button key={tag}
            style={{ flexShrink: 0, border: "1.5px solid var(--border)", borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 600, color: activeTag === tag ? "white" : "var(--text3)", background: activeTag === tag ? "var(--green2)" : "var(--white)", cursor: "pointer", transition: ".15s", borderColor: activeTag === tag ? "var(--green2)" : "var(--border)" }}
            onClick={() => setActiveTag(tag)}>{tag}</button>
        ))}
      </div>

      {/* Places list — each row is clickable */}
      {filtered.map(place => (
        <div key={place.id}
          style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
          onClick={() => setOpenPlace(place)}>
          <div style={{ flexShrink: 0, width: 120, height: 90, borderRadius: 12, overflow: "hidden" }}>
            <img src={place.img} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{place.name}</div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 1 }}>📍 {place.area}</div>
              </div>
              <button style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", flexShrink: 0, padding: 0 }}
                onClick={e => { e.stopPropagation(); setSaved(s => ({ ...s, [place.id]: !s[place.id] })); }}>
                {saved[place.id] ? "🔖" : "📑"}
              </button>
            </div>
            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5, margin: "0 0 8px" }}>
              {place.desc.length > 100 ? place.desc.slice(0, 100) + "…" : place.desc}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
              {place.tags.map(t => (
                <span key={t} style={{ background: "var(--green-bg)", color: "var(--green2)", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700 }}>{t}</span>
              ))}
              <span style={{ marginLeft: "auto", fontSize: 18, color: "var(--text3)" }}>›</span>
            </div>
          </div>
        </div>
      ))}

      {/* Community places */}
      {communityPlaces.map((place, i) => (
        <div key={i} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
          <div style={{ flexShrink: 0, width: 120, height: 90, borderRadius: 12, background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🏙️</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{place.name}</div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 1 }}>📍 {place.area} · Added by community</div>
            {place.description && <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 6, lineHeight: 1.5 }}>{place.description}</p>}
          </div>
        </div>
      ))}

      {filtered.length === 0 && communityPlaces.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)" }}>
          <div style={{ fontSize: 32 }}>🔍</div>
          <p style={{ marginTop: 10, fontSize: 14 }}>No places match "{searchQuery}"</p>
        </div>
      )}

      {/* Submit CTA */}
      <div style={{ marginTop: 24, background: "var(--bg2)", borderRadius: 16, padding: "18px 20px", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Know a great spot?</div>
        <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 12, lineHeight: 1.5 }}>Add it to the map and help others discover the city.</div>
        <button style={{ background: "var(--green2)", color: "white", borderRadius: 999, padding: "10px 20px", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }} onClick={() => setSubmitOpen(o => !o)}>
          {submitOpen ? "Close" : "+ Add a place"}
        </button>
        {submitOpen && (
          <div style={{ marginTop: 14 }}>
            {submitDone ? (
              <div style={{ textAlign: "center", padding: "12px", fontSize: 15, fontWeight: 700, color: "var(--green2)" }}>✓ Added! Thanks for sharing.</div>
            ) : (
              <>
                <input className="ob-input" style={{ marginBottom: 10 }} placeholder="Place name" value={submitForm.name} onChange={e => setSubmitForm(f => ({ ...f, name: e.target.value }))} />
                <input className="ob-input" style={{ marginBottom: 10 }} placeholder="Area / neighbourhood" value={submitForm.area} onChange={e => setSubmitForm(f => ({ ...f, area: e.target.value }))} />
                <textarea className="ob-input" rows={3} style={{ resize: "none", marginBottom: 10 }} placeholder="What makes it special?" value={submitForm.desc} onChange={e => setSubmitForm(f => ({ ...f, desc: e.target.value }))} />
                <button style={{ width: "100%", background: "var(--green)", color: "white", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }} disabled={submitting || !submitForm.name.trim() || !submitForm.area.trim()} onClick={handleSubmit}>
                  {submitting ? "Adding…" : "Add this place"}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
}

// ─── FOOD DETAIL ──────────────────────────────────────────────────────────────
function FoodDetail({ restaurant, onBack, userId, userName, isSaved, onToggleSave }) {
  const [shareFeedback, setShareFeedback] = useState("");
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [note, setNote] = useState("");
  const [favoriteItem, setFavoriteItem] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const SHARED_EXP_NAMES = ["Rohan", "Priya", "Arjun", "Meera", "Karan", "Aditi", "Rahul", "Kavya", "Dev", "Nikhil"];

  useEffect(() => {
    let active = true;
    getFoodExperiences(restaurant.name)
      .then(data => { if (active) setExperiences(data || []); })
      .catch(e => console.error(e))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [restaurant.name]);

  const handleShare = async () => {
    const shareUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address || restaurant.name + " " + restaurant.hood)}`;
    try {
      if (navigator.share) await navigator.share({ title: restaurant.name, url: shareUrl });
      else { await navigator.clipboard.writeText(shareUrl); setShareFeedback("Link copied!"); setTimeout(() => setShareFeedback(""), 2000); }
    } catch (e) { if (e.name !== "AbortError") console.error(e); }
  };

  const handleSubmit = async () => {
    if (!userId) { setSubmitError("Sign in to share your experience."); return; }
    if (!photoFile && !note.trim() && !favoriteItem.trim()) { setSubmitError("Add a photo, note, or favorite item."); return; }
    setSubmitting(true); setSubmitError("");
    try {
      let photoUrl = null;
      if (photoFile) photoUrl = await uploadFoodExperiencePhoto(userId, photoFile);
      const saved = await shareFoodExperience(userId, userName || "Someone", restaurant.name, { photoUrl, note: note.trim(), favoriteItem: favoriteItem.trim() });
      setExperiences(p => [saved, ...p]);
      setNote(""); setFavoriteItem(""); setPhotoFile(null); setPhotoPreview(null); setFormOpen(false);
    } catch (e) { console.error(e); setSubmitError("Couldn't share that — please try again."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="detail-root">
      <div className="detail-header">
        <button className="detail-back" onClick={onBack}>←</button>
        <div className="detail-header-title"><div>Spot details</div></div>
        <div className="detail-header-actions">
          <button className="detail-action-btn" onClick={() => onToggleSave(restaurant.name)}>{isSaved ? "🔖" : "📑"}</button>
          <button className="detail-action-btn" onClick={handleShare}>↗</button>
        </div>
      </div>
      <div className="detail-hero-img-wrap">{restaurant.img ? <img src={restaurant.img} alt={restaurant.name} className="detail-hero-img" /> : <div className="detail-hero-img detail-hero-img-placeholder">📍</div>}</div>
      <div className="detail-body">
        <div className="detail-name-row">
          <div>
            <div className="detail-name">{restaurant.name}</div>
            {restaurant.hood && <div className="detail-place-area">📍 {restaurant.hood}</div>}
          </div>
        </div>
        <div className="detail-meta">{restaurant.cuisine}</div>
        <p className="detail-about">{restaurant.desc}</p>
        {shareFeedback && <div className="share-feedback">✓ {shareFeedback}</div>}
        <div className="detail-actions-row">
          {restaurant.phone && <a className="detail-act-item" href={`tel:${restaurant.phone}`}><span className="detail-act-icon">📞</span><span className="detail-act-label">Call</span></a>}
          <a className="detail-act-item" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address || restaurant.name)}`} target="_blank" rel="noopener noreferrer"><span className="detail-act-icon">🗺️</span><span className="detail-act-label">Directions</span></a>
          <button className="detail-act-item" onClick={handleShare}><span className="detail-act-icon">↗</span><span className="detail-act-label">Share</span></button>
          <button className="detail-act-item" onClick={() => onToggleSave(restaurant.name)}><span className="detail-act-icon">{isSaved ? "🔖" : "📑"}</span><span className="detail-act-label">{isSaved ? "Saved" : "Save"}</span></button>
        </div>
        {(restaurant.address || restaurant.phone) && (
          <div className="detail-info-card">
            {restaurant.address && <div className="detail-info-row"><span className="detail-info-icon">📍</span><span>{restaurant.address}</span></div>}
            {restaurant.address && restaurant.phone && <div className="detail-info-divider" />}
            {restaurant.phone && <div className="detail-info-row"><span className="detail-info-icon">📞</span><span>{restaurant.phone}</span></div>}
          </div>
        )}
        {restaurant.sharedExp && (
          <>
            <div className="detail-section-title" style={{ marginTop: 22 }}>Shared experience</div>
            <div className="detail-shared-exp-card">
              <div className="detail-shared-exp-user">
                <div className="detail-shared-exp-avatar">{SHARED_EXP_NAMES[restaurant.id % SHARED_EXP_NAMES.length].slice(0, 2).toUpperCase()}</div>
                <span className="detail-shared-exp-name">{SHARED_EXP_NAMES[restaurant.id % SHARED_EXP_NAMES.length]}</span>
              </div>
              <p className="detail-shared-exp-text">{restaurant.sharedExp}</p>
            </div>
          </>
        )}
        {restaurant.tryThis && (
          <>
            <div className="detail-section-title" style={{ marginTop: 22 }}>Try these</div>
            <div className="detail-try-items">
              {restaurant.tryThis.split(" and ").map((item, i) => (
                <div key={i} className="detail-try-item">
                  {(restaurant.photos || [])[i] ? <img src={(restaurant.photos || [])[i]} alt={item.trim()} className="detail-try-img" /> : <div className="detail-try-img detail-try-img-placeholder">🍽️</div>}
                  <div className="detail-try-label">{item.trim()}</div>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="detail-divider" style={{ marginTop: 24 }} />
        <div className="detail-photos-header">
          <span className="detail-section-title">Community experiences</span>
          <button className="detail-viewall" onClick={() => setFormOpen(o => !o)}>{formOpen ? "Cancel" : "Add yours"}</button>
        </div>
        {formOpen && (
          <div className="experience-form">
            {submitError && <div className="profile-save-error" style={{ marginTop: 0 }}>⚠️ {submitError}</div>}
            <label className="experience-photo-picker">
              {photoPreview ? <img src={photoPreview} alt="" className="experience-photo-preview" /> : <span>📷 Add a photo</span>}
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; setPhotoFile(f || null); setPhotoPreview(f ? URL.createObjectURL(f) : null); }} />
            </label>
            <input className="ob-input" style={{ marginTop: 10 }} placeholder="Your favorite item" value={favoriteItem} onChange={e => setFavoriteItem(e.target.value)} />
            <textarea className="ob-input experience-textarea" style={{ marginTop: 10 }} placeholder="What was it like?" value={note} onChange={e => setNote(e.target.value)} rows={3} />
            <button className="filter-apply" style={{ marginTop: 12 }} disabled={submitting} onClick={handleSubmit}>{submitting ? "Sharing…" : "Share with the community"}</button>
          </div>
        )}
        {loading && <div className="food-empty-state" style={{ padding: "20px 0" }}>Loading experiences…</div>}
        {!loading && experiences.length === 0 && !formOpen && <div className="food-empty-state" style={{ padding: "20px 0" }}>No one's shared an experience here yet — be the first.</div>}
        {!loading && experiences.map(exp => (
          <div key={exp.id} className="experience-card">
            {exp.photo_url && <img src={exp.photo_url} alt="" className="experience-card-img" />}
            <div className="experience-card-body">
              <div className="experience-card-row"><span className="experience-card-user">{exp.user_name}</span></div>
              {exp.favorite_item && <div className="experience-card-fav">⭐ {exp.favorite_item}</div>}
              {exp.note && <p className="experience-card-note">{exp.note}</p>}
            </div>
          </div>
        ))}
        <div style={{ height: 90 }} />
      </div>
      <div className="detail-share-cta" onClick={() => setFormOpen(o => !o)}>
        <span className="detail-share-cta-icon">✏️</span>
        <div><div className="detail-share-cta-title">Share your experience</div><div className="detail-share-cta-sub">Help others discover great places in the city.</div></div>
        <span className="detail-share-cta-arrow">›</span>
      </div>
    </div>
  );
}

// ─── FOOD SCREEN ──────────────────────────────────────────────────────────────
function FoodScreen({ city, userCuisines, userBudget, userId, userName, savedPlaces, onToggleSave }) {
  const [detailOpen, setDetailOpen] = useState(null);
  const [likes, setLikes] = useState({});
  const [activeArea, setActiveArea] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [communityPlaces, setCommunityPlaces] = useState([]);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitTab, setSubmitTab] = useState("experience"); // "experience" | "newplace"
  const cd = CITIES[city];

  useEffect(() => {
    let active = true;
    getCommunityPlaces(city).then(data => { if (active) setCommunityPlaces(data || []); }).catch(e => console.error(e));
    return () => { active = false; };
  }, [city]);

  if (detailOpen) return (
    <FoodDetail
      restaurant={detailOpen} onBack={() => setDetailOpen(null)}
      userId={userId} userName={userName}
      isSaved={(savedPlaces || []).includes(detailOpen.name)}
      onToggleSave={onToggleSave}
    />
  );

  const cityAreas = ["All", ...Array.from(new Set(cd.food.map(r => r.hood)))];
  const matchesSearch = p => !searchQuery.trim() || [p.name, p.cuisine, p.hood].some(f => f?.toLowerCase().includes(searchQuery.toLowerCase()));
  const matchesArea = p => activeArea === "All" || p.hood === activeArea;
  const filtered = cd.food.filter(r => matchesArea(r) && matchesSearch(r));
  const sorted = userCuisines?.length ? [...filtered].sort((a, b) => scoreFoodPlace(b, userCuisines, userBudget) - scoreFoodPlace(a, userCuisines, userBudget)) : filtered;
  const recommended = sorted.slice(0, 10);
  const explore = sorted.slice(10);

  return (
    <div style={{ paddingTop: 20, paddingBottom: 80 }}>
      {/* Search + area */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
        <select style={{ border: "1.5px solid var(--border)", borderRadius: 12, padding: "10px 28px 10px 12px", fontSize: 13, fontWeight: 700, color: "var(--text)", background: "var(--white)", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23666' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", cursor: "pointer", flexShrink: 0 }} value={activeArea} onChange={e => setActiveArea(e.target.value)}>
          {cityAreas.map(a => <option key={a} value={a}>{a === "All" ? "All areas" : a}</option>)}
        </select>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, border: "1.5px solid var(--border)", borderRadius: 12, padding: "10px 14px", background: "var(--white)" }}>
          <span style={{ fontSize: 14, color: "var(--text3)" }}>🔍</span>
          <input style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", background: "none" }} placeholder="Search food places" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          {searchQuery && <button style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--bg2)", border: "none", fontSize: 14, cursor: "pointer" }} onClick={() => setSearchQuery("")}>×</button>}
        </div>
      </div>

      {/* Hero banner */}
      <div style={{ background: "var(--bg2)", borderRadius: 16, padding: "22px 20px", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", lineHeight: 1.3 }}>Discover the city's best places</div>
        <div style={{ fontSize: 14, color: "var(--text2)", marginTop: 6 }}>Community-driven shared experiences</div>
      </div>

      {/* Recommendations */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Recommendations for you</div>
      </div>
      <div className="food-hscroll">
        {recommended.length === 0 && <div className="food-empty-state">No matches{searchQuery ? ` for "${searchQuery}"` : ""}.</div>}
        {recommended.map(r => (
          <div key={r.id} className="food-card" onClick={() => setDetailOpen(r)}>
            <div className="food-card-img-wrap">
              {r.img ? <img src={r.img} alt={r.name} className="food-card-img" /> : <div className="food-card-img food-card-img-placeholder">🍽️</div>}
              <button className="heart-btn" onClick={e => { e.stopPropagation(); setLikes(p => ({ ...p, [r.id]: !p[r.id] })); }}>{likes[r.id] ? "❤️" : "🤍"}</button>
              {r.tag && <div className="food-tag-pill">{r.tag}</div>}
            </div>
            <div className="food-card-body">
              <div className="food-name">{r.name}</div>
              <div className="food-card-hood">📍 {r.hood}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Explore */}
      {explore.length > 0 && (
        <>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 28, marginBottom: 14 }}>Explore experiences</div>
          {explore.map(r => (
            <div key={r.id} className="exp-list-row" onClick={() => setDetailOpen(r)}>
              <div className="exp-list-img-wrap">
                {r.img ? <img src={r.img} alt={r.name} className="exp-list-img" /> : <div className="exp-list-img exp-list-img-placeholder">🍽️</div>}
              </div>
              <div className="exp-list-body">
                <div className="exp-list-top"><span className="exp-list-name">{r.name}</span><span className="exp-list-cuisine">{r.cuisine}</span></div>
                <div className="exp-list-area">📍 {r.hood}</div>
                {r.sharedExp && <p className="exp-list-exp">{r.sharedExp.length > 90 ? r.sharedExp.slice(0, 90) + "…" : r.sharedExp}</p>}
                {r.tryThis && <div className="exp-list-try"><span className="exp-list-try-label">Try:</span> {r.tryThis.split(" and ").slice(0, 2).join(" and ")}</div>}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Community-submitted new places (pending → won't show until approved, this is just local state preview) */}
      {communityPlaces.length > 0 && (
        <>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 28, marginBottom: 14 }}>Community-added places</div>
          {communityPlaces.map(p => (
            <div key={p.id} className="exp-list-row">
              <div className="exp-list-img-wrap">
                {p.photo_url ? <img src={p.photo_url} alt={p.name} className="exp-list-img" /> : <div className="exp-list-img exp-list-img-placeholder">🍽️</div>}
              </div>
              <div className="exp-list-body">
                <div className="exp-list-top"><span className="exp-list-name">{p.name}</span><span className="exp-list-cuisine">{p.cuisine}</span></div>
                <div className="exp-list-area">📍 {p.area}</div>
                {p.description && <p className="exp-list-exp">{p.description}</p>}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Share / Add CTA */}
      <div className="food-share-sticky" onClick={() => setSubmitOpen(o => !o)}>
        <span className="food-share-sticky-icon">✏️</span>
        <div><div className="food-share-sticky-title">Share or add a place</div><div className="food-share-sticky-sub">Help others discover great places.</div></div>
        <span className="food-share-sticky-plus">{submitOpen ? "×" : "+"}</span>
      </div>
      {submitOpen && (
        <div className="share-sheet-overlay" onClick={() => setSubmitOpen(false)}>
          <div className="share-sheet" onClick={e => e.stopPropagation()}>
            <div className="share-sheet-handle" />
            <div className="share-sheet-tabs">
              <button className={`share-sheet-tab ${submitTab === "experience" ? "active" : ""}`} onClick={() => setSubmitTab("experience")}>Share an Experience</button>
              <button className={`share-sheet-tab ${submitTab === "newplace" ? "active" : ""}`} onClick={() => setSubmitTab("newplace")}>Add a New Place</button>
            </div>
            {submitTab === "experience"
              ? <ShareFoodExperienceForm cd={cd} userId={userId} userName={userName} onDone={() => setSubmitOpen(false)} />
              : <SubmitFoodPlaceForm city={city} userId={userId} userName={userName} onSubmitted={place => setCommunityPlaces(p => [place, ...p])} />
            }
          </div>
        </div>
      )}
    </div>
  );
}

function ShareFoodExperienceForm({ cd, userId, userName, onDone }) {
  const [selectedPlace, setSelectedPlace] = useState("");
  const [favoriteItem, setFavoriteItem] = useState("");
  const [note, setNote] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!userId) { setError("Sign in to share your experience."); return; }
    if (!selectedPlace) { setError("Please select a place first."); return; }
    if (!photoFile && !note.trim() && !favoriteItem.trim()) { setError("Add a photo, note, or favorite item."); return; }
    setSubmitting(true); setError("");
    try {
      let photoUrl = null;
      if (photoFile) photoUrl = await uploadFoodExperiencePhoto(userId, photoFile);
      await shareFoodExperience(userId, userName || "Someone", selectedPlace, { photoUrl, note: note.trim(), favoriteItem: favoriteItem.trim() });
      setDone(true);
      setTimeout(onDone, 1200);
    } catch (e) {
      console.error(e);
      setError("Couldn't share that — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return <div style={{ textAlign: "center", padding: "24px 0" }}><div style={{ fontSize: 32 }}>✓</div><div style={{ fontWeight: 700, marginTop: 6 }}>Thanks for sharing!</div></div>;

  return (
    <div style={{ paddingBottom: 8 }}>
      {error && <div className="profile-save-error">⚠️ {error}</div>}
      <select className="ob-input ob-select" style={{ marginBottom: 10 }} value={selectedPlace} onChange={e => setSelectedPlace(e.target.value)}>
        <option value="">Select a place...</option>
        {cd.food.map(p => <option key={p.id} value={p.name}>{p.name} — {p.hood}</option>)}
      </select>
      <label className="experience-photo-picker">
        {photoPreview ? <img src={photoPreview} alt="" className="experience-photo-preview" /> : <span>📷 Add a photo</span>}
        <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; setPhotoFile(f || null); setPhotoPreview(f ? URL.createObjectURL(f) : null); }} />
      </label>
      <input className="ob-input" style={{ marginTop: 10 }} placeholder="Your favorite item" value={favoriteItem} onChange={e => setFavoriteItem(e.target.value)} />
      <textarea className="ob-input experience-textarea" style={{ marginTop: 10 }} placeholder="What was it like?" value={note} onChange={e => setNote(e.target.value)} rows={3} />
      <button className="filter-apply" style={{ marginTop: 12 }} disabled={submitting} onClick={handleSubmit}>{submitting ? "Sharing…" : "Share with the community"}</button>
    </div>
  );
}

function SubmitFoodPlaceForm({ city, userId, userName, onSubmitted }) {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!userId) { setError("Sign in to add a place."); return; }
    if (!name.trim() || !area.trim()) { setError("Name and area are required."); return; }
    setSubmitting(true); setError("");
    try {
      let photoUrl = null;
      if (photoFile) photoUrl = await uploadCommunityPlacePhoto(userId, photoFile);
      const place = await submitCommunityPlace(userId, userName || "Someone", {
        city, name: name.trim(), area: area.trim(), cuisine: cuisine.trim(), description: description.trim(), photoUrl,
      });
      setDone(true);
      onSubmitted(place);
    } catch (e) {
      console.error(e);
      setError("Couldn't submit that — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      <div style={{ fontSize: 32 }}>✓</div>
      <div style={{ fontWeight: 700, marginTop: 6 }}>Submitted for review!</div>
      <p style={{ fontSize: 13, color: "var(--text3)", marginTop: 6, lineHeight: 1.5, padding: "0 10px" }}>Our team reviews every new place before it goes live, to keep recommendations trustworthy. You'll see it appear here once approved.</p>
    </div>
  );

  return (
    <div style={{ paddingBottom: 8 }}>
      {error && <div className="profile-save-error">⚠️ {error}</div>}
      <label className="experience-photo-picker">
        {photoPreview ? <img src={photoPreview} alt="" className="experience-photo-preview" /> : <span>📷 Add a photo</span>}
        <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; setPhotoFile(f || null); setPhotoPreview(f ? URL.createObjectURL(f) : null); }} />
      </label>
      <input className="ob-input" style={{ marginTop: 10 }} placeholder="Place name*" value={name} onChange={e => setName(e.target.value)} />
      <input className="ob-input" style={{ marginTop: 10 }} placeholder="Area / neighbourhood*" value={area} onChange={e => setArea(e.target.value)} />
      <input className="ob-input" style={{ marginTop: 10 }} placeholder="Cuisine" value={cuisine} onChange={e => setCuisine(e.target.value)} />
      <textarea className="ob-input experience-textarea" style={{ marginTop: 10 }} placeholder="What's your experience there?" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
      <div style={{ fontSize: 12, color: "var(--text3)", margin: "10px 0 12px", lineHeight: 1.5 }}>New places are reviewed by our team before they go live.</div>
      <button className="filter-apply" disabled={submitting} onClick={handleSubmit}>{submitting ? "Submitting…" : "Submit for review"}</button>
    </div>
  );
}

// ─── EVENTS SCREEN ────────────────────────────────────────────────────────────
// ─── WHAT'S HAPPENING ── community-submitted events ───────────────────────────
// Users advertise house parties, meetups, etc. Submissions require admin
// approval before going public (status: 'pending' → 'approved'), matching the
// same safety pattern as community food places.

const EVENT_CATEGORIES = ["House Party", "City Meetup", "Workshop", "Live Music", "Sports & Fitness", "Food & Drinks", "Networking", "Other"];

function EventDetailView({ event, onBack, userId, onToggleInterest, isInterested, interestCount }) {
  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: event.name, text: event.description });
      else await navigator.clipboard.writeText(event.name);
    } catch (e) { if (e.name !== "AbortError") console.error(e); }
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0 14px", borderBottom: "1px solid var(--border)" }}>
        <button style={{ fontSize: 20, color: "var(--text2)", background: "none", border: "none", cursor: "pointer", padding: 0 }} onClick={onBack}>←</button>
        <button style={{ fontSize: 13, fontWeight: 700, color: "var(--text2)", border: "1.5px solid var(--border)", borderRadius: 999, padding: "6px 14px", background: "var(--white)", cursor: "pointer" }} onClick={handleShare}>↗ Share</button>
      </div>

      {event.photo_url ? (
        <img src={event.photo_url} alt={event.name} style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: 16, marginTop: 16, display: "block" }} />
      ) : (
        <div style={{ width: "100%", height: 180, borderRadius: 16, marginTop: 16, background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🎉</div>
      )}

      <div style={{ paddingTop: 18 }}>
        <span style={{ background: "var(--green-bg)", color: "var(--green2)", borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>{event.category}</span>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "12px 0 10px", lineHeight: 1.25 }}>{event.name}</h1>
        <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.65, marginBottom: 20 }}>{event.description}</p>

        <div style={{ border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", marginBottom: 18 }}>
          {[
            ["📅", "Date & time", event.event_date],
            ["📍", "Location", event.location],
            ["🎟️", "Entry", event.entry_fee ? event.entry_fee : "Free"],
          ].filter(([, , v]) => v).map(([icon, label, val], i, arr) => (
            <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 16px", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{val}</div>
              </div>
            </div>
          ))}
        </div>

        {(event.contact_info || event.payment_info) && (
          <div style={{ border: "1.5px solid var(--green2)", background: "var(--green-light)", borderRadius: 14, padding: 16, marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--green2)", letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 8 }}>Contact the organiser</div>
            {event.contact_info && <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: event.payment_info ? 6 : 0 }}>📞 {event.contact_info}</div>}
            {event.payment_info && <div style={{ fontSize: 13, color: "var(--text2)" }}>💳 {event.payment_info}</div>}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, fontSize: 13, color: "var(--text3)" }}>
          <span>{interestCount} {interestCount === 1 ? "person" : "people"} interested</span>
        </div>

        <button
          style={{ width: "100%", background: isInterested ? "var(--bg2)" : "var(--green2)", color: isInterested ? "var(--text2)" : "white", borderRadius: 14, padding: 15, fontSize: 15, fontWeight: 800, border: "none", cursor: userId ? "pointer" : "not-allowed", opacity: userId ? 1 : 0.6, transition: ".15s" }}
          disabled={!userId}
          onClick={onToggleInterest}>
          {!userId ? "Sign in to show interest" : isInterested ? "✓ You're interested" : "I'm interested"}
        </button>

        <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 10, textAlign: "center" }}>
          Posted by {event.submitter_name || "a NearMet user"}
        </div>
      </div>
    </div>
  );
}

function CreateEventForm({ city, userId, userName, onDone }) {
  const [form, setForm] = useState({ name: "", category: "House Party", location: "", event_date: "", description: "", contact_info: "", payment_info: "", entry_fee: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!userId) { setError("Sign in to post an event."); return; }
    if (!form.name.trim() || !form.location.trim() || !form.event_date.trim()) { setError("Event name, location, and date/time are required."); return; }
    setSubmitting(true); setError("");
    try {
      let photoUrl = null;
      if (photoFile) photoUrl = await uploadEventPhoto(userId, photoFile);
      await submitCommunityEvent(userId, userName || "Someone", {
        city,
        name: form.name.trim(),
        category: form.category,
        location: form.location.trim(),
        event_date: form.event_date.trim(),
        description: form.description.trim(),
        contact_info: form.contact_info.trim(),
        payment_info: form.payment_info.trim(),
        entry_fee: form.entry_fee.trim(),
        photo_url: photoUrl,
      });
      setDone(true);
      setTimeout(onDone, 1200);
    } catch (e) {
      console.error(e);
      setError("Couldn't submit that — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      <div style={{ fontSize: 32 }}>✓</div>
      <div style={{ fontWeight: 700, marginTop: 6 }}>Your event is live!</div>
      <p style={{ fontSize: 13, color: "var(--text3)", marginTop: 6, lineHeight: 1.5, padding: "0 10px" }}>People can now see it and show their interest.</p>
    </div>
  );

  return (
    <div style={{ paddingBottom: 8 }}>
      {error && <div className="profile-save-error">⚠️ {error}</div>}

      <label className="experience-photo-picker" style={{ marginBottom: 10 }}>
        {photoPreview ? <img src={photoPreview} alt="" className="experience-photo-preview" /> : <span>📷 Add a poster or photo</span>}
        <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; setPhotoFile(f || null); setPhotoPreview(f ? URL.createObjectURL(f) : null); }} />
      </label>

      <input className="ob-input" style={{ marginBottom: 10 }} placeholder="Event name*" value={form.name} onChange={e => set("name", e.target.value)} />

      <select className="ob-input ob-select" style={{ marginBottom: 10 }} value={form.category} onChange={e => set("category", e.target.value)}>
        {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <input className="ob-input" style={{ marginBottom: 10 }} placeholder="Location*" value={form.location} onChange={e => set("location", e.target.value)} />
      <input className="ob-input" style={{ marginBottom: 10 }} placeholder="Date & time* (e.g. Sat 12 Jul, 8 PM)" value={form.event_date} onChange={e => set("event_date", e.target.value)} />
      <textarea className="ob-input experience-textarea" rows={3} style={{ marginBottom: 10 }} placeholder="What's it about? Who should come?" value={form.description} onChange={e => set("description", e.target.value)} />
      <input className="ob-input" style={{ marginBottom: 10 }} placeholder="Entry fee (e.g. ₹500, or leave blank if free)" value={form.entry_fee} onChange={e => set("entry_fee", e.target.value)} />
      <input className="ob-input" style={{ marginBottom: 10 }} placeholder="Contact info (phone, Instagram, etc.)" value={form.contact_info} onChange={e => set("contact_info", e.target.value)} />
      <input className="ob-input" style={{ marginBottom: 12 }} placeholder="Payment info (UPI ID, link, etc. — optional)" value={form.payment_info} onChange={e => set("payment_info", e.target.value)} />

      <button className="filter-apply" disabled={submitting} onClick={handleSubmit}>{submitting ? "Posting…" : "Post event"}</button>
    </div>
  );
}

// Sample event shown when no real events exist yet, so the flow is visible immediately.
// This is local-only (not in Supabase) — toggling interest on it just updates local state
// and won't persist, since it has no real event_id in the database.
const SAMPLE_EVENT = {
  id: "sample-1",
  isSample: true,
  name: "Saturday Rooftop Hangout",
  category: "House Party",
  location: "Bandra West, Mumbai",
  event_date: "Sat 5 Jul, 7:00 PM",
  description: "Casual rooftop get-together — bring a drink, meet some new people, good music playing all night. No pressure, just good vibes and good company.",
  entry_fee: "",
  contact_info: "Message on the app or ping +91 98765 43210",
  payment_info: "",
  photo_url: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=700&q=80",
  submitter_name: "Priya",
};

function EventsScreen({ city, userId, userName }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [openEvent, setOpenEvent] = useState(null);
  const [activeCat, setActiveCat] = useState("All");
  const [createOpen, setCreateOpen] = useState(false);
  const [interested, setInterested] = useState({}); // local optimistic state: eventId -> bool
  const [interestCounts, setInterestCounts] = useState({ "sample-1": 7 }); // eventId -> count, sample event starts with 7

  useEffect(() => {
    let active = true;
    setLoading(true); setLoadError("");
    getCommunityEvents(city)
      .then(async data => {
        if (!active) return;
        setEvents(data || []);
        // fetch interest counts for each event
        const counts = {};
        await Promise.all((data || []).map(async e => {
          try { counts[e.id] = await getCommunityEventInterestCount(e.id); } catch { counts[e.id] = 0; }
        }));
        if (active) setInterestCounts(p => ({ ...p, ...counts }));
      })
      .catch(e => { console.error(e); if (active) setLoadError("Couldn't load events right now."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [city]);

  // Show the sample event whenever there are no real events yet, so the flow is visible.
  const displayEvents = events.length > 0 ? events : [SAMPLE_EVENT];

  const toggleInterest = async (eventId) => {
    const wasInterested = !!interested[eventId];
    setInterested(p => ({ ...p, [eventId]: !wasInterested }));
    setInterestCounts(p => ({ ...p, [eventId]: (p[eventId] || 0) + (wasInterested ? -1 : 1) }));
    if (eventId === "sample-1") return; // local-only, nothing to persist
    if (!userId) return;
    try { await toggleCommunityEventInterest(userId, eventId); }
    catch (e) {
      console.error(e);
      // revert on failure
      setInterested(p => ({ ...p, [eventId]: wasInterested }));
      setInterestCounts(p => ({ ...p, [eventId]: (p[eventId] || 0) + (wasInterested ? 1 : -1) }));
    }
  };

  const filtered = activeCat === "All" ? displayEvents : displayEvents.filter(e => e.category === activeCat);

  if (openEvent) return (
    <EventDetailView
      event={openEvent} onBack={() => setOpenEvent(null)} userId={openEvent.isSample ? "sample" : userId}
      isInterested={!!interested[openEvent.id]}
      interestCount={interestCounts[openEvent.id] ?? 0}
      onToggleInterest={() => toggleInterest(openEvent.id)}
    />
  );

  return (
    <div style={{ paddingTop: 20, paddingBottom: 100 }}>
      {/* Headline / explainer */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>What's happening</h1>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.5 }}>
          A space for the community to advertise house parties, city meetups, and other gatherings in {city === "nyc" ? "New York" : "Mumbai"}. Found something you like? Show your interest or reach out directly to the organiser.
        </p>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 12, marginBottom: 16 }}>
        {["All", ...EVENT_CATEGORIES].map(cat => (
          <button key={cat}
            style={{ flexShrink: 0, border: "1.5px solid var(--border)", borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 600, color: activeCat === cat ? "white" : "var(--text3)", background: activeCat === cat ? "var(--green2)" : "var(--white)", cursor: "pointer", transition: ".15s", borderColor: activeCat === cat ? "var(--green2)" : "var(--border)" }}
            onClick={() => setActiveCat(cat)}>{cat}</button>
        ))}
      </div>

      {/* Events list */}
      {loading && <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)" }}>Loading events…</div>}
      {!loading && loadError && <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)" }}>{loadError}</div>}
      {!loading && !loadError && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)" }}>
          <div style={{ fontSize: 32 }}>🎉</div>
          <p style={{ marginTop: 10, fontSize: 14 }}>No events yet — be the first to post one.</p>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
        {filtered.map(e => (
          <div key={e.id}
            style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: 14, background: "var(--white)", border: "1px solid var(--border)", borderRadius: 16, boxShadow: "var(--shadow)", cursor: "pointer" }}
            onClick={() => setOpenEvent(e)}>
            <div style={{ flexShrink: 0, width: 110, height: 90, borderRadius: 10, overflow: "hidden", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {e.photo_url ? <img src={e.photo_url} alt={e.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 24 }}>🎉</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ background: "var(--green-bg)", color: "var(--green2)", borderRadius: 999, padding: "2px 9px", fontSize: 10, fontWeight: 700 }}>{e.category}</span>
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 5, marginBottom: 3, color: "var(--text)" }}>{e.name}</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 2 }}>📅 {e.event_date}</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>📍 {e.location}</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>{interestCounts[e.id] ?? 0} interested</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky create event banner */}
      <div
        style={{ position: "fixed", bottom: 56, left: 0, right: 0, background: "#1a3a1a", color: "white", display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", cursor: "pointer", zIndex: 60 }}
        onClick={() => setCreateOpen(o => !o)}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>📅</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Post an event</div>
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 1 }}>House party, meetup, or anything else.</div>
        </div>
        <span style={{ fontSize: 24, fontWeight: 300, marginLeft: "auto", opacity: 0.9 }}>{createOpen ? "×" : "+"}</span>
      </div>

      {createOpen && (
        <div className="share-sheet-overlay" onClick={() => setCreateOpen(false)}>
          <div className="share-sheet" onClick={e => e.stopPropagation()}>
            <div className="share-sheet-handle" />
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 14 }}>Post an event</div>
            <CreateEventForm city={city} userId={userId} userName={userName} onDone={() => setCreateOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── OWN PROFILE ──────────────────────────────────────────────────────────────
function EditableField({ label, value, onSave, type = "text", icon }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  useEffect(() => { setDraft(value); }, [value]);
  const commit = () => { setEditing(false); if (draft !== value && draft) onSave(draft); else setDraft(value); };
  return (
    <div className="profile-field">
      <label>{label}</label>
      {editing ? (
        <input className="profile-field-input" type={type} value={draft} autoFocus onChange={e => setDraft(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(value); setEditing(false); } }} />
      ) : (
        <div className="profile-field-val profile-field-editable" onClick={() => setEditing(true)}>{value || "—"} {icon} <span className="profile-field-edit-hint">✏️</span></div>
      )}
    </div>
  );
}

function ProfileScreen({ user, userId, onSignOut, onUpdateProfile, onReplayTour }) {
  const cd = CITIES[user.city];
  const [cuisines, setCuisines] = useState(user.cuisines || []);
  const [things, setThings] = useState(user.things || []);
  const [prompts, setPrompts] = useState(user.prompts || {});
  const [photos, setPhotos] = useState(user.photo_urls || []);
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [cityPickerOpen, setCityPickerOpen] = useState(false);

  useEffect(() => { setCuisines(user.cuisines || []); }, [user.cuisines]);
  useEffect(() => { setPhotos(user.photo_urls || []); }, [user.photo_urls]);
  useEffect(() => { setThings(user.things || []); }, [user.things]);
  useEffect(() => { setPrompts(user.prompts || {}); }, [user.prompts]);

  const save = async (updates, revert) => {
    setSaveError("");
    try { if (onUpdateProfile) await onUpdateProfile(updates); }
    catch (e) { console.error(e); setSaveError("Couldn't save that change — please try again."); if (revert) revert(); }
  };

  const addThing = t => { const prev = things; const next = [...things, t]; setThings(next); save({ city_wants: next }, () => setThings(prev)); };
  const removeThing = t => { const prev = things; const next = things.filter(x => x !== t); setThings(next); save({ city_wants: next }, () => setThings(prev)); };

  const handlePhotoSelect = async (slot, file) => {
    if (!file) return;
    setUploadingSlot(slot);
    try {
      const url = userId ? await uploadProfilePhoto(userId, file, slot) : URL.createObjectURL(file);
      const next = [...photos]; next[slot] = url; setPhotos(next);
      await save({ photo_urls: next });
    } catch (e) { console.error(e); setSaveError("Couldn't upload that photo — please try again."); }
    finally { setUploadingSlot(null); }
  };

  const moveCuisine = (id, dir) => {
    const prev = cuisines; const idx = prev.indexOf(id); const ni = idx + dir;
    if (ni < 0 || ni >= prev.length) return;
    const next = [...prev]; [next[idx], next[ni]] = [next[ni], next[idx]];
    setCuisines(next); save({ cuisines: next }, () => setCuisines(prev));
  };
  const removeCuisine = id => { const prev = cuisines; const next = cuisines.filter(c => c !== id); setCuisines(next); save({ cuisines: next }, () => setCuisines(prev)); };
  const addCuisine = id => { const prev = cuisines; const next = [...cuisines, id]; setCuisines(next); save({ cuisines: next }, () => setCuisines(prev)); };

  return (
    <div className="profile-root">
      <div className="profile-header-row"><div className="profile-title">Your profile</div></div>
      <div className="profile-header-sub">The more you fill in, the better your connections.</div>
      {saveError && <div className="profile-save-error">⚠️ {saveError}</div>}

      {/* 1 Basic */}
      <div className="profile-section">
        <div className="profile-sec-num">1</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Basic info</div>
          <div className="profile-basic-grid">
            <EditableField label="Name" value={user.name} icon="👤" onSave={v => save({ name: v })} />
            <EditableField label="Age" value={user.age} type="number" icon="📅" onSave={v => { const n = parseInt(v); if (n >= 18) save({ age: n }); }} />
            <div className="profile-field">
              <label>City</label>
              <div className="profile-field-val profile-field-editable" onClick={() => setCityPickerOpen(o => !o)}>{cd.label} 📍 <span className="profile-field-edit-hint">✏️</span></div>
              {cityPickerOpen && (
                <div className="profile-city-picker">
                  {[{ id: "nyc", name: "New York City" }, { id: "mumbai", name: "Mumbai" }].map(c => (
                    <button key={c.id} className={`profile-city-opt ${user.city === c.id ? "active" : ""}`} onClick={() => { save({ city: c.id }); setCityPickerOpen(false); }}>{c.name}</button>
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
          <div className="profile-sec-title">Photos <span className="profile-sec-count">{photos.filter(Boolean).length}/3 added</span></div>
          <div className="profile-sec-sub">Add 3 photos to help others recognize you.</div>
          <div className="photos-grid">
            {[0, 1, 2].map(i => (
              <label key={i} className="photo-slot" style={{ cursor: "pointer" }}>
                <div className="photo-num">{i + 1}</div>
                {photos[i] ? (<><img src={photos[i]} alt="" className="photo-img" /><button type="button" className="photo-remove" onClick={e => { e.preventDefault(); const prev = photos; const next = [...photos]; next[i] = null; setPhotos(next); save({ photo_urls: next.filter(Boolean) }, () => setPhotos(prev)); }}>×</button></>) : uploadingSlot === i ? <div className="photo-placeholder">⏳</div> : <div className="photo-placeholder">📷</div>}
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => handlePhotoSelect(i, e.target.files?.[0])} />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Things to do */}
      <div className="profile-section">
        <div className="profile-sec-num">3</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Things I want to do <span className="profile-sec-count">{things.length} added</span></div>
          <div className="profile-sec-sub">This powers the By Activity tab — the more you add, the more people you'll match with.</div>
          <div className="ob-tags-row">{things.map((w, i) => <span key={i} className="ob-tag">{w}<button onClick={() => removeThing(w)}>×</button></span>)}</div>
          <div className="ob-chips-grid" style={{ marginTop: 14 }}>
            {THINGS_OPTIONS.filter(t => !things.includes(t)).map(t => (
              <button key={t} className="ob-thing-chip" onClick={() => addThing(t)}>{t}</button>
            ))}
          </div>
          <input className="ob-input" style={{ marginTop: 12 }} placeholder="Add your own..." onKeyDown={e => { if (e.key === "Enter" && e.target.value.trim()) { const val = e.target.value.trim(); if (!things.includes(val)) addThing(val); e.target.value = ""; } }} />
        </div>
      </div>

      {/* 4 Cuisine prefs */}
      <div className="profile-section">
        <div className="profile-sec-num">4</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Food preferences <span className="profile-sec-count">{cuisines.length} added</span></div>
          <div className="profile-sec-sub">Powers your food recommendations.</div>
          {cuisines.length > 0 && (
            <div className="ob-ranked-list">
              {cuisines.map((id, i) => { const c = CUISINE_OPTIONS.find(o => o.id === id); return (
                <div key={id} className="ob-ranked-row">
                  <span className="ob-ranked-num">{i + 1}</span><span className="ob-ranked-icon">{c?.icon}</span>
                  <span className="ob-ranked-label-text">{c?.label}</span>
                  <div className="ob-ranked-actions">
                    <button className="ob-ranked-btn" disabled={i === 0} onClick={() => moveCuisine(id, -1)}>↑</button>
                    <button className="ob-ranked-btn" disabled={i === cuisines.length - 1} onClick={() => moveCuisine(id, 1)}>↓</button>
                    <button className="ob-ranked-btn ob-ranked-remove" onClick={() => removeCuisine(id)}>×</button>
                  </div>
                </div>
              ); })}
            </div>
          )}
          <div className="ob-chips-grid" style={{ marginTop: cuisines.length > 0 ? 14 : 4 }}>
            {CUISINE_OPTIONS.filter(c => !cuisines.includes(c.id)).map(c => (
              <button key={c.id} className="ob-chip" onClick={() => addCuisine(c.id)}>
                <span className="ob-chip-icon">{c.icon}</span><span className="ob-chip-label">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5 Conversation prompts */}
      <div className="profile-section">
        <div className="profile-sec-num">5</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Conversation starters <span className="profile-sec-count">{Object.keys(prompts).length} added</span></div>
          <div className="profile-sec-sub">Pick up to 3 prompts and answer them — they appear in chat to help people start a conversation with you.</div>
          {CONVERSATION_PROMPTS.map(q => {
            const answered = q in prompts;
            return (
              <div key={q} className="prompt-row">
                <div className="prompt-q">{q}</div>
                {answered ? (
                  <div className="prompt-answered">
                    <textarea className="ob-input experience-textarea" style={{ marginTop: 6, fontSize: 13 }} rows={2} value={prompts[q]} onChange={e => { const next = { ...prompts, [q]: e.target.value }; setPrompts(next); save({ prompts: next }, () => setPrompts(prompts)); }} />
                    <button className="prompt-remove" onClick={() => { const next = { ...prompts }; delete next[q]; setPrompts(next); save({ prompts: next }, () => setPrompts(prompts)); }}>Remove</button>
                  </div>
                ) : Object.keys(prompts).length < 3 ? (
                  <button className="prompt-add-btn" onClick={() => { const next = { ...prompts, [q]: "" }; setPrompts(next); save({ prompts: next }, () => setPrompts(prompts)); }}>+ Answer this</button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <button className="profile-signout" onClick={onSignOut}>Sign out</button>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const { session, profile, loading, refreshProfile } = useAuth();
  const [localUser, setLocalUser] = useState(null);
  const [tab, setTab] = useState("connections");
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [tourStep, setTourStep] = useState(null);
  const [screen, setScreen] = useState("landing");

  useEffect(() => {
    const alreadySeen = localStorage.getItem("nearmet_tour_done") === "true";
    if (profile?.profile_complete && !alreadySeen && tourStep === null) setTourStep(0);
  }, [profile?.profile_complete]);

  const finishTour = async () => {
    setTourStep(null);
    localStorage.setItem("nearmet_tour_done", "true");
    if (session?.user?.id) {
      try { await updateProfile(session.user.id, { tour_completed: true }); await refreshProfile(); }
      catch (e) { console.error(e); }
    }
  };

  async function handleSignOut() {
    try { await signOut(); } catch (e) { console.error(e); }
    setLocalUser(null); setScreen("landing");
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f7f5" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 12 }}>
          <span style={{ color: "#1a2e1a" }}>Near</span><span style={{ color: "#2d6a2d" }}>Met</span>
        </div>
        <div style={{ fontSize: 13, color: "#999" }}>Loading…</div>
      </div>
    </div>
  );

  // ── Supabase signed in + profile complete ──
  if (session && profile?.profile_complete) {
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
      prompts: profile.prompts || {},
    };
    const nav = [
      ["connections", "👥", "Connections"],
      ["places", "📍", "Places to Explore"],
      ["food", "🍽️", "Food Places"],
      ["events", "🎉", "What's Happening"],
    ];
    return (
      <div className="app-root">
        <header className="topnav">
          <div className="topnav-inner">
            <NearMetLogo size={26} />
            <div className="topnav-right">
              <span className="city-pill">📍 {user.city === "nyc" ? "NYC" : "Mumbai"}</span>
              <button className="topnav-msg-btn" onClick={() => setMessagesOpen(true)} title="Messages">💬</button>
              <button className="topnav-msg-btn" title="Profile" onClick={() => setTab("profile")}>👤</button>
            </div>
          </div>
        </header>
        <nav className="section-tab-bar">
          {nav.map(([id, icon, lbl]) => (
            <button key={id} className={`section-tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
              <span className="section-tab-icon">{icon}</span>
              <span className="section-tab-label">{lbl}</span>
            </button>
          ))}
        </nav>
        {messagesOpen && <MessagesPanel userId={session.user.id} onClose={() => setMessagesOpen(false)} />}
        {tourStep !== null && <TourOverlay stepIndex={tourStep} onNext={() => { if (tourStep >= TOUR_STEPS.length - 1) finishTour(); else setTourStep(s => s + 1); }} onBack={() => setTourStep(s => Math.max(0, s - 1))} onSkip={finishTour} />}
        <main className="site-main">
          {tab === "connections" && <ConnectionsScreen city={user.city} userId={session.user.id} me={user} />}
          {tab === "places" && <PlacesToExploreScreen city={user.city} userId={session.user.id} userName={user.name} />}
          {tab === "food" && <FoodScreen city={user.city} userCuisines={user.cuisines} userBudget={user.budget} userId={session.user.id} userName={user.name} savedPlaces={user.saved_food_places} onToggleSave={async name => { const cur = user.saved_food_places || []; const next = cur.includes(name) ? cur.filter(n => n !== name) : [...cur, name]; try { await updateProfile(session.user.id, { saved_food_places: next }); await refreshProfile(); } catch (e) { console.error(e); } }} />}
          {tab === "events" && <EventsScreen city={user.city} userId={session.user.id} userName={user.name} />}
          {tab === "profile" && <ProfileScreen user={user} userId={session.user.id} onSignOut={handleSignOut} onUpdateProfile={async updates => { await updateProfile(session.user.id, updates); await refreshProfile(); }} onReplayTour={() => setTourStep(0)} />}
        </main>
      </div>
    );
  }

  // ── Supabase signed in but onboarding not done ──
  if (session) return (
    <Onboarding initialCity={profile?.city} initialName={profile?.name}
      onShowSignIn={handleSignOut} onBackToLanding={handleSignOut}
      onDone={async u => {
        try { await updateProfile(session.user.id, { city: u.city, name: u.name, interests: u.interests, city_wants: u.things, cuisines: u.cuisines, budget: u.budget, profile_complete: true, last_active: new Date().toISOString() }); await refreshProfile(); }
        catch (e) { console.error(e); }
      }} />
  );

  // ── Auth screens ──
  if (screen === "signin") return <AuthPage mode="signin" onBack={() => setScreen("landing")} />;
  if (screen === "signup") return <AuthPage mode="signup" onBack={() => setScreen("landing")} />;

  // ── Local demo mode ──
  if (localUser) {
    const nav = [
      ["connections", "👥", "Connections"],
      ["places", "📍", "Places to Explore"],
      ["food", "🍽️", "Food Places"],
      ["events", "🎉", "What's Happening"],
    ];
    return (
      <div className="app-root">
        <header className="topnav">
          <div className="topnav-inner">
            <NearMetLogo size={26} />
            <div className="topnav-right">
              <span className="city-pill">📍 {localUser.city === "nyc" ? "NYC" : "Mumbai"}</span>
              <button className="topnav-msg-btn" disabled title="Sign in to use messaging">💬</button>
              <button className="topnav-msg-btn" onClick={() => setTab("profile")}>👤</button>
            </div>
          </div>
        </header>
        <nav className="section-tab-bar">
          {nav.map(([id, icon, lbl]) => (
            <button key={id} className={`section-tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
              <span className="section-tab-icon">{icon}</span>
              <span className="section-tab-label">{lbl}</span>
            </button>
          ))}
        </nav>
        {tourStep !== null && <TourOverlay stepIndex={tourStep} onNext={() => { if (tourStep >= TOUR_STEPS.length - 1) setTourStep(null); else setTourStep(s => s + 1); }} onBack={() => setTourStep(s => Math.max(0, s - 1))} onSkip={() => setTourStep(null)} />}
        <main className="site-main">
          {tab === "connections" && <ConnectionsScreen city={localUser.city} userId={null} me={localUser} />}
          {tab === "places" && <PlacesToExploreScreen city={localUser.city} userId={null} userName={localUser.name} />}
          {tab === "food" && <FoodScreen city={localUser.city} userCuisines={localUser.cuisines || []} userBudget={localUser.budget || "flexible"} userId={null} userName={localUser.name} savedPlaces={localUser.saved_food_places || []} onToggleSave={name => { setLocalUser(u => { const cur = u.saved_food_places || []; const next = cur.includes(name) ? cur.filter(n => n !== name) : [...cur, name]; return { ...u, saved_food_places: next }; }); }} />}
          {tab === "events" && <EventsScreen city={localUser.city} userId={null} userName={localUser.name} />}
          {tab === "profile" && <ProfileScreen user={localUser} userId={null} onSignOut={() => { setLocalUser(null); setScreen("landing"); }} onUpdateProfile={async updates => { setLocalUser(u => ({ ...u, ...updates })); }} onReplayTour={() => setTourStep(0)} />}
        </main>
      </div>
    );
  }

  // ── Onboarding (local) ──
  if (screen === "onboarding") return <Onboarding onShowSignIn={() => setScreen("signin")} onBackToLanding={() => setScreen("landing")} onDone={u => { setLocalUser(u); setTab("connections"); }} />;

  // ── Landing ──
  return (
    <div className="ob-root">
      <div className="ob-hero">
        <div className="ob-hero-img" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=900&q=80)` }} />
        <div className="ob-hero-overlay" />
        <div className="ob-hero-content">
          <NearMetLogo size={56} dark />
          <p className="ob-hero-tagline">Explore your city.<br />Find genuine connections.</p>
        </div>
        <div className="ob-hero-bottom">
          <button className="ob-cta-primary" onClick={() => setScreen("signup")}>Create an account</button>
          <button className="ob-cta-secondary" onClick={() => setScreen("signin")}>I have an account</button>
          <p className="ob-legal">By continuing you agree to our <span className="ob-link">Terms</span> &amp; <span className="ob-link">Privacy Policy</span>.</p>
        </div>
      </div>
    </div>
  );
}
