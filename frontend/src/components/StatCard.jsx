import useCounter from "../hooks/useCounter";

export default function StatCard({ end, suffix, label, icon }) {
  const [count, ref] = useCounter(end);

  return (
    <div ref={ref} className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/20 mb-3 text-primary-400">
        {icon}
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-white font-heading">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-white/60 mt-1 font-medium font-body">{label}</p>
    </div>
  );
}
