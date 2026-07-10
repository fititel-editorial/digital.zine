export const MOCK_LOGS = [
  {
    id: 1,
    user: 'Ana Pereira',
    userEmail: 'ana@fittel.co',
    action: 'criou',
    targetType: 'edicao',
    targetId: 24,
    targetName: 'Dados que Contam Histórias',
    details: 'Criou a edição com 5 artigos, 120 páginas',
    timestamp: new Date('2026-05-10T09:15:00'),
  },
  {
    id: 2,
    user: 'Carlos Mendes',
    userEmail: 'carlos@fittel.co',
    action: 'editou',
    targetType: 'edicao',
    targetId: 23,
    targetName: 'Design e Criatividade Artificial',
    details: 'Alterou título, overview e adicionou 1 artigo',
    timestamp: new Date('2026-04-15T14:30:00'),
  },
  {
    id: 3,
    user: 'Administrador',
    userEmail: 'admin@fittel.co',
    action: 'criou',
    targetType: 'editor',
    targetId: 3,
    targetName: 'Maria Santos',
    details: 'Adicionou editor com email maria@fittel.co',
    timestamp: new Date('2026-03-01T10:00:00'),
  },
  {
    id: 4,
    user: 'Administrador',
    userEmail: 'admin@fittel.co',
    action: 'editou',
    targetType: 'editor',
    targetId: 4,
    targetName: 'João Silva',
    details: 'Alterou estado para inativo',
    timestamp: new Date('2026-06-20T16:45:00'),
  },
  {
    id: 5,
    user: 'Maria Santos',
    userEmail: 'maria@fittel.co',
    action: 'criou',
    targetType: 'edicao',
    targetId: 22,
    targetName: 'Especial Startups Africanas',
    details: 'Criou a edição com 3 artigos, 114 páginas',
    timestamp: new Date('2026-03-03T08:00:00'),
  },
  {
    id: 6,
    user: 'Ana Pereira',
    userEmail: 'ana@fittel.co',
    action: 'editou',
    targetType: 'edicao',
    targetId: 21,
    targetName: 'Cibersegurança em África',
    details: 'Alterou status de rascunho para publicado',
    timestamp: new Date('2026-06-22T11:20:00'),
  },
  {
    id: 7,
    user: 'Administrador',
    userEmail: 'admin@fittel.co',
    action: 'apagou',
    targetType: 'edicao',
    targetId: 20,
    targetName: 'Edição de Teste',
    details: 'Removeu a edição do sistema',
    timestamp: new Date('2026-06-18T09:30:00'),
  },
]

let nextLogId = MOCK_LOGS.length + 1

export const addLog = (action, targetType, targetId, targetName, details) => {
  const userJson = localStorage.getItem('fittel_user')
  let user = 'Sistema'
  let userEmail = 'system@fittel.co'
  if (userJson) {
    try {
      const parsed = JSON.parse(userJson)
      user = parsed.name || 'Sistema'
      userEmail = parsed.email || 'system@fittel.co'
    } catch {}
  }
  MOCK_LOGS.push({
    id: nextLogId++,
    user,
    userEmail,
    action,
    targetType,
    targetId,
    targetName,
    details,
    timestamp: new Date(),
  })
}
