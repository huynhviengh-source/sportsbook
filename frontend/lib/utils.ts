export const HOURS = Array.from({ length: 17 }, (_, i) => i + 6)
export const DAY_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export function next14Days(): Date[] {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d
  })
}

export function toDateStr(d: Date) {
  return d.toISOString().split('T')[0]
}

export function formatVND(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}