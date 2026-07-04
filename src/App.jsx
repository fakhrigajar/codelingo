import { Routes, Route } from 'react-router-dom'
import { ContentProvider } from './context/ContentContext'
import { AuthProvider } from './context/AuthContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { ToastProvider } from './context/ToastContext'

import Layout from './components/layout/Layout'
import RequireAuth from './routes/RequireAuth'
import RequireAdmin from './routes/RequireAdmin'

import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import GradesPage from './pages/GradesPage'
import CommunityPage from './pages/CommunityPage'
import AccountPage from './pages/AccountPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

import AdminLoginPage from './pages/AdminLoginPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminGradesPage from './pages/AdminGradesPage'
import AdminCoursesPage from './pages/AdminCoursesPage'
import AdminBadgesPage from './pages/AdminBadgesPage'
import AdminRoomsPage from './pages/AdminRoomsPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminDataPage from './pages/AdminDataPage'

export default function App() {
  return (
    <ContentProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <ToastProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:courseId" element={<CourseDetailPage />} />
                <Route path="/grades" element={<GradesPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route
                  path="/profile"
                  element={
                    <RequireAuth>
                      <ProfilePage />
                    </RequireAuth>
                  }
                />
              </Route>

              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="grades" element={<AdminGradesPage />} />
                <Route path="courses" element={<AdminCoursesPage />} />
                <Route path="badges" element={<AdminBadgesPage />} />
                <Route path="rooms" element={<AdminRoomsPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="data" element={<AdminDataPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ToastProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </ContentProvider>
  )
}
