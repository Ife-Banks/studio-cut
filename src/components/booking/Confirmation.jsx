import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { CheckCircle2, Calendar, User, Scissors, Clock, DollarSign } from 'lucide-react'

export const Confirmation = ({ bookingData, bookingId }) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-green-100 rounded-full p-3">
          <CheckCircle2 className="h-16 w-16 text-green-600" />
        </div>
      </div>
      
      <h2 className="text-3xl font-heading font-bold mb-2">Booking Confirmed!</h2>
      <p className="text-gray-600 mb-2">
        Your appointment has been successfully booked.
      </p>
      {bookingId && (
        <p className="text-sm text-gray-500 mb-8">
          Booking Reference: #{bookingId}
        </p>
      )}

      <Card className="max-w-md mx-auto text-left mb-8">
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>
            A confirmation has been sent to {bookingData.customer.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-secondary mt-0.5" />
            <div>
              <p className="font-medium">Date & Time</p>
              <p className="text-sm text-gray-600">
                {bookingData.date && format(bookingData.date, 'EEEE, MMMM d, yyyy')} at {bookingData.time}
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Scissors className="h-5 w-5 text-secondary mt-0.5" />
            <div>
              <p className="font-medium">Service</p>
              <p className="text-sm text-gray-600">{bookingData.service?.name}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-secondary mt-0.5" />
            <div>
              <p className="font-medium">Barber</p>
              <p className="text-sm text-gray-600">{bookingData.barber?.name}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-secondary mt-0.5" />
            <div>
              <p className="font-medium">Duration</p>
              <p className="text-sm text-gray-600">{bookingData.service?.duration} minutes</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <DollarSign className="h-5 w-5 text-secondary mt-0.5" />
            <div>
              <p className="font-medium">Total</p>
              <p className="text-sm text-gray-600">${bookingData.service?.price}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-x-4">
        <Button asChild variant="outline">
          <Link to="/">Home</Link>
        </Button>
        <Button asChild className="bg-secondary text-primary hover:bg-secondary/90">
          <Link to="/booking">Book Another</Link>
        </Button>
      </div>
    </div>
  )
}