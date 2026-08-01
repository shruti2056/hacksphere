import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProfilePage } from './pages/ProfilePage';
import { HackathonListPage } from './pages/HackathonListPage';
import { HackathonDetailPage } from './pages/HackathonDetailPage';
import { TeamManagementPage } from './pages/TeamManagementPage';
import { SubmissionPage } from './pages/SubmissionPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { PublicGalleryPage } from './pages/PublicGalleryPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { ParticipantDashboard } from './pages/ParticipantDashboard';
import { JudgeDashboard } from './pages/JudgeDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/hackathons" element={<HackathonListPage />} />
              <Route path="/hackathons/:id" element={<HackathonDetailPage />} />
              <Route path="/hackathons/:id/leaderboard" element={<LeaderboardPage />} />
              <Route path="/gallery" element={<PublicGalleryPage />} />

              {/* Protected User Routes */}
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/hackathons/:id/team" element={<ProtectedRoute><TeamManagementPage /></ProtectedRoute>} />
              <Route path="/hackathons/:id/submit" element={<ProtectedRoute><SubmissionPage /></ProtectedRoute>} />

              {/* Role Dashboards */}
              <Route 
                path="/dashboard/admin" 
                element={
                  <ProtectedRoute allowedRoles={['Administrator']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/organizer" 
                element={
                  <ProtectedRoute allowedRoles={['Organizer', 'Administrator']}>
                    <OrganizerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/participant" 
                element={
                  <ProtectedRoute allowedRoles={['Participant', 'Administrator']}>
                    <ParticipantDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/judge" 
                element={
                  <ProtectedRoute allowedRoles={['Judge', 'Administrator']}>
                    <JudgeDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
