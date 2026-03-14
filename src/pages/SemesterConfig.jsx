import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CalendarClock, Save, Info } from 'lucide-react';
import './FormPages.css';

export default function SemesterConfig() {
    const { semester, setSemester } = useApp();
    const [startDate, setStartDate] = useState(semester.startDate || '');
    const [endDate, setEndDate] = useState(semester.endDate || '');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        if (!startDate || !endDate) return;
        setSemester({ startDate, endDate });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const daysDiff = startDate && endDate
        ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div className="form-page animate-fadeIn">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <span className="gradient-text">Semester Configuration</span>
                    </h1>
                    <p className="page-subtitle">Set your semester start and end dates</p>
                </div>
            </div>

            <div className="form-card glass-card">
                <div className="form-card-header">
                    <div className="form-card-icon">
                        <CalendarClock size={22} />
                    </div>
                    <div>
                        <h2 className="form-card-title">Semester Dates</h2>
                        <p className="form-card-desc">These dates define when classes start and end</p>
                    </div>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label" htmlFor="semester-start">Start Date</label>
                        <input
                            id="semester-start"
                            type="date"
                            className="form-input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="semester-end">End Date</label>
                        <input
                            id="semester-end"
                            type="date"
                            className="form-input"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                {daysDiff > 0 && (
                    <div className="form-info">
                        <Info size={16} />
                        <span>
                            Semester duration: <strong>{daysDiff} days</strong> (~{Math.ceil(daysDiff / 7)} weeks)
                        </span>
                    </div>
                )}

                <div className="form-actions">
                    <button
                        className={`btn btn-primary ${saved ? 'btn-saved' : ''}`}
                        onClick={handleSave}
                        disabled={!startDate || !endDate}
                    >
                        {saved ? (
                            <>
                                <Save size={16} /> Saved!
                            </>
                        ) : (
                            <>
                                <Save size={16} /> Save Configuration
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
