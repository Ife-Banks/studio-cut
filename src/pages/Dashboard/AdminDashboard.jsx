import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { AppointmentTable } from '../../components/admin/AppointmentTable'
import { ServiceManager } from '../../components/admin/ServiceManager'
import { BarberManager } from '../../components/admin/BarberManager'
import { useAppointments } from '../../hooks/useAppointments'
import { format, startOfDay, endOfDay } from 'date-fns'

export const AdminDashboard = () => {
  const location = useLocation()
  const currentTab = location.hash.replace('#', '') || 'appointments'
  
  // Fetch today's appointments for stats
  const today = new Date()
  const { data: todayAppointments } = useAppointments({
    startDate: startOfDay(today).toISOString(),
    endDate: endOfDay(today).toISOString()
  })

  // Calculate today's revenue
  const todayRevenue = todayAppointments?.reduce((sum, apt) => {
    return apt.payment_status === 'paid' ? sum + (apt.services?.price || 0) : sum
  }, 0) || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your barbershop</p>
          </div>
          <Button asChild>
            <Link to="/booking">+ New Booking</Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{todayAppointments?.length || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                {format(today, 'EEEE, MMMM d')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Today's Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${todayRevenue}</div>
              <p className="text-xs text-green-600 mt-1">
                From paid appointments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Barbers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
              <p className="text-xs text-gray-500 mt-1">
                Currently working
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <Tabs value={currentTab} onValueChange={(value) => window.location.hash = value}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="barbers">Barbers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointments">
            <AppointmentTable />
          </TabsContent>
          
          <TabsContent value="services">
            <ServiceManager />
          </TabsContent>
          
          <TabsContent value="barbers">
            <BarberManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}