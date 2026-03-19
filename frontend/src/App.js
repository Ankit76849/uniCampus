import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import { AcademicsPage, AttendancePage, TimetablePage } from './pages/AcademicsPages';
import { ResultsPage, ExamSchedulePage, LibraryPage } from './pages/AcademicModules';
import { HostelPage, DuesPage, CanteenPage, FeedbackPage } from './pages/StudentModules';
import {
  EventsPage, ResourcesPage, VaultPage, InboxPage,
  NotificationsPage, HolidaysPage, PracticeSchoolPage,
  ExamRegistrationPage, AntiRaggingPage
} from './pages/OtherModules';

const ProtectedRoute = ({ children }) => {
  const { student, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
  return student ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="academics" element={<AcademicsPage />} />
              <Route path="timetable" element={<TimetablePage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="exam-schedule" element={<ExamSchedulePage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="library" element={<LibraryPage />} />
              <Route path="hostel" element={<HostelPage />} />
              <Route path="dues" element={<DuesPage />} />
              <Route path="canteen" element={<CanteenPage />} />
              <Route path="feedback" element={<FeedbackPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="resources" element={<ResourcesPage />} />
              <Route path="vault" element={<VaultPage />} />
              <Route path="inbox" element={<InboxPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="holidays" element={<HolidaysPage />} />
              <Route path="practice-school" element={<PracticeSchoolPage />} />
              <Route path="exam-registration" element={<ExamRegistrationPage />} />
              <Route path="anti-ragging" element={<AntiRaggingPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
