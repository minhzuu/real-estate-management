import { Icons } from "../icons";
import StatCard from "../StatCard";

export default function HeroSection({ searchLocation, onSearchLocationChange, priceRange, onPriceRangeChange, typeFilter, onTypeFilterChange, types }) {
  return (
    <section id="home" className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900">
      <div className="absolute top-20 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-blob delay-1000" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-400/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2.5 rounded-full glass px-4 py-2 text-xs font-semibold text-blue-300 mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Nền tảng bất động sản #1 Việt Nam
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] animate-slide-up">
            Khai thác tối đa
            <span className="block mt-2 bg-gradient-to-r from-blue-400 via-primary-400 to-secondary-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
              giá trị bất động sản
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base sm:text-lg text-gray-300/90 leading-relaxed animate-slide-up" style={{ animationDelay: "0.15s" }}>
            Tìm kiếm, quản lý và tối ưu hóa danh mục bất động sản trên một nền tảng duy nhất — hỗ trợ pháp lý, đàm phán và phân tích thị trường chuyên sâu.
          </p>

          {/* Search Form */}
          <div className="mt-10 rounded-3xl glass p-5 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="grid gap-3 sm:grid-cols-[1.2fr,1fr,1fr,auto]">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Địa điểm</label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-gray-400">{Icons.location}</span>
                  <input
                    value={searchLocation}
                    onChange={(e) => onSearchLocationChange(e.target.value)}
                    placeholder="Quận 1, Quận 7, Thủ Đức..."
                    className="h-12 w-full rounded-xl border-0 bg-white pl-10 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Giá thuê</label>
                <select
                  value={priceRange}
                  onChange={(e) => onPriceRangeChange(e.target.value)}
                  className="h-12 w-full rounded-xl border-0 bg-white px-4 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                >
                  <option value="any">Tất cả mức giá</option>
                  <option value="low">Dưới 10 USD/m²</option>
                  <option value="mid">10 - 20 USD/m²</option>
                  <option value="high">Trên 20 USD/m²</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Loại hình</label>
                <select
                  value={typeFilter}
                  onChange={(e) => onTypeFilterChange(e.target.value)}
                  className="h-12 w-full rounded-xl border-0 bg-white px-4 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                >
                  {types.map((t) => (
                    <option key={t} value={t}>{t === "all" ? "Tất cả loại hình" : t}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button className="h-12 w-full sm:w-auto px-8 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-sm shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
                  {Icons.searchBold}
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "0.45s" }}>
            <StatCard end={5000} suffix="+" label="Bất động sản" icon={Icons.building} />
            <StatCard end={10000} suffix="+" label="Khách hàng" icon={Icons.users} />
            <StatCard end={120} suffix="+" label="Đối tác" icon={Icons.briefcase} />
            <StatCard end={24} suffix="/7" label="Hỗ trợ khách hàng" icon={Icons.clock} />
          </div>
        </div>
      </div>
    </section>
  );
}
