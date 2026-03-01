import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Alert, AlertDescription } from '../ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'

export const PaymentStep = ({ bookingData, onSuccess, onBack, isProcessing }) => {
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
  })

  // This will be replaced with actual Stripe integration
  const handlePayment = (e) => {
    e.preventDefault()
    setProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      onSuccess() // This will trigger the booking creation
    }, 2000)
  }

  return (
    <div>
      <h2 className="text-2xl font-heading font-semibold mb-6">Payment</h2>
      
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-600">
          Demo mode: Use any test card number (4242 4242 4242 4242) with any future expiry and any CVC
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form onSubmit={handlePayment}>
            <Card>
              <CardHeader>
                <CardTitle>Card Details</CardTitle>
                <CardDescription>Enter your payment information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input 
                    id="cardNumber" 
                    placeholder="4242 4242 4242 4242" 
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input 
                      id="expiry" 
                      placeholder="MM/YY" 
                      value={formData.expiry}
                      onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input 
                      id="cvc" 
                      placeholder="123" 
                      value={formData.cvc}
                      onChange={(e) => setFormData({...formData, cvc: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{bookingData.service?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Barber:</span>
                  <span className="font-medium">{bookingData.barber?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{bookingData.service?.duration} min</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-secondary">${bookingData.service?.price}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                className="w-full bg-secondary text-primary hover:bg-secondary/90"
                onClick={handlePayment}
                disabled={processing || isProcessing}
              >
                {processing || isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </Button>
              <p className="text-xs text-center text-gray-500">
                Your payment is secure and encrypted
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="flex justify-start pt-8">
        <Button variant="outline" onClick={onBack} disabled={processing}>
          Back
        </Button>
      </div>
    </div>
  )
}