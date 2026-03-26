import { Link } from "react-router-dom";
import { Icons } from "../icons";
import useReveal from "../../hooks/useReveal";

export default function CTASection() {
  const revealRef = useReveal();

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900">
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }} />

      <div ref={revealRef} className="reveal relative z-10 mx-auto max-w-4xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-300">Sẵn sàng bắt đầu?</p>
        <h2 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          Nâng tầm quản lý<br />bất động sản <span className="bg-gradient-to-r from-blue-400 to-secondary-400 bg-clip-text text-transparent">ngay hôm nay</span>
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-gray-300/90 leading-relaxed">
          Đăng nhập để truy cập dashboard, theo dõi tòa nhà, khách hàng và giao dịch theo thời gian thực.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/login" className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-primary-700 shadow-xl shadow-white/10 hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300">
            Bắt đầu ngay {Icons.arrow}
          </Link>
          <Link to="/properties" className="inline-flex items-center gap-2 rounded-2xl glass px-8 py-4 text-sm font-bold text-white hover:bg-white/15 transition-all duration-300">
            Xem bất động sản
          </Link>
        </div>
        <p className="mt-5 text-xs text-gray-400">Không mất phí cài đặt · Hỗ trợ 24/7 · Bảo mật dữ liệu tuyệt đối</p>
      </div>
    </section>
  );
}
