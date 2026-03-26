import { Icons } from "../icons";
import useReveal from "../../hooks/useReveal";

const testimonials = [
  { name: "Nguyễn Văn A", role: "CEO - Công ty công nghệ", quote: "Dịch vụ rất chuyên nghiệp. Tôi nhanh chóng tìm được văn phòng phù hợp ngân sách và kế hoạch mở rộng.", avatar: "N" },
  { name: "Trần Thị B", role: "Nhà đầu tư cá nhân", quote: "Đội ngũ tư vấn tận tâm, giải thích rõ ràng các điều khoản pháp lý giúp tôi yên tâm ký hợp đồng dài hạn.", avatar: "T" },
  { name: "Lê Minh C", role: "Quản lý chuỗi bán lẻ", quote: "Giá cả cạnh tranh, hỗ trợ sau thuê rất tốt. Chúng tôi đã mở rộng thêm nhiều điểm bán mới.", avatar: "L" },
];

export default function TestimonialsSection() {
  const revealRef = useReveal();

  return (
    <section id="about" className="py-20 px-4 sm:px-6 bg-gray-50">
      <div ref={revealRef} className="reveal mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-500">Phản hồi</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
            Khách hàng <span className="gradient-text">tin tưởng</span> chúng tôi
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="group card-premium flex flex-col rounded-3xl border border-gray-100 bg-white p-7">
              <div className="flex gap-1 text-amber-400 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j}>{Icons.star}</span>
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed italic flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-primary-200">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
