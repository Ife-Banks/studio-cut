import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase/client'

export const useProfile = (userId) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) {
        console.log('useProfile: No userId provided')
        return null
      }
      
      console.log('useProfile: Fetching profile for user:', userId)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle() // Use maybeSingle instead of single to avoid errors
      
      if (error) {
        console.error('useProfile: Error fetching profile:', error)
        throw error
      }
      
      console.log('useProfile: Profile data received:', data)
      return data
    },
    enabled: !!userId,
    retry: 2, // Retry twice if it fails
  })
}