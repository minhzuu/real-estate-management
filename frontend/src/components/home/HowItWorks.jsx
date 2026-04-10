import useReveal from "../../hooks/useReveal";

const steps = [
  {
    step: "01",
    title: "Xem bất động sản",
    desc: "Duyệt qua bộ sưu tập bất động sản đa dạng, phù hợp mọi nhu cầu và ngân sách.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Yêu cầu tham quan",
    desc: "Đặt lịch tham quan miễn phí, đội ngũ chuyên gia sẽ đồng hành cùng bạn.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Nhận chìa khóa",
    desc: "Hoàn tất thủ tục pháp lý nhanh chóng và bắt đầu sở hữu không gian mới.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const revealRef = useReveal();

  return (
    <section className="relative py-24 px-4 sm:px-6 bg-white">
      <div ref={revealRef} className="reveal mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="estatic-section-label">Quy trình</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-dark-800">
            Các bước đơn giản
          </h2>
          <div className="estatic-divider mx-auto mt-4" />
          <p className="mt-4 text-dark-400 max-w-xl mx-auto font-body leading-relaxed">
            Quy trình tìm kiếm và sở hữu bất động sản chưa bao giờ dễ dàng đến thế.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 relative">
          <div className="hidden md:block absolute top-20 left-[20%] right-[20%] h-px bg-dark-200" />

          {steps.map((s) => (
            <div key={s.step} className="relative text-center group">
              <div className="relative z-10 mx-auto w-24 h-24 rounded-full border-2 border-dark-200 bg-white flex items-center justify-center text-dark-700 group-hover:border-primary-400 group-hover:text-primary-500 transition-all duration-500 shadow-sm">
                {s.icon}
              </div>
              <div className="absolute top-0 right-1/2 translate-x-[calc(50%+40px)] -translate-y-1 z-20">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-400 text-white text-xs font-bold font-body shadow-md">
                  {s.step}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-dark-800">
                {s.title}
              </h3>
              <p className="mt-3 text-sm text-dark-400 max-w-xs mx-auto leading-relaxed font-body">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
