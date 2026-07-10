export const MOCK_READER_COMMENTS = [
  { id: 1, readerId: 1, editionId: 24, text: 'Excelente artigo sobre open data! Muito informativo.', date: '2026-05-15' },
  { id: 2, readerId: 1, editionId: 24, text: 'A entrevista sobre talentos digitais foi inspiradora.', date: '2026-05-20' },
  { id: 3, readerId: 2, editionId: 23, text: 'Adorei a secção sobre prompt engineering.', date: '2026-04-25' },
  { id: 4, readerId: 2, editionId: 22, text: 'Muito bom o guia de incubadoras.', date: '2026-03-15' },
  { id: 5, readerId: 2, editionId: 24, text: 'O design desta edição está lindo!', date: '2026-05-30' },
]

export const getCommentsByReader = (readerId) => {
  return MOCK_READER_COMMENTS.filter(c => c.readerId === readerId)
}

export const getCommentsByEdition = (editionId) => {
  return MOCK_READER_COMMENTS.filter(c => c.editionId === editionId)
}

export const getCommentCountByReader = (readerId) => {
  return MOCK_READER_COMMENTS.filter(c => c.readerId === readerId).length
}
