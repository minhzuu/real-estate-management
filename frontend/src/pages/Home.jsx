import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import consultService from "../services/consultService";

// Icon map
const icons = {
  building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  area: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  ),
  price: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  location: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

function ConsultModal({ building, onClose }) {
  const [form, setForm] = useState({ customerName: "", customerPhone: "", customerEmail: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await consultService.submitConsultRequest(building.id, form);
      setSuccess(true);
    } catch {
      setError("Gửi yêu cầu thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              {icons.building}
            </div>
            <div>
              <p className="text-blue-100 text-xs">Yêu cầu tư vấn tại</p>
              <h3 className="font-bold text-lg leading-tight">{building.name}</h3>
            </div>
          </div>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2} className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Gửi thành công! 🎉</h4>
              <p className="text-gray-500 text-sm mb-6">Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.</p>
              <button onClick={onClose} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
                Đóng
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                <input
                  required
                  value={form.customerName}
                  onChange={(e) => setForm(f => ({ ...f, customerName: e.target.value }))}
                  placeholder="Nguyễn Văn A"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                <input
                  required
                  value={form.customerPhone}
                  onChange={(e) => setForm(f => ({ ...f, customerPhone: e.target.value }))}
                  placeholder="0901 234 567"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-gray-400 font-normal">(tùy chọn)</span></label>
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) => setForm(f => ({ ...f, customerEmail: e.target.value }))}
                  placeholder="email@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Lời nhắn</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tôi muốn thuê văn phòng tầng 3, diện tích khoảng 150m²..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 disabled:opacity-60 transition-all shadow-lg shadow-blue-200"
              >
                {loading ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function BuildingCard({ building, onConsult }) {
  const [hovered, setHovered] = useState(false);

  const address = [building.street, building.ward, building.district?.name].filter(Boolean).join(", ");

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 ${hovered ? "shadow-xl -translate-y-1" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden">
        {building.image ? (
          <img src={building.image} alt={building.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1} className="w-16 h-16 opacity-20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-white/30 text-xs">Chưa có ảnh</p>
          </div>
        )}
        {building.type && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
            {building.type}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{building.name}</h3>

        {address && (
          <div className="flex items-start gap-1.5 text-gray-500 text-sm mb-3">
            <span className="mt-0.5 flex-shrink-0 text-blue-400">{icons.location}</span>
            <span className="line-clamp-1">{address}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {building.floorArea && (
            <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full">
              {icons.area} {building.floorArea} m²
            </span>
          )}
          {building.rentPrice && (
            <span className="flex items-center gap-1 text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full font-medium">
              {icons.price} {building.rentPrice.toLocaleString()} USD/m²
            </span>
          )}
          {building.rentAreas?.size > 0 && [...building.rentAreas].map(ra => (
            <span key={ra.id} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">{ra.value}m²</span>
          ))}
        </div>

        {building.rentTypes && building.rentTypes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {building.rentTypes.map(rt => (
              <span key={rt.id} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-medium">{rt.name}</span>
            ))}
          </div>
        )}

        <button
          onClick={() => onConsult(building)}
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md shadow-blue-100 hover:shadow-blue-200"
        >
          📞 Liên hệ tư vấn
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [consultBuilding, setConsultBuilding] = useState(null);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    consultService.getPublicBuildings()
      .then(data => setBuildings(data || []))
      .catch(() => setBuildings([]))
      .finally(() => setLoading(false));
  }, []);

  const types = ["all", ...new Set(buildings.map(b => b.type).filter(Boolean))];

  const filtered = buildings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      b.name?.toLowerCase().includes(q) ||
      b.street?.toLowerCase().includes(q) ||
      b.ward?.toLowerCase().includes(q) ||
      b.district?.name?.toLowerCase().includes(q);
    const matchType = filterType === "all" || b.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NavBar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base leading-tight">BĐS Premium</p>
              <p className="text-blue-600 text-xs leading-tight">Bất động sản cao cấp</p>
            </div>
          </div>
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Đăng nhập
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-20 px-4 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-6 border border-blue-500/30">
            🏙️ Nền tảng bất động sản #1 Việt Nam
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
            Tìm Văn Phòng &amp; Mặt Bằng
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Lý Tưởng Của Bạn
            </span>
          </h1>
          <p className="text-slate-300 text-lg mb-10">
            Hàng trăm tòa nhà cho thuê văn phòng, mặt bằng thương mại tại TP.HCM.<br className="hidden sm:block" />
            Tư vấn miễn phí, hỗ trợ tận tâm.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, địa chỉ, quận..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-3 gap-4 text-center">
          {[
            { value: buildings.length, label: "Tòa nhà" },
            { value: "100%", label: "Tư vấn miễn phí" },
            { value: "24/7", label: "Hỗ trợ" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-extrabold text-blue-700">{value}+</p>
              <p className="text-sm text-gray-500 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter + Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Danh sách tòa nhà</h2>
            <p className="text-gray-500 text-sm mt-0.5">{filtered.length} tòa nhà phù hợp</p>
          </div>
          <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl flex-wrap">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterType === t ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
              >
                {t === "all" ? "Tất cả" : t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-20 h-20 mx-auto mb-4 text-gray-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-lg font-medium">Không tìm thấy tòa nhà phù hợp</p>
            <p className="text-sm mt-1">Thử thay đổi từ khóa tìm kiếm</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(b => (
              <BuildingCard key={b.id} building={b} onConsult={setConsultBuilding} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-center py-8 mt-10">
        <p className="text-sm">© 2025 BĐS Premium. Hotline: <span className="text-white font-medium">1900 1234</span></p>
      </footer>

      {/* Consult Modal */}
      {consultBuilding && (
        <ConsultModal
          building={consultBuilding}
          onClose={() => setConsultBuilding(null)}
        />
      )}
    </div>
  );
}
