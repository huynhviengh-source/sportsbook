import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {

  async chat(userMessage: string, courts: any[]): Promise<string> {
    const msg = userMessage.toLowerCase()

    // Hỏi về giá
    if (msg.includes('giá') || msg.includes('bao nhiêu') || msg.includes('tiền')) {
      const list = courts.map(c => `${c.name}: ${c.price_per_hour.toLocaleString('vi-VN')}đ/giờ`).join(', ')
      return `Giá các sân hiện tại: ${list}. Bạn muốn đặt sân nào?`
    }

    // Hỏi về pickleball
    if (msg.includes('pickleball')) {
      const filtered = courts.filter(c => c.sport_type === 'pickleball')
      if (filtered.length === 0) return 'Hiện tại chưa có sân Pickleball. Vui lòng thử lại sau!'
      const list = filtered.map(c => `${c.name} (${c.address}) - ${c.price_per_hour.toLocaleString('vi-VN')}đ/giờ`).join('\n')
      return `Các sân Pickleball hiện có:\n${list}`
    }

    // Hỏi về cầu lông
    if (msg.includes('cầu lông') || msg.includes('badminton') || msg.includes('cau long')) {
      const filtered = courts.filter(c => c.sport_type === 'badminton')
      if (filtered.length === 0) return 'Hiện tại chưa có sân cầu lông. Vui lòng thử lại sau!'
      const list = filtered.map(c => `${c.name} (${c.address}) - ${c.price_per_hour.toLocaleString('vi-VN')}đ/giờ`).join('\n')
      return `Các sân cầu lông hiện có:\n${list}`
    }

    // Hỏi về tennis
    if (msg.includes('tennis')) {
      const filtered = courts.filter(c => c.sport_type === 'tennis')
      if (filtered.length === 0) return 'Hiện tại chưa có sân Tennis. Vui lòng thử lại sau!'
      const list = filtered.map(c => `${c.name} (${c.address}) - ${c.price_per_hour.toLocaleString('vi-VN')}đ/giờ`).join('\n')
      return `Các sân Tennis hiện có:\n${list}`
    }

    // Hỏi về bóng đá
    if (msg.includes('bóng đá') || msg.includes('bong da') || msg.includes('football')) {
      const filtered = courts.filter(c => c.sport_type === 'football')
      if (filtered.length === 0) return 'Hiện tại chưa có sân bóng đá. Vui lòng thử lại sau!'
      const list = filtered.map(c => `${c.name} (${c.address}) - ${c.price_per_hour.toLocaleString('vi-VN')}đ/giờ`).join('\n')
      return `Các sân bóng đá hiện có:\n${list}`
    }

    // Hỏi về địa chỉ
    if (msg.includes('địa chỉ') || msg.includes('ở đâu') || msg.includes('chỗ nào')) {
      const list = courts.map(c => `${c.name}: ${c.address}`).join('\n')
      return `Địa chỉ các sân:\n${list}`
    }

    // Hỏi về đặt sân
    if (msg.includes('đặt') || msg.includes('book') || msg.includes('thuê')) {
      return 'Để đặt sân, bạn chọn sân muốn đặt → chọn ngày → chọn khung giờ → nhấn Xác nhận. Rất đơn giản! Bạn muốn đặt môn gì?'
    }

    // Hỏi về rating
    if (msg.includes('tốt nhất') || msg.includes('rating') || msg.includes('đánh giá cao')) {
      const best = [...courts].sort((a, b) => b.rating - a.rating).slice(0, 3)
      const list = best.map(c => `${c.name}: ⭐ ${c.rating}`).join(', ')
      return `Top sân được đánh giá cao nhất: ${list}`
    }

    // Chào hỏi
    if (msg.includes('chào') || msg.includes('hello') || msg.includes('hi') || msg.includes('xin chào')) {
      return `Xin chào! Tôi có thể giúp bạn:\n- Tìm sân theo môn thể thao\n- Xem giá các sân\n- Hướng dẫn đặt sân\n\nBạn muốn tìm sân gì?`
    }

    // Xem danh sách sân
    if (msg.includes('sân') || msg.includes('tìm') || msg.includes('có những')) {
      const list = courts.map(c => `- ${c.name} (${c.sport_type}): ${c.price_per_hour.toLocaleString('vi-VN')}đ/giờ`).join('\n')
      return `Hiện có ${courts.length} sân:\n${list}\n\nBạn muốn đặt sân nào?`
    }

    // Mặc định
    return `Tôi có thể giúp bạn tìm sân theo môn (pickleball, cầu lông, tennis, bóng đá), xem giá, hoặc hướng dẫn đặt sân. Bạn cần gì?`
  }

  async suggestCourts(requirement: string, courts: any[]): Promise<any[]> {
    const req = requirement.toLowerCase()
    let filtered = courts

    if (req.includes('pickleball')) filtered = courts.filter(c => c.sport_type === 'pickleball')
    else if (req.includes('cầu lông') || req.includes('badminton')) filtered = courts.filter(c => c.sport_type === 'badminton')
    else if (req.includes('tennis')) filtered = courts.filter(c => c.sport_type === 'tennis')
    else if (req.includes('bóng đá') || req.includes('football')) filtered = courts.filter(c => c.sport_type === 'football')

    if (req.includes('rẻ') || req.includes('giá thấp')) {
      filtered = filtered.sort((a, b) => a.price_per_hour - b.price_per_hour)
    } else {
      filtered = filtered.sort((a, b) => b.rating - a.rating)
    }

    return filtered.slice(0, 3)
  }

  async generateReviewReply(reviewComment: string, rating: number, courtName: string): Promise<string> {
    if (rating >= 4) {
      return `Cảm ơn bạn rất nhiều vì đã dành thời gian đánh giá ${courtName}! Chúng tôi rất vui khi bạn hài lòng với dịch vụ. Hẹn gặp lại bạn lần sau! 🏟️`
    } else if (rating === 3) {
      return `Cảm ơn bạn đã đánh giá ${courtName}! Chúng tôi ghi nhận phản hồi của bạn và sẽ cố gắng cải thiện chất lượng dịch vụ. Mong được phục vụ bạn tốt hơn lần sau!`
    } else {
      return `Chúng tôi thành thật xin lỗi về trải nghiệm chưa tốt của bạn tại ${courtName}. Phản hồi của bạn rất quan trọng với chúng tôi. Chúng tôi cam kết sẽ cải thiện ngay. Mong bạn cho chúng tôi cơ hội phục vụ lại!`
    }
  }
}