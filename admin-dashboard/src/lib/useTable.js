import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from './supabase'

/**
 * Loads a whole table (newest first) with loading / error / reload handling.
 * Same query the old pages used: select('*').order('id', desc).
 */
export function useTable(table, { order = 'id', ascending = false } = {}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const alive = useRef(true)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase.from(table).select('*').order(order, { ascending })
    if (!alive.current) return
    if (err) { console.error(`${table}:`, err); setError(err) } else setItems(data || [])
    setLoading(false)
  }, [table, order, ascending])

  useEffect(() => {
    alive.current = true
    reload()
    return () => { alive.current = false }
  }, [reload])

  return { items, setItems, loading, error, reload }
}

/** Checks whether an optional column exists (so new features degrade gracefully). */
export function useColumnProbe(table, column) {
  const [exists, setExists] = useState(null) // null = checking
  useEffect(() => {
    let live = true
    supabase.from(table).select(column).limit(1).then(({ error }) => { if (live) setExists(!error) })
    return () => { live = false }
  }, [table, column])
  return exists
}
