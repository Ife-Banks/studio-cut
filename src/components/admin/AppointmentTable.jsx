import { useState } from 'react'
import { format } from 'date-fns'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '../ui/dropdown-menu'
import { Input } from '../ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { MoreHorizontal, Search, Loader2 } from 'lucide-react'
import { useAppointments, useUpdateAppointmentStatus } from '../../hooks/useAppointments'
import { useBarbers } from '../../hooks/useBarbers'

export const AppointmentTable = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [barberFilter, setBarberFilter] = useState('all')
  
  const { data: appointments, isLoading } = useAppointments()
  const { data: barbers } = useBarbers()
  const updateStatus = useUpdateAppointmentStatus()

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    }
    return <Badge className={variants[status]}>{status}</Badge>
  }

  const filteredAppointments = appointments?.filter(apt => {
    const matchesSearch = 
      apt.customer?.first_name + ' ' + apt.customer?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      apt.customer?.email?.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter
    const matchesBarber = barberFilter === 'all' || apt.barber_id === parseInt(barberFilter)
    
    return matchesSearch && matchesStatus && matchesBarber
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={barberFilter} onValueChange={setBarberFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by barber" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Barbers</SelectItem>
            {barbers?.map(barber => (
              <SelectItem key={barber.id} value={barber.id.toString()}>
                {barber.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Barber</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments?.map((apt) => (
              <TableRow key={apt.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{apt.customer?.full_name}</div>
                    <div className="text-sm text-gray-500">{apt.customer?.email}</div>
                  </div>
                </TableCell>
                <TableCell>{apt.service?.name}</TableCell>
                <TableCell>{apt.barber?.name}</TableCell>
                <TableCell>
                  {format(new Date(apt.start_time), 'MMM d, yyyy h:mm a')}
                </TableCell>
                <TableCell>{getStatusBadge(apt.status)}</TableCell>
                <TableCell>
                  <Badge variant={apt.payment_status === 'paid' ? 'default' : 'secondary'}>
                    {apt.payment_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => updateStatus.mutate({ id: apt.id, status: 'confirmed' })}
                        disabled={apt.status === 'confirmed'}
                      >
                        Confirm
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => updateStatus.mutate({ id: apt.id, status: 'completed' })}
                        disabled={apt.status === 'completed'}
                      >
                        Mark Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => updateStatus.mutate({ id: apt.id, status: 'cancelled' })}
                        disabled={apt.status === 'cancelled'}
                        className="text-red-600"
                      >
                        Cancel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredAppointments?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No appointments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}