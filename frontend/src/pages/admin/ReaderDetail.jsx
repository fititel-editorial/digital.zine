import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MOCK_READERS } from '../../data/mockReaders'
import { MOCK_EDITIONS } from '../../data/mockAdmin'
import { getPurchasesByReader } from '../../data/mockPurchases'
import { getFavoritesByReader } from '../../data/mockFavorites'
import { getCommentsByReader } from '../../data/mockReaderComments'

const TABS = [
  { key: 'purchases', label: 'Compras' },
  { key: 'favorites', label: 'Favoritos' },
  { key: 'comments', label: 'Comentarios' },
]

const ReaderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('purchases')
  const reader = MOCK_READERS.find((r) => r.id === Number(id))

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (!reader) {
    return (
      <div className="ad-editions">
        <div className="ad-page-header">
          <div>
            <h1 className="ad-page-title">Leitor nao encontrado</h1>
            <p className="ad-page-desc">Nao foi possivel encontrar o leitor com ID #{id}</p>
          </div>
          <button className="ad-btn" onClick={() => navigate('/admin/readers')}>Voltar</button>
        </div>
      </div>
    )
  }

  const purchases = getPurchasesByReader(reader.id)
  const favorites = getFavoritesByReader(reader.id)
  const comments = getCommentsByReader(reader.id)

  const purchasedEditions = purchases.map(p => MOCK_EDITIONS.find(e => e.id === p.editionId)).filter(Boolean)
  const favoriteEditions = favorites.map(f => MOCK_EDITIONS.find(e => e.id === f.editionId)).filter(Boolean)

  return (
    <div className="ad-editions">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">{reader.name}</h1>
          <p className="ad-page-desc">{reader.email}</p>
        </div>
        <div className="ad-page-actions">
          <button className="ad-btn" onClick={() => navigate('/admin/readers')}>Voltar</button>
        </div>
      </div>

      <div className="ad-detail">
        <div className="ad-detail__section">
          <div className="ad-detail__grid">
            <div className="ad-detail__block">
              <span className="ad-detail__block-key">Nome</span>
              <span className="ad-detail__block-value">{reader.name}</span>
            </div>
            <div className="ad-detail__block">
              <span className="ad-detail__block-key">Email</span>
              <span className="ad-detail__block-value ad-table__mono">{reader.email}</span>
            </div>
            <div className="ad-detail__block">
              <span className="ad-detail__block-key">ID</span>
              <span className="ad-detail__block-value ad-table__mono">#{reader.id}</span>
            </div>
          </div>
        </div>

        <div className="ad-detail__section">
          <div className="ad-rd-tabs">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`ad-rd-tab ${activeTab === tab.key ? 'ad-rd-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                <span className="ad-rd-tab__count">
                  {tab.key === 'purchases' ? purchases.length : tab.key === 'favorites' ? favorites.length : comments.length}
                </span>
              </button>
            ))}
          </div>

          {activeTab === 'purchases' && (
            <div>
              {purchasedEditions.length > 0 ? (
                <div className="ad-detail__editions-list">
                  {purchasedEditions.map((ed) => (
                    <Link key={ed.id} to={`/admin/editions/${ed.id}`} className="ad-detail__edition-row">
                      <span className="ad-detail__edition-vol ad-table__mono">Vol. {ed.vol}</span>
                      <div>
                        <span className="ad-detail__edition-title">{ed.title}</span>
                        <span className="ad-detail__edition-date">{ed.date}</span>
                      </div>
                      <span className="ad-detail__edition-arrow">&rarr;</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="ad-detail__text" style={{ color: 'var(--text-tertiary)' }}>Nenhuma compra efectuada.</p>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              {favoriteEditions.length > 0 ? (
                <div className="ad-detail__editions-list">
                  {favoriteEditions.map((ed) => (
                    <Link key={ed.id} to={`/admin/editions/${ed.id}`} className="ad-detail__edition-row">
                      <span className="ad-detail__edition-vol ad-table__mono">Vol. {ed.vol}</span>
                      <div>
                        <span className="ad-detail__edition-title">{ed.title}</span>
                        <span className="ad-detail__edition-date">{ed.date}</span>
                      </div>
                      <span className="ad-detail__edition-arrow">&rarr;</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="ad-detail__text" style={{ color: 'var(--text-tertiary)' }}>Nenhum favorito adicionado.</p>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div>
              {comments.length > 0 ? (
                <div className="ad-rd-comments">
                  {comments.map((c) => {
                    const ed = MOCK_EDITIONS.find(e => e.id === c.editionId)
                    return (
                      <div key={c.id} className="ad-rd-comment">
                        <div className="ad-rd-comment__header">
                          <Link to={`/admin/editions/${c.editionId}`} className="ad-rd-comment__edition">
                            Vol. {ed?.vol || c.editionId} &mdash; {ed?.title || 'Edicao'}
                          </Link>
                          <span className="ad-rd-comment__date">{c.date}</span>
                        </div>
                        <p className="ad-rd-comment__text">{c.text}</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="ad-detail__text" style={{ color: 'var(--text-tertiary)' }}>Nenhum comentario feito.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReaderDetail