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
    LogOut,
    User
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
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
    const { profile, signOut } = useAuth();

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
                    <div className="sidebar-user-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0 0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <User size={18} />
                        <span style={{ fontWeight: 600 }}>{profile?.username || 'Student'}</span>
                    </div>
                    <button
                        onClick={signOut}
                        className="btn"
                        style={{ width: '100%', display: 'flex', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-400)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
