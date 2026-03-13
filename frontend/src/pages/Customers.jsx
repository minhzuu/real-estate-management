import { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import customerService from "../services/customerService";
import userService from "../services/userService";
import transactionService from "../services/transactionService";
import { useAuth } from "../context/AuthContext";

const EMPTY_FORM = {
  fullname: "",
  phone: "",
  email: "",
  companyName: "",
  demand: "",
};

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
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

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-gray-700 font-medium mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">Hủy</button>
          <button onClick={onConfirm} className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium">Xóa</button>
        </div>
      </div>
    </div>
  );
}

function CustomerForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
          <input name="fullname" value={form.fullname} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Công ty</label>
          <input name="companyName" value={form.companyName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nhu cầu</label>
        <textarea name="demand" value={form.demand} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Hủy</button>
        <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60">
          {loading ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </form>
  );
}

export default function Customers() {
  const { user } = useAuth();
  const isAdmin = user?.roleName?.toUpperCase() === "ADMIN";
  const isAdminOrManager = ["ADMIN", "MANAGER"].includes(user?.roleName?.toUpperCase());

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState(isAdmin ? "all" : "mine"); // all | mine | unassigned
  const [toast, setToast] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);

  const [assignTarget, setAssignTarget] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [savingForm, setSavingForm] = useState(false);

  // Transaction creation
  const [showTxForm, setShowTxForm] = useState(false);
  const [txTypes, setTxTypes] = useState([]);
  const [txForm, setTxForm] = useState({ transactionTypeId: "", note: "" });
  const [savingTx, setSavingTx] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (search) {
        data = await customerService.searchCustomers(search);
      } else if (viewMode === "mine") {
        data = await customerService.getMyCustomers();
      } else if (viewMode === "unassigned") {
        data = await customerService.getUnassignedCustomers();
      } else {
        data = await customerService.getAllCustomers();
      }
      setCustomers(data || []);
    } catch {
      showToast("Không thể tải danh sách", "error");
    } finally {
      setLoading(false);
    }
  }, [search, viewMode]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const openDetail = async (c) => {
    setDetailTarget(c);
    setTxLoading(true);
    setShowTxForm(false);
    setTxForm({ transactionTypeId: "", note: "" });
    try {
      const [tx, types] = await Promise.all([
        customerService.getCustomerTransactions(c.id),
        transactionService.getTransactionTypes().catch(() => []),
      ]);
      setTransactions(tx || []);
      setTxTypes(types || []);
    } catch {
      setTransactions([]);
    } finally {
      setTxLoading(false);
    }
  };

  const openAssign = async (c) => {
    setAssignTarget(c);
    setSelectedStaffIds([]);
    try {
      const users = await userService.getAllUsers();
      setAllUsers((users || []).filter(u => u?.roleName?.toUpperCase() !== "ADMIN"));
    } catch {
      setAllUsers([]);
    }
  };

  const handleCreate = async (data) => {
    setSavingForm(true);
    try {
      await customerService.createCustomer(data);
      showToast("Tạo khách hàng thành công!");
      setShowCreate(false);
      fetchCustomers();
    } catch {
      showToast("Lỗi khi tạo khách hàng", "error");
    } finally {
      setSavingForm(false);
    }
  };

  const handleUpdate = async (data) => {
    setSavingForm(true);
    try {
      await customerService.updateCustomer(editTarget.id, data);
      showToast("Cập nhật thành công!");
      setEditTarget(null);
      fetchCustomers();
    } catch {
      showToast("Lỗi khi cập nhật", "error");
    } finally {
      setSavingForm(false);
    }
  };

  const handleDelete = async () => {
    try {
      await customerService.deleteCustomer(deleteTarget.id);
      showToast("Đã xóa khách hàng!");
      setDeleteTarget(null);
      fetchCustomers();
    } catch {
      showToast("Lỗi khi xóa", "error");
    }
  };

  const handleAssign = async () => {
    try {
      await customerService.assignStaff(assignTarget.id, selectedStaffIds);
      showToast("Gán nhân viên thành công!");
      setAssignTarget(null);
    } catch {
      showToast("Lỗi khi gán nhân viên", "error");
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!txForm.transactionTypeId) return;
    setSavingTx(true);
    try {
      await transactionService.createTransaction({
        customerId: detailTarget.id,
        transactionTypeId: Number(txForm.transactionTypeId),
        note: txForm.note,
      });
      showToast("Thêm giao dịch thành công!");
      setShowTxForm(false);
      setTxForm({ transactionTypeId: "", note: "" });
      // Refresh transactions
      const tx = await customerService.getCustomerTransactions(detailTarget.id);
      setTransactions(tx || []);
    } catch {
      showToast("Lỗi khi thêm giao dịch", "error");
    } finally {
      setSavingTx(false);
    }
  };

  return (
    <Layout>
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-lg text-white font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Khách hàng</h1>
          <p className="text-gray-500 text-sm mt-1">{customers.length} khách hàng</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Thêm KH
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm tên, email, công ty..." className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white w-64" />
        </div>
        {!search && (
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {(isAdmin ? ["all", "mine", "unassigned"] : ["mine"]).map((mode) => {
              const labels = { all: "Tất cả", mine: "Của tôi", unassigned: "Chưa gán" };
              return (
                <button key={mode} onClick={() => setViewMode(mode)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === mode ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                  {labels[mode]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : customers.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-14 h-14 mx-auto mb-3 text-gray-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p>Không có khách hàng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Họ và tên", "SĐT", "Email", "Công ty", "Nhu cầu", "Thao tác"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">{c.fullname}</td>
                    <td className="px-5 py-4 text-gray-500">{c.phone || "—"}</td>
                    <td className="px-5 py-4 text-gray-500">{c.email || "—"}</td>
                    <td className="px-5 py-4 text-gray-500">{c.companyName || "—"}</td>
                    <td className="px-5 py-4 text-gray-500 max-w-xs truncate">{c.demand || "—"}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openDetail(c)} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100" title="Xem giao dịch">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                        <button onClick={() => setEditTarget(c)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50" title="Sửa">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {isAdminOrManager && (
                          <button onClick={() => openAssign(c)} className="p-1.5 rounded-lg text-green-500 hover:bg-green-50" title="Gán nhân viên">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                          </button>
                        )}
                        {isAdmin && (
                          <button onClick={() => setDeleteTarget(c)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50" title="Xóa">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <Modal title="Thêm khách hàng" onClose={() => setShowCreate(false)}>
          <CustomerForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} loading={savingForm} />
        </Modal>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <Modal title="Chỉnh sửa khách hàng" onClose={() => setEditTarget(null)}>
          <CustomerForm initial={editTarget} onSubmit={handleUpdate} onCancel={() => setEditTarget(null)} loading={savingForm} />
        </Modal>
      )}

      {/* Detail / Transactions Modal */}
      {detailTarget && (
        <Modal title={`Giao dịch — ${detailTarget.fullname}`} onClose={() => { setDetailTarget(null); setTransactions([]); setShowTxForm(false); }}>
          <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
            {[["SĐT", detailTarget.phone], ["Email", detailTarget.email], ["Công ty", detailTarget.companyName], ["Nhu cầu", detailTarget.demand]].map(([l, v]) => (
              <div key={l}>
                <p className="text-xs text-gray-400">{l}</p>
                <p className="font-medium text-gray-800">{v || "—"}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">Lịch sử giao dịch</h3>
            <button
              onClick={() => setShowTxForm((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Thêm giao dịch
            </button>
          </div>

          {showTxForm && (
            <form onSubmit={handleAddTransaction} className="bg-blue-50 rounded-xl p-4 mb-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Loại giao dịch *</label>
                <select
                  value={txForm.transactionTypeId}
                  onChange={(e) => setTxForm(f => ({ ...f, transactionTypeId: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">-- Chọn loại --</option>
                  {txTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  value={txForm.note}
                  onChange={(e) => setTxForm(f => ({ ...f, note: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowTxForm(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50">Hủy</button>
                <button type="submit" disabled={savingTx} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60">{savingTx ? "Đang lưu..." : "Lưu"}</button>
              </div>
            </form>
          )}

          {txLoading ? (
            <div className="flex justify-center py-6">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Chưa có giao dịch nào</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-3 border border-gray-100 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{tx.transactionType?.name || "Giao dịch"}</span>
                    <span className="text-xs text-gray-400">{tx.createdDate ? new Date(tx.createdDate).toLocaleDateString("vi-VN") : ""}</span>
                  </div>
                  <p className="text-sm text-gray-700">{tx.note || "Không có ghi chú"}</p>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {/* Assign Staff Modal */}
      {assignTarget && (
        <Modal title={`Gán nhân viên — ${assignTarget.fullname}`} onClose={() => setAssignTarget(null)}>
          <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
            {allUsers.map((u) => (
              <label key={u.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" checked={selectedStaffIds.includes(u.id)} onChange={(e) => {
                  if (e.target.checked) setSelectedStaffIds((ids) => [...ids, u.id]);
                  else setSelectedStaffIds((ids) => ids.filter((x) => x !== u.id));
                }} className="w-4 h-4 accent-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{u.fullname || u.username}</p>
                  <p className="text-xs text-gray-400">{u.roleName}</p>
                </div>
              </label>
            ))}
            {allUsers.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Không có nhân viên</p>}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setAssignTarget(null)} className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">Hủy</button>
            <button onClick={handleAssign} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium">Lưu</button>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Xóa khách hàng "${deleteTarget.fullname}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </Layout>
  );
}
