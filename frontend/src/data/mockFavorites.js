export const MOCK_FAVORITES = [
  { id: 1, readerId: 1, editionId: 24 },
  { id: 2, readerId: 2, editionId: 22 },
]

let nextFavoriteId = MOCK_FAVORITES.length + 1

export const toggleFavorite = (readerId, editionId) => {
  const idx = MOCK_FAVORITES.findIndex(f => f.readerId === readerId && f.editionId === editionId)
  if (idx !== -1) {
    MOCK_FAVORITES.splice(idx, 1)
    return false
  }
  MOCK_FAVORITES.push({ id: nextFavoriteId++, readerId, editionId })
  return true
}

export const isFavorited = (readerId, editionId) => {
  return MOCK_FAVORITES.some(f => f.readerId === readerId && f.editionId === editionId)
}

export const getFavoritesByReader = (readerId) => {
  return MOCK_FAVORITES.filter(f => f.readerId === readerId)
}
