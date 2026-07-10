import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SIDEBAR_LINKS = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: '--' },
    { to: '/admin/editions', label: 'Edicoes', icon: '[]' },
    { to: '/admin/editors', label: 'Editores', icon: '()' },
    { to: '/admin/readers', label: 'Leitores', icon: '@' },
    { to: '/admin/reports', label: 'Relatorios', icon: '#' },
    { to: '/admin/logs', label: 'Logs', icon: '~' },
  ],
  editor: [
    { to: '/admin', label: 'Dashboard', icon: '--' },
    { to: '/admin/editions', label: 'Edicoes', icon: '[]' },
  ],
}

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const links = SIDEBAR_LINKS[user?.role] || []

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="ad-layout">
      <aside className="ad-sidebar">
        <div className="ad-sidebar__brand">
          <span className="ad-sidebar__logo">FITITEL</span>
          <span className="ad-sidebar__role">Gestao</span>
        </div>

        <nav className="ad-sidebar__nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              className={({ isActive }) =>
                `ad-sidebar__link ${isActive ? 'ad-sidebar__link--active' : ''}`
              }
            >
              <span className="ad-sidebar__icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ad-sidebar__footer">
          <div className="ad-sidebar__user">
            <span className="ad-sidebar__user-name">{user?.name}</span>
            <span className="ad-sidebar__user-role">{user?.role === 'admin' ? 'Administrador' : 'Editor'}</span>
          </div>
          <button className="ad-sidebar__logout" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </aside>

      <main className="ad-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
