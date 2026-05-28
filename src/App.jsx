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

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CITIES = {
  nyc: {
    label: "New York City", cur: "$",
    food: [
      { id:1, name:"Olive Bistro", price:"$1,500 for two", rating:4.7, tag:"High rated", img:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80" },
      { id:2, name:"Sakura Sushi", price:"$1,200 for two", rating:4.6, tag:"Near you", img:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80" },
      { id:3, name:"La Pizzeria", price:"$1,000 for two", rating:4.5, tag:"Best for dinner", img:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80" },
      { id:4, name:"Truffle House", price:"$1,800 for two", rating:4.4, tag:"Popular", img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80" },
      { id:5, name:"Bunna Cafe", price:"$800 for two", rating:4.8, tag:"Hidden gem", img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=500&q=80" },
      { id:6, name:"Saravana Bhavan", price:"$600 for two", rating:4.7, tag:"Family fav", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80" },
    ],
    events: [
      { id:1, name:"Indie Night Live Concert", date:"24 May", time:"7:00 PM", loc:"Connaught Place", cat:"Live Music", catColor:"#9b59b6", img:"https://images.unsplash.com/photo-1501386761578-eaa54b02c811?w=500&q=80" },
      { id:2, name:"Art Festival 2025", date:"25 May", time:"11:00 AM", loc:"Central Park", cat:"Art & Culture", catColor:"#e67e22", img:"https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&q=80" },
      { id:3, name:"Rooftop Social Mixer", date:"26 May", time:"6:30 PM", loc:"Brooklyn Bridge", cat:"Social Mixers", catColor:"#3498db", img:"https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=500&q=80" },
      { id:4, name:"Comedy Night", date:"23 May", time:"8:00 PM", loc:"The Laugh Factory", img:"https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=500&q=80" },
      { id:5, name:"Book Reading Session", date:"24 May", time:"5:00 PM", loc:"Strand Books", img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80" },
      { id:6, name:"Sunset Yoga Session", date:"25 May", time:"7:00 AM", loc:"Riverside Park", img:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80" },
      { id:7, name:"DJ Night Party", date:"25 May", time:"9:00 PM", loc:"Output Club", img:"https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80" },
    ],
    thirdPlaces: [
      { id:1, name:"Prospect Park Meadow", dist:"1.2 km", vibe:"Peaceful & green", cat:"Nature", catColor:"#2d6a2d", visitors:128, addedBy:"Sarah K.", img:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80", trending:true },
      { id:2, name:"NYPL Reading Room", dist:"2.1 km", vibe:"Quiet & productive", cat:"Study & Work", catColor:"#8b6914", visitors:94, addedBy:"Mike R.", img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80" },
      { id:3, name:"Bushwick Collective", dist:"3.4 km", vibe:"Creative vibes", cat:"Art & Culture", catColor:"#e67e22", visitors:76, addedBy:"Jin L.", img:"https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&q=80" },
      { id:4, name:"Hudson River Greenway", dist:"5.3 km", vibe:"Calm & scenic", cat:"Nature", catColor:"#2d6a2d", visitors:210, addedBy:"Priya S.", img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80" },
      { id:5, name:"Ace Hotel Lobby", dist:"2.8 km", vibe:"Work-friendly", cat:"Study & Work", catColor:"#8b6914", visitors:62, addedBy:"Alex M.", img:"https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&q=80" },
      { id:6, name:"Brooklyn Bridge Park", dist:"3.6 km", vibe:"Open for all", cat:"Community", catColor:"#2980b9", visitors:304, addedBy:"Kavya R.", img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80" },
    ],
    people: [
      { id:1, ini:"R", name:"Rohit", age:26, city:"New York", color:"#e8f0e8", tc:"#2d6a2d",
        photos:["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80","https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"],
        prompts:[{q:"What recent incident changed your perspective on something and how?",a:"Solo backpacking in the Himalayas taught me to slow down and truly appreciate the little things."},{q:"If you were the mayor for a day what's one thing you'd change about your city and why?",a:"I'd make public spaces more vibrant and accessible for everyone."},{q:"What's something you've been curious about recently?",a:"I've been trying to understand how AI can actually make everyday life better."}],
        cityWants:["Run half marathon","Learn guitar","Go for trekking","Watch stand-up comedy","Try new restaurants"],
        songs:[{title:"The Night We Met",artist:"Lord Huron"},{title:"Yellow",artist:"Coldplay"},{title:"Choo Lo",artist:"The Local Train"}],
        recs:[{title:"Interstellar",type:"Movie"},{title:"Breaking Bad",type:"Series"},{title:"Cosmos",type:"Documentary"}]
      },
      { id:2, ini:"A", name:"Aisha", age:24, city:"New York", color:"#f0e8e8", tc:"#8b2020",
        photos:["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80","https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80","https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80"],
        prompts:[{q:"What recent incident changed your perspective on something and how?",a:"Watching sunrise at the Hudson taught me that the best moments are the unplanned ones."},{q:"If you were the mayor for a day what's one thing you'd change?",a:"I'd convert every empty lot into a community garden. Green spaces change how people feel."}],
        cityWants:["Take a pottery class","Find the best bagel in NYC","See a Broadway show","Join a book club","Learn to skateboard"],
        songs:[{title:"Heat Waves",artist:"Glass Animals"},{title:"Blinding Lights",artist:"The Weeknd"}],
        recs:[{title:"Everything Everywhere",type:"Movie"},{title:"Fleabag",type:"Series"}]
      },
      { id:3, ini:"M", name:"Marcus", age:28, city:"New York", color:"#e8eef5", tc:"#1a3a5c",
        photos:["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80","https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80","https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80"],
        prompts:[{q:"What school activity do you still miss?",a:"Jazz band rehearsals. There's something about creating something together in real time that can't be replicated."},{q:"What myth would you change society's view on?",a:"That you need to be extroverted to build genuine connections. The deepest ones I have are with fellow introverts."}],
        cityWants:["Brooklyn Bridge at sunset","Find best jazz bar","Try Ethiopian food in Bushwick","Take a cooking class","Run a 10k"],
        songs:[{title:"So What",artist:"Miles Davis"},{title:"Redbone",artist:"Childish Gambino"}],
        recs:[{title:"Moonlight",type:"Movie"},{title:"The Wire",type:"Series"},{title:"13th",type:"Documentary"}]
      },
    ],
  },
  mumbai: {
    label: "Mumbai", cur: "₹",
    food: [
      { id:1, name:"Café Mondegar", price:"₹1,500 for two", rating:4.6, tag:"Iconic", img:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80" },
      { id:2, name:"Bastian Bandra", price:"₹2,800 for two", rating:4.7, tag:"Trending", img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80" },
      { id:3, name:"Bombay Canteen", price:"₹1,600 for two", rating:4.8, tag:"Must visit", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80" },
      { id:4, name:"Prithvi Café", price:"₹400 for two", rating:4.8, tag:"Hidden gem", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
      { id:5, name:"Bademiya", price:"₹350 for two", rating:4.7, tag:"Late night", img:"https://images.unsplash.com/photo-1567364819-71b9a6f29795?w=500&q=80" },
      { id:6, name:"Haji Ali Juice", price:"₹200 for two", rating:4.9, tag:"Classic", img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&q=80" },
    ],
    events: [
      { id:1, name:"Koli Seafood Festival", date:"31 May", time:"12:00 PM", loc:"Versova Beach", cat:"Food & Culture", catColor:"#e67e22", img:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80" },
      { id:2, name:"Indie Music Night", date:"30 May", time:"8:00 PM", loc:"antiSOCIAL, Lower Parel", cat:"Live Music", catColor:"#9b59b6", img:"https://images.unsplash.com/photo-1501386761578-eaa54b02c811?w=500&q=80" },
      { id:3, name:"Bandra Flea Market", date:"1 Jun", time:"11:00 AM", loc:"Mount Mary Steps", cat:"Community", catColor:"#3498db", img:"https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=500&q=80" },
      { id:4, name:"Kathak Showcase", date:"31 May", time:"7:00 PM", loc:"Prithvi Theatre, Juhu", img:"https://images.unsplash.com/photo-1547153760-18fc86324498?w=500&q=80" },
      { id:5, name:"Dawn Run Club — Carter Road", date:"1 Jun", time:"6:00 AM", loc:"Carter Road, Bandra", img:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80" },
      { id:6, name:"Sunset Yoga — Juhu Beach", date:"1 Jun", time:"6:00 PM", loc:"Juhu Beach", img:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80" },
    ],
    thirdPlaces: [
      { id:1, name:"Lodhi Garden", dist:"1.2 km", vibe:"Peaceful & green", cat:"Nature", catColor:"#2d6a2d", visitors:128, addedBy:"Neha S.", img:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80", trending:true },
      { id:2, name:"India Habitat Library", dist:"2.1 km", vibe:"Quiet & productive", cat:"Study & Work", catColor:"#8b6914", visitors:94, addedBy:"Arjun M.", img:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80" },
      { id:3, name:"Street Art Park", dist:"3.4 km", vibe:"Creative vibes", cat:"Art & Culture", catColor:"#e67e22", visitors:76, addedBy:"Kavya R.", img:"https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&q=80" },
      { id:4, name:"Sanjay Van Lake", dist:"5.3 km", vibe:"Calm & scenic", cat:"Nature", catColor:"#2d6a2d", visitors:89, addedBy:"Rohit P.", img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80" },
      { id:5, name:"Blue Tokai Courtyard", dist:"2.8 km", vibe:"Work-friendly", cat:"Study & Work", catColor:"#8b6914", visitors:55, addedBy:"Meera T.", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
      { id:6, name:"Rose Garden Amphitheatre", dist:"3.6 km", vibe:"Open for all", cat:"Community", catColor:"#2980b9", visitors:142, addedBy:"Kavya R.", img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80" },
    ],
    people: [
      { id:1, ini:"A", name:"Ananya", age:26, city:"Mumbai", color:"#e8f0e8", tc:"#2d6a2d",
        photos:["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80","https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80","https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80"],
        prompts:[{q:"What recent incident changed your perspective on something and how?",a:"Losing my wallet while traveling alone taught me to be more adaptable and trust that things usually work out."},{q:"If you were the mayor for a day what's one thing you'd change about your city and why?",a:"I'd make public transport free for a day—just to see how much lighter the city feels without traffic and stress."},{q:"What's something you've been curious about recently?",a:"How sustainable living can actually be affordable for everyone."}],
        cityWants:["Run NYC marathon","Join dance class","Watch latest movie in theater","Go for trekking","Learn cooking"],
        songs:[{title:"Lose Yourself",artist:"Eminem"},{title:"Heat Waves",artist:"Glass Animals"},{title:"The Night We Met",artist:"Lord Huron"}],
        recs:[{title:"Interstellar",type:"Movie"},{title:"Breaking Bad",type:"Series"},{title:"Our Planet",type:"Documentary"}]
      },
      { id:2, ini:"R", name:"Rohit", age:27, city:"Mumbai", color:"#e8eef5", tc:"#1a3a5c",
        photos:["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80","https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"],
        prompts:[{q:"What recent incident changed your perspective on something and how?",a:"Solo backpacking in the Himalayas taught me to slow down and truly appreciate the little things."},{q:"If you were the mayor for a day what's one thing you'd change about your city and why?",a:"I'd make public spaces more vibrant and accessible for everyone."},{q:"What's something you've been curious about recently?",a:"I've been trying to understand how AI can actually make everyday life better."}],
        cityWants:["Run half marathon","Learn guitar","Go for trekking","Watch stand-up comedy","Try new restaurants"],
        songs:[{title:"The Night We Met",artist:"Lord Huron"},{title:"Yellow",artist:"Coldplay"},{title:"Choo Lo",artist:"The Local Train"}],
        recs:[{title:"Interstellar",type:"Movie"},{title:"Breaking Bad",type:"Series"},{title:"Cosmos",type:"Documentary"}]
      },
    ],
  },
};

const CUISINES = [
  { name:"Italian", img:"https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=300&q=80", icon:"🏛️" },
  { name:"Indian", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&q=80", icon:"🕌" },
  { name:"Asian", img:"https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=300&q=80", icon:"🏯" },
  { name:"Mexican", img:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&q=80", icon:"🌮" },
  { name:"Thai", img:"https://images.unsplash.com/photo-1559847844-5315695dadae?w=300&q=80", icon:"⛩️" },
];
const CATEGORIES = [
  {name:"Fine Dining",icon:"🍽️"},{name:"Buffet",icon:"🥘"},{name:"Desserts",icon:"🍰"},
  {name:"Cafes",icon:"☕"},{name:"Pizza",icon:"🍕"},{name:"Bars",icon:"🍸"},
];
const INTERESTS = [
  {name:"Music",icon:"🎵",color:"#fce4ec"},{name:"Art & Culture",icon:"🎨",color:"#ede7f6"},
  {name:"Workshops",icon:"🖥️",color:"#e3f2fd"},{name:"Sports",icon:"⚽",color:"#e8f5e9"},
  {name:"Festivals",icon:"🎉",color:"#fff8e1"},{name:"Networking",icon:"👥",color:"#e0f2f1"},
];
const THIRD_CATS = ["All","Nature","Study & Work","Community","Art & Culture","Wellness"];
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
  const [profile, setProfile] = useState({
    photos: [], prompts: [{q:null,a:""},{q:null,a:""},{q:null,a:""}],
    cityWants: [], wantInput: "",
    songs: [], songInput: "",
    recs: [], recInput: "", recType: "Movie",
  });

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const addWant = () => {
    if (profile.wantInput.trim() && profile.cityWants.length < 5) {
      setProfile(p => ({ ...p, cityWants: [...p.cityWants, p.wantInput.trim()], wantInput: "" }));
    }
  };

  // STEP 0: Landing
  if (step === 0) return (
    <div className="ob-root">
      <div className="ob-hero">
        <div className="ob-hero-img" style={{backgroundImage:`url(https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800&q=80)`}}/>
        <div className="ob-hero-overlay"/>
        <div className="ob-hero-content">
          <div className="ob-logo-hero"><NearMetLogo size={52} dark/></div>
          <p className="ob-hero-tagline">Explore your city.<br/>Find genuine connections.</p>
        </div>
        <div className="ob-hero-bottom">
          <button className="ob-cta-primary" onClick={next}>Create an account</button>
          <button className="ob-cta-secondary" onClick={() => onDone({ city:"mumbai", name:"Alex", profile })}>I have an account</button>
          <p className="ob-legal">By signing up, you agree to our <span className="ob-link">Terms & Conditions</span>. See how we use your data in our <span className="ob-link">Privacy Policy</span>.</p>
        </div>
      </div>
    </div>
  );

  // STEP 1: City
  if (step === 1) return (
    <div className="ob-root ob-step">
      <div className="ob-step-label">STEP 1 OF 5 — YOUR CITY</div>
      <h2 className="ob-step-title">Which city are you in?</h2>
      <p className="ob-step-sub">NearMet is live in two cities right now. More coming soon.</p>
      <div className="ob-city-list">
        {[{id:"nyc",flag:"🗽",name:"New York City",sub:"All 5 boroughs · Live now"},{id:"mumbai",flag:"🇮🇳",name:"Mumbai",sub:"All areas · Live now"}].map(c => (
          <button key={c.id} className={`ob-city-item ${city===c.id?"active":""}`} onClick={() => setCity(c.id)}>
            <span className="ob-city-flag">{c.flag}</span>
            <div><div className="ob-city-name">{c.name}</div><div className="ob-city-sub">{c.sub}</div></div>
            <div className={`ob-radio ${city===c.id?"filled":""}`}/>
          </button>
        ))}
      </div>
      <div className="ob-nav-row">
        <button className="ob-back" onClick={back}>Back</button>
        <button className="ob-next" disabled={!city} onClick={next}>Next →</button>
      </div>
    </div>
  );

  // STEP 2: Account
  if (step === 2) return (
    <div className="ob-root ob-step">
      <div className="ob-step-label">STEP 2 OF 5 — ACCOUNT</div>
      <h2 className="ob-step-title">Create your account</h2>
      <p className="ob-step-sub">Email and phone to verify you're real. No spam — ever.</p>
      <div className="ob-form">
        {[["Name","text","What do people call you?","name"],["Age","number","18+","age"],["Email","email","you@example.com","email"],["Phone Number","tel","+1 or +91","phone"]].map(([lbl,type,ph,key]) => (
          <div key={key} className="ob-field">
            <label className="ob-field-label">{lbl.toUpperCase()}</label>
            <input className="ob-input" type={type} placeholder={ph} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})}/>
          </div>
        ))}
      </div>
      <div className="ob-nav-row">
        <button className="ob-back" onClick={back}>Back</button>
        <button className="ob-next" disabled={!form.name||!form.email} onClick={next}>Next →</button>
      </div>
    </div>
  );

  // STEP 3: Profile
  if (step === 3) return (
    <div className="ob-root ob-step ob-step-scroll">
      <div className="ob-step-label">STEP 3 OF 5 — YOUR PROFILE</div>
      <div className="ob-progress-ring"><svg width="48" height="48"><circle cx="24" cy="24" r="20" fill="none" stroke="#e0e0e0" strokeWidth="3"/><circle cx="24" cy="24" r="20" fill="none" stroke="#2d6a2d" strokeWidth="3" strokeDasharray="125.6" strokeDashoffset="37.7" strokeLinecap="round" transform="rotate(-90 24 24)"/><text x="24" y="28" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2d6a2d">75%</text></svg></div>
      <h2 className="ob-step-title">Complete your profile</h2>
      <p className="ob-step-sub">Add a few details to help others know the real you.</p>

      {/* Section 1: Basic info */}
      <div className="ob-profile-section">
        <div className="ob-section-num">1</div>
        <div className="ob-section-content">
          <div className="ob-section-title">Basic info</div>
          <div className="ob-section-sub">This will be visible on your profile.</div>
          <div className="ob-basic-grid">
            <div className="ob-field"><label className="ob-field-label">NAME</label><input className="ob-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/></div>
            <div className="ob-field"><label className="ob-field-label">AGE</label><input className="ob-input" value={form.age} onChange={e=>setForm({...form,age:e.target.value})} placeholder="Age"/></div>
            <div className="ob-field"><label className="ob-field-label">CITY</label><input className="ob-input" value={city==="nyc"?"New York":"Mumbai"} readOnly/></div>
          </div>
        </div>
      </div>

      {/* Section 2: Prompts */}
      <div className="ob-profile-section">
        <div className="ob-section-num">2</div>
        <div className="ob-section-content">
          <div className="ob-section-title">Prompts <span className="ob-section-count">{profile.prompts.filter(p=>p.q!==null).length}/3 completed</span></div>
          <div className="ob-section-sub">Answer at least 2 prompts. The 3rd one is optional.</div>
          {profile.prompts.map((pr, idx) => (
            <div key={idx} className="ob-prompt-item">
              {pr.q ? (
                <>
                  <div className="ob-prompt-q-active">
                    {idx === 2 && <span className="ob-optional">Optional: </span>}{pr.q}
                    <button className="ob-prompt-toggle" onClick={() => setProfile(p => { const ps=[...p.prompts]; ps[idx]={q:null,a:""}; return {...p,prompts:ps}; })}>↑</button>
                  </div>
                  <textarea className="ob-textarea" rows={3} value={pr.a} onChange={e => setProfile(p => { const ps=[...p.prompts]; ps[idx]={...ps[idx],a:e.target.value}; return {...p,prompts:ps}; })} placeholder="Your answer..."/>
                  <div className="ob-char-count">{pr.a.length}/200</div>
                </>
              ) : (
                <select className="ob-select" onChange={e => { if(e.target.value) setProfile(p => { const ps=[...p.prompts]; ps[idx]={q:e.target.value,a:""}; return {...p,prompts:ps}; }); }}>
                  <option value="">{idx===2?"(Optional) Choose a prompt...":"Choose a prompt..."}</option>
                  {PROMPTS_BANK.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              )}
            </div>
          ))}
          <button className="ob-link-btn">🎲 Choose from 20 prompts</button>
        </div>
      </div>

      {/* Section 3: City wants */}
      <div className="ob-profile-section">
        <div className="ob-section-num">3</div>
        <div className="ob-section-content">
          <div className="ob-section-title">Things I want to do in the city <span className="ob-section-count">{profile.cityWants.length}/5 added</span></div>
          <div className="ob-section-sub">Add up to 5 things</div>
          <div className="ob-tags-row">{profile.cityWants.map((w,i)=><span key={i} className="ob-tag">{w}<button onClick={()=>setProfile(p=>({...p,cityWants:p.cityWants.filter((_,j)=>j!==i)}))}>×</button></span>)}</div>
          {profile.cityWants.length < 5 && <div className="ob-add-row"><input className="ob-input ob-add-input" placeholder="Add something you want to do..." value={profile.wantInput} onChange={e=>setProfile(p=>({...p,wantInput:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addWant()}/><button className="ob-add-btn" onClick={addWant}>Add</button></div>}
        </div>
      </div>

      {/* Section 4: Music & Entertainment */}
      <div className="ob-profile-section">
        <div className="ob-section-num">4</div>
        <div className="ob-section-content">
          <div className="ob-section-title">Music & entertainment</div>
          <div className="ob-section-sub">Share your taste in music and shows</div>
          <div className="ob-media-grid">
            <div>
              <div className="ob-media-label">Songs <span className="ob-section-count">{profile.songs.length}/3 added</span></div>
              {profile.songs.map((s,i)=><div key={i} className="ob-media-item"><div className="ob-media-thumb">🎵</div><div><div className="ob-media-title">{s.title}</div><div className="ob-media-artist">{s.artist}</div></div><button className="ob-remove" onClick={()=>setProfile(p=>({...p,songs:p.songs.filter((_,j)=>j!==i)}))}>×</button></div>)}
              {profile.songs.length < 3 && <div className="ob-add-row"><input className="ob-input ob-add-input" placeholder="Song · Artist" value={profile.songInput} onChange={e=>setProfile(p=>({...p,songInput:e.target.value}))} onKeyDown={e=>{if(e.key==="Enter"&&profile.songInput.trim()){const[title,...rest]=profile.songInput.split("·");setProfile(p=>({...p,songs:[...p.songs,{title:title.trim(),artist:(rest.join("·")||"").trim()}],songInput:""}))}}}/><button className="ob-add-btn" onClick={()=>{if(profile.songInput.trim()){const[title,...rest]=profile.songInput.split("·");setProfile(p=>({...p,songs:[...p.songs,{title:title.trim(),artist:(rest.join("·")||"").trim()}],songInput:""}))}}}>Add</button></div>}
            </div>
            <div>
              <div className="ob-media-label">Recommendations <span className="ob-section-count">{profile.recs.length}/3 added</span></div>
              {profile.recs.map((r,i)=><div key={i} className="ob-media-item"><div className="ob-media-thumb">🎬</div><div><div className="ob-media-title">{r.title}</div><div className="ob-media-artist">{r.type}</div></div><button className="ob-remove" onClick={()=>setProfile(p=>({...p,recs:p.recs.filter((_,j)=>j!==i)}))}>×</button></div>)}
              {profile.recs.length < 3 && <div className="ob-add-row"><input className="ob-input ob-add-input" style={{flex:1}} placeholder="Title" value={profile.recInput} onChange={e=>setProfile(p=>({...p,recInput:e.target.value}))} onKeyDown={e=>{if(e.key==="Enter"&&profile.recInput.trim()){setProfile(p=>({...p,recs:[...p.recs,{title:p.recInput.trim(),type:p.recType}],recInput:""}))}}}/><select className="ob-select-sm" value={profile.recType} onChange={e=>setProfile(p=>({...p,recType:e.target.value}))}><option>Movie</option><option>Series</option><option>Documentary</option></select><button className="ob-add-btn" onClick={()=>{if(profile.recInput.trim()){setProfile(p=>({...p,recs:[...p.recs,{title:p.recInput.trim(),type:p.recType}],recInput:""}))}}}>Add</button></div>}
            </div>
          </div>
        </div>
      </div>

      <button className="ob-save-btn" onClick={next}>Save & Continue</button>
      <p style={{textAlign:"center",fontSize:12,color:"#999",marginBottom:24}}>You can edit this later</p>
    </div>
  );

  // STEP 4: Done
  const cd = CITIES[city];
  return (
    <div className="ob-root ob-step">
      <div className="ob-done-check">✓</div>
      <h2 className="ob-done-title">You're in, {form.name||"there"}.</h2>
      <p className="ob-step-sub" style={{textAlign:"center"}}>Your personal city agent is ready. Here's your first feed.</p>
      <div className="ob-done-section">YOUR AGENT SUGGESTS</div>
      {[cd.food[0], {...cd.events[0], isEvent:true}].map((item,i) => (
        <div key={i} className="ob-done-item">
          <div className="ob-done-icon">{item.isEvent ? item.emo||"🎭" : "🍽️"}</div>
          <div><div className="ob-done-name">{item.name}</div><div className="ob-done-sub">{item.isEvent ? `${item.date} · ${item.loc}` : `${item.loc||item.tag} · matches your picks`}</div></div>
        </div>
      ))}
      <div className="ob-done-section">PEOPLE NEAR YOU</div>
      {cd.people.slice(0,1).map(p => (
        <div key={p.id} className="ob-done-item">
          <div className="ob-done-avatar" style={{background:p.color,color:p.tc}}>{p.ini}</div>
          <div><div className="ob-done-name">{p.name}, {p.age} · {p.city}</div><div className="ob-done-sub">Resonates: {p.cityWants?.slice(0,3).join(", ")}</div></div>
        </div>
      ))}
      <button className="ob-save-btn" style={{marginTop:28}} onClick={() => onDone({ city, name:form.name||"Alex", profile })}>Go to my feed →</button>
    </div>
  );
}

// ─── FOOD SCREEN ──────────────────────────────────────────────────────────────
function FoodScreen({ city }) {
  const [likes, setLikes] = useState({});
  const [activeCat, setActiveCat] = useState(null);
  const cd = CITIES[city];
  const toggleLike = id => setLikes(p => ({...p,[id]:!p[id]}));
  return (
    <div className="screen-body">
      {/* Recommended */}
      <div className="section-hdr"><div><div className="sec-title">Recommended for you</div><div className="sec-sub">Based on your taste and favorites</div></div><button className="arrow-btn">→</button></div>
      <div className="hscroll">
        {cd.food.map(r => (
          <div key={r.id} className="food-card">
            <div className="food-card-img-wrap">
              <img src={r.img} alt={r.name} className="food-card-img"/>
              <button className="heart-btn" onClick={() => toggleLike(r.id)}>{likes[r.id]?"❤️":"🤍"}</button>
              <span className="food-tag">{r.tag}</span>
            </div>
            <div className="food-card-body">
              <div className="food-name">{r.name}</div>
              <div className="food-price">{r.price}</div>
              <div className="food-rating">⭐ {r.rating}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Explore cuisine */}
      <div className="section-hdr"><div><div className="sec-title">Explore new cuisine</div><div className="sec-sub">Discover flavors from around the world</div></div><button className="arrow-btn">→</button></div>
      <div className="hscroll">
        {CUISINES.map(c => (
          <div key={c.name} className="cuisine-card">
            <img src={c.img} alt={c.name} className="cuisine-img"/>
            <div className="cuisine-overlay"><span className="cuisine-icon-lg">{c.icon}</span><span className="cuisine-name">{c.name}</span></div>
          </div>
        ))}
      </div>

      {/* Browse by category */}
      <div className="sec-title" style={{marginBottom:4}}>Browse by category</div>
      <div className="sec-sub" style={{marginBottom:14}}>Find the perfect spot for any craving</div>
      <div className="categories-wrap">
        {CATEGORIES.map(c => (
          <button key={c.name} className={`cat-btn ${activeCat===c.name?"active":""}`} onClick={()=>setActiveCat(activeCat===c.name?null:c.name)}>
            <span className="cat-icon-lg">{c.icon}</span><span className="cat-label">{c.name}</span>
          </button>
        ))}
      </div>

      {/* Top offers */}
      <div className="section-hdr" style={{marginTop:28}}><div><div className="sec-title">Top offers near you</div><div className="sec-sub">Great food at great prices</div></div><button className="arrow-btn">→</button></div>
      <div className="hscroll">
        {cd.food.slice(0,4).map((r,i) => (
          <div key={r.id} className="offer-card">
            <img src={r.img} alt={r.name} className="offer-img"/>
            <button className="heart-btn offer-heart" onClick={()=>toggleLike(`o${r.id}`)}>{likes[`o${r.id}`]?"❤️":"🤍"}</button>
            <span className="discount-pill">{["20% OFF","15% OFF","25% OFF","10% OFF"][i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EVENTS SCREEN ────────────────────────────────────────────────────────────
function EventsScreen({ city }) {
  const [likes, setLikes] = useState({});
  const cd = CITIES[city];
  const upcomingEvents = cd.events.slice(0,3);
  const popularEvents = cd.events.slice(3);
  return (
    <div className="screen-body">
      {/* Upcoming */}
      <div className="section-hdr"><div><div className="sec-title">Upcoming Events Near You</div><div className="sec-sub">Happening around your city</div></div><button className="see-all-link">See all ›</button></div>
      <div className="hscroll">
        {upcomingEvents.map(e => (
          <div key={e.id} className="event-card-big">
            <img src={e.img} alt={e.name} className="event-card-img"/>
            <button className="heart-btn ev-heart" onClick={()=>setLikes(p=>({...p,[e.id]:!p[e.id]}))}>{ likes[e.id]?"❤️":"🤍"}</button>
            {e.cat && <span className="event-cat-pill" style={{background:e.catColor}}>{e.cat}</span>}
            <div className="event-card-bottom">
              <div className="event-date-box"><div className="event-date-num">{e.date.split(" ")[0]}</div><div className="event-date-mon">{e.date.split(" ")[1]}</div></div>
              <div><div className="event-name">{e.name}</div><div className="event-loc">📍 {e.loc}</div><div className="event-time">🕐 {e.time}</div></div>
            </div>
          </div>
        ))}
      </div>

      {/* Explore by interest */}
      <div className="section-hdr"><div className="sec-title">Explore by Interest</div><button className="see-all-link">See all ›</button></div>
      <div className="hscroll interest-scroll">
        {INTERESTS.map(i => (
          <div key={i.name} className="interest-chip" style={{background:i.color}}>
            <span className="interest-icon">{i.icon}</span><span className="interest-name">{i.name}</span>
          </div>
        ))}
      </div>

      {/* Popular this week */}
      <div className="section-hdr"><div><div className="sec-title">Popular This Week</div><div className="sec-sub">Don't miss these trending events</div></div><button className="see-all-link">See all ›</button></div>
      <div className="hscroll">
        {popularEvents.map(e => (
          <div key={e.id} className="event-card-small">
            <img src={e.img} alt={e.name} className="event-card-small-img"/>
            <button className="heart-btn ev-heart-sm" onClick={()=>setLikes(p=>({...p,[`p${e.id}`]:!p[`p${e.id}`]}))}>{ likes[`p${e.id}`]?"❤️":"🤍"}</button>
            <div className="event-card-small-body">
              <div className="event-sm-name">{e.name}</div>
              <div className="event-sm-loc">📍 {e.loc}</div>
              <div className="event-sm-meta">{e.date} · {e.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA banner */}
      <div className="events-cta">
        <span className="events-cta-icon">🎁</span>
        <div><div className="events-cta-title">Events you'll love</div><div className="events-cta-sub">Discover handpicked events near you</div></div>
        <button className="events-cta-btn">Explore Now →</button>
      </div>
    </div>
  );
}

// ─── THIRD PLACES SCREEN ─────────────────────────────────────────────────────
function ThirdPlacesScreen({ city }) {
  const [activeCat, setActiveCat] = useState("All");
  const [bookmarks, setBookmarks] = useState({});
  const cd = CITIES[city];
  const filtered = activeCat === "All" ? cd.thirdPlaces : cd.thirdPlaces.filter(p => p.cat === activeCat);
  const community = cd.thirdPlaces.slice(3);

  return (
    <div className="screen-body">
      <div className="section-hdr"><div><div className="sec-title">Explore third spaces</div><div className="sec-sub">Free places to relax, connect & recharge</div></div><button className="arrow-btn">→</button></div>

      {/* Filter chips */}
      <div className="hscroll filter-scroll" style={{marginBottom:20}}>
        {THIRD_CATS.map(c => (
          <button key={c} className={`filter-chip ${activeCat===c?"active":""}`} onClick={()=>setActiveCat(c)}>
            {c === "All" && <span style={{marginRight:4}}>⊞</span>}{c}
          </button>
        ))}
      </div>

      {/* Community picks */}
      <div className="section-hdr"><div className="sec-title">Community picks near you</div><span className="by-people-badge">By people like you</span></div>
      <div className="hscroll">
        {filtered.map(p => (
          <div key={p.id} className="third-card">
            <div className="third-card-img-wrap">
              <img src={p.img} alt={p.name} className="third-card-img"/>
              <button className="bookmark-btn" onClick={()=>setBookmarks(bm=>({...bm,[p.id]:!bm[p.id]}))}>
                <span style={{fontSize:16}}>{bookmarks[p.id]?"🔖":"⬜"}</span>
              </button>
              {p.trending && <span className="trending-pill">🔥 Trending</span>}
              <span className="vibe-pill">{p.vibe}</span>
            </div>
            <div className="third-card-body">
              <div className="third-name">{p.name}</div>
              <div className="third-dist">{p.dist} away</div>
              <span className="third-cat-tag" style={{color:p.catColor,background:p.catColor+"22"}}>{p.cat}</span>
              <div className="third-visitors">👤👤 {p.visitors} people visited</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add a place CTA */}
      <div className="add-place-cta">
        <div className="add-place-illustration">📋🌿</div>
        <div><div className="add-place-title">Know a great third space?</div><div className="add-place-sub">Share it with your community and help others discover it.</div></div>
        <button className="add-place-btn">Add a place</button>
      </div>

      {/* Recently added */}
      <div className="section-hdr" style={{marginTop:8}}><div className="sec-title">Recently added by community</div><button className="arrow-btn">→</button></div>
      <div className="tp-grid">
        {community.map(p => (
          <div key={p.id} className="third-card-sm">
            <div className="third-card-sm-img-wrap">
              <img src={p.img} alt={p.name} className="third-card-sm-img"/>
              <button className="bookmark-btn-sm" onClick={()=>setBookmarks(bm=>({...bm,[`sm${p.id}`]:!bm[`sm${p.id}`]}))}>🔖</button>
              <span className="vibe-pill-sm">{p.vibe}</span>
            </div>
            <div className="third-name-sm">{p.name}</div>
            <div className="third-dist-sm">{p.dist} away</div>
            <span className="third-cat-tag-sm" style={{color:p.catColor,background:p.catColor+"22"}}>{p.cat}</span>
            <div className="third-added-by">👤 Added by {p.addedBy}</div>
          </div>
        ))}
      </div>

      {/* Why third spaces */}
      <div className="why-third">
        <div className="why-third-icon">👥</div>
        <div><div className="why-third-title">Why third spaces matter</div><div className="why-third-sub">Step out, connect, and feel better. Discover places that bring people together — for free.</div></div>
        <button className="why-third-btn">Learn more</button>
      </div>
    </div>
  );
}

// ─── DISCOVERY SCREEN (wrapper) ───────────────────────────────────────────────
function DiscoveryScreen({ city }) {
  const [subTab, setSubTab] = useState("food");
  return (
    <div className="discovery-root">
      {/* Search bar */}
      <div className="search-wrap">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <span className="search-placeholder">Start your search</span>
        </div>
      </div>
      {/* Sub tabs */}
      <div className="sub-tabs">
        {[["food","🍔","Food"],["events","🎟️","Events"],["places","🌳","Third Places"]].map(([id,icon,lbl]) => (
          <button key={id} className={`sub-tab ${subTab===id?"active":""}`} onClick={() => setSubTab(id)}>
            <span className="sub-tab-icon">{icon}</span>
            <span className="sub-tab-label">{lbl}</span>
          </button>
        ))}
      </div>
      {subTab === "food"   && <FoodScreen city={city}/>}
      {subTab === "events" && <EventsScreen city={city}/>}
      {subTab === "places" && <ThirdPlacesScreen city={city}/>}
    </div>
  );
}

// ─── CONNECTION SCREEN ────────────────────────────────────────────────────────
function ConnectionScreen({ city, hasProfile }) {
  const cd = CITIES[city];
  const [passed, setPassed] = useState([]);
  const [openProfile, setOpenProfile] = useState(null);
  const [resonateModal, setResonateModal] = useState(null);
  const [resonateText, setResonateText] = useState("");
  const [resonated, setResonated] = useState({});
  const [chatOpen, setChatOpen] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chats, setChats] = useState({});
  const [accepted, setAccepted] = useState({});

  const people = cd.people.filter(p => !passed.includes(p.id));
  const current = people[0];

  const passProfile = () => {
    if (!current) return;
    setPassed(p => [...p, current.id]);
    if (passed.length + 1 >= 5) setPassed([]);
  };

  const sendResonate = () => {
    if (!resonateModal || resonateText.trim().length < 5) return;
    const key = `${resonateModal.pid}-${resonateModal.qi}`;
    setResonated(r => ({...r, [key]: true}));
    setResonateModal(null); setResonateText("");
    setTimeout(() => setAccepted(a => ({...a, [resonateModal.pid]: true})), 1500);
  };

  const sendChat = (pid) => {
    if (!chatInput.trim()) return;
    const replies = ["That's so interesting! Hadn't thought about it that way.","Haha yes! We should do that sometime.","Same! Let's plan something.","Okay now I really want to check that out."];
    setChats(c => ({...c,[pid]:[...(c[pid]||[]),{text:chatInput,me:true}]}));
    setChatInput("");
    setTimeout(() => setChats(c => ({...c,[pid]:[...(c[pid]||[]),{text:replies[Math.floor(Math.random()*replies.length)],me:false}]})), 900);
  };

  if (!hasProfile) return (
    <div className="conn-no-profile">
      <div style={{fontSize:48,marginBottom:16}}>👤</div>
      <div className="conn-noprofile-title">Complete your profile first</div>
      <div className="conn-noprofile-sub">Your profile helps us show you to the right people. Head to Profile to get started.</div>
    </div>
  );

  if (chatOpen) {
    const p = chatOpen; const msgs = chats[p.id]||[];
    return (
      <div className="chat-root">
        <div className="chat-header"><button className="chat-back" onClick={()=>setChatOpen(null)}>←</button><div className="chat-avatar" style={{background:p.color,color:p.tc}}>{p.ini}</div><div><div className="chat-uname">{p.name}</div><div className="chat-ustatus">● Connected</div></div></div>
        <div className="chat-msgs">{msgs.length===0&&<div className="chat-empty"><div style={{fontSize:28}}>✦</div><p>Connected with {p.name} through a shared resonance. Say hello.</p></div>}{msgs.map((m,i)=><div key={i} className={`chat-bubble ${m.me?"me":""}`}>{m.text}</div>)}</div>
        <div className="chat-input-row"><input className="chat-input" value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat(p.id)} placeholder="Say something..."/><button className="chat-send" onClick={()=>sendChat(p.id)}>Send</button></div>
      </div>
    );
  }

  if (openProfile) {
    const p = openProfile;
    return (
      <div className="profile-view-root">
        <div className="pv-header"><button className="pv-back" onClick={()=>setOpenProfile(null)}>←</button><div className="pv-menu">···</div></div>
        <div className="pv-name-row"><div className="pv-name">{p.name}, {p.age}</div><div className="pv-city">{p.city}</div></div>
        <div className="pv-photos">{p.photos.map((ph,i)=><img key={i} src={ph} alt="" className="pv-photo"/>)}</div>
        <div className="pv-section-title">Prompts</div>
        {p.prompts.map((pr,qi) => {
          const key = `${p.id}-${qi}`;
          return (
            <div key={qi} className="pv-prompt-card" onClick={()=>{ if(!resonated[key]) { setResonateModal({pid:p.id,qi,text:pr.a}); setResonateText(""); } }}>
              <div className="pv-prompt-q">{pr.q}</div>
              <div className="pv-prompt-a">{pr.a}</div>
              {resonated[key] && <div className="pv-resonated">💬 Resonated</div>}
              {!resonated[key] && <div className="pv-comment-count">💬 Tap to resonate</div>}
            </div>
          );
        })}
        <div className="pv-section-title">Things I want to do in the city</div>
        <div className="pv-tags">{p.cityWants.map(w=><span key={w} className="pv-tag">{w}</span>)}</div>
        <div className="pv-section-title">Music & entertainment</div>
        <div className="pv-media-grid">
          <div><div className="pv-media-label">Songs</div>{p.songs.map((s,i)=><div key={i} className="pv-media-row"><div className="pv-media-thumb">🎵</div><div><div className="pv-media-title">{s.title}</div><div className="pv-media-artist">{s.artist}</div></div></div>)}</div>
          <div><div className="pv-media-label">Recommendations</div>{p.recs.map((r,i)=><div key={i} className="pv-media-row"><div className="pv-media-thumb">🎬</div><div><div className="pv-media-title">{r.title}</div><div className="pv-media-artist">{r.type}</div></div></div>)}</div>
        </div>
        {accepted[p.id] && <button className="pv-chat-btn" onClick={()=>{setOpenProfile(null);setChatOpen(p);}}>Chat with {p.name} →</button>}
      </div>
    );
  }

  return (
    <div className="conn-root">
      {current ? (
        <div className="conn-card-area">
          <div className="conn-card">
            <div className="conn-card-img-wrap">
              <img src={current.photos[0]} alt={current.name} className="conn-card-img"/>
              <div className="conn-card-info"><div className="conn-card-name">{current.name}, {current.age}</div><div className="conn-card-city">{current.city}</div></div>
              <div className="conn-card-dots"><span className="dot active"/><span className="dot"/><span className="dot"/></div>
            </div>
            <div className="conn-card-tap" onClick={()=>setOpenProfile(current)}>Tap to view the profile</div>
          </div>
          <div className="conn-prompts-panel">
            {current.prompts.slice(0,2).map((pr,qi) => {
              const key = `${current.id}-${qi}`;
              return (
                <div key={qi} className="conn-prompt-card" onClick={()=>{ if(!resonated[key]){setResonateModal({pid:current.id,qi,text:pr.a});setResonateText("");} }}>
                  <div className="conn-prompt-q">{pr.q}</div>
                  <div className="conn-prompt-a">{pr.a}</div>
                  {resonated[key] ? <div className="conn-resonated">✓ Resonated</div> : <div className="conn-tap">💬 {0}</div>}
                </div>
              );
            })}
            {accepted[current.id] && <button className="conn-chat-btn" onClick={()=>setChatOpen(current)}>Chat with {current.name} →</button>}
            <button className="conn-pass-btn" onClick={passProfile}>Pass ›</button>
          </div>
        </div>
      ) : (
        <div className="conn-empty"><div style={{fontSize:42}}>🎉</div><div className="conn-empty-title">You're all caught up!</div><div className="conn-empty-sub">Check back later for new profiles.</div></div>
      )}
      {resonateModal && (
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
      <div className="profile-header-row">
        <div className="profile-title">Complete your profile</div>
        <div className="profile-progress"><svg width="44" height="44"><circle cx="22" cy="22" r="18" fill="none" stroke="#e0e0e0" strokeWidth="3"/><circle cx="22" cy="22" r="18" fill="none" stroke="#2d6a2d" strokeWidth="3" strokeDasharray="113" strokeDashoffset="28" strokeLinecap="round" transform="rotate(-90 22 22)"/><text x="22" y="26" textAnchor="middle" fontSize="10" fontWeight="700" fill="#2d6a2d">75%</text></svg></div>
      </div>
      <div className="profile-header-sub">Add a few details to help others know the real you.</div>

      {/* Section 1: Basic info */}
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

      {/* Section 2: Photos */}
      <div className="profile-section">
        <div className="profile-sec-num">2</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Personal photos <span className="profile-sec-count">3/3 photos added</span></div>
          <div className="profile-sec-sub">Add 3 photos to help others recognize you.</div>
          <div className="photos-grid">
            {[1,2,3].map(i=><div key={i} className="photo-slot"><div className="photo-num">{i}</div><div className="photo-placeholder">📷</div><div className="photo-remove">×</div></div>)}
            <div className="photo-add">📷<br/>Add Photo</div>
          </div>
        </div>
      </div>

      {/* Section 3: Prompts */}
      <div className="profile-section">
        <div className="profile-sec-num">3</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Prompts <span className="profile-sec-count">2/3 completed</span></div>
          <div className="profile-sec-sub">Answer at least 2 prompts. The 3rd one is optional.</div>
          {cd.people[0].prompts.map((pr,i) => (
            <div key={i} className="profile-prompt-item">
              <div className="profile-prompt-q">{i===2&&<span className="ob-optional">Optional: </span>}{pr.q}</div>
              <div className="profile-prompt-a">{pr.a}</div>
              <div className="profile-prompt-count">{pr.a.length}/200</div>
            </div>
          ))}
          <button className="ob-link-btn">🎲 Choose from 20 prompts</button>
        </div>
      </div>

      {/* Section 4: City wants */}
      <div className="profile-section">
        <div className="profile-sec-num">4</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Things I want to do in the city <span className="profile-sec-count">5/5 added</span></div>
          <div className="ob-section-sub">Add up to 5 things</div>
          <div className="ob-tags-row">{cd.people[0].cityWants.map((w,i)=><span key={i} className="ob-tag">{w}<button>×</button></span>)}</div>
        </div>
      </div>

      {/* Section 5: Music */}
      <div className="profile-section">
        <div className="profile-sec-num">5</div>
        <div className="profile-sec-body">
          <div className="profile-sec-title">Music & entertainment</div>
          <div className="profile-sec-sub">Share your taste in music and shows</div>
          <div className="ob-media-grid">
            <div>
              <div className="ob-media-label">Songs <span className="ob-section-count">3/3 added</span></div>
              {cd.people[0].songs.map((s,i)=><div key={i} className="ob-media-item"><div className="ob-media-thumb">🎵</div><div><div className="ob-media-title">{s.title}</div><div className="ob-media-artist">{s.artist}</div></div><span>×</span></div>)}
            </div>
            <div>
              <div className="ob-media-label">Recommendations <span className="ob-section-count">3/3 added</span></div>
              {cd.people[0].recs.map((r,i)=><div key={i} className="ob-media-item"><div className="ob-media-thumb">🎬</div><div><div className="ob-media-title">{r.title}</div><div className="ob-media-artist">{r.type}</div></div><span>×</span></div>)}
            </div>
          </div>
        </div>
      </div>

      <button className="ob-save-btn">Save & Continue</button>
      <p style={{textAlign:"center",fontSize:12,color:"#999",marginBottom:16}}>You can edit this later</p>
      <button className="profile-signout" onClick={onSignOut}>Sign Out</button>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("discovery");

  if (!user) return <Onboarding onDone={(u) => { setUser(u); setTab("discovery"); }}/>;

  const hasProfile = true;

  return (
    <div className="app-root">
      {/* Top header */}
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

      {/* Main content */}
      <main className="site-main">
        {tab === "discovery"  && <DiscoveryScreen city={user.city}/>}
        {tab === "connection" && <ConnectionScreen city={user.city} hasProfile={hasProfile}/>}
        {tab === "profile"    && <ProfileScreen user={user} onSignOut={()=>setUser(null)}/>}
      </main>
    </div>
  );
}