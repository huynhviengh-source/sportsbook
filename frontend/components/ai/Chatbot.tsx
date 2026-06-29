'use client'
import { useState, useRef, useEffect } from 'react'
import { api } from '@/lib/api'

interface Message {
  role: 'user' | 'ai'
  text: string
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Xin chào! Tôi là trợ lý AI của SportsBook 🏟️ Tôi có thể giúp bạn tìm sân, hỏi về giá, giờ hoạt động. Bạn cần gì?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)
    try {
      const res: any = await api.post('/ai/chat', { message: userMsg })
      setMessages(prev => [...prev, { role: 'ai', text: res.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
      {/* Chat box */}
      {open && (
        <div className="mb-4 bg-white rounded-2xl border border-gray-200 shadow-2xl flex flex-col"
          style={{ width: '340px', height: '480px' }}>

          {/* Header */}
          <div className="bg-green-600 rounded-t-2xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
              <div>
                <p className="text-white font-semibold text-sm">SportsBook AI</p>
                <p className="text-green-100 text-xs">Luôn sẵn sàng hỗ trợ</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white text-xl leading-none">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && (
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs mr-2 flex-none mt-1">🤖</div>
                )}
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-green-600 text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs mr-2">🤖</div>
                <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Nhập câu hỏi..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button onClick={send} disabled={loading || !input.trim()}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl transition disabled:opacity-50 text-sm font-medium">
              Gửi
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition hover:scale-110 ml-auto"
      >
        {open ? '✕' : '🤖'}
      </button>
    </div>
  )
}