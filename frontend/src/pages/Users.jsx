import { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import userService from "../services/userService";

const ROLES = ["Admin", "Manager", "Staff"];

const EMPTY_FORM = {
  username: "",
  password: "",
  fullName: "",
  roleName: "Staff",
  status: 1,
};

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
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

const ROLE_COLORS = {
  Admin: "bg-red-100 text-red-700",
  Manager: "bg-purple-100 text-purple-700",
  Staff: "bg-blue-100 text-blue-700",
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [pwTarget, setPwTarget] = useState(null);
  const [savingForm, setSavingForm] = useState(false);

  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [editForm, setEditForm] = useState({});
  const [pwForm, setPwForm] = useState({ username: "", oldPassword: "", newPassword: "" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data || []);
    } catch {
      showToast("Không thể tải danh sách người dùng", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSavingForm(true);
    try {
      await userService.createUser(createForm);
      showToast("Tạo người dùng thành công!");
      setShowCreate(false);
      setCreateForm(EMPTY_FORM);
      fetchUsers();
    } catch {
      showToast("Lỗi khi tạo người dùng", "error");
    } finally {
      setSavingForm(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSavingForm(true);
    try {
      await userService.updateUser(editTarget.id, editForm);
      showToast("Cập nhật thành công!");
      setEditTarget(null);
      fetchUsers();
    } catch {
      showToast("Lỗi khi cập nhật", "error");
    } finally {
      setSavingForm(false);
    }
  };

  const handleDelete = async () => {
    try {
      await userService.deleteUser(deleteTarget.id);
      showToast("Đã xóa người dùng!");
      setDeleteTarget(null);
      fetchUsers();
    } catch {
      showToast("Lỗi khi xóa", "error");
    }
  };

  const handleChangePw = async (e) => {
    e.preventDefault();
    setSavingForm(true);
    try {
      await userService.changePassword(pwForm);
      showToast("Đổi mật khẩu thành công!");
      setPwTarget(null);
      setPwForm({ username: "", oldPassword: "", newPassword: "" });
    } catch {
      showToast("Lỗi khi đổi mật khẩu", "error");
    } finally {
      setSavingForm(false);
    }
  };

  const openEdit = (u) => {
    setEditTarget(u);
    setEditForm({ fullName: u.fullname || "", roleName: u.roleName || "Staff", status: u.status ?? 1 });
  };

  const openChangePw = (u) => {
    setPwTarget(u);
    setPwForm({ username: u.username, oldPassword: "", newPassword: "" });
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <Layout>
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-lg text-white font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} người dùng</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Thêm người dùng
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-400 py-16">Không có người dùng nào</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Avatar", "Tên đăng nhập", "Họ và tên", "Vai trò", "Trạng thái", "Thao tác"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {u.username?.charAt(0).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-900">{u.username}</td>
                    <td className="px-5 py-4 text-gray-700">{u.fullname || "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[u.roleName] || "bg-gray-100 text-gray-700"}`}>
                        {u.roleName || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.status === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {u.status === 1 ? "Hoạt động" : "Vô hiệu"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50" title="Sửa">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => openChangePw(u)} className="p-1.5 rounded-lg text-orange-500 hover:bg-orange-50" title="Đổi mật khẩu">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteTarget(u)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50" title="Xóa">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreate && (
        <Modal title="Thêm người dùng" onClose={() => { setShowCreate(false); setCreateForm(EMPTY_FORM); }}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập *</label>
              <input value={createForm.username} onChange={(e) => setCreateForm(f => ({ ...f, username: e.target.value }))} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
              <input type="password" value={createForm.password} onChange={(e) => setCreateForm(f => ({ ...f, password: e.target.value }))} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input value={createForm.fullName} onChange={(e) => setCreateForm(f => ({ ...f, fullName: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
              <select value={createForm.roleName} onChange={(e) => setCreateForm(f => ({ ...f, roleName: e.target.value }))} className={inputCls}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Hủy</button>
              <button type="submit" disabled={savingForm} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 font-medium">{savingForm ? "Đang lưu..." : "Tạo"}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit User Modal */}
      {editTarget && (
        <Modal title={`Sửa người dùng — ${editTarget.username}`} onClose={() => setEditTarget(null)}>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input value={editForm.fullName} onChange={(e) => setEditForm(f => ({ ...f, fullName: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
              <select value={editForm.roleName} onChange={(e) => setEditForm(f => ({ ...f, roleName: e.target.value }))} className={inputCls}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select value={editForm.status} onChange={(e) => setEditForm(f => ({ ...f, status: Number(e.target.value) }))} className={inputCls}>
                <option value={1}>Hoạt động</option>
                <option value={0}>Vô hiệu</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setEditTarget(null)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Hủy</button>
              <button type="submit" disabled={savingForm} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 font-medium">{savingForm ? "Đang lưu..." : "Lưu"}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Change Password Modal */}
      {pwTarget && (
        <Modal title={`Đổi mật khẩu — ${pwTarget.username}`} onClose={() => setPwTarget(null)}>
          <form onSubmit={handleChangePw} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu cũ *</label>
              <input type="password" value={pwForm.oldPassword} onChange={(e) => setPwForm(f => ({ ...f, oldPassword: e.target.value }))} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới *</label>
              <input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm(f => ({ ...f, newPassword: e.target.value }))} required className={inputCls} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setPwTarget(null)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Hủy</button>
              <button type="submit" disabled={savingForm} className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-60 font-medium">{savingForm ? "Đang lưu..." : "Đổi mật khẩu"}</button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Xóa người dùng "${deleteTarget.username}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </Layout>
  );
}
