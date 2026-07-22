import { useEffect } from 'react'

/**
 * Custom hook to lock body scrolling when a modal, popup, or mobile drawer is open.
 * Prevents background page scrolling across desktop and mobile browsers.
 */
export default function useLockBodyScroll(isLocked) {
  useEffect(() => {
    if (isLocked) {
      document.body.classList.add('modal-open')
      document.documentElement.classList.add('modal-open')
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.classList.remove('modal-open')
      document.documentElement.classList.remove('modal-open')
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }

    return () => {
      document.body.classList.remove('modal-open')
      document.documentElement.classList.remove('modal-open')
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isLocked])
}
