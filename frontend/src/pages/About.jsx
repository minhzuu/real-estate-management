import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import useReveal from "../hooks/useReveal";
import useCounter from "../hooks/useCounter";
import { Icons } from "../components/icons";

const values = [
  {
    title: "Chính trực",
    desc: "Mọi giao dịch đều minh bạch, trung thực. Chúng tôi đặt lợi ích khách hàng lên hàng đầu và cam kết không bao giờ thỏa hiệp về đạo đức.",
    icon: "🛡️",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    title: "Đổi mới",
    desc: "Không ngừng ứng dụng công nghệ AI, Big Data để mang đến giải pháp bất động sản thông minh, vượt trội hơn mỗi ngày.",
    icon: "💡",
    gradient: "from-violet-500 to-purple-400",
  },
  {
    title: "Tận tâm",
    desc: "Đội ngũ chuyên gia đồng hành 24/7, coi thành công của khách hàng là thước đo giá trị và niềm tự hào của chúng tôi.",
    icon: "❤️",
    gradient: "from-rose-500 to-pink-400",
  },
  {
    title: "Chuyên nghiệp",
    desc: "Tiêu chuẩn quốc tế, quy trình bài bản, đội ngũ được đào tạo liên tục để đảm bảo chất lượng dịch vụ cao nhất.",
    icon: "🏆",
    gradient: "from-amber-500 to-orange-400",
  },
];

const milestones = [
  { year: "2015", title: "Khởi đầu", desc: "Thành lập với đội ngũ 5 thành viên tại TP.HCM, tập trung vào tư vấn văn phòng cho thuê." },
  { year: "2017", title: "Mở rộng", desc: "Mở chi nhánh Hà Nội & Đà Nẵng, phục vụ hơn 500 khách hàng doanh nghiệp." },
  { year: "2019", title: "Chuyển đổi số", desc: "Ra mắt nền tảng trực tuyến, ứng dụng AI trong phân tích và tìm kiếm BĐS." },
  { year: "2021", title: "Đột phá", desc: "Đạt mốc 3,000+ khách hàng, hợp tác với 100+ đối tác chiến lược trong và ngoài nước." },
  { year: "2023", title: "Dẫn đầu", desc: "Trở thành nền tảng #1 về quản lý BĐS thương mại tại Việt Nam với 5,000+ khách hàng." },
  { year: "2025", title: "Tầm nhìn mới", desc: "Mở rộng sang thị trường Đông Nam Á, phát triển hệ sinh thái PropTech toàn diện." },
];

const team = [
  { name: "Nguyễn Minh Đức", role: "CEO & Founder", bio: "15 năm kinh nghiệm BĐS thương mại, cựu Giám đốc CBRE Việt Nam.", avatar: "NMĐ", gradient: "from-blue-500 to-primary-500" },
  { name: "Trần Thu Hà", role: "COO", bio: "MBA Harvard, 12 năm quản lý vận hành tại các tập đoàn BĐS hàng đầu.", avatar: "TTH", gradient: "from-violet-500 to-secondary-500" },
  { name: "Lê Quang Huy", role: "CTO", bio: "Ex-Google, chuyên gia AI/ML ứng dụng trong PropTech và FinTech.", avatar: "LQH", gradient: "from-emerald-500 to-teal-500" },
  { name: "Phạm Thanh Lan", role: "Giám đốc Kinh doanh", bio: "10 năm kinh nghiệm phát triển thị trường BĐS, mạng lưới 500+ đối tác.", avatar: "PTL", gradient: "from-amber-500 to-orange-500" },
];

const partners = ["CBRE", "JLL", "Savills", "Cushman", "Knight Frank", "Colliers"];

export default function About() {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const heroRef = useReveal(0.05);
  const storyRef = useReveal(0.1);
  const valuesRef = useReveal(0.1);
  const timelineRef = useReveal(0.1);
  const teamRef = useReveal(0.1);
  const partnersRef = useReveal(0.1);

  const [clientCount, clientRef] = useCounter(5000, 2000);
  const [yearCount, yearRef] = useCounter(10, 1500);
  const [partnerCount, partnerRef] = useCounter(120, 2000);
  const [cityCount, cityRef] = useCounter(8, 1500);

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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div ref={heroRef} className="reveal relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2.5 rounded-full glass px-4 py-2 text-xs font-semibold text-blue-300 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Về RealEstate Pro
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Kiến tạo{" "}
              <span className="bg-gradient-to-r from-blue-400 via-primary-400 to-secondary-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
                giá trị bền vững
              </span>
              <br />cho bất động sản
            </h1>

            <p className="mt-6 max-w-xl mx-auto text-base sm:text-lg text-gray-300/90 leading-relaxed">
              Với hơn 10 năm kinh nghiệm, chúng tôi tự hào là nền tảng quản lý bất động sản thương mại hàng đầu Việt Nam — nơi công nghệ gặp gỡ sự chuyên nghiệp.
            </p>

            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div ref={yearRef} className="text-center">
                <p className="text-4xl font-black text-white">{yearCount}+</p>
                <p className="text-xs text-gray-400 mt-1">Năm kinh nghiệm</p>
              </div>
              <div ref={clientRef} className="text-center">
                <p className="text-4xl font-black text-white">{clientCount.toLocaleString()}+</p>
                <p className="text-xs text-gray-400 mt-1">Khách hàng</p>
              </div>
              <div ref={partnerRef} className="text-center">
                <p className="text-4xl font-black text-white">{partnerCount}+</p>
                <p className="text-xs text-gray-400 mt-1">Đối tác</p>
              </div>
              <div ref={cityRef} className="text-center">
                <p className="text-4xl font-black text-white">{cityCount}</p>
                <p className="text-xs text-gray-400 mt-1">Thành phố</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div ref={storyRef} className="reveal mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-500">Câu chuyện của chúng tôi</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-gray-900 leading-tight">
                Từ đam mê đến{" "}
                <span className="gradient-text">nền tảng #1</span>
                <br />bất động sản Việt Nam
              </h2>
              <p className="mt-6 text-gray-500 leading-relaxed">
                Khởi đầu vào năm 2015 với 5 thành viên và niềm đam mê bất động sản, chúng tôi đã phát triển thành nền tảng công nghệ hàng đầu, phục vụ hơn 5,000 khách hàng doanh nghiệp trên toàn quốc.
              </p>
              <p className="mt-4 text-gray-500 leading-relaxed">
                Sứ mệnh của chúng tôi là ứng dụng công nghệ để dân chủ hóa thị trường bất động sản thương mại — giúp mọi doanh nghiệp, từ startup đến tập đoàn, đều tiếp cận được thông tin minh bạch và dịch vụ chuyên nghiệp.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/services" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300">
                  Khám phá dịch vụ {Icons.arrow}
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 px-7 py-3.5 text-sm font-bold text-gray-700 hover:border-primary-300 hover:text-primary-700 transition-all duration-300">
                  Liên hệ chúng tôi
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-[2rem] opacity-50 blur-xl" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 p-8 text-white shadow-2xl">
                    <p className="text-5xl font-black">10+</p>
                    <p className="text-sm text-white/80 mt-1">Năm kinh nghiệm</p>
                  </div>
                  <div className="rounded-2xl bg-white border border-gray-100 p-8 shadow-xl">
                    <p className="text-5xl font-black gradient-text">99%</p>
                    <p className="text-sm text-gray-500 mt-1">Khách hàng hài lòng</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl bg-white border border-gray-100 p-8 shadow-xl">
                    <p className="text-5xl font-black text-gray-900">5K+</p>
                    <p className="text-sm text-gray-500 mt-1">Doanh nghiệp tin dùng</p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white shadow-2xl">
                    <p className="text-5xl font-black">24/7</p>
                    <p className="text-sm text-gray-400 mt-1">Hỗ trợ không ngừng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 sm:px-6 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div ref={valuesRef} className="reveal relative z-10 mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-500">Giá trị cốt lõi</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
              Nền tảng <span className="gradient-text">vững chắc</span> cho sự phát triển
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              4 giá trị cốt lõi định hình văn hóa và chiến lược phát triển của RealEstate Pro.
            </p>
          </div>

          <div className="stagger-children grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="group card-premium rounded-3xl border border-gray-100 bg-white p-7 text-center relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${v.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{v.title}</h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div ref={timelineRef} className="reveal mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-500">Hành trình</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
              Cột mốc <span className="gradient-text">đáng nhớ</span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary-200 via-secondary-200 to-primary-200 hidden md:block" />

            <div className="space-y-10 md:space-y-0">
              {milestones.map((m, i) => (
                <TimelineItem key={m.year} milestone={m} index={i} isLeft={i % 2 === 0} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4 sm:px-6 bg-gray-50">
        <div ref={teamRef} className="reveal mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-500">Đội ngũ</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
              Những con người <span className="gradient-text">tài năng</span>
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Đội ngũ lãnh đạo giàu kinh nghiệm, đam mê và cam kết mang lại giá trị vượt trội cho khách hàng.
            </p>
          </div>

          <div className="stagger-children grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((t) => (
              <div key={t.name} className="group card-premium rounded-3xl border border-gray-100 bg-white p-7 text-center">
                <div className={`mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-xl font-black text-white shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500`}>
                  {t.avatar}
                </div>
                <h3 className="mt-5 text-base font-bold text-gray-900">{t.name}</h3>
                <p className="text-sm font-medium text-primary-500">{t.role}</p>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 px-4 sm:px-6 bg-white border-t border-gray-100">
        <div ref={partnersRef} className="reveal mx-auto max-w-7xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-10">Đối tác chiến lược</p>
          <div className="stagger-children flex flex-wrap items-center justify-center gap-8 sm:gap-14">
            {partners.map((p) => (
              <div key={p} className="group cursor-default">
                <div className="px-6 py-3 rounded-2xl bg-gray-50 border border-gray-100 group-hover:border-primary-200 group-hover:bg-primary-50 transition-all duration-300">
                  <span className="text-xl font-black text-gray-300 group-hover:text-primary-500 transition-colors duration-300">{p}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Hãy cùng chúng tôi{" "}
            <span className="bg-gradient-to-r from-blue-400 to-secondary-400 bg-clip-text text-transparent">kiến tạo tương lai</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-gray-300/90 leading-relaxed">
            Dù bạn là nhà đầu tư, doanh nghiệp hay nhà môi giới — chúng tôi có giải pháp phù hợp cho bạn.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-primary-700 shadow-xl shadow-white/10 hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300">
              Liên hệ ngay {Icons.arrow}
            </Link>
            <Link to="/services" className="inline-flex items-center gap-2 rounded-2xl glass px-8 py-4 text-sm font-bold text-white hover:bg-white/15 transition-all duration-300">
              Xem dịch vụ
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function TimelineItem({ milestone, index, isLeft }) {
  const revealRef = useReveal(0.15);

  return (
    <div
      ref={revealRef}
      className={`reveal md:flex md:items-center md:py-6 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className={`md:w-1/2 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
        <div className={`group card-premium rounded-2xl border border-gray-100 bg-white p-6 inline-block ${isLeft ? "md:ml-auto" : ""}`}>
          <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold mb-3">
            {milestone.year}
          </span>
          <h3 className="text-lg font-bold text-gray-900">{milestone.title}</h3>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-sm">{milestone.desc}</p>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center w-0">
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/30 ring-4 ring-white" />
      </div>

      <div className="md:w-1/2" />
    </div>
  );
}
