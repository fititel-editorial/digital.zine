import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MOCK_EDITIONS } from '../../data/mockAdmin'
import { addLog } from '../../data/mockLogs'

const STATUS_MAP = {
  published: { label: 'Publicado', cls: 'ad-badge--success' },
  draft: { label: 'Rascunho', cls: 'ad-badge--warning' },
}

const Editions = () => {
  const navigate = useNavigate()
  const [editions, setEditions] = useState(() => [...MOCK_EDITIONS])
  const [confirmId, setConfirmId] = useState(null)

  const handleDelete = (id) => {
    const target = editions.find((e) => e.id === id)
    if (target) {
      addLog('apagou', 'edicao', id, target.title, `Removeu a edição "${target.title}" do sistema`)
    }
    setEditions((prev) => prev.filter((e) => e.id !== id))
    setConfirmId(null)
  }

  return (
    <div className="ad-editions">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Edicoes</h1>
          <p className="ad-page-desc">{editions.length} revistas no sistema</p>
        </div>
        <Link to="/admin/editions/new" className="ad-btn ad-btn--primary">
          Nova Edicao
        </Link>
      </div>

      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>Vol</th>
              <th>Titulo</th>
              <th>Data</th>
              <th>Editor</th>
              <th>Preco</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {editions.map((ed) => {
              const st = STATUS_MAP[ed.status] || STATUS_MAP.draft
              return (
                <tr key={ed.id}>
                  <td className="ad-table__mono">{ed.vol}</td>
                  <td>
                    <span className="ad-table__title">{ed.title}</span>
                    {ed.pdfFile && <span className="ad-table__sub">PDF anexado</span>}
                  </td>
                  <td className="ad-table__mono">{ed.date}</td>
                  <td>{ed.editor}</td>
                  <td>
                    {ed.isFree ? (
                      <span className="ad-badge ad-badge--success">GRATIS</span>
                    ) : (
                      <span className="ad-table__mono">{ed.price}</span>
                    )}
                  </td>
                  <td><span className={`ad-badge ${st.cls}`}>{st.label}</span></td>
                  <td className="ad-table__actions">
                    <button className="ad-btn-sm" onClick={() => navigate(`/admin/editions/${ed.id}`)}>
                      Ver
                    </button>
                    <button className="ad-btn-sm ad-btn-sm--danger" onClick={() => setConfirmId(ed.id)}>
                      Apagar
                    </button>
                  </td>
                </tr>
              )
            })}
            {editions.length === 0 && (
              <tr>
                <td colSpan="7" className="ad-table__empty">
                  Nenhuma edicao encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {confirmId && (
        <div className="ad-overlay" onClick={() => setConfirmId(null)}>
          <div className="ad-dialog" onClick={(e) => e.stopPropagation()}>
            <p className="ad-dialog__text">Tem certeza que deseja apagar esta edicao?</p>
            <div className="ad-dialog__actions">
              <button className="ad-btn" onClick={() => setConfirmId(null)}>Cancelar</button>
              <button className="ad-btn ad-btn--danger" onClick={() => handleDelete(confirmId)}>Apagar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Editions
