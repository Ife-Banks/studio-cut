import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export const Home = () => {
  const features = [
    {
      title: 'Expert Team',
      description: 'Experienced professionals committed to delivering fresh, flawless cuts.'
    },
    {
      title: 'Affordable Prices',
      description: 'Professional barbering and grooming at fair and competitive rates.'
    },
    {
      title: 'Customer Focus',
      description: 'Personalized, detail-driven barbering for every client.'
    },
    {
      title: 'Serene Environment',
      description: 'Relax in a clean, modern space and leave looking your best.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-primary text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
            mixBlendMode: 'overlay'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">
              Welcome to The Cut Studio
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Walk in for a crisp cut by top barbers personally trained by .... 
              Book ahead to be in the cut with ... himself.
            </p>
            <div className="flex space-x-4">
              <Button asChild size="lg" className="bg-secondary text-primary hover:bg-secondary/90">
                <Link to="/booking">Book Appointment</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-primary hover:text-white border-white hover:bg-white/10">
                <Link to="/services">Our Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Why Choose The Cut Studio?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="font-heading">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-4">
                Every cut is a statement.
              </h2>
              <p className="text-gray-300 mb-6">
                Our team, led by ..., blends skill, creativity, and precision to deliver 
                sharp fades, modern styles, and timeless looks. Whether it's your regular trim 
                or a bold transformation, we make sure you leave looking and feeling your best.
              </p>
              <Button asChild className="bg-secondary text-primary hover:bg-secondary/90">
                <Link to="/booking">Book Now</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80" 
                alt="Barber working"
                className="rounded-lg shadow-xl"
              />
              <img 
                src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80" 
                alt="Barbershop interior"
                className="rounded-lg shadow-xl mt-8"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}