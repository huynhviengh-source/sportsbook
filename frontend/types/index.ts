export type SportType = 'pickleball' | 'badminton' | 'tennis' | 'football'

export interface Court {
  id: string
  name: string
  sport_type: SportType
  address: string
  price_per_hour: number
  image_url: string | null
  description: string | null
  rating: number
}

export interface Booking {
  id: string
  court_id: string
  booking_date: string
  start_hour: number
  end_hour: number
  total_price: number
  status: 'confirmed' | 'cancelled'
  court?: Pick<Court, 'name' | 'sport_type' | 'address'>
}

export interface AuthUser {
  id: string
  email: string
  full_name: string
  role: string
}

export const SPORT_META: Record<SportType, { label: string; icon: string }> = {
  pickleball: { label: 'Pickleball', icon: '🏓' },
  badminton:  { label: 'Cầu lông',  icon: '🏸' },
  tennis:     { label: 'Tennis',    icon: '🎾' },
  football:   { label: 'Bóng đá',  icon: '⚽' },
}