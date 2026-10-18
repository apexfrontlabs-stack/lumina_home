import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'lumina_payment_methods'

function readCards() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export default function usePaymentMethods() {
  const [cards, setCards] = useState(readCards)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
    } catch {}
  }, [cards])

  const addCard = useCallback((card, makeDefault = false) => {
    setCards((prev) => {
      const becomesDefault = prev.length === 0 || makeDefault

      const updatedCards = prev.map((item) => ({
        ...item,
        isDefault: becomesDefault ? false : item.isDefault,
      }))

      return [
        ...updatedCards,
        {
          ...card,
          id: crypto.randomUUID(),
          isDefault: becomesDefault,
        },
      ]
    })
  }, [])

  const removeCard = useCallback((id) => {
    setCards((prev) => {
      const updatedCards = prev.filter((card) => card.id !== id)

      if (updatedCards.length > 0 && !updatedCards.some((card) => card.isDefault)) {
        updatedCards[0] = {
          ...updatedCards[0],
          isDefault: true,
        }
      }

      return updatedCards
    })
  }, [])

  const setDefault = useCallback((id) => {
    setCards((prev) =>
      prev.map((card) => ({
        ...card,
        isDefault: card.id === id,
      }))
    )
  }, [])

  return {
    cards,
    addCard,
    removeCard,
    setDefault,
  }
}