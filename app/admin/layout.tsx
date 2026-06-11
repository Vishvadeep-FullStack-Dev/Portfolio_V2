'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/admin/login')
    }, 5000)

    const checkAuth = async () => {
      try {
        const { data: { session } } = await createClient().auth.getSession()

        if (!session) {
          clearTimeout(timeout)
          router.push('/admin/login')
          return
        }

        setUserEmail(session.user.email ?? null)
        clearTimeout(timeout)
        setIsLoading(false)
      } catch {
        clearTimeout(timeout)
        router.push('/admin/login')
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await createClient().auth.signOut()
    router.push('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0d1117]">
        <p className="font-mono text-green-400 text-sm">
          &gt; AUTHENTICATING<span className="animate-blink">_</span>
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold text-foreground">Portfolio Admin</h1>
          <div className="flex items-center gap-4">
            {userEmail && <span className="text-sm text-muted-foreground">{userEmail}</span>}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive hover:bg-destructive/20 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
