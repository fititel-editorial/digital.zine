import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MOCK_EDITORS } from '../../data/mockAdmin'
import { addLog } from '../../data/mockLogs'

const EditorForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = id && id !== 'new'

  const [form, setForm] = useState(() => {
    if (isEditing) {
      const found = MOCK_EDITORS.find((e) => e.id === Number(id))
      return found ? { ...found } : null
    }
    return { name: '', email: '', status: 'active', editionsManaged: [] }
  })

  const [saved, setSaved] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  if (isEditing && !form) {
    return (
      <div className="ad-editions">
        <div className="ad-page-header">
          <h1 className="ad-page-title">Editor nao encontrado</h1>
          <button className="ad-btn" onClick={() => navigate('/admin/editors')}>Voltar</button>
        </div>
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return

    if (isEditing) {
      const idx = MOCK_EDITORS.findIndex((ed) => ed.id === form.id)
      if (idx !== -1) {
        const oldStatus = MOCK_EDITORS[idx].status
        MOCK_EDITORS[idx] = { ...form }
        if (oldStatus !== form.status) {
          addLog('editou', 'editor', form.id, form.name, `Alterou estado de "${form.name}" para ${form.status === 'active' ? 'ativo' : 'inativo'}`)
        } else {
          addLog('editou', 'editor', form.id, form.name, `Editou os dados do editor "${form.name}"`)
        }
      }
    } else {
      MOCK_EDITORS.push({ ...form, id: Date.now() })
      addLog('criou', 'editor', form.id || Date.now(), form.name, `Adicionou editor "${form.name}" com email ${form.email}`)
    }

    setSaved(true)
    setTimeout(() => navigate('/admin/editors'), 1000)
  }

  if (saved) {
    return (
      <div className="ad-editions">
        <div className="ad-page-header">
          <h1 className="ad-page-title">Editor guardado</h1>
          <p className="ad-page-desc" style={{ color: 'var(--accent-terminal)' }}>{form.name} foi salvo com sucesso.</p>
          <button className="ad-btn ad-btn--primary" onClick={() => navigate('/admin/editors')}>
            Voltar aos editores
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ad-editions">
      <div className="ad-page-header">
        <h1 className="ad-page-title">{isEditing ? 'Editar Editor' : 'Novo Editor'}</h1>
        <button className="ad-btn" onClick={() => navigate('/admin/editors')}>Cancelar</button>
      </div>

      <form className="ad-form" onSubmit={handleSubmit}>
        <div className="ad-form__grid">
          <div className="ad-form__field">
            <label className="ad-form__label">Nome</label>
            <input className="ad-form__input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Nome completo" required />
          </div>
          <div className="ad-form__field">
            <label className="ad-form__label">Email</label>
            <input className="ad-form__input" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="email@fittel.co" required />
          </div>
        </div>

        <div className="ad-form__field">
          <label className="ad-form__label">Estado</label>
          <select className="ad-form__select" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>

        <div className="ad-form__actions">
          <button type="submit" className="ad-btn ad-btn--primary">
            {isEditing ? 'Guardar alteracoes' : 'Criar editor'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditorForm
