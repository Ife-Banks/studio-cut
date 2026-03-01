import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ServiceSelector } from './ServiceSelector'
import { BarberSelector } from './BarberSelector'
import { DateTimePicker } from './DateTimePicker'
import { CustomerInfoForm } from './CustomerInfoForm'
import { PaymentStep } from './PaymentStep'
import { Confirmation } from './Confirmation'
import { Progress } from '../ui/progress'
import { useCreateBooking } from '../../hooks/useCreateBooking'
import { useAuth } from '../../context/AuthContext'
import { Alert, AlertDescription } from '../ui/alert'
import { AlertCircle } from 'lucide-react'

const steps = ['Service', 'Barber', 'Date & Time', 'Your Info', 'Payment', 'Confirm']

export const BookingWizard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    service: null,
    barber: null,
    date: null,
    time: null,
    customer: {
      name: '',
      email: user?.email || '',
      phone: '',
    },
  })

  const createBooking = useCreateBooking()

  const updateBooking = (key, value) => {
    setBookingData(prev => ({ ...prev, [key]: value }))
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, steps.length))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const handleCustomerSubmit = (customerData) => {
    updateBooking('customer', customerData)
    nextStep()
  }

  const handlePaymentSuccess = async () => {
    try {
      // Create the appointment in Supabase
      await createBooking.mutateAsync(bookingData)
      nextStep() // Go to confirmation
    } catch (error) {
      console.error('Failed to create booking:', error)
    }
  }

  // Check if user is logged in for later steps
  const showLoginAlert = step > 3 && !user

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((label, index) => (
            <div
              key={label}
              className={`text-sm font-medium ${
                step > index + 1 ? 'text-secondary' : step === index + 1 ? 'text-primary' : 'text-gray-400'
              }`}
            >
              {label}
            </div>
          ))}
        </div>
        <Progress value={(step / steps.length) * 100} className="h-2" />
      </div>

      {/* Login alert for steps that require authentication */}
      {showLoginAlert && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to be logged in to complete your booking.{' '}
            <button 
              onClick={() => navigate('/login')}
              className="font-medium underline underline-offset-4"
            >
              Login here
            </button>
          </AlertDescription>
        </Alert>
      )}

      {step === 1 && (
        <ServiceSelector
          onSelect={(service) => {
            updateBooking('service', service)
            nextStep()
          }}
        />
      )}

      {step === 2 && (
        <BarberSelector
          selectedService={bookingData.service}
          onSelect={(barber) => {
            updateBooking('barber', barber)
            nextStep()
          }}
          onBack={prevStep}
        />
      )}

      {step === 3 && (
        <DateTimePicker
          selectedService={bookingData.service}
          selectedBarber={bookingData.barber}
          onSelect={(date, time) => {
            updateBooking('date', date)
            updateBooking('time', time)
            nextStep()
          }}
          onBack={prevStep}
        />
      )}

      {step === 4 && (
        <CustomerInfoForm
          initialData={bookingData.customer}
          onSubmit={handleCustomerSubmit}
          onBack={prevStep}
        />
      )}

      {step === 5 && (
        <PaymentStep
          bookingData={bookingData}
          onSuccess={handlePaymentSuccess}
          onBack={prevStep}
          isProcessing={createBooking.isPending}
        />
      )}

      {step === 6 && (
        <Confirmation
          bookingData={bookingData}
          bookingId={createBooking.data?.id}
        />
      )}
    </div>
  )
}