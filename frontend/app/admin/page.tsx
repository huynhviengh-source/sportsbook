'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { Court, SPORT_META } from '@/types'
import { formatVND } from '@/lib/utils'

interface BookingAdmin {
  id: string
  booking_date: string
  start_hour: number
  end_hour: number
  total_price: number
  status: string
  court: { name: string; sport_type: string; address: string }
}

const SPORT_BADGE: Record<string, string> = {
  pickleball: 'bg-green-50 text-green-800',
  badminton:  'bg-blue-50 text-blue-800',
  tennis:     'bg-yellow-50 text-yellow-800',
  football:   'bg-red-50 text-red-800',
}

export default function AdminPage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const [courts, setCourts] = useState<Court[]>([])
  const [bookings, setBookings] = useState<BookingAdmin[]>([])
  const [tab, setTab] = useState<'overview' | 'courts' | 'bookings'>('overview')
  const [fetching, setFetching] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState({
    name: '', sport_type: 'pickleball', address: '',
    price_per_hour: '', image_url: '', description: ''
  })

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const setF = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    if (!loading && !user) router.push('/admin/login')
    if (!loading && user && user.role !== 'owner') router.push('/')
  }, [user, loading])

  useEffect(() => {
    if (!user || user.role !== 'owner') return
    Promise.all([
      api.get<Court[]>('/courts'),
      api.get<BookingAdmin[]>('/bookings/my'),
    ]).then(([c, b]) => { setCourts(c); setBookings(b); setFetching(false) })
  }, [user])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      await api.post('/courts', { ...form, price_per_hour: parseInt(form.price_per_hour) })
      showToast('✅ Tạo sân thành công!')
      setShowForm(false)
      setForm({ name: '', sport_type: 'pickleball', address: '', price_per_hour: '', image_url: '', description: '' })
      const c = await api.get<Court[]>('/courts'); setCourts(c)
    } catch (err: any) { showToast('❌ ' + err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xoá sân "${name}"?`)) return
    try {
      await api.delete(`/courts/${id}`)
      showToast('✅ Đã xoá sân!')
      setCourts(cs => cs.filter(c => c.id !== id))
    } catch (err: any) { showToast('❌ ' + err.message) }
  }

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed')
  const totalRevenue = confirmedBookings.reduce((s, b) => s + b.total_price, 0)
  const todayStr = new Date().toISOString().split('T')[0]
  const todayBookings = confirmedBookings.filter(b => b.booking_date === todayStr)

  if (loading || !user || user.role !== 'owner') return null

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col min-h-screen sticky top-0">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">🏟️ SportsBook</span>
          </div>
          <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full mt-1 inline-block">
            Admin
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {[
            { key: 'overview', icon: '📊', label: 'Tổng quan' },
            { key: 'courts',   icon: '🏟️', label: 'Quản lý sân' },
            { key: 'bookings', icon: '📅', label: 'Lịch đặt' },
          ].map(item => (
            <button key={item.key}
              onClick={() => setTab(item.key as any)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                tab === item.key
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-1">
          <Link href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
            🏠 Trang chủ
          </Link>
          <button onClick={() => { logout(); router.push('/admin/login') }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition text-left">
            🚪 Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">

        {tab === 'overview' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Tổng quan</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs text-gray-400 mb-2">Tổng sân</p>
                <p className="text-3xl font-bold text-gray-900">{courts.length}</p>
                <p className="text-xs text-gray-400 mt-1">đang hoạt động</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs text-gray-400 mb-2">Lịch đặt hôm nay</p>
                <p className="text-3xl font-bold text-green-600">{todayBookings.length}</p>
                <p className="text-xs text-gray-400 mt-1">lượt đặt</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs text-gray-400 mb-2">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(totalRevenue / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-gray-400 mt-1">đồng</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs text-gray-400 mb-2">Tổng lịch đặt</p>
                <p className="text-3xl font-bold text-yellow-600">{confirmedBookings.length}</p>
                <p className="text-xs text-gray-400 mt-1">đã xác nhận</p>
              </div>
            </div>

            <h2 className="text-base font-semibold text-gray-900 mb-4">Lịch đặt gần đây</h2>
            <div className="space-y-3">
              {bookings.slice(0,5).map(b => (
                <div key={b.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{b.court?.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {new Date(b.booking_date).toLocaleDateString('vi-VN')} · {b.start_hour}:00 — {b.end_hour}:00
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-green-600 text-sm">{formatVND(b.total_price)}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      b.status === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                    }`}>
                      {b.status === 'confirmed' ? 'Đã xác nhận' : 'Đã huỷ'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'courts' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Quản lý sân</h1>
              <button onClick={() => setShowForm(!showForm)}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
                {showForm ? '✕ Đóng' : '+ Thêm sân mới'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleCreate}
                className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Thêm sân mới</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Tên sân</label>
                    <input required value={form.name} onChange={setF('name')}
                      placeholder="Sân Pickleball Quận 7"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Môn thể thao</label>
                    <select value={form.sport_type} onChange={setF('sport_type')}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="pickleball">🏓 Pickleball</option>
                      <option value="badminton">🏸 Cầu lông</option>
                      <option value="tennis">🎾 Tennis</option>
                      <option value="football">⚽ Bóng đá</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Địa chỉ</label>
                    <input required value={form.address} onChange={setF('address')}
                      placeholder="12 Nguyễn Thị Thập, Q7, HCM"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Giá/giờ (VND)</label>
                    <input required type="number" value={form.price_per_hour} onChange={setF('price_per_hour')}
                      placeholder="120000"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-gray-500 mb-1 block">Link ảnh</label>
                    <input value={form.image_url} onChange={setF('image_url')}
                      placeholder="https://..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
                    <textarea value={form.description} onChange={setF('description')}
                      placeholder="Mô tả về sân..."
                      rows={2}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button type="submit" disabled={saving}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl transition disabled:opacity-50 text-sm">
                    {saving ? 'Đang lưu...' : 'Tạo sân'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium px-6 py-2.5 rounded-xl transition text-sm">
                    Huỷ
                  </button>
                </div>
              </form>
            )}

            <p className="text-sm text-gray-400 mb-3">{courts.length} sân đang hoạt động</p>
            <div className="space-y-3">
              {courts.map(court => {
                const meta = SPORT_META[court.sport_type]
                const badgeCls = SPORT_BADGE[court.sport_type] || 'bg-gray-100 text-gray-700'
                return (
                  <div key={court.id}
                    className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 hover:border-gray-200 transition">
                    {court.image_url ? (
                      <img src={court.image_url} alt={court.name}
                        className="w-14 h-14 rounded-xl object-cover flex-none" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center text-2xl flex-none">
                        {meta.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm">{court.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeCls}`}>
                          {meta.icon} {meta.label}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1 truncate">📍 {court.address}</p>
                      <p className="text-green-600 font-semibold text-sm mt-1">{formatVND(court.price_per_hour)}/giờ</p>
                    </div>
                    <div className="flex items-center gap-3 flex-none">
                      <span className="text-sm font-semibold text-yellow-600">⭐ {court.rating}</span>
                      <button onClick={() => handleDelete(court.id, court.name)}
                        className="text-xs text-red-500 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">
                        Xoá
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {tab === 'bookings' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Lịch đặt</h1>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs text-gray-400 mb-2">Tổng lịch đặt</p>
                <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs text-gray-400 mb-2">Đã xác nhận</p>
                <p className="text-3xl font-bold text-green-600">{confirmedBookings.length}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs text-gray-400 mb-2">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-blue-600">{formatVND(totalRevenue)}</p>
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-5xl mb-4">📭</p>
                <p>Chưa có lịch đặt nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{b.court?.name}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        📅 {new Date(b.booking_date).toLocaleDateString('vi-VN')} · ⏰ {b.start_hour}:00 — {b.end_hour}:00
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-green-600">{formatVND(b.total_price)}</span>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        b.status === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                      }`}>
                        {b.status === 'confirmed' ? 'Đã xác nhận' : 'Đã huỷ'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white bg-gray-800">
          {toast}
        </div>
      )}
    </div>
  )
}