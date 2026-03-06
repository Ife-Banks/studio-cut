import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Switch } from '../ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '../ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Pencil, Trash2, Plus, Loader2, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase/client'
import { toast } from 'sonner'
import { Card, CardContent } from '../ui/card'

// Define working hours schema
const workingHoursSchema = z.object({
  monday: z.object({ open: z.string(), close: z.string(), enabled: z.boolean() }),
  tuesday: z.object({ open: z.string(), close: z.string(), enabled: z.boolean() }),
  wednesday: z.object({ open: z.string(), close: z.string(), enabled: z.boolean() }),
  thursday: z.object({ open: z.string(), close: z.string(), enabled: z.boolean() }),
  friday: z.object({ open: z.string(), close: z.string(), enabled: z.boolean() }),
  saturday: z.object({ open: z.string(), close: z.string(), enabled: z.boolean() }),
  sunday: z.object({ open: z.string(), close: z.string(), enabled: z.boolean() }),
})

// Main barber schema
const barberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  specialties: z.string().min(1, 'At least one specialty is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
  working_hours: workingHoursSchema,
})

// Default working hours
const defaultWorkingHours = {
  monday: { open: '09:00', close: '19:00', enabled: true },
  tuesday: { open: '09:00', close: '19:00', enabled: false }, // Closed
  wednesday: { open: '09:00', close: '19:00', enabled: true },
  thursday: { open: '09:00', close: '19:00', enabled: true },
  friday: { open: '09:00', close: '19:00', enabled: true },
  saturday: { open: '09:00', close: '19:00', enabled: true },
  sunday: { open: '10:00', close: '18:00', enabled: true },
}

export const BarberManager = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [editingBarber, setEditingBarber] = useState(null)
  const [showWorkingHours, setShowWorkingHours] = useState(false)
  const queryClient = useQueryClient()

  // Fetch barbers with their profiles
  const { data: barbers, isLoading } = useQuery({
    queryKey: ['barbers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('barbers')
        .select(`
          *,
         profile:profiles!profile_id (
  id,
  email,
  phone,
  first_name,
  last_name
)
        `)
        .order('name')
      
      if (error) throw error
      return data
    }
  })

  // Fetch all users for linking to barbers (admin only)
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, role')
        .eq('role', 'customer') // Only show customers to link as barbers
      
      if (error) throw error
      return data
    }
  })

  // Create barber mutation
  const createMutation = useMutation({
    mutationFn: async (newBarber) => {
      // First, create or get the profile
      let profileId = newBarber.profile_id

      // If no profile selected, create one
      if (!profileId && newBarber.email) {
        // Note: In a real app, you'd need to create an auth user first
        // This is simplified - you might want to invite them via email
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .insert([{
            full_name: newBarber.name,
            email: newBarber.email,
            phone: newBarber.phone,
            role: 'barber'
          }])
          .select()
          .single()
        
        if (profileError) throw profileError
        profileId = profile.id
      }

      // Create barber record
      const { data, error } = await supabase
        .from('barbers')
        .insert([{
          profile_id: profileId,
          name: newBarber.name,
          specialties: newBarber.specialties.split(',').map(s => s.trim()),
          bio: newBarber.bio,
          image_url: newBarber.image_url,
          is_active: newBarber.is_active,
          working_hours: newBarber.working_hours,
        }])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barbers'] })
      toast.success('Barber added successfully')
      setIsOpen(false)
      form.reset()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  // Update barber mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('barbers')
        .update({
          name: updates.name,
          specialties: updates.specialties.split(',').map(s => s.trim()),
          bio: updates.bio,
          image_url: updates.image_url,
          is_active: updates.is_active,
          working_hours: updates.working_hours,
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barbers'] })
      toast.success('Barber updated successfully')
      setIsOpen(false)
      setEditingBarber(null)
      form.reset()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  // Delete barber mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      // Check if barber has appointments
      const { data: appointments, error: checkError } = await supabase
        .from('appointments')
        .select('id')
        .eq('barber_id', id)
        .in('status', ['pending', 'confirmed'])
      
      if (checkError) throw checkError
      
      if (appointments && appointments.length > 0) {
        throw new Error('Cannot delete barber with existing appointments')
      }

      const { error } = await supabase
        .from('barbers')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barbers'] })
      toast.success('Barber deleted successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const form = useForm({
    resolver: zodResolver(barberSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      specialties: '',
      bio: '',
      image_url: '',
      is_active: true,
      working_hours: defaultWorkingHours,
    },
  })

  const onSubmit = (data) => {
    if (editingBarber) {
      updateMutation.mutate({ id: editingBarber.id, ...data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (barber) => {
    setEditingBarber(barber)
    form.reset({
      name: barber.name,
      email: barber.profile?.email || '',
      phone: barber.profile?.phone || '',
      specialties: barber.specialties?.join(', ') || '',
      bio: barber.bio || '',
      image_url: barber.image_url || '',
      is_active: barber.is_active,
      working_hours: barber.working_hours || defaultWorkingHours,
    })
    setIsOpen(true)
  }

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteMutation.mutate(id)
    }
  }

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'B'
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Manage Barbers</h3>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) {
            setEditingBarber(null)
            form.reset()
            setShowWorkingHours(false)
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Barber
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBarber ? 'Edit Barber' : 'Add New Barber'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormDescription>
                          Optional: Create account for barber
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="specialties"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialties</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Fades, Beard Trims, Hair Coloring (comma separated)"
                        />
                      </FormControl>
                      <FormDescription>
                        Separate specialties with commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Experience, style, personality..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/photo.jpg" />
                      </FormControl>
                      <FormDescription>
                        Optional: Add a URL to the barber's photo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Working Hours Toggle */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Working Hours</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowWorkingHours(!showWorkingHours)}
                    >
                      {showWorkingHours ? 'Hide' : 'Configure'}
                    </Button>
                  </div>
                  
                  {showWorkingHours && (
                    <div className="space-y-3 mt-4">
                      {Object.entries(defaultWorkingHours).map(([day, hours]) => (
                        <div key={day} className="flex items-center space-x-4">
                          <FormField
                            control={form.control}
                            name={`working_hours.${day}.enabled`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="capitalize w-20">
                                  {day.slice(0, 3)}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex items-center space-x-2 flex-1">
                            <FormField
                              control={form.control}
                              name={`working_hours.${day}.open`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input 
                                      type="time" 
                                      {...field}
                                      disabled={!form.watch(`working_hours.${day}.enabled`)}
                                      className="w-24"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <span>to</span>
                            <FormField
                              control={form.control}
                              name={`working_hours.${day}.close`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input 
                                      type="time" 
                                      {...field}
                                      disabled={!form.watch(`working_hours.${day}.enabled`)}
                                      className="w-24"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Active</FormLabel>
                        <div className="text-sm text-gray-500">
                          Barber will be available for bookings
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingBarber ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Barber</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Specialties</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Working Hours</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {barbers?.map((barber) => (
              <TableRow key={barber.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={barber.image_url} />
                      <AvatarFallback>{getInitials(barber.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{barber.name}</div>
                      <div className="text-sm text-gray-500">ID: {barber.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {barber.profile?.email && (
                      <div>{barber.profile.email}</div>
                    )}
                    {barber.profile?.phone && (
                      <div className="text-gray-500">{barber.profile.phone}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {barber.specialties?.map((specialty, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    barber.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {barber.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    {barber.working_hours ? (
                      <div className="space-y-1">
                        {Object.entries(barber.working_hours)
                          .filter(([_, hours]) => hours.enabled)
                          .slice(0, 2)
                          .map(([day, hours]) => (
                            <div key={day} className="capitalize">
                              {day.slice(0,3)}: {hours.open} - {hours.close}
                            </div>
                          ))}
                        {Object.entries(barber.working_hours).filter(([_, hours]) => hours.enabled).length > 2 && (
                          <div className="text-gray-400">+ more</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">Not set</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(barber)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(barber.id, barber.name)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {barbers?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No barbers yet. Click "Add Barber" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}