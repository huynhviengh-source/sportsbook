'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { Court, SPORT_META, SportType } from '@/types'
import { formatVND } from '@/lib/utils'

const ChatBot = dynamic(() => import('@/components/ai/ChatBot'), { ssr: false })

const FILTERS = [
  { key: 'all',        label: 'Tất cả',    icon: '🏟️' },
  { key: 'pickleball', label: 'Pickleball', icon: '🏓' },
  { key: 'badminton',  label: 'Cầu lông',  icon: '🏸' },
  { key: 'tennis',     label: 'Tennis',    icon: '🎾' },
  { key: 'football',   label: 'Bóng đá',  icon: '⚽' },
]

const SPORT_BANNERS = [
  { type: 'pickleball', label: 'Pickleball', icon: '🏓', color: 'from-green-400 to-emerald-600', img: 'https://padelcode.com.au/cdn/shop/articles/what_is_pickleball.jpg?v=1716460909' },
  { type: 'badminton',  label: 'Cầu lông',  icon: '🏸', color: 'from-blue-400 to-blue-600',    img: 'https://pacificcross.com.vn/wp-content/uploads/2023/04/danh-cau-long-co-tang-chieu-cao-khong-1024x683.jpg' },
  { type: 'tennis',     label: 'Tennis',    icon: '🎾', color: 'from-yellow-400 to-orange-500', img: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600' },
  { type: 'football',   label: 'Bóng đá',  icon: '⚽', color: 'from-red-400 to-rose-600',      img: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600' },
]

export default function HomePage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const [courts, setCourts] = useState<Court[]>([])
  const [sport, setSport] = useState('all')
  const [fetching, setFetching] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [user, loading])

  useEffect(() => {
    if (!user) return
    setFetching(true)
    const q = sport !== 'all' ? `?sport_type=${sport}` : ''
    api.get<Court[]>(`/courts${q}`)
      .then(setCourts)
      .finally(() => setFetching(false))
  }, [sport, user])

  // Auto slide banner
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(i => (i + 1) % SPORT_BANNERS.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const topCourts = [...courts].sort((a, b) => b.rating - a.rating).slice(0, 3)

  if (loading || !user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏟️</span>
            <span className="text-xl font-bold text-green-600">SportsBook</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link href="/search" className="text-sm px-3 py-2 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-600 transition flex items-center gap-1">
              🔍 <span className="hidden sm:inline">Tìm kiếm</span>
            </Link>
            <Link href="/profile" className="text-sm px-3 py-2 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-600 transition flex items-center gap-1">
              👤 <span className="hidden sm:inline">Profile</span>
            </Link>
            <Link href="/my-bookings" className="text-sm px-3 py-2 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-600 transition flex items-center gap-1">
              📅 <span className="hidden sm:inline">Lịch đặt</span>
            </Link>
            <button onClick={() => { logout(); router.push('/auth/login') }}
              className="text-sm px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition ml-1">
              Đăng xuất
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 flex items-center justify-between">
          <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
            <p className="text-green-100 text-sm font-medium mb-2">⚡ Real-time slot booking</p>
            <h1 className="text-3xl font-bold mb-2">Xin chào, {user.full_name}! 👋</h1>
            <p className="text-green-100 mb-4">Hôm nay bạn muốn chơi môn gì?</p>
            <Link href="/search" className="inline-block bg-white text-green-600 font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg transition hover:scale-105 text-sm">
              🔍 Tìm sân ngay →
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-4" style={{ opacity: mounted ? 1 : 0, transition: 'all 0.6s ease 0.2s' }}>
            {[
              { num: courts.length, label: 'Sân' },
              { num: '4', label: 'Môn thể thao' },
              { num: '100%', label: 'Real-time' },
            ].map((s, i) => (
              <div key={i} className="text-center bg-white/10 rounded-2xl px-5 py-3">
                <p className="text-2xl font-bold">{s.num}</p>
                <p className="text-green-100 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">

        {/* === SECTION 1: Banner slide môn thể thao === */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">🏅 Khám phá theo môn thể thao</h2>
          <div className="relative overflow-hidden rounded-2xl h-52 cursor-pointer" onClick={() => setSport(SPORT_BANNERS[slideIndex].type as SportType)}>
            {SPORT_BANNERS.map((b, i) => (
              <div key={i} className="absolute inset-0 transition-all duration-700"
                style={{ opacity: i === slideIndex ? 1 : 0, transform: i === slideIndex ? 'scale(1)' : 'scale(1.05)' }}>
                <img src={b.img} alt={b.label} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-r ${b.color} opacity-70`} />
                <div className="absolute inset-0 flex items-center justify-center text-white text-center">
                  <div>
                    <p className="text-6xl mb-2">{b.icon}</p>
                    <p className="text-3xl font-bold">{b.label}</p>
                    <p className="text-white/80 mt-1 text-sm">Click để xem sân {b.label}</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {SPORT_BANNERS.map((_, i) => (
                <button key={i} onClick={e => { e.stopPropagation(); setSlideIndex(i) }}
                  className={`w-2 h-2 rounded-full transition-all ${i === slideIndex ? 'bg-white w-6' : 'bg-white/50'}`} />
              ))}
            </div>
          </div>

          {/* 4 sport cards */}
          <div className="grid grid-cols-4 gap-3 mt-3">
            {SPORT_BANNERS.map((b, i) => (
              <button key={i} onClick={() => { setSport(b.type as SportType); setSlideIndex(i) }}
                className={`relative overflow-hidden rounded-xl h-16 transition-all duration-200 ${sport === b.type ? 'ring-2 ring-green-500 scale-105' : 'hover:scale-105'}`}>
                <img src={b.img} alt={b.label} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-r ${b.color} opacity-60`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{b.icon} {b.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* === SECTION 2: Sân nổi bật === */}
        {topCourts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">🏆 Sân nổi bật</h2>
              <span className="text-xs text-gray-400">Top rating cao nhất</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topCourts.map((court, i) => {
                const meta = SPORT_META[court.sport_type]
                return (
                  <Link key={court.id} href={`/courts/${court.id}`}>
                    <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                      {i === 0 && (
                        <div className="absolute top-3 left-3 z-10 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                          🥇 #1
                        </div>
                      )}
                      {court.image_url ? (
                        <img src={court.image_url} alt={court.name} className="w-full h-32 object-cover" />
                      ) : (
                        <div className="w-full h-32 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center text-4xl">
                          {meta.icon}
                        </div>
                      )}
                      <div className="p-3">
                        <p className="font-bold text-gray-900 text-sm truncate">{court.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5 truncate">📍 {court.address}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-green-600 font-bold text-sm">{formatVND(court.price_per_hour)}/giờ</span>
                          <span className="text-yellow-600 font-semibold text-xs">⭐ {court.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* === SECTION 3: Filter + Danh sách sân === */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setSport(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  sport === f.key
                    ? 'bg-green-600 text-white shadow-md shadow-green-200 scale-105'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600'
                }`}>
                {f.icon} {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {sport === 'all' ? '🏟️ Tất cả sân' : `${FILTERS.find(f => f.key === sport)?.icon} Sân ${FILTERS.find(f => f.key === sport)?.label}`}
              <span className="text-gray-400 font-normal text-sm ml-2">({courts.length} sân)</span>
            </h2>
            <Link href="/search" className="text-sm text-green-600 hover:text-green-700 font-medium">
              Xem tất cả →
            </Link>
          </div>

          {fetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-gradient-to-r from-gray-200 to-gray-100" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                    <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : courts.length === 0 ? (
            <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <p className="text-6xl mb-4">🔍</p>
              <p className="text-lg font-medium">Không tìm thấy sân nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courts.map((court, i) => (
                <CourtCard key={court.id} court={court} index={i} mounted={mounted} />
              ))}
            </div>
          )}
        </div>
      </main>

      <ChatBot />
    </div>
  )
}

function CourtCard({ court, index, mounted }: { court: Court; index: number; mounted: boolean }) {
  const meta = SPORT_META[court.sport_type]
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/courts/${court.id}`}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: `all 0.5s ease ${index * 80}ms`,
        }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <div className="relative h-44 overflow-hidden">
          {court.image_url ? (
            <img src={court.image_url} alt={court.name}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center text-5xl">
              {meta.icon}
            </div>
          )}
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full">
            {meta.icon} {meta.label}
          </span>
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-yellow-600">
            ⭐ {court.rating}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-base">{court.name}</h3>
          <p className="text-gray-500 text-sm mt-1 truncate">📍 {court.address}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
            <span className="text-green-600 font-bold text-lg">
              {formatVND(court.price_per_hour)}
              <span className="text-gray-400 text-sm font-normal">/giờ</span>
            </span>
            <span className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${
              hovered ? 'bg-green-600 text-white shadow-md' : 'bg-green-50 text-green-700'
            }`}>
              Đặt ngay →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}