import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import ProtectedRoute from '@/routes/ProtectedRoute';
import Loader from '@/components/common/Loader';

import MainLayout from '@/layouts/MainLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Route-level code splitting: every page is loaded on demand instead of
// bundled into the initial payload, keeping first-load JS small.
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const PetCarePage = lazy(() => import('@/pages/PetCarePage'));
const PetDetailPage = lazy(() => import('@/pages/PetDetailPage'));
const MarketplacePage = lazy(() => import('@/pages/MarketplacePage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const OrdersPage = lazy(() => import('@/pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('@/pages/OrderDetailPage'));
const AIAssistantPage = lazy(() => import('@/pages/AIAssistantPage'));
const AdoptionPage = lazy(() => import('@/pages/AdoptionPage'));
const AdoptionDetailPage = lazy(() => import('@/pages/AdoptionDetailPage'));
const ListPetForAdoptionPage = lazy(() => import('@/pages/ListPetForAdoptionPage'));
const MyApplicationsPage = lazy(() => import('@/pages/MyApplicationsPage'));
const VetsPage = lazy(() => import('@/pages/VetsPage'));
const PetSittersPage = lazy(() => import('@/pages/PetSittersPage'));
const GroomingPage = lazy(() => import('@/pages/GroomingPage'));
const AppointmentsPage = lazy(() => import('@/pages/AppointmentsPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const SearchResultsPage = lazy(() => import('@/pages/SearchResultsPage'));
const MyQueuePage = lazy(() => import('@/pages/MyQueuePage'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const ProfessionalDetailPage = lazy(() => import('@/pages/ProfessionalDetailPage'));
const TemporaryAdoptionPage = lazy(() => import('@/pages/TemporaryAdoptionPage'));

const PageFallback = () => <Loader fullScreen />;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Public marketing + browsing routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/marketplace/:slug" element={<ProductDetailPage />} />
                <Route path="/adoption" element={<AdoptionPage />} />
                <Route path="/adoption/:id" element={<AdoptionDetailPage />} />
                <Route path="/pet-sitters" element={<PetSittersPage />} />
                <Route path="/grooming" element={<GroomingPage />} />
                <Route path="/vets" element={<VetsPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/professionals/:id" element={<ProfessionalDetailPage />} />
              </Route>

              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Route>

              {/* Authenticated dashboard routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/pet-care" element={<PetCarePage />} />
                  <Route path="/pet-care/:id" element={<PetDetailPage />} />
                  <Route path="/appointments" element={<AppointmentsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/orders/:id" element={<OrderDetailPage />} />
                  <Route path="/ai-assistant" element={<AIAssistantPage />} />
                  <Route path="/adoption/list-pet" element={<ListPetForAdoptionPage />} />
                  <Route path="/my-applications" element={<MyApplicationsPage />} />
                  <Route path="/temporary-adoption" element={<TemporaryAdoptionPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/my-queue" element={<MyQueuePage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                </Route>
              </Route>

              {/* Admin routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
