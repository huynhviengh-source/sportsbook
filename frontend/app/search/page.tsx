'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { Court, SPORT_META, SportType } from '@/types'
import { formatVND } from '@/lib/utils'

const DISTRICTS = ['Tất cả', 'Quận 1', 'Quận 3', 'Quận 7', 'Tân Bình', 'Bình Thạnh', 'Phú Nhuận', 'Gò Vấp']

export default function SearchPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [courts, setCourts] = useState<Court[]>([])
  const [filtered, setFiltered] = useState<Court[]>([])
  const [fetching, setFetching] = useState(true)

  const [keyword, setKeyword] = useState('')
  const [sport, setSport] = useState('all')
  const [district, setDistrict] = useState('Tất cả')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(500000)
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('rating')

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [user, loading])

  useEffect(() => {
    if (!user) return
    api.get<Court[]>('/courts').then(data => {
      setCourts(data)
      setFiltered(data)
      setFetching(false)
    })
  }, [user])

  useEffect(() => {
    let result = [...courts]

    if (keyword) result = result.filter(c =>
      c.name.toLowerCase().includes(keyword.toLowerCase()) ||
      c.address.toLowerCase().includes(keyword.toLowerCase())
    )
    if (sport !== 'all') result = result.filter(c => c.sport_type === sport)
    if (district !== 'Tất cả') result = result.filter(c => c.address.includes(district))
    result = result.filter(c => c.price_per_hour >= minPrice && c.price_per_hour <= maxPrice)
    result = result.filter(c => c.rating >= minRating)

    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'price_asc') result.sort((a, b) => a.price_per_hour - b.price_per_hour)
    else if (sortBy === 'price_desc') result.sort((a, b) => b.price_per_hour - a.price_per_hour)

    setFiltered(result)
  }, [keyword, sport, district, minPrice, maxPrice, minRating, sortBy, courts])

  if (loading || !user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-green-600">🏟️ SportsBook</Link>
          <nav className="flex items-center gap-2">
            <Link href="/profile" className="text-sm px-3 py-2 rounded-lg text-gray-600 hover:bg-green-50 transition">👤 Profile</Link>
            <Link href="/my-bookings" className="text-sm px-3 py-2 rounded-lg text-gray-600 hover:bg-green-50 transition">📅 Lịch đặt</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">🔍 Tìm kiếm sân</h1>
          <p className="text-gray-500 text-sm">Tìm sân phù hợp với bộ lọc nâng cao</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Bộ lọc */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5 sticky top-20">
              <h2 className="font-semibold text-gray-900">Bộ lọc</h2>

              {/* Tìm kiếm */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Từ khoá</label>
                <input value={keyword} onChange={e => setKeyword(e.target.value)}
                  placeholder="Tên sân, địa chỉ..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              {/* Môn thể thao */}
              <div>
                <label className="text-xs text-gray-500 mb-2 block">Môn thể thao</label>
                <div className="space-y-1">
                  {[
                    { key: 'all', label: 'Tất cả', icon: '🏟️' },
                    { key: 'pickleball', label: 'Pickleball', icon: '🏓' },
                    { key: 'badminton', label: 'Cầu lông', icon: '🏸' },
                    { key: 'tennis', label: 'Tennis', icon: '🎾' },
                    { key: 'football', label: 'Bóng đá', icon: '⚽' },
                  ].map(s => (
                    <button key={s.key} onClick={() => setSport(s.key)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition ${
                        sport === s.key ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                      }`}>
                      {s.icon} {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quận */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Khu vực</label>
                <select value={district} onChange={e => setDistrict(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              {/* Giá */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Giá tối đa: {formatVND(maxPrice)}/giờ
                </label>
                <input type="range" min={0} max={500000} step={10000}
                  value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}
                  className="w-full accent-green-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0đ</span><span>500k</span>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-xs text-gray-500 mb-2 block">Đánh giá tối thiểu</label>
                <div className="flex gap-1">
                  {[0,1,2,3,4,5].map(r => (
                    <button key={r} onClick={() => setMinRating(r)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                        minRating === r ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>
                      {r === 0 ? 'Tất cả' : `${r}⭐`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <button onClick={() => {
                setKeyword(''); setSport('all'); setDistrict('Tất cả')
                setMaxPrice(500000); setMinRating(0); setSortBy('rating')
              }}
                className="w-full border border-gray-200 text-gray-500 hover:bg-gray-50 py-2 rounded-xl text-sm transition">
                Xoá bộ lọc
              </button>
            </div>
          </div>

          {/* Kết quả */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Tìm thấy <span className="font-semibold text-gray-900">{filtered.length}</span> sân
              </p>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="rating">⭐ Đánh giá cao nhất</option>
                <option value="price_asc">💰 Giá thấp → cao</option>
                <option value="price_desc">💰 Giá cao → thấp</option>
              </select>
            </div>

            {fetching ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border">
                <p className="text-5xl mb-3">🔍</p>
                <p>Không tìm thấy sân nào phù hợp</p>
                <p className="text-sm mt-1">Thử thay đổi bộ lọc</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(court => {
                  const meta = SPORT_META[court.sport_type]
                  return (
                    <Link key={court.id} href={`/courts/${court.id}`}>
                      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 hover:border-green-200 hover:shadow-md transition-all cursor-pointer group">
                        {court.image_url ? (
                          <img src={court.image_url} alt={court.name}
                            className="w-24 h-24 rounded-xl object-cover flex-none group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-24 h-24 rounded-xl bg-green-50 flex items-center justify-center text-3xl flex-none">
                            {meta.icon}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-gray-900">{court.name}</h3>
                              <p className="text-gray-500 text-sm mt-0.5">📍 {court.address}</p>
                            </div>
                            <span className="text-sm font-semibold text-yellow-600 flex-none ml-2">⭐ {court.rating}</span>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                court.sport_type === 'pickleball' ? 'bg-green-50 text-green-700' :
                                court.sport_type === 'badminton' ? 'bg-blue-50 text-blue-700' :
                                court.sport_type === 'tennis' ? 'bg-yellow-50 text-yellow-700' :
                                'bg-red-50 text-red-700'
                              }`}>
                                {meta.icon} {meta.label}
                              </span>
                            </div>
                            <span className="text-green-600 font-bold">
                              {formatVND(court.price_per_hour)}<span className="text-gray-400 text-sm font-normal">/giờ</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}