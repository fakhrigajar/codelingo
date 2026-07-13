import { Routes, Route } from 'react-router-dom'
import { ContentProvider, useContent } from './context/ContentContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

import ScrollToTop from './components/common/ScrollToTop'
import Layout from './components/layout/Layout'
import RequireAuth from './routes/RequireAuth'
import RequireAdmin from './routes/RequireAdmin'

import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import PathsPage from './pages/PathsPage'
import PathDetailPage from './pages/PathDetailPage'
import CommunityPage from './pages/CommunityPage'
import ToolsPage from './pages/tools/ToolsPage'
import CvAnalyzerPage from './pages/tools/CvAnalyzerPage'
import InterviewPrepPage from './pages/tools/InterviewPrepPage'
import ProjectIdeasPage from './pages/tools/ProjectIdeasPage'
import LearningPathPage from './pages/tools/LearningPathPage'
import DailyChallengePage from './pages/tools/DailyChallengePage'
import AccountPage from './pages/AccountPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

import AdminLayout from './components/admin/AdminLayout'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminPathsPage from './pages/AdminPathsPage'
import AdminCoursesPage from './pages/AdminCoursesPage'
import AdminBadgesPage from './pages/AdminBadgesPage'
import AdminRoomsPage from './pages/AdminRoomsPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminDataPage from './pages/AdminDataPage'

// Courses and paths now load from the server on mount (see ContentContext),
// so routes wait for that first fetch instead of briefly rendering with
// empty lists.
function AppRoutes() {
  const { ready } = useContent()
  if (!ready) return null

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/paths" element={<PathsPage />} />
          <Route path="/paths/:pathId" element={<PathDetailPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route
            path="/tools/cv-analyzer"
            element={
              <RequireAuth>
                <CvAnalyzerPage />
              </RequireAuth>
            }
          />
          <Route
            path="/tools/interview-prep"
            element={
              <RequireAuth>
                <InterviewPrepPage />
              </RequireAuth>
            }
          />
          <Route
            path="/tools/project-ideas"
            element={
              <RequireAuth>
                <ProjectIdeasPage />
              </RequireAuth>
            }
          />
          <Route
            path="/tools/learning-path"
            element={
              <RequireAuth>
                <LearningPathPage />
              </RequireAuth>
            }
          />
          <Route
            path="/tools/daily-challenge"
            element={
              <RequireAuth>
                <DailyChallengePage />
              </RequireAuth>
            }
          />
          <Route path="/account" element={<AccountPage />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <SettingsPage />
              </RequireAuth>
            }
          />
        </Route>

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="paths" element={<AdminPathsPage />} />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="badges" element={<AdminBadgesPage />} />
          <Route path="rooms" element={<AdminRoomsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="data" element={<AdminDataPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <ContentProvider>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </ContentProvider>
  )
}
