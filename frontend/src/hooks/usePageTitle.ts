import { useEffect } from 'react'

/**
 * Hook to set the page title dynamically
 * @param title - The title to set (will be appended to base title)
 * @param baseTitle - Optional base title (default: "AMZDUDES")
 */
export function usePageTitle(title: string, baseTitle: string = 'AMZDUDES') {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title ? `${title} | ${baseTitle}` : baseTitle
    
    return () => {
      document.title = previousTitle
    }
  }, [title, baseTitle])
}

