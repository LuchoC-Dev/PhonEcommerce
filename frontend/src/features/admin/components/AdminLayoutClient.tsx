'use client'

import { useEffect } from 'react'

function AdminLayoutClient() {
  useEffect(() => {
    document.documentElement.setAttribute('data-admin', 'true')
    return () => {
      document.documentElement.removeAttribute('data-admin')
    }
  }, [])
  return null
}

export { AdminLayoutClient }