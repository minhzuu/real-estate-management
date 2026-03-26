import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Buildings from "./pages/Buildings";
import Customers from "./pages/Customers";
import Users from "./pages/Users";
import ConsultRequests from "./pages/ConsultRequests";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BuildingDetail from "./pages/BuildingDetail";

function getNormalizedRole(user) {
  const rawRole = user?.roleName || user?.role?.name || "";
  return rawRole.replace(/^ROLE_/, "").toUpperCase();
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-500 font-medium text-sm">Đang tải...</p>
      </div>
    </div>
  );
}

// Requires authentication
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Admin or Manager only
function AdminManagerRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  const role = getNormalizedRole(user);
  if (role !== "ADMIN" && role !== "MANAGER") return <Navigate to="/dashboard" replace />;
  return children;
}

// Admin-only route
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (getNormalizedRole(user) !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return children;
}

// Redirect to dashboard if already logged in
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public pages — no auth required */}
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/property/:id" element={<BuildingDetail />} />

          {/* Auth */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected pages */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buildings"
            element={
              <ProtectedRoute>
                <Buildings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consult-requests"
            element={
              <AdminManagerRoute>
                <ConsultRequests />
              </AdminManagerRoute>
            }
          />
          <Route
            path="/users"
            element={
              <AdminRoute>
                <Users />
              </AdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
