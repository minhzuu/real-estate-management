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
    <div className="fixed inset-0 bg-dark-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white shadow-2xl w-full max-w-md overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-dark-800 p-6 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 transition-all duration-300">
            {Icons.close}
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border border-primary-400/30 flex items-center justify-center text-primary-400">
              {Icons.building}
            </div>
            <div>
              <p className="text-white/60 text-xs font-medium font-body">Yêu cầu tư vấn tại</p>
              <h3 className="font-semibold text-lg leading-tight font-heading">{building.name}</h3>
            </div>
          </div>
        </div>
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 animate-scale-in">
                {Icons.check}
              </div>
              <h4 className="text-xl font-semibold text-dark-800 mb-2 font-heading">Gửi thành công!</h4>
              <p className="text-dark-400 text-sm mb-6 font-body">Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
              <button onClick={onClose} className="px-8 py-3 bg-dark-800 text-white font-semibold hover:bg-dark-700 transition-all font-body">
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
                  <label className="block text-sm font-semibold text-dark-700 mb-1.5 font-body">
                    {f.label} {f.req && <span className="text-red-400">*</span>}
                    {f.opt && <span className="text-dark-400 font-normal text-xs">(tùy chọn)</span>}
                  </label>
                  <input
                    required={f.req}
                    type={f.type || "text"}
                    value={form[f.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.ph}
                    className="w-full border border-dark-200 px-4 py-3 text-sm focus:ring-1 focus:ring-primary-400/30 focus:border-primary-400 outline-none transition-all hover:border-dark-300 font-body"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-1.5 font-body">Lời nhắn</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Tôi muốn thuê văn phòng tầng 3..."
                  rows={3}
                  className="w-full border border-dark-200 px-4 py-3 text-sm focus:ring-1 focus:ring-primary-400/30 focus:border-primary-400 outline-none resize-none transition-all hover:border-dark-300 font-body"
                />
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 p-3 font-body">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-dark-800 text-white font-semibold text-sm hover:bg-primary-500 disabled:opacity-60 transition-all duration-300 font-body"
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
