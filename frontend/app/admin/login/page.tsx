'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res: any = await api.post('/auth/login', form)
      if (res.user.role !== 'owner') {
        setError('Tài khoản này không có quyền admin!')
        return
      }
      login(res.access_token, res.user)
      router.push('/admin')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 mt-1 text-sm">SportsBook Management</p>
        </div>

        <form onSubmit={submit}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-700 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input type="email" required value={form.email} onChange={set('email')}
              placeholder="admin@gmail.com"
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Mật khẩu</label>
            <input type="password" required value={form.password} onChange={set('password')}
              placeholder="••••••••"
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
          </div>

          {error && (
            <p className="text-sm bg-red-900/50 text-red-400 px-4 py-2 rounded-lg border border-red-800">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 text-sm">
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập Admin'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-4">
          Chỉ dành cho quản trị viên
        </p>
      </div>
    </div>
  )
}