import { useServices } from '../../hooks/useServices'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'

export const ServiceSelector = ({ onSelect }) => {
  const { data: services, isLoading } = useServices()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-heading font-semibold mb-6">Select a Service</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services?.map((service) => (
          <Card
            key={service.id}
            className="cursor-pointer hover:border-secondary transition-all hover:shadow-lg"
            onClick={() => onSelect(service)}
          >
            <CardHeader>
              <CardTitle className="font-heading">{service.name}</CardTitle>
              <CardDescription>{service.duration} minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-secondary">${service.price}</span>
                <Button variant="ghost" className="text-secondary">Select →</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}