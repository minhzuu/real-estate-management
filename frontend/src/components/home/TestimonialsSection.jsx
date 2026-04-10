import { Icons } from "../icons";
import useReveal from "../../hooks/useReveal";

const testimonials = [
  {
    name: "Nguyễn Văn A",
    role: "CEO - Công ty công nghệ",
    quote: "Dịch vụ rất chuyên nghiệp. Tôi nhanh chóng tìm được văn phòng phù hợp ngân sách và kế hoạch mở rộng.",
    avatar: "N",
  },
  {
    name: "Trần Thị B",
    role: "Nhà đầu tư cá nhân",
    quote: "Đội ngũ tư vấn tận tâm, giải thích rõ ràng các điều khoản pháp lý giúp tôi yên tâm ký hợp đồng dài hạn.",
    avatar: "T",
  },
  {
    name: "Lê Minh C",
    role: "Quản lý chuỗi bán lẻ",
    quote: "Giá cả cạnh tranh, hỗ trợ sau thuê rất tốt. Chúng tôi đã mở rộng thêm nhiều điểm bán mới.",
    avatar: "L",
  },
];

export default function TestimonialsSection() {
  const revealRef = useReveal();

  return (
    <section id="about" className="py-24 px-4 sm:px-6 bg-dark-800">
      <div ref={revealRef} className="reveal mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-400 font-body">
            Phản hồi
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Khách hàng tin tưởng chúng tôi
          </h2>
          <div className="estatic-divider mx-auto mt-4" />
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group flex flex-col border border-dark-600 bg-dark-700/50 p-8 hover:border-primary-400/30 transition-colors"
            >
              <div className="flex gap-1 text-primary-400 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j}>{Icons.star}</span>
                ))}
              </div>
              <p className="text-sm text-dark-200 leading-relaxed italic flex-1 font-body">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-dark-600">
                <div className="w-12 h-12 rounded-full bg-primary-400/20 border border-primary-400/30 flex items-center justify-center text-sm font-bold text-primary-400 font-body">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white font-body">{t.name}</p>
                  <p className="text-xs text-dark-400 font-body">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
