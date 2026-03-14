import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { WEEKDAYS } from '../utils/helpers';
import './FormPages.css';

export default function Timetable() {
    const { subjects, timetable, addTimetableEntry, removeTimetableEntry } = useApp();
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedDay, setSelectedDay] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!selectedSubject || selectedDay === '') return;
        addTimetableEntry(selectedSubject, parseInt(selectedDay));
        setSelectedSubject('');
        setSelectedDay('');
    };

    // Group timetable by weekday
    const grouped = WEEKDAYS.reduce((acc, wd) => {
        acc[wd.value] = timetable.filter(t => t.weekday === wd.value);
        return acc;
    }, {});

    const hasEntries = timetable.length > 0;

    return (
        <div className="form-page animate-fadeIn">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <span className="gradient-text">Weekly Timetable</span>
                    </h1>
                    <p className="page-subtitle">Configure which subjects occur on each weekday</p>
                </div>
                <span className="badge badge-primary">{timetable.length} entries</span>
            </div>

            {subjects.length === 0 ? (
                <div className="form-card glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p className="form-card-desc">
                        Add subjects first before setting up the timetable.
                    </p>
                </div>
            ) : (
                <div className="form-card glass-card">
                    <div className="form-card-header">
                        <div className="form-card-icon">
                            <Calendar size={22} />
                        </div>
                        <div>
                            <h2 className="form-card-title">Add Timetable Entry</h2>
                            <p className="form-card-desc">Select a subject and the day it occurs</p>
                        </div>
                    </div>

                    <form onSubmit={handleAdd} className="form-grid-3">
                        <div className="form-group">
                            <label className="form-label" htmlFor="tt-subject">Subject</label>
                            <select
                                id="tt-subject"
                                className="form-input form-select"
                                value={selectedSubject}
                                onChange={e => setSelectedSubject(e.target.value)}
                            >
                                <option value="">Select subject</option>
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="tt-day">Weekday</label>
                            <select
                                id="tt-day"
                                className="form-input form-select"
                                value={selectedDay}
                                onChange={e => setSelectedDay(e.target.value)}
                            >
                                <option value="">Select day</option>
                                {WEEKDAYS.filter(w => w.value >= 1 && w.value <= 6).map(w => (
                                    <option key={w.value} value={w.value}>{w.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group form-group-btn">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={!selectedSubject || selectedDay === ''}
                            >
                                <Plus size={18} /> Add
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {hasEntries && (
                <div className="timetable-grid">
                    {WEEKDAYS.filter(w => grouped[w.value]?.length > 0).map(wd => (
                        <div key={wd.value} className="timetable-day glass-card">
                            <div className="timetable-day-header">
                                <span className="timetable-day-name">{wd.label}</span>
                                <span className="timetable-day-count">{grouped[wd.value].length} class{grouped[wd.value].length > 1 ? 'es' : ''}</span>
                            </div>
                            <div className="timetable-day-items">
                                {grouped[wd.value].map(entry => (
                                    <div key={entry.id} className="timetable-entry">
                                        <span className="timetable-entry-name">{entry.subjectName}</span>
                                        <button
                                            className="btn-icon btn-icon--danger btn-icon-sm"
                                            onClick={() => removeTimetableEntry(entry.id)}
                                            title="Remove"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
