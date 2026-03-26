import useCounter from "../hooks/useCounter";

export default function StatCard({ end, suffix, label, icon }) {
  const [count, ref] = useCounter(end);

  return (
    <div ref={ref} className="text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-3 text-white/90">
        {icon}
      </div>
      <p className="text-3xl sm:text-4xl font-black text-white">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-blue-200/90 mt-1 font-medium">{label}</p>
    </div>
  );
}
