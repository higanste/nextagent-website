'use client'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const supabase = createClient()
  const router = useRouter()
  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }
  return (
    <button onClick={signOut} className="btn btn-ghost" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }} id="sign-out-btn">
      Sign out
    </button>
  )
}
