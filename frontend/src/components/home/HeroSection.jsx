import { Icons } from "../icons";
import StatCard from "../StatCard";

export default function HeroSection({
  searchLocation,
  onSearchLocationChange,
  priceRange,
  onPriceRangeChange,
  typeFilter,
  onTypeFilterChange,
  types,
}) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center animate-ken-burns"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900/85 via-dark-900/70 to-dark-900/50" />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-2xl">
          <div className="estatic-divider mb-8 animate-slide-right" />

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.15] animate-slide-up">
            Tìm kiếm
            <span className="block mt-2 text-primary-400">
              ngôi nhà mơ ước
            </span>
          </h1>

          <p
            className="mt-6 max-w-lg text-base sm:text-lg text-white/70 leading-relaxed font-body animate-slide-up"
            style={{ animationDelay: "0.15s" }}
          >
            Khám phá hàng nghìn bất động sản chất lượng cao trên nền tảng bất
            động sản chuyên nghiệp hàng đầu Việt Nam.
          </p>

          <div
            className="mt-10 rounded-2xl bg-white p-5 shadow-2xl shadow-black/10 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="grid gap-3 sm:grid-cols-[1.2fr,1fr,1fr,auto]">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider font-body">
                  Địa điểm
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-dark-300">
                    {Icons.location}
                  </span>
                  <input
                    value={searchLocation}
                    onChange={(e) => onSearchLocationChange(e.target.value)}
                    placeholder="Quận 1, Quận 7, Thủ Đức..."
                    className="h-12 w-full rounded-lg border border-dark-200 bg-dark-50 pl-10 pr-4 text-sm text-dark-800 placeholder:text-dark-300 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/30 transition-colors font-body"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider font-body">
                  Giá thuê
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => onPriceRangeChange(e.target.value)}
                  className="h-12 w-full rounded-lg border border-dark-200 bg-dark-50 px-4 text-sm text-dark-800 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/30 transition-colors font-body"
                >
                  <option value="any">Tất cả mức giá</option>
                  <option value="low">Dưới 10 USD/m²</option>
                  <option value="mid">10 - 20 USD/m²</option>
                  <option value="high">Trên 20 USD/m²</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider font-body">
                  Loại hình
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => onTypeFilterChange(e.target.value)}
                  className="h-12 w-full rounded-lg border border-dark-200 bg-dark-50 px-4 text-sm text-dark-800 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/30 transition-colors font-body"
                >
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t === "all" ? "Tất cả loại hình" : t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button className="h-12 w-full sm:w-auto px-8 rounded-lg bg-dark-800 text-white font-semibold text-sm hover:bg-dark-700 transition-all duration-300 flex items-center justify-center gap-2 font-body">
                  {Icons.searchBold}
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>

          <div
            className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 animate-slide-up"
            style={{ animationDelay: "0.45s" }}
          >
            <StatCard
              end={5000}
              suffix="+"
              label="Bất động sản"
              icon={Icons.building}
            />
            <StatCard
              end={10000}
              suffix="+"
              label="Khách hàng"
              icon={Icons.users}
            />
            <StatCard
              end={120}
              suffix="+"
              label="Đối tác"
              icon={Icons.briefcase}
            />
            <StatCard
              end={24}
              suffix="/7"
              label="Hỗ trợ"
              icon={Icons.clock}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
