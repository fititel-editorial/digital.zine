import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminLogin = () => {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false })

  useEffect(() => {
    document.body.style.background = '#0B1120'
    return () => { document.body.style.background = '' }
  }, [])

  if (user) return <Navigate to="/admin" replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (!email.trim() || !password.trim()) return

    if (login(email.trim(), password.trim())) {
      navigate('/admin', { replace: true })
    } else {
      setError('Credenciais invalidas. Tente novamente.')
    }
  }

  return (
    <div className="ad-login">
      <div className="ad-login__panel">
        <div className="ad-login__header">
          <div className="ad-login__logo">
            FITITEL <span>Gestao</span>
          </div>
          <p className="ad-login__desc">
            Acesso reservado a equipa editorial
          </p>
        </div>

        <form className="ad-login__form" onSubmit={handleSubmit} noValidate>
          {error && <div className="ad-login__error">{error}</div>}

          <div className="ad-login__field">
            <label className="ad-login__label" htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              className={`ad-login__input ${touched.email && !email.trim() ? 'ad-login__input--error' : ''}`}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              onBlur={() => setTouched((p) => ({ ...p, email: true }))}
              autoFocus
            />
          </div>

          <div className="ad-login__field">
            <label className="ad-login__label" htmlFor="admin-password">Palavra-passe</label>
            <input
              id="admin-password"
              type="password"
              className={`ad-login__input ${touched.password && !password.trim() ? 'ad-login__input--error' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              onBlur={() => setTouched((p) => ({ ...p, password: true }))}
            />
          </div>

          <button type="submit" className="ad-login__submit">
            Entrar
          </button>
        </form>

        <div className="ad-login__hint">
          <span className="ad-login__hint-prompt">admin@fittel.co</span>
          <span className="ad-login__hint-sep">/</span>
          <span className="ad-login__hint-prompt">editor@fittel.co</span>
          <span className="ad-login__hint-text"> palavra-passe: admin123 / editor123</span>
        </div>

        <a href="/" className="ad-login__back">Voltar ao site</a>
      </div>
    </div>
  )
}

export default AdminLogin
