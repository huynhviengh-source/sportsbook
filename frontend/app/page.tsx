'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import LandingPage from './landing/page'

export default function RootPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) router.push('/home')
  }, [user, loading])

  if (loading) return null
  if (user) return null // đang chuyển hướng sang /home

  return <LandingPage />
}