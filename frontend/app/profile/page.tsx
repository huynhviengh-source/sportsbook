'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const [form, setForm] = useState({ full_name: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [bookingCount, setBookingCount] = useState(0)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
    if (user) {
      setForm({ full_name: user.full_name || '', phone: '' })
      api.get<any[]>('/bookings/my').then(b => setBookingCount(b.length))
    }
  }, [user, loading])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = { ...user, full_name: form.full_name }
      localStorage.setItem('user', JSON.stringify(updated))
      showToast('✅ Cập nhật thành công!')
    } catch {
      showToast('❌ Có lỗi xảy ra!')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-green-600">🏟️ SportsBook</Link>
          <div className="flex items-center gap-2">
            <Link href="/my-bookings" className="text-sm px-3 py-2 text-gray-600 hover:bg-green-50 rounded-lg transition">📅 Lịch đặt</Link>
            <button onClick={() => { logout(); router.push('/auth/login') }}
              className="text-sm px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition">
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
            {user.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h1 className="text-xl font-bold text-gray-900">{user.full_name}</h1>
          <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          <span className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
            user.role === 'owner' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
          }`}>
            {user.role === 'owner' ? '👑 Chủ sân' : '🏃 Khách hàng'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{bookingCount}</p>
            <p className="text-xs text-gray-400 mt-1">Lịch đặt</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">0</p>
            <p className="text-xs text-gray-400 mt-1">Đánh giá</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">⭐</p>
            <p className="text-xs text-gray-400 mt-1">Thành viên</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">✏️ Chỉnh sửa thông tin</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Họ và tên</label>
              <input value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Email</label>
              <input value={user.email} disabled
                className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed" />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Số điện thoại</label>
              <input value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0901 234 567" />
            </div>
            <button type="submit" disabled={saving}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50">
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Link href="/my-bookings"
            className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 hover:border-green-300 hover:shadow-md transition">
            <span className="text-2xl">📅</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Lịch đặt của tôi</p>
              <p className="text-xs text-gray-400">Xem và quản lý</p>
            </div>
          </Link>
          <Link href="/"
            className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 hover:border-green-300 hover:shadow-md transition">
            <span className="text-2xl">🏟️</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Tìm sân</p>
              <p className="text-xs text-gray-400">Khám phá sân mới</p>
            </div>
          </Link>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white bg-gray-800">
          {toast}
        </div>
      )}
    </div>
  )
}