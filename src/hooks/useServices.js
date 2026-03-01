import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase/client'

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name')
      
      if (error) throw error
      return data
    }
  })
}