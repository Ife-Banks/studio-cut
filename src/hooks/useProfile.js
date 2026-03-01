import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase/client'

export const useProfile = (userId) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!userId
  })
}