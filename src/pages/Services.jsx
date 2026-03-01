import { Link } from 'react-router-dom'
import { useServices } from '../hooks/useServices'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'

export const Services = () => {
  const { data: services, isLoading } = useServices()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    )
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional barbering and grooming services delivered with precision and care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service) => (
            <Card key={service.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-heading text-xl">{service.name}</CardTitle>
                <CardDescription>{service.duration} minutes</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-2xl font-bold text-secondary">${service.price}</span>
                <Button asChild>
                  <Link to="/booking">Book Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}