'use client';
import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })} 
      className="btn btn-ghost" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }} id="sign-out-btn"
    >
      Sign out
    </button>
  );
}
