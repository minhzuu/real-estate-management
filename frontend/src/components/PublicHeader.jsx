import { useState } from "react";
import { Link } from "react-router-dom";
import { Icons } from "./icons";

export default function PublicHeader({ scrolled }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Trang chủ", to: "/" },
    { label: "Bất động sản", to: "/properties" },
    { label: "Dịch vụ", to: "/services" },
    { label: "Về chúng tôi", to: "/about" },
    { label: "Liên hệ", to: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
              scrolled
                ? "bg-dark-800"
                : "bg-white/10 backdrop-blur-sm border border-white/20"
            }`}
          >
            <span className="text-lg font-bold text-white font-heading">R</span>
          </div>
          <div>
            <p
              className={`text-lg font-bold tracking-tight transition-colors font-heading ${
                scrolled ? "text-dark-800" : "text-white"
              }`}
            >
              RealEstate
            </p>
          </div>
        </Link>

        <nav
          className={`hidden items-center gap-1 text-sm font-medium lg:flex ${
            scrolled ? "text-dark-600" : "text-white/90"
          }`}
        >
          {navLinks.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                scrolled
                  ? "hover:text-primary-500 hover:bg-primary-50"
                  : "hover:text-white hover:bg-white/10"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="tel:+84901234567"
            className={`hidden sm:flex items-center gap-2 text-sm font-medium transition-colors ${
              scrolled ? "text-dark-700" : "text-white/90"
            }`}
          >
            {Icons.phone}
            <span>+84 90 123 4567</span>
          </a>
          <Link
            to="/contact"
            className={`hidden sm:inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
              scrolled
                ? "bg-dark-800 text-white hover:bg-dark-700"
                : "bg-white text-dark-800 hover:bg-white/90"
            }`}
          >
            Yêu cầu tư vấn
          </Link>
          <Link
            to="/login"
            className={`hidden lg:inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
              scrolled
                ? "border-dark-200 text-dark-700 hover:bg-dark-50"
                : "border-white/30 text-white hover:bg-white/10"
            }`}
          >
            {Icons.login} Đăng nhập
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-dark-800" : "text-white"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-dark-700 font-medium hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                {n.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg bg-dark-800 text-white text-center font-semibold"
              >
                Yêu cầu tư vấn
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg border border-dark-200 text-dark-700 text-center font-semibold"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
