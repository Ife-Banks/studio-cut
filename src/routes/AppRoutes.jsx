import { Routes, Route } from 'react-router-dom'
import { Home } from '../pages/Home'
import { Services } from '../pages/Services'
import { BookingPage } from '../pages/Booking/BookingPage'
import { Login } from '../pages/Auth/Login'
import { Register } from '../pages/Auth/Register'
import { VerificationPending } from '../pages/Auth/VerificationPending'
import { VerificationSuccess } from '../pages/Auth/VerificationSuccess'
import { AdminDashboard } from '../pages/Dashboard/AdminDashboard'
import { ProtectedRoute } from './ProtectedRoute'
import { DebugAuth } from '../pages/DebugAuth'
import { TestProfile } from '../pages/TestProfile'
import { SimpleTest } from '../pages/SimpleTest'
import { BarberDashboard } from '../pages/Dashboard/BarberDashboard'
import { AcceptInvite } from '../pages/Auth/AcceptInvite'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
  path="/barber-dashboard/*"
  element={
    <ProtectedRoute requiredRole="barber">
      <BarberDashboard />
    </ProtectedRoute>
  }
/>
      <Route path="/services" element={<Services />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/accept-invite" element={<AcceptInvite />} />
      <Route path="/verification-pending" element={<VerificationPending />} />
      <Route path="/debug" element={<DebugAuth />} />
      // In AppRoutes.jsx
<Route path="/test-profile" element={<TestProfile />} />
<Route path="/simple-test" element={<SimpleTest />} />
      <Route path="/verification-success" element={<VerificationSuccess />} />
      <Route
      
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}