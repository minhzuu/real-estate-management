import { Link } from "react-router-dom";
import { Icons } from "../icons";
import BuildingCard from "../BuildingCard";
import useReveal from "../../hooks/useReveal";

export default function FeaturedProperties({ buildings, loading, onConsult }) {
  const revealRef = useReveal();

  return (
    <section id="featured" className="py-20 px-4 sm:px-6 bg-gray-50">
      <div ref={revealRef} className="reveal mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-500">Featured</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
              Bất động sản <span className="gradient-text">nổi bật</span>
            </h2>
            <p className="mt-2 text-sm text-gray-500 max-w-lg">
              Lựa chọn hàng đầu với tiềm năng khai thác và tỷ lệ lấp đầy cao nhất.
            </p>
          </div>
          <Link to="/properties" className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-50 text-primary-600 text-sm font-bold hover:bg-primary-100 transition-all whitespace-nowrap">
            Xem tất cả <span className="group-hover:translate-x-1 transition-transform">{Icons.arrow}</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                <div className="h-52 shimmer" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 rounded-lg shimmer" />
                  <div className="h-4 w-1/2 rounded-lg shimmer" />
                  <div className="h-11 rounded-xl shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : buildings.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-5xl mb-4">🏠</div>
            <p className="text-lg font-bold text-gray-800">Chưa có bất động sản phù hợp</p>
            <p className="mt-1 text-sm text-gray-500">Thử thay đổi bộ lọc tìm kiếm ở trên.</p>
          </div>
        ) : (
          <div className="stagger-children revealed grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {buildings.map((b, i) => (
              <div key={b.id} className="relative">
                <BuildingCard building={b} onConsult={onConsult} index={i} />
                {i < 3 && (
                  <div className="absolute -top-2 right-4 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-3 py-1.5 text-[11px] font-black text-white shadow-lg shadow-amber-200">
                      ⭐ Nổi bật
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
