import { create } from 'zustand'
type SettingStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
// Function 
export const useSettings = create<SettingStore>((set) => ({
  // Initial value
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
})) 
