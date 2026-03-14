import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import SemesterConfig from './pages/SemesterConfig';
import Subjects from './pages/Subjects';
import Timetable from './pages/Timetable';
import Holidays from './pages/Holidays';
import Attendance from './pages/Attendance';
import Predictions from './pages/Predictions';
import './App.css';

function App() {
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
        </Routes>
      </main>
    </div>
  );
}

export default App;
