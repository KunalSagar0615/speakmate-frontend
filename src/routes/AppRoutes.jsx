import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout, AuthLayout, UserLayout } from "../layouts/Layouts";
import LandingPage from "../pages/LandingPage";
import { ContactPage, PrivacyPolicyPage, TermsServicesPage } from "../pages/legal/LegalPages";
import { AdminConversationsPage, AdminDashboardPage, AdminSessionsPage, AdminUsersPage } from "../pages/admin/AdminPages";
import { ForgotPasswordPage, LoginPage, OtpVerifyPage, RegisterPage } from "../pages/auth/AuthPages";
import {
  ChatPracticePage,
  ProfilePage,
  ReportsPage,
  SessionDetailsPage,
  SessionsPage,
  SettingsPage,
  StartPracticePage,
  UserDashboardPage,
  VoicePracticePage,
} from "../pages/user/UserPages";
import { AdminRoute, ProtectedRoute } from "./RouteGuards";
import { CustomPracticeHome } from "../pages/custom-practice/CustomPracticeHome";
import { CustomPracticeReport } from "../pages/custom-practice/CustomPracticeReport";
import { CustomPracticeSession } from "../pages/custom-practice/CustomPracticeSession";
import { CustomPracticeSetup } from "../pages/custom-practice/CustomPracticeSetup";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-services" element={<TermsServicesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<OtpVerifyPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/practice" element={<StartPracticePage />} />
          <Route path="/practice/chat/:id" element={<ChatPracticePage />} />
          <Route path="/practice/voice/:id" element={<VoicePracticePage />} />
          <Route path="/custom-practice" element={<CustomPracticeHome />} />
          <Route path="/custom-practice/new" element={<CustomPracticeSetup />} />
          <Route path="/custom-practice/session/:sessionId" element={<CustomPracticeSession />} />
          <Route path="/custom-practice/report/:sessionId" element={<CustomPracticeReport />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/sessions/:id" element={<SessionDetailsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/sessions" element={<AdminSessionsPage />} />
          <Route path="/admin/conversations" element={<AdminConversationsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
