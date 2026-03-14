import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { generateSessions, calculateAttendanceStats, predictAttendance } from '../utils/helpers';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [semester, setSemesterState] = useState({ startDate: '', endDate: '', id: null });
    const [subjects, setSubjects] = useState([]);
    const [timetable, setTimetable] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    // ──────────────────── FETCH ALL DATA ON MOUNT ────────────────────
    useEffect(() => {
        fetchAllData();
    }, []);

    async function fetchAllData() {
        setLoading(true);
        try {
            const [semRes, subRes, ttRes, holRes, attRes] = await Promise.all([
                supabase.from('semester_config').select('*').limit(1).maybeSingle(),
                supabase.from('subjects').select('*').order('created_at'),
                supabase.from('timetable').select('*, subjects(name)').order('weekday'),
                supabase.from('holidays').select('*').order('holiday_date'),
                supabase.from('attendance').select('*').order('class_date'),
            ]);

            if (semRes.data) {
                setSemesterState({
                    startDate: semRes.data.start_date,
                    endDate: semRes.data.end_date,
                    id: semRes.data.id,
                });
            }

            if (subRes.data) {
                setSubjects(subRes.data.map(s => ({
                    id: s.id,
                    name: s.name,
                    createdAt: s.created_at,
                })));
            }

            if (ttRes.data) {
                setTimetable(ttRes.data.map(t => ({
                    id: t.id,
                    subjectId: t.subject_id,
                    subjectName: t.subjects?.name || '',
                    weekday: t.weekday,
                })));
            }

            if (holRes.data) {
                setHolidays(holRes.data.map(h => ({
                    id: h.id,
                    name: h.holiday_name,
                    date: h.holiday_date,
                })));
            }

            if (attRes.data) {
                setAttendanceRecords(attRes.data);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }

    // ──────────────────── SEMESTER ────────────────────
    const setSemester = useCallback(async ({ startDate, endDate }) => {
        try {
            if (semester.id) {
                // Update existing
                const { error } = await supabase
                    .from('semester_config')
                    .update({ start_date: startDate, end_date: endDate, updated_at: new Date().toISOString() })
                    .eq('id', semester.id);
                if (error) throw error;
                setSemesterState(prev => ({ ...prev, startDate, endDate }));
            } else {
                // Insert new
                const { data, error } = await supabase
                    .from('semester_config')
                    .insert({ start_date: startDate, end_date: endDate })
                    .select()
                    .single();
                if (error) throw error;
                setSemesterState({ startDate, endDate, id: data.id });
            }
        } catch (err) {
            console.error('Error saving semester:', err);
        }
    }, [semester.id]);

    // ──────────────────── SUBJECTS ────────────────────
    const addSubject = useCallback(async (name) => {
        try {
            const { data, error } = await supabase
                .from('subjects')
                .insert({ name })
                .select()
                .single();
            if (error) throw error;

            const newSubject = { id: data.id, name: data.name, createdAt: data.created_at };
            setSubjects(prev => [...prev, newSubject]);
            return newSubject;
        } catch (err) {
            console.error('Error adding subject:', err);
            return null;
        }
    }, []);

    const removeSubject = useCallback(async (id) => {
        try {
            const { error } = await supabase.from('subjects').delete().eq('id', id);
            if (error) throw error;

            setSubjects(prev => prev.filter(s => s.id !== id));
            setTimetable(prev => prev.filter(t => t.subjectId !== id));
            setAttendanceRecords(prev => prev.filter(a => a.subject_id !== id));
        } catch (err) {
            console.error('Error removing subject:', err);
        }
    }, []);

    // ──────────────────── TIMETABLE ────────────────────
    const addTimetableEntry = useCallback(async (subjectId, weekday) => {
        const subject = subjects.find(s => s.id === subjectId);
        if (!subject) return;

        // Check duplicate
        const exists = timetable.some(t => t.subjectId === subjectId && t.weekday === weekday);
        if (exists) return;

        try {
            const { data, error } = await supabase
                .from('timetable')
                .insert({ subject_id: subjectId, weekday })
                .select('*, subjects(name)')
                .single();
            if (error) throw error;

            setTimetable(prev => [...prev, {
                id: data.id,
                subjectId: data.subject_id,
                subjectName: data.subjects?.name || subject.name,
                weekday: data.weekday,
            }]);
        } catch (err) {
            console.error('Error adding timetable entry:', err);
        }
    }, [subjects, timetable]);

    const removeTimetableEntry = useCallback(async (id) => {
        try {
            const { error } = await supabase.from('timetable').delete().eq('id', id);
            if (error) throw error;
            setTimetable(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error('Error removing timetable entry:', err);
        }
    }, []);

    // ──────────────────── HOLIDAYS ────────────────────
    const addHoliday = useCallback(async (name, date) => {
        try {
            const { data, error } = await supabase
                .from('holidays')
                .insert({ holiday_name: name, holiday_date: date })
                .select()
                .single();
            if (error) throw error;

            setHolidays(prev => [...prev, {
                id: data.id,
                name: data.holiday_name,
                date: data.holiday_date,
            }]);
        } catch (err) {
            console.error('Error adding holiday:', err);
        }
    }, []);

    const removeHoliday = useCallback(async (id) => {
        try {
            const { error } = await supabase.from('holidays').delete().eq('id', id);
            if (error) throw error;
            setHolidays(prev => prev.filter(h => h.id !== id));
        } catch (err) {
            console.error('Error removing holiday:', err);
        }
    }, []);

    // ──────────────────── ATTENDANCE ────────────────────
    const markAttendance = useCallback(async (sessionId, status) => {
        // sessionId format: "yyyy-MM-dd-<subjectId>"
        const parts = sessionId.split('-');
        const date = parts.slice(0, 3).join('-'); // yyyy-MM-dd
        const subjectId = parts.slice(3).join('-'); // UUID

        try {
            // Upsert: insert or update on conflict of (subject_id, class_date)
            const { data, error } = await supabase
                .from('attendance')
                .upsert(
                    { subject_id: subjectId, class_date: date, status },
                    { onConflict: 'subject_id,class_date' }
                )
                .select()
                .single();
            if (error) throw error;

            setAttendanceRecords(prev => {
                const filtered = prev.filter(
                    a => !(a.subject_id === subjectId && a.class_date === date)
                );
                return [...filtered, data];
            });
        } catch (err) {
            console.error('Error marking attendance:', err);
        }
    }, []);

    // ──────────────────── RESET ALL ────────────────────
    const resetAll = useCallback(async () => {
        try {
            await Promise.all([
                supabase.from('attendance').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
                supabase.from('timetable').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
                supabase.from('holidays').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
                supabase.from('subjects').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
                supabase.from('semester_config').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            ]);

            setSemesterState({ startDate: '', endDate: '', id: null });
            setSubjects([]);
            setTimetable([]);
            setHolidays([]);
            setAttendanceRecords([]);
        } catch (err) {
            console.error('Error resetting data:', err);
        }
    }, []);

    // ──────────────────── COMPUTED: SESSIONS ────────────────────
    // Build attendance lookup map from DB records
    const attendanceLookup = useMemo(() => {
        const map = {};
        for (const record of attendanceRecords) {
            const key = `${record.class_date}-${record.subject_id}`;
            map[key] = record.status;
        }
        return map;
    }, [attendanceRecords]);

    const sessions = useMemo(() => {
        if (!semester.startDate || !semester.endDate) return [];
        return generateSessions(
            semester.startDate,
            semester.endDate,
            timetable,
            holidays
        ).map(session => ({
            ...session,
            status: attendanceLookup[session.id] || null,
        }));
    }, [semester, timetable, holidays, attendanceLookup]);

    const { profile } = useAuth();

    // ──────────────────── COMPUTED: STATS ────────────────────
    const targetAttr = profile?.target_attendance || 75;

    const stats = useMemo(() => {
        return calculateAttendanceStats(sessions, subjects, targetAttr);
    }, [sessions, subjects, targetAttr]);

    const predictions = useMemo(() => {
        return predictAttendance(stats, targetAttr);
    }, [stats, targetAttr]);

    const overallStats = useMemo(() => {
        const allMarked = sessions.filter(s => s.status !== null);
        const allPresent = sessions.filter(s => s.status === 'present');
        const totalSessions = sessions.length;
        const percentage = allMarked.length > 0 ? (allPresent.length / allMarked.length) * 100 : 0;

        return {
            totalSubjects: subjects.length,
            totalSessions,
            totalPresent: allPresent.length,
            totalAbsent: allMarked.length - allPresent.length,
            totalMarked: allMarked.length,
            percentage,
        };
    }, [sessions, subjects]);

    const value = {
        semester,
        subjects,
        timetable,
        holidays,
        sessions,
        stats,
        predictions,
        overallStats,
        loading,
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
