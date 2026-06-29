'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { io, Socket } from 'socket.io-client'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { Court, SPORT_META } from '@/types'
import { HOURS, DAY_SHORT, next14Days, toDateStr, formatVND } from '@/lib/utils'

interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  user: { full_name: string }
}

export default function CourtDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user, loading } = useAuth()

  const [court, setCourt] = useState<Court | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const [bookedSlots, setBookedSlots] = useState<Set<number>>(new Set())
  const [fetching, setFetching] = useState(true)
  const [booking, setBooking] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [myRating, setMyRating] = useState(5)
  const [myComment, setMyComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [user, loading])

  useEffect(() => {
    api.get<Court>(`/courts/${id}`).then(setCourt)
    api.get<Review[]>(`/courts/${id}/reviews`).then(setReviews)
  }, [id])

  useEffect(() => {
    if (!user || !id) return
    const dateStr = toDateStr(selectedDate)
    socket?.emit('leave', { court_id: id, date: dateStr })
    socket?.disconnect()
    setFetching(true)
    setSelectedHour(null)
    api.get<number[]>(`/bookings/slots?court_id=${id}&date=${dateStr}`)
      .then(slots => setBookedSlots(new Set(slots)))
      .finally(() => setFetching(false))
    const ws = io(`${process.env.NEXT_PUBLIC_WS_URL}/bookings`, { transports: ['websocket'] })
    ws.on('connect', () => ws.emit('join', { court_id: id, date: dateStr }))
    ws.on('slot_booked', ({ start_hour }: { start_hour: number }) => {
      setBookedSlots(prev => { const n = new Set(prev); n.add(start_hour); return n })
      setSelectedHour(prev => {
        if (prev === start_hour) { showToast('⚡ Giờ vừa chọn đã có người đặt!', false); return null }
        return prev
      })
    })
    ws.on('slot_cancelled', ({ start_hour }: { start_hour: number }) => {
      setBookedSlots(prev => { const n = new Set(prev); n.delete(start_hour); return n })
    })
    setSocket(ws)
    return () => { ws.disconnect() }
  }, [selectedDate, id, user])

  const handleBook = async () => {
    if (!selectedHour || !court) return
    setBooking(true)
    try {
      await api.post('/bookings', { court_id: id, booking_date: toDateStr(selectedDate), start_hour: selectedHour })
      setSelectedHour(null)
      showToast('🎉 Đặt sân thành công!')
    } catch (err: any) {
      showToast(err.message, false)
    } finally { setBooking(false) }
  }

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post(`/courts/${id}/reviews`, { rating: myRating, comment: myComment })
      const updated = await api.get<Review[]>(`/courts/${id}/reviews`)
      setReviews(updated)
      setMyComment('')
      setMyRating(5)
      showToast('✅ Cảm ơn bạn đã đánh giá!')
    } catch (err: any) {
      showToast(err.message, false)
    } finally { setSubmitting(false) }
  }

  if (!court) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Đang tải...</p>
    </div>
  )

  const meta = SPORT_META[court.sport_type]
  const days = next14Days()
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : court.rating

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-green-600 transition">← Quay lại</Link>
          <span className="text-gray-300">|</span>
          <span className="font-semibold text-gray-800 truncate">{court.name}</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Cột trái */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {court.image_url ? (
                <img src={court.image_url} alt={court.name} className="w-full h-64 object-cover" />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center text-7xl">
                  {meta.icon}
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      {meta.icon} {meta.label}
                    </span>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2">{court.name}</h1>
                    <p className="text-gray-500 mt-1">📍 {court.address}</p>
                  </div>
                  <div className="text-center bg-yellow-50 rounded-xl p-3 ml-3 flex-none">
                    <p className="text-2xl font-bold text-yellow-600">⭐ {avgRating}</p>
                    <p className="text-xs text-gray-400">{reviews.length} đánh giá</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatVND(court.price_per_hour)}
                  <span className="text-base font-normal text-gray-400">/giờ</span>
                </p>
                {court.description && (
                  <p className="text-gray-600 mt-4 pt-4 border-t leading-relaxed">{court.description}</p>
                )}
              </div>
            </div>

            {/* Form review */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">✍️ Đánh giá sân</h2>
              <form onSubmit={handleReview} className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Chọn số sao</p>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button" onClick={() => setMyRating(star)}
                        className={`text-2xl transition ${star <= myRating ? 'opacity-100' : 'opacity-30'}`}>
                        ⭐
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-500 self-center">{myRating}/5</span>
                  </div>
                </div>
                <div>
                  <textarea value={myComment} onChange={e => setMyComment(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
                </div>
                <button type="submit" disabled={submitting}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl transition disabled:opacity-50 text-sm">
                  {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </form>
            </div>

            {/* Danh sách review */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4">💬 Đánh giá từ khách hàng</h2>
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900 text-sm">{r.user?.full_name}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(r.created_at).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {[1,2,3,4,5].map(star => (
                          <span key={star} className={`text-sm ${star <= r.rating ? 'opacity-100' : 'opacity-20'}`}>⭐</span>
                        ))}
                      </div>
                      {r.comment && <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cột phải: đặt sân */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
              <h2 className="font-bold text-gray-900 text-lg mb-4">Chọn lịch đặt sân</h2>
              <p className="text-sm font-medium text-gray-500 mb-2">📅 Chọn ngày</p>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
                {days.map((date, i) => {
                  const active = toDateStr(date) === toDateStr(selectedDate)
                  return (
                    <button key={i} onClick={() => setSelectedDate(date)}
                      className={`flex-none flex flex-col items-center justify-center w-12 h-14 rounded-xl text-xs transition ${
                        active ? 'bg-green-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 border border-gray-100 hover:bg-green-50 hover:text-green-600'
                      }`}>
                      <span className="opacity-70">{DAY_SHORT[date.getDay()]}</span>
                      <span className="font-bold text-base">{date.getDate()}</span>
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">⏰ Chọn giờ</p>
                <div className="flex gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-gray-100 border inline-block" /> Đã đặt
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-green-600 inline-block" /> Đang chọn
                  </span>
                </div>
              </div>

              {fetching ? (
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {Array.from({ length: 17 }).map((_, i) => (
                    <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {HOURS.map(hour => {
                    const booked = bookedSlots.has(hour)
                    const selected = selectedHour === hour
                    return (
                      <button key={hour} disabled={booked}
                        onClick={() => setSelectedHour(selected ? null : hour)}
                        className={`h-9 rounded-lg text-xs font-medium transition-all duration-150 ${
                          booked ? 'bg-gray-100 text-gray-300 line-through cursor-not-allowed'
                            : selected ? 'bg-green-600 text-white shadow-md scale-105'
                            : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-green-400 hover:text-green-600 hover:bg-green-50'
                        }`}>
                        {hour}:00
                      </button>
                    )
                  })}
                </div>
              )}

              {selectedHour ? (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Khung giờ</span>
                    <span className="font-semibold">{selectedHour}:00 — {selectedHour + 1}:00</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tổng tiền</span>
                    <span className="font-bold text-green-600 text-base">{formatVND(court.price_per_hour)}</span>
                  </div>
                  <button onClick={handleBook} disabled={booking}
                    className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50">
                    {booking ? 'Đang xử lý...' : 'Xác nhận đặt sân'}
                  </button>
                </div>
              ) : (
                <p className="text-center text-gray-400 text-sm border-t pt-4">
                  Chọn một khung giờ để tiến hành đặt sân
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.ok ? 'bg-green-600' : 'bg-orange-500'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}