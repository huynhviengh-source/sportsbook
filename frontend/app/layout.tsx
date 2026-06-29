import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SportsBook — Đặt sân thể thao',
  description: 'Đặt sân thể thao nhanh chóng, xem lịch trống theo thời gian thực',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}