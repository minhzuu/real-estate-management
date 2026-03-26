import { Link } from "react-router-dom";
import { Icons } from "./icons";

export default function BuildingCard({ building, onConsult, index = 0 }) {
  const address = [building.street, building.ward, building.district?.name].filter(Boolean).join(", ");

  return (
    <div className="group card-premium bg-white rounded-2xl overflow-hidden border border-gray-100/80 shadow-sm" style={{ animationDelay: `${index * 100}ms` }}>
      <Link to={`/property/${building.id}`} className="block">
        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
          {building.image ? (
            <img src={building.image} alt={building.name} className="w-full h-full object-cover img-zoom" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary-900/90 to-secondary-900/90">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1} className="w-10 h-10 opacity-40">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-white/30 text-xs font-medium">Chưa có ảnh</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {building.type && (
            <span className="absolute top-3 left-3 px-3.5 py-1.5 bg-white/95 backdrop-blur-sm text-primary-700 text-xs font-bold rounded-full shadow-lg">
              {building.type}
            </span>
          )}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <span className="px-4 py-2 bg-white rounded-full text-xs font-bold text-primary-700 shadow-lg">
              Xem chi tiết
            </span>
          </div>
        </div>
      </Link>
      <div className="p-5">
        <Link to={`/property/${building.id}`}>
          <h3 className="font-bold text-gray-900 text-lg mb-1.5 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {building.name}
          </h3>
        </Link>
        {address && (
          <div className="flex items-start gap-1.5 text-gray-500 text-sm mb-3">
            <span className="mt-0.5 flex-shrink-0 text-primary-400">{Icons.location}</span>
            <span className="line-clamp-1">{address}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {building.floorArea && (
            <span className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full font-medium">
              {Icons.area} {building.floorArea} m²
            </span>
          )}
          {building.rentPrice && (
            <span className="flex items-center gap-1.5 text-xs text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full font-bold">
              {Icons.price} {building.rentPrice.toLocaleString()} USD/m²
            </span>
          )}
        </div>
        {building.rentTypes && building.rentTypes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {building.rentTypes.map((rt) => (
              <span key={rt.id} className="text-xs bg-secondary-50 text-secondary-700 px-2.5 py-1 rounded-lg font-semibold">
                {rt.name}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Link
            to={`/property/${building.id}`}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            Xem chi tiết
          </Link>
          <button
            onClick={() => onConsult(building)}
            className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold text-sm hover:from-primary-600 hover:to-secondary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            {Icons.phone} Tư vấn
          </button>
        </div>
      </div>
    </div>
  );
}
