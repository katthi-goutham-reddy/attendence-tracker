import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ClipboardCheck, Check, X, Filter, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import './Attendance.css';

export default function Attendance() {
    const { sessions, subjects, markAttendance } = useApp();
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');

    const filteredSessions = useMemo(() => {
        let result = [...sessions];

        if (subjectFilter !== 'all') {
            result = result.filter(s => s.subjectId === subjectFilter);
        }

        if (statusFilter === 'unmarked') {
            result = result.filter(s => s.status === null);
        } else if (statusFilter === 'present') {
            result = result.filter(s => s.status === 'present');
        } else if (statusFilter === 'absent') {
            result = result.filter(s => s.status === 'absent');
        }

        if (dateFilter) {
            result = result.filter(s => s.date === dateFilter);
        }

        return result;
    }, [sessions, subjectFilter, statusFilter, dateFilter]);

    // Group by date
    const groupedByDate = useMemo(() => {
        const grouped = {};
        for (const session of filteredSessions) {
            if (!grouped[session.date]) grouped[session.date] = [];
            grouped[session.date].push(session);
        }
        return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
    }, [filteredSessions]);

    const hasSetup = sessions.length > 0;

    return (
        <div className="attendance-page animate-fadeIn">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <span className="gradient-text">Attendance</span>
                    </h1>
                    <p className="page-subtitle">Mark your attendance for each class session</p>
                </div>
                <span className="badge badge-primary">{sessions.length} sessions</span>
            </div>

            {!hasSetup ? (
                <div className="form-card glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <ClipboardCheck size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <p className="form-card-desc">
                        Configure your semester, subjects, and timetable first to generate class sessions.
                    </p>
                </div>
            ) : (
                <>
                    {/* Filters */}
                    <div className="attendance-filters glass-card">
                        <div className="filter-group">
                            <Filter size={16} className="filter-icon" />
                            <select
                                className="filter-select"
                                value={subjectFilter}
                                onChange={e => setSubjectFilter(e.target.value)}
                            >
                                <option value="all">All Subjects</option>
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <select
                                className="filter-select"
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="unmarked">Unmarked</option>
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <Calendar size={16} className="filter-icon" />
                            <input
                                type="date"
                                className="filter-input"
                                value={dateFilter}
                                onChange={e => setDateFilter(e.target.value)}
                            />
                            {dateFilter && (
                                <button
                                    className="filter-clear"
                                    onClick={() => setDateFilter('')}
                                    title="Clear date filter"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sessions grouped by date */}
                    <div className="attendance-list">
                        {groupedByDate.length === 0 ? (
                            <div className="attendance-empty glass-card">
                                <p>No sessions match your filters.</p>
                            </div>
                        ) : (
                            groupedByDate.map(([date, dateSessions]) => (
                                <div key={date} className="attendance-date-group">
                                    <div className="attendance-date-header">
                                        <span className="attendance-date-label">
                                            {format(parseISO(date), 'EEEE, MMM d, yyyy')}
                                        </span>
                                        <span className="attendance-date-count">
                                            {dateSessions.length} class{dateSessions.length > 1 ? 'es' : ''}
                                        </span>
                                    </div>

                                    <div className="attendance-sessions">
                                        {dateSessions.map(session => (
                                            <div key={session.id} className="attendance-session glass-card">
                                                <div className="session-info">
                                                    <span className="session-subject">{session.subjectName}</span>
                                                    <span
                                                        className={`session-status ${session.status === 'present'
                                                                ? 'session-status--present'
                                                                : session.status === 'absent'
                                                                    ? 'session-status--absent'
                                                                    : 'session-status--unmarked'
                                                            }`}
                                                    >
                                                        {session.status === 'present'
                                                            ? 'Present'
                                                            : session.status === 'absent'
                                                                ? 'Absent'
                                                                : 'Unmarked'}
                                                    </span>
                                                </div>

                                                <div className="session-actions">
                                                    <button
                                                        className={`session-btn session-btn--present ${session.status === 'present' ? 'session-btn--active' : ''
                                                            }`}
                                                        onClick={() => markAttendance(session.id, 'present')}
                                                        title="Mark present"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        className={`session-btn session-btn--absent ${session.status === 'absent' ? 'session-btn--active' : ''
                                                            }`}
                                                        onClick={() => markAttendance(session.id, 'absent')}
                                                        title="Mark absent"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
