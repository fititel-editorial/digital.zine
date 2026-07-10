import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/admin/login" replace />
  return children || <Outlet />
}

export const RequireRole = ({ role, children, fallback }) => {
  const { user } = useAuth()
  if (user?.role !== role) {
    return fallback || <Navigate to="/admin" replace />
  }
  return children || <Outlet />
}
