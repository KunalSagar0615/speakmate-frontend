import { Navigate, Route, Routes } from "react-router-dom";

import { AdminLayout, AuthLayout, UserLayout } from "../layouts/Layouts";

import LandingPage from "../pages/LandingPage";

import {
  ContactPage,
  PrivacyPolicyPage,
  TermsServicesPage,
} from "../pages/legal/LegalPages";

import {
  AdminConversationsPage,
  AdminDashboardPage,
  AdminSessionsPage,
  AdminUsersPage,
} from "../pages/admin/AdminPages";

import {
  ForgotPasswordPage,
  LoginPage,
  OtpVerifyPage,
  RegisterPage,
} from "../pages/auth/AuthPages";

import {
  ChatPracticePage,
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

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route path="/" element={<LandingPage />} />

      <Route
        path="/privacy-policy"
        element={<PrivacyPolicyPage />}
      />

      <Route
        path="/terms-services"
        element={<TermsServicesPage />}
      />

      <Route
        path="/contact"
        element={<ContactPage />}
      />

      {/* =====================================================
          AUTH ROUTES
      ===================================================== */}

      <Route element={<AuthLayout />}>

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/verify-otp"
          element={<OtpVerifyPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

      </Route>

      {/* =====================================================
          USER ROUTES
      ===================================================== */}

      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<UserDashboardPage />}
          />

          {/* Standard Practice */}
          <Route
            path="/practice"
            element={<StartPracticePage />}
          />

          <Route
            path="/practice/chat/:id"
            element={<ChatPracticePage />}
          />

          <Route
            path="/practice/voice/:id"
            element={<VoicePracticePage />}
          />

          {/* Custom Practice */}
          <Route
            path="/custom-practice"
            element={<CustomPracticeHome />}
          />

          <Route
            path="/custom-practice/new"
            element={<CustomPracticeSetup />}
          />

          <Route
            path="/custom-practice/session/:sessionId"
            element={<CustomPracticeSession />}
          />

          <Route
            path="/custom-practice/report/:sessionId"
            element={<CustomPracticeReport />}
          />

          {/* Sessions */}
          <Route
            path="/sessions"
            element={<SessionsPage />}
          />

          <Route
            path="/sessions/:id"
            element={<SessionDetailsPage />}
          />

          {/* Reports */}
          <Route
            path="/reports"
            element={<ReportsPage />}
          />

          {/* Centralized Settings */}
          <Route
            path="/settings"
            element={<SettingsPage />}
          />

          {/* Old profile URL → Settings */}
          <Route
            path="/profile"
            element={<Navigate to="/settings" replace />}
          />

        </Route>
      </Route>

      {/* =====================================================
          ADMIN ROUTES
      ===================================================== */}

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>

          <Route
            path="/admin"
            element={<AdminDashboardPage />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsersPage />}
          />

          <Route
            path="/admin/sessions"
            element={<AdminSessionsPage />}
          />

          <Route
            path="/admin/conversations"
            element={<AdminConversationsPage />}
          />

        </Route>
      </Route>

      {/* =====================================================
          FALLBACK
      ===================================================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}