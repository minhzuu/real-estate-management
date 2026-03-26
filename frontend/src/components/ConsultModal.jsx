import { useState } from "react";
import { Icons } from "./icons";
import consultService from "../services/consultService";

export default function ConsultModal({ building, onClose }) {
  const [form, setForm] = useState({ customerName: "", customerPhone: "", customerEmail: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await consultService.submitConsultRequest(building.id, form);
      setSuccess(true);
    } catch {
      setError("Gửi yêu cầu thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 p-6 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:rotate-90 duration-300">
            {Icons.close}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center animate-float">
              {Icons.building}
            </div>
            <div>
              <p className="text-white/80 text-xs font-medium">Yêu cầu tư vấn tại</p>
              <h3 className="font-bold text-lg leading-tight">{building.name}</h3>
            </div>
          </div>
        </div>
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 animate-scale-in">
                {Icons.check}
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Gửi thành công!</h4>
              <p className="text-gray-500 text-sm mb-6">Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
              <button onClick={onClose} className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all">
                Đóng
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "Họ và tên", key: "customerName", ph: "Nguyễn Văn A", req: true },
                { label: "Số điện thoại", key: "customerPhone", ph: "0901 234 567", req: true },
                { label: "Email", key: "customerEmail", ph: "email@example.com", type: "email", opt: true },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {f.label} {f.req && <span className="text-red-400">*</span>}
                    {f.opt && <span className="text-gray-400 font-normal text-xs">(tùy chọn)</span>}
                  </label>
                  <input
                    required={f.req}
                    type={f.type || "text"}
                    value={form[f.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.ph}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all hover:border-gray-300"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lời nhắn</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Tôi muốn thuê văn phòng tầng 3..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none resize-none transition-all hover:border-gray-300"
                />
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 text-white rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-primary-200 disabled:opacity-60 transition-all duration-300 hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang gửi...
                  </span>
                ) : (
                  "Gửi yêu cầu tư vấn"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
