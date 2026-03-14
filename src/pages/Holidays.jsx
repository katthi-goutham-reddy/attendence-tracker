import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CalendarOff, Plus, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import './FormPages.css';

export default function Holidays() {
    const { holidays, addHoliday, removeHoliday } = useApp();
    const [holidayName, setHolidayName] = useState('');
    const [holidayDate, setHolidayDate] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!holidayName.trim() || !holidayDate) return;
        addHoliday(holidayName.trim(), holidayDate);
        setHolidayName('');
        setHolidayDate('');
    };

    const sortedHolidays = [...holidays].sort((a, b) => a.date.localeCompare(b.date));

    return (
        <div className="form-page animate-fadeIn">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <span className="gradient-text">Holidays</span>
                    </h1>
                    <p className="page-subtitle">Add holidays to exclude from attendance calculation</p>
                </div>
                <span className="badge badge-primary">{holidays.length} holidays</span>
            </div>

            <div className="form-card glass-card">
                <div className="form-card-header">
                    <div className="form-card-icon">
                        <CalendarOff size={22} />
                    </div>
                    <div>
                        <h2 className="form-card-title">Add Holiday</h2>
                        <p className="form-card-desc">Sessions on holiday dates will be excluded</p>
                    </div>
                </div>

                <form onSubmit={handleAdd} className="form-grid-3">
                    <div className="form-group">
                        <label className="form-label" htmlFor="holiday-name">Holiday Name</label>
                        <input
                            id="holiday-name"
                            type="text"
                            className="form-input"
                            placeholder="e.g., Independence Day"
                            value={holidayName}
                            onChange={(e) => setHolidayName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="holiday-date">Date</label>
                        <input
                            id="holiday-date"
                            type="date"
                            className="form-input"
                            value={holidayDate}
                            onChange={(e) => setHolidayDate(e.target.value)}
                        />
                    </div>

                    <div className="form-group form-group-btn">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!holidayName.trim() || !holidayDate}
                        >
                            <Plus size={18} /> Add
                        </button>
                    </div>
                </form>
            </div>

            {sortedHolidays.length > 0 && (
                <div className="list-card glass-card">
                    <div className="list-header">
                        <h3 className="list-title">Holiday Calendar</h3>
                    </div>
                    <div className="list-items stagger-children">
                        {sortedHolidays.map(holiday => (
                            <div key={holiday.id} className="list-item">
                                <div className="list-item-left">
                                    <div className="list-item-icon list-item-icon--accent">
                                        <CalendarOff size={18} />
                                    </div>
                                    <div className="list-item-info">
                                        <span className="list-item-name">{holiday.name}</span>
                                        <span className="list-item-meta">
                                            {format(parseISO(holiday.date), 'EEEE, MMM d, yyyy')}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    className="btn-icon btn-icon--danger"
                                    onClick={() => removeHoliday(holiday.id)}
                                    title="Remove holiday"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
