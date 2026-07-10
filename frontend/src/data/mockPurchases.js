export const MOCK_PURCHASES = [
  { id: 1, readerId: 1, editionId: 23, date: new Date('2026-06-01') },
  { id: 2, readerId: 2, editionId: 24, date: new Date('2026-06-10') },
]

let nextPurchaseId = MOCK_PURCHASES.length + 1

export const addPurchase = (readerId, editionId) => {
  const existing = MOCK_PURCHASES.find(p => p.readerId === readerId && p.editionId === editionId)
  if (existing) return existing
  const purchase = { id: nextPurchaseId++, readerId, editionId, date: new Date() }
  MOCK_PURCHASES.push(purchase)
  return purchase
}

export const hasPurchased = (readerId, editionId) => {
  return MOCK_PURCHASES.some(p => p.readerId === readerId && p.editionId === editionId)
}

export const getPurchasesByReader = (readerId) => {
  return MOCK_PURCHASES.filter(p => p.readerId === readerId)
}
