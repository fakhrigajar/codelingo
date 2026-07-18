import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { logVisit } from '../../lib/visitApi'

// Logs one row per page view for the admin "Visitors" page. Skips /admin/*
// itself so an admin browsing their own dashboard doesn't pollute the
// visitor stats they're trying to read.
export default function VisitLogger() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname.startsWith('/admin')) return
    logVisit({ path: pathname, referrer: document.referrer })
  }, [pathname])

  return null
}
