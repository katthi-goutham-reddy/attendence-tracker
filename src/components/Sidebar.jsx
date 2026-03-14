import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    CalendarClock,
    BookOpen,
    Calendar,
    ClipboardCheck,
    TrendingUp,
    GraduationCap,
    Menu,
    X,
} from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/semester', icon: CalendarClock, label: 'Semester' },
    { path: '/subjects', icon: BookOpen, label: 'Subjects' },
    { path: '/timetable', icon: Calendar, label: 'Timetable' },
    { path: '/holidays', icon: Calendar, label: 'Holidays' },
    { path: '/attendance', icon: ClipboardCheck, label: 'Attendance' },
    { path: '/predictions', icon: TrendingUp, label: 'Predictor' },
];

export default function Sidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    return (
        <>
            {/* Mobile toggle */}
            <button
                className="sidebar-mobile-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle navigation"
            >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Overlay */}
            {mobileOpen && (
                <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
            )}

            <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">
                        <GraduationCap size={28} />
                    </div>
                    <div className="sidebar-brand-text">
                        <span className="sidebar-brand-name gradient-text">AttendX</span>
                        <span className="sidebar-brand-sub">Attendance Tracker</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
                            }
                            onClick={() => setMobileOpen(false)}
                            end={item.path === '/'}
                        >
                            <item.icon size={20} className="sidebar-link-icon" />
                            <span className="sidebar-link-label">{item.label}</span>
                            {location.pathname === item.path && (
                                <div className="sidebar-link-indicator" />
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-footer-card">
                        <p className="sidebar-footer-text">Track smart, never miss a class 🎯</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
