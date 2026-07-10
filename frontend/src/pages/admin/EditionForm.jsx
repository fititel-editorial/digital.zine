import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MOCK_EDITIONS, MOCK_EDITORS } from '../../data/mockAdmin'
import { addLog } from '../../data/mockLogs'

const EMPTY_EDITION = {
  title: '', subtitle: '', description: '', cover: '',
  date: '', editor: MOCK_EDITORS[0]?.name || '', language: 'Portugues',
  pages: 0, price: 'AKZ ', isFree: false,
  tags: [], overview: '', status: 'draft',
  pdfFile: null,
  articles: [],
  technicalDetails: { isbn: '', format: 'Digital (PDF/EPUB) + Flipbook', dimensions: '210 x 297 mm (A4)', publisher: 'FITITEL Publishing, Luanda' },
}

const readFileAsDataURL = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve({ name: file.name, size: file.size, dataUrl: reader.result })
    reader.readAsDataURL(file)
  })

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const EditionForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = id && id !== 'new'

  const [form, setForm] = useState(() => {
    if (isEditing) {
      const found = MOCK_EDITIONS.find((e) => e.id === Number(id))
      return found ? { ...found, tags: [...found.tags], articles: found.articles.map((a) => ({ ...a })) } : null
    }
    return { ...EMPTY_EDITION, id: Date.now(), vol: MOCK_EDITIONS.length + 1 }
  })

  const [saved, setSaved] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  if (isEditing && !form) {
    return (
      <div className="ad-editions">
        <div className="ad-page-header">
          <h1 className="ad-page-title">Edicao nao encontrada</h1>
          <button className="ad-btn" onClick={() => navigate('/admin/editions')}>Voltar</button>
        </div>
      </div>
    )
  }

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleTagChange = (value) => {
    set('tags', value.split(',').map((t) => t.trim()).filter(Boolean))
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      alert('Por favor, selecione um ficheiro PDF.')
      return
    }
    const fileData = await readFileAsDataURL(file)
    set('pdfFile', fileData)
  }

  const handleRemovePdf = () => {
    set('pdfFile', null)
  }

  const handleArticleChange = (index, key, value) => {
    const updated = [...form.articles]
    updated[index] = { ...updated[index], [key]: value }
    set('articles', updated)
  }

  const addArticle = () => {
    set('articles', [...form.articles, { title: '', desc: '', page: 0 }])
  }

  const removeArticle = (index) => {
    set('articles', form.articles.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.editor.trim()) return

    if (isEditing) {
      const idx = MOCK_EDITIONS.findIndex((e) => e.id === form.id)
      if (idx !== -1) {
        MOCK_EDITIONS[idx] = { ...form }
      }
      addLog('editou', 'edicao', form.id, form.title, `Editou a edição "${form.title}"`)
    } else {
      MOCK_EDITIONS.push({ ...form })
      addLog('criou', 'edicao', form.id, form.title, `Criou a edição "${form.title}" com ${form.articles.length} artigos, ${form.pages} páginas`)
    }

    setSaved(true)
    setTimeout(() => navigate('/admin/editions'), 1200)
  }

  if (saved) {
    return (
      <div className="ad-editions">
        <div className="ad-page-header">
          <h1 className="ad-page-title">Edicao guardada</h1>
          <p className="ad-page-desc" style={{ color: 'var(--accent-terminal)' }}>{form.title} foi salva com sucesso.</p>
          <button className="ad-btn ad-btn--primary" onClick={() => navigate('/admin/editions')}>
            Voltar as edicoes
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ad-editions">
      <div className="ad-page-header">
        <h1 className="ad-page-title">{isEditing ? 'Editar Edicao' : 'Nova Edicao'}</h1>
        <button className="ad-btn" onClick={() => navigate('/admin/editions')}>Cancelar</button>
      </div>

      <form className="ad-form" onSubmit={handleSubmit}>
        <div className="ad-form__grid">
          <div className="ad-form__field">
            <label className="ad-form__label">Titulo</label>
            <input className="ad-form__input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Titulo da edicao" required />
          </div>
          <div className="ad-form__field">
            <label className="ad-form__label">Subtitulo</label>
            <input className="ad-form__input" value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} placeholder="Subtitulo (opcional)" />
          </div>
        </div>

        <div className="ad-form__field">
          <label className="ad-form__label">Descricao</label>
          <textarea className="ad-form__textarea" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Breve descricao" rows={3} />
        </div>

        <div className="ad-form__grid ad-form__grid--4">
          <div className="ad-form__field">
            <label className="ad-form__label">Data</label>
            <input className="ad-form__input" value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="Ex: Maio 2026" />
          </div>
          <div className="ad-form__field">
            <label className="ad-form__label">Editor</label>
            <select className="ad-form__select" value={form.editor} onChange={(e) => set('editor', e.target.value)}>
              {MOCK_EDITORS.filter((ed) => ed.status === 'active').map((ed) => (
                <option key={ed.id} value={ed.name}>{ed.name}</option>
              ))}
            </select>
          </div>
          <div className="ad-form__field">
            <label className="ad-form__label">Idioma</label>
            <input className="ad-form__input" value={form.language} onChange={(e) => set('language', e.target.value)} />
          </div>
          <div className="ad-form__field">
            <label className="ad-form__label">Paginas</label>
            <input className="ad-form__input" type="number" value={form.pages} onChange={(e) => set('pages', Number(e.target.value))} />
          </div>
        </div>

        <div className="ad-form__grid">
          <div className="ad-form__field">
            <label className="ad-form__label">Gratuita ou Paga?</label>
            <div className="ad-toggle">
              <button
                type="button"
                className={`ad-toggle__btn ${form.isFree ? 'ad-toggle__btn--active' : ''}`}
                onClick={() => { set('isFree', true); set('price', '') }}
              >
                Gratuita
              </button>
              <button
                type="button"
                className={`ad-toggle__btn ${!form.isFree ? 'ad-toggle__btn--active' : ''}`}
                onClick={() => { set('isFree', false); set('price', 'AKZ ') }}
              >
                Paga
              </button>
            </div>
          </div>
          <div className="ad-form__field">
            <label className="ad-form__label">Preco</label>
            <input className="ad-form__input" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="AKZ 2.900" disabled={form.isFree} />
          </div>
        </div>

        <div className="ad-form__grid">
          <div className="ad-form__field">
            <label className="ad-form__label">Capa (URL)</label>
            <input className="ad-form__input" value={form.cover} onChange={(e) => set('cover', e.target.value)} placeholder="/images/capa.png" />
          </div>
          <div className="ad-form__field">
            <label className="ad-form__label">PDF da Revista</label>
            {form.pdfFile ? (
              <div className="ad-file-info">
                <span className="ad-file-info__name">{form.pdfFile.name}</span>
                <span className="ad-file-info__size">({formatFileSize(form.pdfFile.size)})</span>
                <button type="button" className="ad-btn-sm ad-btn-sm--danger" onClick={handleRemovePdf}>Remover</button>
              </div>
            ) : (
              <input type="file" accept=".pdf" className="ad-form__file" onChange={handleFileChange} />
            )}
          </div>
        </div>

        <div className="ad-form__field">
          <label className="ad-form__label">Tags (separadas por virgula)</label>
          <input className="ad-form__input" value={form.tags.join(', ')} onChange={(e) => handleTagChange(e.target.value)} placeholder="Tecnologia, Inovacao, Angola" />
        </div>

        <div className="ad-form__field">
          <label className="ad-form__label">Visao Geral</label>
          <textarea className="ad-form__textarea" value={form.overview} onChange={(e) => set('overview', e.target.value)} rows={4} />
        </div>

        <div className="ad-form__field">
          <label className="ad-form__label">Estado</label>
          <select className="ad-form__select" value={form.status} onChange={(e) => set('status', e.target.value)}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </div>

        <div className="ad-form__section">
          <div className="ad-form__section-header">
            <h3 className="ad-form__section-title">Artigos</h3>
            <button type="button" className="ad-btn-sm" onClick={addArticle}>+ Adicionar artigo</button>
          </div>
          {form.articles.map((article, i) => (
            <div key={i} className="ad-form__article-row">
              <input className="ad-form__input" value={article.title} onChange={(e) => handleArticleChange(i, 'title', e.target.value)} placeholder="Titulo do artigo" />
              <input className="ad-form__input" value={article.desc} onChange={(e) => handleArticleChange(i, 'desc', e.target.value)} placeholder="Descricao" />
              <input className="ad-form__input ad-form__input--sm" type="number" value={article.page} onChange={(e) => handleArticleChange(i, 'page', Number(e.target.value))} placeholder="Pag." />
              <button type="button" className="ad-btn-sm ad-btn-sm--danger" onClick={() => removeArticle(i)}>X</button>
            </div>
          ))}
        </div>

        <div className="ad-form__actions">
          <button type="submit" className="ad-btn ad-btn--primary">
            {isEditing ? 'Guardar alteracoes' : 'Criar edicao'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditionForm
