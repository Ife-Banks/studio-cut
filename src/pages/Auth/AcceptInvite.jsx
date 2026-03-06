import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { PasswordInput } from '../../components/ui/password-input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { supabase } from '../../lib/supabase/client';
import { toast } from 'sonner';

const schema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });

export const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { otp: '', password: '', confirmPassword: '' } });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('accept-invitation', {
        body: { email, otp: data.otp, password: data.password },
      });
      if (error) throw error;
      toast.success('Account activated! You can now log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!email) return <div>Invalid invitation link.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>Activate Your Account</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-600">Enter the OTP sent to {email} and set your password.</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="otp" render={({ field }) => (
                <FormItem><FormLabel>OTP Code</FormLabel><FormControl><Input placeholder="123456" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem><FormLabel>Password</FormLabel><FormControl><PasswordInput field={field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><PasswordInput field={field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" disabled={loading} className="w-full">{loading ? 'Activating...' : 'Activate'}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};