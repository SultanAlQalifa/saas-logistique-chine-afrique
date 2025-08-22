import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface SidebarPreferences {
  pinned: boolean
  lastOpenSection: string | null
  collapsed: boolean
}

interface UIState {
  busy: boolean
  activeModals: number
  dragActive: boolean
}

export function useSidebar() {
  const { data: session } = useSession()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [uiState, setUIState] = useState<UIState>({ busy: false, activeModals: 0, dragActive: false })
  
  const inactivityTimer = useRef<NodeJS.Timeout>()
  const debounceTimer = useRef<NodeJS.Timeout>()
  const saveTimer = useRef<NodeJS.Timeout>()

  // Load preferences from localStorage or user settings
  const loadPreferences = useCallback((): SidebarPreferences => {
    try {
      const stored = localStorage.getItem('sidebar-preferences')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Failed to load sidebar preferences:', error)
    }
    return { pinned: false, lastOpenSection: null, collapsed: false }
  }, [])

  // Save preferences with throttling
  const savePreferences = useCallback((prefs: Partial<SidebarPreferences>) => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current)
    }
    
    saveTimer.current = setTimeout(() => {
      try {
        const current = loadPreferences()
        const updated = { ...current, ...prefs }
        localStorage.setItem('sidebar-preferences', JSON.stringify(updated))
        
        // TODO: Save to user preferences API if authenticated
        if (session?.user) {
          // API call to save user preferences
        }
      } catch (error) {
        console.warn('Failed to save sidebar preferences:', error)
      }
    }, 500)
  }, [session, loadPreferences])

  // Initialize preferences
  useEffect(() => {
    const prefs = loadPreferences()
    setIsPinned(prefs.pinned)
    setIsCollapsed(prefs.collapsed)
    setOpenSection(prefs.lastOpenSection)
  }, [loadPreferences])

  // Auto-retraction logic
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current)
    }

    if (!isPinned && !uiState.busy && !isHovered) {
      inactivityTimer.current = setTimeout(() => {
        if (!isHovered && !isPinned) {
          setIsCollapsed(true)
          savePreferences({ collapsed: true })
        }
      }, 5000) // 5 seconds of inactivity
    }
  }, [isPinned, uiState.busy, isHovered, savePreferences])

  // Debounced activity detection
  const handleActivity = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      resetInactivityTimer()
    }, 250) // 250ms debounce
  }, [resetInactivityTimer])

  // Set up activity listeners
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'wheel', 'touchstart']
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [handleActivity])

  // Reset timer when pinned state changes
  useEffect(() => {
    resetInactivityTimer()
  }, [resetInactivityTimer])

  // Start inactivity timer on mount and when sidebar expands
  useEffect(() => {
    if (!isCollapsed && !isPinned) {
      resetInactivityTimer()
    }
  }, [isCollapsed, isPinned, resetInactivityTimer])

  // Accordion behavior - close others when opening a new section
  const toggleSection = useCallback((sectionId: string) => {
    const newOpenSection = openSection === sectionId ? null : sectionId
    setOpenSection(newOpenSection)
    savePreferences({ lastOpenSection: newOpenSection })
  }, [openSection, savePreferences])

  // Pin/Unpin functionality
  const togglePin = useCallback(() => {
    const newPinned = !isPinned
    setIsPinned(newPinned)
    savePreferences({ pinned: newPinned })
    
    if (newPinned) {
      // If pinning, expand sidebar
      setIsCollapsed(false)
      savePreferences({ collapsed: false })
    } else {
      // If unpinning, start inactivity timer
      resetInactivityTimer()
    }
  }, [isPinned, savePreferences, resetInactivityTimer])

  // Hover expand functionality
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current)
    }
    if (isCollapsed) {
      setIsCollapsed(false)
      savePreferences({ collapsed: false })
    }
  }, [isCollapsed, savePreferences])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    if (!isPinned && !uiState.busy) {
      // Délai plus court pour la rétractation au survol
      setTimeout(() => {
        setIsCollapsed(true)
        savePreferences({ collapsed: true })
      }, 800) // 800ms de délai
    }
  }, [isPinned, uiState.busy, savePreferences])

  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Only handle global shortcuts, not when typing in inputs
    if (event.target && (event.target as HTMLElement).tagName === 'INPUT') {
      return
    }
    
    switch (event.key) {
      case 'Escape':
        if (!isPinned) {
          setIsCollapsed(true)
          savePreferences({ collapsed: true })
        }
        break
    }
  }, [isPinned, savePreferences])

  // UI state management
  const setUIBusy = useCallback((busy: boolean) => {
    setUIState(prev => ({ ...prev, busy }))
  }, [])

  const setModalCount = useCallback((count: number) => {
    setUIState(prev => ({ ...prev, activeModals: count }))
  }, [])

  const setDragActive = useCallback((active: boolean) => {
    setUIState(prev => ({ ...prev, dragActive: active }))
  }, [])

  // Responsive behavior
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1280)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return {
    // State
    isCollapsed,
    isPinned,
    openSection,
    isHovered,
    isMobile,
    uiState,
    
    // Actions
    toggleSection,
    togglePin,
    handleMouseEnter,
    handleMouseLeave,
    handleKeyDown,
    setUIBusy,
    setModalCount,
    setDragActive,
    
    // Manual controls
    expand: () => setIsCollapsed(false),
    collapse: () => !isPinned && setIsCollapsed(true)
  }
}
