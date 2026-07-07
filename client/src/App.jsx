import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ProductListingsPage from './pages/Products/ProductListingsPage';
import ProductDetailPage from './pages/Products/ProductDetailPage';
import CreateProductPage from './pages/Products/CreateProductPage';
import ServiceListingsPage from './pages/Services/ServiceListingsPage';
import ServiceDetailPage from './pages/Services/ServiceDetailPage';
import CreateServicePage from './pages/Services/CreateServicePage';
import NearbyMapPage from './pages/Map/NearbyMapPage';
import SearchResultsPage from './pages/Search/SearchResultsPage';
import AdminLoginPage from './pages/Admin/AdminLoginPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsersPage from './pages/Admin/AdminUsersPage';
import AdminListingsPage from './pages/Admin/AdminListingsPage';
import AdminReportsPage from './pages/Admin/AdminReportsPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorPage from './pages/ErrorPage';
import Loader from './components/common/Loader';
import UserDashboardPage from './pages/User/UserDashboardPage';
import UserMyListingsPage from './pages/User/UserMyListingsPage';
import UserBookingsPage from './pages/User/UserBookingsPage';
import UserFavoritesPage from './pages/User/UserFavoritesPage';
import UserMessagesPage from './pages/Messages/UserMessagesPage';
import UserNotificationsPage from './pages/Messages/UserNotificationsPage';
import NotificationsPage from './pages/Messages/NotificationsPage';
import ChatPage from './pages/Messages/ChatPage';
import UserProfilePage from './pages/User/UserProfilePage';
import UserSettingsPage from './pages/User/UserSettingsPage';
import UserEditProfilePage from './pages/User/UserEditProfilePage';
import UserPublicProfilePage from './pages/User/UserPublicProfilePage';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader text="Loading..." />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader text="Loading..." />;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader text="Loading..." />;
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<><Navbar /><LandingPage /><Footer /></>} />
      <Route path="/products" element={<><Navbar /><ProductListingsPage /><Footer /></>} />
      <Route path="/products/:id" element={<><Navbar /><ProductDetailPage /><Footer /></>} />
      <Route path="/services" element={<><Navbar /><ServiceListingsPage /><Footer /></>} />
      <Route path="/services/:id" element={<><Navbar /><ServiceDetailPage /><Footer /></>} />
      <Route path="/search" element={<><Navbar /><SearchResultsPage /><Footer /></>} />
      <Route path="/nearby" element={<><Navbar /><NearbyMapPage /><Footer /></>} />
      <Route path="/profile/:id" element={<><Navbar /><UserPublicProfilePage /><Footer /></>} />

      {/* Auth routes */}
      <Route path="/login" element={<PublicRoute><><Navbar /><LoginPage /><Footer /></></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><><Navbar /><RegisterPage /><Footer /></></PublicRoute>} />
      <Route path="/forgot-password" element={<><Navbar /><ForgotPasswordPage /><Footer /></>} />
      <Route path="/reset-password/:token" element={<><Navbar /><ForgotPasswordPage /><Footer /></>} />

      {/* User protected routes with sidebar layout */}
      <Route path="/dashboard" element={<ProtectedRoute>{<UserDashboardPage />}</ProtectedRoute>} />
      <Route path="/my-listings" element={<ProtectedRoute>{<UserMyListingsPage />}</ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute>{<UserBookingsPage />}</ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute>{<UserFavoritesPage />}</ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute>{<UserMessagesPage />}</ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><><Navbar /><ChatPage /><Footer /></></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute>{<UserNotificationsPage />}</ProtectedRoute>} />
      <Route path="/notifications/all" element={<ProtectedRoute><><Navbar /><NotificationsPage /><Footer /></></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute>{<UserProfilePage />}</ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute>{<UserSettingsPage />}</ProtectedRoute>} />
      <Route path="/edit-profile" element={<ProtectedRoute>{<UserEditProfilePage />}</ProtectedRoute>} />

      {/* Create product/service routes (still use Navbar/Footer) */}
      <Route path="/products/create" element={<ProtectedRoute><><Navbar /><CreateProductPage /><Footer /></></ProtectedRoute>} />
      <Route path="/products/:id/edit" element={<ProtectedRoute><><Navbar /><CreateProductPage /><Footer /></></ProtectedRoute>} />
      <Route path="/services/create" element={<ProtectedRoute><><Navbar /><CreateServicePage /><Footer /></></ProtectedRoute>} />
      <Route path="/services/:id/edit" element={<ProtectedRoute><><Navbar /><CreateServicePage /><Footer /></></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/system-access-portal" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="listings" element={<AdminListingsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
      </Route>

      {/* Error routes */}
      <Route path="/error" element={<><Navbar /><ErrorPage /><Footer /></>} />
      <Route path="*" element={<><Navbar /><NotFoundPage /><Footer /></>} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
          <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#fff', color: '#2E2E2E', borderRadius: '12px', border: '1px solid #E0E0E0', padding: '12px 16px', fontSize: '14px' }, success: { iconTheme: { primary: '#8CD211', secondary: '#1B4A54' } }, error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } } }} />
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
