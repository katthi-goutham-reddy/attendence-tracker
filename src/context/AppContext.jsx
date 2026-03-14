import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { generateSessions, calculateAttendanceStats, predictAttendance, generateId } from '../utils/helpers';

const AppContext = createContext(null);

const STORAGE_KEY = 'attendance-tracker-data';

function loadFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

function saveToStorage(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // Storage full or unavailable
    }
}

const defaultState = {
    semester: { startDate: '', endDate: '' },
    subjects: [],
    timetable: [],
    holidays: [],
    attendance: {}, // { sessionId: 'present' | 'absent' }
};

export function AppProvider({ children }) {
    const [state, setState] = useState(() => {
        const saved = loadFromStorage();
        return saved || defaultState;
    });

    // Save to localStorage whenever state changes
    useEffect(() => {
        saveToStorage(state);
    }, [state]);

    // Generate sessions from timetable
    const sessions = useMemo(() => {
        if (!state.semester.startDate || !state.semester.endDate) return [];
        return generateSessions(
            state.semester.startDate,
            state.semester.endDate,
            state.timetable,
            state.holidays
        ).map(session => ({
            ...session,
            status: state.attendance[session.id] || null,
        }));
    }, [state.semester, state.timetable, state.holidays, state.attendance]);

    // Calculate stats
    const stats = useMemo(() => {
        return calculateAttendanceStats(sessions, state.subjects);
    }, [sessions, state.subjects]);

    // Calculate predictions
    const predictions = useMemo(() => {
        return predictAttendance(stats);
    }, [stats]);

    // Overall stats
    const overallStats = useMemo(() => {
        const allMarked = sessions.filter(s => s.status !== null);
        const allPresent = sessions.filter(s => s.status === 'present');
        const totalSessions = sessions.length;
        const percentage = allMarked.length > 0 ? (allPresent.length / allMarked.length) * 100 : 0;

        return {
            totalSubjects: state.subjects.length,
            totalSessions,
            totalPresent: allPresent.length,
            totalAbsent: allMarked.length - allPresent.length,
            totalMarked: allMarked.length,
            percentage,
        };
    }, [sessions, state.subjects]);

    // Actions
    const setSemester = (semester) => {
        setState(prev => ({ ...prev, semester }));
    };

    const addSubject = (name) => {
        const subject = { id: generateId(), name, createdAt: new Date().toISOString() };
        setState(prev => ({ ...prev, subjects: [...prev.subjects, subject] }));
        return subject;
    };

    const removeSubject = (id) => {
        setState(prev => ({
            ...prev,
            subjects: prev.subjects.filter(s => s.id !== id),
            timetable: prev.timetable.filter(t => t.subjectId !== id),
        }));
    };

    const addTimetableEntry = (subjectId, weekday) => {
        const subject = state.subjects.find(s => s.id === subjectId);
        if (!subject) return;

        // Prevent duplicate
        const exists = state.timetable.some(t => t.subjectId === subjectId && t.weekday === weekday);
        if (exists) return;

        const entry = {
            id: generateId(),
            subjectId,
            subjectName: subject.name,
            weekday,
        };
        setState(prev => ({ ...prev, timetable: [...prev.timetable, entry] }));
    };

    const removeTimetableEntry = (id) => {
        setState(prev => ({
            ...prev,
            timetable: prev.timetable.filter(t => t.id !== id),
        }));
    };

    const addHoliday = (name, date) => {
        const holiday = { id: generateId(), name, date };
        setState(prev => ({ ...prev, holidays: [...prev.holidays, holiday] }));
    };

    const removeHoliday = (id) => {
        setState(prev => ({
            ...prev,
            holidays: prev.holidays.filter(h => h.id !== id),
        }));
    };

    const markAttendance = (sessionId, status) => {
        setState(prev => ({
            ...prev,
            attendance: { ...prev.attendance, [sessionId]: status },
        }));
    };

    const resetAll = () => {
        setState(defaultState);
        localStorage.removeItem(STORAGE_KEY);
    };

    const value = {
        ...state,
        sessions,
        stats,
        predictions,
        overallStats,
        setSemester,
        addSubject,
        removeSubject,
        addTimetableEntry,
        removeTimetableEntry,
        addHoliday,
        removeHoliday,
        markAttendance,
        resetAll,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
