import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase/client'
import { useAuth } from '../context/AuthContext'

export const SimpleTest = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        console.log('Fetching profile for:', user.id)
        
        // Direct Supabase call (bypassing React Query)
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()
        
        if (error) throw error
        
        console.log('Direct profile fetch result:', data)
        setProfile(data)
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Not logged in</h1>
        <a href="/login" className="text-blue-600 underline">Go to Login</a>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Simple Profile Test</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">User Info:</h2>
        <pre className="bg-white p-2 rounded">
          {JSON.stringify({ id: user.id, email: user.email }, null, 2)}
        </pre>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">Profile Fetch Status:</h2>
        {loading && <p>Loading profile...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {profile && (
          <>
            <p className="text-green-600 mb-2">✅ Profile loaded successfully!</p>
            <pre className="bg-white p-2 rounded">
              {JSON.stringify(profile, null, 2)}
            </pre>
            <p className="mt-2">
              Role: <strong className={profile.role === 'admin' ? 'text-green-600' : 'text-orange-600'}>
                {profile.role}
              </strong>
              {profile.role === 'admin' && ' (Admin access granted)'}
            </p>
          </>
        )}
      </div>

      <div className="flex space-x-4">
        <a 
          href="/admin" 
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Try Admin Dashboard
        </a>
        <a 
          href="/" 
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}