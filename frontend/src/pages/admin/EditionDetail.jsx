import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_EDITIONS } from '../../data/mockAdmin'

const STATUS_MAP = {
  published: { label: 'Publicado', cls: 'ad-badge--success' },
  draft: { label: 'Rascunho', cls: 'ad-badge--warning' },
}

const EditionDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const edition = MOCK_EDITIONS.find((e) => e.id === Number(id))

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (!edition) {
    return (
      <div className="ad-editions">
        <div className="ad-page-header">
          <div>
            <h1 className="ad-page-title">Edicao nao encontrada</h1>
            <p className="ad-page-desc">Nao foi possivel encontrar a edicao com ID #{id}</p>
          </div>
          <button className="ad-btn" onClick={() => navigate('/admin/editions')}>Voltar</button>
        </div>
      </div>
    )
  }

  const st = STATUS_MAP[edition.status] || STATUS_MAP.draft

  return (
    <div className="ad-editions">
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">{edition.title}</h1>
          <p className="ad-page-desc">Vol. {edition.vol} &middot; {edition.date}</p>
        </div>
        <div className="ad-page-actions">
          <button className="ad-btn" onClick={() => navigate('/admin/editions')}>Voltar</button>
          <button className="ad-btn ad-btn--primary" onClick={() => navigate(`/admin/editions/${edition.id}/edit`)}>Editar</button>
        </div>
      </div>

      <div className="ad-detail">
        <div className="ad-detail__section">
          <div className="ad-detail__grid">
            <div className="ad-detail__block">
              <span className="ad-detail__block-key">Estado</span>
              <span className={`ad-badge ${st.cls}`}>{st.label}</span>
            </div>
            <div className="ad-detail__block">
              <span className="ad-detail__block-key">Preco</span>
              {edition.isFree ? (
                <span className="ad-badge ad-badge--success">GRATIS</span>
              ) : (
                <span className="ad-detail__block-value">{edition.price}</span>
              )}
            </div>
            <div className="ad-detail__block">
              <span className="ad-detail__block-key">Editor</span>
              <span className="ad-detail__block-value">{edition.editor}</span>
            </div>
            <div className="ad-detail__block">
              <span className="ad-detail__block-key">Paginas</span>
              <span className="ad-detail__block-value ad-table__mono">{edition.pages}</span>
            </div>
            <div className="ad-detail__block">
              <span className="ad-detail__block-key">Idioma</span>
              <span className="ad-detail__block-value">{edition.language}</span>
            </div>
            <div className="ad-detail__block">
              <span className="ad-detail__block-key">PDF</span>
              {edition.pdfFile ? (
                <span className="ad-table__mono" style={{ color: 'var(--accent-terminal)' }}>Anexado</span>
              ) : (
                <span className="ad-table__mono" style={{ color: 'var(--text-tertiary)' }}>Nenhum</span>
              )}
            </div>
          </div>
        </div>

        {edition.description && (
          <div className="ad-detail__section">
            <h3 className="ad-detail__section-title">Descricao</h3>
            <p className="ad-detail__text">{edition.description}</p>
          </div>
        )}

        {edition.overview && (
          <div className="ad-detail__section">
            <h3 className="ad-detail__section-title">Visao Geral</h3>
            <p className="ad-detail__text">{edition.overview}</p>
          </div>
        )}

        <div className="ad-detail__section">
          <h3 className="ad-detail__section-title">Tags</h3>
          <div className="ad-detail__tags">
            {edition.tags.map((tag, i) => (
              <span key={i} className="ad-detail__tag">{tag}</span>
            ))}
          </div>
        </div>

        <div className="ad-detail__section">
          <h3 className="ad-detail__section-title">Artigos ({edition.articles.length})</h3>
          <div className="ad-detail__articles">
            {edition.articles.map((a, i) => (
              <div key={i} className="ad-detail__article">
                <span className="ad-detail__article-page ad-table__mono">{a.page}</span>
                <div>
                  <span className="ad-detail__article-title">{a.title}</span>
                  {a.desc && <span className="ad-detail__article-desc">{a.desc}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ad-detail__section">
          <h3 className="ad-detail__section-title">Detalhes Tecnicos</h3>
          <div className="ad-detail__grid">
            {Object.entries(edition.technicalDetails || {}).map(([key, value]) => (
              <div key={key} className="ad-detail__block">
                <span className="ad-detail__block-key">{key}</span>
                <span className="ad-detail__block-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditionDetail
