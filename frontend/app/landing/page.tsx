'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

function AnimateIn({ children, delay = 0, className = '' }: any) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

const FEATURES = [
  { icon: '⚡', title: 'Real-time', desc: 'Xem lịch trống tức thì — khi ai đó đặt giờ, bạn thấy ngay không cần reload' },
  { icon: '🏟️', title: 'Đa môn thể thao', desc: 'Pickleball, Cầu lông, Tennis, Bóng đá — tất cả trong một ứng dụng' },
  { icon: '📱', title: 'Dễ sử dụng', desc: 'Giao diện đơn giản, đặt sân chỉ 3 bước: chọn sân → chọn giờ → xác nhận' },
  { icon: '🤖', title: 'AI Chatbot', desc: 'Trợ lý AI tư vấn sân phù hợp, trả lời câu hỏi về giá và địa điểm' },
  { icon: '⭐', title: 'Đánh giá sân', desc: 'Xem review từ người dùng thực, chọn sân chất lượng nhất' },
  { icon: '🔒', title: 'Bảo mật', desc: 'Xác thực JWT, phân quyền rõ ràng giữa khách hàng và chủ sân' },
]

const SPORTS = [
  { icon: '🏓', name: 'Pickleball', count: '2 sân', color: 'from-green-400 to-emerald-600' },
  { icon: '🏸', name: 'Cầu lông',  count: '2 sân', color: 'from-blue-400 to-blue-600' },
  { icon: '🎾', name: 'Tennis',    count: '1 sân', color: 'from-yellow-400 to-orange-500' },
  { icon: '⚽', name: 'Bóng đá',  count: '1 sân', color: 'from-red-400 to-rose-600' },
]

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-green-600">🏟️ SportsBook</span>
          <div className="flex items-center gap-3">
            <Link href="/auth/login"
              className="text-sm text-gray-600 hover:text-green-600 px-4 py-2 rounded-xl transition">
              Đăng nhập
            </Link>
            <Link href="/auth/login"
              className="text-sm bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl transition">
              Bắt đầu ngay
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center pt-16">
        <div className="max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-medium px-4 py-2 rounded-full mb-6"
              style={{ animation: 'fadeInDown 0.6s ease' }}>
              ⚡ Real-time slot booking
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
              style={{ animation: 'fadeInUp 0.6s ease 0.1s both' }}>
              Đặt sân thể thao{' '}
              <span className="text-green-600">dễ dàng</span>
            </h1>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed"
              style={{ animation: 'fadeInUp 0.6s ease 0.2s both' }}>
              Tìm và đặt sân Pickleball, Cầu lông, Tennis, Bóng đá tại TP.HCM. Xem lịch trống theo thời gian thực — không cần gọi điện, không cần chờ đợi.
            </p>
            <div className="flex flex-wrap gap-4" style={{ animation: 'fadeInUp 0.6s ease 0.3s both' }}>
              <Link href="/auth/login"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-2xl transition hover:scale-105 shadow-lg shadow-green-200">
                Đặt sân ngay →
              </Link>
              <Link href="/auth/login"
                className="bg-white border-2 border-gray-200 hover:border-green-400 text-gray-700 font-semibold px-8 py-4 rounded-2xl transition hover:scale-105">
                Xem demo
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-10" style={{ animation: 'fadeInUp 0.6s ease 0.4s both' }}>
              {[
                { num: '6+', label: 'Sân thể thao' },
                { num: '4', label: 'Môn thể thao' },
                { num: '100%', label: 'Real-time' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-green-600">{s.num}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative" style={{ animation: 'fadeInRight 0.8s ease 0.2s both' }}>
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-gray-400">SportsBook App</span>
              </div>
              <div className="space-y-3">
                <div className="bg-green-50 rounded-xl p-3 flex items-center gap-3">
                  <span className="text-2xl">🏓</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">Sân Pickleball Quận 7</p>
                    <p className="text-xs text-gray-500">120.000đ/giờ · ⭐ 5.0</p>
                  </div>
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-lg">Đặt ngay</span>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {['6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00'].map((h, i) => (
                    <div key={i} className={`text-center py-2 rounded-lg text-xs font-medium ${
                      i === 2 || i === 5 ? 'bg-gray-100 text-gray-400 line-through' :
                      i === 3 ? 'bg-green-600 text-white scale-105 shadow-md' :
                      'bg-gray-50 text-gray-600 border border-gray-200'
                    }`}>
                      {h}
                    </div>
                  ))}
                </div>
                <div className="bg-green-600 text-white rounded-xl p-3 text-center text-sm font-semibold">
                  ✅ Đặt sân thành công!
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-3 border border-gray-100"
              style={{ animation: 'float 3s ease-in-out infinite' }}>
              <p className="text-xs font-semibold text-gray-700">⚡ Real-time</p>
              <p className="text-xs text-gray-400">Cập nhật tức thì</p>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-3 border border-gray-100"
              style={{ animation: 'float 3s ease-in-out infinite 1.5s' }}>
              <p className="text-xs font-semibold text-gray-700">🤖 AI Chatbot</p>
              <p className="text-xs text-gray-400">Tư vấn 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sports section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <AnimateIn className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Các môn thể thao</h2>
            <p className="text-gray-500">Đa dạng lựa chọn sân thể thao tại TP.HCM</p>
          </AnimateIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {SPORTS.map((s, i) => (
              <AnimateIn key={i} delay={i * 100}>
                <div className={`bg-gradient-to-br ${s.color} rounded-3xl p-6 text-white text-center hover:scale-105 transition-transform cursor-pointer shadow-lg`}>
                  <div className="text-5xl mb-3">{s.icon}</div>
                  <p className="font-bold text-lg">{s.name}</p>
                  <p className="text-white/80 text-sm mt-1">{s.count}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <AnimateIn className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Tại sao chọn SportsBook?</h2>
            <p className="text-gray-500">Giải pháp đặt sân hiện đại, nhanh chóng và tiện lợi</p>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <AnimateIn key={i} delay={i * 80}>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-green-200 hover:shadow-lg transition-all duration-300 group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-600">
        <AnimateIn className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Sẵn sàng đặt sân?</h2>
          <p className="text-green-100 text-lg mb-8">Tham gia ngay và trải nghiệm đặt sân thể thao dễ dàng nhất</p>
          <Link href="/auth/login"
            className="inline-block bg-white text-green-600 font-bold px-10 py-4 rounded-2xl hover:scale-105 transition-transform shadow-xl text-lg">
            Bắt đầu miễn phí →
          </Link>
        </AnimateIn>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-2xl font-bold text-white mb-2">🏟️ SportsBook</p>
          <p className="text-sm">Đặt sân thể thao dễ dàng · Real-time · TP.HCM</p>
          <p className="text-xs mt-4">© 2026 SportsBook. Built with Next.js + NestJS</p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}