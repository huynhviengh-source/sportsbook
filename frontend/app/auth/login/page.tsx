'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '', full_name: '' })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      if (isLogin) {
        const res: any = await api.post('/auth/login', { email: form.email, password: form.password })
        login(res.access_token, res.user)
        router.push('/home')
      } else {
        await api.post('/auth/register', form)
        setIsLogin(true)
        setError('✅ Đăng ký thành công! Hãy đăng nhập.')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Cột trái — hình ảnh giới thiệu */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 flex-col justify-between p-12">
        <div>
          <span className="text-white text-2xl font-bold">🏟️ SportsBook</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Đặt sân thể thao<br />
            <span className="text-green-200">dễ dàng & nhanh chóng</span>
          </h1>
          <p className="text-green-100 text-lg mb-8">
            Xem lịch trống theo thời gian thực, đặt sân chỉ trong vài giây.
          </p>

          <div className="space-y-4">
            {[
              { icon: '⚡', title: 'Real-time', desc: 'Lịch trống cập nhật tức thì' },
              { icon: '🏟️', title: 'Đa môn thể thao', desc: 'Pickleball, Cầu lông, Tennis, Bóng đá' },
              { icon: '🤖', title: 'AI Chatbot', desc: 'Tư vấn sân phù hợp 24/7' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white font-semibold">{f.title}</p>
                  <p className="text-green-200 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {['🧑', '👩', '🧔', '👱'].map((a, i) => (
              <div key={i} className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center text-sm border-2 border-white/40">
                {a}
              </div>
            ))}
          </div>
          <p className="text-green-100 text-sm">Hàng trăm người đặt sân mỗi ngày</p>
        </div>
      </div>

      {/* Cột phải — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-3xl font-bold text-green-600">🏟️ SportsBook</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Chào mừng trở lại! 👋' : 'Tạo tài khoản mới'}
            </h2>
            <p className="text-gray-500 mt-1">
              {isLogin ? 'Đăng nhập để đặt sân yêu thích' : 'Tham gia SportsBook ngay hôm nay'}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
                <input type="text" required value={form.full_name} onChange={set('full_name')}
                  placeholder="Nguyễn Văn A"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={set('email')}
                placeholder="example@gmail.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
              <input type="password" required value={form.password} onChange={set('password')}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
            </div>

            {error && (
              <div className={`text-sm px-4 py-3 rounded-xl border ${
                error.startsWith('✅')
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-red-50 text-red-600 border-red-200'
              }`}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition hover:shadow-lg hover:shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Đang xử lý...
                </span>
              ) : isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs text-gray-400 bg-gray-50 px-3">
                hoặc
              </div>
            </div>

            <button type="button" onClick={() => { setIsLogin(!isLogin); setError('') }}
              className="w-full border-2 border-gray-200 hover:border-green-400 text-gray-700 hover:text-green-600 font-medium py-3 rounded-xl transition text-sm">
              {isLogin ? '✨ Tạo tài khoản mới' : '← Quay lại đăng nhập'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <span className="text-green-600 cursor-pointer">Điều khoản sử dụng</span>
          </p>
        </div>
      </div>
    </div>
  )
}