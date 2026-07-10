import { useState } from 'react'
import { MOCK_LOGS } from '../../data/mockLogs'

const ACTION_LABELS = {
  criou: { label: 'Criou', cls: 'ad-badge--success' },
  editou: { label: 'Editou', cls: 'ad-badge--warning' },
  apagou: { label: 'Apagou', cls: 'ad-badge--danger' },
}

const TYPE_LABELS = {
  edicao: 'Edição',
  editor: 'Editor',
}

const formatTime = (d) => {
  const date = d instanceof Date ? d : new Date(d)
  return date.toLocaleString('pt-PT', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const Logs = () => {
  const [detail, setDetail] = useState(null)
  const [filterUser, setFilterUser] = useState('')
  const [filterAction, setFilterAction] = useState('')

  const users = [...new Set(MOCK_LOGS.map((l) => l.user))]
  const actions = [...new Set(MOCK_LOGS.map((l) => l.action))]

  const filtered = MOCK_LOGS.filter((l) => {
    if (filterUser && l.user !== filterUser) return false
    if (filterAction && l.action !== filterAction) return false
    return true
  }).sort((a, b) => b.timestamp - a.timestamp)

  return (
    <div className="ad-editions">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Logs do Sistema</h1>
          <p className="ad-page-desc">{MOCK_LOGS.length} registos de atividade</p>
        </div>

        <div className="ad-logs__filters">
          <select className="ad-logs__select" value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
            <option value="">Todos os utilizadores</option>
            {users.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <select className="ad-logs__select" value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
            <option value="">Todas as acoes</option>
            {actions.map((a) => <option key={a} value={a}>{ACTION_LABELS[a]?.label || a}</option>)}
          </select>
        </div>
      </div>

      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Utilizador</th>
              <th>Accao</th>
              <th>Alvo</th>
              <th>Detalhes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => {
              const act = ACTION_LABELS[log.action] || { label: log.action, cls: '' }
              return (
                <tr key={log.id}>
                  <td className="ad-table__mono" style={{ whiteSpace: 'nowrap' }}>{formatTime(log.timestamp)}</td>
                  <td>
                    <span className="ad-table__title">{log.user}</span>
                    <span className="ad-table__sub">{log.userEmail}</span>
                  </td>
                  <td><span className={`ad-badge ${act.cls}`}>{act.label}</span></td>
                  <td>
                    <span className="ad-table__title">{log.targetName}</span>
                    <span className="ad-table__sub">{TYPE_LABELS[log.targetType] || log.targetType}</span>
                  </td>
                  <td style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.details}
                  </td>
                  <td className="ad-table__actions">
                    <button className="ad-btn-sm" onClick={() => setDetail(log)}>Detalhes</button>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="ad-table__empty">Nenhum registo encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {detail && (
        <div className="ad-overlay" onClick={() => setDetail(null)}>
          <div className="ad-dialog ad-dialog--wide" onClick={(e) => e.stopPropagation()}>
            <div className="ad-dialog__header">
              <h3 className="ad-dialog__title">Detalhes do Registo</h3>
              <button className="ad-btn-sm" onClick={() => setDetail(null)}>Fechar</button>
            </div>
            <div className="ad-dialog__body">
              <div className="ad-detail-grid">
                <div className="ad-detail-item">
                  <span className="ad-detail-key">ID do Registo</span>
                  <span className="ad-detail-value ad-table__mono">#{detail.id}</span>
                </div>
                <div className="ad-detail-item">
                  <span className="ad-detail-key">Data</span>
                  <span className="ad-detail-value">{formatTime(detail.timestamp)}</span>
                </div>
                <div className="ad-detail-item">
                  <span className="ad-detail-key">Utilizador</span>
                  <span className="ad-detail-value">{detail.user}</span>
                </div>
                <div className="ad-detail-item">
                  <span className="ad-detail-key">Email</span>
                  <span className="ad-detail-value ad-table__mono">{detail.userEmail}</span>
                </div>
                <div className="ad-detail-item">
                  <span className="ad-detail-key">Accao</span>
                  <span className="ad-detail-value">
                    <span className={`ad-badge ${ACTION_LABELS[detail.action]?.cls || ''}`}>
                      {ACTION_LABELS[detail.action]?.label || detail.action}
                    </span>
                  </span>
                </div>
                <div className="ad-detail-item">
                  <span className="ad-detail-key">Tipo de Alvo</span>
                  <span className="ad-detail-value">{TYPE_LABELS[detail.targetType] || detail.targetType}</span>
                </div>
                <div className="ad-detail-item">
                  <span className="ad-detail-key">Alvo</span>
                  <span className="ad-detail-value ad-table__title">{detail.targetName}</span>
                </div>
                <div className="ad-detail-item ad-detail-item--full">
                  <span className="ad-detail-key">Descricao</span>
                  <p className="ad-detail-desc">{detail.details}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Logs
