import { useAuth } from '../../context/AuthContext';
export const BarberDashboard = () => {
  const { profile } = useAuth();
  return <div>Barber Dashboard for {profile?.first_name}</div>;
};