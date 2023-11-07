import {create} from 'zustand'

export type ModalType = "createServer";

interface ModalStore {
  type : ModalType | null
  isOpen : boolean
  onOpen : (type: ModalType) => void
  onclose : () => void
}

export const useModal = create<ModalStore>((set) => ({
  type : null,
  isOpen : false,
  onOpen : (type) => set({type, isOpen : true}),
  onclose : () => set({type: null , isOpen : false})
}))