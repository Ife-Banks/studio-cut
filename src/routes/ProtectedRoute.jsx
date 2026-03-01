import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { useEffect, useState } from 'react'

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading: authLoading } = useAuth()
  const { data: profile, isLoading: profileLoading, error } = useProfile(user?.id)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [checking, setChecking] = useState(true)

  // Debug logs - check your browser console (F12)
  console.log('=== ProtectedRoute Debug ===')
  console.log('1. User:', user?.email)
  console.log('2. User ID:', user?.id)
  console.log('3. Profile data:', profile)
  console.log('4. Profile role:', profile?.role)
  console.log('5. Required role:', requiredRole)
  console.log('6. Profile error:', error)
  console.log('7. Auth loading:', authLoading)
  console.log('8. Profile loading:', profileLoading)

  useEffect(() => {
    if (!authLoading && !profileLoading) {
      console.log('9. Checking authorization...')
      
      if (!user) {
        console.log('10. No user -> redirect to login')
        setIsAuthorized(false)
      } else if (!requiredRole) {
        console.log('11. No role required -> authorized')
        setIsAuthorized(true)
      } else if (profile?.role === requiredRole) {
        console.log(`12. Role match: ${profile.role} === ${requiredRole} -> authorized`)
        setIsAuthorized(true)
      } else {
        console.log(`13. Role mismatch: profile role = ${profile?.role}, required = ${requiredRole} -> not authorized`)
        setIsAuthorized(false)
      }
      setChecking(false)
    }
  }, [user, profile, authLoading, profileLoading, requiredRole])

  if (authLoading || profileLoading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
        <p className="ml-2">Checking authorization...</p>
      </div>
    )
  }

  if (!user) {
    console.log('14. Redirecting to login')
    return <Navigate to="/login" replace />
  }

  if (requiredRole && profile?.role !== requiredRole) {
    console.log('15. Redirecting to home - wrong role')
    return <Navigate to="/" replace />
  }

  console.log('16. Authorization successful, rendering protected content')
  return children
}