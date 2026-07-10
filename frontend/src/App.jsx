import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAuth, AuthProvider } from './context/AuthContext'
import { ProtectedRoute, RequireRole } from './components/ProtectedRoute'
import ReaderRoute from './components/ReaderRoute'
import AdminLayout from './components/AdminLayout'
import Home from './pages/Home'
import EditionDetails from './pages/EditionDetails'
import FlipbookViewer from './pages/FlipbookViewer'
import Login from './pages/Login'
import Register from './pages/Register'
import ReaderLayout from './pages/reader/ReaderLayout'
import Library from './pages/reader/Library'
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import Editions from './pages/admin/Editions'
import EditionForm from './pages/admin/EditionForm'
import EditionDetail from './pages/admin/EditionDetail'
import Editors from './pages/admin/Editors'
import EditorForm from './pages/admin/EditorForm'
import EditorDetail from './pages/admin/EditorDetail'
import Reports from './pages/admin/Reports'
import Logs from './pages/admin/Logs'
import ReaderDetail from './pages/admin/ReaderDetail'
import Readers from './pages/admin/Readers'

const Header = () => {
  const location = useLocation()
  const { user } = useAuth()
  const isDetail = location.pathname.startsWith('/edition/')
  const isReader = user?.role === 'reader'
  const [menuOpen, setMenuOpen] = useState(false)

  // Hide header inside the flipbook viewer and admin area
  if (location.pathname.includes('/flipbook') || location.pathname.startsWith('/admin')) return null

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="header">
      <div className="header__inner">
        {isDetail && (
          <Link to="/" className="header__back">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Voltar
          </Link>
        )}
        <Link to="/" className="header__logo">
          Revista<span>FITITEL</span>
        </Link>
        <nav className="header__nav" aria-label="Navegação principal">
          {menuOpen && (
            <div className="header__drawer-backdrop" onClick={closeMenu} />
          )}
          <div className={`header__nav-links${menuOpen ? ' header__nav-links--open' : ''}`}>
            <a href="#editions" className="header__nav-link" onClick={closeMenu}>Edições</a>
            <a href="#about" className="header__nav-link" onClick={closeMenu}>Sobre</a>
            {isReader ? (
              <>
                <Link to="/library" className="header__nav-link" onClick={closeMenu}>Biblioteca</Link>
                <span className="header__reader-name">{user.name}</span>
              </>
            ) : (
              <Link to="/login" className="header__nav-link header__nav-link--cta" onClick={closeMenu}>Entrar</Link>
            )}
          </div>
          <button
            className={`header__menu-toggle${menuOpen ? ' header__menu-toggle--open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </div>
    </header>
  )
}

const Footer = () => {
  const location = useLocation()
  // Hide footer inside the flipbook viewer and admin area
  if (location.pathname.includes('/flipbook') || location.pathname.startsWith('/admin')) return null

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__col">
          <div className="footer__brand-name">Revista<span>FITITEL</span></div>
          <p className="footer__brand-desc">
            O seu passaporte para o epicentro da inovação, literacia tecnológica
            e disrupção criativa em Angola.
          </p>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Plataforma</h4>
          <div className="footer__links">
            <Link to="/" className="footer__link">Últimas edições</Link>
            <a href="#editions" className="footer__link">Edições Anteriores</a>
          </div>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Legal</h4>
          <div className="footer__links">
            <a href="#" className="footer__link">Termos de Uso</a>
            <a href="#" className="footer__link">Política de Privacidade</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">
          &copy; 2026 FITITEL. Todos os direitos reservados.
        </p>
        <p className="footer__location">
          Angola, Luanda
          <span className="footer__sep">|</span>
          <a href="/admin/login" className="footer__admin-link">Acesso da equipa</a>
        </p>
      </div>
    </footer>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="editions" element={<Editions />} />
            <Route path="editions/new" element={<EditionForm />} />
            <Route path="editions/:id/edit" element={<EditionForm />} />
            <Route path="editions/:id" element={<EditionDetail />} />
            <Route path="editors" element={<RequireRole role="admin"><Editors /></RequireRole>} />
            <Route path="editors/new" element={<RequireRole role="admin"><EditorForm /></RequireRole>} />
            <Route path="editors/:id/edit" element={<RequireRole role="admin"><EditorForm /></RequireRole>} />
            <Route path="editors/:id" element={<RequireRole role="admin"><EditorDetail /></RequireRole>} />
            <Route path="reports" element={<RequireRole role="admin"><Reports /></RequireRole>} />
            <Route path="logs" element={<RequireRole role="admin"><Logs /></RequireRole>} />
            <Route path="readers" element={<RequireRole role="admin"><Readers /></RequireRole>} />
            <Route path="readers/:id" element={<RequireRole role="admin"><ReaderDetail /></RequireRole>} />
          </Route>
          <Route path="/login" element={<><Header /><Login /><Footer /></>} />
          <Route path="/register" element={<><Header /><Register /><Footer /></>} />
          <Route path="/library" element={<ReaderRoute><ReaderLayout /></ReaderRoute>}>
            <Route index element={<Library />} />
          </Route>
          <Route path="*" element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/edition/:id" element={<EditionDetails />} />
                <Route path="/edition/:id/flipbook" element={<FlipbookViewer />} />
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
