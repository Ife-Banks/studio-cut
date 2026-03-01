import { BookingWizard } from '../../components/booking/BookingWizard'

export const BookingPage = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-center mb-8">
          Book Your Appointment
        </h1>
        <BookingWizard />
      </div>
    </div>
  )
}