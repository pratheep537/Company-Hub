import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { AdminLayout } from './components/layout/AdminLayout';
import { MemberLayout } from './components/layout/MemberLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Auth Pages
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { MemberLoginPage } from './pages/auth/MemberLoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminTasksPage } from './pages/admin/AdminTasksPage';
import { AdminMembersPage } from './pages/admin/AdminMembersPage';
import { AdminPanelPage } from './pages/admin/AdminPanelPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

// Member Pages
import { MemberDashboard } from './pages/member/MemberDashboard';
import { MemberTasksPage } from './pages/member/MemberTasksPage';
import { MemberTeamPage } from './pages/member/MemberTeamPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/member/login" element={<MemberLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRole="ADMIN" />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="tasks" element={<AdminTasksPage />} />
              <Route path="members" element={<AdminMembersPage />} />
              <Route path="panel" element={<AdminPanelPage />} />
              <Route path="logs" element={<AdminAuditLogsPage />} />
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Route>

          {/* Member Routes */}
          <Route path="/member" element={<ProtectedRoute allowedRole="MEMBER" />}>
            <Route element={<MemberLayout />}>
              <Route path="dashboard" element={<MemberDashboard />} />
              <Route path="tasks" element={<MemberTasksPage />} />
              <Route path="team" element={<MemberTeamPage />} />
              <Route index element={<Navigate to="/member/dashboard" replace />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-surface border border-border text-t1',
          style: {
            background: '#16161F',
            color: '#F8F8FF',
            border: '1px solid #1E1E2E',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#16161F',
            },
          },
          error: {
            iconTheme: {
              primary: '#F43F5E',
              secondary: '#16161F',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
