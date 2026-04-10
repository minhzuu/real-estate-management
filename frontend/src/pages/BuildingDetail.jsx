import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import consultService from "../services/consultService";
import ConsultModal from "../components/ConsultModal";
import Footer from "../components/Footer";

function Skeleton({ className }) {
  return <div className={`shimmer rounded ${className}`} />;
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
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    consultService
      .getPublicBuildingById(id)
      .then((data) => setBuilding(data))
      .catch(() => setError("Không tìm thấy tòa nhà này."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  const address = building
    ? [building.street, building.ward, building.district?.name].filter(Boolean).join(", ")
    : "";

  const allImages = building
    ? (building.images?.length > 0 ? building.images : building.image ? [building.image] : [])
    : [];
  const hasMultiple = allImages.length > 1;

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-[60vh] bg-dark-100 shimmer" />
        <div className="mx-auto max-w-6xl px-6 -mt-20 relative z-10">
          <div className="bg-white rounded-xl shadow-lg p-10">
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-10 w-2/3 mb-4" />
            <Skeleton className="h-5 w-1/3 mb-8" />
            <div className="grid grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Error ─── */
  if (error || !building) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-10 h-10 text-dark-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="font-heading text-2xl text-dark-800 mb-2">{error || "Không tìm thấy"}</h2>
          <p className="text-dark-400 mb-8">Tòa nhà này không tồn tại hoặc đã bị xóa.</p>
          <Link to="/properties" className="inline-flex items-center gap-2 px-6 py-3 bg-dark-800 text-white rounded-lg font-medium text-sm hover:bg-dark-700 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const v = (val) => val ?? "—";

  const buildingInfo = [
    { label: "Diện tích sàn", value: building.floorArea ? `${building.floorArea.toLocaleString()} m²` : "—" },
    { label: "Kết cấu", value: v(building.structure) },
    { label: "Số tầng hầm", value: building.numberOfBasement != null ? `${building.numberOfBasement} tầng` : "—" },
    { label: "Loại hình", value: v(building.type) },
    { label: "Quận", value: v(building.district?.name) },
    { label: "Phường/Xã", value: v(building.ward) },
    { label: "Đường", value: v(building.street) },
  ];

  const feeInfo = [
    { label: "Giá thuê", value: building.rentPrice ? `${building.rentPrice.toLocaleString()} USD/m²` : "—", accent: true },
    { label: "Phí dịch vụ", value: v(building.serviceFee) },
    { label: "Phí điện", value: v(building.electricityFee) },
    { label: "Phí nước", value: v(building.waterFee) },
    { label: "Phí ô tô", value: v(building.carFee) },
    { label: "Phí xe máy", value: v(building.motorbikeFee) },
    { label: "Phí ngoài giờ", value: v(building.overtimeFee) },
    { label: "Phí môi giới", value: v(building.brokerageFee) },
  ];

  const termInfo = [
    { label: "Đặt cọc", value: v(building.deposit) },
    { label: "Hình thức thanh toán", value: v(building.payment) },
    { label: "Thời gian thuê", value: v(building.rentTime) },
    { label: "Thời gian hoàn thiện", value: v(building.decorationTime) },
  ];

  const quickStats = [
    { key: "area", label: "Diện tích", value: building.floorArea ? `${building.floorArea.toLocaleString()} m²` : "—" },
    { key: "structure", label: "Kết cấu", value: building.structure || "—" },
    { key: "basement", label: "Tầng hầm", value: building.numberOfBasement != null ? building.numberOfBasement : "—" },
    { key: "type", label: "Loại hình", value: building.type || "—" },
    { key: "price", label: "Giá thuê", value: building.rentPrice ? `${building.rentPrice.toLocaleString()} USD` : "Liên hệ" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ── Sticky Header ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerScrolled ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.06)]" : "bg-transparent"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className={`p-2 rounded-lg transition-all ${headerScrolled ? "hover:bg-dark-50 text-dark-700" : "hover:bg-white/20 text-white"}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            {headerScrolled && (
              <div className="animate-fade-in">
                <p className="text-sm font-semibold text-dark-800 line-clamp-1 font-body">{building.name}</p>
                {building.rentPrice && <p className="text-xs text-primary-500 font-medium">{building.rentPrice.toLocaleString()} USD/m²</p>}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {headerScrolled && (
              <button onClick={() => setShowConsult(true)} className="px-5 py-2 bg-dark-800 text-white text-sm font-medium rounded-lg hover:bg-dark-700 transition-colors animate-fade-in">
                Yêu cầu tư vấn
              </button>
            )}
            <Link to="/" className={`p-2 rounded-lg transition-all ${headerScrolled ? "hover:bg-dark-50 text-dark-600" : "hover:bg-white/20 text-white"}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Image Gallery ── */}
      <section className="relative h-[60vh] min-h-[450px] bg-dark-900 overflow-hidden">
        {allImages.length > 0 ? (
          <>
            <Swiper
              modules={[Navigation, Pagination, Thumbs, Keyboard]}
              navigation={hasMultiple}
              pagination={hasMultiple ? { clickable: true } : false}
              keyboard={{ enabled: true }}
              thumbs={hasMultiple && thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
              loop={hasMultiple}
              className="h-full w-full building-hero-swiper"
            >
              {allImages.map((url, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={url}
                    alt={`${building.name} - ${idx + 1}`}
                    onLoad={idx === 0 ? () => setImageLoaded(true) : undefined}
                    onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                    className={`w-full h-full object-cover cursor-zoom-in transition-all duration-1000 ${idx === 0 ? (imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105") : ""}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {hasMultiple && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 max-w-sm w-full px-4">
                <Swiper
                  modules={[Thumbs]}
                  onSwiper={setThumbsSwiper}
                  slidesPerView={Math.min(allImages.length, 5)}
                  spaceBetween={6}
                  watchSlidesProgress
                  className="building-thumbs-swiper"
                >
                  {allImages.map((url, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="h-12 rounded-md overflow-hidden border-2 border-white/30 hover:border-white transition-all cursor-pointer">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            {hasMultiple && (
              <button
                onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
                className="absolute top-20 right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-md text-white text-xs font-medium hover:bg-black/60 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {allImages.length} ảnh
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-dark-800 to-dark-900">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={0.5} className="w-20 h-20 text-dark-600 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-dark-500 text-sm">Chưa có ảnh tòa nhà</p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
      </section>

      {/* ── Title & Quick Stats ── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-28 relative z-20">
        <div className="bg-white rounded-xl shadow-xl shadow-black/[0.08] p-8 sm:p-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-dark-400 mb-5 font-body">
            <Link to="/" className="hover:text-primary-500 transition-colors">Trang chủ</Link>
            <span className="text-dark-200">/</span>
            <Link to="/properties" className="hover:text-primary-500 transition-colors">Bất động sản</Link>
            <span className="text-dark-200">/</span>
            <span className="text-dark-600">{building.name}</span>
          </nav>

          {/* Type badge */}
          {building.type && (
            <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 text-xs font-semibold tracking-wide uppercase rounded mb-4 font-body">
              {building.type}
            </span>
          )}

          {/* Title */}
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] text-dark-900 leading-tight mb-3">
            {building.name}
          </h1>

          {/* Address */}
          {address && (
            <p className="flex items-center gap-2 text-dark-400 text-sm font-body mb-8">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {address}
            </p>
          )}

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-0 sm:divide-x divide-dark-100">
            {quickStats.map((stat, i) => (
              <div key={i} className={`${i > 0 ? "sm:pl-6" : ""} ${i < quickStats.length - 1 ? "sm:pr-6" : ""}`}>
                <p className="text-[11px] text-dark-300 uppercase tracking-wider font-semibold mb-1.5 font-body">{stat.label}</p>
                <p className={`text-lg font-bold font-body ${stat.key === "price" ? "text-primary-500" : "text-dark-800"}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Summary / Description */}
            {building.rentPriceDescription && (
              <section>
                <h2 className="font-heading text-2xl text-dark-900 mb-1">Tổng quan</h2>
                <div className="w-12 h-0.5 bg-primary-400 mb-6" />
                <p className="text-dark-500 leading-relaxed whitespace-pre-line font-body text-[15px]">
                  {building.rentPriceDescription}
                </p>
              </section>
            )}

            {/* Building Specification */}
            <section>
              <h2 className="font-heading text-2xl text-dark-900 mb-1">Thông tin tòa nhà</h2>
              <div className="w-12 h-0.5 bg-primary-400 mb-6" />
              <div className="grid sm:grid-cols-2 gap-x-8">
                {buildingInfo.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3.5 border-b border-dark-50">
                    <span className="text-dark-400 text-sm font-body">{item.label}</span>
                    <span className={`text-sm font-semibold font-body ${item.value === "—" ? "text-dark-200" : "text-dark-800"}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Fee & Cost Specification */}
            <section>
              <h2 className="font-heading text-2xl text-dark-900 mb-1">Chi phí & Phí dịch vụ</h2>
              <div className="w-12 h-0.5 bg-primary-400 mb-6" />
              <div className="grid sm:grid-cols-2 gap-x-8">
                {feeInfo.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3.5 border-b border-dark-50">
                    <span className="text-dark-400 text-sm font-body">{item.label}</span>
                    <span className={`text-sm font-semibold font-body ${item.accent && item.value !== "—" ? "text-primary-500" : item.value === "—" ? "text-dark-200" : "text-dark-800"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Rental Terms */}
            <section>
              <h2 className="font-heading text-2xl text-dark-900 mb-1">Điều khoản thuê</h2>
              <div className="w-12 h-0.5 bg-primary-400 mb-6" />
              <div className="grid sm:grid-cols-2 gap-x-8">
                {termInfo.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3.5 border-b border-dark-50">
                    <span className="text-dark-400 text-sm font-body">{item.label}</span>
                    <span className={`text-sm font-semibold font-body ${item.value === "—" ? "text-dark-200" : "text-dark-800"}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Rent Areas */}
            {building.rentAreas && building.rentAreas.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl text-dark-900 mb-1">Diện tích cho thuê</h2>
                <div className="w-12 h-0.5 bg-primary-400 mb-6" />
                <div className="flex flex-wrap gap-3">
                  {[...building.rentAreas].map((ra) => (
                    <div key={ra.id} className="px-5 py-3 border border-dark-100 rounded-lg text-center hover:border-primary-300 hover:bg-primary-50/50 transition-colors">
                      <span className="text-lg font-bold text-dark-800 font-body">{ra.value}</span>
                      <span className="text-dark-400 text-sm ml-1">m²</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rent Types / Features */}
            {building.rentTypes && building.rentTypes.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl text-dark-900 mb-1">Loại hình cho thuê</h2>
                <div className="w-12 h-0.5 bg-primary-400 mb-6" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[...building.rentTypes].map((rt) => (
                    <div key={rt.id} className="flex items-center gap-3 py-2">
                      <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-3 h-3 text-primary-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-dark-600 text-sm font-medium font-body">{rt.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Note */}
            {building.note && (
              <section>
                <h2 className="font-heading text-2xl text-dark-900 mb-1">Ghi chú</h2>
                <div className="w-12 h-0.5 bg-primary-400 mb-6" />
                <div className="bg-dark-50/50 rounded-lg p-5 border-l-4 border-primary-400">
                  <p className="text-dark-500 leading-relaxed whitespace-pre-line font-body text-[15px]">
                    {building.note}
                  </p>
                </div>
              </section>
            )}

            {/* Location */}
            {(building.map || address) && (
              <section>
                <h2 className="font-heading text-2xl text-dark-900 mb-1">Vị trí</h2>
                <div className="w-12 h-0.5 bg-primary-400 mb-6" />
                {address && (
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-primary-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-dark-800 text-sm font-semibold font-body mb-0.5">Địa chỉ</p>
                      <p className="text-dark-500 text-sm font-body">{address}</p>
                    </div>
                  </div>
                )}
                {building.map && (
                  <a
                    href={building.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-dark-200 text-dark-700 rounded-lg text-sm font-medium hover:bg-dark-50 transition-colors font-body"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Xem trên Google Maps
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </section>
            )}
          </div>

          {/* ── Right Column — Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">

              {/* CTA Card */}
              <div className="bg-dark-900 rounded-xl p-7 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary-400/20 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 text-primary-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl text-white mb-2">Yêu cầu tham quan</h3>
                <p className="text-dark-300 text-sm mb-6 font-body">Liên hệ ngay để nhận tư vấn và đặt lịch xem mặt bằng miễn phí</p>
                <button
                  onClick={() => setShowConsult(true)}
                  className="w-full py-3.5 bg-primary-400 text-dark-900 rounded-lg font-bold text-sm hover:bg-primary-300 transition-colors font-body"
                >
                  Gửi yêu cầu tư vấn
                </button>
                <a href="tel:+84901234567" className="flex items-center justify-center gap-2 mt-4 text-primary-400 text-sm font-medium hover:text-primary-300 transition-colors font-body">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  +84 90 123 4567
                </a>
              </div>

              {/* Property Info Card */}
              <div className="border border-dark-100 rounded-xl p-6">
                <h3 className="font-heading text-lg text-dark-900 mb-5">Thông tin nhanh</h3>
                <div className="space-y-0">
                  {[
                    { label: "Mã tòa nhà", value: `#${building.id}` },
                    { label: "Loại hình", value: building.type },
                    { label: "Quận", value: building.district?.name },
                    { label: "Phường/Xã", value: building.ward },
                    { label: "Đường", value: building.street },
                    { label: "Diện tích", value: building.floorArea ? `${building.floorArea.toLocaleString()} m²` : null },
                    { label: "Giá thuê", value: building.rentPrice ? `${building.rentPrice.toLocaleString()} USD/m²` : null },
                    { label: "Kết cấu", value: building.structure },
                  ]
                    .filter((item) => item.value)
                    .map((item, i) => (
                      <div key={item.label} className={`flex items-center justify-between py-3 ${i > 0 ? "border-t border-dark-50" : ""}`}>
                        <span className="text-dark-400 text-sm font-body">{item.label}</span>
                        <span className="text-dark-800 text-sm font-semibold font-body">{item.value}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Quick Contact Benefits */}
              <div className="border border-dark-100 rounded-xl p-6">
                <div className="space-y-4">
                  {[
                    { text: "Phản hồi trong 30 phút", icon: "clock" },
                    { text: "Tư vấn miễn phí 100%", icon: "check" },
                    { text: "Hỗ trợ xem mặt bằng trực tiếp", icon: "eye" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-primary-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-dark-600 text-sm font-body">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* External Link */}
              {building.linkOfBuilding && (
                <a
                  href={building.linkOfBuilding}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 border border-dark-200 rounded-xl text-dark-600 text-sm font-medium hover:bg-dark-50 transition-colors font-body"
                >
                  Xem trên website gốc
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm font-body">
            {lightboxIndex + 1} / {allImages.length}
          </div>
          <div className="w-full max-w-5xl px-4" onClick={(e) => e.stopPropagation()}>
            <Swiper
              modules={[Navigation, Keyboard]}
              navigation
              keyboard={{ enabled: true }}
              initialSlide={lightboxIndex}
              onSlideChange={(s) => setLightboxIndex(s.activeIndex)}
              className="building-lightbox-swiper"
            >
              {allImages.map((url, idx) => (
                <SwiperSlide key={idx}>
                  <div className="flex items-center justify-center h-[80vh]">
                    <img src={url} alt={`${building.name} - ${idx + 1}`} className="max-w-full max-h-full object-contain" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {/* ── Consult Modal ── */}
      {showConsult && (
        <ConsultModal building={building} onClose={() => setShowConsult(false)} />
      )}
    </div>
  );
}
