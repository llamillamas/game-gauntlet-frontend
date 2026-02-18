import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'light' | 'system'
export type MotionPreference = 'full' | 'reduced' | 'none'

export interface AppState {
  // Theme
  theme: Theme
  setTheme: (theme: Theme) => void
  
  // Motion preferences
  motionPreference: MotionPreference
  setMotionPreference: (pref: MotionPreference) => void
  
  // Notifications
  notificationsEnabled: boolean
  setNotificationsEnabled: (enabled: boolean) => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  
  // Connection status
  isOnline: boolean
  setIsOnline: (online: boolean) => void
  wsConnected: boolean
  setWsConnected: (connected: boolean) => void
  
  // Global loading/error states
  globalLoading: boolean
  setGlobalLoading: (loading: boolean) => void
  globalError: string | null
  setGlobalError: (error: string | null) => void
  clearGlobalError: () => void
  
  // Sidebar/mobile menu
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme - default dark
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      
      // Motion - respect system by default
      motionPreference: 'full',
      setMotionPreference: (motionPreference) => set({ motionPreference }),
      
      // Notifications
      notificationsEnabled: true,
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      soundEnabled: true,
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      
      // Connection
      isOnline: true,
      setIsOnline: (isOnline) => set({ isOnline }),
      wsConnected: false,
      setWsConnected: (wsConnected) => set({ wsConnected }),
      
      // Loading/Error
      globalLoading: false,
      setGlobalLoading: (globalLoading) => set({ globalLoading }),
      globalError: null,
      setGlobalError: (globalError) => set({ globalError }),
      clearGlobalError: () => set({ globalError: null }),
      
      // Sidebar
      sidebarOpen: false,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'game-gauntlet-app',
      partialize: (state) => ({
        theme: state.theme,
        motionPreference: state.motionPreference,
        notificationsEnabled: state.notificationsEnabled,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
)
