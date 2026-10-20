import { supabase } from './supabase'

/**
 * "Read" state for contact messages.
 *  - If your `messages` table has a boolean `read` column, it is saved there.
 *  - Otherwise it is remembered in this browser, so it no longer resets on refresh.
 */
const KEY = 'cc-admin-read-messages'

const local = () => {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')) } catch { return new Set() }
}
const saveLocal = (set) => { try { localStorage.setItem(KEY, JSON.stringify([...set].slice(-500))) } catch { /* ignore */ } }

export const isUnread = (msg, localSet = local()) =>
  !localSet.has(msg.id) && !(msg.read === true)

export const unreadCount = (msgs) => { const l = local(); return msgs.filter((m) => isUnread(m, l)).length }

export async function setRead(msg, read) {
  const l = local()
  read ? l.add(msg.id) : l.delete(msg.id)
  saveLocal(l)
  if ('read' in msg) {
    const { error } = await supabase.from('messages').update({ read }).eq('id', msg.id)
    if (error) console.error('Could not save read state to the database:', error)
  }
}
