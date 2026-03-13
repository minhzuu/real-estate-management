import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function BrandIcon() {
  return (
    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-8 w-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 20V9h4v11" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 20V5h4v15" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V6h4" />
      </svg>
    </div>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7l8 6 8-6" />
      <rect x="3" y="5" width="18" height="14" rx="2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V8a4 4 0 118 0v3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20a8 8 0 0116 0" />
    </svg>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.6 10.6A2 2 0 0013.4 13.4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.9 5.2A10.7 10.7 0 0112 5c6.5 0 10 7 10 7a17.6 17.6 0 01-4 4.9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.2 6.2C3.8 7.8 2 12 2 12s3.5 7 10 7a9.8 9.8 0 004-.8" />
    </svg>
  );
}

function FormField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  rightIcon,
  onRightIconClick,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-800">{label}</label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-11 text-sm text-gray-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          required
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
          >
            {rightIcon}
          </button>
        )}
      </div>
    </div>
  );
}

function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });
  const [error, setError] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(username, password, rememberMe);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Tên đăng nhập hoặc mật khẩu không đúng");
    }

    setLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterMessage("");

    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!registerForm.acceptedTerms) {
      setRegisterMessage("Vui lòng đồng ý với điều khoản sử dụng.");
      return;
    }

    setRegisterMessage("Hệ thống hiện chưa hỗ trợ đăng ký tài khoản từ giao diện này.");
  };

  const handleGoogleClick = () => {
    if (activeTab === "login") {
      setError("Đăng nhập bằng Google hiện chưa được hỗ trợ.");
    } else {
      setRegisterMessage("Đăng ký bằng Google hiện chưa được hỗ trợ.");
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError("");
    setRegisterMessage("");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col items-center justify-center">
        <div className="mb-8 text-center">
          <BrandIcon />
          <h1 className="mt-5 text-5xl font-extrabold tracking-tight text-slate-950">RealEstate Pro</h1>
          <p className="mt-3 text-lg text-slate-500">Quản lý bất động sản chuyên nghiệp</p>
        </div>

        <div className="w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:p-7">
          <div className="mb-8 rounded-2xl bg-[#dce6fb] p-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => switchTab("login")}
                className={`h-11 rounded-xl text-sm font-semibold transition ${
                  activeTab === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-700"
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => switchTab("register")}
                className={`h-11 rounded-xl text-sm font-semibold transition ${
                  activeTab === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-700"
                }`}
              >
                Đăng ký
              </button>
            </div>
          </div>

          {activeTab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <FormField
                label="Tên đăng nhập"
                type="text"
                placeholder="Nhập username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={<UserIcon />}
              />

              <FormField
                label="Mật khẩu"
                type={showLoginPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<LockIcon />}
                rightIcon={<EyeIcon open={showLoginPassword} />}
                onRightIconClick={() => setShowLoginPassword((value) => !value)}
              />

              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 text-slate-500">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Nhớ mật khẩu
                </label>
                <button type="button" className="font-medium text-blue-600 hover:text-blue-700">
                  Quên mật khẩu?
                </button>
              </div>

              <button
                type="submit"
                className={`h-12 w-full rounded-xl bg-[#3867cb] text-base font-semibold text-white transition hover:bg-[#2e59b8] ${
                  loading ? "cursor-not-allowed opacity-70" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

              <div className="relative py-1 text-center">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-200" />
                <span className="relative bg-white px-3 text-sm text-slate-500">Hoặc</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleClick}
                className="h-12 w-full rounded-xl border border-gray-300 bg-white text-base font-medium text-slate-900 transition hover:bg-gray-50"
              >
                Đăng nhập bằng Google
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              {registerMessage && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  {registerMessage}
                </div>
              )}

              <FormField
                label="Họ và tên"
                placeholder="Nguyễn Văn A"
                value={registerForm.fullName}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, fullName: e.target.value }))}
                icon={<UserIcon />}
              />

              <FormField
                label="Tên đăng nhập"
                placeholder="nguyenvana"
                value={registerForm.username}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, username: e.target.value }))}
                icon={<UserIcon />}
              />

              <FormField
                label="Mật khẩu"
                type={showRegisterPassword ? "text" : "password"}
                placeholder="••••••••"
                value={registerForm.password}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                icon={<LockIcon />}
                rightIcon={<EyeIcon open={showRegisterPassword} />}
                onRightIconClick={() => setShowRegisterPassword((value) => !value)}
              />

              <FormField
                label="Xác nhận mật khẩu"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                icon={<LockIcon />}
                rightIcon={<EyeIcon open={showConfirmPassword} />}
                onRightIconClick={() => setShowConfirmPassword((value) => !value)}
              />

              <label className="flex items-center gap-2 text-sm text-slate-500">
                <input
                  type="checkbox"
                  checked={registerForm.acceptedTerms}
                  onChange={(e) =>
                    setRegisterForm((prev) => ({ ...prev, acceptedTerms: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Tôi đồng ý với <span className="text-blue-600">Điều khoản sử dụng</span>
              </label>

              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-[#3867cb] text-base font-semibold text-white transition hover:bg-[#2e59b8]"
              >
                Đăng ký
              </button>

              <div className="relative py-1 text-center">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-200" />
                <span className="relative bg-white px-3 text-sm text-slate-500">Hoặc</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleClick}
                className="h-12 w-full rounded-xl border border-gray-300 bg-white text-base font-medium text-slate-900 transition hover:bg-gray-50"
              >
                Đăng ký bằng Google
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
