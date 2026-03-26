import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import consultService from "../services/consultService";
import ConsultModal from "../components/ConsultModal";
import BuildingCard from "../components/BuildingCard";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import { Icons } from "../components/icons";

const PER_PAGE = 9;
const FAVORITES_KEY = "realestate_favorites";

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

export default function Properties() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [consultBuilding, setConsultBuilding] = useState(null);
  const [favorites, setFavorites] = useState(getFavorites);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("any");
  const [areaRange, setAreaRange] = useState("any");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    consultService
      .getPublicBuildings()
      .then((data) => setBuildings(data || []))
      .catch(() => setBuildings([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const types = useMemo(() => ["all", ...new Set(buildings.map((b) => b.type).filter(Boolean))], [buildings]);
  const districts = useMemo(() => ["all", ...new Set(buildings.map((b) => b.district?.name).filter(Boolean))], [buildings]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = buildings.filter((b) => {
      const matchSearch =
        !q ||
        b.name?.toLowerCase().includes(q) ||
        b.street?.toLowerCase().includes(q) ||
        b.ward?.toLowerCase().includes(q) ||
        b.district?.name?.toLowerCase().includes(q);
      const matchType = typeFilter === "all" || b.type === typeFilter;
      const matchDistrict = districtFilter === "all" || b.district?.name === districtFilter;
      const price = Number(b.rentPrice) || 0;
      let matchPrice = true;
      if (priceRange === "low") matchPrice = price > 0 && price <= 10;
      else if (priceRange === "mid") matchPrice = price > 10 && price <= 20;
      else if (priceRange === "high") matchPrice = price > 20;
      const area = Number(b.floorArea) || 0;
      let matchArea = true;
      if (areaRange === "small") matchArea = area > 0 && area <= 200;
      else if (areaRange === "medium") matchArea = area > 200 && area <= 500;
      else if (areaRange === "large") matchArea = area > 500;
      return matchSearch && matchType && matchDistrict && matchPrice && matchArea;
    });

    if (sortBy === "price-asc") result.sort((a, b) => (Number(a.rentPrice) || 0) - (Number(b.rentPrice) || 0));
    else if (sortBy === "price-desc") result.sort((a, b) => (Number(b.rentPrice) || 0) - (Number(a.rentPrice) || 0));
    else if (sortBy === "area-desc") result.sort((a, b) => (Number(b.floorArea) || 0) - (Number(a.floorArea) || 0));
    else if (sortBy === "name-asc") result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    return result;
  }, [buildings, search, typeFilter, districtFilter, priceRange, areaRange, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageStart = (currentPage - 1) * PER_PAGE;
  const pageEnd = Math.min(pageStart + PER_PAGE, filtered.length);
  const pageItems = filtered.slice(pageStart, pageStart + PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, districtFilter, priceRange, areaRange, sortBy]);

  const activeFilterCount = [typeFilter !== "all", districtFilter !== "all", priceRange !== "any", areaRange !== "any"].filter(Boolean).length;

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setDistrictFilter("all");
    setPriceRange("any");
    setAreaRange("any");
    setSortBy("default");
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const paginationPages = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 3) { start = 2; end = maxVisible; }
      if (currentPage >= totalPages - 2) { start = totalPages - maxVisible + 1; end = totalPages - 1; }
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  const selectClass = "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all hover:border-gray-300 appearance-none cursor-pointer";

  const FilterPanel = ({ className = "" }) => (
    <div className={className}>
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Loại hình</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectClass}>
            {types.map((t) => <option key={t} value={t}>{t === "all" ? "Tất cả loại hình" : t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Khu vực</label>
          <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} className={selectClass}>
            {districts.map((d) => <option key={d} value={d}>{d === "all" ? "Tất cả quận" : d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Giá thuê (USD/m²)</label>
          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className={selectClass}>
            <option value="any">Tất cả mức giá</option>
            <option value="low">Dưới 10 USD</option>
            <option value="mid">10 – 20 USD</option>
            <option value="high">Trên 20 USD</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Diện tích sàn</label>
          <select value={areaRange} onChange={(e) => setAreaRange(e.target.value)} className={selectClass}>
            <option value="any">Tất cả diện tích</option>
            <option value="small">Dưới 200 m²</option>
            <option value="medium">200 – 500 m²</option>
            <option value="large">Trên 500 m²</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sắp xếp theo</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
            <option value="default">Mặc định</option>
            <option value="price-asc">Giá: Thấp → Cao</option>
            <option value="price-desc">Giá: Cao → Thấp</option>
            <option value="area-desc">Diện tích: Lớn nhất</option>
            <option value="name-asc">Tên: A → Z</option>
          </select>
        </div>
        {activeFilterCount > 0 && (
          <button onClick={resetFilters} className="w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Xoá bộ lọc ({activeFilterCount})
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
      <PublicHeader scrolled={headerScrolled} />

      {/* Hero Banner */}
      <section className="relative pt-24 pb-16 overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900">
        <div className="absolute top-10 -left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-secondary-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-semibold text-blue-300 mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              {filtered.length} bất động sản
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Khám phá{" "}
              <span className="bg-gradient-to-r from-blue-400 via-primary-400 to-secondary-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
                bất động sản
              </span>
            </h1>
            <p className="mt-3 text-gray-300/80 text-sm sm:text-base max-w-lg mx-auto">
              Tìm kiếm văn phòng, mặt bằng thương mại phù hợp với nhu cầu và ngân sách của bạn.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="rounded-2xl glass p-3">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-gray-400">{Icons.location}</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm theo tên, đường, phường, quận..."
                    className="h-12 w-full rounded-xl border-0 bg-white pl-10 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  />
                </div>
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold flex items-center gap-2 hover:bg-white/20 transition-all relative"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Lọc
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-primary-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Bộ lọc
                  </h3>
                  {activeFilterCount > 0 && (
                    <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-xs font-bold rounded-full">{activeFilterCount}</span>
                  )}
                </div>
                <FilterPanel />
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500">
                  Hiển thị{" "}
                  <span className="font-bold text-gray-900">{filtered.length === 0 ? 0 : pageStart + 1}–{pageEnd}</span>
                  {" "}trong tổng{" "}
                  <span className="font-bold text-gray-900">{filtered.length}</span> kết quả
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 outline-none"
                >
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá thấp nhất</option>
                  <option value="price-desc">Giá cao nhất</option>
                  <option value="area-desc">Diện tích lớn nhất</option>
                  <option value="name-asc">Tên A → Z</option>
                </select>
              </div>
            </div>

            {/* Active Filters Tags */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-xs text-gray-400 font-medium">Đang lọc:</span>
                {typeFilter !== "all" && (
                  <FilterTag label={typeFilter} onRemove={() => setTypeFilter("all")} />
                )}
                {districtFilter !== "all" && (
                  <FilterTag label={districtFilter} onRemove={() => setDistrictFilter("all")} />
                )}
                {priceRange !== "any" && (
                  <FilterTag label={{ low: "< 10 USD", mid: "10–20 USD", high: "> 20 USD" }[priceRange]} onRemove={() => setPriceRange("any")} />
                )}
                {areaRange !== "any" && (
                  <FilterTag label={{ small: "< 200 m²", medium: "200–500 m²", large: "> 500 m²" }[areaRange]} onRemove={() => setAreaRange("any")} />
                )}
                <button onClick={resetFilters} className="text-xs text-red-500 font-semibold hover:text-red-700 transition-colors ml-1">
                  Xoá tất cả
                </button>
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                    <div className="h-52 shimmer" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 w-3/4 rounded-lg shimmer" />
                      <div className="h-4 w-1/2 rounded-lg shimmer" />
                      <div className="h-4 w-1/3 rounded-lg shimmer" />
                      <div className="h-11 rounded-xl shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            ) : pageItems.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gray-100 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-12 h-12 text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy bất động sản</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc để xem thêm kết quả.</p>
                <button onClick={resetFilters} className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold text-sm hover:bg-primary-600 transition-colors">
                  Xoá bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {pageItems.map((b, i) => (
                    <BuildingCard
                      key={b.id}
                      building={b}
                      onConsult={setConsultBuilding}
                      index={i}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-400">
                      Trang <span className="font-bold text-gray-700">{currentPage}</span> / {totalPages}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="h-10 px-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Trước
                      </button>
                      {paginationPages.map((p, i) =>
                        p === "..." ? (
                          <span key={`dots-${i}`} className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm">
                            ...
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                              p === currentPage
                                ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/25"
                                : "border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="h-10 px-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1"
                      >
                        Sau
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto animate-slide-right">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Bộ lọc</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                {Icons.close}
              </button>
            </div>
            <div className="p-5">
              <FilterPanel />
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-6 py-3.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
              >
                Xem {filtered.length} kết quả
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {consultBuilding && (
        <ConsultModal building={consultBuilding} onClose={() => setConsultBuilding(null)} />
      )}
    </div>
  );
}

function FilterTag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
      {label}
      <button onClick={onRemove} className="w-4 h-4 rounded-full bg-primary-200 hover:bg-primary-300 flex items-center justify-center transition-colors">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-2.5 h-2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}
