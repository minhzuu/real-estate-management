import useReveal from "../../hooks/useReveal";

const steps = [
  { step: "01", title: "Tìm kiếm", desc: "Nhập tiêu chí tìm kiếm và khám phá hàng nghìn bất động sản chất lượng.", emoji: "🔎" },
  { step: "02", title: "Liên hệ tư vấn", desc: "Gửi yêu cầu tư vấn miễn phí, đội ngũ chuyên gia sẽ liên hệ ngay.", emoji: "📞" },
  { step: "03", title: "Giao dịch thành công", desc: "Hoàn tất thủ tục pháp lý và bắt đầu sử dụng không gian mới.", emoji: "🎉" },
];

export default function HowItWorks() {
  const revealRef = useReveal();

  return (
    <section className="relative py-20 px-4 sm:px-6 bg-white border-b border-gray-100">
      <div ref={revealRef} className="reveal mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-500">Quy trình</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
            Bắt đầu chỉ với <span className="gradient-text">3 bước đơn giản</span>
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3 relative">
          <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-secondary-200" />
          {steps.map((s) => (
            <div key={s.step} className="relative text-center group">
              <div className="relative z-10 mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-3xl shadow-xl shadow-primary-200 group-hover:scale-110 group-hover:shadow-primary-300 transition-all duration-500">
                {s.emoji}
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary-100 text-primary-700 text-xs font-black flex items-center justify-center -translate-y-2 z-20 ring-4 ring-white">
                {s.step}
              </div>
              <h3 className="mt-6 text-lg font-bold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
