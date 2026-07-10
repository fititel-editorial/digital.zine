import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ReaderLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="rl-layout">
      <header className="rl-header">
        <div className="rl-header__inner container">
          <Link to="/" className="rl-header__brand">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Revista<span>FITITEL</span>
          </Link>
          <nav className="rl-header__nav">
            <Link to="/library" className="rl-header__link rl-header__link--active">A minha biblioteca</Link>
            <span className="rl-header__user">{user?.name}</span>
            <button className="rl-header__logout" onClick={handleLogout}>Sair</button>
          </nav>
        </div>
      </header>
      <main className="rl-content">
        <Outlet />
      </main>
    </div>
  )
}

export default ReaderLayout