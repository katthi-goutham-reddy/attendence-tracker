import { useApp } from '../context/AppContext';
import {
    BookOpen,
    ClipboardCheck,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    CalendarDays,
} from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
    const { subjects, overallStats, stats, predictions, sessions, semester } = useApp();

    const hasData = subjects.length > 0 && semester.startDate && semester.endDate;
    const statsArray = Object.values(stats);
    const predsArray = Object.values(predictions);

    return (
        <div className="dashboard animate-fadeIn">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <span className="gradient-text">Dashboard</span>
                    </h1>
                    <p className="page-subtitle">Your attendance overview at a glance</p>
                </div>
            </div>

            {!hasData ? (
                <div className="dashboard-empty glass-card">
                    <div className="dashboard-empty-icon">
                        <CalendarDays size={48} />
                    </div>
                    <h2>Welcome to AttendX! 🎓</h2>
                    <p>
                        Set up your semester dates, add subjects, and configure your timetable
                        to start tracking attendance.
                    </p>
                    <div className="dashboard-empty-steps">
                        <div className="empty-step">
                            <span className="empty-step-num">1</span>
                            <span>Configure Semester</span>
                        </div>
                        <div className="empty-step">
                            <span className="empty-step-num">2</span>
                            <span>Add Subjects</span>
                        </div>
                        <div className="empty-step">
                            <span className="empty-step-num">3</span>
                            <span>Set Timetable</span>
                        </div>
                        <div className="empty-step">
                            <span className="empty-step-num">4</span>
                            <span>Track Attendance</span>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Stat Cards */}
                    <div className="stat-cards stagger-children">
                        <div className="stat-card glass-card">
                            <div className="stat-card-header">
                                <div className="stat-card-icon stat-card-icon--primary">
                                    <BookOpen size={20} />
                                </div>
                                <span className="stat-card-label">Total Subjects</span>
                            </div>
                            <div className="stat-card-value">{overallStats.totalSubjects}</div>
                            <div className="stat-card-sub">Active this semester</div>
                        </div>

                        <div className="stat-card glass-card">
                            <div className="stat-card-header">
                                <div className="stat-card-icon stat-card-icon--accent">
                                    <ClipboardCheck size={20} />
                                </div>
                                <span className="stat-card-label">Classes Attended</span>
                            </div>
                            <div className="stat-card-value">
                                {overallStats.totalPresent}
                                <span className="stat-card-value-sub">/ {overallStats.totalMarked}</span>
                            </div>
                            <div className="stat-card-sub">
                                {overallStats.totalSessions - overallStats.totalMarked} remaining
                            </div>
                        </div>

                        <div className="stat-card glass-card">
                            <div className="stat-card-header">
                                <div className={`stat-card-icon ${overallStats.percentage >= 75
                                        ? 'stat-card-icon--success'
                                        : overallStats.percentage >= 70
                                            ? 'stat-card-icon--warning'
                                            : 'stat-card-icon--danger'
                                    }`}>
                                    <TrendingUp size={20} />
                                </div>
                                <span className="stat-card-label">Overall Attendance</span>
                            </div>
                            <div className="stat-card-value">
                                {overallStats.percentage.toFixed(1)}%
                            </div>
                            <div className="stat-card-sub">
                                {overallStats.percentage >= 75 ? (
                                    <span className="stat-trend stat-trend--up">
                                        <ArrowUpRight size={14} /> Above threshold
                                    </span>
                                ) : (
                                    <span className="stat-trend stat-trend--down">
                                        <ArrowDownRight size={14} /> Below 75%
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="stat-card glass-card">
                            <div className="stat-card-header">
                                <div className="stat-card-icon stat-card-icon--warning">
                                    <BarChart3 size={20} />
                                </div>
                                <span className="stat-card-label">Total Sessions</span>
                            </div>
                            <div className="stat-card-value">{overallStats.totalSessions}</div>
                            <div className="stat-card-sub">Generated from timetable</div>
                        </div>
                    </div>

                    {/* Subject Cards */}
                    <div className="dashboard-section">
                        <h2 className="section-title">Subject-wise Attendance</h2>
                        <div className="subject-grid stagger-children">
                            {statsArray.map(stat => {
                                const pred = predictions[stat.subjectId];
                                return (
                                    <div key={stat.subjectId} className="subject-card glass-card">
                                        <div className="subject-card-header">
                                            <h3 className="subject-card-name">{stat.subjectName}</h3>
                                            <span
                                                className={`badge ${stat.status === 'safe'
                                                        ? 'badge-success'
                                                        : stat.status === 'warning'
                                                            ? 'badge-warning'
                                                            : 'badge-danger'
                                                    }`}
                                            >
                                                {stat.status === 'safe'
                                                    ? 'Safe'
                                                    : stat.status === 'warning'
                                                        ? 'Warning'
                                                        : 'Danger'}
                                            </span>
                                        </div>

                                        {/* Progress ring */}
                                        <div className="subject-card-progress">
                                            <svg className="progress-ring" viewBox="0 0 120 120">
                                                <circle
                                                    className="progress-ring-bg"
                                                    cx="60"
                                                    cy="60"
                                                    r="52"
                                                    fill="none"
                                                    stroke="rgba(255,255,255,0.05)"
                                                    strokeWidth="8"
                                                />
                                                <circle
                                                    className={`progress-ring-fill progress-ring-fill--${stat.status}`}
                                                    cx="60"
                                                    cy="60"
                                                    r="52"
                                                    fill="none"
                                                    strokeWidth="8"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${(stat.percentage / 100) * 326.7} 326.7`}
                                                    transform="rotate(-90 60 60)"
                                                />
                                                <text
                                                    x="60"
                                                    y="55"
                                                    textAnchor="middle"
                                                    className="progress-ring-text"
                                                >
                                                    {stat.marked > 0 ? stat.percentage.toFixed(0) : '—'}
                                                </text>
                                                <text
                                                    x="60"
                                                    y="72"
                                                    textAnchor="middle"
                                                    className="progress-ring-label"
                                                >
                                                    {stat.marked > 0 ? '%' : 'N/A'}
                                                </text>
                                            </svg>
                                        </div>

                                        <div className="subject-card-stats">
                                            <div className="subject-stat">
                                                <CheckCircle2 size={14} className="text-success" />
                                                <span>Present: {stat.attended}</span>
                                            </div>
                                            <div className="subject-stat">
                                                <XCircle size={14} className="text-danger" />
                                                <span>Absent: {stat.absent}</span>
                                            </div>
                                            <div className="subject-stat">
                                                <BarChart3 size={14} className="text-muted" />
                                                <span>Total: {stat.total}</span>
                                            </div>
                                        </div>

                                        {pred && pred.remaining > 0 && (
                                            <div className="subject-card-prediction">
                                                {pred.canMiss > 0 ? (
                                                    <span className="prediction-safe">
                                                        <CheckCircle2 size={13} />
                                                        Can miss {pred.canMiss} more
                                                    </span>
                                                ) : pred.mustAttend > 0 ? (
                                                    <span className="prediction-danger">
                                                        <AlertTriangle size={13} />
                                                        Must attend {pred.mustAttend} more
                                                    </span>
                                                ) : null}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
