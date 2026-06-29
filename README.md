# 🏟️ SportsBook — Đặt sân thể thao Real-time

Ứng dụng đặt sân thể thao với tính năng xem lịch trống theo thời gian thực.

## 🚀 Tech Stack

**Frontend:** Next.js 14 (App Router), Tailwind CSS, Socket.io Client

**Backend:** NestJS, TypeORM, PostgreSQL, Socket.io, JWT Auth

**Điểm nổi bật:** Real-time slot booking — khi A đặt giờ, B thấy ngay không cần refresh

## ✨ Tính năng

- 🔐 Đăng ký / Đăng nhập (JWT)
- 🏟️ Danh sách sân theo môn thể thao (Pickleball, Cầu lông, Tennis, Bóng đá)
- ⚡ Đặt sân real-time — lưới giờ cập nhật tức thì qua WebSocket
- 📅 Xem và huỷ lịch đặt
- ⭐ Review và đánh giá sân
- 🤖 Chatbot AI hỗ trợ tìm sân
- 🛠️ Trang admin quản lý sân và lịch đặt
- 🔒 Phân quyền customer / owner

## 🛠️ Cài đặt

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Điền thông tin database vào .env
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📡 API Docs
Swagger UI: `http://localhost:3001/api/docs`

## 📁 Cấu trúc

```
sportsbook/
├── backend/          # NestJS API
│   └── src/
│       ├── auth/     # JWT Authentication
│       ├── courts/   # Quản lý sân
│       ├── bookings/ # Đặt sân + Real-time
│       ├── reviews/  # Đánh giá sân
│       ├── ai/       # Chatbot AI
│       └── gateway/  # WebSocket Gateway
└── frontend/         # Next.js App
    └── app/
        ├── page.tsx           # Trang chủ
        ├── courts/[id]/       # Chi tiết sân
        ├── my-bookings/       # Lịch đặt
        └── admin/             # Trang quản trị
```