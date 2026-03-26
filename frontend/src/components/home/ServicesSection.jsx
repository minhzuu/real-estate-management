import { Link } from "react-router-dom";
import { Icons } from "../icons";
import useReveal from "../../hooks/useReveal";

const services = [
  { title: "Tìm kiếm & Sàng lọc", desc: "Đề xuất tòa nhà phù hợp tiêu chí vị trí, diện tích, ngân sách.", emoji: "🔍" },
  { title: "Tư vấn Pháp lý", desc: "Kiểm tra pháp lý, hợp đồng thuê/mua bán an toàn.", emoji: "⚖️" },
  { title: "Đàm phán Thương lượng", desc: "Đại diện khách hàng tối ưu điều khoản giá và ưu đãi.", emoji: "🤝" },
  { title: "Phân tích Thị trường", desc: "Báo cáo giá thuê, tỷ lệ lấp đầy, xu hướng khu vực.", emoji: "📊" },
  { title: "Bảo vệ Quyền lợi", desc: "Đồng hành suốt thời gian thuê, hỗ trợ tranh chấp.", emoji: "🛡️" },
  { title: "Hỗ trợ 24/7", desc: "Đa kênh: hotline, email, chat. Phản hồi nhanh.", emoji: "💬" },
];

export default function ServicesSection() {
  const revealRef = useReveal();

  return (
    <section id="services" className="py-20 px-4 sm:px-6 bg-white">
      <div ref={revealRef} className="reveal mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-500">Dịch vụ</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
            Giải pháp <span className="gradient-text">trọn vẹn</span> cho nhà đầu tư
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            Đội ngũ RealEstate Pro đồng hành từ khâu tìm kiếm, pháp lý đến vận hành và tối ưu lợi nhuận.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="group card-premium rounded-2xl border border-gray-100 bg-white p-6 hover:border-primary-200">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">{s.emoji}</div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              <Link to="/services" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-500 hover:text-primary-700 group-hover:gap-3 transition-all">
                Tìm hiểu thêm {Icons.arrow}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
