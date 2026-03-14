import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import SemesterConfig from './pages/SemesterConfig';
import Subjects from './pages/Subjects';
import Timetable from './pages/Timetable';
import Holidays from './pages/Holidays';
import Attendance from './pages/Attendance';
import Predictions from './pages/Predictions';
import Landing from './pages/Landing';
import { AppProvider, useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import './App.css';

function AuthenticatedApp() {
  const { loading } = useApp();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
        <p>Loading your data...</p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/semester" element={<SemesterConfig />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/holidays" element={<Holidays />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <AppProvider>
      <AuthenticatedApp />
    </AppProvider>
  );
}

export default App;
