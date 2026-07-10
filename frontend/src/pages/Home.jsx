import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const EDITIONS = [
  {
    id: 24,
    vol: 24,
    title: 'Dados que Contam Histórias',
    date: 'Maio 2026',
    excerpt: 'Como a análise massiva de dados está ditando as novas tendências tecnológicas em Angola. Da predição climática ao planeamento urbano inteligente.',
    cover: '/images/datastream-cover.png',
  },
  {
    id: 23,
    vol: 23,
    title: 'Design e Criatividade Artificial',
    date: 'Abril 2026',
    excerpt: 'Estúdios africanos pioneiros na incorporação de ferramentas de IA no seu fluxo de trabalho criativo.',
    cover: '/images/nebula-artist-cover.png',
  },
  {
    id: 22,
    vol: 22,
    title: 'Especial Startups Africanas',
    date: 'Março 2026',
    excerpt: 'O novo vale do silício reside em África. Startups de Luanda, Nairóbi e Lagos atraindo investimento global.',
    cover: '/images/africa-innovates-cover.png',
  },
  {
    id: 21,
    vol: 21,
    title: 'Cibersegurança em África',
    date: 'Fevereiro 2026',
    excerpt: 'Protegendo o futuro digital do continente — um panorama de ameaças e estratégias de defesa.',
    cover: '/images/datastream-cover.png',
  },
]

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const currentEdition = EDITIONS[0]

  return (
    <main>
      {/* ── HERO ─────────────────────────────────── */}
      <section className="home-hero">
        <div className="home-hero__inner container">
          <div className="home-hero__text reveal">
            <p className="home-hero__masthead">
              Nº {currentEdition.vol} · {currentEdition.date}
            </p>
            <h1 className="home-hero__title">
              Inovação e Futuro Digital em Angola
            </h1>
            <p className="home-hero__standfirst">
              A revista de tecnologia e cultura digital angolana.
              Inteligência artificial, startups, dados abertos
              e a transformação que está a redefinir o continente.
            </p>
            <div className="home-hero__actions">
              <Link
                to={`/edition/${currentEdition.id}`}
                className="home-btn home-btn--primary"
              >
                Ler a edição actual
              </Link>
              <Link to="/login" className="home-btn home-btn--outline">
                Entrar
              </Link>
            </div>
          </div>
          <div className="home-hero__cover reveal reveal-delay-1">
            <Link to={`/edition/${currentEdition.id}`}>
              <img
                src="/images/hero-cover.png"
                alt={`Capa — Nº ${currentEdition.vol}, ${currentEdition.title}`}
                className="home-hero__cover-img"
                width={380}
                height={538}
                loading="eager"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ARCHIVE ──────────────────────────────── */}
      <section id="editions" className="home-archive">
        <div className="home-archive__inner container">
          <h2 className="home-archive__heading reveal">Arquivo</h2>
          <ul className="home-archive__list reveal" role="list">
            {EDITIONS.slice(1).map((ed) => (
              <li key={ed.id} className="home-archive__row">
                <Link to={`/edition/${ed.id}`} className="home-archive__row-inner">
                  <span className="home-archive__row-meta">
                    Nº {ed.vol} · {ed.date}
                  </span>
                  <span className="home-archive__row-body">
                    <span className="home-archive__row-title">{ed.title}</span>
                    <span className="home-archive__row-excerpt">{ed.excerpt}</span>
                  </span>
                  <svg className="home-archive__row-arrow" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────── */}
      <section id="about" className="home-about">
        <div className="home-about__inner container">
          <div className="home-about__content reveal">
            <h2 className="home-about__heading">Sobre a FITITEL</h2>
            <p className="home-about__text">
              A FITITEL é uma revista angolana focada na excelência em literacia
              tecnológica, inovação e pensamento digital. Acreditamos que
              o futuro não é algo que se espera, é algo que se constrói e molda.
            </p>
            <p className="home-about__text">
              Como a mais destacada publicação do género no nosso mercado,
              temos como missão documentar e incentivar os saltos de disrupção
              no continente, unindo líderes de pensamento a talentos emergentes.
            </p>
            <p className="home-about__provenance">
              42ª edição · Luanda, Angola
            </p>
          </div>
          <div className="home-about__image reveal reveal-delay-1">
            <img
              src="/images/about-fittel.png"
              alt="Equipa FITITEL"
              className="home-about__img"
              width={560}
              height={450}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── CLOSE ────────────────────────────────── */}
      <section className="home-close">
        <div className="home-close__inner container reveal">
          <p className="home-close__text">
            O futuro não é algo que se espera.
            É algo que se constrói.
          </p>
          <Link to="/login" className="home-btn home-btn--quiet">
            Começar a ler
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Home
