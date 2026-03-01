import { Routes, Route } from 'react-router-dom'
import { Home } from '../pages/Home'
import { Services } from '../pages/Services'
import { BookingPage } from '../pages/Booking/BookingPage'
import { Login } from '../pages/Auth/Login'
import { Register } from '../pages/Auth/Register'
import { AdminDashboard } from '../pages/Dashboard/AdminDashboard'
import { ProtectedRoute } from './ProtectedRoute'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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