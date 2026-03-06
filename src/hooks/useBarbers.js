import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase/client'

export const useBarbers = (includeInactive = false) => {
  return useQuery({
    queryKey: ['barbers', { includeInactive }],
    queryFn: async () => {
      let query = supabase
        .from('barbers')
        .select(`
          id,
          name,
          specialties,
          bio,
          image_url,
          is_active,
          working_hours,
          profile:profiles!profile_id (
  email,
  phone,
  first_name,
  last_name
)
        `)
        .order('name')
      
      if (!includeInactive) {
        query = query.eq('is_active', true)
      }
      
      const { data, error } = await query
      if (error) throw error
      return data
    }
  })
}