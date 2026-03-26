import { Link } from "react-router-dom";
import { Icons } from "./icons";

export default function PublicHeader({ scrolled }) {
  const navLinks = [
    { label: "Trang chủ", to: "/" },
    { label: "Bất động sản", to: "/properties" },
    { label: "Dịch vụ", to: "/services" },
    { label: "Về chúng tôi", to: "/about" },
    { label: "Liên hệ", to: "/contact" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-black/[0.03] border-b border-gray-100" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
            {Icons.home}
          </div>
          <div>
            <p className={`text-base font-bold tracking-tight transition-colors ${scrolled ? "text-gray-900" : "text-white"}`}>RealEstate Pro</p>
            <p className={`text-[11px] font-medium transition-colors ${scrolled ? "text-gray-500" : "text-white/70"}`}>Bất động sản chuyên nghiệp</p>
          </div>
        </Link>
        <nav className={`hidden items-center gap-1 text-sm font-medium sm:flex ${scrolled ? "text-gray-600" : "text-white/90"}`}>
          {navLinks.map((n) => (
            <Link key={n.label} to={n.to} className="px-4 py-2 rounded-xl hover:bg-white/10 transition-all">
              {n.label}
            </Link>
          ))}
          <Link to="/login" className="ml-2 inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2.5 text-sm font-bold hover:bg-white/20 transition-all">
            {Icons.login} Đăng nhập
          </Link>
        </nav>
      </div>
    </header>
  );
}
