import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getPurchasesByReader } from '../../data/mockPurchases'
import { getFavoritesByReader } from '../../data/mockFavorites'
import { MOCK_EDITIONS } from '../../data/mockAdmin'

const TABS = [
  { key: 'purchases', label: 'As minhas revistas' },
  { key: 'favorites', label: 'Favoritas' },
]

const Library = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('purchases')

  const purchasedIds = useMemo(() => {
    if (!user) return []
    return getPurchasesByReader(user.readerId).map(p => p.editionId)
  }, [user])

  const favoriteIds = useMemo(() => {
    if (!user) return []
    return getFavoritesByReader(user.readerId).map(f => f.editionId)
  }, [user])

  const purchased = useMemo(() => {
    return MOCK_EDITIONS.filter(e => purchasedIds.includes(e.id))
  }, [purchasedIds])

  const favorites = useMemo(() => {
    return MOCK_EDITIONS.filter(e => favoriteIds.includes(e.id))
  }, [favoriteIds])

  const items = activeTab === 'purchases' ? purchased : favorites
  const empty = activeTab === 'purchases'
    ? 'Ainda não comprou nenhuma edição.'
    : 'Ainda não tem edições favoritas.'

  return (
    <div className="rl-page container">
      <div className="rl-page__header">
        <h1 className="rl-page__title">A minha biblioteca</h1>
        <p className="rl-page__subtitle">{user?.name}</p>
      </div>

      <div className="rl-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`rl-tab ${activeTab === tab.key ? 'rl-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            <span className="rl-tab__count">
              {tab.key === 'purchases' ? purchased.length : favorites.length}
            </span>
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="rl-empty">
          <div className="system-log" style={{ maxWidth: 500, margin: '60px auto' }}>
            <div className="system-log__header">
              <span className="system-log__prompt">user@fittel:~$</span>
              <span className="system-log__cmd">ls {activeTab}/</span>
            </div>
            <div className="system-log__body">
              <p style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                [EMPTY] {empty}
              </p>
              <Link to="/" className="log-action" style={{ marginTop: 12, display: 'inline-block' }}>
                ➔ [VER_EDICOES]
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="rl-grid">
          {items.map(ed => (
            <Link to={`/edition/${ed.id}`} key={ed.id} className="rl-card">
              <div className="rl-card__cover">
                <img src={ed.cover} alt={ed.title} />
              </div>
              <div className="rl-card__info">
                <span className="rl-card__vol">FITITEL Nº {ed.vol}</span>
                <h3 className="rl-card__title">{ed.title}</h3>
                <span className="rl-card__meta">{ed.date} • {ed.pages} págs.</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Library