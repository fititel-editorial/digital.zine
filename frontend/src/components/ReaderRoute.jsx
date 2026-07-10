import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ReaderRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user || user.role !== 'reader') return <Navigate to="/login" replace />
  return children
}

export default ReaderRoute