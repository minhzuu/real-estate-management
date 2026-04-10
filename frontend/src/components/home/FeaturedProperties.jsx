import { Link } from "react-router-dom";
import { Icons } from "../icons";
import BuildingCard from "../BuildingCard";
import useReveal from "../../hooks/useReveal";

export default function FeaturedProperties({ buildings, loading, onConsult }) {
  const revealRef = useReveal();

  return (
    <section id="featured" className="py-24 px-4 sm:px-6 bg-primary-50">
      <div ref={revealRef} className="reveal mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <p className="estatic-section-label">Featured</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-dark-800">
              Bất động sản nổi bật
            </h2>
            <div className="estatic-divider mt-4" />
            <p className="mt-4 text-sm text-dark-400 max-w-lg font-body leading-relaxed">
              Lựa chọn hàng đầu với tiềm năng khai thác và tỷ lệ lấp đầy cao
              nhất trên thị trường.
            </p>
          </div>
          <Link
            to="/properties"
            className="group inline-flex items-center gap-2 px-6 py-3 border border-dark-800 text-dark-800 text-sm font-semibold hover:bg-dark-800 hover:text-white transition-all duration-300 whitespace-nowrap font-body"
          >
            Xem tất cả{" "}
            <span className="group-hover:translate-x-1 transition-transform">
              {Icons.arrow}
            </span>
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border border-dark-100 bg-white overflow-hidden"
              >
                <div className="h-64 shimmer" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 rounded shimmer" />
                  <div className="h-4 w-1/2 rounded shimmer" />
                  <div className="h-11 rounded shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : buildings.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-primary-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-dark-800">
              Chưa có bất động sản phù hợp
            </p>
            <p className="mt-2 text-sm text-dark-400 font-body">
              Thử thay đổi bộ lọc tìm kiếm ở trên.
            </p>
          </div>
        ) : (
          <div className="stagger-children revealed grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {buildings.map((b, i) => (
              <BuildingCard
                key={b.id}
                building={b}
                onConsult={onConsult}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
