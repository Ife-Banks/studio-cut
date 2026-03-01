import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase/client'

export const useAppointments = (filters = {}) => {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: async () => {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          customer:profiles!customer_id(full_name, email, phone),
          barber:barbers(name),
          service:services(name, price, duration)
        `)
        .order('start_time', { ascending: true })

      if (filters.startDate) {
        query = query.gte('start_time', filters.startDate)
      }
      if (filters.endDate) {
        query = query.lte('start_time', filters.endDate)
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.barberId) {
        query = query.eq('barber_id', filters.barberId)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    }
  })
}

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    }
  })
}