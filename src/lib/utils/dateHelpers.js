import { format, addMinutes, isWithinInterval, parse } from 'date-fns'

/**
 * Format a date for display
 */
export const formatDate = (date, formatStr = 'PPP') => {
  return format(date, formatStr)
}

/**
 * Generate time slots between start and end time with given duration
 */
export const generateTimeSlots = (startTime, endTime, durationMinutes) => {
  const slots = []
  let current = parse(startTime, 'HH:mm', new Date())
  const end = parse(endTime, 'HH:mm', new Date())

  while (current < end) {
    slots.push(format(current, 'h:mm a'))
    current = addMinutes(current, durationMinutes)
  }
  return slots
}

/**
 * Check if a time slot is available (not in booked slots)
 */
export const isSlotAvailable = (slot, bookedSlots) => {
  return !bookedSlots.includes(slot)
}