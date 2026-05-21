import { useState } from "react";

const FOOD_DATA = [
  {
    id: 1,
    name: "Bunna Cafe",
    type: "Ethiopian",
    neighborhood: "Bushwick",
    badge: "Hidden gem",
    emoji: "🇪🇹",
    price: "$$",
    rating: 4.8,
    searches: 47,
    trending: "+34%",
    menu: ["Injera platter", "Tibs", "Shiro", "Kitfo", "Tej honey wine"],
  },
  {
    id: 2,
    name: "Xi'an Famous Foods",
    type: "Chinese",
    neighborhood: "Flushing",
    badge: "Affordable",
    emoji: "🍜",
    price: "$",
    rating: 4.7,
    searches: 134,
    trending: "+12%",
    menu: [
      "Spicy cumin lamb noodles",
      "Liang pi cold skin noodles",
      "Stewed pork burger",
      "Hot & sour soup dumplings",
    ],
  },
  {
    id: 3,
    name: "Abraço Espresso",
    type: "Cafe",
    neighborhood: "East Village",
    badge: "Beloved local",
    emoji: "☕",
    price: "$",
    rating: 4.9,
    searches: 89,
    trending: "+8%",
    menu: ["Espresso", "Cortado", "Seasonal pastry", "Olive oil cake"],
  },
  {
    id: 4,
    name: "Tortilleria Nixtamal",
    type: "Mexican",
    neighborhood: "Corona, Queens",
    badge: "Hidden gem",
    emoji: "🌮",
    price: "$",
    rating: 4.8,
    searches: 62,
    trending: "+22%",
    menu: ["Handmade tortillas", "Tamales", "Mole verde", "Horchata"],
  },
  {
    id: 5,
    name: "Superiority Burger",
    type: "Vegetarian",
    neighborhood: "East Village",
    badge: "Trending",
    emoji: "🌿",
    price: "$",
    rating: 4.6,
    searches: 78,
    trending: "+41%",
    menu: ["Superiority burger", "Sloppy Dave", "Greek salad", "Butterscotch pudding"],
  },
  {
    id: 6,
    name: "Saravana Bhavan",
    type: "Indian",
    neighborhood: "Murray Hill",
    badge: "Family fav",
    emoji: "🍛",
    price: "$$",
    rating: 4.7,
    searches: 103,
    trending: "+15%",
    menu: ["Masala dosa", "Idli sambar", "Thali", "Filter coffee", "Pongal"],
  },
];

const EVENTS_DATA = [
  {
    id: 1,
    name: "Jazz Night at Nowadays",
    date: "Sat May 24",
    location: "Ridgewood, Queens",
    badge: "Free entry",
    emoji: "🎷",
    host: "Marcus T.",
    attendees: 34,
  },
  {
    id: 2,
    name: "Sunrise Run Club",
    date: "Sun May 25",
    location: "Prospect Park, BK",
    badge: "Outdoors",
    emoji: "🏃",
    host: "Priya K.",
    attendees: 12,
  },
  {
    id: 3,
    name: "Dumpling Making Class",
    date: "Sat May 24",
    location: "Flushing, Queens",
    badge: "Paid · $25",
    emoji: "🥟",
    host: "Chef Lin",
    attendees: 8,
  },
  {
    id: 4,
    name: "Brooklyn Night Bazaar",
    date: "Fri May 23",
    location: "Greenpoint, BK",
    badge: "Free",
    emoji: "🛍️",
    host: "BK Collective",
    attendees: 210,
  },
];

const TRAVEL_DATA = [
  {
    id: 1,
    emoji: "🌉",
    name: "DUMBO",
    neighborhood: "Brooklyn",
    badge: "TikTok famous",
  },
  {
    id: 2,
    emoji: "🏝️",
    name: "Little Island",
    neighborhood: "Hudson River",
    badge: "Hidden gem",
  },
  {
    id: 3,
    emoji: "🏛️",
    name: "The Met Cloisters",
    neighborhood: "Washington Heights",
    badge: "Underrated",
  },
  {
    id: 4,
    emoji: "🌿",
    name: "Inwood Hill Park",
    neighborhood: "Inwood",
    badge: "Hidden gem",
  },
  {
    id: 5,
    emoji: "🏚️",
    name: "Smallpox Hospital",
    neighborhood: "Roosevelt Island",
    badge: "Hidden gem",
  },
  {
    id: 6,
    emoji: "🎨",
    name: "5Pointz Site",
    neighborhood: "LIC, Queens",
    badge: "Cultural",
  },
];

const CONNECTIONS_DATA = [
  {
    id: 1,
    name: "Priya",
    age: 26,
    neighborhood: "Astoria, Queens",
    initials: "P",
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
    cityWant: "Go watch a new film at a cinema — any genre, just no superhero movies",
    music: "Arooj Aftab — Vulture Prince",
    film: "All We Imagine as Light",
  },
  {
    id: 2,
    name: "Marcus",
    age: 29,
    neighborhood: "Crown Heights, BK",
    initials: "M",
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
    neighborhood: "Williamsburg, BK",
    initials: "S",
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

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

      :root {
        --bg: #F7F5F0;
        --bg2: #EDEAE3;
        --bg3: #E2DED5;
        --card: #FFFFFF;
        --text: #1A1814;
        --text2: #6B6560;
        --text3: #9B9590;
        --accent: #2D6A4F;
        --accent2: #40916C;
        --accent-bg: #D8F3DC;
        --amber: #E67E22;
        --amber-bg: #FEF3E2;
        --coral: #C0392B;
        --coral-bg: #FDEDEC;
        --purple: #6C3483;
        --purple-bg: #F4ECF7;
        --border: rgba(26,24,20,0.1);
        --border2: rgba(26,24,20,0.07);
        --shadow: 0 1px 3px rgba(26,24,20,0.08), 0 4px 12px rgba(26,24,20,0.04);
        --shadow2: 0 10px 32px rgba(26,24,20,0.14);
      }

      * {
        box-sizing: border-box;
      }

      html,
      body,
      #root {
        margin: 0 !important;
        width: 100% !important;
        max-width: none !important;
        min-height: 100% !important;
        background: #f1eee7 !important;
        border: none !important;
        text-align: initial !important;
      }

      body {
        font-family: "DM Sans", system-ui, sans-serif;
        overflow-x: hidden;
      }

      button,
      input,
      textarea {
        font-family: inherit;
      }

      button {
        cursor: pointer;
      }

      .app-page {
        min-height: 100vh;
        width: 100%;
        background:
          radial-gradient(circle at top left, rgba(216, 243, 220, 0.55), transparent 34%),
          radial-gradient(circle at top right, rgba(244, 236, 247, 0.5), transparent 34%),
          #f1eee7;
        display: flex;
        justify-content: center;
      }

      .app-shell {
        width: min(100%, 1380px);
        min-height: 100vh;
        margin: 0 auto;
        background: var(--bg);
        color: var(--text);
        position: relative;
        overflow: visible;
        border-left: 1px solid var(--border);
        border-right: 1px solid var(--border);
        box-shadow: 0 0 55px rgba(26,24,20,0.08);
      }

      .topbar {
        height: 72px;
        background: rgba(255,255,255,0.86);
        backdrop-filter: blur(18px);
        border-bottom: 1px solid var(--border);
        padding: 14px 56px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        z-index: 30;
      }

      .logo {
        font-family: "DM Serif Display", serif;
        font-size: 30px;
        letter-spacing: -0.04em;
        color: var(--text);
      }

      .logo span {
        color: var(--accent);
      }

      .main {
        min-height: calc(100vh - 72px);
        overflow: visible;
        padding-bottom: 112px;
      }

      .bottom-nav {
        position: fixed;
        bottom: 22px;
        left: 50%;
        transform: translateX(-50%);
        width: min(680px, calc(100% - 32px));
        height: 66px;
        background: rgba(255,255,255,0.94);
        backdrop-filter: blur(18px);
        border: 1px solid var(--border);
        border-radius: 999px;
        display: flex;
        z-index: 40;
        box-shadow: 0 12px 42px rgba(26,24,20,0.14);
        overflow: hidden;
      }

      .nav-button {
        flex: 1;
        border: none;
        background: transparent;
        color: var(--text3);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        font-size: 10px;
        font-weight: 700;
        transition: 0.15s ease;
      }

      .nav-button.active {
        color: var(--accent);
        background: rgba(216, 243, 220, 0.5);
      }

      .section {
        padding: 36px 56px 124px;
      }

      .section-tight {
        padding: 36px 56px 0;
        text-align: center;
      }

      .fade-in {
        animation: fadeIn 0.22s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(6px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .card-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 22px;
        margin-bottom: 38px;
      }

      .spot-card {
        border: 1px solid var(--border);
        border-radius: 22px;
        background: var(--card);
        overflow: hidden;
        box-shadow: var(--shadow);
        min-width: 0;
      }

      .spot-card-clickable {
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }

      .spot-card-clickable:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow2);
      }

      .spot-emoji {
        height: 118px;
        background: linear-gradient(135deg, var(--bg2), #f9f6f0);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 42px;
      }

      .spot-body {
        padding: 16px;
        text-align: center;
      }

      .spot-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--text);
        line-height: 1.25;
        margin-bottom: 6px;
      }

      .spot-meta {
        font-size: 13px;
        color: var(--text3);
        margin-bottom: 10px;
        line-height: 1.35;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 5px 10px;
        font-size: 11px;
        font-weight: 700;
        line-height: 1;
      }

      .pill-neutral {
        background: var(--bg2);
        color: var(--text2);
      }

      .pill-green {
        background: var(--accent-bg);
        color: var(--accent);
      }

      .pill-purple {
        background: var(--purple-bg);
        color: var(--purple);
      }

      .pill-amber {
        background: var(--amber-bg);
        color: var(--amber);
      }

      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 12px 0 16px;
      }

      .section-header h2 {
        margin: 0;
        color: var(--text3);
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .section-header button {
        border: none;
        background: transparent;
        color: var(--accent);
        font-size: 12px;
        font-weight: 700;
      }

      .tab-row {
        display: flex;
        justify-content: center;
        gap: 10px;
        overflow-x: auto;
        padding-bottom: 4px;
        margin-bottom: 30px;
      }

      .choice-tab {
        border: 1px solid var(--border);
        background: var(--card);
        color: var(--text2);
        border-radius: 999px;
        padding: 9px 18px;
        font-size: 13px;
        font-weight: 700;
        white-space: nowrap;
        flex-shrink: 0;
        transition: 0.15s ease;
      }

      .choice-tab.active {
        background: var(--accent);
        border-color: var(--accent);
        color: white;
      }

      .wide-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 22px;
        box-shadow: var(--shadow);
        padding: 22px;
        margin-bottom: 18px;
      }

      .event-card {
        display: flex;
        gap: 16px;
        align-items: flex-start;
      }

      .event-icon {
        width: 58px;
        height: 58px;
        border-radius: 16px;
        background: var(--bg2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        flex-shrink: 0;
      }

      .profile-header {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: flex-start;
        margin-bottom: 14px;
      }

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 999px;
        background: var(--accent-bg);
        color: var(--accent);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        flex-shrink: 0;
      }

      .quote {
        background: var(--bg2);
        border: 1px solid transparent;
        border-radius: 16px;
        padding: 14px;
        cursor: pointer;
        transition: 0.15s ease;
      }

      .quote:hover {
        border-color: var(--accent2);
        background: #edf7ef;
      }

      .detail-hero {
        text-align: center;
        padding: 28px 18px 22px;
      }

      .back-button {
        border: none;
        background: transparent;
        color: var(--text2);
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        font-weight: 700;
      }

      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.45);
        z-index: 100;
        display: flex;
        align-items: flex-end;
        justify-content: center;
      }

      .modal-sheet {
        width: 100%;
        max-width: 560px;
        background: var(--card);
        border-radius: 26px 26px 0 0;
        padding: 24px 24px 38px;
      }

      .primary-button {
        width: 100%;
        border: none;
        border-radius: 16px;
        background: var(--text);
        color: var(--bg);
        padding: 15px 16px;
        font-size: 15px;
        font-weight: 800;
        transition: 0.15s ease;
      }

      .primary-button:hover {
        transform: translateY(-1px);
        box-shadow: var(--shadow2);
      }

      .primary-button:disabled {
        background: var(--bg3);
        color: var(--text3);
        cursor: not-allowed;
        box-shadow: none;
        transform: none;
      }

      @media (max-width: 1100px) {
        .app-shell {
          width: 100%;
        }

        .card-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .section,
        .section-tight {
          padding-left: 36px;
          padding-right: 36px;
        }

        .topbar {
          padding-left: 36px;
          padding-right: 36px;
        }
      }

      @media (max-width: 720px) {
        .app-shell {
          width: 100%;
          border-left: none;
          border-right: none;
          box-shadow: none;
        }

        .topbar {
          height: 58px;
          padding: 12px 18px;
        }

        .logo {
          font-size: 24px;
        }

        .main {
          min-height: calc(100vh - 58px);
          padding-bottom: 96px;
        }

        .bottom-nav {
          bottom: 12px;
          width: calc(100% - 24px);
          height: 62px;
        }

        .section,
        .section-tight {
          padding-left: 18px;
          padding-right: 18px;
        }

        .section {
          padding-bottom: 120px;
        }

        .section-tight {
          text-align: left;
        }

        .tab-row {
          justify-content: flex-start;
        }

        .card-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 38px;
        }

        .spot-card {
          border-radius: 16px;
        }

        .spot-emoji {
          height: 78px;
          font-size: 31px;
        }

        .spot-body {
          padding: 11px 11px 13px;
        }

        .spot-title {
          font-size: 13px;
        }

        .spot-meta {
          font-size: 11px;
        }

        .wide-card {
          border-radius: 16px;
          padding: 15px;
          margin-bottom: 14px;
        }

        .pill {
          padding: 4px 9px;
          font-size: 10px;
        }

        .modal-sheet {
          max-width: 100%;
          padding: 20px 18px 34px;
        }
      }
    `}</style>
  );
}

function badgeClass(badge) {
  const lower = badge.toLowerCase();

  if (
    lower.includes("hidden") ||
    lower.includes("underrated") ||
    lower.includes("cultural")
  ) {
    return "pill pill-purple";
  }

  if (
    lower.includes("affordable") ||
    lower.includes("free") ||
    lower.includes("family")
  ) {
    return "pill pill-green";
  }

  if (
    lower.includes("trending") ||
    lower.includes("paid") ||
    lower.includes("tiktok")
  ) {
    return "pill pill-amber";
  }

  return "pill pill-neutral";
}

export default function App() {
  const [tab, setTab] = useState("discover");
  const [discoverTab, setDiscoverTab] = useState("food");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [agentTab, setAgentTab] = useState("menu");
  const [resonateModal, setResonateModal] = useState(null);
  const [sentResonances, setSentResonances] = useState([]);

  const isDetail = selectedRestaurant || selectedProfile;

  function clearDetail() {
    setSelectedRestaurant(null);
    setSelectedProfile(null);
  }

  function changeMainTab(nextTab) {
    setTab(nextTab);
    clearDetail();
  }

  return (
    <div className="app-page">
      <GlobalStyles />

      <div className="app-shell">
        <header className="topbar">
          {isDetail ? (
            <button className="back-button" onClick={clearDetail}>
              ← Back
            </button>
          ) : (
            <div className="logo">
              near<span>met</span>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="pill pill-neutral">NYC</span>
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "var(--accent-bg)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              AK
            </span>
          </div>
        </header>

        <main className="main">
          {tab === "discover" && !selectedRestaurant && (
            <DiscoverTab
              discoverTab={discoverTab}
              setDiscoverTab={setDiscoverTab}
              onSelectRestaurant={setSelectedRestaurant}
            />
          )}

          {tab === "discover" && selectedRestaurant && (
            <RestaurantDetail restaurant={selectedRestaurant} />
          )}

          {tab === "connect" && !selectedProfile && (
            <ConnectTab
              onSelectProfile={setSelectedProfile}
              sentResonances={sentResonances}
              setResonateModal={setResonateModal}
            />
          )}

          {tab === "connect" && selectedProfile && (
            <ProfileDetail
              profile={selectedProfile}
              sentResonances={sentResonances}
              setResonateModal={setResonateModal}
            />
          )}

          {tab === "agents" && (
            <AgentsTab agentTab={agentTab} setAgentTab={setAgentTab} />
          )}
        </main>

        <nav className="bottom-nav">
          {[
            { id: "discover", icon: "⊙", label: "Discover" },
            { id: "connect", icon: "♡", label: "Connect" },
            { id: "agents", icon: "✦", label: "Agents" },
          ].map((item) => (
            <button
              key={item.id}
              className={`nav-button ${tab === item.id ? "active" : ""}`}
              onClick={() => changeMainTab(item.id)}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {resonateModal && (
          <ResonateModal
            modal={resonateModal}
            onClose={() => setResonateModal(null)}
            onSend={(text) => {
              setSentResonances((prev) => [
                ...prev,
                {
                  profileId: resonateModal.profile.id,
                  promptIndex: resonateModal.promptIndex,
                  text,
                },
              ]);
              setResonateModal(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

function DiscoverTab({ discoverTab, setDiscoverTab, onSelectRestaurant }) {
  return (
    <div className="fade-in">
      <div className="section-tight">
        <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--text3)" }}>
          Good morning, Alex
        </p>

        <h1
          style={{
            margin: "0 0 16px",
            fontSize: 28,
            letterSpacing: "-0.04em",
            fontWeight: 800,
            color: "var(--text)",
          }}
        >
          What are you looking for?
        </h1>

        <div className="tab-row">
          {[
            { id: "food", label: "🍽 Food" },
            { id: "events", label: "🎭 Events" },
            { id: "travel", label: "✈️ Travel" },
          ].map((item) => (
            <button
              key={item.id}
              className={`choice-tab ${
                discoverTab === item.id ? "active" : ""
              }`}
              onClick={() => setDiscoverTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {discoverTab === "food" && (
        <FoodSection onSelectRestaurant={onSelectRestaurant} />
      )}
      {discoverTab === "events" && <EventsSection />}
      {discoverTab === "travel" && <TravelSection />}
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      <button>See all</button>
    </div>
  );
}

function FoodSection({ onSelectRestaurant }) {
  return (
    <div className="section" style={{ paddingTop: 0 }}>
      <SectionHeader title="Popular right now" />

      <div className="card-grid">
        {FOOD_DATA.slice(0, 2).map((restaurant) => (
          <FoodCard
            key={restaurant.id}
            restaurant={restaurant}
            onClick={() => onSelectRestaurant(restaurant)}
          />
        ))}
      </div>

      <SectionHeader title="Hidden & unexplored" />

      <div className="card-grid">
        {FOOD_DATA.slice(2, 4).map((restaurant) => (
          <FoodCard
            key={restaurant.id}
            restaurant={restaurant}
            onClick={() => onSelectRestaurant(restaurant)}
          />
        ))}
      </div>

      <SectionHeader title="Vegetarian & vegan" />

      <div className="card-grid">
        {FOOD_DATA.slice(4, 6).map((restaurant) => (
          <FoodCard
            key={restaurant.id}
            restaurant={restaurant}
            onClick={() => onSelectRestaurant(restaurant)}
          />
        ))}
      </div>
    </div>
  );
}

function FoodCard({ restaurant, onClick }) {
  return (
    <article className="spot-card spot-card-clickable" onClick={onClick}>
      <div className="spot-emoji">{restaurant.emoji}</div>
      <div className="spot-body">
        <div className="spot-title">{restaurant.name}</div>
        <div className="spot-meta">
          {restaurant.neighborhood} · {restaurant.price}
        </div>
        <span className={badgeClass(restaurant.badge)}>
          {restaurant.badge}
        </span>
      </div>
    </article>
  );
}

function EventsSection() {
  return (
    <div className="section" style={{ paddingTop: 0 }}>
      <SectionHeader title="Happening this week" />

      {EVENTS_DATA.map((event) => (
        <article key={event.id} className="wide-card event-card">
          <div className="event-icon">{event.emoji}</div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <h3
              style={{
                margin: "0 0 4px",
                fontSize: 17,
                lineHeight: 1.25,
                color: "var(--text)",
              }}
            >
              {event.name}
            </h3>

            <p
              style={{
                margin: "0 0 8px",
                fontSize: 13,
                color: "var(--text3)",
                lineHeight: 1.45,
              }}
            >
              {event.date} · {event.location}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 12, color: "var(--text3)" }}>
                by {event.host} · {event.attendees} going
              </span>
              <span className={badgeClass(event.badge)}>{event.badge}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function TravelSection() {
  return (
    <div className="section" style={{ paddingTop: 0 }}>
      <SectionHeader title="Popular spots" />

      <div className="card-grid">
        {TRAVEL_DATA.slice(0, 2).map((spot) => (
          <TravelCard key={spot.id} spot={spot} />
        ))}
      </div>

      <SectionHeader title="Hidden & unexplored" />

      <div className="card-grid">
        {TRAVEL_DATA.slice(2).map((spot) => (
          <TravelCard key={spot.id} spot={spot} />
        ))}
      </div>
    </div>
  );
}

function TravelCard({ spot }) {
  return (
    <article className="spot-card">
      <div className="spot-emoji">{spot.emoji}</div>
      <div className="spot-body">
        <div className="spot-title">{spot.name}</div>
        <div className="spot-meta">{spot.neighborhood}</div>
        <span className={badgeClass(spot.badge)}>{spot.badge}</span>
      </div>
    </article>
  );
}

function RestaurantDetail({ restaurant }) {
  return (
    <div className="fade-in section">
      <div className="detail-hero">
        <div style={{ fontSize: 58, marginBottom: 10 }}>
          {restaurant.emoji}
        </div>

        <h1
          style={{
            margin: "0 0 6px",
            fontSize: 28,
            letterSpacing: "-0.04em",
            color: "var(--text)",
          }}
        >
          {restaurant.name}
        </h1>

        <p style={{ margin: "0 0 12px", color: "var(--text3)", fontSize: 14 }}>
          {restaurant.type} · {restaurant.neighborhood} · {restaurant.price}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <span className="pill pill-amber">★ {restaurant.rating}</span>
          <span className="pill pill-green">
            {restaurant.trending} searches
          </span>
        </div>
      </div>

      <div className="wide-card">
        <SectionLabel>Menu highlights</SectionLabel>

        {restaurant.menu.map((dish, index) => (
          <div
            key={dish}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "11px 0",
              borderBottom:
                index < restaurant.menu.length - 1
                  ? "1px solid var(--border2)"
                  : "none",
              fontSize: 14,
            }}
          >
            <span>{dish}</span>
            <span style={{ color: "var(--text3)" }}>→</span>
          </div>
        ))}
      </div>

      <div className="wide-card">
        <SectionLabel>Demand intelligence</SectionLabel>

        <p
          style={{
            margin: 0,
            color: "var(--text2)",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "var(--accent)" }}>
            {restaurant.searches} people
          </strong>{" "}
          searched for food like this nearby this month. Nearmet can turn that
          external search demand into menu and staffing recommendations for
          local businesses.
        </p>
      </div>
    </div>
  );
}

function ConnectTab({ onSelectProfile, sentResonances, setResonateModal }) {
  return (
    <div className="fade-in section">
      <div style={{ marginBottom: 18 }}>
        <h1
          style={{
            margin: "0 0 5px",
            fontSize: 28,
            letterSpacing: "-0.04em",
            color: "var(--text)",
          }}
        >
          People exploring NYC
        </h1>

        <p
          style={{
            margin: 0,
            color: "var(--text3)",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          Tap a quote to resonate. No swiping — just genuine connection.
        </p>
      </div>

      {CONNECTIONS_DATA.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          onSelectProfile={onSelectProfile}
          sentResonances={sentResonances}
          setResonateModal={setResonateModal}
        />
      ))}
    </div>
  );
}

function ProfileCard({
  profile,
  onSelectProfile,
  sentResonances,
  setResonateModal,
}) {
  const sentCount = sentResonances.filter(
    (item) => item.profileId === profile.id
  ).length;

  return (
    <article className="wide-card">
      <div className="profile-header" onClick={() => onSelectProfile(profile)}>
        <div
          style={{
            display: "flex",
            gap: 11,
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <div className="avatar">{profile.initials}</div>

          <div>
            <h3 style={{ margin: "0 0 3px", fontSize: 16, color: "var(--text)" }}>
              {profile.name}, {profile.age}
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text3)" }}>
              📍 {profile.neighborhood}
            </p>
          </div>
        </div>
      </div>

      <InterestRow interests={profile.interests} />

      <QuoteBlock
        profile={profile}
        prompt={profile.prompts[0]}
        promptIndex={0}
        sentResonances={sentResonances}
        setResonateModal={setResonateModal}
      />

      <div
        style={{
          marginTop: 12,
          padding: "11px 12px",
          borderRadius: 12,
          background: "var(--accent-bg)",
          borderLeft: "4px solid var(--accent)",
        }}
      >
        <SectionLabel color="var(--accent)">Wants to do in NYC</SectionLabel>
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55 }}>
          “{profile.cityWant}”
        </p>
      </div>

      {sentCount > 0 && (
        <p
          style={{
            margin: "11px 0 0",
            padding: "8px 10px",
            borderRadius: 10,
            background: "var(--bg2)",
            color: "var(--accent)",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          ✓ You resonated with {sentCount} thing{sentCount > 1 ? "s" : ""}
        </p>
      )}
    </article>
  );
}

function InterestRow({ interests }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
      {interests.map((interest) => (
        <span key={interest} className="pill pill-neutral">
          {interest}
        </span>
      ))}
    </div>
  );
}

function QuoteBlock({
  profile,
  prompt,
  promptIndex,
  sentResonances,
  setResonateModal,
}) {
  const sent = sentResonances.some(
    (item) => item.profileId === profile.id && item.promptIndex === promptIndex
  );

  return (
    <div
      className="quote"
      onClick={() => {
        if (!sent) {
          setResonateModal({ profile, prompt, promptIndex });
        }
      }}
    >
      <SectionLabel>{prompt.q}</SectionLabel>

      <p
        style={{
          margin: 0,
          color: "var(--text2)",
          fontSize: 12,
          lineHeight: 1.6,
        }}
      >
        “{prompt.a}”
      </p>

      {sent && (
        <p
          style={{
            margin: "8px 0 0",
            color: "var(--accent)",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          ✓ Resonance sent
        </p>
      )}
    </div>
  );
}

function ProfileDetail({ profile, sentResonances, setResonateModal }) {
  return (
    <div className="fade-in section">
      <div className="detail-hero">
        <div
          className="avatar"
          style={{
            width: 76,
            height: 76,
            fontSize: 26,
            margin: "0 auto 12px",
          }}
        >
          {profile.initials}
        </div>

        <h1 style={{ margin: "0 0 5px", fontSize: 28, color: "var(--text)" }}>
          {profile.name}, {profile.age}
        </h1>

        <p style={{ margin: "0 0 12px", color: "var(--text3)", fontSize: 13 }}>
          📍 {profile.neighborhood}
        </p>

        <InterestRow interests={profile.interests} />
      </div>

      {profile.prompts.map((prompt, index) => (
        <div key={prompt.q} style={{ marginBottom: 12 }}>
          <QuoteBlock
            profile={profile}
            prompt={prompt}
            promptIndex={index}
            sentResonances={sentResonances}
            setResonateModal={setResonateModal}
          />
        </div>
      ))}

      <div className="wide-card">
        <SectionLabel color="var(--accent)">Wants to do in NYC</SectionLabel>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>
          “{profile.cityWant}”
        </p>
      </div>

      <div className="card-grid">
        <div className="wide-card" style={{ marginBottom: 0 }}>
          <SectionLabel>Listening</SectionLabel>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5 }}>
            {profile.music}
          </p>
        </div>

        <div className="wide-card" style={{ marginBottom: 0 }}>
          <SectionLabel>Watching</SectionLabel>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5 }}>
            {profile.film}
          </p>
        </div>
      </div>
    </div>
  );
}

function ResonateModal({ modal, onClose, onSend }) {
  const [text, setText] = useState("");

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(event) => event.stopPropagation()}>
        <div
          style={{
            width: 38,
            height: 4,
            borderRadius: 999,
            background: "var(--bg3)",
            margin: "0 auto 16px",
          }}
        />

        <SectionLabel>Resonating with</SectionLabel>

        <div
          style={{
            background: "var(--accent-bg)",
            borderRadius: 12,
            padding: 12,
            marginBottom: 14,
            borderLeft: "4px solid var(--accent)",
          }}
        >
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55 }}>
            “{modal.prompt.a}”
          </p>
        </div>

        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="What resonated with you? Be specific..."
          maxLength={240}
          style={{
            width: "100%",
            minHeight: 95,
            resize: "none",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: 13,
            fontSize: 13,
            lineHeight: 1.55,
            outline: "none",
            background: "var(--bg)",
            color: "var(--text)",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
            gap: 12,
          }}
        >
          <span style={{ color: "var(--text3)", fontSize: 11 }}>
            {text.length} / 240
          </span>

          <button
            disabled={text.trim().length < 10}
            onClick={() => onSend(text.trim())}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "10px 18px",
              background:
                text.trim().length >= 10 ? "var(--accent)" : "var(--bg3)",
              color: text.trim().length >= 10 ? "white" : "var(--text3)",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Send resonance
          </button>
        </div>
      </div>
    </div>
  );
}

function AgentsTab({ agentTab, setAgentTab }) {
  return (
    <div className="fade-in">
      <div className="section-tight">
        <h1
          style={{
            margin: "0 0 5px",
            fontSize: 28,
            letterSpacing: "-0.04em",
            color: "var(--text)",
          }}
        >
          AI Agents
        </h1>

        <p style={{ margin: "0 0 16px", color: "var(--text3)", fontSize: 13 }}>
          Intelligence layer for users, restaurants, and event organizers.
        </p>

        <div
          style={{
            display: "flex",
            border: "1px solid var(--border)",
            borderRadius: 14,
            overflow: "hidden",
            marginBottom: 18,
          }}
        >
          {[
            { id: "menu", label: "Menu Intelligence" },
            { id: "city", label: "Personal City" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setAgentTab(item.id)}
              style={{
                flex: 1,
                border: "none",
                padding: "10px 8px",
                background: agentTab === item.id ? "var(--text)" : "transparent",
                color: agentTab === item.id ? "var(--bg)" : "var(--text2)",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {agentTab === "menu" ? <MenuAgent /> : <CityAgent />}
    </div>
  );
}

function MenuAgent() {
  const [restaurant, setRestaurant] = useState(FOOD_DATA[0]);
  const [ran, setRan] = useState(false);

  return (
    <div className="section" style={{ paddingTop: 0 }}>
      <div className="wide-card">
        <SectionLabel>Select restaurant</SectionLabel>

        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 3,
          }}
        >
          {FOOD_DATA.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setRestaurant(item);
                setRan(false);
              }}
              className={`choice-tab ${
                restaurant.id === item.id ? "active" : ""
              }`}
              style={{ padding: "7px 12px", fontSize: 12 }}
            >
              {item.emoji} {item.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="wide-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <div>
            <h3 style={{ margin: "0 0 3px", fontSize: 16, color: "var(--text)" }}>
              {restaurant.name}
            </h3>
            <p style={{ margin: 0, color: "var(--text3)", fontSize: 12 }}>
              {restaurant.neighborhood} · {restaurant.searches} searches this month
            </p>
          </div>

          <span className="pill pill-green">{restaurant.trending}</span>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {restaurant.menu.map((dish) => (
            <span key={dish} className="pill pill-neutral">
              {dish}
            </span>
          ))}
        </div>
      </div>

      <button className="primary-button" onClick={() => setRan(true)}>
        Run Menu Intelligence Agent
      </button>

      {ran && (
        <div className="fade-in" style={{ marginTop: 16 }}>
          <div className="card-grid">
            <MetricCard label="Searches" value={`${restaurant.searches}/mo`} />
            <MetricCard label="Trend" value={restaurant.trending} />
          </div>

          <AgentInsight
            color="green"
            title="Demand opportunity"
            data={`People nearby are searching for ${restaurant.type.toLowerCase()} options, but only a few places are getting clicked.`}
            action="Promote top dishes"
          />

          <AgentInsight
            color="amber"
            title="Menu placement issue"
            data={`${
              restaurant.menu[restaurant.menu.length - 1]
            } has low discovery compared with other dishes.`}
            action="Reposition or rename"
          />

          <AgentInsight
            color="purple"
            title="Local growth angle"
            data={`Dine-in demand near ${restaurant.neighborhood} is stronger than delivery-style discovery.`}
            action="Push walk-in offers"
          />
        </div>
      )}
    </div>
  );
}

function CityAgent() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  function askAgent() {
    const trimmed = query.trim();

    if (!trimmed) return;

    setAnswer(
      `For "${trimmed}", I would start with a low-friction plan: pick one strong nearby option, one backup, and one small add-on experience. In NYC, that means matching the place to time of day, neighborhood energy, and how social you want the outing to be. For a vegetarian food request, I’d suggest Saravana Bhavan in Murray Hill for reliable South Indian food, then a short walk nearby for coffee.`
    );
  }

  return (
    <div className="section" style={{ paddingTop: 0 }}>
      <div className="wide-card">
        <SectionLabel>Ask your city agent</SectionLabel>

        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Example: Suggest a vegetarian restaurant near me..."
          style={{
            width: "100%",
            minHeight: 92,
            resize: "none",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: 13,
            fontSize: 13,
            lineHeight: 1.55,
            outline: "none",
            background: "var(--bg)",
            color: "var(--text)",
            marginTop: 6,
          }}
        />

        <button className="primary-button" style={{ marginTop: 12 }} onClick={askAgent}>
          Ask Agent
        </button>
      </div>

      {answer && (
        <div className="wide-card fade-in">
          <SectionLabel color="var(--accent)">Agent response</SectionLabel>
          <p
            style={{
              margin: 0,
              color: "var(--text2)",
              fontSize: 13,
              lineHeight: 1.65,
            }}
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="wide-card" style={{ marginBottom: 0, textAlign: "center" }}>
      <div style={{ fontSize: 20, fontWeight: 800 }}>{value}</div>
      <div style={{ color: "var(--text3)", fontSize: 11, marginTop: 3 }}>
        {label}
      </div>
    </div>
  );
}

function AgentInsight({ color, title, data, action }) {
  const styles = {
    green: {
      bg: "var(--accent-bg)",
      text: "var(--accent)",
      border: "var(--accent)",
    },
    amber: {
      bg: "var(--amber-bg)",
      text: "var(--amber)",
      border: "var(--amber)",
    },
    purple: {
      bg: "var(--purple-bg)",
      text: "var(--purple)",
      border: "var(--purple)",
    },
  };

  const s = styles[color];

  return (
    <div
      className="wide-card"
      style={{
        background: s.bg,
        borderLeft: `4px solid ${s.border}`,
      }}
    >
      <SectionLabel color={s.text}>{title}</SectionLabel>

      <p
        style={{
          margin: "0 0 10px",
          color: "var(--text2)",
          fontSize: 13,
          lineHeight: 1.55,
        }}
      >
        {data}
      </p>

      <span className="pill" style={{ background: "white", color: s.text }}>
        {action}
      </span>
    </div>
  );
}

function SectionLabel({ children, color = "var(--text3)" }) {
  return (
    <div
      style={{
        color,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        marginBottom: 7,
      }}
    >
      {children}
    </div>
  );
}