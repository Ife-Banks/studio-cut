import { useState, useEffect } from 'react'
import { format, isBefore, startOfToday, addDays } from 'date-fns'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Card } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'
import { Loader2, Clock, CalendarDays } from 'lucide-react'
import { useAvailability } from '../../hooks/useAvailability'

export const DateTimePicker = ({ selectedService, selectedBarber, onSelect, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const today = startOfToday()

  // Fetch available slots using the service duration
  const { data: availableSlots, isLoading, error } = useAvailability(
    selectedBarber?.id,
    selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null,
    selectedService?.duration || 30
  )

  // Reset selected time when date changes
  useEffect(() => {
    setSelectedTime(null)
  }, [selectedDate])

  // Disable dates that are:
  // - In the past
  // - Fully booked (no slots available)
  // - Barber doesn't work (will return empty slots from useAvailability)
  const isDateDisabled = (date) => {
    if (isBefore(date, today)) return true
    return false
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
  }

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onSelect(selectedDate, selectedTime)
    }
  }

  // Check if selected date has any available slots
  const hasAvailableSlots = availableSlots && availableSlots.length > 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold mb-2">Select Date & Time</h2>
        <p className="text-gray-600">
          Choose when you'd like your {selectedService?.name?.toLowerCase()} with {selectedBarber?.name}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <CalendarDays className="h-5 w-5" />
            <h3 className="font-medium">Select Date</h3>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="rounded-md border"
            fromDate={today}
            toDate={addDays(today, 60)} // Allow booking up to 60 days in advance
          />
        </div>

        {/* Time slots */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <Clock className="h-5 w-5" />
            <h3 className="font-medium">Select Time</h3>
          </div>
          
          {selectedDate ? (
            <Card className="p-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-secondary mb-2" />
                  <p className="text-sm text-gray-500">Checking availability...</p>
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Error loading availability. Please try again.
                  </AlertDescription>
                </Alert>
              ) : hasAvailableSlots ? (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Available times for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className={`${
                          selectedTime === time 
                            ? 'bg-secondary text-primary hover:bg-secondary/90' 
                            : 'hover:border-secondary'
                        }`}
                        onClick={() => handleTimeSelect(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    {availableSlots.length} time slots available
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No available slots</p>
                  <p className="text-sm text-gray-400">
                    Try another date or barber
                  </p>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-8">
              <div className="text-center text-gray-500">
                <CalendarDays className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Please select a date first</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Selected time summary */}
      {selectedDate && selectedTime && (
        <Card className="bg-secondary/5 border-secondary/20 p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Your selected time</p>
              <p className="font-semibold">
                {format(selectedDate, 'EEEE, MMMM d')} at {selectedTime}
              </p>
              <p className="text-sm text-gray-500">
                Duration: {selectedService?.duration} minutes
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Service</p>
              <p className="font-semibold">{selectedService?.name}</p>
              <p className="text-sm text-gray-500">with {selectedBarber?.name}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          className="bg-secondary text-primary hover:bg-secondary/90"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}