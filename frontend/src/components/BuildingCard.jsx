import { Link } from "react-router-dom";
import { Icons } from "./icons";

export default function BuildingCard({ building, onConsult, index = 0 }) {
  const address = [building.street, building.ward, building.district?.name]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className="group card-premium bg-white overflow-hidden border border-dark-100"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link to={`/property/${building.id}`} className="block">
        <div className="relative h-64 overflow-hidden bg-dark-100">
          {building.image ? (
            <img
              src={building.image}
              alt={building.name}
              className="w-full h-full object-cover img-zoom"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-dark-200 to-dark-300">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                className="w-12 h-12 text-dark-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <p className="text-dark-400 text-xs font-medium font-body">Chưa có ảnh</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {building.type && (
            <span className="absolute top-4 left-4 px-3 py-1.5 bg-dark-800/80 backdrop-blur-sm text-white text-xs font-semibold tracking-wide uppercase font-body">
              {building.type}
            </span>
          )}
          {building.rentPrice && (
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1.5 bg-primary-400 text-white text-sm font-bold font-body">
                {building.rentPrice.toLocaleString()} USD/m²
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/property/${building.id}`}>
          <h3 className="font-semibold text-dark-800 text-lg mb-2 line-clamp-1 group-hover:text-primary-500 transition-colors">
            {building.name}
          </h3>
        </Link>
        {address && (
          <div className="flex items-start gap-2 text-dark-400 text-sm mb-4 font-body">
            <span className="mt-0.5 flex-shrink-0 text-primary-400">
              {Icons.location}
            </span>
            <span className="line-clamp-1">{address}</span>
          </div>
        )}

        <div className="flex items-center gap-4 py-4 border-t border-dark-100 text-dark-500 text-sm font-body">
          {building.floorArea && (
            <span className="flex items-center gap-1.5">
              {Icons.area}
              <span>{building.floorArea} m²</span>
            </span>
          )}
          {building.rentTypes && building.rentTypes.length > 0 && (
            <span className="flex items-center gap-1.5">
              {Icons.buildingSmall}
              <span>{building.rentTypes.length} loại hình</span>
            </span>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <Link
            to={`/property/${building.id}`}
            className="flex-1 py-3 border border-dark-200 text-dark-700 font-semibold text-sm hover:bg-dark-50 transition-colors flex items-center justify-center gap-2 font-body"
          >
            Xem chi tiết
          </Link>
          <button
            onClick={() => onConsult(building)}
            className="flex-1 py-3 bg-dark-800 text-white font-semibold text-sm hover:bg-primary-500 transition-all duration-300 flex items-center justify-center gap-2 font-body"
          >
            {Icons.phone} Tư vấn
          </button>
        </div>
      </div>
    </div>
  );
}
