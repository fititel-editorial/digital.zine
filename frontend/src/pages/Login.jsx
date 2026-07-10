import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (user) navigate('/library', { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })

    if (!email.trim() || !password.trim()) return

    setSubmitting(true)
    setError('')

    const ok = login(email, password)
    if (ok) {
      navigate('/library')
    } else {
      setError('Email ou palavra-passe incorrectos.')
      setSubmitting(false)
    }
  }

  return (
    <main className="login">
      <div className="login__inner container">
        <div className="login__panel">
          <div className="login__header">
            <span className="login__eyebrow">[AUTH_GATE]</span>
            <h1 className="login__title">Entrar</h1>
            <p className="login__subtitle">Aceda à sua conta de leitor</p>
          </div>

          {error && (
            <div className="login__error">
              <span className="login__error-icon">!</span>
              {error}
            </div>
          )}

          <form className="login__form" onSubmit={handleSubmit} noValidate>
            <div className="login__field">
              <label className="login__label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className={`login__input ${touched.email && !email.trim() ? 'login__input--error' : ''}`}
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                autoComplete="email"
                autoFocus
              />
              {touched.email && !email.trim() && (
                <span className="login__field-error">Indique o seu email</span>
              )}
            </div>

            <div className="login__field">
              <label className="login__label" htmlFor="password">Palavra-passe</label>
              <input
                id="password"
                type="password"
                className={`login__input ${touched.password && !password.trim() ? 'login__input--error' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                autoComplete="current-password"
              />
              {touched.password && !password.trim() && (
                <span className="login__field-error">Introduza a sua palavra-passe</span>
              )}
            </div>

            <button
              type="submit"
              className="btn login__submit"
              disabled={submitting}
            >
              {submitting ? 'A entrar...' : 'Entrar'}
            </button>
          </form>

          <div className="login__footer">
            <div className="login__demo">
              <span className="login__demo-prompt">user@fittel:~$</span>
              <span className="login__demo-cmd">demo auth --list</span>
            </div>
            <p className="login__demo-accounts">
              Demo: joao@email.com / 123456 &nbsp;|&nbsp; ana@email.com / 123456
            </p>
            <p className="login__register">
              Ainda não tem conta?{' '}
              <Link to="/register" className="login__register-link">Criar conta</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login
