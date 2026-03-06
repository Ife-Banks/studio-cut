import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { supabase } from '../../lib/supabase/client';
import { toast } from 'sonner';

const inviteSchema = z.object({
  email: z.string().email('Invalid email'),
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().optional(),
  role: z.enum(['barber', 'admin']),
});

export const InviteStaffForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '', firstName: '', lastName: '', role: 'barber' },
  });

  const onSubmit = async (data) => {
  console.log('Form submitted:', data)  // Add this
  setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-invitation', {
        body: {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          role: data.role,
        },
      });
      if (error) throw error;
      toast.success(`Invitation sent to ${data.email}`);
      form.reset();
      onSuccess?.();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="firstName" render={({ field }) => (
            <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="lastName" render={({ field }) => (
            <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="role" render={({ field }) => (
          <FormItem><FormLabel>Role</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="barber">Barber</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Invitation'}
        </Button>
      </form>
    </Form>
  );
};