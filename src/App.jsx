import { useState } from "react";
import "./App.css";

// ── DATA ────────────────────────────────────────────────────────────────────

const RECOMMENDED = [
  {
    id: 1,
    name: "Olive Bistro",
    price: "₹1,500 for two",
    rating: 4.7,
    tag: "High rated",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
  },
  {
    id: 2,
    name: "Sakura Sushi",
    price: "₹1,200 for two",
    rating: 4.6,
    tag: "Near you",
    img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80",
  },
  {
    id: 3,
    name: "La Pizzeria",
    price: "₹1,000 for two",
    rating: 4.5,
    tag: "Best for dinner",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
  },
  {
    id: 4,
    name: "The Curry Leaf",
    price: "₹800 for two",
    rating: 4.8,
    tag: "Hidden gem",
    img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
  },
];

const CUISINES = [
  {
    id: 1,
    name: "Italian",
    img: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=300&q=80",
    icon: "🏛️",
  },
  {
    id: 2,
    name: "Indian",
    img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&q=80",
    icon: "🕌",
  },
  {
    id: 3,
    name: "Asian",
    img: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=300&q=80",
    icon: "🏯",
  },
  {
    id: 4,
    name: "Mexican",
    img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&q=80",
    icon: "🏟️",
  },
  {
    id: 5,
    name: "Japanese",
    img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&q=80",
    icon: "⛩️",
  },
];

const CATEGORIES = [
  { id: 1, name: "Fine Dining", icon: "🍽️" },
  { id: 2, name: "Buffet", icon: "🥘" },
  { id: 3, name: "Desserts", icon: "🍰" },
  { id: 4, name: "Cafes", icon: "☕" },
  { id: 5, name: "Pizza", icon: "🍕" },
  { id: 6, name: "Bars", icon: "🍸" },
  { id: 7, name: "Burgers", icon: "🍔" },
  { id: 8, name: "Sushi", icon: "🍱" },
];

const OFFERS = [
  {
    id: 1,
    name: "Steak House",
    discount: "20% OFF",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
    discountColor: "#2d6a4f",
  },
  {
    id: 2,
    name: "The Grand Dining",
    discount: "15% OFF",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    discountColor: "#2d6a4f",
  },
  {
    id: 3,
    name: "Dessert Palace",
    discount: "25% OFF",
    img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
    discountColor: "#2d6a4f",
  },
];

const EVENTS_DATA = [
  {
    id: 1,
    name: "Jazz Night at Nowadays",
    date: "Sat May 31",
    loc: "Ridgewood, Queens",
    badge: "Free entry",
    emo: "🎷",
    host: "Marcus T.",
    going: 34,
  },
  {
    id: 2,
    name: "Sunrise Run Club",
    date: "Sun Jun 1",
    loc: "Prospect Park, BK",
    badge: "Outdoors",
    emo: "🏃",
    host: "Priya K.",
    going: 12,
  },
  {
    id: 3,
    name: "Dumpling Making Class",
    date: "Sat May 31",
    loc: "Flushing, Queens",
    badge: "Paid · ₹800",
    emo: "🥟",
    host: "Chef Lin",
    going: 8,
  },
  {
    id: 4,
    name: "Brooklyn Night Bazaar",
    date: "Fri May 30",
    loc: "Greenpoint, BK",
    badge: "Free",
    emo: "🛍️",
    host: "BK Collective",
    going: 210,
  },
];

const PEOPLE_DATA = [
  {
    id: 1,
    name: "Priya",
    age: 26,
    hood: "Astoria, Queens",
    ini: "P",
    color: "#e8f5e9",
    textColor: "#2d6a4f",
    interests: ["Football", "Books", "Cooking"],
    prompts: [
      {
        q: "What recent incident changed your perspective?",
        a: "Watching a documentary on fishermen in Kerala made me slow down and think about how much I take convenience for granted.",
      },
      {
        q: "If you were mayor for a day, what would you change?",
        a: "I would make the subway free before 8am and after 9pm. The people who need it most often travel at those hours.",
      },
    ],
    cityWant: "Watch a new film at an indie cinema — any genre, just no superhero movies",
    music: "Arooj Aftab — Vulture Prince",
    film: "All We Imagine as Light",
  },
  {
    id: 2,
    name: "Marcus",
    age: 29,
    hood: "Crown Heights, BK",
    ini: "M",
    color: "#e3f2fd",
    textColor: "#1565c0",
    interests: ["Jazz", "Urban history", "Running"],
    prompts: [
      {
        q: "What's something you've been curious about recently?",
        a: "Why every city seems to have a jazz moment and then loses it. I keep wondering what kills that culture.",
      },
      {
        q: "What myth would you change society's view on?",
        a: "That gentrification is inevitable. It is not a weather pattern. It is a series of policy choices.",
      },
    ],
    cityWant: "Proper sunset walk across the Brooklyn Bridge — lived here 4 years, never done it",
    music: "Thelonious Monk — Monk's Dream",
    film: "MLK/FBI",
  },
  {
    id: 3,
    name: "Sofia",
    age: 24,
    hood: "Williamsburg, BK",
    ini: "S",
    color: "#fce4ec",
    textColor: "#c62828",
    interests: ["Architecture", "Street food", "Photography"],
    prompts: [
      {
        q: "What's something you've been curious about recently?",
        a: "Why the best street food is always near a market. I have started testing this theory in every city I visit.",
      },
      {
        q: "What school activity do you still miss?",
        a: "Art class, especially sitting beside someone doing something different while both of you quietly made things.",
      },
    ],
    cityWant: "Find the best banh mi in the five boroughs — methodically, with a notebook",
    music: "Caroline Polachek — Desire, I Want to Turn Into You",
    film: "The Taste of Things",
  },
];

// ── ICONS ────────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function HeartIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#e53e3e" : "none"} stroke={filled ? "#e53e3e" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function DiscoverIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#e53e3e" : "#aaa"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function ConnectIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#e53e3e" : "#aaa"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function ProfileIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#e53e3e" : "#aaa"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="#f6ad55" stroke="#f6ad55" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// ── SERVICES DATA & SCREEN ───────────────────────────────────────────────────

const SERVICES_DATA = [
  { id: 1, name: "Private Chef", icon: "👨‍🍳", desc: "Book a personal chef for dinners, parties, or meal prep at home.", price: "From ₹2,500", badge: "Popular", badgeType: "green" },
  { id: 2, name: "Food Photography", icon: "📸", desc: "Professional food & restaurant photography for menus and social media.", price: "From ₹3,000", badge: "New", badgeType: "blue" },
  { id: 3, name: "Catering", icon: "🍱", desc: "Full-service catering for corporate events, weddings, and gatherings.", price: "From ₹500/head", badge: "Popular", badgeType: "green" },
  { id: 4, name: "Cooking Classes", icon: "🧑‍🍳", desc: "Learn to cook a new cuisine with expert chefs. Group & private sessions.", price: "From ₹800", badge: "", badgeType: "" },
  { id: 5, name: "Restaurant Consulting", icon: "📊", desc: "Menu design, pricing strategy, and operational advice for restaurant owners.", price: "From ₹5,000", badge: "B2B", badgeType: "purple" },
  { id: 6, name: "Event Space Booking", icon: "🏛️", desc: "Find and book unique dining venues for private events and celebrations.", price: "From ₹8,000", badge: "New", badgeType: "blue" },
];

function ServicesContent() {
  return (
    <section className="section" style={{ marginTop: 32 }}>
      <div className="section-header">
        <div>
          <div className="section-title">Services near you</div>
          <div className="section-sub">Food-related services from trusted local professionals</div>
        </div>
      </div>
      <div className="services-grid">
        {SERVICES_DATA.map((s) => (
          <div className="service-card" key={s.id}>
            <div className="service-icon">{s.icon}</div>
            <div className="service-body">
              <div className="service-header-row">
                <div className="service-name">{s.name}</div>
                {s.badge && (
                  <span className={`service-badge service-badge--${s.badgeType}`}>{s.badge}</span>
                )}
              </div>
              <div className="service-desc">{s.desc}</div>
              <div className="service-price">{s.price}</div>
              <button className="service-btn">Book now →</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── FOOD SCREEN ──────────────────────────────────────────────────────────────

function FoodScreen() {
  const [likes, setLikes] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [subTab, setSubTab] = useState("food");

  function toggleLike(id) {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const SUBTABS = [
    { id: "food",     label: "Food",     icon: "🍔" },
    { id: "events",   label: "Events",   icon: "🎟️" },
    { id: "services", label: "Services", icon: "🔔", badge: "NEW" },
  ];

  return (
    <div className="food-screen">
      {/* Search bar */}
      <div className="search-bar-wrap">
        <div className="search-bar">
          <SearchIcon />
          <span className="search-placeholder">Start your search</span>
        </div>
      </div>

      {/* Sub-tabs — Food / Events / Services */}
      <div className="main-tabs">
        {SUBTABS.map((t) => (
          <button
            key={t.id}
            className={`main-tab ${subTab === t.id ? "main-tab--active" : ""}`}
            onClick={() => setSubTab(t.id)}
          >
            <span className="main-tab-icon">{t.icon}</span>
            <span className="main-tab-label">{t.label}</span>
            {t.badge && <span className="new-badge">{t.badge}</span>}
          </button>
        ))}
      </div>

      {/* ── EVENTS tab ── */}
      {subTab === "events" && (
        <div style={{ paddingTop: 32 }}>
          <div className="section-header">
            <div>
              <div className="section-title">Events near you</div>
              <div className="section-sub">What's happening in your city this week</div>
            </div>
          </div>
          <div className="ev-list">
            {EVENTS_DATA.map((e) => {
              const l = e.badge.toLowerCase();
              const cls = l.includes("free") ? "ev-badge ev-badge--green"
                : l.includes("paid") ? "ev-badge ev-badge--amber"
                : l.includes("outdoor") ? "ev-badge ev-badge--blue"
                : "ev-badge ev-badge--gray";
              return (
                <div className="ev-item" key={e.id}>
                  <div className="ev-icon-box">{e.emo}</div>
                  <div className="ev-details">
                    <div className="ev-name">{e.name}</div>
                    <div className="ev-meta">{e.date} · {e.loc}</div>
                    <div className="ev-footer">
                      <span className="ev-host">by {e.host} · {e.going} going</span>
                      <span className={cls}>{e.badge}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <button className="create-ev-btn">+ Create an event</button>
          </div>
        </div>
      )}

      {/* ── SERVICES tab ── */}
      {subTab === "services" && <ServicesContent />}

      {/* ── FOOD tab ── */}
      {subTab === "food" && (
        <>
          {/* Recommended */}
          <section className="section">
            <div className="section-header">
              <div>
                <div className="section-title">Recommended for you</div>
                <div className="section-sub">Based on your taste and favorites</div>
              </div>
              <button className="see-all-btn" aria-label="See all recommended">
                <ArrowRight />
              </button>
            </div>
            <div className="horiz-scroll">
              {RECOMMENDED.map((r) => (
                <div className="rec-card" key={r.id}>
                  <div className="rec-img-wrap">
                    <img src={r.img} alt={r.name} className="rec-img" loading="lazy" />
                    <button
                      className="heart-btn"
                      onClick={() => toggleLike(r.id)}
                      aria-label={`Like ${r.name}`}
                    >
                      <HeartIcon filled={!!likes[r.id]} />
                    </button>
                    <span className="rec-tag">{r.tag}</span>
                  </div>
                  <div className="rec-info">
                    <div className="rec-name">{r.name}</div>
                    <div className="rec-price">{r.price}</div>
                    <div className="rec-rating">
                      <StarIcon />
                      <span>{r.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Explore cuisine */}
          <section className="section">
            <div className="section-header">
              <div>
                <div className="section-title">Explore new cuisine</div>
                <div className="section-sub">Discover flavors from around the world</div>
              </div>
              <button className="see-all-btn" aria-label="See all cuisines">
                <ArrowRight />
              </button>
            </div>
            <div className="horiz-scroll">
              {CUISINES.map((c) => (
                <div className="cuisine-card" key={c.id}>
                  <img src={c.img} alt={c.name} className="cuisine-img" loading="lazy" />
                  <div className="cuisine-overlay">
                    <span className="cuisine-icon">{c.icon}</span>
                    <span className="cuisine-name">{c.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Browse by category */}
          <section className="section">
            <div className="section-title" style={{ marginBottom: 4 }}>Browse by category</div>
            <div className="section-sub" style={{ marginBottom: 14 }}>Find the perfect spot for any craving</div>
            <div className="categories-grid">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`cat-btn ${activeCategory === cat.id ? "cat-btn--active" : ""}`}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <span className="cat-name">{cat.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Top offers */}
          <section className="section section--last">
            <div className="section-header">
              <div>
                <div className="section-title">Top offers near you</div>
                <div className="section-sub">Great food at great prices</div>
              </div>
              <button className="see-all-btn" aria-label="See all offers">
                <ArrowRight />
              </button>
            </div>
            <div className="horiz-scroll">
              {OFFERS.map((o) => (
                <div className="offer-card" key={o.id}>
                  <div className="offer-img-wrap">
                    <img src={o.img} alt={o.name} className="offer-img" loading="lazy" />
                    <button
                      className="heart-btn"
                      onClick={() => toggleLike(`offer-${o.id}`)}
                      aria-label={`Like ${o.name}`}
                    >
                      <HeartIcon filled={!!likes[`offer-${o.id}`]} />
                    </button>
                    <span className="discount-badge" style={{ background: o.discountColor }}>
                      {o.discount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

// ── EVENTS SCREEN ────────────────────────────────────────────────────────────

function EventsScreen() {
  function badgeCls(b) {
    const l = b.toLowerCase();
    if (l.includes("free")) return "ev-badge ev-badge--green";
    if (l.includes("paid")) return "ev-badge ev-badge--amber";
    if (l.includes("outdoor")) return "ev-badge ev-badge--blue";
    return "ev-badge ev-badge--gray";
  }

  return (
    <div className="generic-screen">
      <div className="generic-header">
        <h1 className="generic-title">Events near you</h1>
        <p className="generic-sub">What's happening in your city this week</p>
      </div>
      <div className="ev-list">
        {EVENTS_DATA.map((e) => (
          <div className="ev-item" key={e.id}>
            <div className="ev-icon-box">{e.emo}</div>
            <div className="ev-details">
              <div className="ev-name">{e.name}</div>
              <div className="ev-meta">{e.date} · {e.loc}</div>
              <div className="ev-footer">
                <span className="ev-host">by {e.host} · {e.going} going</span>
                <span className={badgeCls(e.badge)}>{e.badge}</span>
              </div>
            </div>
          </div>
        ))}
        <button className="create-ev-btn">+ Create an event</button>
      </div>
    </div>
  );
}

// ── CONNECT / PROFILE SCREEN ─────────────────────────────────────────────────

function ConnectScreen() {
  const [resonances, setResonances] = useState([]);
  const [modal, setModal] = useState(null);
  const [modalTxt, setModalTxt] = useState("");
  const [chats, setChats] = useState({});
  const [openChat, setOpenChat] = useState(null);
  const [chatInput, setChatInput] = useState("");

  function openResonate(person, qi) {
    if (resonances.some((r) => r.pid === person.id && r.qi === qi)) return;
    setModal({ person, qi });
    setModalTxt("");
  }

  function sendRes() {
    if (!modal || modalTxt.trim().length < 10) return;
    setResonances((prev) => [...prev, { pid: modal.person.id, qi: modal.qi, accepted: false }]);
    setModal(null);
    setTimeout(() => {
      setResonances((prev) =>
        prev.map((r) =>
          r.pid === modal.person.id && r.qi === modal.qi ? { ...r, accepted: true } : r
        )
      );
    }, 1600);
  }

  function sendChat(pid) {
    if (!chatInput.trim()) return;
    const replies = [
      "That's so interesting, I never thought about it that way!",
      "Haha yes! We should definitely do that sometime.",
      "Okay now I really want to check that place out.",
      "Same! Let's plan something.",
    ];
    setChats((prev) => ({
      ...prev,
      [pid]: [...(prev[pid] || []), { text: chatInput, me: true }],
    }));
    setChatInput("");
    setTimeout(() => {
      setChats((prev) => ({
        ...prev,
        [pid]: [...(prev[pid] || []), { text: replies[Math.floor(Math.random() * replies.length)], me: false }],
      }));
    }, 900 + Math.random() * 400);
  }

  if (openChat) {
    const p = openChat;
    const msgs = chats[p.id] || [];
    return (
      <div className="chat-screen">
        <div className="chat-topbar">
          <button className="back-btn" onClick={() => setOpenChat(null)}>←</button>
          <div className="chat-avatar" style={{ background: p.color, color: p.textColor }}>{p.ini}</div>
          <div>
            <div className="chat-name">{p.name}</div>
            <div className="chat-status">● Connected</div>
          </div>
        </div>
        <div className="chat-messages">
          {msgs.length === 0 && (
            <div className="chat-empty">
              <div style={{ fontSize: 32, marginBottom: 8 }}>✦</div>
              <p>You connected with {p.name}.</p>
              <p style={{ marginTop: 4, opacity: 0.6 }}>Say hello.</p>
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.me ? "chat-bubble--me" : ""}`}>{m.text}</div>
          ))}
        </div>
        <div className="chat-input-row">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendChat(p.id)}
            placeholder="Say something..."
            className="chat-input"
          />
          <button onClick={() => sendChat(p.id)} className="chat-send">Send</button>
        </div>
      </div>
    );
  }

  return (
    <div className="generic-screen">
      <div className="generic-header">
        <h1 className="generic-title">People exploring NYC</h1>
        <p className="generic-sub">Tap a quote to resonate. No swiping.</p>
      </div>
      <div className="people-list">
        {PEOPLE_DATA.map((p) => {
          const rc = resonances.filter((r) => r.pid === p.id).length;
          const accepted = resonances.some((r) => r.pid === p.id && r.accepted);
          return (
            <div className="person-card" key={p.id}>
              <div className="person-header">
                <div className="person-avatar" style={{ background: p.color, color: p.textColor }}>{p.ini}</div>
                <div>
                  <div className="person-name">{p.name}, {p.age}</div>
                  <div className="person-hood">📍 {p.hood}</div>
                </div>
              </div>
              <div className="interest-row">
                {p.interests.map((i) => <span key={i} className="interest-chip">{i}</span>)}
              </div>
              <div className="quote-card" onClick={() => openResonate(p, 0)}>
                <div className="quote-q">{p.prompts[0].q}</div>
                <div className="quote-a">"{p.prompts[0].a}"</div>
                {resonances.some((r) => r.pid === p.id && r.qi === 0) && (
                  <div className="res-sent">✓ Resonance sent</div>
                )}
              </div>
              <div className="city-want">
                <div className="city-want-label">Wants to do in NYC</div>
                <div className="city-want-text">"{p.cityWant}"</div>
              </div>
              {rc > 0 && (
                <div className="resonance-count">✓ You resonated with {rc} thing{rc > 1 ? "s" : ""}</div>
              )}
              {accepted && (
                <button className="open-chat-btn" onClick={() => setOpenChat(p)}>
                  Chat with {p.name} →
                </button>
              )}
            </div>
          );
        })}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-label">Resonating with {modal.person.name}</div>
            <div className="modal-quote">"{modal.person.prompts[modal.qi].a}"</div>
            <textarea
              className="modal-textarea"
              rows={3}
              placeholder="What resonated with you? Be specific..."
              maxLength={240}
              value={modalTxt}
              onChange={(e) => setModalTxt(e.target.value)}
            />
            <div className="modal-footer">
              <span className="modal-count">{modalTxt.length} / 240</span>
              <button
                className="modal-send-btn"
                disabled={modalTxt.trim().length < 10}
                onClick={sendRes}
              >
                Send Resonance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PROFILE SCREEN ────────────────────────────────────────────────────────────

function ProfileScreen() {
  return (
    <div className="generic-screen">
      <div className="profile-page-hero">
        <div className="profile-page-avatar">AK</div>
        <div className="profile-page-name">Alex Kumar</div>
        <div className="profile-page-sub">NYC · Member since 2025</div>
      </div>
      <div className="profile-stats">
        {[["12", "Places visited"], ["5", "Events attended"], ["3", "Connections"]].map(([val, lbl]) => (
          <div key={lbl} className="profile-stat">
            <div className="profile-stat-val">{val}</div>
            <div className="profile-stat-lbl">{lbl}</div>
          </div>
        ))}
      </div>
      <div className="profile-section">
        {["Edit Profile", "My Favorites", "My Events", "Notifications", "Privacy Settings", "Help & Support", "Sign Out"].map((item) => (
          <div key={item} className="profile-row">
            <span>{item}</span>
            <ArrowRight />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState("discovery");

  return (
    <div className="site-root">
      {/* ── TOP NAVBAR ── */}
      <header className="topnav">
        <div className="topnav-inner">
          <div className="topnav-logo">
            near<span>met</span>
          </div>

          <nav className="topnav-links">
            <button
              className={`topnav-link ${activeTab === "discovery" ? "topnav-link--active" : ""}`}
              onClick={() => setActiveTab("discovery")}
            >
              <DiscoverIcon active={activeTab === "discovery"} />
              Discovery
            </button>
            <button
              className={`topnav-link ${activeTab === "events" ? "topnav-link--active" : ""}`}
              onClick={() => setActiveTab("events")}
            >
              <span className="topnav-link-icon">🎭</span>
              Events
            </button>
            <button
              className={`topnav-link ${activeTab === "connection" ? "topnav-link--active" : ""}`}
              onClick={() => setActiveTab("connection")}
            >
              <ConnectIcon active={activeTab === "connection"} />
              Connection
            </button>
            <button
              className={`topnav-link ${activeTab === "profile" ? "topnav-link--active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <ProfileIcon active={activeTab === "profile"} />
              Profile
            </button>
          </nav>

          <div className="topnav-right">
            <span className="city-chip">📍 NYC</span>
            <div className="user-avatar">AK</div>
          </div>
        </div>
      </header>

      {/* ── PAGE CONTENT ── */}
      <main className="site-main">
        {activeTab === "discovery" && <FoodScreen />}
        {activeTab === "events" && <EventsScreen />}
        {activeTab === "connection" && <ConnectScreen />}
        {activeTab === "profile" && <ProfileScreen />}
      </main>
    </div>
  );
}
