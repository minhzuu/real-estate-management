import { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import buildingService from "../services/buildingService";
import userService from "../services/userService";
import { useAuth } from "../context/AuthContext";

const EMPTY_FORM = {
  name: "",
  street: "",
  ward: "",
  districtId: "",
  structure: "",
  numberOfBasement: "",
  floorArea: "",
  rentPrice: "",
  rentPriceDescription: "",
  serviceFee: "",
  carFee: "",
  motorbikeFee: "",
  electricityFee: "",
  waterFee: "",
  deposit: "",
  payment: "",
  rentTime: "",
  decorationTime: "",
  brokerageFee: "",
  type: "",
  note: "",
  linkOfBuilding: "",
  image: "",
};

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
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

function BuildingForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    ["numberOfBasement", "floorArea", "rentPrice", "districtId"].forEach((k) => {
      if (payload[k] !== "") payload[k] = Number(payload[k]);
    });
    onSubmit(payload);
  };

  const field = (label, name, type = "text", options = null) => (
    <div key={name}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {options ? (
        <select name={name} value={form[name]} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
          <option value="">-- Chọn --</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} name={name} value={form[name]} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {field("Tên tòa nhà *", "name")}
        {field("Loại hình", "type", "text", ["Văn phòng", "Căn hộ", "Thương mại", "Kho xưởng"])}
        {field("Đường", "street")}
        {field("Phường/Xã", "ward")}
        {field("Quận (ID)", "districtId", "number")}
        {field("Kết cấu", "structure")}
        {field("Số tầng hầm", "numberOfBasement", "number")}
        {field("Diện tích sàn (m²)", "floorArea", "number")}
        {field("Giá thuê (USD/m²)", "rentPrice", "number")}
        {field("Mô tả giá thuê", "rentPriceDescription")}
        {field("Phí dịch vụ", "serviceFee")}
        {field("Phí ô tô", "carFee")}
        {field("Phí xe máy", "motorbikeFee")}
        {field("Phí điện", "electricityFee")}
        {field("Phí nước", "waterFee")}
        {field("Đặt cọc", "deposit")}
        {field("Hình thức thanh toán", "payment")}
        {field("Thời gian thuê", "rentTime")}
        {field("Thời gian hoàn thiện", "decorationTime")}
        {field("Phí môi giới", "brokerageFee")}
        {field("Link tòa nhà", "linkOfBuilding")}
        {field("Ảnh (URL)", "image")}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
        <textarea name="note" value={form.note} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
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

export default function Buildings() {
  const { user } = useAuth();
  const roleName = user?.roleName?.toUpperCase() || "";
  const isAdmin = roleName === "ADMIN";
  const canUseAdminBuildingApi = roleName === "ADMIN" || roleName === "MANAGER";

  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  const [savingForm, setSavingForm] = useState(false);

  // Assign staff modal
  const [assignTarget, setAssignTarget] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBuildings = useCallback(async () => {
    setLoading(true);
    try {
      const data = canUseAdminBuildingApi
        ? (search
            ? await buildingService.searchBuildings(search)
            : await buildingService.getAllBuildings())
        : (search
            ? await buildingService.searchPublicBuildings(search)
            : await buildingService.getPublicBuildings());
      setBuildings(data || []);
    } catch {
      showToast("Không thể tải danh sách tòa nhà", "error");
    } finally {
      setLoading(false);
    }
  }, [canUseAdminBuildingApi, search]);

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  const handleCreate = async (data) => {
    setSavingForm(true);
    try {
      await buildingService.createBuilding(data);
      showToast("Tạo tòa nhà thành công!");
      setShowCreate(false);
      fetchBuildings();
    } catch {
      showToast("Lỗi khi tạo tòa nhà", "error");
    } finally {
      setSavingForm(false);
    }
  };

  const handleUpdate = async (data) => {
    setSavingForm(true);
    try {
      await buildingService.updateBuilding(editTarget.id, data);
      showToast("Cập nhật tòa nhà thành công!");
      setEditTarget(null);
      fetchBuildings();
    } catch {
      showToast("Lỗi khi cập nhật", "error");
    } finally {
      setSavingForm(false);
    }
  };

  const handleDelete = async () => {
    try {
      await buildingService.deleteBuilding(deleteTarget.id);
      showToast("Đã xóa tòa nhà!");
      setDeleteTarget(null);
      fetchBuildings();
    } catch {
      showToast("Lỗi khi xóa tòa nhà", "error");
    }
  };

  const openAssign = async (building) => {
    setAssignTarget(building);
    try {
      const users = await userService.getAllUsers();
      setAllUsers(users || []);
    } catch {
      setAllUsers([]);
    }
  };

  const handleAssignStaff = async () => {
    try {
      await buildingService.assignStaffToBuilding(assignTarget.id, selectedStaffIds);
      showToast("Gán nhân viên thành công!");
      setAssignTarget(null);
      setSelectedStaffIds([]);
    } catch {
      showToast("Lỗi khi gán nhân viên", "error");
    }
  };

  return (
    <Layout>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-lg text-white font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Tòa nhà</h1>
          <p className="text-gray-500 text-sm mt-1">{buildings.length} tòa nhà</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Thêm tòa nhà
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm theo tên tòa nhà..."
          className="w-full max-w-md pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : buildings.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-14 h-14 mx-auto mb-3 text-gray-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
            </svg>
            <p>Không có tòa nhà nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Tên tòa nhà", "Địa chỉ", "Loại hình", "Giá thuê", "Diện tích", "Thao tác"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {buildings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">{b.name}</td>
                    <td className="px-5 py-4 text-gray-500">{[b.street, b.ward].filter(Boolean).join(", ")}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{b.type || "—"}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-700">{b.rentPrice ? `${b.rentPrice.toLocaleString()} USD/m²` : "—"}</td>
                    <td className="px-5 py-4 text-gray-700">{b.floorArea ? `${b.floorArea} m²` : "—"}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setDetailTarget(b)} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100" title="Chi tiết">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {isAdmin && (
                          <>
                            <button onClick={() => setEditTarget(b)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50" title="Sửa">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button onClick={() => openAssign(b)} className="p-1.5 rounded-lg text-green-500 hover:bg-green-50" title="Gán nhân viên">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                              </svg>
                            </button>
                            <button onClick={() => setDeleteTarget(b)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50" title="Xóa">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
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
        <Modal title="Thêm tòa nhà mới" onClose={() => setShowCreate(false)}>
          <BuildingForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} loading={savingForm} />
        </Modal>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <Modal title="Chỉnh sửa tòa nhà" onClose={() => setEditTarget(null)}>
          <BuildingForm initial={editTarget} onSubmit={handleUpdate} onCancel={() => setEditTarget(null)} loading={savingForm} />
        </Modal>
      )}

      {/* Detail Modal */}
      {detailTarget && (
        <Modal title={detailTarget.name} onClose={() => setDetailTarget(null)}>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              ["Địa chỉ", [detailTarget.street, detailTarget.ward].filter(Boolean).join(", ")],
              ["Loại hình", detailTarget.type],
              ["Kết cấu", detailTarget.structure],
              ["Số tầng hầm", detailTarget.numberOfBasement],
              ["Diện tích sàn", detailTarget.floorArea ? `${detailTarget.floorArea} m²` : null],
              ["Giá thuê", detailTarget.rentPrice ? `${detailTarget.rentPrice} USD/m²` : null],
              ["Mô tả giá", detailTarget.rentPriceDescription],
              ["Phí dịch vụ", detailTarget.serviceFee],
              ["Phí điện", detailTarget.electricityFee],
              ["Phí nước", detailTarget.waterFee],
              ["Đặt cọc", detailTarget.deposit],
              ["Thanh toán", detailTarget.payment],
              ["Thời gian thuê", detailTarget.rentTime],
              ["Phí môi giới", detailTarget.brokerageFee],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="font-medium text-gray-900">{val || "—"}</p>
              </div>
            ))}
          </div>
          {detailTarget.note && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Ghi chú</p>
              <p className="text-sm text-gray-700">{detailTarget.note}</p>
            </div>
          )}
        </Modal>
      )}

      {/* Assign Staff Modal */}
      {assignTarget && (
        <Modal title={`Gán nhân viên — ${assignTarget.name}`} onClose={() => setAssignTarget(null)}>
          <p className="text-sm text-gray-500 mb-4">Chọn nhân viên để gán cho tòa nhà này:</p>
          <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
            {allUsers.filter(u => u?.roleName !== "Admin").map((u) => (
              <label key={u.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  value={u.id}
                  checked={selectedStaffIds.includes(u.id)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedStaffIds((ids) => [...ids, u.id]);
                    else setSelectedStaffIds((ids) => ids.filter((x) => x !== u.id));
                  }}
                  className="w-4 h-4 accent-blue-600"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{u.fullname || u.username}</p>
                  <p className="text-xs text-gray-400">{u.roleName} — {u.username}</p>
                </div>
              </label>
            ))}
            {allUsers.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Không có nhân viên</p>}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setAssignTarget(null)} className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">Hủy</button>
            <button onClick={handleAssignStaff} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium">Lưu</button>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmModal
          message={`Bạn có chắc chắn muốn xóa tòa nhà "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </Layout>
  );
}
