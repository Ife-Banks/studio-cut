import { useBarbers } from '../../hooks/useBarbers'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export const BarberSelector = ({ selectedService, onSelect, onBack }) => {
  const { data: barbers, isLoading } = useBarbers()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-heading font-semibold mb-6">Choose Your Barber</h2>
      <p className="text-gray-600 mb-6">
        All our barbers are trained by Edward and skilled in {selectedService?.name?.toLowerCase() || 'all services'}.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {barbers?.map((barber) => (
          <Card key={barber.id} className="cursor-pointer hover:border-secondary transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={barber.image} />
                <AvatarFallback>{barber.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="font-heading">{barber.name}</CardTitle>
                <p className="text-sm text-gray-500">{barber.specialties?.join(', ')}</p>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => onSelect(barber)}
              >
                Select
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-start pt-8">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  )
}