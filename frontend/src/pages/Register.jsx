import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { register, user } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirm: false })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (user) navigate('/library', { replace: true })
  }, [user, navigate])

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))
  const blur = (field) => () => setTouched((p) => ({ ...p, [field]: true }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ name: true, email: true, password: true, confirm: true })

    if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.confirm.trim()) return
    if (form.password !== form.confirm) {
      setError('As palavras-passe não coincidem.')
      return
    }
    if (form.password.length < 4) {
      setError('A palavra-passe deve ter pelo menos 4 caracteres.')
      return
    }

    setSubmitting(true)
    setError('')

    const ok = register(form.name, form.email, form.password)
    if (ok) {
      navigate('/library')
    } else {
      setError('Este email já está registado.')
      setSubmitting(false)
    }
  }

  return (
    <main className="login">
      <div className="login__inner container">
        <div className="login__panel">
          <div className="login__header">
            <span className="login__eyebrow">[REGISTER]</span>
            <h1 className="login__title">Criar conta</h1>
            <p className="login__subtitle">Aceda a todas as edições da FITITEL</p>
          </div>

          {error && (
            <div className="login__error">
              <span className="login__error-icon">!</span>
              {error}
            </div>
          )}

          <form className="login__form" onSubmit={handleSubmit} noValidate>
            <div className="login__field">
              <label className="login__label" htmlFor="name">Nome</label>
              <input
                id="name"
                type="text"
                className={`login__input ${touched.name && !form.name.trim() ? 'login__input--error' : ''}`}
                placeholder="O seu nome"
                value={form.name}
                onChange={set('name')}
                onBlur={blur('name')}
                autoComplete="name"
                autoFocus
              />
              {touched.name && !form.name.trim() && (
                <span className="login__field-error">Indique o seu nome</span>
              )}
            </div>

            <div className="login__field">
              <label className="login__label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className={`login__input ${touched.email && !form.email.trim() ? 'login__input--error' : ''}`}
                placeholder="seu@email.com"
                value={form.email}
                onChange={set('email')}
                onBlur={blur('email')}
                autoComplete="email"
              />
              {touched.email && !form.email.trim() && (
                <span className="login__field-error">Indique o seu email</span>
              )}
            </div>

            <div className="login__field">
              <label className="login__label" htmlFor="password">Palavra-passe</label>
              <input
                id="password"
                type="password"
                className={`login__input ${touched.password && !form.password.trim() ? 'login__input--error' : ''}`}
                placeholder="Mínimo 4 caracteres"
                value={form.password}
                onChange={set('password')}
                onBlur={blur('password')}
                autoComplete="new-password"
              />
              {touched.password && !form.password.trim() && (
                <span className="login__field-error">Introduza uma palavra-passe</span>
              )}
            </div>

            <div className="login__field">
              <label className="login__label" htmlFor="confirm">Confirmar palavra-passe</label>
              <input
                id="confirm"
                type="password"
                className={`login__input ${touched.confirm && (!form.confirm.trim() || form.password !== form.confirm) ? 'login__input--error' : ''}`}
                placeholder="Repita a palavra-passe"
                value={form.confirm}
                onChange={set('confirm')}
                onBlur={blur('confirm')}
                autoComplete="new-password"
              />
              {touched.confirm && !form.confirm.trim() && (
                <span className="login__field-error">Confirme a palavra-passe</span>
              )}
              {touched.confirm && form.confirm.trim() && form.password !== form.confirm && (
                <span className="login__field-error">As palavras-passe não coincidem</span>
              )}
            </div>

            <button
              type="submit"
              className="btn login__submit"
              disabled={submitting}
            >
              {submitting ? 'A criar conta...' : 'Criar conta'}
            </button>
          </form>

          <div className="login__footer">
            <p className="login__register">
              Já tem conta?{' '}
              <Link to="/login" className="login__register-link">Entrar</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Register