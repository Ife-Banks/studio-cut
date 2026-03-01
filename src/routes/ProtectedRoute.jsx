import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { useEffect, useState } from 'react'

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile(user?.id)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!authLoading && !profileLoading) {
      if (!user) {
        setIsAuthorized(false)
      } else if (!requiredRole) {
        setIsAuthorized(true) // No role required, just authenticated
      } else if (profile?.role === requiredRole) {
        setIsAuthorized(true)
      } else {
        setIsAuthorized(false)
      }
      setChecking(false)
    }
  }, [user, profile, authLoading, profileLoading, requiredRole])

  if (authLoading || profileLoading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}