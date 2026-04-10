import { Link } from "react-router-dom";
import { Icons } from "../icons";
import useReveal from "../../hooks/useReveal";

export default function CTASection() {
  const revealRef = useReveal();

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 relative overflow-hidden bg-primary-50">
      <div ref={revealRef} className="reveal relative z-10 mx-auto max-w-4xl text-center">
        <p className="estatic-section-label">Sẵn sàng bắt đầu?</p>
        <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-dark-800 leading-tight">
          Giúp bạn tìm kiếm<br />
          bất động sản <span className="gradient-text">tốt nhất</span>
        </h2>
        <div className="estatic-divider mx-auto mt-5" />
        <p className="mt-5 max-w-xl mx-auto text-dark-400 leading-relaxed font-body">
          Đăng nhập để truy cập dashboard, theo dõi tòa nhà, khách hàng và giao dịch theo thời gian thực.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-dark-800 text-white text-sm font-semibold hover:bg-dark-700 transition-all duration-300 font-body"
          >
            Bắt đầu ngay {Icons.arrow}
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 border border-dark-300 text-dark-700 text-sm font-semibold hover:bg-dark-800 hover:text-white hover:border-dark-800 transition-all duration-300 font-body"
          >
            Liên hệ chúng tôi
          </Link>
        </div>
        <p className="mt-6 text-xs text-dark-400 font-body">
          Không mất phí cài đặt · Hỗ trợ 24/7 · Bảo mật dữ liệu tuyệt đối
        </p>
      </div>
    </section>
  );
}
