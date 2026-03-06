import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase/client'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Auth init error:', error)
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

const fetchProfile = async (userId) => {
  try {
    console.log('Fetching profile for:', userId)
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle() // Use maybeSingle instead of single
    
    if (error) {
      console.error('Error fetching profile:', error)
      return
    }
    
    if (!data) {
      console.log('No profile found for user, waiting for trigger...')
      // Profile might not be created yet, set to null
      setProfile(null)
      return
    }
    
    console.log('Profile fetched:', data)
    setProfile(data)
  } catch (error) {
    console.error('Error in fetchProfile:', error)
  } finally {
    setLoading(false)
  }
}

  const signIn = async (email, password) => {
    const response = await supabase.auth.signInWithPassword({ email, password })
    return response
  }

  const signUp = async (email, password, firstName = '', lastName = '') => {
    const response = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    })
    return response
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  // Computed permissions
  const isAdmin = profile?.role === 'admin'
  const isBarber = profile?.is_barber || profile?.role === 'barber' || profile?.role === 'admin'
  const canAccessBarberDashboard = isBarber || isAdmin
  const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : ''

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isBarber,
    canAccessBarberDashboard,
    fullName
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}