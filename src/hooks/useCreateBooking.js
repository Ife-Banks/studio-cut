import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase/client'
import { toast } from 'sonner'
import { addMinutes, parse } from 'date-fns'

export const useCreateBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (bookingData) => {
      const { service, barber, date, time, customer } = bookingData
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('You must be logged in to book')
      }

      // Parse the time string (e.g., "9:00 AM") to a Date object
      const timeObj = parse(time, 'h:mm a', new Date(date))
      
      // Combine date and time
      const startTime = new Date(date)
      startTime.setHours(timeObj.getHours(), timeObj.getMinutes(), 0)
      
      const endTime = addMinutes(startTime, service.duration)

      // First, ensure customer profile exists/update info
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: customer.name,
          phone: customer.phone,
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Create appointment
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          customer_id: user.id,
          barber_id: barber.id,
          service_id: service.id,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: 'pending',
          payment_status: 'pending',
          notes: `Booked by ${customer.name}`
        }])
        .select(`
          *,
          service:services(name, price),
          barber:barbers(name),
          customer:profiles(full_name, email)
        `)
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Booking created successfully!')
      
      // Here you could trigger:
      // - Email confirmation
      // - Calendar sync
      // - Payment processing
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}