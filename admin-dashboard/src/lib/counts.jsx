import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { unreadCount } from './messageState'

/** Real counts for the sidebar badges: unread messages and reviews waiting for approval. */
const CountsContext = createContext({ unread: 0, pending: 0, refresh: () => {} })

export function CountsProvider({ children }) {
  const [counts, setCounts] = useState({ unread: 0, pending: 0 })

  const refresh = useCallback(async () => {
    const [msgs, pend] = await Promise.all([
      supabase.from('messages').select('*'),
      supabase.from('testimonials').select('id', { count: 'exact', head: true }).eq('approved', false),
    ])
    setCounts({
      unread: msgs.error ? 0 : unreadCount(msgs.data || []),
      pending: pend.error ? 0 : pend.count || 0,
    })
  }, [])

  useEffect(() => {
    refresh()
    const timer = setInterval(refresh, 60000)
    const onVisible = () => { if (document.visibilityState === 'visible') refresh() }
    document.addEventListener('visibilitychange', onVisible)
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', onVisible) }
  }, [refresh])

  return <CountsContext.Provider value={{ ...counts, refresh }}>{children}</CountsContext.Provider>
}

export const useCounts = () => useContext(CountsContext)
