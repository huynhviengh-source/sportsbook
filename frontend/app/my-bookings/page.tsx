'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { Booking, SPORT_META } from '@/types'
import { formatVND } from '@/lib/utils'

export default function MyBookingsPage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [fetching, setFetching] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [user, loading])

  useEffect(() => {
    if (!user) return
    api.get<Booking[]>('/bookings/my')
      .then(setBookings)
      .finally(() => setFetching(false))
  }, [user])

  const handleCancel = async (id: string) => {
    if (!confirm('Bạn có chắc muốn huỷ lịch đặt này?')) return
    setCancelling(id)
    try {
      await api.patch(`/bookings/${id}/cancel`)
      setBookings(bs => bs.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
    } catch (e: any) {
      alert(e.message)
    } finally {
      setCancelling(null)
    }
  }

  if (loading || !user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-green-600">🏟️ SportsBook</Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:block">{user.email}</span>
            <button onClick={() => { logout(); router.push('/auth/login') }}
              className="text-sm px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition">
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">📅 Lịch đặt của tôi</h1>
          <Link href="/" className="text-sm text-green-600 hover:text-green-700 font-medium">
            + Đặt thêm sân
          </Link>
        </div>

        {fetching ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl h-32 animate-pulse" />)}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📭</p>
            <p className="mb-4">Bạn chưa có lịch đặt nào</p>
            <Link href="/" className="inline-block bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition text-sm font-medium">
              Tìm sân ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => {
              const meta = b.court ? SPORT_META[b.court.sport_type] : null
              const cancelled = b.status === 'cancelled'
              const isPast = new Date(b.booking_date) < new Date()

              return (
                <div key={b.id} className={`bg-white rounded-xl border p-5 shadow-sm ${cancelled ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-base">
                        {meta?.icon} {b.court?.name}
                      </p>
                      <p className="text-gray-500 text-sm mt-0.5">📍 {b.court?.address}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      cancelled ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {cancelled ? 'Đã huỷ' : 'Đã xác nhận'}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-gray-400 text-xs">Ngày</p>
                      <p className="font-medium">{new Date(b.booking_date).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-gray-400 text-xs">Giờ</p>
                      <p className="font-medium">{b.start_hour}:00 — {b.end_hour}:00</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-gray-400 text-xs">Giá</p>
                      <p className="font-medium text-green-600">{formatVND(b.total_price)}</p>
                    </div>
                  </div>

                  {!cancelled && !isPast && (
                    <div className="mt-3 flex justify-end">
                      <button onClick={() => handleCancel(b.id)} disabled={cancelling === b.id}
                        className="text-sm text-red-500 border border-red-200 hover:bg-red-50 px-4 py-1.5 rounded-lg transition disabled:opacity-50">
                        {cancelling === b.id ? 'Đang huỷ...' : 'Huỷ lịch'}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}