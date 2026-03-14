import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Plus, Trash2, GraduationCap } from 'lucide-react';
import './FormPages.css';

export default function Subjects() {
    const { subjects, addSubject, removeSubject } = useApp();
    const [newSubject, setNewSubject] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        const name = newSubject.trim();
        if (!name) return;
        if (subjects.some(s => s.name.toLowerCase() === name.toLowerCase())) return;
        addSubject(name);
        setNewSubject('');
    };

    return (
        <div className="form-page animate-fadeIn">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <span className="gradient-text">Subjects</span>
                    </h1>
                    <p className="page-subtitle">Add the subjects you're enrolled in this semester</p>
                </div>
                <span className="badge badge-primary">{subjects.length} subjects</span>
            </div>

            <div className="form-card glass-card">
                <div className="form-card-header">
                    <div className="form-card-icon">
                        <BookOpen size={22} />
                    </div>
                    <div>
                        <h2 className="form-card-title">Add Subject</h2>
                        <p className="form-card-desc">Enter the name of each subject</p>
                    </div>
                </div>

                <form onSubmit={handleAdd} className="form-inline">
                    <input
                        id="new-subject"
                        type="text"
                        className="form-input"
                        placeholder="e.g., Data Structures, DBMS..."
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" disabled={!newSubject.trim()}>
                        <Plus size={18} /> Add
                    </button>
                </form>
            </div>

            {subjects.length > 0 && (
                <div className="list-card glass-card">
                    <div className="list-header">
                        <h3 className="list-title">Your Subjects</h3>
                    </div>
                    <div className="list-items stagger-children">
                        {subjects.map((subject) => (
                            <div key={subject.id} className="list-item">
                                <div className="list-item-left">
                                    <div className="list-item-icon">
                                        <GraduationCap size={18} />
                                    </div>
                                    <span className="list-item-name">{subject.name}</span>
                                </div>
                                <button
                                    className="btn-icon btn-icon--danger"
                                    onClick={() => removeSubject(subject.id)}
                                    title="Remove subject"
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
