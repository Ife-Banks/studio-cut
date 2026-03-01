import { useAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export const DebugAuth = () => {
  const { user, loading: authLoading, signOut } = useAuth()
  const { data: profile, isLoading: profileLoading, error } = useProfile(user?.id)

  if (authLoading || profileLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>User Info</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Profile Info</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-600">Error: {error.message}</div>
          ) : (
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(profile, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Role Check</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Current role from profile: <strong>{profile?.role || 'undefined'}</strong></p>
          <p>Is admin? <strong>{profile?.role === 'admin' ? '✅ YES' : '❌ NO'}</strong></p>
          <p>Profile exists? <strong>{profile ? '✅ YES' : '❌ NO'}</strong></p>
        </CardContent>
      </Card>

      <Button onClick={signOut} variant="destructive">Sign Out</Button>
    </div>
  )
}