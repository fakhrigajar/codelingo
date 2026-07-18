import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ContentProvider, useContent } from "./context/ContentContext";
import { AuthProvider } from "./context/AuthContext";
import { PublicUsersProvider } from "./context/PublicUsersContext";
import { ToastProvider } from "./context/ToastContext";

import ScrollToTop from "./components/common/ScrollToTop";
import VisitLogger from "./components/common/VisitLogger";
import Layout from "./components/layout/Layout";
import RequireAuth from "./routes/RequireAuth";
import RequireAdmin from "./routes/RequireAdmin";

// Route-level code splitting: each page (and whatever heavy deps it pulls in
// — pdfjs-dist/mammoth for the CV tool, mammoth/antd for Community, dnd-kit
// and the whole admin section, framer-motion for the daily challenge) only
// downloads when a user actually navigates there, instead of all loading
// upfront on every visit including the home page.
const HomePage = lazy(() => import("./pages/HomePage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const PathsPage = lazy(() => import("./pages/PathsPage"));
const PathDetailPage = lazy(() => import("./pages/PathDetailPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const ToolsPage = lazy(() => import("./pages/tools/ToolsPage"));
const CvAnalyzerPage = lazy(() => import("./pages/tools/CvAnalyzerPage"));
const InterviewPrepPage = lazy(() => import("./pages/tools/InterviewPrepPage"));
const ProjectIdeasPage = lazy(() => import("./pages/tools/ProjectIdeasPage"));
const LearningPathPage = lazy(() => import("./pages/tools/LearningPathPage"));
const DailyChallengePage = lazy(
  () => import("./pages/tools/DailyChallengePage"),
);
const AccountPage = lazy(() => import("./pages/AccountPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const AdminPathsPage = lazy(() => import("./pages/AdminPathsPage"));
const AdminCoursesPage = lazy(() => import("./pages/AdminCoursesPage"));
const AdminBadgesPage = lazy(() => import("./pages/AdminBadgesPage"));
const AdminPostsPage = lazy(() => import("./pages/AdminPostsPage"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));
const AdminVisitorsPage = lazy(() => import("./pages/AdminVisitorsPage"));
const AdminDataPage = lazy(() => import("./pages/AdminDataPage"));

function AppRoutes() {
  const { ready } = useContent();
  if (!ready) return null;

  return (
    <>
      <ScrollToTop />
      <VisitLogger />
      <Suspense fallback={null}>
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
            <Route path="posts" element={<AdminPostsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="visitors" element={<AdminVisitorsPage />} />
            <Route path="data" element={<AdminDataPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <AuthProvider>
        <PublicUsersProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </PublicUsersProvider>
      </AuthProvider>
    </ContentProvider>
  );
}
