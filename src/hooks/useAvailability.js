import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase/client'
import { 
  format, 
  parse, 
  addMinutes, 
  isWithinInterval, 
  setHours, 
  setMinutes,
  getDay,
  isBefore,
  startOfDay
} from 'date-fns'

export const useAvailability = (barberId, date, serviceDuration = 30) => {
  return useQuery({
    queryKey: ['availability', barberId, date, serviceDuration],
    queryFn: async () => {
      if (!barberId || !date) return []
      
      // Get barber's working hours
      const { data: barber, error: barberError } = await supabase
        .from('barbers')
        .select('working_hours')
        .eq('id', barberId)
        .single()
      
      if (barberError) throw barberError
      
      // Get appointments for this barber on the selected date
      const startOfDay = `${date}T00:00:00`
      const endOfDay = `${date}T23:59:59`
      
      const { data: appointments, error: aptError } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('barber_id', barberId)
        .gte('start_time', startOfDay)
        .lte('start_time', endOfDay)
        .in('status', ['pending', 'confirmed'])
      
      if (aptError) throw aptError
      
      // Get blocked times
      const { data: blockedTimes, error: blockError } = await supabase
        .from('blocked_times')
        .select('*')
        .eq('barber_id', barberId)
        .gte('start_time', startOfDay)
        .lte('start_time', endOfDay)
      
      if (blockError) throw blockError
      
      // Generate available slots
      return generateTimeSlots(
        date, 
        barber?.working_hours, 
        appointments || [], 
        blockedTimes || [], 
        serviceDuration
      )
    },
    enabled: !!barberId && !!date
  })
}

/**
 * Generate available time slots based on:
 * - Barber's working hours
 * - Existing appointments
 * - Blocked times
 * - Service duration
 */
function generateTimeSlots(date, workingHours, appointments, blockedTimes, serviceDuration) {
  const dayOfWeek = getDay(new Date(date))
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayName = dayNames[dayOfWeek]
  
  // Check if barber works on this day
  const daySchedule = workingHours?.[dayName]
  if (!daySchedule?.enabled) {
    return [] // Barber doesn't work this day
  }
  
  // Parse working hours
  const workStart = parse(daySchedule.open, 'HH:mm', new Date(date))
  const workEnd = parse(daySchedule.close, 'HH:mm', new Date(date))
  
  // Don't show slots in the past
  const now = new Date()
  const today = format(now, 'yyyy-MM-dd') === date
  
  // Generate all possible slots (every 30 minutes)
  const allSlots = []
  let currentSlot = workStart
  
  while (isBefore(currentSlot, workEnd)) {
    // Skip past times if it's today
    if (!today || !isBefore(currentSlot, now)) {
      allSlots.push(format(currentSlot, 'h:mm a'))
    }
    currentSlot = addMinutes(currentSlot, 30)
  }
  
  // Convert booked appointments to occupied time ranges
  const bookedRanges = appointments.map(apt => ({
    start: new Date(apt.start_time),
    end: new Date(apt.end_time)
  }))
  
  // Add blocked times
  const blockedRanges = blockedTimes.map(block => ({
    start: new Date(block.start_time),
    end: new Date(block.end_time)
  }))
  
  const occupiedRanges = [...bookedRanges, ...blockedRanges]
  
  // Filter out slots that fall within occupied ranges
  const availableSlots = allSlots.filter(slot => {
    const slotTime = parse(slot, 'h:mm a', new Date(date))
    const slotEnd = addMinutes(slotTime, serviceDuration)
    
    // Check if this slot conflicts with any occupied range
    const isOccupied = occupiedRanges.some(range => {
      return (
        (isWithinInterval(slotTime, { start: range.start, end: range.end })) ||
        (isWithinInterval(slotEnd, { start: range.start, end: range.end })) ||
        (isBefore(slotTime, range.start) && isAfter(slotEnd, range.start))
      )
    })
    
    return !isOccupied
  })
  
  return availableSlots
}

// Helper function (since date-fns doesn't export isAfter directly)
function isAfter(date, dateToCompare) {
  return date.getTime() > dateToCompare.getTime()
}