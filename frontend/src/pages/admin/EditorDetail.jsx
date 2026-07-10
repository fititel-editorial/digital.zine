import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_EDITORS, MOCK_EDITIONS } from '../../data/mockAdmin'

const STATUS_CONFIG = {
  active: { label: 'Ativo', cls: 'ad-badge--success' },
  inactive: { label: 'Inativo', cls: 'ad-badge--muted' },
}

const EditorDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const editor = MOCK_EDITORS.find((e) => e.id === Number(id))

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (!editor) {
    return (
      <div className="ad-editions">
        <div className="ad-page-header">
          <div>
            <h1 className="ad-page-title">Editor nao encontrado</h1>
            <p className="ad-page-desc">Nao foi possivel encontrar o editor com ID #{id}</p>
          </div>
          <button className="ad-btn" onClick={() => navigate('/admin/editors')}>Voltar</button>
        </div>
      </div>
    )
  }

  const st = STATUS_CONFIG[editor.status] || STATUS_CONFIG.inactive
  const managedEditions = MOCK_EDITIONS.filter((ed) => editor.editionsManaged.includes(ed.id))

  return (
    <div className="ad-editions">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">{editor.name}</h1>
          <p className="ad-page-desc">{editor.email}</p>
        </div>
        <div className="ad-page-actions">
          <button className="ad-btn" onClick={() => navigate('/admin/editors')}>Voltar</button>
          <button className="ad-btn ad-btn--primary" onClick={() => navigate(`/admin/editors/${editor.id}/edit`)}>Editar</button>
        </div>
      </div>

      <div className="ad-detail">
        <div className="ad-detail__section">
          <div className="ad-detail__grid">
            <div className="ad-detail__block">
              <span className="ad-detail__block-key">Nome</span>
              <span className="ad-detail__block-value">{editor.name}</span>
            </div>
            <div className="ad-detail__block">
              <span className="ad-detail__block-key">Email</span>
              <span className="ad-detail__block-value ad-table__mono">{editor.email}</span>
            </div>
            <div className="ad-detail__block">
              <span className="ad-detail__block-key">Estado</span>
              <span className={`ad-badge ${st.cls}`}>{st.label}</span>
            </div>
            <div className="ad-detail__block">
              <span className="ad-detail__block-key">ID</span>
              <span className="ad-detail__block-value ad-table__mono">#{editor.id}</span>
            </div>
          </div>
        </div>

        <div className="ad-detail__section">
          <h3 className="ad-detail__section-title">
            Edicoes Geridas ({managedEditions.length})
          </h3>
          {managedEditions.length > 0 ? (
            <div className="ad-detail__editions-list">
              {managedEditions.map((ed) => (
                <div key={ed.id} className="ad-detail__edition-row" onClick={() => navigate(`/admin/editions/${ed.id}`)}>
                  <span className="ad-detail__edition-vol ad-table__mono">Vol. {ed.vol}</span>
                  <div>
                    <span className="ad-detail__edition-title">{ed.title}</span>
                    <span className="ad-detail__edition-date">{ed.date}</span>
                  </div>
                  <span className="ad-detail__edition-arrow">&rarr;</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="ad-detail__text" style={{ color: 'var(--text-tertiary)' }}>
              Este editor nao tem edicoes atribuidas.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default EditorDetail
