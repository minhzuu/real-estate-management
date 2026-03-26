import { Link } from "react-router-dom";
import { Icons } from "./icons";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 px-4 sm:px-6 pt-16 pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg">
                <span className="text-base font-black text-white">R</span>
              </div>
              <span className="text-lg font-bold text-white">RealEstate Pro</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Nền tảng quản lý bất động sản chuyên nghiệp cho doanh nghiệp, chủ đầu tư và nhà môi giới.
            </p>
            <div className="mt-5 flex gap-2">
              {["F", "T", "in"].map((s) => (
                <button key={s} className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-800 text-sm text-gray-400 hover:bg-primary-500 hover:text-white transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/properties" className="hover:text-white transition-colors">Bất động sản</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Dịch vụ</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Liên hệ</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Đăng nhập</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4">Loại bất động sản</h3>
            <ul className="space-y-2.5 text-sm">
              <li>Văn phòng cho thuê</li>
              <li>Mặt bằng thương mại</li>
              <li>Shophouse & Retail</li>
              <li>Kho & Xưởng</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4">Liên hệ</h3>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2">{Icons.phone} <span className="font-bold text-white">1900 1234</span></p>
              <p className="flex items-center gap-2">{Icons.mail} contact@realestatepro.vn</p>
            </div>
            <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Nhập email" className="h-10 flex-1 rounded-xl border-0 bg-gray-800 px-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
              <button type="submit" className="h-10 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-5 text-sm font-bold text-white hover:shadow-lg transition-all">
                Đăng ký
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} RealEstate Pro. All rights reserved. Made with ❤️ in Vietnam.
        </div>
      </div>
    </footer>
  );
}
