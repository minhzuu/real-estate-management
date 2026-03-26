import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import useReveal from "../hooks/useReveal";
import { Icons } from "../components/icons";

const contactInfo = [
  {
    title: "Hotline",
    value: "1900 1234",
    subtitle: "Miễn phí, 24/7",
    icon: Icons.phone,
    gradient: "from-blue-500 to-cyan-400",
    bgGradient: "from-blue-50 to-cyan-50",
    action: "tel:19001234",
  },
  {
    title: "Email",
    value: "contact@realestatepro.vn",
    subtitle: "Phản hồi trong 30 phút",
    icon: Icons.mail,
    gradient: "from-violet-500 to-purple-400",
    bgGradient: "from-violet-50 to-purple-50",
    action: "mailto:contact@realestatepro.vn",
  },
  {
    title: "Trụ sở chính",
    value: "Tầng 15, Landmark 81",
    subtitle: "Vinhomes Central Park, Q. Bình Thạnh, TP.HCM",
    icon: Icons.location,
    gradient: "from-emerald-500 to-teal-400",
    bgGradient: "from-emerald-50 to-teal-50",
    action: null,
  },
];

const offices = [
  { city: "TP. Hồ Chí Minh", address: "Tầng 15, Landmark 81, Vinhomes Central Park, Bình Thạnh", phone: "028 3456 7890", type: "Trụ sở chính" },
  { city: "Hà Nội", address: "Tầng 20, Keangnam Tower, Phạm Hùng, Nam Từ Liêm", phone: "024 3456 7890", type: "Chi nhánh" },
  { city: "Đà Nẵng", address: "Tầng 12, Indochina Riverside, Bạch Đằng, Hải Châu", phone: "0236 345 6789", type: "Chi nhánh" },
];

const faqData = [
  { q: "Thời gian làm việc của văn phòng là gì?", a: "Văn phòng mở cửa từ 8:00 - 18:00 (Thứ 2 - Thứ 6) và 8:00 - 12:00 (Thứ 7). Hotline hỗ trợ hoạt động 24/7." },
  { q: "Tôi có cần đặt lịch hẹn trước khi đến?", a: "Không bắt buộc, nhưng để được phục vụ tốt nhất, chúng tôi khuyến khích bạn đặt lịch hẹn trước qua hotline hoặc form liên hệ." },
  { q: "Sau khi gửi form, bao lâu sẽ được phản hồi?", a: "Đội ngũ chúng tôi cam kết phản hồi trong vòng 30 phút trong giờ hành chính, và tối đa 2 giờ ngoài giờ hành chính." },
  { q: "Tôi có thể tư vấn online không?", a: "Hoàn toàn có thể! Chúng tôi hỗ trợ tư vấn qua video call (Zoom/Google Meet), điện thoại hoặc chat trực tuyến." },
];

export default function Contact() {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "general", message: "" });
  const [formStatus, setFormStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const heroRef = useReveal(0.05);
  const formRef = useReveal(0.1);
  const officeRef = useReveal(0.1);
  const faqRef = useReveal(0.1);
  const mapRef = useReveal(0.1);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setHeaderScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setFormStatus("success");
    setFormData({ name: "", email: "", phone: "", subject: "general", message: "" });
    setTimeout(() => setFormStatus(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
      <PublicHeader scrolled={headerScrolled} />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900">
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
              Liên hệ với chúng tôi
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Chúng tôi luôn{" "}
              <span className="bg-gradient-to-r from-blue-400 via-primary-400 to-secondary-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
                sẵn sàng
              </span>
              <br />lắng nghe bạn
            </h1>

            <p className="mt-6 max-w-xl mx-auto text-base sm:text-lg text-gray-300/90 leading-relaxed">
              Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ ngay để được tư vấn miễn phí về mọi nhu cầu bất động sản.
            </p>

            <div className="mt-12 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {contactInfo.map((c) => (
                <ContactInfoCard key={c.title} info={c} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div ref={formRef} className="reveal mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-500">Gửi tin nhắn</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
                Hãy cho chúng tôi biết{" "}
                <span className="gradient-text">nhu cầu</span> của bạn
              </h2>
              <p className="mt-4 text-gray-500 leading-relaxed">
                Điền thông tin bên dưới, đội ngũ chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất.
              </p>

              {formStatus === "success" && (
                <div className="mt-6 flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 px-6 py-4 animate-slide-up">
                  {Icons.check}
                  <div>
                    <p className="text-sm font-bold text-emerald-800">Gửi thành công!</p>
                    <p className="text-xs text-emerald-600">Chúng tôi sẽ liên hệ bạn trong vòng 30 phút.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Họ và tên *</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email *</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@company.com"
                      className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-300 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Số điện thoại</label>
                    <input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0901 234 567"
                      className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Chủ đề</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-300 transition-all"
                    >
                      <option value="general">Tư vấn chung</option>
                      <option value="rent">Thuê văn phòng</option>
                      <option value="buy">Mua bất động sản</option>
                      <option value="sell">Bán / Cho thuê BĐS</option>
                      <option value="partner">Hợp tác đối tác</option>
                      <option value="support">Hỗ trợ kỹ thuật</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nội dung *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Mô tả nhu cầu của bạn..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-300 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      Gửi tin nhắn {Icons.arrow}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl" />
                <div className="relative">
                  <h3 className="text-lg font-bold">Tư vấn nhanh</h3>
                  <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                    Gọi hotline để được tư vấn trực tiếp bởi chuyên gia bất động sản hàng đầu.
                  </p>
                  <a href="tel:19001234" className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur px-6 py-4 hover:bg-white/20 transition-all duration-300">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 shadow-lg">
                      {Icons.phone}
                    </div>
                    <div>
                      <p className="text-lg font-black">1900 1234</p>
                      <p className="text-xs text-gray-400">Miễn phí · 24/7</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-white p-8 card-premium">
                <h3 className="text-lg font-bold text-gray-900">Giờ làm việc</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Thứ 2 - Thứ 6</span>
                    <span className="font-bold text-gray-900">8:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Thứ 7</span>
                    <span className="font-bold text-gray-900">8:00 - 12:00</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Chủ nhật</span>
                    <span className="font-bold text-gray-400">Nghỉ</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                      </span>
                      <span className="text-sm font-bold text-emerald-600">Hotline hoạt động 24/7</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-white p-8 card-premium">
                <h3 className="text-lg font-bold text-gray-900">Kết nối</h3>
                <p className="mt-2 text-sm text-gray-500">Theo dõi chúng tôi trên mạng xã hội</p>
                <div className="mt-4 flex gap-2">
                  {[
                    { label: "Facebook", abbr: "F" },
                    { label: "LinkedIn", abbr: "in" },
                    { label: "Twitter", abbr: "X" },
                    { label: "YouTube", abbr: "YT" },
                  ].map((s) => (
                    <button key={s.abbr} className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-500 hover:bg-gradient-to-br hover:from-primary-500 hover:to-secondary-500 hover:text-white transition-all duration-300">
                      {s.abbr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-24 px-4 sm:px-6 bg-gray-50">
        <div ref={officeRef} className="reveal mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-500">Văn phòng</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
              Hệ thống <span className="gradient-text">văn phòng</span> toàn quốc
            </h2>
          </div>

          <div className="stagger-children grid gap-6 md:grid-cols-3">
            {offices.map((o) => (
              <div key={o.city} className="group card-premium rounded-3xl border border-gray-100 bg-white p-7 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg">
                    {Icons.location}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{o.city}</h3>
                    <span className="text-xs font-medium text-primary-500">{o.type}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{o.address}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm">
                  {Icons.phone}
                  <span className="font-bold text-gray-900">{o.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div ref={mapRef} className="reveal mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-500">Bản đồ</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
              Tìm chúng tôi <span className="gradient-text">trên bản đồ</span>
            </h2>
          </div>
          <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-xl">
            <iframe
              title="RealEstate Pro Office"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6696584237655!2d106.72187577583908!3d10.762622059450822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f9023a3e34d%3A0x9e4e25b26e71c0f9!2sLandmark%2081!5e0!3m2!1svi!2svn!4v1710000000000!5m2!1svi!2svn"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
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
          <ContactFAQ />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Bắt đầu hành trình{" "}
            <span className="bg-gradient-to-r from-blue-400 to-secondary-400 bg-clip-text text-transparent">bất động sản</span>
            <br />cùng chúng tôi
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-gray-300/90 leading-relaxed">
            Đăng nhập để truy cập hệ thống quản lý, theo dõi tòa nhà và giao dịch theo thời gian thực.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/login" className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-primary-700 shadow-xl shadow-white/10 hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300">
              Bắt đầu ngay {Icons.arrow}
            </Link>
            <Link to="/properties" className="inline-flex items-center gap-2 rounded-2xl glass px-8 py-4 text-sm font-bold text-white hover:bg-white/15 transition-all duration-300">
              Xem bất động sản
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ContactInfoCard({ info }) {
  const Wrapper = info.action ? "a" : "div";
  const wrapperProps = info.action ? { href: info.action } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group glass rounded-2xl p-5 text-left hover:bg-white/15 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${info.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {info.icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-400">{info.title}</p>
          <p className="text-sm font-bold text-white truncate">{info.value}</p>
          <p className="text-xs text-gray-400 truncate">{info.subtitle}</p>
        </div>
      </div>
    </Wrapper>
  );
}

function ContactFAQ() {
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
