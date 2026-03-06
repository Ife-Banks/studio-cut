import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { CheckCircle2, LogIn } from 'lucide-react'

export const VerificationSuccess = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-heading">Email Verified!</CardTitle>
          <CardDescription className="text-base mt-2">
            Your email has been successfully verified.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Button asChild className="w-full">
            <Link to="/login" className="flex items-center justify-center">
              <LogIn className="mr-2 h-4 w-4" />
              Continue to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}