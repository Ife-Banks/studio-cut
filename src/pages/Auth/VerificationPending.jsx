import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../../lib/supabase/client'
import { toast } from 'sonner'

export const VerificationPending = () => {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const [resending, setResending] = useState(false)

  const handleResendEmail = async () => {
    if (!email) return
    
    setResending(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })
      
      if (error) throw error
      
      toast.success('Verification email resent! Please check your inbox.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-secondary/10 rounded-full p-3">
              <Mail className="h-12 w-12 text-secondary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-heading">Check Your Email</CardTitle>
          <CardDescription className="text-base mt-2">
            We've sent a verification link to
          </CardDescription>
          <p className="text-lg font-semibold text-primary mt-1">
            {email || 'your email address'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-medium mb-1">📧 Can't find the email?</p>
            <p>Check your spam folder or click below to resend.</p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleResendEmail}
              disabled={resending || !email}
              variant="outline"
              className="w-full"
            >
              {resending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : (
                'Resend Verification Email'
              )}
            </Button>

            <Button asChild variant="ghost" className="w-full">
              <Link to="/login" className="flex items-center justify-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 mt-4">
            You'll need to verify your email before you can log in.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}