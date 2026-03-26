import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import consultService from "../services/consultService";
import ConsultModal from "../components/ConsultModal";
import Footer from "../components/Footer";
import { Icons } from "../components/icons";

function Skeleton({ className }) {
  return <div className={`shimmer rounded-lg ${className}`} />;
}

function InfoRow({ icon, label, value, accent }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3 py-3">
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${accent ? "bg-primary-50 text-primary-600" : "bg-gray-100 text-gray-500"}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function BuildingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConsult, setShowConsult] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setLoading(true);
    consultService
      .getPublicBuildingById(id)
      .then((data) => setBuilding(data))
      .catch(() => setError("Không tìm thấy tòa nhà này."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const address = building
    ? [building.street, building.ward, building.district?.name].filter(Boolean).join(", ")
    : "";

  const rentAreasText = building?.rentAreas?.length
    ? [...building.rentAreas].map((ra) => `${ra.value} m²`).join(", ")
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-[55vh] shimmer" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 -mt-24 relative z-10">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <Skeleton className="h-8 w-2/3 mb-4" />
            <Skeleton className="h-5 w-1/3 mb-6" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !building) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🏚️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{error || "Không tìm thấy"}</h2>
          <p className="text-gray-500 mb-6">Tòa nhà này không tồn tại hoặc đã bị xóa.</p>
          <Link to="/properties" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors">
            {Icons.arrow} Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerScrolled ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100" : "bg-transparent"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className={`p-2 rounded-xl transition-all ${headerScrolled ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/20 text-white"}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            {headerScrolled && (
              <div className="animate-fade-in">
                <p className="text-sm font-bold text-gray-900 line-clamp-1">{building.name}</p>
                {building.rentPrice && (
                  <p className="text-xs font-semibold text-primary-600">{building.rentPrice.toLocaleString()} USD/m²</p>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {headerScrolled && (
              <button onClick={() => setShowConsult(true)} className="px-5 py-2 bg-primary-500 text-white text-sm font-bold rounded-xl hover:bg-primary-600 transition-colors animate-fade-in">
                Liên hệ
              </button>
            )}
            <Link to="/" className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${headerScrolled ? "bg-gray-100 hover:bg-gray-200" : "bg-white/15 hover:bg-white/25"}`}>
              {Icons.home}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <section className="relative h-[55vh] min-h-[400px] overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900">
        {building.image && (
          <img
            src={building.image}
            alt={building.name}
            onLoad={() => setImageLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        {!building.image && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1} className="w-14 h-14 opacity-30">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-white/30 text-sm font-medium">Chưa có ảnh tòa nhà</p>
          </div>
        )}

        {/* Breadcrumb on hero */}
        <div className="absolute top-20 left-0 right-0 z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-sm text-white/70">
              <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
              <span>/</span>
              <Link to="/properties" className="hover:text-white transition-colors">Bất động sản</Link>
              <span>/</span>
              <span className="text-white font-medium line-clamp-1">{building.name}</span>
            </nav>
          </div>
        </div>

        {/* Building name overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-28">
            {building.type && (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-white mb-4">
                {building.type}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {building.name}
            </h1>
            {address && (
              <div className="flex items-center gap-2 mt-3 text-white/80">
                <span className="text-white/60">{Icons.location}</span>
                <span className="text-base font-medium">{address}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Floating Stats Card */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 -mt-16 relative z-20 mb-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-black/[0.06] border border-gray-100 p-6 sm:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="text-center sm:text-left">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Giá thuê</p>
              <p className="text-2xl sm:text-3xl font-black text-primary-600">
                {building.rentPrice ? `${building.rentPrice.toLocaleString()}` : "Liên hệ"}
              </p>
              {building.rentPrice && <p className="text-xs text-gray-500 font-medium mt-0.5">USD/m²/tháng</p>}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Diện tích sàn</p>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">
                {building.floorArea ? `${building.floorArea.toLocaleString()}` : "—"}
              </p>
              {building.floorArea && <p className="text-xs text-gray-500 font-medium mt-0.5">m²</p>}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Kết cấu</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{building.structure || "—"}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Tầng hầm</p>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{building.numberOfBasement ?? "—"}</p>
              {building.numberOfBasement != null && <p className="text-xs text-gray-500 font-medium mt-0.5">tầng</p>}
            </div>
          </div>

          {/* Quick CTA */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setShowConsult(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 text-white rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-primary-200 hover:-translate-y-0.5 transition-all duration-300"
            >
              {Icons.phone} Yêu cầu tư vấn miễn phí
            </button>
            {building.linkOfBuilding && (
              <a
                href={building.linkOfBuilding}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Xem trên web
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column — Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {building.rentPriceDescription && (
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  Mô tả giá thuê
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{building.rentPriceDescription}</p>
              </section>
            )}

            {/* Fee Details */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  {Icons.price}
                </span>
                Chi phí & Điều khoản
              </h2>
              <div className="grid sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0">
                <div className="divide-y divide-gray-100">
                  <InfoRow
                    icon={Icons.price}
                    label="Giá thuê"
                    value={building.rentPrice ? `${building.rentPrice.toLocaleString()} USD/m²` : null}
                    accent
                  />
                  <InfoRow
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>}
                    label="Phí dịch vụ"
                    value={building.serviceFee}
                  />
                  <InfoRow
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
                    label="Phí điện"
                    value={building.electricityFee}
                  />
                  <InfoRow
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>}
                    label="Phí nước"
                    value={building.waterFee}
                  />
                </div>
                <div className="divide-y divide-gray-100">
                  <InfoRow
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.079-.481 1.024-1.099-.045-.51-.12-1.014-.207-1.512l-1.168-5.84A2.25 2.25 0 0016.637 8.1H3.75" /></svg>}
                    label="Phí ô tô"
                    value={building.carFee}
                  />
                  <InfoRow
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    label="Phí ngoài giờ"
                    value={building.overtimeFee}
                  />
                  <InfoRow
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    label="Đặt cọc"
                    value={building.deposit}
                  />
                  <InfoRow
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>}
                    label="Thanh toán"
                    value={building.payment}
                  />
                </div>
              </div>
            </section>

            {/* Building Info */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  {Icons.buildingSmall}
                </span>
                Thông tin tòa nhà
              </h2>
              <div className="grid sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0">
                <div className="divide-y divide-gray-100">
                  <InfoRow icon={Icons.buildingSmall} label="Kết cấu" value={building.structure} />
                  <InfoRow icon={Icons.area} label="Diện tích sàn" value={building.floorArea ? `${building.floorArea.toLocaleString()} m²` : null} accent />
                  <InfoRow
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M3 4v16h18V4M3 8h18M7 4v16" /></svg>}
                    label="Số tầng hầm"
                    value={building.numberOfBasement}
                  />
                </div>
                <div className="divide-y divide-gray-100">
                  <InfoRow
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    label="Thời gian thuê"
                    value={building.rentTime}
                  />
                  <InfoRow
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>}
                    label="Thời gian hoàn thiện"
                    value={building.decorationTime}
                  />
                  <InfoRow
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
                    label="Phí môi giới"
                    value={building.brokerageFee}
                  />
                </div>
              </div>
            </section>

            {/* Rent Areas */}
            {rentAreasText && (
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
                    {Icons.area}
                  </span>
                  Diện tích cho thuê
                </h2>
                <div className="flex flex-wrap gap-3">
                  {[...building.rentAreas].map((ra) => (
                    <div key={ra.id} className="px-5 py-3 bg-gradient-to-br from-violet-50 to-primary-50 border border-violet-100 rounded-xl text-center">
                      <p className="text-xl font-black text-violet-700">{ra.value}</p>
                      <p className="text-xs font-medium text-violet-500 mt-0.5">m²</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rent Types */}
            {building.rentTypes && building.rentTypes.length > 0 && (
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                  </span>
                  Loại hình cho thuê
                </h2>
                <div className="flex flex-wrap gap-2">
                  {[...building.rentTypes].map((rt) => (
                    <span key={rt.id} className="px-4 py-2 bg-amber-50 text-amber-800 rounded-xl text-sm font-semibold border border-amber-100">
                      {rt.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Note */}
            {building.note && (
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                  </span>
                  Ghi chú
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{building.note}</p>
              </section>
            )}
          </div>

          {/* Right Column — Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 p-6 text-white text-center">
                  <div className="w-16 h-16 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                    {Icons.phone}
                  </div>
                  <h3 className="font-bold text-lg">Quan tâm tòa nhà này?</h3>
                  <p className="text-white/80 text-sm mt-1">Liên hệ ngay để nhận tư vấn miễn phí</p>
                </div>
                <div className="p-6">
                  <button
                    onClick={() => setShowConsult(true)}
                    className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-primary-200 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {Icons.phone} Gửi yêu cầu tư vấn
                  </button>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Phản hồi trong 30 phút</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Tư vấn miễn phí 100%</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Hỗ trợ xem mặt bằng trực tiếp</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-sm">Thông tin nhanh</h3>
                <div className="space-y-3">
                  {[
                    { label: "Loại hình", value: building.type },
                    { label: "Quận", value: building.district?.name },
                    { label: "Phường/Xã", value: building.ward },
                    { label: "Đường", value: building.street },
                    { label: "Diện tích", value: building.floorArea ? `${building.floorArea} m²` : null },
                    { label: "Giá thuê", value: building.rentPrice ? `${building.rentPrice.toLocaleString()} USD/m²` : null },
                  ]
                    .filter((item) => item.value)
                    .map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-semibold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Map Link */}
              {building.map && (
                <a
                  href={building.map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-primary-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                      {Icons.location}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Xem trên bản đồ</p>
                      <p className="text-xs text-gray-500 mt-0.5">Mở Google Maps</p>
                    </div>
                    <span className="ml-auto text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all">
                      {Icons.arrow}
                    </span>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {showConsult && (
        <ConsultModal building={building} onClose={() => setShowConsult(false)} />
      )}
    </div>
  );
}
