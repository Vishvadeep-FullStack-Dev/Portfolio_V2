'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const checkExistingAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.push('/admin')
        return
      }

      setCheckingAuth(false)
    }

    checkExistingAuth()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError('> AUTH FAILED: Invalid credentials')
        setLoading(false)
        return
      }

      router.push('/admin')
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0d1117]">
        <Loader2 className="h-8 w-8 animate-spin text-green-400" />
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[#0d1117]">
      <div className="w-full max-w-md rounded-lg border border-green-900/30 bg-[#0d1117] p-8 shadow-2xl">
        <div className="mb-8 text-center font-mono">
          <h1 className="text-lg font-bold text-green-400">[ PORTFOLIO ADMIN ]</h1>
          <p className="mt-2 text-xs text-green-600">authentication required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block font-mono text-sm text-green-400">
              email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-green-900/50 bg-[#161b22] px-3 py-2 font-mono text-sm text-green-400 placeholder-green-900 focus:border-green-400 focus:outline-none"
              placeholder="user@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-sm text-green-400">
              password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-green-900/50 bg-[#161b22] px-3 py-2 font-mono text-sm text-green-400 placeholder-green-900 focus:border-green-400 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded border border-red-900/50 bg-red-900/10 px-3 py-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <p className="font-mono text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded border border-green-400/50 bg-green-400/10 py-2 font-mono text-sm text-green-400 hover:bg-green-400/20 hover:border-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                authenticating...
              </span>
            ) : (
              '> LOGIN'
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-green-900/30 pt-4">
          <p className="text-center font-mono text-xs text-green-700">
            secure connection established
          </p>
        </div>
      </div>
    </div>
  )
}
