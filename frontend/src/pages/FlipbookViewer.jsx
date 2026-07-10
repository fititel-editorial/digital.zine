import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_FLIPBOOK_DATA } from '../data/mockFlipbook'
import { MOCK_EDITIONS } from '../data/mockAdmin'
import { hasPurchased, addPurchase } from '../data/mockPurchases'

const PLACEHOLDER_PAGES = 24
const PREVIEW_PAGES = 4

const buildPlaceholderData = (edition) => {
  if (!edition) return null
  const total = Math.min(edition.pages || 12, PLACEHOLDER_PAGES)
  const pages = [
    { id: 1, type: 'cover', image: edition.cover, num: null },
    ...Array.from({ length: total }, (_, i) => ({
      id: i + 2,
      type: 'content',
      image: `https://placehold.co/800x1131/1E293B/94A3B8?text=P%C3%A1gina+${i + 2}`,
      num: i + 2,
    })),
  ]
  return { vol: edition.vol, title: edition.title, pages, comments: [] }
}

const FlipbookViewer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const edition = MOCK_EDITIONS.find(e => e.id === Number(id))
  const mockFlip = MOCK_FLIPBOOK_DATA[id]
  const data = mockFlip || buildPlaceholderData(edition)
  const isFree = edition?.isFree
  const numId = Number(id)
  const purchased = user?.role === 'reader' ? hasPurchased(user.readerId, numId) : false
  const hasAccess = isFree || purchased
  const [currentPage, setCurrentPage] = useState(0)
  const [comments, setComments] = useState(data?.comments || [])
  const [draftComment, setDraftComment] = useState(null)
  const [draftText, setDraftText] = useState('')
  const [showComments, setShowComments] = useState(true)
  const [dismissedGate, setDismissedGate] = useState(false)

  useEffect(() => {
    if (!data) navigate(`/edition/${id}`, { replace: true })
  }, [data, id, navigate])

  useEffect(() => {
    // Prevent body scrolling when viewer is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  if (!data) return null

  // Calculate visible pages based on current index (simulating a 2-page spread)
  // If currentPage is 0 (cover), show only cover.
  // Otherwise, show currentPage and currentPage+1
  const isCover = currentPage === 0
  const leftPage = data.pages[currentPage]
  const rightPage = isCover ? null : data.pages[currentPage + 1]

  const handleNext = () => {
    const maxPages = hasAccess ? data.pages.length : PREVIEW_PAGES + 1
    if (currentPage === 0) {
      setCurrentPage(1)
    } else if (currentPage + 2 < maxPages) {
      setCurrentPage(currentPage + 2)
    }
  }

  const handlePrev = () => {
    if (currentPage === 1) {
      setCurrentPage(0)
    } else if (currentPage > 1) {
      setCurrentPage(currentPage - 2)
    }
  }

  const handleThumbnailClick = (index) => {
    const maxPages = hasAccess ? data.pages.length : PREVIEW_PAGES + 1
    if (index >= maxPages) return
    if (index === 0) setCurrentPage(0)
    else setCurrentPage(index % 2 !== 0 ? index : index - 1)
  }

  // Get comments for currently visible pages
  const visibleComments = comments.filter(
    c => c.pageId === leftPage?.num || c.pageId === rightPage?.num
  )

  const handlePageClick = (e, pageNum) => {
    if (!pageNum || !showComments) return // Don't allow comments on cover, or if comments are hidden
    
    // Check if the page already has 5 comments
    const pageCommentsCount = comments.filter(c => c.pageId === pageNum).length
    if (pageCommentsCount >= 5) {
      alert('Esta página atingiu o limite máximo de 5 comentários.')
      return
    }

    if (e.target.closest('.fb-comment') || e.target.closest('.fb-comment-input')) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setDraftComment({ pageId: pageNum, x, y })
    setDraftText('')
  }

  const handleSaveComment = () => {
    if (!draftText.trim()) return
    const newComment = {
      id: Date.now(),
      pageId: draftComment.pageId,
      user: 'Visitante (Demo)',
      timeAgo: 'agora mesmo',
      text: draftText,
      likes: 0,
      x: draftComment.x,
      y: draftComment.y
    }
    setComments([...comments, newComment])
    setDraftComment(null)
  }

  return (
    <div className="fb-viewer">
      {/* HEADER BAR */}
      <header className="fb-header">
        <button onClick={() => navigate(`/edition/${id}`)} className="fb-btn">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div className="fb-header__title">
          <span className="fb-header__vol">Edição {data.vol}</span>
          <span className="fb-header__name">• {data.title}</span>
        </div>
        <div className="fb-header__actions">
          <span className="fb-header__page-indicator">
            {isCover ? 'Capa' : `Páginas ${leftPage?.num}-${rightPage?.num || leftPage?.num} ${!hasAccess ? '(Pré-visualização)' : `de ${data.pages.length}`}`}
          </span>
          <div className="fb-divider"></div>
          <button className="fb-btn fb-btn--text">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
            100%
          </button>
          <div className="fb-divider"></div>
          <button 
            className={`fb-btn ${!showComments ? 'fb-btn--inactive' : ''}`} 
            onClick={() => setShowComments(!showComments)}
            title={showComments ? "Ocultar comentários" : "Mostrar comentários"}
          >
            {showComments ? (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            ) : (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
            )}
          </button>
          <button className="fb-btn"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h7"/></svg></button>
          <button className="fb-btn"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg></button>
          <button className="fb-btn"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg></button>
        </div>
      </header>

      {/* CANVAS (MAIN FLIPBOOK AREA) */}
      <main className="fb-canvas">
        {/* Navigation Arrows */}
        <button className="fb-nav-btn fb-nav-btn--prev" onClick={handlePrev} disabled={currentPage === 0}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
        </button>

        {/* Book Container */}
        <div className={`fb-book ${isCover ? 'fb-book--cover' : 'fb-book--spread'}`}>
          {/* Left Page (or Cover) */}
          {leftPage && (
            <div className="fb-page" onClick={(e) => handlePageClick(e, leftPage.num)}>
              <img src={leftPage.image} alt={`Página ${leftPage.num || 'Capa'}`} className="fb-page__img" />
              
              {/* Render comments for left page */}
              {showComments && visibleComments.filter(c => c.pageId === leftPage.num).slice(0, 5).map(comment => (
                <div key={comment.id} className="fb-comment" style={{ left: `${comment.x}%`, top: `${comment.y}%` }}>
                  <div className="fb-comment__header">
                    <span className="fb-comment__user">{comment.user}</span>
                    <span className="fb-comment__time">{comment.timeAgo} • Página {comment.pageId}</span>
                  </div>
                  <p className="fb-comment__text">{comment.text}</p>
                  <div className="fb-comment__footer">
                    <span className="fb-comment__replies">{comment.likes || 0} {(comment.likes || 0) === 1 ? 'gosto' : 'gostos'}</span>
                    <button className="fb-comment__reply-btn" title="Gostar">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                    </button>
                  </div>
                </div>
              ))}

              {/* Draft Comment Input */}
              {draftComment && draftComment.pageId === leftPage.num && (
                <div className="fb-comment-input" style={{ left: `${draftComment.x}%`, top: `${draftComment.y}%` }}>
                  <textarea 
                    className="fb-comment-textarea"
                    placeholder="Escreve o teu comentário..."
                    autoFocus
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                  />
                  <div className="fb-comment-actions">
                    <button className="fb-comment-btn" onClick={() => setDraftComment(null)}>Cancelar</button>
                    <button className="fb-comment-btn fb-comment-btn--primary" onClick={handleSaveComment}>Publicar</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Right Page (Only if not cover) */}
          {rightPage && (
            <div className="fb-page fb-page--right" onClick={(e) => handlePageClick(e, rightPage.num)}>
              <img src={rightPage.image} alt={`Página ${rightPage.num}`} className="fb-page__img" />
              
              {/* Render comments for right page */}
              {showComments && visibleComments.filter(c => c.pageId === rightPage.num).slice(0, 5).map(comment => (
                <div key={comment.id} className="fb-comment" style={{ left: `${comment.x}%`, top: `${comment.y}%` }}>
                  <div className="fb-comment__header">
                    <span className="fb-comment__user">{comment.user}</span>
                    <span className="fb-comment__time">{comment.timeAgo} • Página {comment.pageId}</span>
                  </div>
                  <p className="fb-comment__text">{comment.text}</p>
                  <div className="fb-comment__footer">
                    <span className="fb-comment__replies">{comment.likes || 0} {(comment.likes || 0) === 1 ? 'gosto' : 'gostos'}</span>
                    <button className="fb-comment__reply-btn" title="Gostar">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                    </button>
                  </div>
                </div>
              ))}

              {/* Draft Comment Input */}
              {draftComment && draftComment.pageId === rightPage.num && (
                <div className="fb-comment-input" style={{ left: `${draftComment.x}%`, top: `${draftComment.y}%` }}>
                  <textarea 
                    className="fb-comment-textarea"
                    placeholder="Escreve o teu comentário..."
                    autoFocus
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                  />
                  <div className="fb-comment-actions">
                    <button className="fb-comment-btn" onClick={() => setDraftComment(null)}>Cancelar</button>
                    <button className="fb-comment-btn fb-comment-btn--primary" onClick={handleSaveComment}>Publicar</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {!hasAccess && !dismissedGate && (
          <div className="fb-gate">
            <div className="fb-gate__card">
              <span className="fb-gate__badge">PRÉ-VISUALIZAÇÃO</span>
              <h2 className="fb-gate__title">{edition?.title || data.title}</h2>
              <p className="fb-gate__desc">
                Está a ver apenas as primeiras páginas. Adquira a edição completa para acesso a todo o conteúdo.
              </p>
              {user?.role === 'reader' ? (
                <button className="btn btn--primary fb-gate__btn" onClick={() => { addPurchase(user.readerId, numId); window.location.reload() }}>
                  Comprar — {edition?.price || 'AKZ 2.900'}
                </button>
              ) : (
                <button className="btn btn--primary fb-gate__btn" onClick={() => navigate('/login')}>
                  Entrar para comprar
                </button>
              )}
              <button className="fb-gate__dismiss" onClick={() => setDismissedGate(true)}>
                Continuar a pré-visualizar
              </button>
            </div>
          </div>
        )}

        <button className="fb-nav-btn fb-nav-btn--next" onClick={handleNext} disabled={!rightPage && currentPage > 0}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </main>

      {/* BOTTOM THUMBNAIL BAR */}
      <footer className="fb-thumbs">
        <div className="fb-thumbs__scroll">
          {/* We group thumbnails. Cover alone, then pairs. */}
          {data.pages.map((page, i) => {
            if (i > 0 && i % 2 === 0) return null // Skip even indices (handled by odd ones)
            if (!hasAccess && i >= PREVIEW_PAGES) return null // Limit thumbnails in preview
            
            const isThumbCover = i === 0;
            const thumbLeft = data.pages[i];
            const thumbRight = isThumbCover ? null : data.pages[i + 1];
            
            // Check if current view is this thumbnail group
            const isActive = isThumbCover ? currentPage === 0 : currentPage === i;

            return (
              <div 
                key={i} 
                className={`fb-thumb-group ${isActive ? 'fb-thumb-group--active' : ''}`}
                onClick={() => handleThumbnailClick(i)}
              >
                <div className="fb-thumb-imgs">
                  <img src={thumbLeft.image} alt="" className="fb-thumb-img" />
                  {thumbRight && <img src={thumbRight.image} alt="" className="fb-thumb-img fb-thumb-img--right" />}
                </div>
                <span className="fb-thumb-label">
                  {isThumbCover ? 'Capa' : `${thumbLeft.num}-${thumbRight?.num || thumbLeft.num}`}
                </span>
              </div>
            )
          })}
        </div>
      </footer>
    </div>
  )
}

export default FlipbookViewer
