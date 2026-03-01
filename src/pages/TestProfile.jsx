import { useAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'

export const TestProfile = () => {
  const { user } = useAuth()
  const { data: profile, isLoading, error } = useProfile(user?.id)

  if (isLoading) return <div>Loading profile...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Profile Test</h1>
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold">User:</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        
        <h2 className="font-semibold mt-4">Profile:</h2>
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </div>
    </div>
  )
}