import { Link } from "react-router-dom";
import { Icons } from "../icons";
import useReveal from "../../hooks/useReveal";

const services = [
  {
    title: "Tìm kiếm & Sàng lọc",
    desc: "Đề xuất tòa nhà phù hợp tiêu chí vị trí, diện tích, ngân sách.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: "Tư vấn Pháp lý",
    desc: "Kiểm tra pháp lý, hợp đồng thuê/mua bán an toàn.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
      </svg>
    ),
  },
  {
    title: "Đàm phán Thương lượng",
    desc: "Đại diện khách hàng tối ưu điều khoản giá và ưu đãi.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    title: "Phân tích Thị trường",
    desc: "Báo cáo giá thuê, tỷ lệ lấp đầy, xu hướng khu vực.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "Bảo vệ Quyền lợi",
    desc: "Đồng hành suốt thời gian thuê, hỗ trợ tranh chấp.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Hỗ trợ 24/7",
    desc: "Đa kênh: hotline, email, chat. Phản hồi nhanh.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  const revealRef = useReveal();

  return (
    <section id="services" className="py-24 px-4 sm:px-6 bg-white">
      <div ref={revealRef} className="reveal mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="estatic-section-label">Dịch vụ</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-dark-800">
            Giải pháp trọn vẹn cho nhà đầu tư
          </h2>
          <div className="estatic-divider mx-auto mt-4" />
          <p className="mt-4 text-dark-400 max-w-2xl mx-auto font-body leading-relaxed">
            Đội ngũ RealEstate đồng hành từ khâu tìm kiếm, pháp lý đến vận hành và tối ưu lợi nhuận.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="group card-premium border border-dark-100 bg-white p-8 hover:border-primary-300 transition-colors"
            >
              <div className="w-14 h-14 rounded-full border border-dark-200 flex items-center justify-center text-dark-600 group-hover:border-primary-400 group-hover:text-primary-500 group-hover:bg-primary-50 transition-all duration-300 mb-5">
                {s.icon}
              </div>
              <h3 className="text-lg font-semibold text-dark-800 group-hover:text-primary-600 transition-colors font-body">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-dark-400 leading-relaxed font-body">
                {s.desc}
              </p>
              <Link
                to="/services"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-500 hover:text-primary-700 group-hover:gap-3 transition-all font-body"
              >
                Tìm hiểu thêm {Icons.arrow}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
