import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addPurchase, hasPurchased } from '../data/mockPurchases'
import { toggleFavorite, isFavorited } from '../data/mockFavorites'

const EDITIONS_DATA = {
  24: {
    vol: 24,
    title: 'Dados que Contam Histórias',
    subtitle: 'Inovação, Talento e Futuro Digital em Angola',
    description: 'Histórias, entrevistas e análises sobre o ecossistema de tecnologia, criatividade e negócios que está a redefinir o país.',
    cover: '/images/datastream-cover.png',
    date: 'Maio 2026',
    dateIso: '2026-05-12',
    editor: 'Ana Pereira',
    language: 'Português',
    pages: 120,
    price: 'AKZ 2.900',
    priceNote: 'Acesso imediato à edição completa. Também disponível para assinantes.',
    isFree: true,
    tags: ['Tecnologia', 'Negócios', 'Casos Reais', 'Edição Especial'],
    overview: 'Esta edição da FITITEL mergulha profundamente no cenário de inovação em Angola: das startups em crescimento explosivo às grandes empresas que viram o mundo com tecnologia, talento local e transformação digital. Entrevistas exclusivas, laboratórios de produto, análise de dados e tendências globais adaptadas à realidade angolana.',
    articles: [
      { title: 'Mapeando o ecossistema de startups em Luanda', desc: 'Um panorama atualizado dos hubs de inovação e programas de aceleração', page: 12 },
      { title: 'Entrevista: Como formar talentos para o futuro digital', desc: 'Líderes educacionais partilham estratégias para desenvolver competências tecnológicas', page: 32 },
      { title: 'Inteligência Artificial aplicada a serviços públicos', desc: 'Casos práticos de soluções digitais que melhoram o dia a dia das pessoas', page: 56 },
      { title: 'Design de produto com identidade africana', desc: 'Projetos que combinam cultura local com linguagem visual contemporânea', page: 78 },
      { title: 'Open Data e transparência governamental', desc: 'Como os dados abertos estão a transformar a relação entre cidadão e estado', page: 94 },
    ],
    technicalDetails: {
      isbn: '978-3-16-148410-0',
      format: 'Digital (PDF/EPUB) + Flipbook',
      dimensions: '210 x 297 mm (A4)',
      publisher: 'FITITEL Publishing, Luanda',
    },
    relatedEditions: [23, 22],
  },
  23: {
    vol: 23,
    title: 'Design e Criatividade Artificial',
    subtitle: 'A fusão entre arte humana e inteligência generativa',
    description: 'Entrevistas e análises sobre estúdios africanos que lideram a adopção de IA na criação artística e no design de produto.',
    cover: '/images/nebula-artist-cover.png',
    date: 'Abril 2026',
    dateIso: '2026-04-18',
    editor: 'Carlos Mendes',
    language: 'Português',
    pages: 98,
    price: 'AKZ 2.900',
    priceNote: 'Acesso imediato à edição completa. Também disponível para assinantes.',
    isFree: false,
    tags: ['Arte', 'Design', 'IA Generativa'],
    overview: 'O impacto do Gen-AI na arte criativa digital. Estúdios africanos pioneiros na incorporação de ferramentas de IA no seu fluxo de trabalho criativo, desde concept art até produção final.',
    articles: [
      { title: 'O novo estúdio: ferramentas de IA no workflow criativo', desc: 'Como os artistas africanos estão a integrar IA generativa', page: 8 },
      { title: 'Direitos de autor na era da IA', desc: 'Análise jurídica do panorama legal em Angola e no continente', page: 28 },
      { title: 'Entrevista: "A IA não substitui o artista"', desc: 'Conversa com o premiado designer angolano João Sousa', page: 44 },
      { title: 'Prompt engineering como competência de design', desc: 'Guia prático para designers que querem dominar ferramentas generativas', page: 62 },
    ],
    technicalDetails: {
      isbn: '978-3-16-148410-1',
      format: 'Digital (PDF/EPUB) + Flipbook',
      dimensions: '210 x 297 mm (A4)',
      publisher: 'FITITEL Publishing, Luanda',
    },
    relatedEditions: [24, 22],
  },
  22: {
    vol: 22,
    title: 'Especial Startups Africanas',
    subtitle: 'O novo vale do silício reside em África',
    description: 'Conheça as startups de Luanda, Nairóbi e Lagos que estão atraindo investimento global recorde.',
    cover: '/images/africa-innovates-cover.png',
    date: 'Março 2026',
    dateIso: '2026-03-05',
    editor: 'Maria Santos',
    language: 'Português',
    pages: 114,
    price: 'AKZ 2.900',
    priceNote: 'Acesso imediato à edição completa. Também disponível para assinantes.',
    isFree: false,
    tags: ['Startups', 'Investimento', 'Ecossistema'],
    overview: 'Um mergulho profundo no ecossistema de startups que está a florescer em todo o continente africano, com foco especial nas cidades de Luanda, Nairóbi e Lagos.',
    articles: [
      { title: 'O mapa do investimento em África', desc: 'Dados e análises sobre as rondas de financiamento mais significativas', page: 10 },
      { title: 'Fintech angolana conquista mercados internacionais', desc: 'A história de sucesso da Bayqi e o futuro dos pagamentos digitais', page: 30 },
      { title: 'Incubadoras e aceleradoras: guia completo', desc: 'Todos os programas de apoio a startups disponíveis em Angola', page: 52 },
    ],
    technicalDetails: {
      isbn: '978-3-16-148410-2',
      format: 'Digital (PDF/EPUB) + Flipbook',
      dimensions: '210 x 297 mm (A4)',
      publisher: 'FITITEL Publishing, Luanda',
    },
    relatedEditions: [24, 23],
  },
  21: {
    vol: 21,
    title: 'Cibersegurança em África',
    subtitle: 'Protegendo o futuro digital do continente',
    description: 'Uma análise aprofundada do panorama de cibersegurança em África.',
    cover: '/images/datastream-cover.png',
    date: 'Fevereiro 2026',
    dateIso: '2026-02-10',
    editor: 'Ana Pereira',
    language: 'Português',
    pages: 88,
    price: 'AKZ 2.900',
    isFree: false,
    tags: ['Segurança', 'Tecnologia'],
    overview: 'O panorama da cibersegurança em Angola e no continente africano.',
    articles: [
      { title: 'Ameaças cibernéticas emergentes', desc: 'Panorama das principais ameaças', page: 6 },
      { title: 'Protegendo infraestruturas críticas', desc: 'Estratégias de defesa', page: 30 },
    ],
    technicalDetails: {
      isbn: '978-3-16-148410-3',
      format: 'Digital (PDF/EPUB) + Flipbook',
      dimensions: '210 x 297 mm (A4)',
      publisher: 'FITITEL Publishing, Luanda',
    },
    relatedEditions: [24, 23],
  },
}

const EditionDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('description')
  const edition = EDITIONS_DATA[id]
  const numId = Number(id)
  const bought = user?.role === 'reader' ? hasPurchased(user.readerId, numId) : false
  const fav = user?.role === 'reader' ? isFavorited(user.readerId, numId) : false
  const [isFav, setIsFav] = useState(fav)
  const canAccessFlipbook = edition?.isFree || bought

  useEffect(() => {
    window.scrollTo(0, 0)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [id])

  const handlePurchase = () => {
    if (!user || user.role !== 'reader') return
    addPurchase(user.readerId, numId)
    window.location.reload()
  }

  const handleToggleFav = () => {
    if (!user || user.role !== 'reader') return
    const now = toggleFavorite(user.readerId, numId)
    setIsFav(now)
  }

  if (!edition) {
    return (
      <main className="ed">
        <div className="container ed__not-found">
          <div className="system-log" style={{ maxWidth: 600, margin: '120px auto' }}>
            <div className="system-log__header">
              <span className="system-log__prompt">user@fittel:~$</span>
              <span className="system-log__cmd">fetch --id={id}</span>
            </div>
            <div className="system-log__body">
              <p style={{ color: '#EF4444', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                [ERROR] Edition not found. No payload matching ID "{id}".
              </p>
              <Link to="/" className="log-action" style={{ marginTop: 12, display: 'inline-block' }}>
                ➔ [CMD: RETURN_TO_ARCHIVE]
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="ed">
      {/* EDITION HERO */}
      <section className="ed-hero">
        <div className="ed-hero__inner container">
          {/* Left: Cover */}
          <div className="ed-hero__cover-col reveal">
            <div className="ed-hero__cover-frame">
              <img src={edition.cover} alt={edition.title} className="ed-hero__cover-img" />
            </div>
            <div className="ed-hero__cover-meta">
              <span className="ed-hero__vol">FITITEL Nº {edition.vol}</span>
              <span className="ed-hero__page-count">{edition.date.toUpperCase()} • {edition.pages} PÁGINAS</span>
            </div>
          </div>

          {/* Right: Info */}
          <div className="ed-hero__info-col reveal reveal-delay-1">
            <span className="ed-hero__label">Edição Passada</span>
            <h1 className="ed-hero__title">{edition.subtitle}<span className="log-cursor">_</span></h1>
            <p className="ed-hero__desc">{edition.description}</p>

            <div className="ed-hero__tags">
              {edition.tags.map((tag, i) => (
                <span key={i} className="ed-hero__tag">{tag}</span>
              ))}
            </div>

            <div className="ed-hero__data-grid">
              <div className="ed-hero__data-item">
                <span className="ed-hero__data-key">Data de publicação</span>
                <span className="ed-hero__data-value">{edition.date}</span>
              </div>
              <div className="ed-hero__data-item">
                <span className="ed-hero__data-key">Editor-chefe</span>
                <span className="ed-hero__data-value">{edition.editor}</span>
              </div>
              <div className="ed-hero__data-item">
                <span className="ed-hero__data-key">Idioma</span>
                <span className="ed-hero__data-value">{edition.language}</span>
              </div>
            </div>

            <div className="ed-hero__actions">
              {canAccessFlipbook ? (
                <Link to={`/edition/${id}/flipbook`} className="btn btn--primary ed-hero__btn-flip">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z"/></svg>
                  Ler edição em Flipbook
                </Link>
              ) : user?.role === 'reader' && !bought ? (
                <button onClick={handlePurchase} className="btn btn--primary ed-hero__btn-flip">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg>
                  Comprar — {edition.price}
                </button>
              ) : (
                <Link to={`/edition/${id}/flipbook`} className="btn btn--primary ed-hero__btn-flip">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z"/></svg>
                  Ler edição em Flipbook
                </Link>
              )}
              <a href="#summary" className="btn btn--secondary ed-hero__btn-summary">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>
                Ver sumário
              </a>
              {user?.role === 'reader' && (
                <button onClick={handleToggleFav} className={`btn ed-hero__btn-fav ${isFav ? 'ed-hero__btn-fav--active' : ''}`} title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
                  <svg width="18" height="18" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                </button>
              )}
              <div className="ed-hero__price">
                <span className="ed-hero__price-old">{edition.price}</span>
                {edition.isFree && <span className="ed-hero__price-free">GRÁTIS</span>}
              </div>
            </div>
            {!edition.isFree && !bought && user?.role !== 'reader' && (
              <p className="ed-hero__price-note">Faça login para comprar esta edição.</p>
            )}
          </div>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="ed-content">
        <div className="ed-content__inner container">
          {/* Main Column */}
          <div className="ed-content__main">
            {/* Tabs */}
            <div className="ed-tabs reveal">
              <button 
                className={`ed-tabs__tab ${activeTab === 'description' ? 'ed-tabs__tab--active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Descrição
              </button>
              <button 
                className={`ed-tabs__tab ${activeTab === 'index' ? 'ed-tabs__tab--active' : ''}`}
                onClick={() => setActiveTab('index')}
              >
                Índice
              </button>
              <button 
                className={`ed-tabs__tab ${activeTab === 'technical' ? 'ed-tabs__tab--active' : ''}`}
                onClick={() => setActiveTab('technical')}
              >
                Detalhes técnicos
              </button>
            </div>

            {/* Tab: Description */}
            {activeTab === 'description' && (
              <div className="ed-tab-panel reveal">
                <h3 className="ed-tab-panel__title">O que você encontra nesta edição</h3>
                <p className="ed-tab-panel__text">{edition.overview}</p>

                <h4 className="ed-tab-panel__subtitle">Principais artigos</h4>
                <div className="ed-articles-log">
                  {edition.articles.map((article, i) => (
                    <div key={i} className="ed-article-row">
                      <div className="ed-article-row__info">
                        <span className="ed-article-row__title">{article.title}</span>
                        <span className="ed-article-row__desc">{article.desc}</span>
                      </div>
                      <span className="ed-article-row__page">Pág. {article.page}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Index */}
            {activeTab === 'index' && (
              <div className="ed-tab-panel reveal">
                <div className="system-log" style={{ marginTop: 0 }}>
                  <div className="system-log__header">
                    <span className="system-log__prompt">user@fittel:~$</span>
                    <span className="system-log__cmd">cat index.log --vol={edition.vol}</span>
                  </div>
                  <div className="system-log__body">
                    {edition.articles.map((article, i) => (
                      <div key={i} className="system-log__entry">
                        <div className="system-log__meta">
                          <span className="log-timestamp">[PAGE_{String(article.page).padStart(3, '0')}]</span>
                          <span className="log-status log-status--success">READY</span>
                        </div>
                        <div className="system-log__content">
                          <h3 className="log-title">{article.title}</h3>
                          <p className="log-excerpt">{article.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Technical */}
            {activeTab === 'technical' && (
              <div className="ed-tab-panel reveal">
                <div className="ed-tech-grid">
                  {Object.entries(edition.technicalDetails).map(([key, value]) => (
                    <div key={key} className="ed-tech-item">
                      <span className="ed-tech-item__key">{key.toUpperCase()}</span>
                      <span className="ed-tech-item__value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="ed-sidebar reveal reveal-delay-1">
            <div className="ed-sidebar__widget">
              <div className="ed-sidebar__widget-header">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z"/></svg>
                <span>Ler em Flipbook</span>
              </div>
              <p className="ed-sidebar__widget-text">
                Experimente a leitura interativa, com páginas que viram como uma revista física.
              </p>
              <img src={edition.cover} alt={edition.title} className="ed-sidebar__widget-cover" />
              {canAccessFlipbook ? (
                <Link to={`/edition/${id}/flipbook`} className="btn btn--primary ed-sidebar__widget-btn">
                  Abrir Flipbook da revista
                </Link>
              ) : (
                <button onClick={handlePurchase} className="btn btn--primary ed-sidebar__widget-btn">
                  Comprar — {edition.price}
                </button>
              )}
              <p className="ed-sidebar__widget-note">
                Leia no navegador sem precisar fazer download de nenhum ficheiro.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* RELATED EDITIONS */}
      <section className="ed-related">
        <div className="container">
          <div className="ed-related__header reveal">
            <h3 className="ed-related__title">Edições relacionadas</h3>
            <Link to="/" className="ed-related__link">Ver todas as edições</Link>
          </div>
          <div className="ed-related__grid reveal">
            {edition.relatedEditions.map(relId => {
              const rel = EDITIONS_DATA[relId]
              if (!rel) return null
              return (
                <Link to={`/edition/${relId}`} key={relId} className="ed-related__card">
                  <img src={rel.cover} alt={rel.title} className="ed-related__card-img" />
                  <div className="ed-related__card-info">
                    <span className="ed-related__card-title">Edição {rel.vol} • {rel.title}</span>
                    <span className="ed-related__card-meta">{rel.date} • {rel.pages} págs.</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}

export default EditionDetails
