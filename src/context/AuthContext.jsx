import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase, getProfile } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = still loading
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const loadingProfile = useRef(false) // prevent concurrent loads

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) loadProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        if (session?.user) await loadProfile(session.user.id)
        else { setProfile(null); setLoading(false) }
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    if (loadingProfile.current) return
    loadingProfile.current = true
    try {
      const prof = await getProfile(userId)
      if (prof) {
        // Profile exists — set it
        setProfile(prof)
      } else {
        // No profile row yet (new signup via email confirm) — create a minimal one
        // so the user gets through to onboarding rather than hitting a blank state
        const { data: { user } } = await supabase.auth.getUser()
        const { data: newProf } = await supabase.from('profiles').insert({
          id: userId,
          email: user?.email || '',
          name: '',
          city: 'mumbai',
          created_at: new Date().toISOString(),
        }).select().single()
        setProfile(newProf || { id: userId, profile_complete: false })
      }
    } catch {
      // Don't set profile to null on error — keep whatever we had
      // and don't flash the landing screen
      setProfile(prev => prev ?? { id: userId, profile_complete: false })
    } finally {
      setLoading(false)
      loadingProfile.current = false
    }
  }

  async function refreshProfile() {
    if (session?.user) {
      loadingProfile.current = false // allow a fresh load
      await loadProfile(session.user.id)
    }
  }

  return (
    <AuthContext.Provider value={{ session, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
