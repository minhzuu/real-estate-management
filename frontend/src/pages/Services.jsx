import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import useReveal from "../hooks/useReveal";
import useCounter from "../hooks/useCounter";
import { Icons } from "../components/icons";

const services = [
  {
    title: "Tìm kiếm & Sàng lọc BĐS",
    desc: "Hệ thống AI phân tích hàng nghìn dữ liệu bất động sản, đề xuất tòa nhà phù hợp tiêu chí vị trí, diện tích, ngân sách và tiềm năng tăng trưởng của bạn.",
    features: ["Tìm kiếm thông minh theo vùng", "Lọc theo ngân sách & diện tích", "So sánh BĐS trực quan", "Đề xuất cá nhân hóa"],
    emoji: "🔍",
    gradient: "from-blue-500 to-cyan-400",
    bgGradient: "from-blue-50 to-cyan-50",
  },
  {
    title: "Tư vấn Pháp lý Chuyên sâu",
    desc: "Đội ngũ luật sư dày dặn kinh nghiệm hỗ trợ toàn diện về pháp lý, hợp đồng thuê mua bán, đảm bảo giao dịch an toàn và minh bạch.",
    features: ["Kiểm tra pháp lý tòa nhà", "Soạn thảo hợp đồng", "Giải quyết tranh chấp", "Tư vấn thuế BĐS"],
    emoji: "⚖️",
    gradient: "from-violet-500 to-purple-400",
    bgGradient: "from-violet-50 to-purple-50",
  },
  {
    title: "Đàm phán & Thương lượng",
    desc: "Chuyên gia đàm phán đại diện khách hàng tối ưu hóa điều khoản giá cả, ưu đãi, thời hạn thuê — giúp tiết kiệm từ 15-30% chi phí.",
    features: ["Phân tích giá thị trường", "Đàm phán trực tiếp", "Tối ưu điều khoản hợp đồng", "Bảo vệ quyền lợi tối đa"],
    emoji: "🤝",
    gradient: "from-emerald-500 to-teal-400",
    bgGradient: "from-emerald-50 to-teal-50",
  },
  {
    title: "Phân tích Thị trường",
    desc: "Báo cáo chuyên sâu về xu hướng giá thuê, tỷ lệ lấp đầy, dự báo tăng trưởng khu vực — giúp nhà đầu tư ra quyết định chính xác.",
    features: ["Báo cáo giá thuê real-time", "Phân tích tỷ lệ lấp đầy", "Dự báo xu hướng thị trường", "So sánh khu vực"],
    emoji: "📊",
    gradient: "from-amber-500 to-orange-400",
    bgGradient: "from-amber-50 to-orange-50",
  },
  {
    title: "Quản lý Tài sản Toàn diện",
    desc: "Giải pháp quản lý vận hành tòa nhà, bảo trì, thu phí, báo cáo tài chính — giúp chủ đầu tư tập trung vào chiến lược phát triển.",
    features: ["Dashboard quản lý real-time", "Hệ thống thu phí tự động", "Quản lý bảo trì", "Báo cáo tài chính"],
    emoji: "🏢",
    gradient: "from-pink-500 to-rose-400",
    bgGradient: "from-pink-50 to-rose-50",
  },
  {
    title: "Hỗ trợ Khách hàng 24/7",
    desc: "Đa kênh hỗ trợ: hotline, email, live-chat, video call. Cam kết phản hồi trong 30 phút với đội ngũ chuyên gia tận tâm.",
    features: ["Hotline 24/7", "Live chat & Video call", "Email phản hồi < 30 phút", "Chuyên gia riêng biệt"],
    emoji: "💬",
    gradient: "from-indigo-500 to-blue-400",
    bgGradient: "from-indigo-50 to-blue-50",
  },
];

const steps = [
  { step: "01", title: "Tư vấn nhu cầu", desc: "Lắng nghe và phân tích chi tiết yêu cầu về vị trí, diện tích, ngân sách và mục đích sử dụng.", icon: "💡" },
  { step: "02", title: "Đề xuất giải pháp", desc: "Sàng lọc và giới thiệu danh sách BĐS phù hợp nhất, kèm phân tích ưu nhược điểm.", icon: "📋" },
  { step: "03", title: "Khảo sát thực tế", desc: "Đưa khách hàng tham quan thực tế, đánh giá cơ sở vật chất và tiện ích khu vực.", icon: "🏗️" },
  { step: "04", title: "Đàm phán & Ký kết", desc: "Thương lượng giá tốt nhất, soạn hợp đồng chặt chẽ, hỗ trợ ký kết nhanh chóng.", icon: "✍️" },
];

const packages = [
  {
    name: "Cơ bản",
    price: "Miễn phí",
    desc: "Dành cho cá nhân tìm kiếm BĐS",
    features: ["Tìm kiếm BĐS không giới hạn", "Xem thông tin chi tiết", "Nhận tư vấn qua email", "Báo cáo thị trường hàng tháng"],
    popular: false,
    cta: "Bắt đầu ngay",
  },
  {
    name: "Chuyên nghiệp",
    price: "2.990.000đ",
    period: "/tháng",
    desc: "Dành cho nhà đầu tư & doanh nghiệp",
    features: ["Tất cả tính năng Cơ bản", "Chuyên gia tư vấn riêng", "Phân tích thị trường chuyên sâu", "Đàm phán & hỗ trợ pháp lý", "Dashboard quản lý BĐS", "Ưu tiên hỗ trợ 24/7"],
    popular: true,
    cta: "Dùng thử 14 ngày",
  },
  {
    name: "Doanh nghiệp",
    price: "Liên hệ",
    desc: "Giải pháp tùy chỉnh cho tổ chức lớn",
    features: ["Tất cả tính năng Pro", "API tích hợp hệ thống", "Quản lý đa chi nhánh", "Đào tạo & onboarding", "SLA cam kết uptime 99.9%", "Account Manager riêng"],
    popular: false,
    cta: "Liên hệ tư vấn",
  },
];

function ServiceCard({ service, index }) {
  const revealRef = useReveal(0.1);

  return (
    <div
      ref={revealRef}
      className="reveal group"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`relative h-full rounded-3xl border border-gray-100 bg-white p-8 card-premium overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${service.bgGradient} rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 -translate-y-10 translate-x-10`} />
        <div className="relative">
          <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-500 origin-left">
            {service.emoji}
          </div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            {service.title}
          </h3>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            {service.desc}
          </p>
          <ul className="mt-5 space-y-2.5">
            {service.features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${service.gradient} text-white text-[10px]`}>
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>
          <Link
            to="/contact"
            className={`mt-6 inline-flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent group-hover:gap-3 transition-all duration-300`}
          >
            Tìm hiểu thêm {Icons.arrow}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProcessStep({ step, index }) {
  const revealRef = useReveal(0.15);

  return (
    <div
      ref={revealRef}
      className="reveal relative"
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="flex flex-col items-center text-center group">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-500 to-secondary-500 text-4xl shadow-xl shadow-primary-500/20 group-hover:shadow-primary-500/40 group-hover:scale-110 transition-all duration-500">
            {step.icon}
          </div>
          <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-black text-primary-600 shadow-lg border-2 border-primary-100">
            {step.step}
          </span>
        </div>
        <h3 className="mt-5 text-lg font-bold text-gray-900">{step.title}</h3>
        <p className="mt-2 text-sm text-gray-500 max-w-xs leading-relaxed">{step.desc}</p>
      </div>
    </div>
  );
}

export default function Services() {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const heroRef = useReveal(0.05);
  const processRef = useReveal(0.1);
  const pricingRef = useReveal(0.1);
  const faqRef = useReveal(0.1);

  const [clientCount, clientRef] = useCounter(5000, 2000);
  const [projectCount, projectRef] = useCounter(1200, 2000);
  const [satisfactionCount, satisfactionRef] = useCounter(99, 2000);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setHeaderScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
      <PublicHeader scrolled={headerScrolled} />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div ref={heroRef} className="reveal relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2.5 rounded-full glass px-4 py-2 text-xs font-semibold text-blue-300 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Dịch vụ chuyên nghiệp
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Dịch vụ{" "}
              <span className="bg-gradient-to-r from-blue-400 via-primary-400 to-secondary-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
                bất động sản
              </span>
              <br />toàn diện
            </h1>

            <p className="mt-6 max-w-xl mx-auto text-base sm:text-lg text-gray-300/90 leading-relaxed">
              Từ tìm kiếm, tư vấn pháp lý, đàm phán đến quản lý vận hành — chúng tôi đồng hành cùng bạn trong mọi giai đoạn đầu tư bất động sản.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-primary-700 shadow-xl shadow-white/10 hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300">
                Tư vấn miễn phí {Icons.arrow}
              </Link>
              <Link to="/properties" className="inline-flex items-center gap-2 rounded-2xl glass px-8 py-4 text-sm font-bold text-white hover:bg-white/15 transition-all duration-300">
                Xem bất động sản
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div ref={clientRef} className="text-center">
                <p className="text-3xl font-black text-white">{clientCount.toLocaleString()}+</p>
                <p className="text-xs text-gray-400 mt-1">Khách hàng</p>
              </div>
              <div ref={projectRef} className="text-center">
                <p className="text-3xl font-black text-white">{projectCount.toLocaleString()}+</p>
                <p className="text-xs text-gray-400 mt-1">Dự án</p>
              </div>
              <div ref={satisfactionRef} className="text-center">
                <p className="text-3xl font-black text-white">{satisfactionCount}%</p>
                <p className="text-xs text-gray-400 mt-1">Hài lòng</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-500">Dịch vụ của chúng tôi</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
              Giải pháp <span className="gradient-text">trọn vẹn</span> cho nhà đầu tư
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Chúng tôi cung cấp hệ sinh thái dịch vụ hoàn chỉnh, từ giai đoạn tìm kiếm đến quản lý vận hành, giúp khách hàng tối ưu hóa giá trị đầu tư.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <ServiceCard key={s.title} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-4 sm:px-6 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-100/30 rounded-full blur-3xl" />
        <div ref={processRef} className="reveal relative z-10 mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-500">Quy trình</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
              4 bước <span className="gradient-text">đơn giản</span> để bắt đầu
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Quy trình được tinh gọn tối đa để mang lại trải nghiệm nhanh chóng và hiệu quả cho khách hàng.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <ProcessStep key={s.step} step={s} index={i} />
            ))}
          </div>

          <div className="hidden lg:block absolute top-[55%] left-[18%] right-[18%] h-[2px]">
            <div className="h-full bg-gradient-to-r from-transparent via-primary-200 to-transparent" />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div ref={pricingRef} className="reveal mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-500">Bảng giá</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
              Gói dịch vụ <span className="gradient-text">linh hoạt</span>
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Chọn gói phù hợp với nhu cầu của bạn. Nâng cấp hoặc hạ cấp bất cứ lúc nào.
            </p>
          </div>

          <div className="stagger-children grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-3xl p-8 card-premium ${
                  pkg.popular
                    ? "bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900 text-white border-0 shadow-2xl shadow-primary-500/20 scale-105"
                    : "bg-white border border-gray-100"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-5 py-1.5 text-xs font-bold text-gray-900 shadow-lg">
                    Phổ biến nhất
                  </div>
                )}
                <h3 className={`text-lg font-bold ${pkg.popular ? "text-white" : "text-gray-900"}`}>{pkg.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className={`text-4xl font-black ${pkg.popular ? "text-white" : "text-gray-900"}`}>{pkg.price}</span>
                  {pkg.period && <span className={`text-sm ${pkg.popular ? "text-gray-300" : "text-gray-500"}`}>{pkg.period}</span>}
                </div>
                <p className={`mt-2 text-sm ${pkg.popular ? "text-gray-300" : "text-gray-500"}`}>{pkg.desc}</p>
                <ul className="mt-6 space-y-3">
                  {pkg.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${pkg.popular ? "text-gray-200" : "text-gray-600"}`}>
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] text-white ${pkg.popular ? "bg-white/20" : "bg-gradient-to-br from-primary-500 to-secondary-500"}`}>
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={pkg.popular ? "/login" : "/contact"}
                  className={`mt-8 block rounded-2xl py-3.5 text-center text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                    pkg.popular
                      ? "bg-white text-primary-700 shadow-xl hover:shadow-2xl"
                      : "bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                  }`}
                >
                  {pkg.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 sm:px-6 bg-gray-50">
        <div ref={faqRef} className="reveal mx-auto max-w-3xl">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-500">FAQ</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
              Câu hỏi <span className="gradient-text">thường gặp</span>
            </h2>
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Sẵn sàng trải nghiệm<br />dịch vụ{" "}
            <span className="bg-gradient-to-r from-blue-400 to-secondary-400 bg-clip-text text-transparent">đẳng cấp</span>?
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-gray-300/90 leading-relaxed">
            Liên hệ ngay để được tư vấn miễn phí và trải nghiệm dịch vụ bất động sản chuyên nghiệp nhất.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-primary-700 shadow-xl shadow-white/10 hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300">
              Liên hệ ngay {Icons.arrow}
            </Link>
            <a href="tel:19001234" className="inline-flex items-center gap-2 rounded-2xl glass px-8 py-4 text-sm font-bold text-white hover:bg-white/15 transition-all duration-300">
              {Icons.phone} 1900 1234
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const faqData = [
  { q: "Phí tư vấn dịch vụ là bao nhiêu?", a: "Chúng tôi cung cấp tư vấn ban đầu hoàn toàn miễn phí. Phí dịch vụ sẽ được trao đổi rõ ràng sau khi xác định nhu cầu cụ thể của bạn." },
  { q: "Thời gian tìm kiếm BĐS phù hợp mất bao lâu?", a: "Trung bình từ 1-2 tuần tùy theo yêu cầu. Với hệ thống dữ liệu lớn, chúng tôi có thể đề xuất ngay trong 24h cho các yêu cầu phổ biến." },
  { q: "Tôi có thể hủy dịch vụ bất cứ lúc nào không?", a: "Có, bạn hoàn toàn có thể hủy hoặc thay đổi gói dịch vụ bất cứ lúc nào mà không phát sinh chi phí phạt." },
  { q: "Dữ liệu của tôi có được bảo mật không?", a: "Chúng tôi cam kết bảo mật tuyệt đối thông tin khách hàng với tiêu chuẩn bảo mật quốc tế ISO 27001." },
  { q: "Có hỗ trợ cho nhà đầu tư nước ngoài không?", a: "Có, chúng tôi có đội ngũ chuyên gia song ngữ Anh-Việt, hỗ trợ đầy đủ về pháp lý và quy trình đầu tư cho người nước ngoài tại Việt Nam." },
];

function FAQAccordion() {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-3">
      {faqData.map((item, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-100 bg-white overflow-hidden card-premium"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between px-6 py-5 text-left"
          >
            <span className="text-sm font-bold text-gray-900 pr-4">{item.q}</span>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all duration-300 ${open === i ? "rotate-180 bg-primary-100 text-primary-600" : ""}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          <div
            className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ maxHeight: open === i ? "200px" : "0", opacity: open === i ? 1 : 0 }}
          >
            <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
