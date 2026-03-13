import { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import consultService from "../services/consultService";

const STATUS_CONFIG = {
  PENDING:   { label: "Chờ xử lý",  color: "bg-yellow-100 text-yellow-700" },
  CONTACTED: { label: "Đã liên hệ", color: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "Hoàn tất",   color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Đã hủy",     color: "bg-red-100 text-red-700" },
};

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}

export default function ConsultRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailTarget, setDetailTarget] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await consultService.getAllConsultRequests();
      setRequests(data || []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const updated = await consultService.updateConsultStatus(id, newStatus);
      // Optimistic update of local list
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: updated.status } : r));
      // Also update detail modal if open
      if (detailTarget?.id === id) setDetailTarget(prev => ({ ...prev, status: updated.status }));
      showToast("Cập nhật trạng thái thành công!");
    } catch {
      showToast("Lỗi khi cập nhật trạng thái", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      r.customerName?.toLowerCase().includes(q) ||
      r.customerPhone?.includes(q) ||
      r.buildingName?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = Object.fromEntries(
    Object.keys(STATUS_CONFIG).map(s => [s, requests.filter(r => r.status === s).length])
  );

  return (
    <Layout>
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-lg text-white font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.msg}
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yêu cầu Tư vấn</h1>
          <p className="text-gray-500 text-sm mt-1">{requests.length} yêu cầu từ khách</p>
        </div>
        <button onClick={fetchRequests} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
            className={`text-left p-4 rounded-xl border transition-all ${filterStatus === key ? "ring-2 ring-blue-500 border-blue-200" : "bg-white border-gray-100 hover:border-gray-200"} shadow-sm`}
          >
            <p className="text-2xl font-bold text-gray-900">{counts[key] || 0}</p>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm tên, SĐT, tòa nhà..."
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white w-64"
          />
        </div>
        {filterStatus !== "all" && (
          <button onClick={() => setFilterStatus("all")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium">
            <span>{STATUS_CONFIG[filterStatus]?.label}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-14 h-14 mx-auto mb-3 text-gray-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p>Chưa có yêu cầu tư vấn nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Khách hàng", "SĐT", "Tòa nhà quan tâm", "Trạng thái", "Ngày gửi", ""].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => {
                  const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.PENDING;
                  return (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{r.customerName}</p>
                          {r.customerEmail && <p className="text-xs text-gray-400">{r.customerEmail}</p>}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600 font-medium">{r.customerPhone}</td>
                      <td className="px-5 py-4 text-gray-600">{r.buildingName}</td>
                      <td className="px-5 py-4">
                      <select
                        value={r.status}
                        disabled={updatingId === r.id}
                        onChange={(e) => handleStatusChange(r.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-60 ${STATUS_CONFIG[r.status]?.color}`}
                      >
                        {Object.entries(STATUS_CONFIG).map(([k, cfg]) => (
                          <option key={k} value={k} className="bg-white text-gray-900">{cfg.label}</option>
                        ))}
                      </select>
                    </td>
                      <td className="px-5 py-4 text-gray-400 text-xs">
                        {r.createdDate ? new Date(r.createdDate).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setDetailTarget(r)}
                          className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailTarget && (
        <Modal title="Chi tiết yêu cầu tư vấn" onClose={() => setDetailTarget(null)}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">{detailTarget.customerName}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_CONFIG[detailTarget.status]?.color}`}>
                {STATUS_CONFIG[detailTarget.status]?.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                ["Số điện thoại", detailTarget.customerPhone],
                ["Email", detailTarget.customerEmail || "—"],
                ["Tòa nhà", detailTarget.buildingName],
                ["Ngày gửi", detailTarget.createdDate ? new Date(detailTarget.createdDate).toLocaleDateString("vi-VN") : "—"],
              ].map(([l, v]) => (
                <div key={l} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{l}</p>
                  <p className="font-semibold text-gray-900 text-sm">{v}</p>
                </div>
              ))}
            </div>

            {detailTarget.message && (
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs text-blue-500 font-medium mb-1">Lời nhắn từ khách</p>
                <p className="text-sm text-gray-700 leading-relaxed">{detailTarget.message}</p>
              </div>
            )}

            {/* Status change in modal */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Cập nhật trạng thái</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(STATUS_CONFIG).map(([k, cfg]) => (
                  <button
                    key={k}
                    disabled={detailTarget.status === k || updatingId === detailTarget.id}
                    onClick={() => handleStatusChange(detailTarget.id, k)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${detailTarget.status === k ? `${cfg.color} border-transparent ring-2 ring-offset-1 ring-blue-400` : `border-gray-200 text-gray-500 hover:${cfg.color}`} disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {updatingId === detailTarget.id && detailTarget.status !== k ? "..." : cfg.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-semibold mb-1">💡 Hướng dẫn xử lý:</p>
              <ol className="list-decimal ml-4 space-y-1 text-xs leading-relaxed">
                <li>Gọi điện liên hệ với khách hàng <strong>{detailTarget.customerName}</strong> (SĐT: {detailTarget.customerPhone})</li>
                <li>Tạo <strong>Khách hàng</strong> mới trong hệ thống tại trang Khách hàng</li>
                <li>Phân công nhân viên tư vấn tại mục "Gán nhân viên"</li>
              </ol>
            </div>

            <button onClick={() => setDetailTarget(null)} className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
              Đóng
            </button>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
