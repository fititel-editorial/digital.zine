import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MOCK_READERS } from '../../data/mockReaders'
import { MOCK_EDITIONS } from '../../data/mockAdmin'
import { getPurchasesByReader } from '../../data/mockPurchases'
import { getFavoritesByReader } from '../../data/mockFavorites'
import { getCommentsByReader } from '../../data/mockReaderComments'

const Readers = () => {
  const navigate = useNavigate()
  const [readers] = useState(() => [...MOCK_READERS])

  const readerStats = readers.map(r => ({
    ...r,
    purchases: getPurchasesByReader(r.id),
    favorites: getFavoritesByReader(r.id),
    commentCount: getCommentsByReader(r.id).length,
  }))

  return (
    <div className="ad-editions">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Leitores</h1>
          <p className="ad-page-desc">{readers.length} contas registadas</p>
        </div>
      </div>

      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Compras</th>
              <th>Favoritos</th>
              <th>Comentarios</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {readerStats.map((r) => (
              <tr key={r.id}>
                <td><span className="ad-table__title">{r.name}</span></td>
                <td className="ad-table__mono">{r.email}</td>
                <td><span className="ad-badge ad-badge--info">{r.purchases.length}</span></td>
                <td><span className="ad-badge ad-badge--info">{r.favorites.length}</span></td>
                <td><span className="ad-badge ad-badge--info">{r.commentCount}</span></td>
                <td className="ad-table__actions">
                  <button className="ad-btn-sm" onClick={() => navigate(`/admin/readers/${r.id}`)}>Ver</button>
                </td>
              </tr>
            ))}
            {readers.length === 0 && (
              <tr>
                <td colSpan="6" className="ad-table__empty">Nenhum leitor encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Readers