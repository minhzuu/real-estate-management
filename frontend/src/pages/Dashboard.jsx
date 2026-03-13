import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import buildingService from "../services/buildingService";
import customerService from "../services/customerService";
import userService from "../services/userService";
import consultService from "../services/consultService";

const STATUS_COLORS = {
  PENDING:   "bg-yellow-100 text-yellow-700",
  CONTACTED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};
const STATUS_LABELS = {
  PENDING:   "Chờ xử lý",
  CONTACTED: "Đã liên hệ",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
};
const PROPERTY_CHART_COLORS = ["#5b4cc4", "#8476d1", "#a394d8", "#beb4df", "#d9d1ef"];

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("vi-VN", { weekday: "short" });
const COMPACT_FORMATTER = new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 });
const CURRENCY_FORMATTER = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function getNormalizedRole(user) {
  const rawRole = user?.roleName || user?.role?.name || "";
  return rawRole.replace(/^ROLE_/, "").toUpperCase();
}

function getDisplayName(user) {
  return user?.fullName || user?.fullname || user?.username || "Người dùng";
}

function getFullName(value) {
  return value?.fullName || value?.fullname || value?.username || "Chưa cập nhật";
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCompact(value) {
  return COMPACT_FORMATTER.format(toNumber(value));
}

function formatCurrency(value) {
  return CURRENCY_FORMATTER.format(toNumber(value));
}

async function safeRequest(requestFn, fallbackValue) {
  try {
    return await requestFn();
  } catch {
    return fallbackValue;
  }
}

function getDateKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function splitTypes(rawType) {
  if (!rawType) return ["Khác"];
  return String(rawType)
    .split(/[,/]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildWeeklyTransactions(transactions) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(today.getDate() - (6 - index));
    return {
      key: getDateKey(date),
      label: WEEKDAY_FORMATTER.format(date).replace(".", ""),
      count: 0,
    };
  });

  const indexByKey = Object.fromEntries(days.map((day, index) => [day.key, index]));
  transactions.forEach((transaction) => {
    const key = getDateKey(transaction?.createdDate || transaction?.createdAt);
    if (indexByKey[key] !== undefined) {
      days[indexByKey[key]].count += 1;
    }
  });

  return days;
}

function buildPropertyTypeStats(buildings) {
  const counts = new Map();
  buildings.forEach((building) => {
    splitTypes(building?.type).forEach((type) => {
      counts.set(type, (counts.get(type) || 0) + 1);
    });
  });

  const total = Array.from(counts.values()).reduce((sum, count) => sum + count, 0);
  return Array.from(counts.entries())
    .map(([type, count]) => ({
      type,
      count,
      percent: total ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

function buildMonthlySalesRevenue(consultRequests, transactions, averageRentPrice) {
  const today = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: `${date.getMonth() + 1}`,
      sales: 0,
      revenue: 0,
    };
  });

  const monthIndex = Object.fromEntries(months.map((month, index) => [month.key, index]));
  const unitRevenue = averageRentPrice || 1000;

  consultRequests.forEach((request) => {
    const date = new Date(request?.createdDate || request?.createdAt);
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const index = monthIndex[key];
    if (index === undefined) return;
    if (request?.status === "COMPLETED") {
      months[index].sales += 1;
      months[index].revenue += unitRevenue * 0.8;
    } else if (request?.status === "CONTACTED") {
      months[index].revenue += unitRevenue * 0.35;
    }
  });

  transactions.forEach((transaction) => {
    const date = new Date(transaction?.createdDate || transaction?.createdAt);
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const index = monthIndex[key];
    if (index === undefined) return;
    months[index].sales += 1;
    months[index].revenue += unitRevenue;
  });

  return months.map((month) => ({
    ...month,
    revenue: Math.round(month.revenue),
  }));
}

function buildFeaturedProperties(buildings) {
  return [...buildings]
    .sort((a, b) => {
      const scoreA = toNumber(a?.rentPrice) * Math.max(toNumber(a?.floorArea), 1);
      const scoreB = toNumber(b?.rentPrice) * Math.max(toNumber(b?.floorArea), 1);
      return scoreB - scoreA;
    })
    .slice(0, 4);
}

function buildSalesSummary(buildings, consultRequests, transactions) {
  const totalPotentialRevenue = buildings.reduce(
    (sum, building) => sum + toNumber(building?.rentPrice) * toNumber(building?.floorArea),
    0
  );
  const totalFloorArea = buildings.reduce((sum, building) => sum + toNumber(building?.floorArea), 0);
  const rentedBuildings = buildings.filter((building) => toNumber(building?.rentPrice) > 0);
  const averageRentPrice = rentedBuildings.length
    ? rentedBuildings.reduce((sum, building) => sum + toNumber(building?.rentPrice), 0) / rentedBuildings.length
    : 0;
  const completedLeads = consultRequests.filter((item) => item?.status === "COMPLETED").length;
  const pendingLeads = consultRequests.filter((item) => item?.status === "PENDING").length;
  const contactedLeads = consultRequests.filter((item) => item?.status === "CONTACTED").length;
  const cancelledLeads = consultRequests.filter((item) => item?.status === "CANCELLED").length;
  const conversionRate = consultRequests.length ? Math.round((completedLeads / consultRequests.length) * 100) : 0;

  return {
    totalPotentialRevenue,
    totalFloorArea,
    averageRentPrice,
    totalTransactions: transactions.length,
    completedLeads,
    pendingLeads,
    contactedLeads,
    cancelledLeads,
    conversionRate,
  };
}

function polarToCartesian(cx, cy, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function describeArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

function buildLinePath(points) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function SalesRevenueChart({ data, loading }) {
  const width = 640;
  const height = 280;
  const left = 54;
  const right = 18;
  const top = 18;
  const bottom = 34;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const maxValue = Math.max(...data.flatMap((item) => [item.sales, item.revenue]), 1);
  const steps = 4;
  const yTicks = Array.from({ length: steps + 1 }, (_, index) => Math.round((maxValue / steps) * (steps - index)));
  const denominator = data.length > 1 ? data.length - 1 : 1;
  const salesPoints = data.map((item, index) => ({
    x: left + (chartWidth * index) / denominator,
    y: top + chartHeight - (item.sales / maxValue) * chartHeight,
    value: item.sales,
    label: item.label,
  }));
  const revenuePoints = data.map((item, index) => ({
    x: left + (chartWidth * index) / denominator,
    y: top + chartHeight - (item.revenue / maxValue) * chartHeight,
    value: item.revenue,
    label: item.label,
  }));

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      {loading ? (
        <div className="h-[320px] rounded-2xl bg-gray-50 animate-pulse" />
      ) : (
        <>
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            {yTicks.map((tick, index) => {
              const y = top + chartHeight - (tick / maxValue) * chartHeight;
              return (
                <g key={`tick-${index}-${tick}`}>
                  <line x1={left} y1={y} x2={width - right} y2={y} stroke="#d9dbe4" strokeDasharray="4 4" />
                  <text x={left - 8} y={y + 4} textAnchor="end" fontSize="12" fill="#8b93a7">
                    {Math.round(tick)}
                  </text>
                </g>
              );
            })}

            {data.map((item, index) => {
              const x = left + (chartWidth * index) / denominator;
              return (
                <g key={item.key}>
                  <line x1={x} y1={top} x2={x} y2={top + chartHeight} stroke="#e9ebf2" strokeDasharray="4 4" />
                  <text x={x} y={height - 8} textAnchor="middle" fontSize="12" fill="#8b93a7">
                    {item.label}
                  </text>
                </g>
              );
            })}

            <line x1={left} y1={top} x2={left} y2={top + chartHeight} stroke="#9aa3b2" />
            <line x1={left} y1={top + chartHeight} x2={width - right} y2={top + chartHeight} stroke="#9aa3b2" />

            <path d={buildLinePath(revenuePoints)} fill="none" stroke="#8095f0" strokeWidth="2.5" />
            <path d={buildLinePath(salesPoints)} fill="none" stroke="#2f62cf" strokeWidth="2.5" />

            {revenuePoints.map((point, index) => (
              <circle key={`revenue-${data[index]?.key || index}`} cx={point.x} cy={point.y} r="4.5" fill="#8095f0" />
            ))}
            {salesPoints.map((point, index) => (
              <circle key={`sales-${data[index]?.key || index}`} cx={point.x} cy={point.y} r="4.5" fill="#2f62cf" />
            ))}
          </svg>

          <div className="flex items-center justify-center gap-6 pt-2 text-sm">
            <div className="flex items-center gap-2 text-blue-700">
              <span className="w-6 h-0.5 bg-[#2f62cf]" />
              <span>sales</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-400">
              <span className="w-6 h-0.5 bg-[#8095f0]" />
              <span>revenue</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PropertiesPieChart({ data, loading }) {
  const size = 280;
  const cx = 140;
  const cy = 140;
  const radius = 88;
  const total = data.reduce((sum, item) => sum + item.count, 0);
  let currentAngle = 0;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      {loading ? (
        <div className="h-[320px] rounded-2xl bg-gray-50 animate-pulse" />
      ) : total > 0 ? (
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto overflow-visible">
          {data.slice(0, 4).map((item, index) => {
            const angle = (item.count / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;
            const lineStart = polarToCartesian(cx, cy, radius, startAngle + angle / 2);
            const lineEnd = polarToCartesian(cx, cy, radius + 20, startAngle + angle / 2);
            const labelAnchor = lineEnd.x >= cx ? "start" : "end";
            const labelOffset = lineEnd.x >= cx ? 6 : -6;

            return (
              <g key={`${item.type}-${index}`}>
                <path d={describeArc(cx, cy, radius, startAngle, endAngle)} fill={PROPERTY_CHART_COLORS[index % PROPERTY_CHART_COLORS.length]} />
                <line x1={lineStart.x} y1={lineStart.y} x2={lineEnd.x} y2={lineEnd.y} stroke={PROPERTY_CHART_COLORS[index % PROPERTY_CHART_COLORS.length]} strokeWidth="1.5" />
                <text
                  x={lineEnd.x + labelOffset}
                  y={lineEnd.y + 4}
                  textAnchor={labelAnchor}
                  fontSize="12"
                  fill={PROPERTY_CHART_COLORS[index % PROPERTY_CHART_COLORS.length]}
                >
                  {`${item.type} (${item.count})`}
                </text>
              </g>
            );
          })}
        </svg>
      ) : (
        <div className="h-[320px] rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-400">
          Chưa có dữ liệu loại bất động sản.
        </div>
      )}
    </div>
  );
}

function SectionCard({ title, subtitle, action, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function StatCard({ label, value, icon, color, loading, to, hint }) {
  const content = (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 group ${to ? "cursor-pointer hover:-translate-y-0.5" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>{icon}</div>
        {to && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
      <p className="text-3xl font-extrabold text-gray-900 mb-1">
        {loading ? <span className="inline-block w-12 h-7 bg-gray-200 rounded animate-pulse" /> : value}
      </p>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      {hint && <p className="text-xs text-gray-400 mt-2">{hint}</p>}
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

export default function Dashboard() {
  const { user } = useAuth();
  const roleName = getNormalizedRole(user);
  const isAdmin = roleName === "ADMIN";
  const isManager = roleName === "MANAGER";
  const isAdminOrManager = isAdmin || isManager;

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [recentRequests, setRecentRequests] = useState([]);
  const [salesSummary, setSalesSummary] = useState({
    totalPotentialRevenue: 0,
    totalFloorArea: 0,
    averageRentPrice: 0,
    totalTransactions: 0,
    completedLeads: 0,
    pendingLeads: 0,
    contactedLeads: 0,
    cancelledLeads: 0,
    conversionRate: 0,
  });
  const [propertyTypeStats, setPropertyTypeStats] = useState([]);
  const [weeklyTransactions, setWeeklyTransactions] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [salesRevenueSeries, setSalesRevenueSeries] = useState([]);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const results = {};

      if (isAdmin) {
        const [buildings, customers, consultReqs, users] = await Promise.all([
          safeRequest(() => buildingService.getAllBuildings(), []),
          safeRequest(() => customerService.getAllCustomers(), []),
          safeRequest(() => consultService.getAllConsultRequests(), []),
          safeRequest(() => userService.getAllUsers(), []),
        ]);
        const safeBuildings = buildings || [];
        const safeCustomers = customers || [];
        const safeConsultRequests = consultReqs || [];
        results.buildings = safeBuildings.length;
        results.customers = safeCustomers.length;
        results.consult = safeConsultRequests.length;
        results.pendingConsult = safeConsultRequests.filter((item) => item.status === "PENDING").length;
        results.users = users?.length ?? 0;
        setRecentRequests(safeConsultRequests.slice(0, 5));

        const transactionResults = await Promise.allSettled(
          safeCustomers.map((customer) => customerService.getCustomerTransactions(customer.id))
        );
        const allTransactions = transactionResults.flatMap((result) =>
          result.status === "fulfilled" ? result.value || [] : []
        );
        const summary = buildSalesSummary(safeBuildings, safeConsultRequests, allTransactions);
        setSalesSummary(summary);
        setPropertyTypeStats(buildPropertyTypeStats(safeBuildings));
        setWeeklyTransactions(buildWeeklyTransactions(allTransactions));
        setFeaturedProperties(buildFeaturedProperties(safeBuildings));
        setSalesRevenueSeries(buildMonthlySalesRevenue(safeConsultRequests, allTransactions, summary.averageRentPrice));
      } else if (isManager) {
        const [buildings, myCustomers, consultReqs] = await Promise.all([
          safeRequest(() => buildingService.getAllBuildings(), null),
          safeRequest(() => customerService.getMyCustomers(), []),
          safeRequest(() => consultService.getAllConsultRequests(), []),
        ]);
        const safeBuildings = buildings || await safeRequest(() => buildingService.getPublicBuildings(), []);
        const safeCustomers = myCustomers || [];
        const safeConsultRequests = consultReqs || [];
        results.buildings = safeBuildings.length;
        results.customers = safeCustomers.length;
        results.consult = safeConsultRequests.length;
        results.pendingConsult = safeConsultRequests.filter((item) => item.status === "PENDING").length;
        setRecentRequests(safeConsultRequests.slice(0, 5));

        const transactionResults = await Promise.allSettled(
          safeCustomers.map((customer) => customerService.getCustomerTransactions(customer.id))
        );
        const allTransactions = transactionResults.flatMap((result) =>
          result.status === "fulfilled" ? result.value || [] : []
        );
        const summary = buildSalesSummary(safeBuildings, safeConsultRequests, allTransactions);
        setSalesSummary(summary);
        setPropertyTypeStats(buildPropertyTypeStats(safeBuildings));
        setWeeklyTransactions(buildWeeklyTransactions(allTransactions));
        setFeaturedProperties(buildFeaturedProperties(safeBuildings));
        setSalesRevenueSeries(buildMonthlySalesRevenue(safeConsultRequests, allTransactions, summary.averageRentPrice));
      } else {
        const myCustomers = await customerService.getMyCustomers().catch(() => []);
        results.myCustomers = myCustomers?.length ?? 0;
        const publicBuildings = await consultService.getPublicBuildings().catch(() => []);
        results.buildings = publicBuildings?.length ?? 0;
        setSalesSummary({
          totalPotentialRevenue: 0,
          totalFloorArea: 0,
          averageRentPrice: 0,
          totalTransactions: 0,
          completedLeads: 0,
          pendingLeads: 0,
          contactedLeads: 0,
          cancelledLeads: 0,
          conversionRate: 0,
        });
        setPropertyTypeStats([]);
        setWeeklyTransactions([]);
        setFeaturedProperties([]);
        setRecentRequests([]);
        setSalesRevenueSeries([]);
      }

      setStats(results);
    } catch {
      setStats({});
      setSalesSummary({
        totalPotentialRevenue: 0,
        totalFloorArea: 0,
        averageRentPrice: 0,
        totalTransactions: 0,
        completedLeads: 0,
        pendingLeads: 0,
        contactedLeads: 0,
        cancelledLeads: 0,
        conversionRate: 0,
      });
      setPropertyTypeStats([]);
      setWeeklyTransactions([]);
      setFeaturedProperties([]);
      setRecentRequests([]);
      setSalesRevenueSeries([]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isManager]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const roleLabel = { ADMIN: "Quản trị viên", MANAGER: "Quản lý", STAFF: "Nhân viên" }[roleName] || roleName;
  const roleColor = { ADMIN: "bg-red-100 text-red-700", MANAGER: "bg-purple-100 text-purple-700", STAFF: "bg-blue-100 text-blue-700" }[roleName] || "bg-gray-100 text-gray-700";
  const peakTransactionCount = useMemo(
    () => Math.max(...weeklyTransactions.map((item) => item.count), 1),
    [weeklyTransactions]
  );
  const consultStages = [
    { label: "Pending", value: salesSummary.pendingLeads, color: "bg-yellow-500" },
    { label: "Contacted", value: salesSummary.contactedLeads, color: "bg-blue-500" },
    { label: "Completed", value: salesSummary.completedLeads, color: "bg-green-500" },
    { label: "Cancelled", value: salesSummary.cancelledLeads, color: "bg-red-500" },
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -right-2 -bottom-10 w-28 h-28 bg-white/5 rounded-full" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl font-bold">
              {getDisplayName(user).charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Xin chào, {getDisplayName(user)}!</h1>
              <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleColor}`}>{roleLabel}</span>
            </div>
          </div>
          <p className="text-blue-100 text-sm">Chào mừng bạn đến với hệ thống quản lý bất động sản</p>
        </div>
      </div>

      {isAdminOrManager ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Tổng tòa nhà"
              value={formatCompact(stats.buildings)}
              loading={loading}
              to="/buildings"
              color="bg-blue-100"
              hint="Toàn bộ danh mục bất động sản"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth={2} className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />
            <StatCard
              label={isAdmin ? "Tổng khách hàng" : "Khách hàng phụ trách"}
              value={formatCompact(stats.customers)}
              loading={loading}
              to="/customers"
              color="bg-green-100"
              hint={isAdmin ? "Lead và khách hàng đang theo dõi" : "Danh sách khách hàng do bạn quản lý"}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2} className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <StatCard
              label={
                <span className="flex items-center gap-1.5">
                  Yêu cầu tư vấn
                  {stats.pendingConsult > 0 && (
                    <span className="px-1.5 py-0.5 bg-yellow-500 text-white text-xs rounded-full font-bold leading-none">{stats.pendingConsult}</span>
                  )}
                </span>
              }
              value={formatCompact(stats.consult)}
              loading={loading}
              to="/consult-requests"
              color="bg-yellow-100"
              hint="Nguồn lead từ website và landing page"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth={2} className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              }
            />
            {isAdmin ? (
              <StatCard
                label="Người dùng"
                value={formatCompact(stats.users)}
                loading={loading}
                to="/users"
                color="bg-purple-100"
                hint="Tài khoản nội bộ trong hệ thống"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth={2} className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
                  </svg>
                }
              />
            ) : (
              <StatCard
                label="Yêu cầu chờ xử lý"
                value={formatCompact(stats.pendingConsult)}
                loading={loading}
                to="/consult-requests"
                color="bg-orange-100"
                hint="Ưu tiên xử lý sớm trong tuần này"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth={2} className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
            <SectionCard
              title="Sales & Revenue"
              subtitle="Bức tranh doanh thu tiềm năng và hiệu quả chuyển đổi lead"
              className="xl:col-span-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Doanh thu tiềm năng</p>
                  <p className="text-2xl font-bold text-slate-900">{loading ? "..." : formatCurrency(salesSummary.totalPotentialRevenue)}</p>
                  <p className="text-xs text-slate-400 mt-2">Tính từ giá thuê x diện tích sàn</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Giá thuê trung bình</p>
                  <p className="text-2xl font-bold text-slate-900">{loading ? "..." : formatCurrency(salesSummary.averageRentPrice)}</p>
                  <p className="text-xs text-slate-400 mt-2">USD / m2 trên toàn danh mục</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Diện tích khai thác</p>
                  <p className="text-2xl font-bold text-slate-900">{loading ? "..." : `${formatCompact(salesSummary.totalFloorArea)} m2`}</p>
                  <p className="text-xs text-slate-400 mt-2">Tổng diện tích có trong hệ thống</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Tỷ lệ chuyển đổi</p>
                  <p className="text-2xl font-bold text-slate-900">{loading ? "..." : `${salesSummary.conversionRate}%`}</p>
                  <p className="text-xs text-slate-400 mt-2">Lead hoàn tất / tổng yêu cầu tư vấn</p>
                </div>
              </div>

              <SalesRevenueChart data={salesRevenueSeries} loading={loading} />
            </SectionCard>

            <SectionCard
              title="Properties by Type"
              subtitle="Phân bổ sản phẩm theo loại bất động sản"
              className="xl:col-span-2"
            >
              <PropertiesPieChart data={propertyTypeStats} loading={loading} />
            </SectionCard>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
            <SectionCard
              title="Weekly Transactions"
              subtitle="Số giao dịch phát sinh trong 7 ngày gần nhất"
              className="xl:col-span-3"
            >
              {loading ? (
                <div className="h-56 bg-gray-50 rounded-2xl animate-pulse" />
              ) : weeklyTransactions.length > 0 ? (
                <div className="flex items-end justify-between gap-3 h-56">
                  {weeklyTransactions.map((day) => (
                    <div key={day.key} className="flex-1 flex flex-col justify-end items-center gap-3 h-full">
                      <span className="text-xs font-semibold text-gray-500">{day.count}</span>
                      <div className="w-full max-w-12 rounded-t-2xl bg-gradient-to-t from-blue-600 to-cyan-400 transition-all" style={{ height: `${Math.max((day.count / peakTransactionCount) * 100, 8)}%` }} />
                      <span className="text-xs text-gray-400 uppercase">{day.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-56 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-400">
                  Chưa có giao dịch nào trong 7 ngày gần đây.
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Featured Properties"
              subtitle="Các bất động sản nổi bật theo giá trị khai thác"
              action={
                <Link to="/buildings" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Xem tất cả
                </Link>
              }
              className="xl:col-span-2"
            >
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-24 rounded-2xl bg-gray-50 animate-pulse" />
                  ))
                ) : featuredProperties.length > 0 ? (
                  featuredProperties.map((property) => {
                    const image = property?.image || property?.imageUrl;
                    return (
                      <div key={property.id} className="flex gap-4 rounded-2xl border border-gray-100 p-3 hover:border-blue-200 transition-colors">
                        {image ? (
                          <img src={image} alt={property.name} className="w-24 h-24 rounded-2xl object-cover bg-gray-100" />
                        ) : (
                          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                            {(property?.name || "P").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 truncate">{property.name}</p>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{[property.street, property.ward].filter(Boolean).join(", ") || "Chưa có địa chỉ"}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">{property.type || "Khác"}</span>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                              {property.rentPrice ? `${formatCurrency(property.rentPrice)} / m2` : "Chưa có giá"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-400">Chưa có bất động sản nổi bật để hiển thị.</p>
                )}
              </div>
            </SectionCard>
          </div>

          {recentRequests.length > 0 && (
            <SectionCard
              title="Yêu cầu tư vấn gần đây"
              subtitle="Những lead mới nhất cần được theo dõi"
              action={
                <Link to="/consult-requests" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  Xem tất cả
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              }
              className="mb-8"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      {["Khách hàng", "SĐT", "Tòa nhà", "Trạng thái", "Ngày gửi"].map(h => (
                        <th key={h} className="pb-3 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentRequests.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 pr-4 font-medium text-gray-900">{r.customerName}</td>
                        <td className="py-3 pr-4 text-gray-500">{r.customerPhone}</td>
                        <td className="py-3 pr-4 text-gray-500 truncate max-w-xs">{r.buildingName}</td>
                        <td className="py-3 pr-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[r.status] || "bg-gray-100 text-gray-600"}`}>
                            {STATUS_LABELS[r.status] || r.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-400 text-xs">
                          {r.createdDate ? new Date(r.createdDate).toLocaleDateString("vi-VN") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <StatCard
            label="Khách hàng của tôi"
            value={formatCompact(stats.myCustomers)}
            loading={loading}
            to="/customers"
            color="bg-green-100"
            hint="Danh sách khách hàng đang phụ trách"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2} className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <StatCard
            label="Tòa nhà đang cho thuê"
            value={formatCompact(stats.buildings)}
            loading={loading}
            to="/buildings"
            color="bg-blue-100"
            hint="Lấy từ danh sách bất động sản công khai"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth={2} className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">Thông tin tài khoản</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Tên đăng nhập", value: user?.username },
            { label: "Họ và tên", value: getFullName(user) },
            { label: "Vai trò", value: roleLabel },
          ].map((f) => (
            <div key={f.label} className="border-l-4 border-blue-500 pl-4 py-1">
              <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
              <p className="font-semibold text-gray-900 text-sm">{f.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
