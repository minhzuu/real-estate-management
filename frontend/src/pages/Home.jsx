import { useState, useEffect } from "react";
import consultService from "../services/consultService";

import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import ConsultModal from "../components/ConsultModal";
import HeroSection from "../components/home/HeroSection";
import HowItWorks from "../components/home/HowItWorks";
import FeaturedProperties from "../components/home/FeaturedProperties";
import ServicesSection from "../components/home/ServicesSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import CTASection from "../components/home/CTASection";

export default function Home() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState("");
  const [priceRange, setPriceRange] = useState("any");
  const [typeFilter, setTypeFilter] = useState("all");
  const [consultBuilding, setConsultBuilding] = useState(null);
  const [headerScrolled, setHeaderScrolled] = useState(false);

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

  const types = ["all", ...new Set(buildings.map((b) => b.type).filter(Boolean))];

  const filtered = buildings.filter((b) => {
    const q = searchLocation.trim().toLowerCase();
    const matchLoc =
      !q ||
      b.name?.toLowerCase().includes(q) ||
      b.street?.toLowerCase().includes(q) ||
      b.ward?.toLowerCase().includes(q) ||
      b.district?.name?.toLowerCase().includes(q);
    const matchType = typeFilter === "all" || b.type === typeFilter;
    const price = Number(b.rentPrice) || 0;
    let matchPrice = true;
    if (priceRange === "low") matchPrice = price > 0 && price <= 10;
    else if (priceRange === "mid") matchPrice = price > 10 && price <= 20;
    else if (priceRange === "high") matchPrice = price > 20;
    return matchLoc && matchType && matchPrice;
  });

  const featured = filtered.slice(0, 6);

  return (
    <div className="min-h-screen bg-white text-dark-800 overflow-x-hidden">
      <PublicHeader scrolled={headerScrolled} />

      <HeroSection
        searchLocation={searchLocation}
        onSearchLocationChange={setSearchLocation}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        types={types}
      />

      <HowItWorks />

      <FeaturedProperties
        buildings={featured}
        loading={loading}
        onConsult={setConsultBuilding}
      />

      <ServicesSection />
      <TestimonialsSection />
      <CTASection />

      <Footer />

      {consultBuilding && (
        <ConsultModal
          building={consultBuilding}
          onClose={() => setConsultBuilding(null)}
        />
      )}
    </div>
  );
}
