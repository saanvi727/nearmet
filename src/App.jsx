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
  getOrCreateConnection, getConnections, getPendingRequests,
  acceptRequest, rejectRequest, blockUser, getBlockedIds,
  getMessages, sendMessage, subscribeToMessages,
  getCommunityPlaces, uploadCommunityPlacePhoto, submitCommunityPlace,
  getCommunityEvents, submitCommunityEvent, uploadEventPhoto,
  toggleCommunityEventInterest, getCommunityEventInterestCount,
  addPassportEntry, uploadPassportPhoto, getPassportFeed,
  getMyPassportCounts, togglePassportSave, getPassportSavedIds,
  getMyPassportEntries, getMyInterestedEvents,
} from "./lib/supabase.js";
import { supabase } from "./lib/supabase.js";

// ─── LOGO ────────────────────────────────────────────────────────────────────
function NearMetLogo({ size = 28 }) {
  const height = Math.round(size * 1.8);
  return (
    <img
      src="/logo.png"
      alt="NearMet"
      style={{ height, width: "auto", objectFit: "contain", display: "block", maxWidth: size * 7 }}
    />
  );
}

// ─── PLACES DATA ─────────────────────────────────────────────────────────────
const PLACES_TO_EXPLORE = {
  mumbai: [

    // ── BEACHES ──────────────────────────────────────────────────────────────

    { id: 1, name: "Juhu Beach", area: "Juhu", category: "Beach",
      tag: "Mumbai's favourite beach", address: "Juhu Beach, Juhu Tara Road, Juhu, Mumbai 400049",
      desc: "Mumbai's most famous beach — chaotic, colourful and completely alive. Best in the early mornings or at sunset when the vendors set up and the city exhales.",
      img: "/places-explore/juhu-beach/photo1.jpeg",
      photos: ["/places-explore/juhu-beach/photo2.webp", "/places-explore/juhu-beach/photo3.webp", "/places-explore/juhu-beach/photo4.webp"],
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
      photos: ["/places-explore/manori-beach/photo2.avif", "/places-explore/manori-beach/photo3.avif", "/places-explore/manori-beach/photo4.avif", "/places-explore/manori-beach/photo5.jpg"],
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
      photos: ["/places-explore/marine-drive/photo2.jpeg", "/places-explore/marine-drive/photo3.jpeg", "/places-explore/marine-drive/photo4.webp"],
      tags: ["Promenade", "Sunset", "Night walk"] },

    // ── PARKS & NATURE ────────────────────────────────────────────────────────

    { id: 11, name: "Sanjay Gandhi National Park", area: "Borivali East", category: "Nature",
      tag: "Forest inside the city", address: "Sanjay Gandhi National Park, Borivali East, Mumbai 400066",
      desc: "A 104 sq km forest sitting inside one of the world's most densely populated cities. Home to leopards, the ancient Kanheri Caves, butterflies, and miles of trekking trails.",
      img: "/places-explore/sanjay-gandhi-np/photo1.avif",
      photos: ["/places-explore/sanjay-gandhi-np/photo2.jpg", "/places-explore/sanjay-gandhi-np/photo3.jpeg", "/places-explore/sanjay-gandhi-np/photo4.avif"],
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
      photos: ["/places-explore/ngma-mumbai/photo2.jpg", "/places-explore/ngma-mumbai/photo3.jpg", "/places-explore/ngma-mumbai/photo4.jfif"],
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

// ─── TOUR ─────────────────────────────────────────────────────────────────────
const TOUR_STEPS = [
  { selector: null, title: "Welcome to NearMet 👋", body: "NearMet connects you with people in Mumbai who want to do the same things as you. Let's take a quick tour.", center: true },
  { selector: "[data-tour='home-tab']", title: "Home", body: "Your daily dashboard. See top matches, things you want to experience, and a fresh 'Try something new today' section that rotates daily." },
  { selector: "[data-tour='connections-tab']", title: "Connections", body: "Browse people matched to your interests, or switch to 'Things to Experience Today' to find people who want to do the same activities as you." },
  { selector: "[data-tour='places-tab']", title: "Places to Explore", body: "Swipe through what people are experiencing around Mumbai, search or filter by category, then save your favourites to My Passport." },
  { selector: "[data-tour='food-tab']", title: "Food Places", body: "Browse real food experiences shared anonymously by the community, filter by neighbourhood, and save spots you want to try." },
  { selector: null, title: "My Passport 🛂", body: "Every place or food spot you save shows up in My Passport. Tap 'Share your experience' to add your own — it's posted anonymously, no likes or comments, just a save button.", center: true },
  { selector: "[data-tour='events-tab']", title: "Events", body: "Search or browse events by category — house parties, workshops, live music and more. Found something you like? Show your interest. Got an idea? Create your own event." },
  { selector: "[data-tour='profile-btn']", title: "Your Profile", body: "Add a photo, your interests, things to experience, food spots and places. The more you fill in, the better your matches." },
  { selector: null, title: "Privacy Settings 🔒", body: "In your profile scroll to Privacy Settings. Hide your age, gender, college, location, food recs, places or thoughts from other users — you control what others see.", center: true },
  { selector: null, title: "You're all set! ✅", body: "Start on Home to see who matches with you. Fill in 'Things I Want to Do' for the best matches — it's the most important section.", center: true },
];


function TourOverlay({ stepIndex, onNext, onBack, onSkip }) {
  const step = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;
  const [rect, setRect] = useState(null);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const [arrowDir, setArrowDir] = useState(null);
  const pad = 10;

  useEffect(() => {
    if (!step.selector) { setRect(null); return; }
    const measure = () => {
      const el = document.querySelector(step.selector);
      if (!el) { setRect(null); return; }
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    measure();
    // retry after a tick in case elements aren't painted yet
    const t = setTimeout(measure, 80);
    return () => clearTimeout(t);
  }, [stepIndex]);

  useEffect(() => {
    if (!rect) { setTooltipStyle({ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(320px,90vw)" }); setArrowDir(null); return; }
    const tw = Math.min(320, window.innerWidth * 0.88);
    const th = 200;
    const spaceBelow = window.innerHeight - rect.top - rect.height - pad;
    const spaceAbove = rect.top - pad;
    let top, arrow;
    if (spaceBelow >= th + 20) { top = rect.top + rect.height + pad + 12; arrow = "up"; }
    else if (spaceAbove >= th + 20) { top = rect.top - pad - th - 12; arrow = "down"; }
    else { top = window.innerHeight / 2 - th / 2; arrow = null; }
    const left = Math.max(12, Math.min(window.innerWidth - tw - 12, window.innerWidth / 2 - tw / 2));
    setTooltipStyle({ position: "fixed", top, left, width: tw });
    setArrowDir(arrow);
  }, [rect]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      {/* Backdrop with cutout */}
      {rect ? (
        <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9999 }}>
          <defs>
            <mask id="tm">
              <rect width="100%" height="100%" fill="white"/>
              <rect x={rect.left - pad} y={rect.top - pad} width={rect.width + pad*2} height={rect.height + pad*2} rx={12} fill="black"/>
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.72)" mask="url(#tm)"/>
          {/* Sage highlight ring */}
          <rect x={rect.left - pad} y={rect.top - pad} width={rect.width + pad*2} height={rect.height + pad*2} rx={12} fill="none" stroke="#FF9A8B" strokeWidth={2.5}/>
          {/* Pulse ring */}
          <rect x={rect.left - pad - 4} y={rect.top - pad - 4} width={rect.width + pad*2 + 8} height={rect.height + pad*2 + 8} rx={15} fill="none" stroke="#FF9A8B" strokeWidth={1} opacity={0.35}/>
        </svg>
      ) : (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 9999 }}/>
      )}

      {/* Click blocker */}
      <div style={{ position: "fixed", inset: 0, zIndex: 9999 }} onClick={e => e.stopPropagation()}/>

      {/* Tooltip */}
      <div style={{ ...tooltipStyle, zIndex: 10000, background: "white", borderRadius: 18, padding: "20px 18px 16px", boxShadow: "0 16px 48px rgba(0,0,0,0.28)", pointerEvents: "all" }}>
        {arrowDir === "up" && <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "9px solid transparent", borderRight: "9px solid transparent", borderBottom: "9px solid white" }}/>}
        {arrowDir === "down" && <div style={{ position: "absolute", bottom: -9, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "9px solid transparent", borderRight: "9px solid transparent", borderTop: "9px solid white" }}/>}

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 14 }}>
          {TOUR_STEPS.map((_, i) => (
            <div key={i} style={{ width: i === stepIndex ? 22 : 7, height: 7, borderRadius: 4, background: i === stepIndex ? "#581073" : i < stepIndex ? "#FF9A8B" : "#E8D5F0", transition: "all .2s" }}/>
          ))}
        </div>

        <div style={{ fontSize: 16, fontWeight: 800, color: "#2F2F33", textAlign: "center", marginBottom: 8, letterSpacing: "-0.02em" }}>{step.title}</div>
        <p style={{ fontSize: 13, color: "#4A4A6A", lineHeight: 1.65, textAlign: "center", marginBottom: 18 }}>{step.body}</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={onSkip} style={{ fontSize: 12, color: "#C0B8D8", background: "none", border: "none", cursor: "pointer" }}>Skip</button>
          <div style={{ display: "flex", gap: 8 }}>
            {stepIndex > 0 && <button onClick={onBack} style={{ fontSize: 13, color: "#4A4A6A", background: "#F0EEF8", border: "none", borderRadius: 9, padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}>←</button>}
            <button onClick={onNext} style={{ fontSize: 13, color: "white", background: "#581073", border: "none", borderRadius: 9, padding: "8px 20px", fontWeight: 700, cursor: "pointer" }}>
              {isLast ? "Let's go →" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DATA CONSTANTS ─────────────────────────────────────────────────────────────


const ACTIVITY_ICONS = {
  // legacy (existing seed data)
  "Attend a live music gig": "🎵", "Explore hidden bookstores": "📚", "Try a new restaurant": "🍽️",
  "Join a running club": "🏃", "Visit an art gallery": "🎨", "Attend a comedy show": "😂",
  "Go hiking": "🥾", "Take a cooking class": "👨‍🍳", "Watch a play": "🎭", "Plan a road trip": "🚗",
  "Join a sports team": "⚽", "Attend a film screening": "🎬", "Try pottery or a craft class": "🏺",
  "Go to a food festival": "🍜", "Explore street art": "🖼️", "Attend a rooftop event": "🌆",
  "Join a book club": "📖", "Try open mic night": "🎤", "Run a half marathon": "🏅",
  "Learn guitar": "🎸", "Go for trekking": "🏔️", "Watch stand-up comedy": "🎙️",
  "Try new restaurants": "🍽️", "Play football": "⚽", "Go for a run": "🏃", "Explore cafes": "☕",

  // new THINGS_LIST
  "Cycling": "🚴", "Hiking": "🥾", "Rock climbing": "🧗", "Play cricket": "🏏",
  "Play badminton": "🏸", "Play volleyball": "🏐", "Play basketball": "🏀", "Go bowling": "🎳",
  "Play darts": "🎯", "Play Frisbee": "🥏", "Play paintball": "🔫", "Go to the gym": "🏋️",
  "Attend a live music concert": "🎵", "Sing karaoke": "🎤", "Attend a house party": "🥳",
  "Learn to play an instrument": "🎸", "Attend a DJ night": "🎧", "Explore food spots": "🍜",
  "Explore dessert spots": "🍰", "Coffee Hopping": "☕", "Play board games": "🎲",
  "Play card games": "🃏", "Play chess": "♟️", "Go to an arcade": "🕹️", "Evening walk": "🚶",
  "Picnic": "🧺", "Watch the sunset": "🌅", "Play at the beach": "🏖️", "Walk in a park": "🌳",
  "Attend a Shayari event": "📜", "Attend a dance workshop": "💃", "Attend a pottery workshop": "🏺",
  "Visit a museum": "🏛️", "Explore historical places": "🏯", "Painting": "🖌️",
  "Join a cleanliness drive": "🧹", "Join a tree plantation drive": "🌱", "Thrift shopping": "👜",
  "Live match Screening": "📺", "Video games": "🎮", "Discuss a Novel": "📖",
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
      { id: 15, name: "TÓA 66", cuisine: "Thai Restaurant", price: "Rs.3000-5000 for two", rating: 4.8, tag: "India's first Thai tasting menu", hood: "Churchgate", address: "Ground Floor, ADCB Rehman Manzil, 75, Veer Nariman Rd, Churchgate, Mumbai", phone: "9920820800", desc: "TÓA 66 brings India's first 7-course vegetarian Thai tasting menu to Mumbai. Designed by two master Thai chefs in an intimate 26-seater space.", sharedExp: "The 7-course Thai tasting menu is exceptional. The opening course and the two desserts were the absolute highlights. Highly recommended.", tryThis: "7-Course Thai Tasting Menu", img: "/places/toa-66/photo1.jfif", photos: ["/places/toa-66/photo2.webp","/places/toa-66/photo3.webp", "/places/toa-66/photo4.webp", "/places/toa-66/photo5.webp"] },
      { id: 16, name: "Trishna", cuisine: "Seafood Restaurant", price: "Rs.2000-3500 for two", rating: 4.7, tag: "Premium seafood", hood: "Kala Ghoda", address: "Birla Mansion, Sai Baba Mandir Marg, Kala Ghoda, Fort, Mumbai 400001", phone: "9206260260", desc: "Premium seafood restaurant in the heart of Mumbai.", sharedExp: "Excellent seafood restaurant with exceptional food quality. Highly recommended for seafood lovers.", tryThis: "Butter Garlic Crab", img: "/places/trishna/photo1.webp", photos: ["/places/trishna/photo2.webp"] },
      { id: 17, name: "Ekaa", cuisine: "Indian Restaurant", price: "Rs.3000-5000 for two", rating: 4.7, tag: "Open kitchen fine dining", hood: "Fort", address: "1st Floor, Kitab Mahal, D Sukhadwala Rd, Fort, Mumbai 400001", phone: "9987657989", desc: "Industrial-chic Indian spot with creative plates and an open kitchen concept — perfect for watching the culinary magic happen.", sharedExp: "Had an amazing time at Ekaa. The hospitality was wonderful and the food was absolutely great.", tryThis: "Awakening Tasting Menu", img: "/places/ekaa/photo1.webp", photos: ["/places/ekaa/photo2.webp", "/places/ekaa/photo3.webp"] },
      { id: 18, name: "Steps Café", cuisine: "Café", price: "Rs.600-1200 for two", rating: 4.5, tag: "Terrace dining", hood: "Bandra West", address: "Steps Café, Tertulian Rd, Doctor Peter Dias Road, Mount Mary, Bandra West, Mumbai", phone: "9649646601", desc: "Relaxed eatery with a terrace and a hot menu of familiar comfort foods.", sharedExp: "Really a great place with a cozy and warm ambiance! The food was amazing, the interiors are beautiful, and the staff is so welcoming.", tryThis: "French Fries and Bruschetta and Nutella Croissant", img: "/places/steps-cafe/photo1.jpeg", photos: ["/places/steps-cafe/photo2.jpeg", "/places/steps-cafe/photo1.webp", "/places/steps-cafe/photo3.webp"] },
      { id: 19, name: "YACHT Resto Bar", cuisine: "Resto Bar", price: "Rs.1000-1800 for two", rating: 4.4, tag: "Near Bandstand", hood: "Bandra West", address: "Shams Palace Society, 29, Hill Rd, Bandra West, Mumbai 400050", phone: "02226422718", desc: "A compact Bandra eatery doling out classic Indian plates alongside chilled beers and cocktails.", sharedExp: "Absolutely loved it. It's located within walking distance from Bandstand — the drinks were reasonably priced and the food was really good.", tryThis: "Chicken Lollipops", img: "/places/yacht-resto-bar/photo1.jfif", photos: ["/places/yacht-resto-bar/photo2.jpg"] },
      { id: 20, name: "Janata Bar and Restaurant", cuisine: "Bar and Restaurant", price: "Rs.400-800 for two", rating: 4.3, tag: "Budget-friendly late night", hood: "Bandra West", address: "78/A, Doctor BR Ambedkar Road, Pali Mala Rd, Bandra West, Mumbai 400050", phone: "02226058403", desc: "Famous for budget-friendly drinks and some of the best late-night comfort food.", sharedExp: "Good place to hangout with friends. Perfect go-to spot if you're looking for amazing food and budget-friendly drinks.", tryThis: "Chicken Lollipop", img: "/places/janata-bar/photo2.jpeg", photos: ["/places/janata-bar/photo1.jpeg"] },
      { id: 21, name: "Chantilly The Café", cuisine: "Dessert Cafe", price: "Rs.500-1000 for two", rating: 4.5, tag: "French-inspired desserts", hood: "Bandra West", address: "Shop no. 2, Darvesh Royale Building, Perry Road, Turner Rd, opposite Kotak Mahindra Bank Junction, Bandra West, Mumbai 400050", phone: "7370808080", desc: "Charming spot for decadent French-inspired desserts and hot chocolate.", sharedExp: "They serve one of the best strawberry chocolates. Overall a great dessert place with amazing sweet treats.", tryThis: "Strawberry Nutella Cheesecake and Nut Butter Waffle", img: "/places/chantilly-cafe/photo1.jfif", photos: ["/places/chantilly-cafe/photo2.webp", "/places/chantilly-cafe/photo3.webp"] },
      { id: 22, name: "Cafe Mondegar", cuisine: "Cafe", price: "Rs.800-1500 for two", rating: 4.3, tag: "Vintage classic", hood: "Colaba", address: "Metro House, Colaba Causeway, near Regal Cinema, Apollo Bandar, Colaba, Mumbai 400001", phone: "9833322277", desc: "A legendary South Mumbai landmark famous for its vibrant Mario Miranda murals and retro jukebox. The ultimate vintage spot for a chilled beer and classic comfort food.", sharedExp: "Incredible food, great music and good service. Highly recommended.", tryThis: "Paneer Croquettes and Spring Rolls", img: "/places/cafe-mondegar/photo1.jpg", photos: ["/places/cafe-mondegar/photo2.webp"] },
      { id: 23, name: "Kuai Kitchen", cuisine: "Chinese Restaurant", price: "Rs.600-1200 for two", rating: 4.4, tag: "Best Oriental", hood: "Colaba", address: "Shop No. 16/A Cusrow Baug, Main Road Colaba Causeway, Shahid Bhagat Singh Rd, Colaba, Mumbai 400001", phone: "9819045664", desc: "A vibrant casual restaurant dedicated to being the ultimate destination for delicious and affordable Oriental cuisine.", sharedExp: "Top-tier food paired with flawless hospitality. Highly recommend for Asian cuisine.", tryThis: "Kuai Special Roll and Pinacolada", img: "/places/kuai-kitchen/photo1.jpg", photos: ["/places/kuai-kitchen/photo2.webp", "/places/kuai-kitchen/photo3.webp"] },
      { id: 24, name: "Zen Cafe", cuisine: "Cafe", price: "Rs.500-900 for two", rating: 4.5, tag: "Work-friendly", hood: "Kala Ghoda", address: "Fort Foundation Building, Bake House Ln, Kala Ghoda, Fort, Mumbai 400001", phone: "9167768950", desc: "Single origin coffees brewed with precision and served with freshly baked sourdough and a global menu at this trendy work-friendly venue.", sharedExp: "Highly recommend checking this place out! The staff is super friendly and welcoming.", tryThis: "Coffee and Hummus", img: "/places/zen-cafe/photo3.png", photos: ["/places/zen-cafe/photo1.jpg", "/places/zen-cafe/photo2.jpg"] },
      { id: 25, name: "Miya Kebabs", cuisine: "Kebab Restaurant", price: "Rs.400-800 for two", rating: 4.3, tag: "Consistent quality", hood: "Kala Ghoda", address: "Ali Chambers, Flora Fountain, 81-82, M Shetty Marg, Kala Ghoda, Fort, Mumbai 400023", phone: "8847747644", desc: "A popular eatery in Kala Ghoda known for its flavorful food and generous portions. Consistent quality, quick service and satisfying meals.", sharedExp: "Had a great experience and the food was tasty.", tryThis: "Chicken Changezi", img: "/places/miya-kebabs/photo2.jpg", photos: ["/places/miya-kebabs/photo1.jpg"] },
      { id: 26, name: "The Nutcracker", cuisine: "Cafe", price: "Rs.700-1200 for two", rating: 4.6, tag: "All-day breakfast", hood: "Kala Ghoda", address: "One Forbes Building, Modern House, Dr. V.B. Gandhi Marg, Kala Ghoda, Fort, Mumbai", phone: "9321759393", desc: "The Nutcracker serves wholesome comfort food and all-day breakfast. Renowned for its extensive egg menu, gourmet burgers and decadent desserts.", sharedExp: "Delicious food, great coffee and excellent service. Highly recommend a visit.", tryThis: "Cream Cheese Bagel and Paprika Penne Pasta with Garlic Bread", img: "/places/the-nutcracker/photo1.jpg", photos: ["/places/the-nutcracker/photo2.webp", "/places/the-nutcracker/photo3.webp"] },
      { id: 27, name: "HnH Salad Co.", cuisine: "Healthy Cafe", price: "Rs.500-900 for two", rating: 4.4, tag: "Healthy and delicious", hood: "Kala Ghoda", address: "Ground floor, Khattau Buildings, General Vaidya Road, 7, Shahid Bhagat Singh Rd, Kala Ghoda, Fort, Mumbai 400001", phone: "7045989242", desc: "HnH Salad Co. is redefining healthy eating by serving chef-crafted, flavor-packed nutritious dishes that prove wellness is never bland.", sharedExp: "Healthy food that actually tastes amazing. A fantastic spot for a delicious and wholesome meal.", tryThis: "Salad Bowl", img: "/places/hnh-salad/photo1.webp", photos: ["/places/hnh-salad/photo2.jpg"] },
      { id: 28, name: "Americano", cuisine: "Italian Restaurant", price: "Rs.1200-2000 for two", rating: 4.6, tag: "Creative Italian", hood: "Kala Ghoda", address: "Radha Bhavan, 121/123, Nagindas Master Rd, Kala Ghoda, Fort, Mumbai", phone: "9321104682", desc: "Lively neighborhood spot for creative Italian share plates and handmade pastas.", sharedExp: "The Maui Wowie Pizza was really good. The cheese was on point and the Fresno chilli sauce was beautiful. The Tiramisu was tasty and a perfect end to the meal.", reviewTags: ["Delicious", "Photo-Worthy"], tryThis: "Maui Wowie Pizza and Tiramisu", img: "/places/americano/photo2.webp", photos: ["/places/americano/photo3.webp", "/places/americano/photo2.jpg"] },
      { id: 29, name: "Otra", cuisine: "Mexican Restaurant", price: "Rs.1200-2000 for two", rating: 4.5, tag: "Award-winning Mexican", hood: "Kala Ghoda", address: "105, Ground Floor, Mubarak Manzil, Mumbai Samachar Marg, Kala Ghoda, Fort, Mumbai", phone: "", desc: "Modern Mexican spot with authentic flavors and award-winning dishes.", sharedExp: "Delicious food across the board and great service to match. Highly recommend.", tryThis: "Desserts", img: "/places/otra/photo1.jpeg", photos: ["/places/otra/photo2.webp", "/places/otra/photo3.webp"] },
      { id: 30, name: "Cafe Trofima", cuisine: "Cafe", price: "Rs.600-1000 for two", rating: 4.4, tag: "Neighbourhood favorite", hood: "Dadar", address: "Raja Badhe Chowk, Opp. Raja Rani Travels, Shivaji Park Road No. 2, Lady Jamshedji Rd, Mumbai 400028", phone: "8291019988", desc: "A well-loved cafe in Shivaji Park known for its warm ambience and wide-ranging menu. Quality food, friendly service and an inviting atmosphere.", sharedExp: "This is a great place to hang out with friends. The staff is friendly and the food is absolutely delicious.", tryThis: "White Sauce Pasta", img: "/places/cafe-trofima/photo1.jpg", photos: ["/places/cafe-trofima/photo2.jpg"] },
      { id: 31, name: "Ashok Vada Pav", cuisine: "Street Food", price: "Rs.50-150 for two", rating: 4.5, tag: "Mumbai must-try", hood: "Dadar", address: "Kashinath Dhuru Marg, Near Kirti College, Dadar West, Mumbai 400028", phone: "8591894170", desc: "A popular Dadar eatery known for its flavorful vada pav and long-standing local following. Consistent quality and fresh preparation.", sharedExp: "A must-visit spot for vada pav lovers. Enjoyed it and would recommend to everyone.", tryThis: "Vada Pav", img: "/places/ashok-vada-pav/photo1.jpg", photos: ["/places/ashok-vada-pav/photo2.jpg"] },
      { id: 33, name: "Ramen Bar Wagamama", cuisine: "Japanese Restaurant", price: "Rs.1200-2000 for two", rating: 4.5, tag: "Best ramen", hood: "Churchgate", address: "42, Cambata Building, Maharshi Karve Road, Near Eros Theatre, Churchgate, Mumbai 400020", phone: "9702703111", desc: "A popular Japanese restaurant in Churchgate known for its authentic flavors and comforting dining experience.", sharedExp: "Had a truly wonderful experience here! The food was outstanding, and the service was friendly.", tryThis: "Gyozas and Bang Bang Cauliflower", img: "/places/ramen-wagamama/photo3.webp", photos: ["/places/ramen-wagamama/photo1.jpg", "/places/ramen-wagamama/photo2.jpg"] },
      { id: 34, name: "Mezcalita Churchgate", cuisine: "Mexican Restaurant", price: "Rs.1500-2500 for two", rating: 4.7, tag: "Mexican cantina", hood: "Churchgate", address: "Nagin Mahal, 82, Veer Nariman Rd, Churchgate, Mumbai 400020", phone: "8657512648", desc: "Discover an authentic taste of Mexico at Mezcalita. From sizzling fajitas to zesty tacos and refreshing cocktails.", sharedExp: "A vibrant spot that absolutely nails the energy of a modern Mexican cantina. The tacos are consistently excellent.", tryThis: "Tacos", img: "/places/mezcalita-cg/photo2.jpg", photos: ["/places/mezcalita-cg/photo1.jpeg"] },
      { id: 35, name: "Pizza By The Bay", cuisine: "Restaurant", price: "Rs.1200-2000 for two", rating: 4.5, tag: "Sea view dining", hood: "Churchgate", address: "Soona Mahal, 143, Marine Dr, Churchgate, Mumbai 400020", phone: "7718838749", desc: "One of Mumbai's most iconic dining institutions since 1968, famous for its prime location overlooking the Arabian Sea.", sharedExp: "Delicious food and friendly service. The spectacular sea view makes this place an absolute must-visit.", tryThis: "Pollo Arabiata Pizza", img: "/places/pizza-by-the-bay/photo1.webp", photos: ["/places/pizza-by-the-bay/photo2.webp"] },
      { id: 36, name: "Mockingbird Cafe Bar", cuisine: "Cafe", price: "Rs.800-1500 for two", rating: 4.3, tag: "Chill vibes", hood: "Churchgate", address: "80, Veer Nariman Rd, Churchgate, Mumbai 400020", phone: "8097606010", desc: "Mockingbird Cafe Bar is a great place to chill with great ambiance, a wide range of wonderful cuisine and reasonably priced drinks.", sharedExp: "Delicious food, good service and a wonderful atmosphere. The perfect place to spend quality time with friends.", tryThis: "Peri Peri French Fries and Garden Fresh Pizza", img: "/places/mockingbird/photo1.jpg", photos: ["/places/mockingbird/photo2.webp", "/places/mockingbird/photo3.webp"] },
      { id: 37, name: "Coffee Island", cuisine: "Cafe", price: "Rs.400-800 for two", rating: 4.4, tag: "European-style cafe", hood: "Churchgate", address: "Shop No 10/11 Ground Floor, Eros Cinema, 42, Maharshi Karve Rd, Churchgate, Mumbai 400020", phone: "9211729505", desc: "A vibrant European-style cafe popular for artisanal brews like the signature Islander Cold Coffee, fresh pastries, and late-night workspaces.", sharedExp: "It was an amazing experience with beautiful ambience and great service.", tryThis: "Flatbread — and also try the Islander Cold Coffee!", img: "/places/coffee-island/photo2.webp", photos: ["/places/coffee-island/photo1.webp"] },
      { id: 38, name: "Gaylord Restaurant", cuisine: "Multi-cuisine Restaurant", price: "Rs.1500-2500 for two", rating: 4.4, tag: "Fine dining", hood: "Churchgate", address: "V N Rd, Churchgate, Mumbai 400020", phone: "7045556060", desc: "Buzzing spot with indoor and outdoor seating with an extensive menu of multi-cuisine fare and snacks. Elegant interiors, perfect for a fine dining experience.", sharedExp: "Elegant interiors and an excellent atmosphere make this the perfect spot for a fine dining experience.", tryThis: "Mushroom Cheese Lasagna and Creme Brulee", img: "/places/gaylord/photo1.jpeg", photos: ["/places/gaylord/photo2.webp", "/places/gaylord/photo3.webp"] },
      { id: 39, name: "Bokka Coffee", cuisine: "Cafe", price: "Rs.500-900 for two", rating: 4.5, tag: "Coffee perfection", hood: "Bandra West", address: "Shop No. 6 and 7, Silver Croft, 16th Road, Near Khane Khas, Bandra West, Mumbai 400050", phone: "8355805500", desc: "A cozy Bandra cafe known for its excellent coffee and thoughtfully prepared breakfast offerings. Quality food, friendly service and a welcoming atmosphere.", sharedExp: "Absolutely loved this place. The coffee was brewed to perfection and all the desserts were fantastic.", tryThis: "Specialty Cake", img: "/places/bokka-coffee/photo1.webp", photos: ["/places/bokka-coffee/photo2.webp"] },
      { id: 40, name: "Abokado", cuisine: "Japanese Cafe", price: "Rs.800-1400 for two", rating: 4.5, tag: "Must-try sushi", hood: "Bandra West", address: "Shop No. 1, Sefa House, Pali Mala Rd, Bandra West, Mumbai 400049", phone: "8369936468", desc: "A cozy Japanese inspired cafe in Bandra known for its welcoming atmosphere and consistently well-received food.", sharedExp: "Truly authentic flavors and the Japanese sushi here is absolutely amazing. A must-visit spot for all sushi lovers.", tryThis: "Sushi", img: "/places/abokado/photo1.webp", photos: ["/places/abokado/photo2.jpg"] },
      { id: 41, name: "Veronica", cuisine: "Cafe", price: "Rs.600-1200 for two", rating: 4.6, tag: "Best sandwiches", hood: "Bandra West", address: "9, Waroda Rd, Beside Agna Square, Ranwar, Bandra West, Mumbai 400050", phone: "9372981697", desc: "Veronica's is a vibrant trend-setting Bandra deli famous for its massive, premium artisanal sandwiches and high-energy neighbourhood vibe.", sharedExp: "One of Mumbai's finest sandwich and bakery spots. The bread is exceptional and even the simplest dishes feel memorable.", tryThis: "Dirty Fries with Cheese", img: "/places/veronica/photo1.webp", photos: ["/places/veronica/photo2.webp"] },
      { id: 42, name: "Miyo Dessert Bar", cuisine: "Bakery and Desserts", price: "Rs.600-1000 for two", rating: 4.6, tag: "Make It Your Own", hood: "Bandra West", address: "Shop 3, Silvercroft, Junction of 16th and 33rd Rd, Bandra West, Mumbai 400050", phone: "9004502803", desc: "Miyo Dessert Bar is a freestyle dessert bar operating on a unique MIYO concept — an anti-menu philosophy where you fully customize your sweet treats.", sharedExp: "Creative, elegant and consistently impressive. Beautifully plated and perfectly balanced sophisticated flavors.", tryThis: "Belgian Chocolate Gelato", img: "/places/miyo-dessert/photo1.webp", photos: ["/places/miyo-dessert/photo2.jpeg"] },
      { id: 43, name: "GIGI Bombay", cuisine: "Japanese Restaurant", price: "Rs.2000-3500 for two", rating: 4.7, tag: "Premium fusion", hood: "Bandra West", address: "14th Rd, Bandra West, Mumbai 400050", phone: "8976943116", desc: "Gigi Bombay is a trendy Japanese-European fusion restaurant and cocktail bar in Bandra West. Every dish feels carefully executed.", sharedExp: "A near-perfect combination of ambience, service and food. Every dish feels carefully executed making it one of the city's most premium dining experiences.", tryThis: "Pumpkin Ravioli & Salmon Sushi and Chilli Garlic Edamame", img: "/places/gigi-bombay/photo1.jpg", photos: ["/places/gigi-bombay/photo2.webp", "/places/gigi-bombay/photo3.webp"] },
      { id: 44, name: "Pomodoro", cuisine: "Italian Restaurant", price: "Rs.1000-1800 for two", rating: 4.6, tag: "Hand-rolled pasta", hood: "Bandra West", address: "Shop No. 2, 16th Rd, Bandra West, Mumbai 400050", phone: "7887886327", desc: "Your cozy neighbourhood pasta bar specializing in hand-rolled pastas and specialty coffee. Authentic Italian comfort food at its best.", sharedExp: "Authentic Italian comfort food at its best. The pasta is consistently excellent, the flavors are clean and honest.", tryThis: "Parmesan Truffle Fries and Tiramisu", img: "/places/pomodoro/photo2.webp", photos: ["/places/pomodoro/photo1.webp", "/places/pomodoro/photo3.webp"] },
      { id: 45, name: "Mokai", cuisine: "Cafe", price: "Rs.1000-1800 for two", rating: 4.5, tag: "Pinterest-worthy", hood: "Pali Hill", address: "Pali Mala Rd, Pali Hill, Mumbai 400050", phone: "9820983607", desc: "Mokai in Bandra is known for its Pinterest-y aesthetics and delectable drinks and food. Shifting the conventions of the traditional brunch system.", sharedExp: "A great blend of chic ambience and comforting food. The flavors are approachable yet elevated making it a place you'll want to revisit.", tryThis: "Laksa Curry Wontons", img: "/places/mokai/photo1.webp", photos: ["/places/mokai/photo2.webp"] },
      { id: 46, name: "Steam Room", cuisine: "Dimsum Restaurant", price: "Rs.800-1500 for two", rating: 4.6, tag: "Best dimsums", hood: "Pali Hill", address: "Shop no.1, Union Park Rd Number 5, opposite Petite School, Union Park, Pali Hill, Mumbai 400052", phone: "8850926682", desc: "A small dimsum place in Bandra with an actual steam room where hundreds of dimsums and wontons cook all day.", sharedExp: "The food is really good and 100% worth the price.", tryThis: "Truffle Mushroom Xiao Long Bao and Crispy Prawn Cheung Fun", img: "/places/steam-room/photo1.jpg", photos: ["/places/steam-room/photo2.webp", "/places/steam-room/photo3.webp"] },
      { id: 47, name: "Hot Momos", cuisine: "Momos and Tibetan", price: "Rs.150-400 for two", rating: 4.6, tag: "Best momos", hood: "Kharghar", address: "Shop No. 14, Swarna CHS, Plot No. 13/14, Sector 7, Kharghar, Panvel, Maharashtra 410210", phone: "8767681828", desc: "A popular Kharghar eatery known for its flavorful food and generous portions. Quick service, consistent quality and a loyal local following.", sharedExp: "Hands down the best momos in Kharghar! The momos here are absolutely delicious.", tryThis: "Chicken Kurkure Momos", img: "/places/hot-momos/photo1.jpg", photos: ["/places/hot-momos/photo2.webp"] },
      { id: 48, name: "Luuma House", cuisine: "Continental", price: "Rs.2000-3500 for two", rating: 4.5, tag: "Fine dining", hood: "Vile Parle", address: "Plot No.47, Gulmohar Rd, JVPD Scheme, Vile Parle West, Mumbai 400049", phone: "7891991936", desc: "Experience elevated global dining at Luuma House — a premier fine dining restaurant and cocktail bar featuring Mediterranean, Pan-Asian, and Modern Indian cuisines with live music.", sharedExp: "My experience here was fantastic. The food was delicious and the staff was welcoming.", tryThis: "Dim Sum and Black Rice Sushi", img: "/places/luuma-house/photo1.jpg", photos: ["/places/luuma-house/photo2.webp", "/places/luuma-house/photo3.webp"] },
      { id: 49, name: "Gattu Chinese", cuisine: "Chinese Restaurant", price: "Rs.400-800 for two", rating: 4.4, tag: "Street-style Chinese", hood: "Vile Parle", address: "Shop No. 3, Iria, Irla, Vile Parle West, Mumbai 400056", phone: "8655110777", desc: "Casual locale serving street-style Chinese snacks and rice dishes. Great food quality, generous portions and very reasonably priced.", sharedExp: "Great food quality, generous portion sizes and very reasonably priced.", tryThis: "Special Fried Rice Chicken and Chicken Lollipop", img: "/places/gattu-chinese/photo1.jpg", photos: ["/places/gattu-chinese/photo2.webp", "/places/gattu-chinese/photo3.webp"] },
      { id: 50, name: "Benne - Bangalore Dosa", cuisine: "South Indian", price: "Rs.200-500 for two", rating: 4.7, tag: "Best South Indian", hood: "Juhu", address: "Ground floor, Nirav apartment, 1, Gulmohar Rd, Gulmohar Colony, Juhu, Mumbai 400049", phone: "", desc: "A popular minimalist South Indian eatery in Juhu famous for authentic Bengaluru-style butter dosas. The best South Indian breakfast in Juhu.", sharedExp: "Hands down the best South Indian breakfast in Juhu. The food is incredibly tasty and the quality is excellent.", tryThis: "Benne Masala Dosa", img: "/places/benne-dosa/photo1.jpg", photos: ["/places/benne-dosa/photo2.webp"] },
      { id: 51, name: "One8 Commune", cuisine: "Multi-cuisine Restaurant", price: "Rs.2000-3500 for two", rating: 4.6, tag: "Trendy", hood: "Juhu", address: "Kishore Kumar Bunglow, 18/B, Juhu Tara Rd, Shivaji Nagr, Juhu, Mumbai 400049", phone: "8108411818", desc: "One8 Commune is known for its vibrant ambiance with eclectic decor, experimental cocktails and signature dishes like the Mushroom Googly Dimsums.", sharedExp: "Beautiful aesthetics paired with good food. Everything was plated elegantly and the ingredients tasted wonderfully fresh.", tryThis: "Mushroom Dimsums", img: "/places/one8-commune/photo2.jpg", photos: ["/places/one8-commune/photo1.png"] },
      { id: 52, name: "Ettarra Coffee House", cuisine: "Cafe", price: "Rs.500-900 for two", rating: 4.5, tag: "South Indian coffee", hood: "Juhu", address: "Ground Floor, boutique hotel, Juhu residency, Juhu Tara, Juhu, Mumbai 400049", phone: "8655805815", desc: "South Indian filter coffee crafted to capture flavorful notes and refreshing aromatic servings with every cup. A beautifully designed space with food that matches the aesthetic.", sharedExp: "A beautifully designed space with food that matches the aesthetic. Thoughtful flavors, great presentation and a calm atmosphere.", tryThis: "Baked Soya Keema Pav", img: "/places/ettarra-coffee/photo1.jpg", photos: ["/places/ettarra-coffee/photo2.jpeg"] },
      { id: 53, name: "Si Nonna's", cuisine: "Italian Restaurant", price: "Rs.1500-2500 for two", rating: 4.5, tag: "Naples in Mumbai", hood: "Lower Parel", address: "B, Kamala Mills Compound, Shop 12 and 13, Trade World, Senapati Bapat Marg, Lower Parel, Mumbai 400013", phone: "9136693001", desc: "Si Nonna's is where the authentic taste of Naples meets your cravings. Mouthwatering Italian delights with multiple outlets across Mumbai.", sharedExp: "Delicious food, great options and multiple outlets.", tryThis: "Pizza Number 4 and Tiramisu", img: "/places/si-nonnas/photo3.webp", photos: ["/places/si-nonnas/photo1.jpeg", "/places/si-nonnas/photo2.jpeg"] },
      { id: 54, name: "Queen Margherita", cuisine: "Italian Restaurant", price: "Rs.1200-2000 for two", rating: 4.5, tag: "Wood-fired pizza", hood: "Lower Parel", address: "Neeru Silk Mills, Mathuradas Mill Compound, 11/B, Gr Floor, Lower Parel, Mumbai 400013", phone: "9137537902", desc: "Pizza, pasta and Italian food served at an informal eatery with a wood-fired oven.", sharedExp: "Fantastic spot for amazing pizza.", tryThis: "Classic Chicken Queen Margherita and Tiramisu", img: "/places/queen-margherita/photo3.webp", photos: ["/places/queen-margherita/photo1.webp", "/places/queen-margherita/photo2.webp"] },
      { id: 55, name: "Britannia and Co.", cuisine: "Parsi", price: "Rs.800-1500 for two", rating: 4.6, tag: "Parsi heritage", hood: "Fort", address: "Wakefield House, 11 16, SS Ram Gulam Marg, opp. New Indian Customs House, Ballard Estate, Fort, Mumbai 400001", phone: "02222615264", desc: "If you want a taste of Mumbai's rich culinary history, Britannia and Co. is a mandatory stop. Serving phenomenal authentic Parsi cuisine since 1923.", sharedExp: "Fantastic experience — the food is good and if you want authentic Parsi flavors then this is the place to go.", tryThis: "Mutton Berry Pulao", img: "/places/britannia/photo2.jpg", photos: ["/places/britannia/photo1.webp"] },
      { id: 56, name: "Earth Soul Cafe", cuisine: "Cafe", price: "Rs.500-900 for two", rating: 4.7, tag: "Trending", hood: "CBD Belapur", address: "Shop No. 13, Progressive's Sea Lounge, Plot No.44, Sector 15, CBD Belapur, Navi Mumbai 400614", phone: "9619409696", desc: "Earth Soul Cafe is an all-day cafe in Navi Mumbai. Fresh cold-press juices, smoothies, salads, sandwiches and always-brewing coffee. Perfect for slowing down surrounded by plants.", sharedExp: "This is the place you go when you want to slow down for a few hours. Surrounded by plants and tucked away from the city's chaos.", tryThis: "Pink Sauce Pasta", img: "/places/earth-soul-cafe/photo2.webp", photos: ["/places/earth-soul-cafe/photo1.webp"] },
      { id: 57, name: "The Kerala Table", cuisine: "Seafood Restaurant", price: "Rs.1000-1800 for two", rating: 4.6, tag: "South Indian fine dining", hood: "Vashi", address: "First Floor, Palm Beach Galleria Mall, 109 and 110, Plot No. 17, Sector 19D, Vashi, Navi Mumbai 400703", phone: "9090939348", desc: "Experience true South Indian fine dining with rich flavors of Kerala food and Malabar delicacies. Kerala-style fish fry and aromatic biryani.", sharedExp: "If you're craving authentic Keralite food that feels like it was made at someone's home rather than a commercial kitchen, this is the place.", tryThis: "Paal Porotta Prawns and Pepper Garlic Chicken", img: "/places/kerala-table/photo2.jpg", photos: ["/places/kerala-table/photo1.jpeg", "/places/kerala-table/photo3.webp"] },
      { id: 58, name: "HAV Coffee", cuisine: "Specialty Coffee Cafe", price: "Rs.400-800 for two", rating: 4.5, tag: "Specialty brews", hood: "Chowpatty", address: "1, Dr N A Purandare Marg, next to Mahendra Car Showroom, Charni Road East, Chowpatty, Girgaon, Mumbai 400007", phone: "", desc: "HAV Coffee is known for premium specialty brews like the popular Spanish Latte. Artisan croissants and dedicated Jain-friendly options.", sharedExp: "I absolutely enjoyed my experience here. The food was delicious and the ambience was lovely.", tryThis: "Chilli Cheese Toast and Paneer Tikka Sandwiches", img: "/places/hav-coffee/photo1.jpg", photos: ["/places/hav-coffee/photo2.webp", "/places/hav-coffee/photo3.webp"] },
      { id: 59, name: "Shree Thaker Bhojanalay", cuisine: "Vegetarian Thali Restaurant", price: "Rs.500-900 for two", rating: 4.7, tag: "Legendary thali", hood: "Marine Lines", address: "Building No 31, Purshottam Niwas, Dadiseth Agiyari Ln, Marine Lines East, Kalbadevi, Mumbai 400002", phone: "02222069916", desc: "Long-running Indian restaurant offering a selection of traditional Gujarati thalis. Renowned for exceptional thali.", sharedExp: "Renowned for its exceptional thali and the food lived up to the hype — absolutely delicious.", tryThis: "Vegetarian Gujarati Thali", img: "/places/shree-thaker/photo1.webp", photos: ["/places/shree-thaker/photo2.webp"] },
      { id: 60, name: "The Croffle Guys", cuisine: "Café", price: "Rs.400-800 for two", rating: 4.5, tag: "Unique croffles", hood: "Santacruz", address: "Rupa Adarsh, Saraswati Rd, Santacruz West, Mumbai 400054", phone: "9321355455", desc: "Cozy spot for innovative croffles and signature cold foam coffees.", sharedExp: "A unique dessert spot with very friendly staff. Thoroughly enjoyed the experience.", tryThis: "Nutella Cookie Dough Croffle", img: "/places/croffle-guys/photo1.avif", photos: ["/places/croffle-guys/photo2.webp"] },
      { id: 61, name: "Cream Centre", cuisine: "Vegetarian Restaurant", price: "Rs.600-1000 for two", rating: 4.5, tag: "Mumbai institution", hood: "Chowpatty", desc: "A long-running vegetarian favourite known for its indulgent thalis, chaat, and decadent desserts.", sharedExp: "The Chole Bhature and Belgian chocolate pastry were really tasty!", reviewTags: ["Delicious"], tryThis: "Belgian Chocolate Pastry and Chole Bhature", img: "/places/cream-centre/photo1.jpg", photos: ["/places/cream-centre/photo2.jpg", "/places/cream-centre/photo3.jpg"] },
      { id: 62, name: "Motodo Pizzeria", cuisine: "Pizzeria", price: "Rs.800-1500 for two", rating: 4.6, tag: "Wood-fired pizza", hood: "Bandra Kurla Complex", desc: "A BKC pizzeria turning out wood-fired pies with a perfectly crisp crust alongside classic Italian desserts.", sharedExp: "The pizza had a perfectly crisp crust with delicious fresh flavors and the tiramisu was incredible.", reviewTags: ["Delicious", "Photo-Worthy"], tryThis: "Tiramisu and Wood-Fired Pizza ", img: "/places/motodo-pizzeria/photo1.avif", photos: ["/places/motodo-pizzeria/photo2.jpg", "/places/motodo-pizzeria/photo3.jpg"] },
      { id: 63, name: "Aaswad Upahar & Mithai Gruh", cuisine: "Maharashtrian", price: "Rs.150-400 for two", rating: 4.6, tag: "Legendary misal pav", hood: "Dadar West", desc: "A Dadar institution beloved for its classic Maharashtrian snacks, especially its spicy misal pav.", sharedExp: "This is a must visit place the Misal Pav was amazing.", reviewTags: ["Delicious", "Budget-Friendly"], tryThis: "Misal Pav", img: "/places/aaswad-upahar-mithai-gruh/photo1.jpg", photos: ["/places/aaswad-upahar-mithai-gruh/photo2.jpg"] },
      { id: 64, name: "Sardar Pav Bhaji", cuisine: "Street Food", price: "Rs.150-400 for two", rating: 4.6, tag: "Iconic pav bhaji", hood: "Tardeo", desc: "A Mumbai street-food icon serving buttery, flavour-packed pav bhaji to loyal regulars.", sharedExp: "It is a must visit for all pav bhaji lovers they serve delicious pav bhaji.", reviewTags: ["Delicious", "Budget-Friendly"], tryThis: "Pav Bhaji", img: "/places/sardar-pav-bhaji/photo1.avif", photos: ["/places/sardar-pav-bhaji/photo2.jpg"] },
      { id: 65, name: "Badshah Colddrinks and Snacks", cuisine: "Street Food", price: "Rs.150-400 for two", rating: 4.5, tag: "Crawford Market classic", hood: "Crawford Market", desc: "A Crawford Market landmark famous for its rich pav bhaji and refreshing faloodas.", sharedExp: "The Pav Bhaji was rich and flavourful and the Mango Falooda was delicious.", reviewTags: ["Delicious", "Budget-Friendly"], tryThis: "Mango Falooda and Pav Bhaji", img: "/places/badshah-colddrinks-and-snacks/photo1.jpg", photos: ["/places/badshah-colddrinks-and-snacks/photo2.jpg", "/places/badshah-colddrinks-and-snacks/photo3.jpg"] },
      { id: 66, name: "Stories All Day Bar", cuisine: "Pan-Asian Restaurant", price: "Rs.1200-2000 for two", rating: 4.5, tag: "Asian small plates", hood: "Juhu", desc: "A Juhu all-day bar serving flavourful Pan-Asian small plates alongside a lively drinks menu.", sharedExp: "The teriyaki chicken bao had flavourful chicken with a great spicy kick and the kung pao chicken was also tasty.", reviewTags: ["Delicious", "Photo-Worthy"], tryThis: "Kung Pao Chicken and Teriyaki Chicken Bao", img: "/places/stories-all-day-bar/photo1.avif", photos: ["/places/stories-all-day-bar/photo2.jpg", "/places/stories-all-day-bar/photo3.jpg"] },
      { id: 67, name: "Punjab Da Chulah", cuisine: "Punjabi", price: "Rs.400-800 for two", rating: 4.6, tag: "Amritsari kulchas", hood: "Juhu", desc: "A Juhu favourite dishing out hearty, buttery Punjabi comfort food, especially its Amritsari kulchas.", sharedExp: "The Amritsari Kulchas have a good taste and are totally worth it. Highly recommended.", reviewTags: ["Delicious"], tryThis: "Amritsari Kulchas", img: "/places/punjab-da-chulah/photo1.jpg", photos: ["/places/punjab-da-chulah/photo2.jpg", "/places/punjab-da-chulah/photo3.jpg"] },
      { id: 68, name: "Fable Cafe", cuisine: "Cafe", price: "Rs.600-1000 for two", rating: 4.5, tag: "Cozy cafe", hood: "Juhu", desc: "A cozy Juhu cafe known for its loaded pizzas and hearty, flavour-packed burgers.", sharedExp: "The BBQ Cottage Cheese Pizza was cheesy and the Spinach & Corn Burger was packed with flavour.", reviewTags: ["Delicious", "Photo-Worthy"], tryThis: "Spinach & Corn Burger and BBQ Cottage Cheese Pizza", img: "/places/fable-cafe/photo1.jpg", photos: ["/places/fable-cafe/photo2.jpg", "/places/fable-cafe/photo3.jpg"] },
      { id: 69, name: "Udupi 2 Mumbai", cuisine: "South Indian", price: "Rs.200-500 for two", rating: 4.5, tag: "South Indian breakfast", hood: "Vile Parle", desc: "A Vile Parle South Indian spot known for its crisp, well-made dosas.", sharedExp: "Really enjoyed the Rava Masala Dosa.", reviewTags: ["Delicious"], tryThis: "Rava Masala Dosa", img: "", photos: [] },
      { id: 70, name: "Dakshinayan", cuisine: "South Indian", price: "Rs.200-500 for two", rating: 4.6, tag: "Authentic dosas", hood: "Juhu", desc: "A Juhu South Indian eatery serving up authentic, well-loved dosas.", sharedExp: "Really enjoyed the Mysore Masala Dosa.", reviewTags: ["Delicious"], tryThis: "Mysore Masala Dosa", img: "/places/dakshinayan/photo1.jpg", photos: ["/places/dakshinayan/photo2.jpg"] },
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

const MUMBAI_HOODS = ['Bandra West', 'Pali Hill', 'Juhu', 'Santacruz', 'Vile Parle', 'Andheri West', 'Andheri East', 'Churchgate', 'Colaba', 'Fort', 'Kala Ghoda', 'Lower Parel', 'Dadar', 'Chowpatty', 'Marine Lines', 'Marine Drive', 'Worli', 'Powai', 'Malad', 'Borivali', 'Goregaon', 'Kandivali', 'Thane', 'Navi Mumbai', 'CST'];

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


// ─── ONBOARDING ───────────────────────────────────────────────────────────────

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

// New hierarchical interest structure
const INTEREST_LIST = [
  "Movies","TV Series","Anime","Reality TV","Stand-up Comedy","Podcasts","Memes","Music","Singing","Dance",
  "Painting","Photography","Digital Art","Pottery","Knitting & Crochet","Jewellery","Books","Psychology",
  "Philosophy","Formula 1","Cars","Sports","Fitness","Fashion","Animals","Investing","Travel","Food",
  "Conspiracy Theories","Gardening","Interior Design","Poetry"
];

const THINGS_LIST = [
  "Cycling","Hiking","Rock climbing","Go for a run","Play football","Play cricket","Play badminton",
  "Play volleyball","Play basketball","Go bowling","Play darts","Play Frisbee","Play paintball","Go to the gym",
  "Attend a live music concert","Sing karaoke","Attend a house party","Learn to play an instrument",
  "Attend a DJ night","Explore food spots","Explore dessert spots","Coffee Hopping","Play board games",
  "Play card games","Play chess","Go to an arcade","Evening walk","Picnic","Watch the sunset","Play at the beach",
  "Walk in a park","Attend a comedy show","Attend a Shayari event","Attend a dance workshop",
  "Attend a pottery workshop","Visit an art gallery","Visit a museum","Explore historical places","Painting",
  "Join a cleanliness drive","Join a tree plantation drive","Thrift shopping","Live match Screening",
  "Video games","Discuss a Novel"
];

// "It's Fun Talking About" — replaces open-ended prompts.
// question stays as the storage key so FullProfileView / ChatView / ProfileScreen
// (which already store prompts as {question: answer}) work unchanged.
const FUN_TALKING_ABOUT = [
  { label: "Movies & Series", question: "Favorite movie or series?", example: "e.g. Interstellar / Breaking Bad" },
  { label: "Music", question: "Favorite musician & genre?", example: "e.g. Arijit Singh / Indie" },
  { label: "Formula 1", question: "Favorite driver & team?", example: "e.g. Charles Leclerc / Ferrari" },
  { label: "Sports", question: "Favorite team & player?", example: "e.g. RCB / Virat Kohli" },
  { label: "Video Gaming", question: "Favorite Video game?", example: "e.g. Valorant" },
  { label: "Books", question: "Favorite book?", example: "e.g. The Alchemist" },
  { label: "Food", question: "Favorite cuisine?", example: "e.g. Italian" },
  { label: "Travel", question: "Favorite destination?", example: "e.g. Bali" },
  { label: "Podcasts", question: "Favorite podcast?", example: "e.g. The Ranveer Show" },
  { label: "Comedy", question: "Favorite comedian?", example: "e.g. Zakir Khan" },
];

const GENDER_OPTIONS = ["Man", "Woman", "Non-binary", "Prefer not to say", "Other"];

// Shared nav dot indicator at bottom
function StepDots({ total, current }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", paddingBottom: 16, paddingTop: 8 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? 20 : 7, height: 7, borderRadius: 4,
          background: i === current ? "#581073" : i < current ? "#FF9A8B" : "#E8D5F0",
          transition: "all .2s"
        }} />
      ))}
    </div>
  );
}

const STEP_4B = 41;
const STEP_PHOTO = 42;
const FOOD_TAGS = ["Worth the Meal", "Budget Friendly", "Better with company", "Solo Friendly", "Photo Worthy", "Hidden Gem"];
const PLACE_TAGS = ["Beautiful Views", "Photo Worthy", "Hidden Gem", "Peaceful Escape", "Better with company", "Solo Friendly", "Sunset Spot", "Rich History", "Nature Escape"];
const FOOD_TAG_ICONS = [
  { label: "Delicious", icon: "😊" },
  { label: "Budget-Friendly", icon: "💳" },
  { label: "Hidden Gem", icon: "💎" },
  { label: "Photo-Worthy", icon: "📷" },
];
const PLACE_TAG_ICONS = [
  { label: "Beautiful View", icon: "⛺" },
  { label: "Photo-Worthy", icon: "📷" },
  { label: "Hidden Gem", icon: "💎" },
  { label: "Nature Escape", icon: "🌳" },
];
function RecForm({ rec, idx, setter, tags, placeholder, exampleText }) {
  const toggle = (tag) => setter(p => {
    const n = [...p]; const cur = n[idx].tags || [];
    n[idx] = { ...n[idx], tags: cur.includes(tag) ? cur.filter(t => t !== tag) : [...cur, tag] };
    return n;
  });
  const tagOptions = tags.map(t => typeof t === "string" ? { label: t, icon: null } : t);
  // Local state for text fields so typing doesn't re-render parent
  const [localName, setLocalName] = useState(rec.name || "");
  const [localLocation, setLocalLocation] = useState(rec.location || "");
  const [localBecause, setLocalBecause] = useState(rec.because || "");

  // Sync if rec changes externally
  useEffect(() => { setLocalName(rec.name || ""); }, [rec.name]);
  useEffect(() => { setLocalLocation(rec.location || ""); }, [rec.location]);
  useEffect(() => { setLocalBecause(rec.because || ""); }, [rec.because]);

  const commitName = (val) => setter(p => { const n = [...p]; n[idx] = { ...n[idx], name: val }; return n; });
  const commitLocation = (val) => setter(p => { const n = [...p]; n[idx] = { ...n[idx], location: val }; return n; });
  const commitBecause = (val) => setter(p => { const n = [...p]; n[idx] = { ...n[idx], because: val }; return n; });

  return (
    <div style={{ background: "#fff", border: "1px solid #E8D5F0", borderRadius: 16, padding: 16, marginBottom: 12 }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#2F2F33", marginBottom: 6 }}>Name</div>
        <input className="ob-input" placeholder={placeholder} value={localName}
          onChange={e => setLocalName(e.target.value)}
          onBlur={e => commitName(e.target.value)} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#2F2F33", marginBottom: 6 }}>Location</div>
        <input className="ob-input" placeholder="Enter location" value={localLocation}
          onChange={e => setLocalLocation(e.target.value)}
          onBlur={e => commitLocation(e.target.value)} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#2F2F33", marginBottom: 6 }}>This place is worth visiting because...</div>
        <textarea className="ob-input" rows={2} style={{ resize: "none" }} placeholder={exampleText} value={localBecause}
          onChange={e => setLocalBecause(e.target.value)}
          onBlur={e => commitBecause(e.target.value)} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#2F2F33", marginBottom: 4 }}>What makes this place special?</div>
        <div style={{ fontSize: 12, color: "#9090B0", marginBottom: 10 }}>Select the options that best describe this place.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {tagOptions.map(({ label, icon }) => {
            const sel = (rec.tags || []).includes(label);
            return (
              <button key={label} type="button" onClick={() => toggle(label)}
                style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px solid " + (sel ? "#581073" : "#E8D5F0"), borderRadius: 10, padding: "9px 10px", fontSize: 12, fontWeight: 600, color: sel ? "#581073" : "#4A4A6A", background: sel ? "#F5E8F9" : "#F8F8FC", cursor: "pointer" }}>
                {icon && <span>{icon}</span>}{label}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#2F2F33", marginBottom: 4 }}>Photos <span style={{ color: "#9090B0", fontWeight: 400 }}>(Optional)</span></div>
        <div style={{ fontSize: 12, color: "#9090B0", marginBottom: 8 }}>Help others discover this place by adding a photo.</div>
        <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed #E8D5F0", borderRadius: 12, padding: 20, cursor: "pointer", background: "#F8F8FC" }}>
          {rec.photoUrl && typeof rec.photoUrl === "string" && rec.photoUrl.startsWith("http") ? (
            <img src={rec.photoUrl} alt="" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8 }} />
          ) : rec.photo && rec.photo instanceof File ? (
            <img src={URL.createObjectURL(rec.photo)} alt="" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8 }} />
          ) : (
            <><div style={{ width: 40, height: 40, borderRadius: "50%", background: "#F5E8F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#581073", marginBottom: 8 }}>+</div><span style={{ fontSize: 13, color: "#581073", fontWeight: 600 }}>Add Photo</span></>
          )}
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
            const f = e.target.files?.[0];
            if (!f) return;
            setter(p => { const n = [...p]; n[idx] = { ...n[idx], photo: f, photoUrl: "" }; return n; });
          }} />
        </label>
        <div style={{ fontSize: 11, color: "#9090B0", marginTop: 6 }}>You can always add more later.</div>
      </div>
    </div>
  );
}

function Onboarding({ onDone, onShowSignIn, onBackToLanding, initialCity, initialName, initialAge, initialPronouns, session, onSignUp }) {
  const skipBasics = !!initialName;
  // Step 1: account (email/pw) — skipped if session exists
  // Step 2: name/age/college — required
  // Step 3: photos + enjoy + things + thoughts — skippable
  // Step 4: place recs — skippable
  // Step 5: done screen
  const [step, setStep] = useState(
    skipBasics ? 3 :  // returning user with name → skip to interests
    session ? 2 :     // has session but no name → start at name/age
    1                 // fresh signup → start at email/password
  );
  const [signupEmail, setSignupEmail] = useState(""); // for confirm screen
  const [showConfirm, setShowConfirm] = useState(false);
  const city = "mumbai"; // Single city launch

  // Step 1
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  // Step 2
  const [name, setName] = useState(initialName || "");
  const [college, setCollege] = useState("");
  const [location, setLocation] = useState("");
  const [age, setAge] = useState(initialAge ? String(initialAge) : "");
  const [gender, setGender] = useState(initialPronouns || "");
  const [genderOther, setGenderOther] = useState("");

  // Step 3
  const [photo, setPhoto] = useState(null);
  const [selEnjoy, setSelEnjoy] = useState([]);
  const toggleEnjoy = (item) => setSelEnjoy(p => p.includes(item) ? p.filter(x => x !== item) : [...p, item]);
  const [things, setThings] = useState([]);
  const [funTopics, setFunTopics] = useState([]);
  const [funAnswers, setFunAnswers] = useState({});
  const toggleFunTopic = (q) => setFunTopics(p => p.includes(q) ? p.filter(x => x !== q) : [...p, q]);

  // Step 4
  const [foodRecs, setFoodRecs] = useState([{ name: "", location: "", because: "", tags: [], photo: null }]);
  const [placeRecs, setPlaceRecs] = useState([{ name: "", location: "", because: "", tags: [], photo: null }]);

  // Step 5 (finish)
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState("");

  const finalGender = gender === "Other" ? genderOther : gender;

  const buildDonePayload = () => ({
    city,
    name,
    age,
    college,
    pronouns: finalGender,
    interests: selEnjoy,
    things: things.filter(t => t && t.trim()),
    cuisines: [],
    budget: "flexible",
    prompts: funTopics.reduce((acc, q) => {
      if (funAnswers[q]?.trim()) acc[q] = funAnswers[q].trim();
      return acc;
    }, {}),
    phone: "",
    location,
    food_recs: foodRecs.filter(r => r.name.trim()),
    city_recs: placeRecs.filter(r => r.name.trim()),
  });

  const headerStyle = { display: "flex", alignItems: "center", padding: "16px 20px 12px", borderBottom: "1px solid #F5E8F9" };
  // ── Confirm email screen ───────────────────────────────────────────────────
  if (showConfirm) return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", padding: "48px 24px" }}>
      <div style={{ maxWidth: 480, width: "100%", margin: "0 auto", textAlign: "center" }}>
        <NearMetLogo size={40} />
        <div style={{ fontSize: 56, margin: "32px 0 16px" }}>📬</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#2F2F33", marginBottom: 8 }}>Check your email</h2>
        <p style={{ fontSize: 14, color: "#9090B0", lineHeight: 1.7, marginBottom: 8 }}>
          We sent a confirmation link to<br />
          <strong style={{ color: "#2F2F33" }}>{signupEmail}</strong>
        </p>
        <p style={{ fontSize: 13, color: "#9090B0", lineHeight: 1.6, marginBottom: 24 }}>
          Click the link in the email to verify your account, then come back and sign in.
        </p>
        <div style={{ background: "#F5E8F9", border: "1px solid #F5E8F9", borderRadius: 12, padding: "14px 16px", fontSize: 13, color: "#581073", textAlign: "left", marginBottom: 24 }}>
          <strong>Didn't get it?</strong> Check your spam folder. The email is sent from hello@nearmet.com
        </div>
        <button className="ob-btn-primary ob-btn-full" onClick={onShowSignIn}>
          Go to sign in →
        </button>
      </div>
    </div>
  );

  // ── Step 1: Create account ────────────────────────────────────────────────────
  if (step === 1) return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}>
      <div style={headerStyle}>
        <button onClick={() => { if (onBackToLanding) onBackToLanding(); }} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", marginRight: 12, color: "#4A4A6A" }}>←</button>
        <NearMetLogo size={32} />
      </div>
      <div style={{ flex: 1, padding: "28px 24px", maxWidth: 480, width: "100%", margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#2F2F33", marginBottom: 6 }}>Join NearMet</h2>
        <p style={{ fontSize: 14, color: "#9090B0", marginBottom: 28 }}>Create your account to get started.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#9090B0", letterSpacing: ".07em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>EMAIL</label>
            <input className="ob-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#9090B0", letterSpacing: ".07em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>PASSWORD</label>
            <input className="ob-input" type="password" placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#9090B0", letterSpacing: ".07em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>CONFIRM PASSWORD</label>
            <input className="ob-input" type="password" placeholder="Repeat your password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
          </div>
        </div>
        {signupError && <div style={{ marginTop: 12, background: "#FFF0EE", border: "1px solid #FF9A8B", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#C94E3A" }}>{signupError}</div>}
        <button className="ob-btn-primary ob-btn-full" style={{ marginTop: 24 }}
          disabled={signupLoading || !email || !password}
          onClick={async () => {
            if (password !== confirmPw) { setSignupError("Passwords do not match."); return; }
            if (password.length < 8) { setSignupError("Password must be at least 8 characters."); return; }
            setSignupLoading(true); setSignupError("");
            try {
              const result = await onSignUp(email, password);
              setSignupEmail(email);
              // result.session is only set when email confirmation is OFF
              // If session is null/undefined, email confirmation is ON — show confirm screen
              if (result?.session) {
                setStep(2);
              } else {
                setShowConfirm(true);
              }
            } catch (e) {
              // If error contains "already registered", show a cleaner message
              const msg = e.message || "";
              if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("already exists")) {
                setSignupError("An account with this email already exists. Please sign in instead.");
              } else {
                setSignupError(msg || "Sign up failed. Please try again.");
              }
            }
            finally { setSignupLoading(false); }
          }}>
          {signupLoading ? "Creating account…" : "Create account →"}
        </button>
        <button className="auth-switch" onClick={onShowSignIn} style={{ width: "100%", marginTop: 16, textAlign: "center", fontSize: 14 }}>
          Already have an account? <span style={{ color: "#581073", fontWeight: 700 }}>Sign in</span>
        </button>
      </div>
    </div>
  );

  // ── Step 2: Basics (required) ─────────────────────────────────────────────────
  if (step === 2) return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}>
      <div style={headerStyle}>
        <button onClick={() => setStep(1)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", marginRight: 12, color: "#4A4A6A" }}>←</button>
        <NearMetLogo size={32} />
      </div>
      <div style={{ flex: 1, padding: "28px 24px", maxWidth: 480, width: "100%", margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#2F2F33", marginBottom: 6 }}>Welcome to NearMet</h2>
        <p style={{ fontSize: 14, color: "#9090B0", marginBottom: 28 }}>Let's get to know you.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#9090B0", letterSpacing: ".07em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>NAME</label>
            <input className="ob-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#9090B0", letterSpacing: ".07em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>AGE <span style={{ color: "var(--coral)" }}>*</span></label>
              <input className="ob-input" type="number" placeholder="Your age" value={age} onChange={e => setAge(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#9090B0", letterSpacing: ".07em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>COLLEGE</label>
              <input className="ob-input" placeholder="Your college name" value={college} onChange={e => setCollege(e.target.value)} />
            </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#9090B0", letterSpacing: ".07em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>YOUR AREA IN MUMBAI <span style={{ textTransform: "none", fontWeight: 500 }}>(optional)</span></label>
            <select className="ob-input" value={location} onChange={e => setLocation(e.target.value)} style={{ appearance: "auto" }}>
              <option value="">Select your neighbourhood...</option>
              {MUMBAI_HOODS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#9090B0", letterSpacing: ".07em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>GENDER</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Man", "Woman", "Non-binary", "Prefer not to say", "Other"].map(g => (
                <button key={g} type="button"
                  style={{ border: "1.5px solid " + (gender === g ? "#581073" : "#E8D5F0"), borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 600, color: gender === g ? "white" : "#4A4A6A", background: gender === g ? "#581073" : "#fff", cursor: "pointer" }}
                  onClick={() => setGender(g)}>{g}</button>
              ))}
            </div>
            {gender === "Other" && <input className="ob-input" style={{ marginTop: 10 }} placeholder="Your gender" value={genderOther} onChange={e => setGenderOther(e.target.value)} />}
          </div>
        </div>
        <button className="ob-btn-primary ob-btn-full" style={{ marginTop: 28 }}
          disabled={!name.trim() || !age || parseInt(age) < 18}
          onClick={() => setStep(3)}>
          Continue →
        </button>
        {age && parseInt(age) < 18 && <p style={{ textAlign: "center", fontSize: 12, color: "var(--coral-dk)", marginTop: 8 }}>You must be 18 or older to join NearMet.</p>}
      </div>
      <StepDots total={3} current={0} />
    </div>
  );

  // ── Step 3: Photos + Enjoy + Things + Thoughts (skippable) ────────────────────
  if (step === 3) return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}>
      <div style={headerStyle}>
        <button onClick={() => setStep(2)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", marginRight: 12, color: "#4A4A6A" }}>←</button>
        <NearMetLogo size={32} />
      </div>
      <div style={{ flex: 1, padding: "28px 24px", maxWidth: 480, width: "100%", margin: "0 auto", overflowY: "auto" }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: "#2F2F33", marginBottom: 4 }}>Let's Get to Know You</h2>
        <p style={{ fontSize: 14, color: "#9090B0", marginBottom: 28 }}>You can update or change these anytime.</p>

        {/* What I Enjoy */}
        <div style={{ fontSize: 16, fontWeight: 700, color: "#2F2F33", marginBottom: 4 }}>What I Enjoy</div>
        <p style={{ fontSize: 13, color: "#9090B0", marginBottom: 16 }}>Select everything you're genuinely into.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
          {INTEREST_LIST.map(item => {
            const sel = selEnjoy.includes(item);
            return (
              <button key={item} type="button" onClick={() => toggleEnjoy(item)}
                style={{ border: "1.5px solid " + (sel ? "#581073" : "#E8D5F0"), borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 600, color: sel ? "white" : "#4A4A6A", background: sel ? "#581073" : "#F8F8FC", cursor: "pointer" }}>
                {item}
              </button>
            );
          })}
        </div>

        {/* Things I Want to Do */}
        <div style={{ fontSize: 16, fontWeight: 700, color: "#2F2F33", marginBottom: 4 }}>Things I Want to Do</div>
        <p style={{ fontSize: 13, color: "#9090B0", marginBottom: 14 }}>Choose as many as you like — or add your own.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          {THINGS_LIST.map(t => {
            const sel = things.includes(t);
            return (
              <button key={t} type="button"
                onClick={() => setThings(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
                style={{ border: "1.5px solid " + (sel ? "#581073" : "#E8D5F0"), borderRadius: 999, padding: "7px 14px", fontSize: 12, fontWeight: 600, color: sel ? "white" : "#4A4A6A", background: sel ? "#581073" : "#F8F8FC", cursor: "pointer" }}>
                {t}
              </button>
            );
          })}
        </div>
        <input className="ob-input" style={{ marginTop: 6 }}
          placeholder="Or type your own (press Enter to add)..."
          onKeyDown={e => {
            if (e.key === "Enter" && e.target.value.trim()) {
              const val = e.target.value.trim();
              setThings(p => p.includes(val) ? p : [...p, val]);
              e.target.value = "";
              e.preventDefault();
            }
          }} />
        {things.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {things.map(t => (
              <span key={t} style={{ background: "#F5E8F9", color: "#581073", borderRadius: 999, padding: "5px 12px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                {t}
                <button type="button" onClick={() => setThings(p => p.filter(x => x !== t))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#581073", padding: 0, lineHeight: 1 }}>×</button>
              </span>
            ))}
          </div>
        )}

        {/* It's Fun Talking About */}
        <div style={{ fontSize: 16, fontWeight: 700, color: "#2F2F33", marginBottom: 4, marginTop: 28 }}>It's Fun Talking About</div>
        <p style={{ fontSize: 13, color: "#9090B0", marginBottom: 14 }}>Pick topics you'd love to bond over — quick answers make great conversation starters.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {FUN_TALKING_ABOUT.map(({ label, question }) => {
            const sel = funTopics.includes(question);
            return (
              <button key={question} type="button" onClick={() => toggleFunTopic(question)}
                style={{ border: "1.5px solid " + (sel ? "#581073" : "#E8D5F0"), borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 600, color: sel ? "white" : "#4A4A6A", background: sel ? "#581073" : "#F8F8FC", cursor: "pointer" }}>
                {label}
              </button>
            );
          })}
        </div>
        {funTopics.map(q => {
          const topic = FUN_TALKING_ABOUT.find(t => t.question === q);
          return (
            <div key={q} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#2F2F33", marginBottom: 6 }}>{topic?.label}</div>
              <input className="ob-input" placeholder={topic?.example || q}
                value={funAnswers[q] || ""}
                onChange={e => setFunAnswers(p => ({ ...p, [q]: e.target.value }))} />
            </div>
          );
        })}
      </div>
      <div style={{ padding: "12px 24px 20px", background: "#fff", borderTop: "1px solid #F5E8F9" }}>
        <StepDots total={5} current={1} />
        <button className="ob-btn-primary ob-btn-full" onClick={() => setStep(4)}>
          Continue →
        </button>
      </div>
    </div>
  );

  // ── Step 4: Place recommendations (skippable) ──────────────────────────────────

  // ── Step 4: Food Spots (skippable) ────────────────────────────────────────────
  // ── Step 4: Food Spots (skippable) ────────────────────────────────────────────
  if (step === 4) {
    const rec = foodRecs[0] || { name: "", location: "", because: "", tags: [], photo: null };
    const setRec = updates => setFoodRecs([{ ...rec, ...updates }]);
    return (
    <div style={{ minHeight: "100vh", background: "#F8F8FC", display: "flex", flexDirection: "column" }}>
      <div style={headerStyle}>
        <button onClick={() => setStep(3)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", marginRight: 12, color: "#4A4A6A" }}>←</button>
        <NearMetLogo size={32} />
        <button onClick={() => setStep(STEP_4B)} style={{ marginLeft: "auto", fontSize: 14, fontWeight: 600, color: "#9090B0", background: "none", border: "none", cursor: "pointer" }}>Skip</button>
      </div>
      <div style={{ flex: 1, padding: "28px 24px", maxWidth: 480, width: "100%", margin: "0 auto", overflowY: "auto" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#2F2F33", letterSpacing: "-0.02em", marginBottom: 4, textAlign: "center" }}>Share a food spot you enjoy</h2>
        <p style={{ fontSize: 14, color: "#9090B0", marginBottom: 24, textAlign: "center" }}>Help others discover great places.</p>

        <div style={{ background: "#fff", border: "1px solid #E8D5F0", borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>🏠</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#2F2F33" }}>Food spot name</span>
          </div>
          <input className="ob-input" style={{ marginBottom: 18 }} placeholder="Enter food spot name" value={rec.name}
            onChange={e => setRec({ name: e.target.value })} />

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>📍</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#2F2F33" }}>Location</span>
          </div>
          <input className="ob-input" style={{ marginBottom: 18 }} placeholder="Enter location" value={rec.location}
            onChange={e => setRec({ location: e.target.value })} />

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>💬</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#2F2F33" }}>Share your experience</span>
          </div>
          <textarea className="ob-input" rows={3} style={{ resize: "none", marginBottom: 18 }}
            placeholder={`Example: "The ramen is delicious, the portions are generous and it's affordable."`}
            value={rec.because} onChange={e => setRec({ because: e.target.value })} />

          <div style={{ fontSize: 14, fontWeight: 700, color: "#2F2F33", marginBottom: 10 }}>What best describes this spot?</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
            {FOOD_TAG_ICONS.map(({ label, icon }) => {
              const sel = (rec.tags || []).includes(label);
              return (
                <button key={label} type="button"
                  onClick={() => setRec({ tags: sel ? rec.tags.filter(t => t !== label) : [...(rec.tags || []), label] })}
                  style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px solid " + (sel ? "#581073" : "#E8D5F0"), borderRadius: 10, padding: "10px 12px", fontSize: 13, fontWeight: 600, color: sel ? "#581073" : "#4A4A6A", background: sel ? "#F5E8F9" : "#F8F8FC", cursor: "pointer" }}>
                  <span>{icon}</span>{label}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>📷</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#2F2F33" }}>Add a photo <span style={{ fontWeight: 400, color: "#9090B0" }}>(optional)</span></span>
          </div>
          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed #E8D5F0", borderRadius: 12, padding: 24, cursor: "pointer", background: "#F8F8FC" }}>
            {rec.photo ? <img src={URL.createObjectURL(rec.photo)} alt="" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }} /> : (
              <><div style={{ width: 40, height: 40, borderRadius: "50%", background: "#F5E8F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#581073", marginBottom: 8 }}>+</div><span style={{ fontSize: 13, color: "#581073", fontWeight: 600 }}>Add Photo</span></>
            )}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) setRec({ photo: f }); }} />
          </label>
          <div style={{ fontSize: 11, color: "#9090B0", marginTop: 8 }}>Help others discover this place by adding a photo.</div>
        </div>
      </div>
      <div style={{ padding: "12px 24px 20px", background: "#fff", borderTop: "1px solid #F5E8F9" }}>
        <StepDots total={5} current={2} />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setStep(3)} style={{ flex: 1, background: "#F5E8F9", color: "#581073", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>← Back</button>
          <button className="ob-btn-primary" style={{ flex: 2, borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer" }} onClick={() => setStep(STEP_4B)}>Save & Continue →</button>
        </div>
      </div>
    </div>
  );
  }
  // ── Step 4b: Places Worth Exploring (skippable) ────────────────────────────────
  if (step === STEP_4B) {
    const rec = placeRecs[0] || { name: "", location: "", because: "", tags: [], photo: null };
    const setRec = updates => setPlaceRecs([{ ...rec, ...updates }]);
    return (
    <div style={{ minHeight: "100vh", background: "#F8F8FC", display: "flex", flexDirection: "column" }}>
      <div style={headerStyle}>
        <button onClick={() => setStep(4)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", marginRight: 12, color: "#4A4A6A" }}>←</button>
        <NearMetLogo size={32} />
        <button onClick={() => setStep(STEP_PHOTO)} style={{ marginLeft: "auto", fontSize: 14, fontWeight: 600, color: "#9090B0", background: "none", border: "none", cursor: "pointer" }}>Skip</button>
      </div>
      <div style={{ flex: 1, padding: "28px 24px", maxWidth: 480, width: "100%", margin: "0 auto", overflowY: "auto" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#2F2F33", letterSpacing: "-0.02em", marginBottom: 4, textAlign: "center" }}>Share a place worth exploring</h2>
        <p style={{ fontSize: 14, color: "#9090B0", marginBottom: 24, textAlign: "center" }}>Help others discover great places.</p>

        <div style={{ background: "#fff", border: "1px solid #E8D5F0", borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>📍</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#2F2F33" }}>Place name</span>
          </div>
          <input className="ob-input" style={{ marginBottom: 18 }} placeholder="Enter place name" value={rec.name}
            onChange={e => setRec({ name: e.target.value })} />

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>📍</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#2F2F33" }}>Location</span>
          </div>
          <input className="ob-input" style={{ marginBottom: 18 }} placeholder="Enter location" value={rec.location}
            onChange={e => setRec({ location: e.target.value })} />

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>💬</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#2F2F33" }}>Why is this place worth visiting?</span>
          </div>
          <textarea className="ob-input" rows={3} style={{ resize: "none", marginBottom: 18 }}
            placeholder={`Example: "Watching the sunset here feels peaceful."`}
            value={rec.because} onChange={e => setRec({ because: e.target.value })} />

          <div style={{ fontSize: 14, fontWeight: 700, color: "#2F2F33", marginBottom: 10 }}>What makes this place special?</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
            {PLACE_TAG_ICONS.map(({ label, icon }) => {
              const sel = (rec.tags || []).includes(label);
              return (
                <button key={label} type="button"
                  onClick={() => setRec({ tags: sel ? rec.tags.filter(t => t !== label) : [...(rec.tags || []), label] })}
                  style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px solid " + (sel ? "#581073" : "#E8D5F0"), borderRadius: 10, padding: "10px 12px", fontSize: 13, fontWeight: 600, color: sel ? "#581073" : "#4A4A6A", background: sel ? "#F5E8F9" : "#F8F8FC", cursor: "pointer" }}>
                  <span>{icon}</span>{label}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>📷</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#2F2F33" }}>Add a photo <span style={{ fontWeight: 400, color: "#9090B0" }}>(optional)</span></span>
          </div>
          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed #E8D5F0", borderRadius: 12, padding: 24, cursor: "pointer", background: "#F8F8FC" }}>
            {rec.photo ? <img src={URL.createObjectURL(rec.photo)} alt="" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }} /> : (
              <><div style={{ width: 40, height: 40, borderRadius: "50%", background: "#F5E8F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#581073", marginBottom: 8 }}>+</div><span style={{ fontSize: 13, color: "#581073", fontWeight: 600 }}>Add Photo</span></>
            )}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) setRec({ photo: f }); }} />
          </label>
          <div style={{ fontSize: 11, color: "#9090B0", marginTop: 8 }}>Help others discover this place by adding a photo.</div>
        </div>
      </div>
      <div style={{ padding: "12px 24px 20px", background: "#fff", borderTop: "1px solid #F5E8F9" }}>
        <StepDots total={5} current={3} />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setStep(4)} style={{ flex: 1, background: "#F5E8F9", color: "#581073", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>← Back</button>
          <button className="ob-btn-primary" style={{ flex: 2, borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer" }} onClick={() => setStep(STEP_PHOTO)}>Finish →</button>
        </div>
      </div>
    </div>
  );
  }
  if (step === STEP_PHOTO) return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}>
      <div style={headerStyle}>
        <button onClick={() => setStep(STEP_4B)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", marginRight: 12, color: "#4A4A6A" }}>←</button>
        <NearMetLogo size={32} />
      </div>
      <div style={{ flex: 1, padding: "28px 24px", maxWidth: 480, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#2F2F33", marginBottom: 6 }}>Add your photo</h2>
        <p style={{ fontSize: 14, color: "#9090B0", marginBottom: 32, maxWidth: 320 }}>One clear photo of you — this is what people will see first.</p>
        <label style={{ cursor: "pointer", position: "relative" }}>
          <div style={{ width: 200, height: 200, borderRadius: "50%", border: "3px solid #E8D5F0", overflow: "hidden", background: "#F5E8F9", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(88,16,115,0.12)" }}>
            {photo ? <img src={URL.createObjectURL(photo)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> :
              <div style={{ fontSize: 40, color: "#581073" }}>+</div>}
          </div>
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) setPhoto(f); }} />
        </label>
        <div style={{ fontSize: 13, color: "#581073", fontWeight: 600, marginTop: 14 }}>{photo ? "Tap to change" : "Tap to add a photo"}</div>
      </div>
      <div style={{ padding: "12px 24px 20px", background: "#fff", borderTop: "1px solid #F5E8F9" }}>
        <StepDots total={5} current={4} />
        <button className="ob-btn-primary ob-btn-full" disabled={!photo} onClick={() => setStep(5)}>Continue →</button>
        {!photo && <p style={{ textAlign: "center", fontSize: 12, color: "var(--coral-dk)", marginTop: 8 }}>Please add a photo to continue.</p>}
      </div>
    </div>
  );

  // ── Step 5: Done ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#F8F8FC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <NearMetLogo size={52} />
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#F5E8F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginTop: 32, marginBottom: 16 }}>✓</div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#2F2F33", textAlign: "center", marginBottom: 8 }}>Your NearMet profile is ready.</h1>
      <p style={{ fontSize: 14, color: "#9090B0", textAlign: "center", lineHeight: 1.6, marginBottom: 24 }}>Time to meet like-minded people and create lasting memories.</p>
      {finishError && (
        <div style={{ maxWidth: 340, width: "100%", background: "#FFF0EE", border: "1px solid #FF9A8B", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#C94E3A", marginBottom: 16 }}>
          {finishError}
        </div>
      )}
      <button className="ob-btn-primary ob-btn-full" style={{ maxWidth: 340 }} disabled={finishing} onClick={async () => {
        setFinishing(true); setFinishError("");
        const payload = buildDonePayload();

        try {
          // Upload the single profile photo using the same function as the profile screen
          const { uploadProfilePhoto: uploadPhoto } = await import("./lib/supabase.js");
          let photoUrls = [];
          if (photo instanceof File) {
            const userId = session?.user?.id || (await supabase.auth.getSession()).data?.session?.user?.id;
            if (!userId) throw new Error("We couldn't find your account — please try again.");
            const url = await uploadPhoto(userId, photo, 0);
            if (!url) throw new Error("Your photo didn't upload — please try again.");
            photoUrls = [url];
          }
          payload.photo_urls = photoUrls;

          // Upload rec photos
          const uploadIfFile = async (rec, bucket, path) => {
            if (!rec.photo || typeof rec.photo !== "object" || !rec.photo.name) return rec;
            try {
              const ext = rec.photo.name.split(".").pop();
              const filePath = `${path}/${Date.now()}.${ext}`;
              const { error } = await supabase.storage.from(bucket).upload(filePath, rec.photo, { upsert: true });
              if (error) return rec;
              const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
              return { ...rec, photoUrl: data.publicUrl, photo: null };
            } catch { return rec; }
          };
          payload.food_recs = await Promise.all((payload.food_recs || []).map(r => uploadIfFile(r, "place-photos", "food-recs")));
          payload.city_recs = await Promise.all((payload.city_recs || []).map(r => uploadIfFile(r, "place-photos", "city-recs")));
          await onDone(payload);
        } catch (e) {
          console.error("Onboarding finish failed:", e);
          setFinishError(e.message || "Something went wrong finishing your profile — please try again.");
          setFinishing(false);
        }
      }}>
        {finishing ? "Setting up your profile…" : "Enter NearMet →"}
      </button>
    </div>
  );
}



// ─── CHAT VIEW ────────────────────────────────────────────────────────────────
function ChatView({ connectionId, person, userId, onBack, onBlocked }) {
  const [chatInput, setChatInput] = useState("");
  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatLoading, setChatLoading] = useState(true);
  const [chatError, setChatError] = useState("");
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [blockConfirm, setBlockConfirm] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    let active = true;
    setChatLoading(true);
    getMessages(connectionId)
      .then(msgs => { if (active) setChatMsgs(msgs || []); })
      .catch(e => { console.error(e); if (active) setChatError("Couldn't load this conversation."); })
      .finally(() => { if (active) setChatLoading(false); });

    const sub = subscribeToMessages(connectionId, newMsg => {
      setChatMsgs(prev => {
        if (prev.find(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    const poll = setInterval(() => {
      if (!active) return;
      getMessages(connectionId).then(msgs => {
        if (!active) return;
        setChatMsgs(prev => (!msgs || msgs.length === prev.length) ? prev : msgs);
      }).catch(() => {});
    }, 3000);

    return () => { active = false; sub?.unsubscribe?.(); clearInterval(poll); };
  }, [connectionId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMsgs]);

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const text = chatInput.trim(); setChatInput(""); setChatError("");
    try { const msg = await sendMessage(connectionId, userId, text); setChatMsgs(p => [...p, msg]); }
    catch (e) { console.error(e); setChatError("Couldn't send that — please try again."); }
  };

  const handleBlock = async () => {
    setBlocking(true);
    try {
      await blockUser(userId, person.id);
      onBlocked?.();
      onBack();
    }
    catch (e) { console.error(e); setBlocking(false); setBlockConfirm(false); }
  };

  const theirPrompts = person.prompts
    ? Array.isArray(person.prompts) ? person.prompts.filter(p => p.a)
      : Object.entries(person.prompts).filter(([, ans]) => ans?.trim()).map(([q, a]) => ({ q, a }))
    : [];

  return (
    <div className="chat-root">
      {blockConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "var(--white)", borderRadius: 20, padding: 24, maxWidth: 320, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🚫</div>
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>Block {person.name}?</div>
            <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.6, marginBottom: 20 }}>They won't be able to see your profile or message you. This can't be undone.</p>
            <button onClick={handleBlock} disabled={blocking} style={{ width: "100%", background: "#c0392b", color: "white", borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", marginBottom: 10 }}>
              {blocking ? "Blocking…" : `Block ${person.name}`}
            </button>
            <button onClick={() => setBlockConfirm(false)} style={{ width: "100%", background: "var(--bg2)", color: "var(--text2)", borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}
      <div className="chat-header">
        <button className="chat-back" onClick={onBack}>←</button>
        <div className="chat-avatar">{(person.name || "?").slice(0, 2).toUpperCase()}</div>
        <div style={{ flex: 1 }}><div className="chat-uname">{person.name}</div></div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowBlockMenu(o => !o)} style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid var(--border)", background: "var(--white)", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text3)" }}>⋯</button>
          {showBlockMenu && (
            <div style={{ position: "absolute", right: 0, top: 38, background: "var(--white)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow2)", zIndex: 50, minWidth: 160, overflow: "hidden" }}>
              <button onClick={() => { setShowBlockMenu(false); setBlockConfirm(true); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 16px", fontSize: 14, fontWeight: 600, color: "#c0392b", background: "none", border: "none", cursor: "pointer" }}>🚫 Block {person.name}</button>
            </div>
          )}
        </div>
      </div>
      <div className="chat-msgs">
        {chatLoading && <div className="chat-empty"><p>Loading…</p></div>}
        {chatError && <div style={{ textAlign: "center", padding: 16, color: "var(--text3)", fontSize: 13 }}>{chatError}</div>}
        {!chatLoading && chatMsgs.length === 0 && (
          <div className="chat-empty">
            <div style={{ fontSize: 28 }}>✦</div>
            <p style={{ fontWeight: 700, marginBottom: 6 }}>Start a real conversation.</p>
            {theirPrompts[0] && (
              <div style={{ background: "var(--bg2)", borderRadius: 12, padding: "12px 14px", marginTop: 10, textAlign: "left", cursor: "pointer" }} onClick={() => setChatInput(`I saw your answer to "${theirPrompts[0].q?.slice(0, 40)}…" — `)}>
                <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>Their answer to:</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{theirPrompts[0].q}</div>
                <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>{theirPrompts[0].a}</div>
                <div style={{ fontSize: 11, color: "var(--purple)", marginTop: 8, fontWeight: 600 }}>Tap to reply →</div>
              </div>
            )}
          </div>
        )}
        {!chatLoading && chatMsgs.map((m, i) => <div key={m.id || i} className={`chat-bubble ${m.sender_id === userId ? "me" : ""}`}>{m.text}</div>)}
        <div ref={bottomRef} />
      </div>
      {chatError && chatMsgs.length > 0 && <div style={{ padding: "8px 16px", fontSize: 12, color: "#c0392b" }}>{chatError}</div>}
      <div className="chat-input-row">
        <input className="chat-input" placeholder="Say something..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }} />
        <button className="chat-send" onClick={sendChatMessage} disabled={!chatInput.trim()}>Send</button>
      </div>
    </div>
  );
}

// ─── MESSAGES PANEL ───────────────────────────────────────────────────────────
function MessagesPanel({ userId, onClose, onPendingChange }) {
  const [connections, setConnections] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [openChat, setOpenChat] = useState(null);
  const [activeTab, setActiveTab] = useState("messages");
  const [actionLoading, setActionLoading] = useState(null);
  const [seenCounts, setSeenCounts] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`nm_seen_${userId}`) || "{}"); }
    catch { return {}; }
  });

  const markSeen = (connId, count) => {
    setSeenCounts(prev => {
      const next = { ...prev, [connId]: count };
      try { localStorage.setItem(`nm_seen_${userId}`, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const load = () => {
    if (!userId) { setLoading(false); return; }
    let active = true;
    setLoading(true);
    Promise.all([getConnections(userId), getPendingRequests(userId)])
      .then(([conns, reqs]) => {
        if (!active) return;
        setConnections(conns || []);
        setPending(reqs || []);
        onPendingChange?.((reqs || []).length);
      })
      .catch(e => { console.error(e); if (active) setLoadError("Couldn't load messages right now."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  };

  useEffect(load, [userId]);

  if (openChat) return (
    <div className="msgs-overlay">
      <div className="msgs-overlay-bg" onClick={onClose} />
      <div className="msgs-panel msgs-panel-chat">
        <ChatView connectionId={openChat.id} person={openChat.otherPerson} userId={userId} onBack={() => setOpenChat(null)} onBlocked={() => { setOpenChat(null); load(); }} />
      </div>
    </div>
  );

  const visibleConnections = connections.filter(c => {
    const other = c.user1_id === userId ? c.user2 : c.user1;
    if (!other || other.id === userId) return false;
    if (c.status === 'pending') return false;
    const msgCount = Array.isArray(c.messages) ? (c.messages[0]?.count ?? 0) : 0;
    return msgCount > 0;
  });

  const handleAccept = async (conn) => {
    setActionLoading(conn.id + "_accept");
    try {
      await acceptRequest(conn.id);
      const requester = conn.requester_id === conn.user1_id ? conn.user1 : conn.user2;
      setOpenChat({ id: conn.id, otherPerson: requester });
      load();
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  const handleReject = async (connId, otherId) => {
    setActionLoading(connId + "_reject");
    try { await rejectRequest(connId); await blockUser(userId, otherId); load(); }
    catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  return (
    <div className="msgs-overlay">
      <div className="msgs-overlay-bg" onClick={onClose} />
      <div className="msgs-panel">
        <div className="msgs-panel-header">
          <div className="msgs-panel-title">Messages</div>
          {pending.length > 0 && <div style={{ background: "#581073", color: "white", borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{pending.length}</div>}
          <button className="msgs-panel-close" onClick={onClose}>×</button>
        </div>
        {pending.length > 0 && (
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
            {[["messages", "Messages"], ["requests", `Requests (${pending.length})`]].map(([id, lbl]) => (
              <button key={id} onClick={() => setActiveTab(id)} style={{ flex: 1, padding: "11px 8px", fontSize: 13, fontWeight: 600, border: "none", background: "none", cursor: "pointer", color: activeTab === id ? "#581073" : "var(--text3)", borderBottom: activeTab === id ? "2.5px solid #581073" : "2.5px solid transparent" }}>{lbl}</button>
            ))}
          </div>
        )}
        <div className="msgs-list">
          {loading && <div className="conn-empty" style={{ padding: "40px 16px" }}><p>Loading…</p></div>}
          {!loading && loadError && <div className="conn-empty" style={{ padding: "40px 16px" }}><p>{loadError}</p></div>}
          {!loading && activeTab === "requests" && pending.map(c => {
            const requester = c.requester_id === c.user1_id ? c.user1 : c.user2;
            if (!requester) return null;
            const photo = (requester.photo_urls || []).filter(Boolean)[0];
            const initials = (requester.name || "?").slice(0, 2).toUpperCase();
            return (
              <div key={c.id} style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  {photo ? <img src={photo} alt="" className="msgs-list-avatar-img" /> : <div className="msgs-list-avatar">{initials}</div>}
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{requester.name}{requester.age ? `, ${requester.age}` : ""}</div>
                    <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>Wants to connect with you</div>
                  </div>
                </div>
                {(requester.interests || []).length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                    {(requester.interests || []).slice(0, 4).map(i => {
                      return <span key={i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 600, color: "var(--text2)" }}>{formatInterest(i)}</span>;
                    })}
                  </div>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleAccept(c)} disabled={!!actionLoading} style={{ flex: 2, background: "#581073", color: "white", border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{actionLoading === c.id + "_accept" ? "Accepting…" : "Accept"}</button>
                  <button onClick={() => handleReject(c.id, requester.id)} disabled={!!actionLoading} style={{ flex: 1, background: "var(--bg2)", color: "var(--text2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{actionLoading === c.id + "_reject" ? "…" : "✕"}</button>
                </div>
              </div>
            );
          })}
          {!loading && activeTab === "messages" && visibleConnections.length === 0 && (
            <div className="conn-empty" style={{ padding: "40px 16px" }}>
              <div style={{ fontSize: 36 }}>💬</div>
              <div className="conn-empty-title">No conversations yet</div>
              <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 6 }}>Message someone from Connections to start chatting.</p>
            </div>
          )}
          {!loading && activeTab === "messages" && visibleConnections.map(c => {
            const other = c.user1_id === userId ? c.user2 : c.user1;
            const initials = (other.name || "?").slice(0, 2).toUpperCase();
            const photo = (other.photo_urls || []).filter(Boolean)[0];
            const msgCount = Array.isArray(c.messages) ? (c.messages[0]?.count ?? 0) : 0;
            const lastSeen = seenCounts[c.id] ?? 0;
            const hasNew = msgCount > lastSeen;
            return (
              <button key={c.id} className="msgs-list-row" style={{ background: hasNew ? "var(--purple-lt)" : "transparent" }} onClick={() => { markSeen(c.id, msgCount); setOpenChat({ id: c.id, otherPerson: other }); }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  {photo ? <img src={photo} alt="" className="msgs-list-avatar-img" /> : <div className="msgs-list-avatar">{initials}</div>}
                  {hasNew && <div style={{ position: "absolute", top: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: "#FF9A8B", border: "2px solid white" }} />}
                </div>
                <div className="msgs-list-info">
                  <div className="msgs-list-name" style={{ fontWeight: hasNew ? 800 : 600 }}>{other.name}{other.age ? `, ${other.age}` : ""}</div>
                  <div className="msgs-list-sub" style={{ color: hasNew ? "#581073" : undefined, fontWeight: hasNew ? 600 : undefined }}>{hasNew ? "New message" : "Tap to open conversation"}</div>
                </div>
                <span className="msgs-list-chevron">›</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


// Match interests flexibly — handles both old IDs ("music") and new label-based IDs ("movies_&_tv_series")
function interestsMatch(a, b) {
  const norm = s => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  return norm(a) === norm(b);
}
function sharedInterests(arrA, arrB) {
  return (arrA || []).filter(a => (arrB || []).some(b => interestsMatch(a, b)));
}
// Convert stored interest ID to readable label
// Handles both old short IDs via INTEREST_OPTIONS and new underscore format
function formatInterest(id) {
  if (!id) return "";
  const opt = INTEREST_OPTIONS.find(o => o.id === id);
  if (opt) return (opt.icon ? opt.icon + " " : "") + opt.label;
  // New format: "reality_tv" → "Reality TV", "movies_&_tv_series" → "Movies & TV Series"
  return id.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()).replace("& ", "& ");
}

// ─── FULL PROFILE VIEW ─────────────────────────────────────────────────────────
function flattenRec(r) {
  let val = r;
  let attempts = 0;
  while (attempts < 10) {
    attempts++;
    if (val == null) return { name: "", location: "", because: "", tags: [] };
    if (typeof val === "string") {
      if (!val.startsWith("{")) return { name: val, location: "", because: "", tags: [] };
      try { val = JSON.parse(val); } catch(e) { return { name: val, location: "", because: "", tags: [] }; }
    } else if (typeof val === "object" && !Array.isArray(val)) {
      let name = val.name || "";
      if (typeof name === "string" && name.startsWith("{")) {
        try { name = JSON.parse(name).name || ""; } catch(e) {}
      }
      return { name, location: val.location || "", because: val.because || "", tags: Array.isArray(val.tags) ? val.tags : [] };
    } else {
      return { name: "", location: "", because: "", tags: [] };
    }
  }
  return { name: "", location: "", because: "", tags: [] };
}

function FullProfileView({ person, city, onBack, onMessage, connecting, me }) {
  const cd = CITIES[city] || CITIES.mumbai;
  const photos = (person.photo_urls || []).filter(Boolean);
  const [idx, setIdx] = useState(0);
  const interests = person.interests || [];
  const things = person.city_wants || person.things || [];
  const priv = person.privacy_settings || {};
  const foodRecs = priv.hide_food_recs ? [] : (person.food_recs || []);
  const cityRecs = priv.hide_city_recs ? [] : (person.city_recs || []);
  const myInterests = me?.interests || [];
  const myThings = me?.things || me?.city_wants || [];

  const prompts = priv.hide_prompts ? [] : (person.prompts
    ? Array.isArray(person.prompts) ? person.prompts.filter(p => p.a)
      : Object.entries(person.prompts).filter(([, ans]) => ans?.trim()).map(([q, a]) => ({ q, a }))
    : []);

  return (
    <div className="pv-fullscreen">
      <div style={{ position: "relative", padding: "24px 20px 8px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <button className="pv-back-btn" style={{ position: "absolute", top: 16, left: 16 }} onClick={onBack}>←</button>
        <div style={{ width: 160, height: 160, borderRadius: "50%", overflow: "hidden", border: "3px solid var(--purple-lt)", background: "var(--purple-lt)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {photos[0]
            ? <img src={photos[0]} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onContextMenu={e => e.preventDefault()} draggable={false} />
            : <div style={{ fontSize: 44, fontWeight: 800, color: "var(--purple)" }}>{(person.name || "?").slice(0, 2).toUpperCase()}</div>}
        </div>
      </div>

      <div className="pv-content">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>
            {person.name}{!priv.hide_age && person.age ? `, ${person.age}` : ""}
          </div>
          {!priv.hide_gender && (person.gender || person.pronouns) && (
            <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 3, fontWeight: 500 }}>{person.gender || person.pronouns}</div>
          )}
          <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 6 }}>
            📍 {!priv.hide_location && person.location ? `${person.location}, ` : ""}{cd.label}
          </div>
        </div>

        {/* Interests */}
        {interests.length > 0 && (() => {
          const sharedInts = sharedInterests(interests, myInterests);
          return (
            <>
              <div className="pv-section-title">Interests{sharedInts.length > 0 && <span style={{ fontSize: 12, color: "var(--coral)", fontWeight: 600, marginLeft: 10 }}>✦ {sharedInts.length} in common</span>}</div>
              <div className="pv-interest-chips">
                {interests.map(i => {
                  const isShared = sharedInts.includes(i);
                  return (
                    <span key={i} className="pv-interest-chip" style={isShared ? { background: "var(--coral-lt)", color: "var(--coral-dk)", border: "1.5px solid var(--coral)", fontWeight: 700 } : {}}>
                      {formatInterest(i)}{isShared ? " ✦" : ""}
                    </span>
                  );
                })}
              </div>
            </>
          );
        })()}

        {/* Things to do */}
        {things.length > 0 && (() => {
          const shared = things.filter(t => myThings.includes(t));
          const other = things.filter(t => !myThings.includes(t));
          const display = [...shared, ...other].slice(0, 6);
          return (
            <>
              <div className="pv-section-title">Things to do together{shared.length > 0 && <span style={{ fontSize: 12, color: "var(--coral)", fontWeight: 600, marginLeft: 10 }}>✦ {shared.length} in common</span>}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {display.map(t => (
                  <span key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, background: shared.includes(t) ? "var(--coral-lt)" : "var(--bg)", color: shared.includes(t) ? "var(--coral-dk)" : "var(--text3)", border: shared.includes(t) ? "1.5px solid var(--coral)" : "1px solid var(--border)", borderRadius: 8, padding: "5px 10px" }}>
                    <span style={{ fontSize: 15 }}>{ACTIVITY_ICONS[t] || "📌"}</span>{t}
                  </span>
                ))}
              </div>
            </>
          );
        })()}

        {/* Prompts */}
        {prompts.length > 0 && (
          <>
            <div className="pv-section-title">Thoughts</div>
            {prompts.map((p, i) => (
              <div key={i} className="pv-prompt-card">
                <div className="pv-prompt-q">{p.q}</div>
                <div className="pv-prompt-a">{p.a}</div>
              </div>
            ))}
          </>
        )}

        {/* Food recs */}
        {foodRecs.filter(Boolean).length > 0 && (
          <>
            <div className="pv-section-title">🍽️ Food picks in {cd.label}</div>
            <div className="pv-recs-grid">
              {foodRecs.filter(Boolean).map((r, i) => {
                const rec = flattenRec(r);
                if (!rec.name) return null;
                return (
                  <div key={i} className="pv-rec-item">
                    <div className="pv-rec-name">{rec.name}</div>
                    {rec.location && <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>📍 {rec.location}</div>}
                    {rec.because && <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4, lineHeight: 1.5, fontStyle: "italic" }}>"{rec.because}"</div>}
                    {rec.tags?.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>{rec.tags.map(t => <span key={t} style={{ background: "var(--purple-lt)", color: "var(--purple)", borderRadius: 999, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>{t}</span>)}</div>}
                    {rec.photoUrl && <img src={rec.photoUrl} alt={rec.name} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, marginTop: 8 }} />}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* City recs */}
        {cityRecs.filter(Boolean).length > 0 && (
          <>
            <div className="pv-section-title">📍 City favourites</div>
            <div className="pv-recs-grid">
              {cityRecs.filter(Boolean).map((r, i) => {
                const rec = flattenRec(r);
                if (!rec.name) return null;
                return (
                  <div key={i} className="pv-rec-item">
                    <div className="pv-rec-name">{rec.name}</div>
                    {rec.location && <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>📍 {rec.location}</div>}
                    {rec.because && <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4, lineHeight: 1.5, fontStyle: "italic" }}>"{rec.because}"</div>}
                    {rec.tags?.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>{rec.tags.map(t => <span key={t} style={{ background: "var(--purple-lt)", color: "var(--purple)", borderRadius: 999, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>{t}</span>)}</div>}
                    {rec.photoUrl && <img src={rec.photoUrl} alt={rec.name} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, marginTop: 8 }} />}
                  </div>
                );
              })}
            </div>
          </>
        )}

        <button className="pv-chat-btn" onClick={onMessage} disabled={connecting}>
          {connecting ? "Connecting…" : `Message ${person.name} →`}
        </button>
        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen({ user, userId, city, onNavigate, onOpenProfile }) {
  const [topPeople, setTopPeople] = useState([]);
  const [viewProfile, setViewProfile] = useState(null);
  const [activityView, setActivityView] = useState(null);
  const [allPeople, setAllPeople] = useState([]);
  const cd = CITIES[city] || CITIES.mumbai;

  useEffect(() => {
    if (!userId) return;
    getPeople(city, userId).then(p => {
      setTopPeople((p || []).slice(0, 4));
      setAllPeople(p || []);
    }).catch(() => {});
  }, [city, userId]);

  const sections = [
    user.photo_urls?.filter(Boolean).length > 0,
    (user.interests || []).length > 0,
    (user.things || user.city_wants || []).length > 0,
    (user.cuisines || []).length > 0,
    (user.food_recs || []).filter(Boolean).length > 0,
    (user.city_recs || []).filter(Boolean).length > 0,
    Object.values(user.prompts || {}).filter(Boolean).length > 0,
    !!(user.age),
  ];
  const filledCount = sections.filter(Boolean).length;
  const total = sections.length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (viewProfile) return (
    <FullProfileView
      person={viewProfile} city={city} me={user}
      onBack={() => setViewProfile(null)}
      onMessage={() => { setViewProfile(null); onNavigate("connections"); }}
      connecting={false}
    />
  );

  if (activityView) {
    const interested = allPeople.filter(p =>
      (p.city_wants || p.things || []).some(t =>
        t.toLowerCase().replace(/[^a-z0-9]/g, "") === activityView.toLowerCase().replace(/[^a-z0-9]/g, "")
      )
    );
    return (
      <div style={{ paddingTop: 20, paddingBottom: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button style={{ fontSize: 20, color: "var(--text2)", background: "none", border: "none", cursor: "pointer", padding: 0 }} onClick={() => setActivityView(null)}>←</button>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>{activityView}</div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{interested.length} {interested.length === 1 ? "person wants" : "people want"} to do this</div>
          </div>
        </div>
        {interested.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)" }}>
            <div style={{ fontSize: 32 }}>🔍</div>
            <p style={{ marginTop: 12, fontSize: 14 }}>No one has listed this yet — you could be the first!</p>
          </div>
        ) : (
          interested.map(person => {
            const photo = (person.photo_urls || []).filter(Boolean)[0];
            const initials = (person.name || "?").slice(0, 2).toUpperCase();
            return (
              <div key={person.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 0", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                onClick={() => { setActivityView(null); setViewProfile(person); }}>
                {photo
                  ? <img src={photo} alt="" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  : <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--purple-lt)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "var(--purple)", flexShrink: 0 }}>{initials}</div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{person.name}{person.age ? `, ${person.age}` : ""}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>📍 {cd.label}</div>
                </div>
                <span style={{ color: "var(--text3)", fontSize: 18 }}>›</span>
              </div>
            );
          })
        )}
      </div>
    );
  }

  const myThings = user.things || user.city_wants || [];
  const mySet = new Set(myThings);
  const daySeed = Math.floor(Date.now() / 86400000);
  const shuffle = (arr, seed) => {
    const a = [...arr]; let s = seed;
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      const j = Math.abs(s) % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const discovery = shuffle(THINGS_LIST.filter(t => !mySet.has(t)), daySeed).slice(0, 5);

  return (
    <div style={{ paddingTop: 20, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: 24 }}>
        {greeting}, <span style={{ color: "var(--purple)" }}>{user.name?.split(" ")[0] || "there"}</span>
      </h1>

      {/* People you might enjoy meeting */}
      {topPeople.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>People you might enjoy meeting</div>
            <button onClick={() => onNavigate("connections")} style={{ fontSize: 13, color: "var(--purple)", fontWeight: 700, background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>See all profiles →</button>
          </div>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, marginBottom: 28, scrollbarWidth: "none" }}>
            {topPeople.map(person => {
              const myInterests = user.interests || [];
              const myThingsArr = user.things || user.city_wants || [];
              const sharedInts = sharedInterests(person.interests, myInterests);
              const sharedThings = sharedInterests(person.city_wants, myThingsArr);
              const sharedTotal = sharedInts.length + sharedThings.length;
              const photo = (person.photo_urls || []).filter(Boolean)[0];
              const initials = (person.name || "?").slice(0, 2).toUpperCase();
              const chips = [...sharedInts, ...sharedThings].slice(0, 2);
              return (
                <div key={person.id} onClick={() => setViewProfile(person)}
                  style={{ flexShrink: 0, width: 160, background: "var(--white)", border: "1px solid var(--border)", borderRadius: 16, padding: 14, cursor: "pointer" }}>
                  {photo
                    ? <img src={photo} alt={person.name} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", marginBottom: 10 }} />
                    : <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--purple-lt)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "var(--purple)", marginBottom: 10 }}>{initials}</div>
                  }
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{person.name}{person.age ? `, ${person.age}` : ""}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8 }}>📍 {cd.label}</div>
                  {chips.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                      {chips.map(c => (
                        <span key={c} style={{ background: "var(--coral-lt)", color: "var(--coral-dk)", border: "1.5px solid var(--coral)", borderRadius: 999, padding: "3px 8px", fontSize: 10, fontWeight: 700 }}>{formatInterest(c)} ✦</span>
                      ))}
                    </div>
                  )}
                  {sharedTotal > 0 && <div style={{ fontSize: 11, color: "var(--text3)" }}>{sharedTotal} interest{sharedTotal !== 1 ? "s" : ""} in common</div>}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Things you could do — from user's own selections */}
      {myThings.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>Things you could do</div>
            <button onClick={() => onNavigate("connections")} style={{ fontSize: 13, color: "var(--purple)", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>See all →</button>
          </div>
          <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", marginBottom: 28 }}>
            {myThings.slice(0, 5).map((t, i) => (
              <div key={t} onClick={() => setActivityView(t)}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: i < Math.min(myThings.length, 5) - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--purple-lt)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {ACTIVITY_ICONS[t] || "📌"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{t}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 1 }}>See who wants to do this</div>
                </div>
                <span style={{ color: "var(--text3)", fontSize: 18 }}>›</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Try something new today */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>Try something new today</div>
        <button onClick={() => onNavigate("connections")} style={{ fontSize: 13, color: "var(--purple)", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>See all →</button>
      </div>
      <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", marginBottom: 28 }}>
        {discovery.map((t, i) => (
          <div key={t} onClick={() => setActivityView(t)}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: i < discovery.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--coral-lt)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
              {ACTIVITY_ICONS[t] || "📌"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{t}</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 1 }}>See who wants to try this</div>
            </div>
            <span style={{ color: "var(--text3)", fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>

      {/* Your profile */}
      <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Your profile</div>
      <div style={{ background: "var(--purple-lt)", borderRadius: 16, padding: "20px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: "var(--purple)", letterSpacing: "-0.03em", flexShrink: 0 }}>{filledCount}/{total}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {sections.map((done, i) => (
                <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: done ? "var(--purple)" : "rgba(88,16,115,0.15)" }} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 8 }}>Profile sections filled in</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 14 }}>Complete profile = better recommendations.</div>
        {filledCount < total && (
          <button onClick={() => onOpenProfile ? onOpenProfile() : onNavigate("profile")}
            style={{ width: "100%", background: "var(--purple)", border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 700, color: "white", cursor: "pointer" }}>
            Complete your profile →
          </button>
        )}
      </div>
    </div>
  );
}
// ─── PROFILE SLIDESHOW ────────────────────────────────────────────────────────
function ProfileSlideshow({ photos, name }) {
  const [idx, setIdx] = useState(0);
  if (!photos || !photos.length) return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#581073", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "white", boxShadow: "0 4px 20px rgba(91,79,212,0.35)" }}>
        {(name || "?").slice(0, 2).toUpperCase()}
      </div>
    </div>
  );
  return (
    <div style={{ position: "relative", height: 280, overflow: "hidden" }}>
      <img src={photos[idx]} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onContextMenu={e => e.preventDefault()} draggable={false} />
      {photos.length > 1 && (
        <>
          {idx > 0 && <button onClick={() => setIdx(i => i - 1)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", fontSize: 18 }}>‹</button>}
          {idx < photos.length - 1 && <button onClick={() => setIdx(i => i + 1)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", fontSize: 18 }}>›</button>}
          <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
            {photos.map((_, i) => <div key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 18 : 6, height: 6, borderRadius: 3, background: i === idx ? "white" : "rgba(255,255,255,0.5)", cursor: "pointer", transition: ".15s" }} />)}
          </div>
        </>
      )}
    </div>
  );
}

function ConnectionsScreen({ city, userId, me }) {
  const [subTab, setSubTab] = useState("foryou"); // "foryou" | "byactivity"
  const [locationFilter, setLocationFilter] = useState("All");

  // For You state
  const [people, setPeople] = useState([]);
  const [allPeopleConn, setAllPeopleConn] = useState([]);
  const [blockedIds, setBlockedIds] = useState([]);
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
    Promise.all([getPeople(city, userId), getBlockedIds(userId)])
      .then(([data, blocked]) => {
        if (!active) return;
        setBlockedIds(blocked || []);
        const filtered = (data || []).filter(p => !(blocked || []).includes(p.id));
        setAllPeopleConn(filtered);
        setPeople(filtered);
        setIdx(0);
      })
      .catch(e => { console.error(e); if (active) setLoadError("Couldn't load people right now."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [city, userId, reloadKey]);

  // Apply location filter
  const displayPeople = locationFilter === "All"
    ? people
    : people.filter(p => p.location === locationFilter);

  // Build By Activity groups from local seed (+ real users when available)
  const allPeople = [...people];
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
        if (conn.status === 'pending' && conn.requester_id === userId) {
          // We sent the request — show feedback, don't open chat yet
          setConnectError(`✓ Request sent to ${person.name}. You'll be able to chat once they accept.`);
          setConnecting(false);
          return;
        }
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
      onBlocked={() => {
        setChatOpen(null);
        // Remove blocked person from the people list immediately
        setPeople(p => p.filter(x => x.id !== chatOpen.person.id));
      }}
    />
  );

  // Full profile view (from either tab)
  if (viewProfile) return (
    <FullProfileView
      person={viewProfile}
      city={city}
      me={me}
      onBack={() => setViewProfile(null)}
      onMessage={() => openChat(viewProfile)}
      connecting={connecting}
    />
  );

  if (activityProfileView) return (
    <FullProfileView
      person={activityProfileView}
      city={city}
      me={me}
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
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4, color: "var(--text)" }}>Meet people to enjoy your city together</h1>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4, color: "var(--text)" }}>Meet people to enjoy your city together</h1>
          </>
        )}
      </div>

      {/* Tab toggle */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, border: "1.5px solid var(--border)", borderRadius: 14, overflow: "hidden", background: "var(--white)" }}>
        {[["foryou", "👤", "People"], ["byactivity", "👥", "Things to Experience Today"]].map(([id, icon, lbl]) => (
          <button key={id}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 8px", fontSize: 14, fontWeight: 600, color: subTab === id ? "var(--purple)" : "var(--text3)", background: subTab === id ? "var(--purple-lt)" : "none", border: "none", borderRight: id === "foryou" ? "1px solid var(--border)" : "none", cursor: "pointer", transition: ".15s" }}
            onClick={() => { setSubTab(id); setSelectedActivity(null); }}>
            <span>{icon}</span><span>{lbl}</span>
          </button>
        ))}
      </div>

      {/* FOR YOU TAB */}
      {subTab === "foryou" && (
        <div>
          {/* Location filter */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
            {["All", ...MUMBAI_HOODS].map(h => (
              <button key={h} onClick={() => { setLocationFilter(h); setIdx(0); }}
                style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: `1.5px solid ${locationFilter === h ? "var(--purple)" : "var(--border)"}`, background: locationFilter === h ? "var(--purple)" : "var(--white)", color: locationFilter === h ? "white" : "var(--text2)", cursor: "pointer", whiteSpace: "nowrap" }}>
                {h}
              </button>
            ))}
          </div>

          {loading && !userId && null}
          {loadError && <div className="conn-empty"><p>{loadError}</p></div>}

          {!userId && (
            <div style={{ background: "var(--purple-lt)", border: "1.5px solid var(--purple)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "var(--purple)", fontWeight: 600, marginBottom: 16 }}>
              Sign in to connect with real people in {cd.label}.
            </div>
          )}

          {current ? (
            <div style={{ background: "var(--white)", borderRadius: 20, overflow: "hidden", border: "1px solid var(--border)", boxShadow: "var(--shadow2)" }}>
              {/* Photo banner */}
              <div style={{ position: "relative", padding: "20px 0", overflow: "hidden", background: "linear-gradient(135deg, #FFF0EE 0%, #FAF8F4 50%, #F5E8F9 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {(() => {
                  const photo = (current.photo_urls || current.photos || []).filter(Boolean)[0];
                  return photo
                    ? <img src={photo} alt={current.name} style={{ width: 220, height: 220, borderRadius: "50%", objectFit: "cover", border: "4px solid white", boxShadow: "0 4px 20px rgba(88,16,115,0.2)" }} onContextMenu={e => e.preventDefault()} draggable={false} />
                    : <div style={{ width: 220, height: 220, borderRadius: "50%", background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, fontWeight: 800, color: "white" }}>{(current.name || "?").slice(0, 2).toUpperCase()}</div>;
                })()}
              </div>

              {/* Name + location */}
              <div style={{ padding: "16px 20px 0" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{current.name}, {current.age}{current.pronouns ? <span style={{fontSize:13,fontWeight:500,color:"var(--text3)",marginLeft:8}}>· {current.pronouns}</span> : ""}</div>
                    <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 2 }}>📍 {current.location || cd.label}</div>
                  </div>
                </div>

                {/* Interests — highlight shared ones */}
                {(current.interests || []).length > 0 && (() => {
                  const myInterests = me?.interests || [];
                  const sharedInts = sharedInterests(current.interests, myInterests);
                  return (
                    <>
                      <div style={{ fontSize: 13, fontWeight: 700, marginTop: 14, marginBottom: 4 }}>Interests</div>
                      {sharedInts.length > 0 && <div style={{ fontSize: 11, color: "var(--purple)", fontWeight: 600, marginBottom: 8 }}>✦ {sharedInts.length} in common with you</div>}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                        {(current.interests || []).slice(0, 7).map(i => {
                          const isShared = sharedInts.includes(i);
                          return (
                            <span key={i} style={{
                              border: isShared ? "1.5px solid var(--coral)" : "1.5px solid var(--border)",
                              borderRadius: 999, padding: "6px 12px", fontSize: 13,
                              fontWeight: isShared ? 700 : 500,
                              color: isShared ? "var(--coral-dk)" : "var(--text2)",
                              background: isShared ? "var(--coral-lt)" : "var(--white)",
                            }}>{formatInterest(i)}{isShared ? " ✦" : ""}</span>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}

                {/* Things to do together — highlight shared ones */}
                {(current.city_wants || current.cityWants || []).length > 0 && (() => {
                  const theirThings = current.city_wants || current.cityWants || [];
                  const myThings = me?.things || [];
                  const shared = theirThings.filter(t => myThings.includes(t));
                  const other = theirThings.filter(t => !myThings.includes(t));
                  const display = [...shared, ...other].slice(0, 6);
                  return (
                    <>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Things to do together</div>
                      {shared.length > 0 && <div style={{ fontSize: 11, color: "var(--purple)", fontWeight: 600, marginBottom: 8 }}>✦ {shared.length} in common with you</div>}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                        {display.map(t => (
                          <span key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, background: shared.includes(t) ? "var(--coral-lt)" : "var(--bg)", color: shared.includes(t) ? "var(--coral-dk)" : "var(--text3)", border: shared.includes(t) ? "1.5px solid var(--coral)" : "1px solid var(--border)", borderRadius: 8, padding: "5px 10px" }}>
                            <span style={{ fontSize: 15 }}>{ACTIVITY_ICONS[t] || "📌"}</span>{t}
                          </span>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Thoughts / prompts */}
              {(() => {
                const prompts = current.prompts
                  ? Array.isArray(current.prompts) ? current.prompts.filter(p => p.a)
                    : Object.entries(current.prompts).filter(([, ans]) => ans?.trim()).map(([q, a]) => ({ q, a }))
                  : [];
                if (!prompts.length) return null;
                return (
                  <div style={{ padding: "12px 20px 0" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Thoughts</div>
                    {prompts.slice(0, 2).map((p, i) => (
                      <div key={i} style={{ background: "var(--bg2)", borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
                        <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, marginBottom: 4 }}>{p.q}</div>
                        <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>{p.a}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* View full profile + Back/Next */}
              <div style={{ padding: "12px 20px 20px", borderTop: "1px solid var(--border)" }}>
                <button style={{ width: "100%", background: "var(--purple)", color: "white", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 700, marginBottom: 10, border: "none", cursor: "pointer" }} onClick={() => openChat(current)}>
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

          {connectError && (
            <div style={{ marginTop: 12, background: connectError.startsWith("✓") ? "var(--purple-lt)" : "#fdecea", border: `1px solid ${connectError.startsWith("✓") ? "var(--purple)" : "#f5c6c0"}`, color: connectError.startsWith("✓") ? "var(--purple)" : "#c0392b", fontSize: 13, fontWeight: 600, borderRadius: 10, padding: "10px 14px", lineHeight: 1.5 }}>
              {connectError}
            </div>
          )}
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
                <div style={{ width: 52, height: 52, borderRadius: 999, background: "var(--purple-lt)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                  {ACTIVITY_ICONS[activity] || "📌"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>{activity}</div>
                  <div style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.4 }}>
                    {actPeople.length} {actPeople.length === 1 ? "person" : "people"} want to do this in {cd.label}
                  </div>
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
          <p style={{ fontSize: 14, color: "var(--purple)", fontWeight: 600, marginBottom: 20 }}>
            {activityGroups[selectedActivity]?.length} {activityGroups[selectedActivity]?.length === 1 ? "person wants" : "people want"} to do this
          </p>

          {/* Activity banner */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--purple-lt)", border: "1.5px solid rgba(45,106,45,0.2)", borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
            <span style={{ fontSize: 28 }}>{ACTIVITY_ICONS[selectedActivity] || "📌"}</span>
            <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, lineHeight: 1.5 }}>
              Browse people who also want to {selectedActivity.toLowerCase()}.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {(activityGroups[selectedActivity] || []).map(person => {
              const photos = (person.photo_urls || person.photos || []).filter(Boolean);
              const initials = (person.name || "?").slice(0, 2).toUpperCase();
              const interests = (person.interests || []).slice(0, 4).map(i => formatInterest(i));
              return (
                <button key={person.id}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid var(--border)", background: "none", border: "none", borderBottom: "1px solid var(--border)", cursor: "pointer", textAlign: "left", width: "100%" }}
                  onClick={() => setActivityProfileView(person)}>
                  {photos[0]
                    ? <img src={photos[0]} alt={person.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                    : <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--purple-lt)", color: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{initials}</div>
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
function PlaceDetailView({ place, onBack, isSaved, onToggleSave, userId, userName }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const allPhotos = [place.img, ...(place.photos || [])].filter(Boolean);
  const [shareOpen, setShareOpen] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [expLoading, setExpLoading] = useState(true);
  useEffect(() => {
    let active = true;
    getPassportFeed("mumbai", "places").then(all => {
      if (active) setExperiences((all || []).filter(e => e.place_name === place.name));
    }).catch(() => {}).finally(() => { if (active) setExpLoading(false); });
    return () => { active = false; };
  }, [place.name]);

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
            <span style={{ background: "var(--purple-lt)", color: "var(--purple)", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{place.category}</span>
          )}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {place.tags.map(t => (
            <span key={t} style={{ background: "var(--bg2)", color: "var(--text2)", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 600 }}>{t}</span>
          ))}
        </div>

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

        {/* Action button */}
        <div style={{ marginBottom: 24 }}>
          <button onClick={handleShare}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", background: "var(--white)", color: "var(--text)", border: "1.5px solid var(--border)", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            ↗ Share
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Community experiences</div>
          <button onClick={() => setShareOpen(o => !o)} style={{ fontSize: 13, fontWeight: 700, color: "var(--purple)", background: "none", border: "none", cursor: "pointer" }}>{shareOpen ? "Cancel" : "Add yours"}</button>
        </div>
        {shareOpen && (
          <div style={{ marginBottom: 16 }}>
            <ShareExperienceForm category="places" city="mumbai" userId={userId} prefillName={place.name} prefillLocation={place.area}
              onDone={() => { setShareOpen(false); getPassportFeed("mumbai", "places").then(all => setExperiences((all || []).filter(e => e.place_name === place.name))); }} />
          </div>
        )}
        {expLoading && <div className="food-empty-state" style={{ padding: "16px 0" }}>Loading…</div>}
        {!expLoading && experiences.length === 0 && !shareOpen && <div className="food-empty-state" style={{ padding: "16px 0" }}>No one's shared their experience here yet.</div>}
        {!expLoading && experiences.map(e => (
          <div key={e.id} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 14, marginBottom: 10 }}>
            {e.photo_url && <img src={e.photo_url} alt="" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, marginBottom: 10 }} />}
            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5, margin: 0 }}>{e.note}</p>
            {(e.tags || []).length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {e.tags.map(t => <span key={t} style={{ background: "var(--purple-lt)", color: "var(--purple)", borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{t}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PlacesToExploreScreen({ city, userId, userName, savedExplorePlaces, onToggleExploreSave, savedFoodPlaces }) {
  const places = PLACES_TO_EXPLORE[city] || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [openPlace, setOpenPlace] = useState(null);
  const [showSaved, setShowSaved] = useState(false);
  // Saved state comes from props (persisted to profile) — no local state needed
  const isSaved = (id) => (savedExplorePlaces || []).includes(String(id));
  const toggleSave = (id) => onToggleExploreSave?.(String(id));

  const hasCategories = places.some(p => p.category);
  const allTags = hasCategories
    ? ["All", ...Array.from(new Set(places.map(p => p.category).filter(Boolean)))]
    : ["All", ...Array.from(new Set(places.flatMap(p => p.tags)))];

  const filtered = places.filter(p => {
    const matchSearch = !searchQuery.trim() || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.area.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchTag = activeTag === "All" || p.category === activeTag || p.tags.includes(activeTag);
    return matchSearch && matchTag;
  });

  // Show detail view
  if (openPlace) return (
    <PlaceDetailView
      place={openPlace}
      onBack={() => setOpenPlace(null)}
      isSaved={isSaved(openPlace.id)}
      onToggleSave={toggleSave}
      userId={userId}
      userName={userName}
    />
  );

  // Saved places view
  if (showSaved) {
    const savedPlaces = places.filter(p => isSaved(p.id));
    return (
      <div style={{ paddingTop: 20, paddingBottom: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button style={{ fontSize: 20, color: "var(--text2)", background: "none", border: "none", cursor: "pointer", padding: 0 }} onClick={() => setShowSaved(false)}>←</button>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", margin: 0 }}>Saved places</h1>
          <span style={{ fontSize: 13, color: "var(--text3)", marginLeft: "auto" }}>{savedPlaces.length} saved</span>
        </div>
        {savedPlaces.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)" }}>
            <div style={{ fontSize: 32 }}>🔖</div>
            <p style={{ marginTop: 10, fontSize: 14 }}>Nothing saved yet — tap 📑 on any place to save it.</p>
          </div>
        ) : (
          savedPlaces.map(place => (
            <div key={place.id} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
              onClick={() => { setShowSaved(false); setOpenPlace(place); }}>
              <div style={{ flexShrink: 0, width: 72, height: 72, borderRadius: 12, overflow: "hidden" }}>
                <img src={place.img} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{place.name}</div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>📍 {place.area} · {place.category}</div>
                <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 4, lineHeight: 1.4, margin: "4px 0 0" }}>{place.desc.slice(0, 70)}…</p>
              </div>
              <span style={{ color: "var(--text3)", fontSize: 18, alignSelf: "center" }}>›</span>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 20, paddingBottom: 80 }}>
      {/* ── What people are experiencing — horizontal swipe cards ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <span>✨</span> What people are experiencing in Mumbai
          </div>
          <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 3 }}>Real experiences shared by people like you</div>
        </div>
        {(savedExplorePlaces || []).length > 0 && (
          <button onClick={() => setShowSaved(true)} style={{ flexShrink: 0, background: "var(--purple-lt)", color: "var(--purple)", border: "1.5px solid var(--purple)", borderRadius: 10, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
            🔖 {(savedExplorePlaces || []).length} saved
          </button>
        )}
      </div>

      {/* Search + tag filters — filter the feed below */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px solid var(--border)", borderRadius: 12, padding: "10px 14px", background: "var(--white)", marginBottom: 12 }}>
        <span style={{ fontSize: 14, color: "var(--text3)" }}>🔍</span>
        <input style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", background: "none", color: "var(--text)" }} placeholder="Search places" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        {searchQuery && <button style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--bg2)", border: "none", fontSize: 14, cursor: "pointer" }} onClick={() => setSearchQuery("")}>×</button>}
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 14 }}>
        {allTags.map(tag => (
          <button key={tag}
            style={{ flexShrink: 0, border: "1.5px solid var(--border)", borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 600, color: activeTag === tag ? "white" : "var(--text3)", background: activeTag === tag ? "var(--purple)" : "var(--white)", cursor: "pointer", transition: ".15s", borderColor: activeTag === tag ? "var(--purple)" : "var(--border)" }}
            onClick={() => setActiveTag(tag)}>{tag}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)" }}>
          <div style={{ fontSize: 32 }}>🔍</div>
          <p style={{ marginTop: 10, fontSize: 14 }}>No places match{searchQuery ? ` "${searchQuery}"` : " that filter"}.</p>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 14, overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: 8, marginBottom: 20, scrollbarWidth: "none" }}>
          {filtered.slice(0, 20).map(place => (
            <div key={place.id} onClick={() => setOpenPlace(place)}
              style={{ flexShrink: 0, width: 280, borderRadius: 20, overflow: "hidden", background: "var(--white)", border: "1px solid var(--border)", cursor: "pointer", scrollSnapAlign: "start" }}>
              <div style={{ height: 180, background: "var(--bg2)" }}>
                <img src={place.img} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ padding: 16, position: "relative" }}>
                <div style={{ fontSize: 26, color: "var(--purple)", lineHeight: 0.5, marginBottom: 6 }}>"</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", lineHeight: 1.4, marginBottom: 10, minHeight: 40 }}>
                  {place.desc.length > 90 ? place.desc.slice(0, 90) + "…" : place.desc}
                </div>
                <div style={{ fontSize: 12, color: "var(--purple)", fontWeight: 600, marginBottom: 10 }}>📍 {place.name} · {place.area}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {place.tags.slice(0, 3).map((t, i) => {
                    const palette = [{ bg: "#FFF0EE", color: "#C94E3A" }, { bg: "#E8F0FF", color: "#2A5CA8" }, { bg: "#EAF7E9", color: "#2D6A2D" }][i % 3];
                    return <span key={t} style={{ background: palette.bg, color: palette.color, borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>{t}</span>;
                  })}
                </div>
                <button onClick={e => { e.stopPropagation(); toggleSave(place.id); }}
                  style={{ position: "absolute", bottom: 14, right: 14, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--purple)" }}>
                  {isSaved(place.id) ? "🔖" : "📑"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PassportSection category="places" city={city} userId={userId} userName={userName} hideFeed
        savedPlaceIds={savedExplorePlaces} savedFoodNames={savedFoodPlaces}
        onOpenSavedPlace={item => setOpenPlace(item)} />
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
        {shareFeedback && <div className="share-feedback">✓ {shareFeedback}</div>}
        <div className="detail-actions-row">
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
              <p className="detail-shared-exp-text">{restaurant.sharedExp}</p>
              {restaurant.reviewTags?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  {restaurant.reviewTags.map(t => (
                    <span key={t} style={{ background: "rgba(88,16,115,0.08)", color: "var(--purple)", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{t}</span>
                  ))}
                </div>
              )}
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
// ─── PASSPORT (personal food/places/activities record + anonymous feed) ───────
const EVENT_TAG_ICONS = [
  { label: "Fun", icon: "🎈" },
  { label: "Group Activity", icon: "👥" },
  { label: "Budget Friendly", icon: "💳" },
  { label: "Worth it", icon: "👍" },
];
const CATEGORY_META = {
  food: { label: "food experience", icon: "🍽️", tagOptions: FOOD_TAG_ICONS },
  places: { label: "place worth exploring", icon: "📍", tagOptions: PLACE_TAG_ICONS },
  events: { label: "activity or event", icon: "🎉", tagOptions: EVENT_TAG_ICONS },
};

function PassportCard({ entry, isSaved, onToggleSave, onOpen }) {
  return (
    <div onClick={onOpen} style={{ flexShrink: 0, width: 280, borderRadius: 20, overflow: "hidden", background: "var(--white)", border: "1px solid var(--border)", cursor: "pointer", scrollSnapAlign: "start" }}>
      <div style={{ height: 220, background: "var(--bg2)" }}>
        {entry.photo_url && <img src={entry.photo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
      </div>
      <div style={{ padding: 16, position: "relative" }}>
        <div style={{ fontSize: 26, color: "var(--purple)", lineHeight: 0.5, marginBottom: 6 }}>"</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", lineHeight: 1.4, marginBottom: 10 }}>{entry.note}</div>
        <div style={{ fontSize: 12, color: "var(--purple)", fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
          📍 {entry.place_name}{entry.location ? ` · ${entry.location}` : ""}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {(entry.tags || []).slice(0, 3).map((t, i) => {
            const palette = [{ bg: "#FFF0EE", color: "#C94E3A" }, { bg: "#EAF7E9", color: "#2D6A2D" }, { bg: "#E8F0FF", color: "#2A5CA8" }][i % 3];
            return <span key={t} style={{ background: palette.bg, color: palette.color, borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>{t}</span>;
          })}
        </div>
        <button onClick={e => { e.stopPropagation(); onToggleSave(); }}
          style={{ position: "absolute", bottom: 14, right: 14, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--purple)" }}>
          {isSaved ? "🔖" : "📑"}
        </button>
      </div>
    </div>
  );
}

function ShareExperienceForm({ category, city, userId, onDone, prefillName, prefillLocation }) {
  const meta = CATEGORY_META[category];
  const [placeName, setPlaceName] = useState(prefillName || "");
  const [location, setLocation] = useState(prefillLocation || "");
  const [note, setNote] = useState("");
  const [tags, setTags] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const toggleTag = t => setTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const handleSubmit = async () => {
    if (!userId) { setError("Sign in to add to your passport."); return; }
    if (!placeName.trim() || !note.trim()) { setError("Add a place name and your experience."); return; }
    setSubmitting(true); setError("");
    try {
      let photoUrl = null;
      if (photoFile) photoUrl = await uploadPassportPhoto(userId, photoFile);
      await addPassportEntry(userId, city, category, { placeName: placeName.trim(), location: location.trim(), photoUrl, note: note.trim(), tags });
      setDone(true);
      setTimeout(onDone, 1200);
    } catch (e) { console.error(e); setError("Couldn't save that — please try again."); }
    finally { setSubmitting(false); }
  };

  if (done) return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      <div style={{ fontSize: 32 }}>✓</div>
      <div style={{ fontWeight: 700, marginTop: 6 }}>Added to your Passport!</div>
      <p style={{ fontSize: 13, color: "var(--text3)", marginTop: 6, lineHeight: 1.5 }}>Shared with the community anonymously.</p>
    </div>
  );

  return (
    <div style={{ paddingBottom: 8 }}>
      {error && <div className="profile-save-error">⚠️ {error}</div>}
      <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed var(--border)", borderRadius: 12, padding: 20, cursor: "pointer", background: "var(--bg)", marginBottom: 12 }}>
        {photoPreview ? <img src={photoPreview} alt="" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8 }} /> : <><div style={{ fontSize: 28, marginBottom: 6 }}>📷</div><span style={{ fontSize: 13, color: "var(--purple)", fontWeight: 600 }}>Add a photo</span></>}
        <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; setPhotoFile(f || null); setPhotoPreview(f ? URL.createObjectURL(f) : null); }} />
      </label>
      <input className="ob-input" style={{ marginBottom: 10 }} placeholder={`Name of the ${meta.label.split(" ")[0]}`} value={placeName}
        readOnly={!!prefillName} onChange={e => !prefillName && setPlaceName(e.target.value)} />
      <input className="ob-input" style={{ marginBottom: 10 }} placeholder="Location / neighbourhood" value={location} onChange={e => setLocation(e.target.value)} />
      <textarea className="ob-input" rows={3} style={{ resize: "none", marginBottom: 10 }} placeholder="What was it like?" value={note} onChange={e => setNote(e.target.value)} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {meta.tagOptions.map(({ label, icon }) => (
          <button key={label} type="button" onClick={() => toggleTag(label)}
            style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px solid " + (tags.includes(label) ? "var(--purple)" : "var(--border)"), borderRadius: 10, padding: "9px 10px", fontSize: 12, fontWeight: 600, color: tags.includes(label) ? "white" : "var(--text2)", background: tags.includes(label) ? "var(--purple)" : "var(--bg)", cursor: "pointer" }}>
            <span>{icon}</span>{label}
          </button>
        ))}
      </div>
      <button className="filter-apply" disabled={submitting} onClick={handleSubmit}>{submitting ? "Saving…" : "Add to my Passport"}</button>
    </div>
  );
}

function PassportSection({ category, city, userId, userName, onOpenEntry, hideFeed, hideShareCTA, savedFoodNames, savedPlaceIds, onOpenSavedFood, onOpenSavedPlace }) {
  const meta = CATEGORY_META[category];
  const [feed, setFeed] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [counts, setCounts] = useState({ food: 0, places: 0, events: 0 });
  const [shareOpen, setShareOpen] = useState(false);
  const [hostOpen, setHostOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMyCat, setViewMyCat] = useState(null); // which category's "My Passport" list is open
  const [openSavedItem, setOpenSavedItem] = useState(null); // { category, item } — fallback lightweight view
  const [openEventItem, setOpenEventItem] = useState(null);
  const [eventInterested, setEventInterested] = useState(false);
  const [eventInterestCount, setEventInterestCount] = useState(0);

  const load = () => {
    setLoading(true);
    Promise.all([
      getPassportFeed(city, category),
      userId ? getPassportSavedIds(userId) : Promise.resolve([]),
      userId ? getMyInterestedEvents(userId).catch(() => []) : Promise.resolve([]),
    ]).then(([f, saved, myEvents]) => {
      setFeed(f || []);
      setSavedIds(saved);
      setCounts({
        food: (savedFoodNames || []).length,
        places: (savedPlaceIds || []).length,
        events: (myEvents || []).length,
      });
    })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  };
  useEffect(load, [city, category, userId, savedFoodNames, savedPlaceIds]);

  const toggleSave = async (entryId) => {
    if (!userId) return;
    const nowSaved = !savedIds.includes(entryId);
    setSavedIds(p => nowSaved ? [...p, entryId] : p.filter(id => id !== entryId));
    try { await togglePassportSave(userId, entryId); } catch (e) { console.error(e); }
  };

  if (openEventItem) return (
    <EventDetailView
      event={openEventItem} onBack={() => setOpenEventItem(null)} userId={userId}
      isInterested={eventInterested}
      interestCount={eventInterestCount}
      onToggleInterest={async () => {
        const was = eventInterested;
        setEventInterested(!was);
        setEventInterestCount(c => c + (was ? -1 : 1));
        if (!userId) return;
        try { await toggleCommunityEventInterest(userId, openEventItem.id); }
        catch (e) { console.error(e); setEventInterested(was); setEventInterestCount(c => c + (was ? 1 : -1)); }
      }}
    />
  );

  if (openSavedItem) return (
    <SavedItemDetail item={openSavedItem.item} category={openSavedItem.category} onBack={() => setOpenSavedItem(null)} />
  );

  return (
    <div style={{ marginBottom: 8 }}>
      {!hideFeed && (
        <>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              <span>✨</span> What people are experiencing
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 3 }}>Real {meta.label}s shared anonymously.</div>
          </div>
          {loading && <div className="food-empty-state">Loading…</div>}
          {!loading && feed.length === 0 && <div className="food-empty-state">No one's shared yet — be the first!</div>}
          {!loading && feed.length > 0 && (
            <div style={{ display: "flex", gap: 14, overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: 8, marginBottom: 8, scrollbarWidth: "none" }}>
              {feed.map(entry => (
                <PassportCard key={entry.id} entry={entry} isSaved={savedIds.includes(entry.id)}
                  onToggleSave={() => toggleSave(entry.id)} onOpen={() => onOpenEntry?.(entry)} />
              ))}
            </div>
          )}
        </>
      )}

      <div style={{ border: "1px solid var(--border)", borderRadius: 16, padding: 18, marginTop: hideFeed ? 0 : 20, marginBottom: 16, background: "var(--white)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 20 }}>🛂</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>My Passport</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[["food", "🍽️", "Foodspots"], ["places", "📍", "Places"], ["events", "🎉", "Events"]].map(([cat, icon, label]) => (
            <button key={cat} onClick={() => userId && setViewMyCat(cat)}
              style={{ background: "var(--bg2)", border: "none", borderRadius: 14, padding: "16px 10px", textAlign: "center", cursor: userId ? "pointer" : "default" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--purple)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, margin: "0 auto 8px" }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{label}</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{counts[cat] || 0} saved</div>
            </button>
          ))}
        </div>
      </div>

      {!hideShareCTA && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "var(--purple-lt)", borderRadius: 16, padding: "20px 22px", marginBottom: category === "events" ? 14 : 20 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text)" }}>Share your experience</div>
            <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 3 }}>
              {category === "events" ? "Share an activity you joined or hosted and inspire others to be a part of it." : `Share a ${meta.label} and help others discover the real taste of the city.`}
            </div>
          </div>
          <button onClick={() => setShareOpen(true)}
            style={{ flexShrink: 0, width: 48, height: 48, borderRadius: "50%", background: "var(--purple)", color: "white", border: "none", fontSize: 22, cursor: "pointer" }}>+</button>
        </div>
      )}

      {category === "events" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "var(--purple-lt)", borderRadius: 16, padding: "20px 22px", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text)" }}>Host an event</div>
            <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 3 }}>Create a public event and let others discover and join.</div>
          </div>
          <button onClick={() => setHostOpen(true)}
            style={{ flexShrink: 0, width: 48, height: 48, borderRadius: "50%", background: "var(--purple)", color: "white", border: "none", fontSize: 22, cursor: "pointer" }}>+</button>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--bg2)", borderRadius: 14, padding: "14px 16px", marginBottom: 24 }}>
        <span style={{ fontSize: 20 }}>🛡️</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Shared anonymously.</div>
          <div style={{ fontSize: 12, color: "var(--text3)" }}>Your identity stays private.</div>
        </div>
      </div>

      {shareOpen && (
        <div className="share-sheet-overlay" onClick={() => setShareOpen(false)}>
          <div className="share-sheet" onClick={e => e.stopPropagation()}>
            <div className="share-sheet-handle" />
            <ShareExperienceForm category={category} city={city} userId={userId} onDone={() => { setShareOpen(false); load(); }} />
          </div>
        </div>
      )}

      {hostOpen && (
        <div className="share-sheet-overlay" onClick={() => setHostOpen(false)}>
          <div className="share-sheet" onClick={e => e.stopPropagation()}>
            <div className="share-sheet-handle" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 17, fontWeight: 800 }}>Host an event</div>
              <button style={{ background: "none", border: "none", fontSize: 22, color: "var(--text3)", cursor: "pointer", padding: 0, lineHeight: 1 }} onClick={() => setHostOpen(false)}>×</button>
            </div>
            <CreateEventForm city={city} userId={userId} userName={userName} onDone={() => setHostOpen(false)} />
          </div>
        </div>
      )}

      {viewMyCat && (
        <MyPassportModal category={viewMyCat} userId={userId}
          savedFoodNames={savedFoodNames} savedPlaceIds={savedPlaceIds}
          onClose={() => setViewMyCat(null)}
          onOpenItem={item => {
            const cat = viewMyCat;
            setViewMyCat(null);
            if (cat === "events") {
              setEventInterested(false);
              getCommunityEventInterestCount(item.id).then(c => setEventInterestCount(c || 0)).catch(() => setEventInterestCount(0));
              setOpenEventItem(item);
            } else if (cat === "food" && onOpenSavedFood) {
              onOpenSavedFood(item);
            } else if (cat === "places" && onOpenSavedPlace) {
              onOpenSavedPlace(item);
            } else {
              setOpenSavedItem({ category: cat, item });
            }
          }} />
      )}
    </div>
  );
}

function MyPassportModal({ category, userId, savedFoodNames, savedPlaceIds, onClose, onOpenItem }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    if (category === "food") {
      setItems((CITIES.mumbai.food || []).filter(r => (savedFoodNames || []).includes(r.name)));
      setLoading(false);
    } else if (category === "places") {
      setItems((PLACES_TO_EXPLORE.mumbai || []).filter(p => (savedPlaceIds || []).includes(String(p.id))));
      setLoading(false);
    } else {
      getMyInterestedEvents(userId).then(d => { if (active) setItems(d || []); })
        .catch(e => console.error(e)).finally(() => { if (active) setLoading(false); });
    }
    return () => { active = false; };
  }, [category, userId, savedFoodNames, savedPlaceIds]);

  const label = { food: "Foodspots", places: "Places", events: "Events" }[category];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "flex-end" }} onClick={onClose}>
      <div style={{ background: "white", borderRadius: "20px 20px 0 0", width: "100%", maxHeight: "80vh", overflowY: "auto", padding: "20px 20px 32px" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Saved {label}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 24, color: "var(--text3)", cursor: "pointer" }}>×</button>
        </div>
        {loading && <div className="food-empty-state">Loading…</div>}
        {!loading && items.length === 0 && <div className="food-empty-state">Nothing saved yet — tap 📑 on any {label.toLowerCase()} to save it here.</div>}
        {!loading && items.map((it, i) => {
          const img = category === "events" ? it.photo_url : it.img;
          const sub = category === "events" ? it.location : (it.hood || it.area);
          return (
            <div key={it.id || i} onClick={() => onOpenItem(it)}
              style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
              <div style={{ width: 64, height: 64, borderRadius: 10, overflow: "hidden", background: "var(--bg2)", flexShrink: 0 }}>
                {img && <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{it.name}</div>
                {sub && <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 2 }}>📍 {sub}</div>}
              </div>
              <span style={{ color: "var(--text3)", fontSize: 18, alignSelf: "center" }}>›</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SavedItemDetail({ item, category, onBack }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const photos = category === "events"
    ? [item.photo_url].filter(Boolean)
    : [item.img, ...(item.photos || [])].filter(Boolean);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const request = category === "food"
      ? getFoodExperiences(item.name)
      : getPassportFeed("mumbai", category).then(all => (all || []).filter(e => e.place_name === item.name));
    Promise.resolve(request).then(d => { if (active) setReviews(d || []); })
      .catch(e => console.error(e)).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [item.name, category]);

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0 14px", borderBottom: "1px solid var(--border)" }}>
        <button style={{ fontSize: 20, color: "var(--text2)", background: "none", border: "none", cursor: "pointer", padding: 0 }} onClick={onBack}>←</button>
        <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>{item.name}</div>
      </div>

      {photos.length > 0 && (
        <div style={{ position: "relative", marginTop: 16, borderRadius: 16, overflow: "hidden", height: 260 }}>
          <img src={photos[photoIdx]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          {photos.length > 1 && (
            <>
              {photoIdx > 0 && (
                <button onClick={() => setPhotoIdx(i => i - 1)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", fontSize: 18 }}>‹</button>
              )}
              {photoIdx < photos.length - 1 && (
                <button onClick={() => setPhotoIdx(i => i + 1)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", fontSize: 18 }}>›</button>
              )}
              <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
                {photos.map((_, i) => (
                  <div key={i} onClick={() => setPhotoIdx(i)} style={{ width: i === photoIdx ? 18 : 7, height: 7, borderRadius: 4, background: i === photoIdx ? "white" : "rgba(255,255,255,0.5)", cursor: "pointer" }} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div style={{ paddingTop: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Reviews</div>
        {loading && <div className="food-empty-state">Loading…</div>}
        {!loading && reviews.length === 0 && <div className="food-empty-state">No reviews yet.</div>}
        {!loading && reviews.map((r, i) => (
          <div key={r.id || i} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 14, marginBottom: 10 }}>
            {r.photo_url && <img src={r.photo_url} alt="" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, marginBottom: 10 }} />}
            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5, margin: 0 }}>{r.note}</p>
            {r.favorite_item && <div style={{ fontSize: 12, color: "var(--purple)", fontWeight: 600, marginTop: 6 }}>⭐ {r.favorite_item}</div>}
            {(r.tags || []).length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {r.tags.map(t => <span key={t} style={{ background: "var(--purple-lt)", color: "var(--purple)", borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{t}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FOOD SCREEN ──────────────────────────────────────────────────────────────
function FoodScreen({ city, userCuisines, userBudget, userId, userName, savedPlaces, onToggleSave, savedExplorePlaces }) {
  const [detailOpen, setDetailOpen] = useState(null);
  const [activeArea, setActiveArea] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [communityPlaces, setCommunityPlaces] = useState([]);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitTab, setSubmitTab] = useState("experience"); // "experience" | "newplace"
  const [showSaved, setShowSaved] = useState(false);

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

  // Saved view
  if (showSaved) {
    const saved = (savedPlaces || []).filter(Boolean);
    const savedRestaurants = cd.food.filter(r => saved.includes(r.name));
    return (
      <div style={{ paddingTop: 20, paddingBottom: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button style={{ fontSize: 20, color: "var(--text2)", background: "none", border: "none", cursor: "pointer", padding: 0 }} onClick={() => setShowSaved(false)}>←</button>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", margin: 0 }}>Saved places</h1>
          <span style={{ fontSize: 13, color: "var(--text3)", marginLeft: "auto" }}>{savedRestaurants.length} saved</span>
        </div>
        {savedRestaurants.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)" }}>
            <div style={{ fontSize: 32 }}>🔖</div>
            <p style={{ marginTop: 10, fontSize: 14 }}>Nothing saved yet — tap 📑 on any place to save it.</p>
          </div>
        ) : (
          savedRestaurants.map(r => (
            <div key={r.id} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
              onClick={() => { setShowSaved(false); setDetailOpen(r); }}>
              <div style={{ flexShrink: 0, width: 72, height: 72, borderRadius: 12, overflow: "hidden" }}>
                {r.img ? <img src={r.img} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🍽️</div>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{r.name}</div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>📍 {r.hood} · {r.cuisine}</div>
                {r.sharedExp && <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 4, lineHeight: 1.4 }}>{r.sharedExp.slice(0, 70)}…</p>}
              </div>
              <span style={{ color: "var(--text3)", fontSize: 18, alignSelf: "center" }}>›</span>
            </div>
          ))
        )}
      </div>
    );
  }

  const cityAreas = ["All", ...Array.from(new Set(cd.food.map(r => r.hood)))];
  const matchesSearch = p => !searchQuery.trim() || [p.name, p.cuisine, p.hood].some(f => f?.toLowerCase().includes(searchQuery.toLowerCase()));
  const matchesArea = p => activeArea === "All" || p.hood === activeArea;
  const filtered = cd.food.filter(r => matchesArea(r) && matchesSearch(r));
  const sorted = userCuisines?.length ? [...filtered].sort((a, b) => scoreFoodPlace(b, userCuisines, userBudget) - scoreFoodPlace(a, userCuisines, userBudget)) : filtered;

  // Build chip tags per place from whatever data we already have
  const chipsFor = r => {
    if (r.reviewTags?.length) return r.reviewTags.slice(0, 3);
    const chips = [];
    if (r.tag) chips.push(r.tag);
    if (r.cuisine) chips.push(r.cuisine);
    if (r.hood) chips.push(r.hood);
    return chips.slice(0, 3);
  };

  const visibleFeed = sorted.slice(0, 15);

  return (
    <div style={{ paddingTop: 20, paddingBottom: 60 }}>
      {/* ── What people are experiencing — horizontal swipe cards at the top ── */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
          <span>✨</span> What people are experiencing in {activeArea === "All" ? cd.label : activeArea}
        </div>
        <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 3 }}>Real experiences shared by people like you</div>
      </div>

      {/* Search + area + saved toggle — filters the feed below */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20 }}>
        <select style={{ border: "1.5px solid var(--border)", borderRadius: 12, padding: "10px 28px 10px 12px", fontSize: 13, fontWeight: 700, color: "var(--text)", background: "var(--white)", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23666' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", cursor: "pointer", flexShrink: 0 }} value={activeArea} onChange={e => setActiveArea(e.target.value)}>
          {cityAreas.map(a => <option key={a} value={a}>{a === "All" ? "All areas" : a}</option>)}
        </select>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, border: "1.5px solid var(--border)", borderRadius: 12, padding: "10px 14px", background: "var(--white)" }}>
          <span style={{ fontSize: 14, color: "var(--text3)" }}>🔍</span>
          <input style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", background: "none" }} placeholder="Search food places" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          {searchQuery && <button style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--bg2)", border: "none", fontSize: 14, cursor: "pointer" }} onClick={() => setSearchQuery("")}>×</button>}
        </div>
        {(savedPlaces || []).length > 0 && (
          <button onClick={() => setShowSaved(true)} style={{ flexShrink: 0, background: "var(--purple-lt)", color: "var(--purple)", border: "1.5px solid var(--purple)", borderRadius: 12, padding: "10px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
            🔖 {(savedPlaces || []).length}
          </button>
        )}
      </div>

      {sorted.length === 0 && (
        <div className="food-empty-state">No matches{searchQuery ? ` for "${searchQuery}"` : ""}.</div>
      )}

      {sorted.length > 0 && (
        <div style={{ display: "flex", gap: 14, overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: 8, marginBottom: 20, scrollbarWidth: "none" }}>
          {visibleFeed.map(place => {
            const isSaved = (savedPlaces || []).includes(place.name);
            const chips = chipsFor(place);
            return (
              <div key={place.id} onClick={() => setDetailOpen(place)}
                style={{ flexShrink: 0, width: 280, borderRadius: 20, overflow: "hidden", background: "var(--white)", border: "1px solid var(--border)", cursor: "pointer", scrollSnapAlign: "start" }}>
                <div style={{ height: 180, background: "var(--bg2)" }}>
                  {place.img && <img src={place.img} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                </div>
                <div style={{ padding: 16, position: "relative" }}>
                  <div style={{ fontSize: 26, color: "var(--purple)", lineHeight: 0.5, marginBottom: 6 }}>"</div>
                  {place.sharedExp && (
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", lineHeight: 1.4, marginBottom: 10, minHeight: 40 }}>
                      {place.sharedExp.length > 90 ? place.sharedExp.slice(0, 90) + "…" : place.sharedExp}
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: "var(--purple)", fontWeight: 600, marginBottom: 10 }}>📍 {place.name} · {place.hood}</div>
                  {chips.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {chips.map((t, i) => {
                        const palette = [
                          { bg: "#FFF0EE", color: "#C94E3A" },
                          { bg: "#E8F0FF", color: "#2A5CA8" },
                          { bg: "#EAF7E9", color: "#2D6A2D" },
                        ][i % 3];
                        return <span key={t} style={{ background: palette.bg, color: palette.color, borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>{t}</span>;
                      })}
                    </div>
                  )}
                  <button onClick={e => { e.stopPropagation(); onToggleSave(place.name); }}
                    style={{ position: "absolute", bottom: 14, right: 14, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--purple)" }}>
                    {isSaved ? "🔖" : "📑"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PassportSection category="food" city={city} userId={userId} userName={userName} hideFeed hideShareCTA
        savedFoodNames={savedPlaces} savedPlaceIds={savedExplorePlaces}
        onOpenSavedFood={item => setDetailOpen(item)} />

      {/* ── Share your experience — top of page ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "var(--purple-lt)", borderRadius: 16, padding: "20px 22px", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text)" }}>Share your experience</div>
          <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 3 }}>Help people discover amazing food spots.</div>
        </div>
        <button onClick={() => { setSubmitTab("experience"); setSubmitOpen(true); }}
          style={{ flexShrink: 0, background: "var(--purple)", color: "white", border: "none", borderRadius: 12, padding: "12px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          + Share
        </button>
      </div>

      {/* Community-submitted new places */}
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

      {/* Share / Add sheet */}
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
  const [note, setNote] = useState("");
  const [tags, setTags] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const toggleTag = t => setTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const handleSubmit = async () => {
    if (!userId) { setError("Sign in to share your experience."); return; }
    if (!selectedPlace) { setError("Please select a place first."); return; }
    setSubmitting(true); setError("");
    try {
      let photoUrl = null;
      if (photoFile) photoUrl = await uploadFoodExperiencePhoto(userId, photoFile);
      await shareFoodExperience(userId, userName || "Someone", selectedPlace, { photoUrl, note: note.trim(), tags });
      setDone(true);
      setTimeout(onDone, 1200);
    } catch (e) { console.error(e); setError("Couldn't share that — please try again."); }
    finally { setSubmitting(false); }
  };

  if (done) return <div style={{ textAlign: "center", padding: "24px 0" }}><div style={{ fontSize: 32 }}>✓</div><div style={{ fontWeight: 700, marginTop: 6 }}>Thanks for sharing!</div></div>;

  return (
    <div style={{ paddingBottom: 8 }}>
      {error && <div className="profile-save-error">⚠️ {error}</div>}
      <select className="ob-input ob-select" style={{ marginBottom: 12 }} value={selectedPlace} onChange={e => setSelectedPlace(e.target.value)}>
        <option value="">Select a food spot...</option>
        {cd.food.map(p => <option key={p.id} value={p.name}>{p.name} — {p.hood}</option>)}
      </select>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>This place is worth visiting because...</div>
        <textarea className="ob-input" rows={3} style={{ resize: "none" }} placeholder={`Example: "The ramen is delicious and budget friendly."`} value={note} onChange={e => setNote(e.target.value)} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>What makes this place special?</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {FOOD_TAGS.map(t => (
            <button key={t} type="button" onClick={() => toggleTag(t)}
              style={{ border: "1.5px solid " + (tags.includes(t) ? "var(--purple)" : "var(--border)"), borderRadius: 10, padding: "8px 6px", fontSize: 12, fontWeight: 600, color: tags.includes(t) ? "white" : "var(--text2)", background: tags.includes(t) ? "var(--purple)" : "var(--bg)", cursor: "pointer", textAlign: "center" }}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>Photos <span style={{ color: "var(--text3)", fontWeight: 400 }}>(Optional)</span></div>
        <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed var(--border)", borderRadius: 12, padding: 20, cursor: "pointer", background: "var(--bg)" }}>
          {photoPreview ? <img src={photoPreview} alt="" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8 }} /> : <><div style={{ fontSize: 28, marginBottom: 6 }}>📷</div><span style={{ fontSize: 13, color: "var(--purple)", fontWeight: 600 }}>Add Photo</span></>}
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; setPhotoFile(f || null); setPhotoPreview(f ? URL.createObjectURL(f) : null); }} />
        </label>
      </div>
      <button className="filter-apply" style={{ marginTop: 4 }} disabled={submitting} onClick={handleSubmit}>{submitting ? "Sharing…" : "Share with the community"}</button>
    </div>
  );
}

function SubmitFoodPlaceForm({ city, userId, userName, onSubmitted }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [because, setBecause] = useState("");
  const [tags, setTags] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const toggleTag = t => setTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const handleSubmit = async () => {
    if (!userId) { setError("Sign in to add a place."); return; }
    if (!name.trim()) { setError("Name is required."); return; }
    setSubmitting(true); setError("");
    try {
      let photoUrl = null;
      if (photoFile) photoUrl = await uploadCommunityPlacePhoto(userId, photoFile);
      const place = await submitCommunityPlace(userId, userName || "Someone", {
        city, name: name.trim(), area: location.trim(), cuisine: "", description: because.trim(), photoUrl, tags,
      });
      setDone(true);
      onSubmitted(place);
    } catch (e) { console.error(e); setError("Couldn't submit — please try again."); }
    finally { setSubmitting(false); }
  };

  if (done) return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      <div style={{ fontSize: 32 }}>✓</div>
      <div style={{ fontWeight: 700, marginTop: 6 }}>Submitted for review!</div>
      <p style={{ fontSize: 13, color: "var(--text3)", marginTop: 6, lineHeight: 1.5 }}>Our team reviews every new place before it goes live.</p>
    </div>
  );

  return (
    <div style={{ paddingBottom: 8 }}>
      {error && <div className="profile-save-error">⚠️ {error}</div>}
      <input className="ob-input" style={{ marginBottom: 10 }} placeholder="Food spot name" value={name} onChange={e => setName(e.target.value)} />
      <input className="ob-input" style={{ marginBottom: 10 }} placeholder="Location / neighbourhood" value={location} onChange={e => setLocation(e.target.value)} />
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>This place is worth visiting because...</div>
        <textarea className="ob-input" rows={2} style={{ resize: "none" }} placeholder={`Example: "The ramen is delicious and budget friendly."`} value={because} onChange={e => setBecause(e.target.value)} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>What makes this place special?</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {FOOD_TAGS.map(t => (
            <button key={t} type="button" onClick={() => toggleTag(t)}
              style={{ border: "1.5px solid " + (tags.includes(t) ? "var(--purple)" : "var(--border)"), borderRadius: 10, padding: "8px 6px", fontSize: 12, fontWeight: 600, color: tags.includes(t) ? "white" : "var(--text2)", background: tags.includes(t) ? "var(--purple)" : "var(--bg)", cursor: "pointer", textAlign: "center" }}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>Photos <span style={{ color: "var(--text3)", fontWeight: 400 }}>(Optional)</span></div>
        <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed var(--border)", borderRadius: 12, padding: 20, cursor: "pointer", background: "var(--bg)" }}>
          {photoPreview ? <img src={photoPreview} alt="" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8 }} /> : <><div style={{ fontSize: 28, marginBottom: 6 }}>📷</div><span style={{ fontSize: 13, color: "var(--purple)", fontWeight: 600 }}>Add Photo</span></>}
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; setPhotoFile(f || null); setPhotoPreview(f ? URL.createObjectURL(f) : null); }} />
        </label>
        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>New places are reviewed before going live.</div>
      </div>
      <button className="filter-apply" disabled={submitting} onClick={handleSubmit}>{submitting ? "Submitting…" : "Submit for review"}</button>
    </div>
  );
}

// ─── EVENTS SCREEN ────────────────────────────────────────────────────────────
// ─── WHAT'S HAPPENING ── community-submitted events ───────────────────────────
// Users advertise house parties, meetups, etc. Submissions require admin
// approval before going public (status: 'pending' → 'approved'), matching the
// same safety pattern as community food places.

const EVENT_CATEGORIES = ["House Party", "Workshop", "Live Music", "Sports & Fitness", "Food & Drinks", "Gaming", "Art & Creativity", "Adventure", "Volunteer"];
const EVENT_CATEGORY_ICONS = {
  "House Party": "🏠",
  "Workshop": "✏️",
  "Live Music": "🎵",
  "Sports & Fitness": "🏃",
  "Food & Drinks": "🍽️",
  "Gaming": "🎮",
  "Art & Creativity": "🎨",
  "Adventure": "🏔️",
  "Volunteer": "🤝",
};

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
        <span style={{ background: "var(--purple-lt)", color: "var(--purple)", borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>{event.category}</span>
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
          <div style={{ border: "1.5px solid var(--purple)", background: "var(--purple-lt)", borderRadius: 14, padding: 16, marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--purple)", letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 8 }}>Contact the organiser</div>
            {event.contact_info && <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: event.payment_info ? 6 : 0 }}>📞 {event.contact_info}</div>}
            {event.payment_info && <div style={{ fontSize: 13, color: "var(--text2)" }}>💳 {event.payment_info}</div>}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, fontSize: 13, color: "var(--text3)" }}>
          <span>{interestCount} {interestCount === 1 ? "person" : "people"} interested</span>
        </div>

        <button
          style={{ width: "100%", background: isInterested ? "var(--bg2)" : "var(--purple)", color: isInterested ? "var(--text2)" : "white", borderRadius: 14, padding: 15, fontSize: 15, fontWeight: 800, border: "none", cursor: userId ? "pointer" : "not-allowed", opacity: userId ? 1 : 0.6, transition: ".15s" }}
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
  const [form, setForm] = useState({ name: "", category: "House Party", location: "", event_date: "", event_time: "", description: "", contact_email: "", contact_phone: "", payment_info: "", entry_fee: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!userId) { setError("Sign in to post an event."); return; }
    if (!form.name.trim() || !form.location.trim() || !form.event_date.trim()) { setError("Event name, location, and date are required."); return; }
    setSubmitting(true); setError("");
    try {
      let photoUrl = null;
      if (photoFile) photoUrl = await uploadEventPhoto(userId, photoFile);
      await submitCommunityEvent(userId, userName || "Someone", {
        city,
        name: form.name.trim(),
        category: form.category,
        location: form.location.trim(),
        event_date: form.event_date + (form.event_time ? " " + form.event_time : ""),
        description: form.description.trim(),
        contact_info: [form.contact_email.trim(), form.contact_phone.trim()].filter(Boolean).join(' | '),
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text3)", marginBottom: 5 }}>DATE *</div>
          <input className="ob-input" type="date" style={{ margin: 0 }} value={form.event_date} onChange={e => set("event_date", e.target.value)} />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text3)", marginBottom: 5 }}>TIME</div>
          <input className="ob-input" type="time" style={{ margin: 0 }} value={form.event_time} onChange={e => set("event_time", e.target.value)} />
        </div>
      </div>
      <textarea className="ob-input experience-textarea" rows={3} style={{ marginBottom: 10 }} placeholder="What's it about? Who should come?" value={form.description} onChange={e => set("description", e.target.value)} />
      <input className="ob-input" style={{ marginBottom: 10 }} placeholder="Entry fee (e.g. ₹500, or leave blank if free)" value={form.entry_fee} onChange={e => set("entry_fee", e.target.value)} />
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text3)", marginBottom: 5 }}>CONTACT EMAIL</div>
        <input className="ob-input" style={{ margin: 0, marginBottom: 8 }} type="email" placeholder="your@email.com" value={form.contact_email} onChange={e => set("contact_email", e.target.value)} />
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text3)", marginBottom: 5 }}>PHONE NUMBER <span style={{ fontWeight: 400 }}>(optional)</span></div>
        <input className="ob-input" style={{ margin: 0 }} type="tel" placeholder="+91 xxxxx xxxxx" value={form.contact_phone} onChange={e => set("contact_phone", e.target.value)} />
      </div>
      <input className="ob-input" style={{ marginBottom: 12 }} placeholder="Payment info (UPI ID, link, etc. — optional)" value={form.payment_info} onChange={e => set("payment_info", e.target.value)} />

      <button className="filter-apply" disabled={submitting} onClick={handleSubmit}>{submitting ? "Posting…" : "Post event"}</button>
    </div>
  );
}



function EventsScreen({ city, userId, userName }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [openEvent, setOpenEvent] = useState(null);
  const [activeCat, setActiveCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [interested, setInterested] = useState({}); // local optimistic state: eventId -> bool
  const [interestCounts, setInterestCounts] = useState({});

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

  const toggleInterest = async (eventId) => {
    const wasInterested = !!interested[eventId];
    setInterested(p => ({ ...p, [eventId]: !wasInterested }));
    setInterestCounts(p => ({ ...p, [eventId]: (p[eventId] || 0) + (wasInterested ? -1 : 1) }));
    if (!userId) return;
    try { await toggleCommunityEventInterest(userId, eventId); }
    catch (e) {
      console.error(e);
      // revert on failure
      setInterested(p => ({ ...p, [eventId]: wasInterested }));
      setInterestCounts(p => ({ ...p, [eventId]: (p[eventId] || 0) + (wasInterested ? 1 : -1) }));
    }
  };

  const filtered = events.filter(e => {
    const matchCat = activeCat === "All" || e.category === activeCat;
    const matchSearch = !searchQuery.trim() || [e.name, e.location, e.category].some(f => f?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  if (openEvent) return (
    <EventDetailView
      event={openEvent} onBack={() => setOpenEvent(null)} userId={userId}
      isInterested={!!interested[openEvent.id]}
      interestCount={interestCounts[openEvent.id] ?? 0}
      onToggleInterest={() => toggleInterest(openEvent.id)}
    />
  );

  return (
    <div style={{ paddingTop: 20, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 8 }}>
        Host or join an event that excites you.
      </h1>
      <p style={{ fontSize: 14, color: "var(--text3)", marginBottom: 20 }}>Meet people. Share moments. Create stories.</p>

      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px solid var(--border)", borderRadius: 12, padding: "10px 14px", background: "var(--white)", marginBottom: 20 }}>
        <span style={{ fontSize: 14, color: "var(--text3)" }}>🔍</span>
        <input style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", background: "none", color: "var(--text)" }} placeholder="Search events..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        {searchQuery && <button style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--bg2)", border: "none", fontSize: 14, cursor: "pointer" }} onClick={() => setSearchQuery("")}>×</button>}
      </div>

      {/* Category icon grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 28 }}>
        <button onClick={() => setActiveCat("All")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: activeCat === "All" ? "var(--purple)" : "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            <span style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
              {[0, 1, 2, 3].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: 2, background: activeCat === "All" ? "white" : "var(--text3)" }} />)}
            </span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: activeCat === "All" ? "var(--purple)" : "var(--text2)", textAlign: "center" }}>All</span>
        </button>
        {EVENT_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCat(cat)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: activeCat === cat ? "var(--purple)" : "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              {EVENT_CATEGORY_ICONS[cat] || "🎉"}
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: activeCat === cat ? "var(--purple)" : "var(--text2)", textAlign: "center", lineHeight: 1.2 }}>{cat}</span>
          </button>
        ))}
      </div>

      {/* Upcoming Events */}
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>Upcoming Events</div>

      {loading && <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)" }}>Loading events…</div>}
      {!loading && loadError && <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)" }}>{loadError}</div>}
      {!loading && !loadError && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "36px 20px 40px" }}>
          <div style={{ fontSize: 40, marginBottom: 4 }}>📅</div>
          <p style={{ marginTop: 10, fontSize: 15, fontWeight: 700, color: "var(--text)" }}>No events yet</p>
          <p style={{ marginTop: 4, fontSize: 13, color: "var(--text3)" }}>Be the first to create an event and bring people together!</p>
        </div>
      )}

      {filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 8 }}>
          {filtered.map(e => (
            <div key={e.id}
              style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: 14, background: "var(--white)", border: "1px solid var(--border)", borderRadius: 16, boxShadow: "var(--shadow)", cursor: "pointer" }}
              onClick={() => setOpenEvent(e)}>
              <div style={{ flexShrink: 0, width: 110, height: 90, borderRadius: 10, overflow: "hidden", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {e.photo_url ? <img src={e.photo_url} alt={e.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 24 }}>🎉</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ background: "var(--purple-lt)", color: "var(--purple)", borderRadius: 999, padding: "2px 9px", fontSize: 10, fontWeight: 700 }}>{e.category}</span>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 5, marginBottom: 3, color: "var(--text)" }}>{e.name}</div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 2 }}>📅 {e.event_date}</div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>📍 {e.location}</div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>{interestCounts[e.id] ?? 0} interested</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div style={{ marginTop: 24, background: "var(--bg2)", borderRadius: 16, padding: "18px 20px", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>Have an idea? Make it happen.</div>
          <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.5 }}>Create your own event and bring people together.</div>
        </div>
        <button style={{ flexShrink: 0, background: "var(--purple)", color: "white", borderRadius: 999, padding: "10px 18px", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }} onClick={() => setCreateOpen(true)}>
          Create Event
        </button>
      </div>

      {createOpen && (
        <div className="share-sheet-overlay" onClick={() => setCreateOpen(false)}>
          <div className="share-sheet" onClick={e => e.stopPropagation()}>
            <div className="share-sheet-handle" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 17, fontWeight: 800 }}>Create Event</div>
              <button style={{ background: "none", border: "none", fontSize: 22, color: "var(--text3)", cursor: "pointer", padding: 0, lineHeight: 1 }} onClick={() => setCreateOpen(false)}>×</button>
            </div>
            <CreateEventForm city={city} userId={userId} userName={userName} onDone={() => setCreateOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BLOCKED USERS SECTION ───────────────────────────────────────────────────
function BlockedUsersSection({ userId }) {
  const [blocked, setBlocked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unblocking, setUnblocking] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const load = async () => {
    if (!userId) return;
    try {
      const ids = await getBlockedIds(userId);
      if (!ids.length) { setBlocked([]); setLoading(false); return; }
      // Fetch profiles for blocked users
      const { data } = await supabase.from('profiles').select('id,name,age').in('id', ids);
      setBlocked(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (expanded) load(); }, [userId, expanded]);

  const handleUnblock = async (blockedId) => {
    setUnblocking(blockedId);
    try {
      await supabase.from('blocks').delete()
        .eq('blocker_id', userId).eq('blocked_id', blockedId);
      setBlocked(p => p.filter(b => b.id !== blockedId));
    } catch (e) { console.error(e); }
    finally { setUnblocking(null); }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <button onClick={() => setExpanded(o => !o)}
        style={{ width: "100%", background: "none", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px", fontSize: 14, fontWeight: 600, color: "var(--text3)", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        🚫 Blocked users
        <span style={{ fontSize: 12 }}>{expanded ? "▲" : "▼"}</span>
      </button>
      {expanded && (
        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "0 0 12px 12px", borderTop: "none", overflow: "hidden" }}>
          {loading && <div style={{ padding: "16px", fontSize: 13, color: "var(--text3)", textAlign: "center" }}>Loading…</div>}
          {!loading && blocked.length === 0 && (
            <div style={{ padding: "16px", fontSize: 13, color: "var(--text3)", textAlign: "center" }}>No blocked users.</div>
          )}
          {!loading && blocked.map(b => (
            <div key={b.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{b.name || "Unknown"}{b.age ? `, ${b.age}` : ""}</div>
              </div>
              <button onClick={() => handleUnblock(b.id)} disabled={unblocking === b.id}
                style={{ fontSize: 12, fontWeight: 700, color: "#581073", background: "var(--bg2)", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>
                {unblocking === b.id ? "…" : "Unblock"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function EditableField({ label, value, onSave, type = "text" }) {
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
        <div className="profile-field-val profile-field-editable" onClick={() => setEditing(true)}>
          <span>{value || <span style={{ color: "var(--text3)" }}>Tap to add</span>}</span>
          <span style={{ fontSize: 12, color: "var(--purple)", fontWeight: 600, marginLeft: 8 }}>Edit</span>
        </div>
      )}
    </div>
  );
}

function ProfileScreen({ user, userId, onSignOut, onUpdateProfile, onReplayTour, onViewOwnProfile }) {
  const cd = CITIES[user.city];
  const [cuisines, setCuisines] = useState(user.cuisines || []);
  const [things, setThings] = useState(user.things || []);
  const [selInterests, setSelInterests] = useState((user.interests || []).filter(i => INTEREST_LIST.includes(i)));
  const interestsSaveTimer = useRef(null);
  const saveInterests = (next) => {
    // Debounce — wait 800ms after last change before saving
    if (interestsSaveTimer.current) clearTimeout(interestsSaveTimer.current);
    interestsSaveTimer.current = setTimeout(() => save({ interests: next }), 800);
  };
  const [prompts, setPrompts] = useState(user.prompts || {});
  const [privacy, setPrivacy] = useState(user.privacy_settings || {});
  useEffect(() => { setPrivacy(user.privacy_settings || {}); }, [user.privacy_settings]);
  const savePrivacy = (next) => {
    setPrivacy(next);
    save({ privacy_settings: next });
  };
  const [photos, setPhotos] = useState(user.photo_urls || []);
  const normalizeRec = r => {
    let val = r;
    let attempts = 0;
    while (attempts < 10) {
      attempts++;
      if (val == null) return { name: "", location: "", because: "", tags: [] };
      if (typeof val === "string") {
        if (!val.startsWith("{")) return { name: val, location: "", because: "", tags: [] };
        try { val = JSON.parse(val); } catch(e) { return { name: val, location: "", because: "", tags: [] }; }
      } else if (typeof val === "object" && !Array.isArray(val)) {
        let name = val.name || "";
        // If name is itself a JSON string, unwrap it
        if (typeof name === "string" && name.startsWith("{")) {
          try { name = JSON.parse(name).name || ""; } catch(e) { /* keep name as-is */ }
        }
        return { name, location: val.location || "", because: val.because || "", tags: Array.isArray(val.tags) ? val.tags : [], photoUrl: val.photoUrl || val.photo_url || "" };
      } else {
        return { name: "", location: "", because: "", tags: [] };
      }
    }
    return { name: "", location: "", because: "", tags: [] };
  };

  const [foodRecs, setFoodRecs] = useState(() => {
    const arr = user.food_recs || [];
    const normalized = arr.map(r => normalizeRec(r)).filter(r => r.name || r.location || r.because || r.tags?.length);
    return normalized.length > 0 ? normalized : [{ name: "", location: "", because: "", tags: [] }];
  });
  const [cityRecs, setCityRecs] = useState(() => {
    const arr = user.city_recs || [];
    const normalized = arr.map(r => normalizeRec(r)).filter(r => r.name || r.location || r.because || r.tags?.length);
    return normalized.length > 0 ? normalized : [{ name: "", location: "", because: "", tags: [] }];
  });
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [cityPickerOpen, setCityPickerOpen] = useState(false);

  useEffect(() => { setCuisines(user.cuisines || []); }, [user.cuisines]);
  useEffect(() => { setPhotos(user.photo_urls || []); }, [user.photo_urls]);
  useEffect(() => { setThings(user.things || []); }, [user.things]);
  useEffect(() => { setPrompts(user.prompts || {}); }, [user.prompts]);
  useEffect(() => {
    const cleaned = (user.interests || []).filter(i => INTEREST_LIST.includes(i));
    setSelInterests(cleaned);
    // Persist the cleanup once, so stale legacy values don't keep coming back
    if (cleaned.length !== (user.interests || []).length) {
      save({ interests: cleaned });
    }
  }, [user.interests]);
  useEffect(() => {
    const arr = user.food_recs || [];
    const normalized = arr.map(r => normalizeRec(r)).filter(r => r.name || r.location || r.because || r.tags?.length);
    setFoodRecs(normalized.length > 0 ? normalized : [{ name: "", location: "", because: "", tags: [] }]);
  }, [user.food_recs]);
  useEffect(() => {
    const arr = user.city_recs || [];
    const normalized = arr.map(r => normalizeRec(r)).filter(r => r.name || r.location || r.because || r.tags?.length);
    setCityRecs(normalized.length > 0 ? normalized : [{ name: "", location: "", because: "", tags: [] }]);
  }, [user.city_recs]);

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
            <div className="profile-field">
              <label>Your area in Mumbai</label>
              <select className="profile-field-input" value={user.location || ""} onChange={e => save({ location: e.target.value })} style={{ appearance: "auto", cursor: "pointer" }}>
                <option value="">Select neighbourhood...</option>
                {MUMBAI_HOODS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <EditableField label="Age" value={user.age ? String(user.age) : ""} type="number" onSave={v => { const n = parseInt(v); if (!isNaN(n) && n >= 18 && n <= 100) save({ age: n }); }} />
            <div className="profile-field">
              <label>City</label>
              <div className="profile-field-val profile-field-editable" onClick={() => setCityPickerOpen(o => !o)}>{cd.label} 📍 <span className="profile-field-edit-hint">✏️</span></div>
              {cityPickerOpen && (
                <div className="profile-city-picker">
                  {[{ id: "mumbai", name: "Mumbai" }].map(c => (
                    <button key={c.id} className={`profile-city-opt ${user.city === c.id ? "active" : ""}`} onClick={() => { save({ city: c.id }); setCityPickerOpen(false); }}>{c.name}</button>
                  ))}
                </div>
              )}
            </div>
            <div className="profile-field" style={{ gridColumn: "1 / -1" }}>
              <label>Gender</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                {GENDER_OPTIONS.map(g => {
                  const isCustom = user.pronouns && !GENDER_OPTIONS.slice(0, 4).includes(user.pronouns);
                  const active = g === "Other" ? isCustom : user.pronouns === g;
                  return (
                    <button key={g} type="button"
                      style={{ border: "1.5px solid " + (active ? "var(--purple)" : "var(--border)"), borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 600, color: active ? "white" : "var(--text2)", background: active ? "var(--purple)" : "var(--white)", cursor: "pointer" }}
                      onClick={() => save({ pronouns: g === "Other" ? "Other" : (user.pronouns === g ? "" : g) })}>
                      {g}
                    </button>
                  );
                })}
              </div>
              {user.pronouns && !GENDER_OPTIONS.slice(0, 4).includes(user.pronouns) && (
                <input className="ob-input" style={{ marginTop: 10, fontSize: 13 }}
                  placeholder="Your gender"
                  defaultValue={user.pronouns === "Other" ? "" : user.pronouns}
                  onBlur={e => { const v = e.target.value.trim(); if (v) save({ pronouns: v }); }} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2 Photo */}
      <div className="profile-section">
        <div className="profile-sec-num">2</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Photo <span className="profile-sec-count">{photos.filter(Boolean).length ? "Added" : "Not added"}</span></div>
          <div className="profile-sec-sub">One clear photo — this is what people see first.</div>
          <label style={{ display: "block", width: 140, height: 140, borderRadius: "50%", cursor: "pointer", position: "relative", margin: "8px auto 0" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", border: "3px solid " + (photos[0] ? "var(--purple)" : "var(--border)"), background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {photos[0] ? <img src={photos[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : uploadingSlot === 0 ? <span style={{ fontSize: 24 }}>⏳</span> : <span style={{ fontSize: 28 }}>📷</span>}
            </div>
            {photos[0] && (
              <button type="button" onClick={e => { e.preventDefault(); const prev = photos; setPhotos([]); save({ photo_urls: [] }, () => setPhotos(prev)); }}
                style={{ position: "absolute", top: 0, right: 0, background: "rgba(0,0,0,0.5)", color: "white", width: 26, height: 26, borderRadius: "50%", border: "none", cursor: "pointer", fontSize: 14 }}>×</button>
            )}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => handlePhotoSelect(0, e.target.files?.[0])} />
          </label>
        </div>
      </div>

      {/* 3 What I Enjoy */}
      <div className="profile-section">
        <div className="profile-sec-num">3</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">What I Enjoy <span className="profile-sec-count">{selInterests.length} selected</span></div>
          <div className="profile-sec-sub">The things you genuinely enjoy.</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            {INTEREST_LIST.map(item => {
              const sel = selInterests.includes(item);
              return (
                <button key={item} type="button"
                  onClick={() => { const next = sel ? selInterests.filter(i => i !== item) : [...selInterests, item]; setSelInterests(next); saveInterests(next); }}
                  style={{ border: "1.5px solid " + (sel ? "var(--purple)" : "var(--border)"), borderRadius: 999, padding: "7px 14px", fontSize: 12, fontWeight: 700, color: sel ? "white" : "var(--text2)", background: sel ? "var(--purple)" : "var(--white)", cursor: "pointer" }}>
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4 Things I Want to Do */}
      <div className="profile-section">
        <div className="profile-sec-num">4</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Things I Want to Do <span className="profile-sec-count">{things.length} added</span></div>
          <div className="profile-sec-sub">Things you'd love to do with someone.</div>
          {things.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10, marginBottom: 10 }}>
              {things.map(t => (
                <span key={t} style={{ background: "#F5E8F9", color: "#581073", borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  {t}
                  <button onClick={() => removeThing(t)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#581073", padding: 0, lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
            {THINGS_LIST.filter(t => !things.includes(t)).map(t => (
              <button key={t} type="button" onClick={() => addThing(t)}
                style={{ border: "1.5px solid var(--border)", borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 600, color: "var(--text2)", background: "var(--white)", cursor: "pointer" }}>
                {t}
              </button>
            ))}
          </div>
          <input className="ob-input" style={{ marginTop: 12 }} placeholder="Or type your own (press Enter)..."
            onKeyDown={e => { if (e.key === "Enter" && e.target.value.trim()) { const val = e.target.value.trim(); if (!things.includes(val)) addThing(val); e.target.value = ""; } }} />
        </div>
      </div>

      {/* 5 Cuisine prefs */}
      <div className="profile-section">
        <div className="profile-sec-num">5</div>
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

      {/* 6 Food recs */}
      <div className="profile-section">
        <div className="profile-sec-num">6</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Food Spots</div>
          <div className="profile-sec-sub">Share a food spot you enjoy.</div>
          {foodRecs.map((rec, i) => (
            <div key={i} style={{ position: "relative" }}>
              <RecForm rec={normalizeRec(rec)} idx={i}
                setter={async updater => {
                  setFoodRecs(prev => {
                    const arr = prev.map(r => normalizeRec(r));
                    const next = typeof updater === "function" ? updater(arr) : updater;
                    const uploadAndSave = async () => {
                      const uploaded = await Promise.all(next.map(async r => {
                        if (r.photo instanceof File) {
                          try {
                            const ext = r.photo.name.split(".").pop();
                            const path = `food-recs/${userId}/${Date.now()}.${ext}`;
                            await supabase.storage.from("place-photos").upload(path, r.photo, { upsert: true });
                            const { data } = supabase.storage.from("place-photos").getPublicUrl(path);
                            return { ...r, photoUrl: data.publicUrl, photo: null };
                          } catch { return r; }
                        }
                        return r;
                      }));
                      save({ food_recs: uploaded });
                      setFoodRecs(uploaded);
                    };
                    uploadAndSave();
                    return next;
                  });
                }}
                tags={FOOD_TAG_ICONS} placeholder="Enter food spot name"
                exampleText={`Example: "The ramen is delicious and budget friendly."`} />
              {foodRecs.length > 1 && (
                <button type="button" onClick={() => {
                  const next = foodRecs.filter((_, j) => j !== i);
                  setFoodRecs(next); save({ food_recs: next });
                }} style={{ position: "absolute", top: 12, right: 12, fontSize: 20, color: "#C94E3A", background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}>×</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setFoodRecs(p => [...p, { name: "", location: "", because: "", tags: [] }])}
            style={{ fontSize: 13, fontWeight: 600, color: "var(--purple)", background: "none", border: "1.5px solid var(--purple)", borderRadius: 10, padding: "8px 16px", cursor: "pointer", marginTop: 8 }}>
            + Add another food spot
          </button>
        </div>
      </div>

      {/* 7 City recs */}
      <div className="profile-section">
        <div className="profile-sec-num">7</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Places Worth Exploring</div>
          <div className="profile-sec-sub">Help others discover great places.</div>
          {cityRecs.map((rec, i) => (
            <div key={i} style={{ position: "relative" }}>
              <RecForm rec={normalizeRec(rec)} idx={i}
                setter={async updater => {
                  setCityRecs(prev => {
                    const arr = prev.map(r => normalizeRec(r));
                    const next = typeof updater === "function" ? updater(arr) : updater;
                    const uploadAndSave = async () => {
                      const uploaded = await Promise.all(next.map(async r => {
                        if (r.photo instanceof File) {
                          try {
                            const ext = r.photo.name.split(".").pop();
                            const path = `city-recs/${userId}/${Date.now()}.${ext}`;
                            await supabase.storage.from("place-photos").upload(path, r.photo, { upsert: true });
                            const { data } = supabase.storage.from("place-photos").getPublicUrl(path);
                            return { ...r, photoUrl: data.publicUrl, photo: null };
                          } catch { return r; }
                        }
                        return r;
                      }));
                      save({ city_recs: uploaded });
                      setCityRecs(uploaded);
                    };
                    uploadAndSave();
                    return next;
                  });
                }}
                tags={PLACE_TAG_ICONS} placeholder="Enter place name"
                exampleText={`Example: "...watching the sunset while enjoying tea feels peaceful."`} />
              {cityRecs.length > 1 && (
                <button type="button" onClick={() => {
                  const next = cityRecs.filter((_, j) => j !== i);
                  setCityRecs(next); save({ city_recs: next });
                }} style={{ position: "absolute", top: 12, right: 12, fontSize: 20, color: "#C94E3A", background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}>×</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setCityRecs(p => [...p, { name: "", location: "", because: "", tags: [] }])}
            style={{ fontSize: 13, fontWeight: 600, color: "var(--purple)", background: "none", border: "1.5px solid var(--purple)", borderRadius: 10, padding: "8px 16px", cursor: "pointer", marginTop: 8 }}>
            + Add another place
          </button>
        </div>
      </div>

      {/* 8 It's Fun Talking About */}
      <div className="profile-section">
        <div className="profile-sec-num">8</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">It's Fun Talking About <span className="profile-sec-count">{Object.keys(prompts).length} added</span></div>
          <div className="profile-sec-sub">Pick topics and add quick answers — they're great conversation starters for matches.</div>
          {FUN_TALKING_ABOUT.map(({ label, question }) => {
            const answered = question in prompts;
            return (
              <div key={question} className="prompt-row">
                <div className="prompt-q">{label} — {question}</div>
                {answered ? (
                  <div className="prompt-answered">
                    <input className="ob-input" style={{ marginTop: 6, fontSize: 13 }}
                      placeholder={FUN_TALKING_ABOUT.find(t => t.question === question)?.example}
                      value={prompts[question]}
                      onChange={e => setPrompts(prev => ({ ...prev, [question]: e.target.value }))}
                      onBlur={e => { const next = { ...prompts, [question]: e.target.value }; save({ prompts: next }); }} />
                    <button className="prompt-remove" onClick={() => { const next = { ...prompts }; delete next[question]; setPrompts(next); save({ prompts: next }); }}>Remove</button>
                  </div>
                ) : (
                  <button className="prompt-add-btn" onClick={() => { const next = { ...prompts, [question]: "" }; setPrompts(next); save({ prompts: next }); }}>+ Answer this</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="profile-section">
        <div className="profile-sec-num">🔒</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Privacy Settings</div>
          <div className="profile-sec-sub">Control what other users can see on your profile.</div>
          {[
            { key: "hide_age", label: "Hide my age" },
            { key: "hide_gender", label: "Hide my gender" },
            { key: "hide_college", label: "Hide my college / workplace" },
            { key: "hide_location", label: "Hide my location / neighbourhood" },
            { key: "hide_food_recs", label: "Hide my food recommendations" },
            { key: "hide_city_recs", label: "Hide my places worth exploring" },
            { key: "hide_prompts", label: "Hide my thoughts / prompts" },
          ].map(({ key, label }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 14, color: "var(--text)" }}>{label}</span>
              <div onClick={() => savePrivacy({ ...privacy, [key]: !privacy[key] })}
                style={{ width: 44, height: 24, borderRadius: 999, background: privacy[key] ? "var(--purple)" : "#E0E0E0", cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 3, left: privacy[key] ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View my profile as others see it */}
      {onViewOwnProfile && (
        <button onClick={onViewOwnProfile}
          style={{ width: "100%", background: "var(--bg2)", border: "1.5px solid var(--border)", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 700, color: "var(--purple)", cursor: "pointer", marginBottom: 12 }}>
          👁 See how my profile looks to others
        </button>
      )}
      <button className="profile-signout" onClick={onSignOut}>Sign out</button>

      {/* Blocked users section */}
      <BlockedUsersSection userId={userId} />
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const { session, profile, loading, refreshProfile } = useAuth();
  const [localUser, setLocalUser] = useState(null);
  const [tab, setTab] = useState("home");
  const [viewOwnProfile, setViewOwnProfile] = useState(false);
  const switchTab = (t) => { setTab(t); setViewOwnProfile(false); };
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [tourStep, setTourStep] = useState(null);
  const [screen, setScreen] = useState("landing");
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll for pending requests + unread messages
  useEffect(() => {
    if (!session?.user?.id) return;
    const check = async () => {
      try {
        const [reqs, conns] = await Promise.all([
          getPendingRequests(session.user.id),
          getConnections(session.user.id),
        ]);
        const pendingN = (reqs || []).length;
        // Count conversations with messages we haven't seen yet
        const seenData = (() => { try { return JSON.parse(localStorage.getItem(`nm_seen_${session.user.id}`) || "{}"); } catch { return {}; } })();
        const unreadConvs = (conns || []).filter(c => {
          if (c.status === 'pending') return false;
          const cnt = Array.isArray(c.messages) ? (c.messages[0]?.count ?? 0) : 0;
          return cnt > 0 && cnt > (seenData[c.id] ?? 0);
        }).length;
        setPendingCount(pendingN);
        setUnreadCount(pendingN + unreadConvs);
      } catch {}
    };
    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, [session?.user?.id]);

  useEffect(() => {
    const alreadySeen = localStorage.getItem(`nearmet_tour_${session?.user?.id}`) === "true";
    if (profile?.profile_complete && !alreadySeen && tourStep === null) setTourStep(0);
  }, [profile?.profile_complete]);

  const finishTour = async () => {
    localStorage.setItem(`nearmet_tour_${session?.user?.id}`, "true");
    setTourStep(null);
    // legacy key removed
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
          <span style={{ color: "#581073" }}>Near</span><span style={{ color: "#581073" }}>Met</span>
        </div>
        <div style={{ fontSize: 13, color: "#999" }}>Loading…</div>
      </div>
    </div>
  );

  // ── Supabase signed in + profile complete (or just finished onboarding) ──
  if (session && (profile?.profile_complete || onboardingComplete)) {
    // If onboardingComplete but profile not yet refreshed, build user from onboarding data
    const profileData = profile?.profile_complete ? profile : profile || {};
    const user = {
      id: session.user.id,
      city: profileData.city || "mumbai",
      name: profileData.name || session.user.email?.split("@")[0] || "User",
      age: profileData.age || null,
      gender: profileData.gender || profileData.pronouns || "",
      interests: profileData.interests || [],
      things: profileData.city_wants || [],
      cuisines: profileData.cuisines || [],
      budget: profileData.budget || "flexible",
      photo_urls: profileData.photo_urls || [],
      saved_food_places: profileData.saved_food_places || [],
      saved_explore_places: profileData.saved_explore_places || [],
      prompts: profileData.prompts || {},
      food_recs: profileData.food_recs || [],
      city_recs: profileData.city_recs || [],
      pronouns: profileData.pronouns || "",
      location: profileData.location || "",
      privacy_settings: profileData.privacy_settings || {},
      college: profileData.college || "",
    };
    const nav = [
      ["home", "🏠", "Home"],
      ["connections", "👥", "Connections"],
      ["places", "📍", "Places"],
      ["food", "🍽️", "Food"],
      ["events", "🎉", "Events"],
    ];
    return (
      <div className="app-root">
        <header className="topnav">
          <div className="topnav-inner">
            <NearMetLogo size={26} />
            <div className="topnav-right">
              <span className="city-pill">📍 Mumbai</span>
              <button className="topnav-msg-btn" onClick={() => setMessagesOpen(true)} title="Messages" style={{ position: "relative" }}>
                💬
                {unreadCount > 0 && (
                  <span style={{ position: "absolute", top: -4, right: -4, background: "#581073", color: "white", borderRadius: "50%", width: 16, height: 16, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>{unreadCount}</span>
                )}
              </button>
              <button data-tour="profile-btn" className="topnav-msg-btn" title="Profile" onClick={() => setTab("profile")}>👤</button>
            </div>
          </div>
        </header>
        <nav className="section-tab-bar">
          {nav.map(([id, icon, lbl]) => (
            <button key={id} data-tour={`${id}-tab`} className={`section-tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
              <span className="section-tab-icon">{icon}</span>
              <span className="section-tab-label">{lbl}</span>
            </button>
          ))}
        </nav>
        {messagesOpen && <MessagesPanel userId={session.user.id} onClose={() => { setMessagesOpen(false); getPendingRequests(session.user.id).then(reqs => { setPendingCount((reqs||[]).length); setUnreadCount((reqs||[]).length); }).catch(()=>{}); }} onPendingChange={n => { setPendingCount(n); setUnreadCount(n); }} />}
        {tourStep !== null && <TourOverlay stepIndex={tourStep} onNext={() => { if (tourStep >= TOUR_STEPS.length - 1) finishTour(); else setTourStep(s => s + 1); }} onBack={() => setTourStep(s => Math.max(0, s - 1))} onSkip={finishTour} />}
        <main className="site-main">
          {tab === "home" && <HomeScreen user={user} userId={session.user.id} city={user.city} onNavigate={setTab} onOpenProfile={() => setTab("profile")} />}
          {tab === "connections" && <ConnectionsScreen city={user.city} userId={session.user.id} me={user} />}
          {tab === "places" && <PlacesToExploreScreen city={user.city} userId={session.user.id} userName={user.name}
            savedExplorePlaces={user.saved_explore_places || []}
            savedFoodPlaces={user.saved_food_places || []}
            onToggleExploreSave={async (placeId) => {
              const cur = user.saved_explore_places || [];
              const next = cur.includes(placeId) ? cur.filter(id => id !== placeId) : [...cur, placeId];
              try { await updateProfile(session.user.id, { saved_explore_places: next }); await refreshProfile(); } catch (e) { console.error(e); }
            }} />}
          {tab === "food" && <FoodScreen city={user.city} userCuisines={user.cuisines} userBudget={user.budget} userId={session.user.id} userName={user.name} savedPlaces={user.saved_food_places} savedExplorePlaces={user.saved_explore_places || []} onToggleSave={async name => { const cur = user.saved_food_places || []; const next = cur.includes(name) ? cur.filter(n => n !== name) : [...cur, name]; try { await updateProfile(session.user.id, { saved_food_places: next }); await refreshProfile(); } catch (e) { console.error(e); } }} />}
          {tab === "events" && <EventsScreen city={user.city} userId={session.user.id} userName={user.name} />}
          {tab === "profile" && !viewOwnProfile && <ProfileScreen user={user} userId={session.user.id} onSignOut={handleSignOut} onUpdateProfile={async updates => { await updateProfile(session.user.id, updates); await refreshProfile(); }} onReplayTour={() => setTourStep(0)} onViewOwnProfile={() => setViewOwnProfile(true)} />}
          {tab === "profile" && viewOwnProfile && (
            <FullProfileView
              person={{ ...user, id: session.user.id }}
              city={user.city}
              me={null}
              onBack={() => setViewOwnProfile(false)}
              onMessage={null}
              connecting={false}
            />
          )}
        </main>
      </div>
    );
  }

  // ── Supabase signed in but onboarding not done ──
  if (session && !onboardingComplete && !profile?.profile_complete) return (
    <Onboarding
      initialCity={profile?.city || "mumbai"}
      initialName={profile?.name}
      initialAge={profile?.age}
      initialPronouns={profile?.pronouns}
      session={session}
      onSignUp={async () => {}} // already signed up
      onShowSignIn={handleSignOut}
      onBackToLanding={handleSignOut}
      onDone={async u => {
        try {
          await supabase.from('profiles').upsert({
            id: session.user.id,
            email: session.user.email,
            city: u.city, name: u.name,
            age: u.age ? parseInt(u.age) : null,
            phone: u.phone || "",
            gender: u.pronouns || "",
            location: u.location || "",
            photo_urls: u.photo_urls || [],
            interests: u.interests, city_wants: u.things,
            cuisines: u.cuisines, budget: u.budget,
            prompts: u.prompts || {},
            food_recs: u.food_recs || [],
            city_recs: u.city_recs || [],
            profile_complete: true,
            last_active: new Date().toISOString(),
          });
          // Don't call refreshProfile() here — it causes a brief null flash
          // that flickers back to the landing screen. Instead just set the
          // flag and let the next auth tick pick up the new profile naturally.
          setOnboardingComplete(true);
          // Refresh profile in background — won't cause flicker since onboardingComplete is already true
          setTimeout(() => refreshProfile(), 500);
        }
        catch (e) { console.error(e); setOnboardingComplete(true); }
      }} />
  );

  // ── Auth screens ──
  if (screen === "signin") return <AuthPage mode="signin" onBack={() => setScreen("landing")} onCreateAccount={() => setScreen("signup")} />;
  if (screen === "signup") return (
    <Onboarding
      initialCity="mumbai" initialName="" initialAge="" initialPronouns=""
      session={null}
      onSignUp={async (email, password, phone) => {
        const { signUp } = await import("./lib/supabase.js");
        const result = await signUp({ email, password, name: "", age: "", city: "mumbai", phone: phone || "" });
        return result;
      }}
      onShowSignIn={() => setScreen("signin")}
      onBackToLanding={() => setScreen("landing")}
      onDone={() => setScreen("signin")}
    />
  );

  // ── Local demo mode ──
  if (localUser) {
    const nav = [
      ["home", "🏠", "Home"],
      ["connections", "👥", "Connections"],
      ["places", "📍", "Places"],
      ["food", "🍽️", "Food"],
      ["events", "🎉", "Events"],
    ];
    return (
      <div className="app-root">
        <header className="topnav">
          <div className="topnav-inner">
            <NearMetLogo size={26} />
            <div className="topnav-right">
              <span className="city-pill">📍 Mumbai</span>
              <button className="topnav-msg-btn" disabled title="Sign in to use messaging">💬</button>
              <button data-tour="profile-btn" className="topnav-msg-btn" onClick={() => setTab("profile")}>👤</button>
            </div>
          </div>
        </header>
        <nav className="section-tab-bar">
          {nav.map(([id, icon, lbl]) => (
            <button key={id} data-tour={`${id}-tab`} className={`section-tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
              <span className="section-tab-icon">{icon}</span>
              <span className="section-tab-label">{lbl}</span>
            </button>
          ))}
        </nav>
        {tourStep !== null && <TourOverlay stepIndex={tourStep} onNext={() => { if (tourStep >= TOUR_STEPS.length - 1) setTourStep(null); else setTourStep(s => s + 1); }} onBack={() => setTourStep(s => Math.max(0, s - 1))} onSkip={() => setTourStep(null)} />}
        <main className="site-main">
          {tab === "home" && <HomeScreen user={localUser} userId={null} city={localUser.city} onNavigate={setTab} onOpenProfile={() => setTab("profile")} />}
          {tab === "connections" && <ConnectionsScreen city={localUser.city} userId={null} me={localUser} />}
          {tab === "places" && <PlacesToExploreScreen city={localUser.city} userId={null} userName={localUser.name}
            savedExplorePlaces={localUser.saved_explore_places || []}
            savedFoodPlaces={localUser.saved_food_places || []}
            onToggleExploreSave={placeId => {
              setLocalUser(u => {
                const cur = u.saved_explore_places || [];
                const next = cur.includes(placeId) ? cur.filter(id => id !== placeId) : [...cur, placeId];
                return { ...u, saved_explore_places: next };
              });
            }} />}
          {tab === "food" && <FoodScreen city={localUser.city} userCuisines={localUser.cuisines || []} userBudget={localUser.budget || "flexible"} userId={null} userName={localUser.name} savedPlaces={localUser.saved_food_places || []} savedExplorePlaces={localUser.saved_explore_places || []} onToggleSave={name => { setLocalUser(u => { const cur = u.saved_food_places || []; const next = cur.includes(name) ? cur.filter(n => n !== name) : [...cur, name]; return { ...u, saved_food_places: next }; }); }} />}
          {tab === "events" && <EventsScreen city={localUser.city} userId={null} userName={localUser.name} />}
          {tab === "profile" && <ProfileScreen user={localUser} userId={null} onSignOut={() => { setLocalUser(null); setScreen("landing"); }} onUpdateProfile={async updates => { setLocalUser(u => ({ ...u, ...updates })); }} onReplayTour={() => setTourStep(0)} />}
        </main>
      </div>
    );
  }

  // ── Onboarding (local) ──
  if (screen === "onboarding") return <Onboarding onShowSignIn={() => setScreen("signin")} onBackToLanding={() => setScreen("landing")} onDone={u => { setLocalUser(u); setTab("connections"); }} />;

  // ── Landing ── Use AuthPage which has the new gradient design
  return <AuthPage onCreateAccount={() => setScreen("signup")} onBack={() => {}} />;
}
