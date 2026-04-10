import { Link } from "react-router-dom";
import { Icons } from "./icons";

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-dark-400 px-4 sm:px-6 pt-20 pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-primary-400">
                <span className="text-lg font-bold text-white font-heading">R</span>
              </div>
              <span className="text-xl font-bold text-white font-heading">RealEstate</span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-dark-400 font-body">
              Nền tảng quản lý bất động sản chuyên nghiệp cho doanh nghiệp, chủ đầu tư và nhà môi giới.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { label: "F", href: "#" },
                { label: "T", href: "#" },
                { label: "in", href: "#" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="flex h-10 w-10 items-center justify-center border border-dark-700 text-sm text-dark-400 hover:bg-primary-400 hover:border-primary-400 hover:text-white transition-all duration-300 font-body"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-5 font-body">
              Liên kết nhanh
            </h3>
            <ul className="space-y-3 text-sm font-body">
              <li>
                <Link to="/properties" className="hover:text-primary-400 transition-colors">
                  Bất động sản
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-primary-400 transition-colors">
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-400 transition-colors">
                  Đăng nhập
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-5 font-body">
              Loại bất động sản
            </h3>
            <ul className="space-y-3 text-sm font-body">
              <li>Văn phòng cho thuê</li>
              <li>Mặt bằng thương mại</li>
              <li>Shophouse & Retail</li>
              <li>Kho & Xưởng</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-5 font-body">
              Liên hệ
            </h3>
            <div className="space-y-4 text-sm font-body">
              <div>
                <p className="text-dark-500 text-xs uppercase tracking-wider mb-1">Hồ Chí Minh</p>
                <p className="text-dark-300">123 Nguyễn Huệ, Quận 1, TP.HCM</p>
              </div>
              <div>
                <p className="text-dark-500 text-xs uppercase tracking-wider mb-1">Email</p>
                <p className="text-dark-300">contact@realestate.vn</p>
              </div>
              <div>
                <p className="text-dark-500 text-xs uppercase tracking-wider mb-1">Điện thoại</p>
                <p className="text-white font-semibold">+84 90 123 4567</p>
              </div>
            </div>
            <form className="mt-6 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Nhập email"
                className="h-11 flex-1 border border-dark-700 bg-transparent px-4 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-400 transition-colors font-body"
              />
              <button
                type="submit"
                className="h-11 bg-primary-400 px-5 text-sm font-semibold text-white hover:bg-primary-500 transition-all font-body"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 border-t border-dark-800 pt-8 text-center text-xs text-dark-500 font-body">
          &copy; {new Date().getFullYear()} RealEstate. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
