import { useState } from 'react'
import { signIn, signUp } from '../lib/supabase'

function NearMetLogo({ size = 28, dark = false }) {
  return (
    <span style={{ fontSize: size, fontWeight: 800, letterSpacing: '-0.04em', fontFamily: 'Outfit, sans-serif' }}>
      <span style={{ color: dark ? '#f5f5f0' : '#1a2e1a' }}>Near</span>
      <span style={{ color: dark ? '#8aad6e' : '#2d6a2d' }}>Met</span>
    </span>
  )
}

const CITIES = [
  { id: 'nyc', flag: '🗽', name: 'New York City', sub: 'All 5 boroughs · Live now' },
  { id: 'mumbai', flag: '🇮🇳', name: 'Mumbai', sub: 'All areas · Live now' },
]

export default function AuthPage({ onBack, mode: props_mode }) {
  const [mode, setMode] = useState(props_mode || 'landing')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [city, setCity] = useState('')
  const [form, setForm] = useState({ name: '', age: '', email: '', phone: '', password: '', confirmPassword: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSignIn(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await signIn({ email: form.email, password: form.password })
    } catch (err) {
      setError(err.message || 'Sign in failed. Check your email and password.')
    } finally { setLoading(false) }
  }

  async function handleSignUp(e) {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (parseInt(form.age) < 18) { setError('You must be 18 or older.'); return }
    setLoading(true); setError('')
    try {
      await signUp({ email: form.email, password: form.password, name: form.name, age: form.age, city, phone: form.phone })
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.')
    } finally { setLoading(false) }
  }

  if (mode === 'landing') return (
    <div className="ob-root">
      <div className="ob-hero">
        <div className="ob-hero-img" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800&q=80)` }} />
        <div className="ob-hero-overlay" />
        <div className="ob-hero-content">
          <NearMetLogo size={52} dark />
          <p className="ob-hero-tagline">Explore your city.<br />Find genuine connections.</p>
        </div>
        <div className="ob-hero-bottom">
          <button className="ob-cta-primary" onClick={() => setMode('signup')}>Create an account</button>
          <button className="ob-cta-secondary" onClick={() => setMode('signin')}>I have an account</button>
          <p className="ob-legal">By signing up you agree to our <span className="ob-link">Terms</span> &amp; <span className="ob-link">Privacy Policy</span>.</p>
        </div>
      </div>
    </div>
  )

  if (mode === 'signin') return (
    <div className="ob-step-wrap">
      <div className="ob-step-progress"><div className="ob-progress-bar" style={{ width: '100%' }} /></div>
      <div className="ob-step-body">
        <div style={{ marginBottom: 20 }}><NearMetLogo size={32} /></div>
        <h2 className="ob-step-title">Welcome back</h2>
        <p className="ob-step-sub">Sign in to your NearMet account.</p>
        <form onSubmit={handleSignIn}>
          <div className="ob-form">
            <div className="ob-field"><label className="ob-field-label">EMAIL</label><input className="ob-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required /></div>
            <div className="ob-field"><label className="ob-field-label">PASSWORD</label><input className="ob-input" type="password" placeholder="Your password" value={form.password} onChange={e => set('password', e.target.value)} required /></div>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button className="ob-save-btn" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in →'}</button>
        </form>
        <button className="auth-switch" onClick={() => setMode('signup')}>Don't have an account? <span>Create one</span></button>
      </div>
      <div className="ob-step-nav"><button className="ob-btn-ghost" onClick={() => { if(onBack) onBack(); else setMode('landing'); }}>← Back</button></div>
    </div>
  )

  // Sign up step 1 — city
  if (mode === 'signup' && step === 1) return (
    <div className="ob-step-wrap">
      <div className="ob-step-progress"><div className="ob-progress-bar" style={{ width: '33%' }} /></div>
      <div className="ob-step-body">
        <div className="ob-step-label">STEP 1 OF 3</div>
        <h2 className="ob-step-title">Which city are you in?</h2>
        <div className="ob-city-list">
          {CITIES.map(c => (
            <button key={c.id} className={`ob-city-item ${city === c.id ? 'active' : ''}`} onClick={() => setCity(c.id)}>
              <span className="ob-city-flag">{c.flag}</span>
              <div><div className="ob-city-name">{c.name}</div><div className="ob-city-sub">{c.sub}</div></div>
              <div className={`ob-radio ${city === c.id ? 'filled' : ''}`} />
            </button>
          ))}
        </div>
      </div>
      <div className="ob-step-nav">
        <button className="ob-btn-ghost" onClick={() => setMode('landing')}>Back</button>
        <button className="ob-btn-primary" disabled={!city} onClick={() => setStep(2)}>Next →</button>
      </div>
    </div>
  )

  // Sign up step 2 — details
  if (mode === 'signup' && step === 2) return (
    <div className="ob-step-wrap">
      <div className="ob-step-progress"><div className="ob-progress-bar" style={{ width: '66%' }} /></div>
      <div className="ob-step-body">
        <div className="ob-step-label">STEP 2 OF 3</div>
        <h2 className="ob-step-title">Create your account</h2>
        <div className="ob-form">
          {[['Name', 'text', 'Your name', 'name'], ['Age', 'number', '18+', 'age'], ['Email', 'email', 'you@example.com', 'email'], ['Phone', 'tel', '+1 or +91', 'phone'], ['Password', 'password', 'At least 8 characters', 'password'], ['Confirm Password', 'password', 'Repeat password', 'confirmPassword']].map(([lbl, type, ph, key]) => (
            <div key={key} className="ob-field"><label className="ob-field-label">{lbl.toUpperCase()}</label><input className="ob-input" type={type} placeholder={ph} value={form[key]} onChange={e => set(key, e.target.value)} /></div>
          ))}
        </div>
        {error && <div className="auth-error">{error}</div>}
      </div>
      <div className="ob-step-nav">
        <button className="ob-btn-ghost" onClick={() => setStep(1)}>Back</button>
        <button className="ob-btn-primary" disabled={!form.name || !form.email || !form.password} onClick={() => setStep(3)}>Next →</button>
      </div>
    </div>
  )

  // Sign up step 3 — confirm
  return (
    <div className="ob-step-wrap">
      <div className="ob-step-progress"><div className="ob-progress-bar" style={{ width: '100%' }} /></div>
      <div className="ob-step-body">
        <div className="ob-step-label">STEP 3 OF 3</div>
        <h2 className="ob-step-title">Almost there</h2>
        <div className="auth-confirm-card">
          {[['City', CITIES.find(c => c.id === city)?.name], ['Name', form.name], ['Email', form.email], ['Age', form.age]].map(([l, v]) => (
            <div key={l} className="auth-confirm-row"><span>{l}</span><strong>{v}</strong></div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: '#888', marginTop: 16, lineHeight: 1.6 }}>
          By creating an account you confirm you are 18 or older and agree to our <span className="ob-link">Terms of Service</span> and <span className="ob-link">Privacy Policy</span>.
        </p>
        {error && <div className="auth-error">{error}</div>}
      </div>
      <div className="ob-step-nav">
        <button className="ob-btn-ghost" onClick={() => setStep(2)}>Back</button>
        <button className="ob-btn-primary" disabled={loading} onClick={handleSignUp}>{loading ? 'Creating account…' : 'Create account →'}</button>
      </div>
      <button className="auth-switch" style={{ padding: '0 28px 16px' }} onClick={() => setMode('signin')}>Already have an account? <span>Sign in</span></button>
    </div>
  )
}
