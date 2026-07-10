import { createContext, useContext, useState, useCallback } from 'react'

const MOCK_USERS = {
  'admin@fittel.co': { password: 'admin123', name: 'Administrador', role: 'admin' },
  'editor@fittel.co': { password: 'editor123', name: 'Maria Santos', role: 'editor' },
  'joao@email.com': { password: '123456', name: 'João Leitor', role: 'reader', readerId: 1 },
  'ana@email.com': { password: '123456', name: 'Ana Leitora', role: 'reader', readerId: 2 },
}

let nextReaderId = 3

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fittel_user')
      if (saved) return JSON.parse(saved)
    } catch {}
    return null
  })

  const login = useCallback((email, password) => {
    const found = MOCK_USERS[email]
    if (!found || found.password !== password) return false
    const userData = { email, name: found.name, role: found.role }
    if (found.readerId) userData.readerId = found.readerId
    setUser(userData)
    localStorage.setItem('fittel_user', JSON.stringify(userData))
    return true
  }, [])

  const register = useCallback((name, email, password) => {
    if (MOCK_USERS[email]) return false
    const readerId = nextReaderId++
    MOCK_USERS[email] = { password, name, role: 'reader', readerId }
    const userData = { email, name, role: 'reader', readerId }
    setUser(userData)
    localStorage.setItem('fittel_user', JSON.stringify(userData))
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('fittel_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
