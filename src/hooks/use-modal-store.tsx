'use client'

import { create } from 'zustand'

interface UseModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useModalStore = create<UseModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
