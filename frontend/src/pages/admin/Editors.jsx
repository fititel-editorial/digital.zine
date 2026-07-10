import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MOCK_EDITORS } from '../../data/mockAdmin'
import { addLog } from '../../data/mockLogs'

const STATUS_CONFIG = {
  active: { label: 'Ativo', cls: 'ad-badge--success' },
  inactive: { label: 'Inativo', cls: 'ad-badge--muted' },
}

const Editors = () => {
  const navigate = useNavigate()
  const [editors, setEditors] = useState(() => [...MOCK_EDITORS])
  const [confirmId, setConfirmId] = useState(null)

  const handleDelete = (id) => {
    const target = editors.find((e) => e.id === id)
    if (target) {
      addLog('apagou', 'editor', id, target.name, `Removeu o editor "${target.name}" (${target.email}) do sistema`)
    }
    setEditors((prev) => prev.filter((e) => e.id !== id))
    setConfirmId(null)
  }

  return (
    <div className="ad-editions">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Editores</h1>
          <p className="ad-page-desc">{editors.length} contas registadas</p>
        </div>
        <Link to="/admin/editors/new" className="ad-btn ad-btn--primary">
          Novo Editor
        </Link>
      </div>

      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Edicoes Geridas</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {editors.map((ed) => {
              const st = STATUS_CONFIG[ed.status] || STATUS_CONFIG.inactive
              return (
                <tr key={ed.id}>
                  <td><span className="ad-table__title">{ed.name}</span></td>
                  <td className="ad-table__mono">{ed.email}</td>
                  <td><span className={`ad-badge ${st.cls}`}>{st.label}</span></td>
                  <td className="ad-table__mono">{ed.editionsManaged.length > 0 ? ed.editionsManaged.join(', ') : '--'}</td>
                  <td className="ad-table__actions">
                    <button className="ad-btn-sm" onClick={() => navigate(`/admin/editors/${ed.id}`)}>Ver</button>
                    <button className="ad-btn-sm ad-btn-sm--danger" onClick={() => setConfirmId(ed.id)}>Apagar</button>
                  </td>
                </tr>
              )
            })}
            {editors.length === 0 && (
              <tr>
                <td colSpan="5" className="ad-table__empty">Nenhum editor encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {confirmId && (
        <div className="ad-overlay" onClick={() => setConfirmId(null)}>
          <div className="ad-dialog" onClick={(e) => e.stopPropagation()}>
            <p className="ad-dialog__text">Tem certeza que deseja remover este editor?</p>
            <div className="ad-dialog__actions">
              <button className="ad-btn" onClick={() => setConfirmId(null)}>Cancelar</button>
              <button className="ad-btn ad-btn--danger" onClick={() => handleDelete(confirmId)}>Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Editors
