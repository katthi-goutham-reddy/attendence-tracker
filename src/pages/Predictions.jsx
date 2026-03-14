import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
    TrendingUp,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    ArrowUp,
    ArrowDown,
    Target,
    Shield,
    Zap,
} from 'lucide-react';
import './Predictions.css';

export default function Predictions() {
    const { predictions, subjects } = useApp();
    const { profile, updateProfile } = useAuth();
    const targetAttr = profile?.target_attendance || 75;

    const [localTarget, setLocalTarget] = useState(targetAttr);

    useEffect(() => {
        setLocalTarget(targetAttr);
    }, [targetAttr]);

    const handleTargetChange = (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = '';
        setLocalTarget(val);
    };

    const handleTargetBlur = async () => {
        let finalVal = localTarget;
        if (finalVal < 1) finalVal = 1;
        if (finalVal > 100) finalVal = 100;

        if (finalVal !== targetAttr && finalVal !== '') {
            await updateProfile({ target_attendance: finalVal });
            setLocalTarget(finalVal);
        } else {
            setLocalTarget(targetAttr);
        }
    };

    const predsArray = Object.values(predictions);
    const hasData = predsArray.length > 0;

    return (
        <div className="predictions-page animate-fadeIn">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <span className="gradient-text">Attendance Predictor</span>
                    </h1>
                    <p className="page-subtitle">
                        See how many classes you can safely miss while maintaining {targetAttr}% attendance
                    </p>
                </div>
            </div>

            {!hasData ? (
                <div className="form-card glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <TrendingUp size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <p className="form-card-desc">
                        Set up your semester, subjects, and timetable to see predictions.
                    </p>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="prediction-summary stagger-children">
                        <div className="summary-card glass-card summary-card--safe">
                            <Shield size={22} />
                            <div className="summary-card-value">
                                {predsArray.filter(p => p.isSafe).length}
                            </div>
                            <div className="summary-card-label">Subjects Safe</div>
                        </div>
                        <div className="summary-card glass-card summary-card--at-risk">
                            <AlertTriangle size={22} />
                            <div className="summary-card-value">
                                {predsArray.filter(p => !p.isSafe).length}
                            </div>
                            <div className="summary-card-label">At Risk</div>
                        </div>
                        <div className="summary-card glass-card summary-card--target">
                            <Target size={22} />
                            <div className="summary-card-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <input
                                    type="number"
                                    value={localTarget}
                                    onChange={handleTargetChange}
                                    onBlur={handleTargetBlur}
                                    style={{
                                        width: '60px',
                                        background: 'transparent',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'inherit',
                                        fontSize: 'inherit',
                                        fontWeight: 'inherit',
                                        textAlign: 'center',
                                        borderRadius: 'var(--radius-sm)',
                                        outline: 'none',
                                    }}
                                />
                                %
                            </div>
                            <div className="summary-card-label">Required (Editable)</div>
                        </div>
                    </div>

                    {/* Prediction Cards */}
                    <div className="prediction-grid stagger-children">
                        {predsArray.map(pred => (
                            <div key={pred.subjectId} className="prediction-card glass-card">
                                <div className="prediction-card-header">
                                    <h3 className="prediction-card-name">{pred.subjectName}</h3>
                                    {pred.isSafe ? (
                                        <span className="badge badge-success">
                                            <Shield size={12} /> Safe
                                        </span>
                                    ) : (
                                        <span className="badge badge-danger">
                                            <AlertTriangle size={12} /> At Risk
                                        </span>
                                    )}
                                </div>

                                {/* Attendance Bar */}
                                <div className="prediction-bar-container">
                                    <div className="prediction-bar-bg">
                                        <div
                                            className={`prediction-bar-fill prediction-bar-fill--${pred.status}`}
                                            style={{ width: `${Math.min(pred.percentage, 100)}%` }}
                                        />
                                        <div className="prediction-bar-threshold" style={{ left: `${targetAttr}%` }}>
                                            <span className="prediction-bar-threshold-label">{targetAttr}%</span>
                                        </div>
                                    </div>
                                    <div className="prediction-bar-info">
                                        <span>{pred.percentage.toFixed(1)}%</span>
                                        <span>{pred.attended}/{pred.marked} attended</span>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="prediction-stats">
                                    <div className="prediction-stat">
                                        <div className="prediction-stat-icon prediction-stat-icon--total">
                                            <Zap size={14} />
                                        </div>
                                        <div className="prediction-stat-info">
                                            <span className="prediction-stat-value">{pred.total}</span>
                                            <span className="prediction-stat-label">Total Classes</span>
                                        </div>
                                    </div>

                                    <div className="prediction-stat">
                                        <div className="prediction-stat-icon prediction-stat-icon--attended">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <div className="prediction-stat-info">
                                            <span className="prediction-stat-value">{pred.attended}</span>
                                            <span className="prediction-stat-label">Attended</span>
                                        </div>
                                    </div>

                                    <div className="prediction-stat">
                                        <div className="prediction-stat-icon prediction-stat-icon--required">
                                            <Target size={14} />
                                        </div>
                                        <div className="prediction-stat-info">
                                            <span className="prediction-stat-value">{pred.requiredMin}</span>
                                            <span className="prediction-stat-label">Required</span>
                                        </div>
                                    </div>

                                    <div className="prediction-stat">
                                        <div className="prediction-stat-icon prediction-stat-icon--remaining">
                                            <ArrowUp size={14} />
                                        </div>
                                        <div className="prediction-stat-info">
                                            <span className="prediction-stat-value">{pred.remaining}</span>
                                            <span className="prediction-stat-label">Remaining</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Key insight */}
                                <div className={`prediction-insight ${pred.canMiss > 0 ? 'prediction-insight--safe' : 'prediction-insight--danger'}`}>
                                    {pred.canMiss > 0 ? (
                                        <>
                                            <ArrowDown size={16} />
                                            <div>
                                                <strong>Can miss {pred.canMiss} more classes</strong>
                                                <span>and still maintain {targetAttr}% attendance</span>
                                            </div>
                                        </>
                                    ) : pred.mustAttend > 0 ? (
                                        <>
                                            <ArrowUp size={16} />
                                            <div>
                                                <strong>Must attend {pred.mustAttend} more classes</strong>
                                                <span>to reach {targetAttr}% attendance</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={16} />
                                            <div>
                                                <strong>On track</strong>
                                                <span>Meeting attendance requirements</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
