import { useState } from 'react'
import { signIn } from '../lib/supabase'

function NearMetLogo({ size = 28, dark = false }) {
  const height = Math.round(size * 1.8);
  const src = dark ? "/logo-dark.png" : "/logo-light.png";
  return <img src={src} alt="NearMet" style={{ height, width: "auto", objectFit: "contain", display: "block", maxWidth: size * 7 }} />;
}

export default function AuthPage({ onBack, mode: props_mode, onCreateAccount }) {
  const [mode, setMode] = useState(props_mode || 'landing')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signedUpEmail, setSignedUpEmail] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSignIn(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try { await signIn({ email: form.email, password: form.password }) }
    catch (err) { setError(err.message || 'Sign in failed. Check your email and password.') }
    finally { setLoading(false) }
  }

  // ── Landing ─────────────────────────────────────────────────────────────────
  if (mode === 'landing') return (
    <div className="ob-root">
      <div className="ob-hero" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Gradient background instead of dark food photo */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #1A1F3A 0%, #3D2E8A 40%, #5B4FD4 70%, #F47B6B 100%)", zIndex: 0 }} />
        {/* Subtle pattern overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(244,123,107,0.15) 0%, transparent 40%)", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Logo centred with backdrop so it reads on dark bg */}
          <div style={{ padding: "48px 28px 0", display: "flex", justifyContent: "center" }}>
            <div style={{ background: "rgba(255,255,255,0.92)", borderRadius: 20, padding: "14px 24px" }}>
              <NearMetLogo size={52} />
            </div>
          </div>

          {/* Hero text centred */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px 24px", textAlign: "center" }}>
            <h1 style={{ fontSize: 36, fontWeight: 900, color: "white", letterSpacing: "-0.04em", lineHeight: 1.2, marginBottom: 16 }}>
              Meet people.<br />Explore the city.<br /><span style={{ color: "#F47B6B" }}>Together.</span>
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, maxWidth: 320 }}>
              Find people who want to do the same things as you, and explore the city together.
            </p>
          </div>

          {/* Buttons bottom */}
          <div style={{ padding: "0 24px 48px" }}>
            <button onClick={() => onCreateAccount ? onCreateAccount() : setMode('signup')}
              style={{ width: "100%", background: "#F47B6B", color: "white", border: "none", borderRadius: 14, padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
              Create an account
            </button>
            <button onClick={() => setMode('signin')}
              style={{ width: "100%", background: "rgba(255,255,255,0.12)", color: "white", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 14, padding: "16px", fontSize: 16, fontWeight: 600, cursor: "pointer", marginBottom: 20 }}>
              Login
            </button>
            <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
              By continuing you agree to our <span style={{ color: "#F47B6B", cursor: "pointer" }}>Terms & Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  // ── Confirm email ────────────────────────────────────────────────────────────
  if (mode === 'confirm') return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", padding: "48px 24px" }}>
      <NearMetLogo size={36} />
      <div style={{ marginTop: 40, textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>📬</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1A1F3A", marginBottom: 8 }}>Check your email</h2>
        <p style={{ fontSize: 14, color: "#9090B0", lineHeight: 1.6 }}>
          We sent a confirmation link to<br /><strong style={{ color: "#1A1F3A" }}>{signedUpEmail}</strong>
        </p>
        <div style={{ marginTop: 24, background: "#F0EEFF", border: "1px solid #EEEAFF", borderRadius: 12, padding: "14px 16px", fontSize: 13, color: "#5B4FD4", textAlign: "left" }}>
          <strong>Didn't get it?</strong> Check your spam folder.
        </div>
        <button onClick={() => setMode('signin')}
          style={{ width: "100%", background: "#5B4FD4", color: "white", border: "none", borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 24 }}>
          Go to sign in →
        </button>
      </div>
    </div>
  )

  // ── Sign in ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 20px 12px", borderBottom: "1px solid #F0EEFF", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => { if (onBack) onBack(); else setMode('landing'); }}
          style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#4A4A6A" }}>←</button>
        <NearMetLogo size={32} />
      </div>
      <div style={{ flex: 1, padding: "28px 24px", maxWidth: 480, width: "100%", margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1A1F3A", marginBottom: 6 }}>Welcome back</h2>
        <p style={{ fontSize: 14, color: "#9090B0", marginBottom: 28 }}>Sign in to your NearMet account.</p>
        <form onSubmit={handleSignIn}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#9090B0", letterSpacing: ".07em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>EMAIL</label>
              <input className="ob-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#9090B0", letterSpacing: ".07em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>PASSWORD</label>
              <input className="ob-input" type="password" placeholder="Your password" value={form.password} onChange={e => set('password', e.target.value)} required />
            </div>
          </div>
          {error && <div style={{ marginTop: 12, background: "#FEF0EE", border: "1px solid #F47B6B", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#C94E3A" }}>{error}</div>}
          <button className="ob-save-btn" type="submit" disabled={loading} style={{ width: "100%", marginTop: 24 }}>
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>
        <button onClick={() => onCreateAccount ? onCreateAccount() : setMode('landing')}
          style={{ width: "100%", marginTop: 16, textAlign: "center", fontSize: 14, color: "#9090B0", background: "none", border: "none", cursor: "pointer" }}>
          Don't have an account? <span style={{ color: "#5B4FD4", fontWeight: 700 }}>Create one</span>
        </button>
      </div>
    </div>
  )
}
