import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowRight, Mail, Lock, User } from 'lucide-react';
import './Landing.css';

export default function Landing() {
    const { signIn, signUp } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (isLogin) {
            const { error: signInError } = await signIn(formData.email, formData.password);
            if (signInError) setError(signInError.message);
        } else {
            const { data, error: signUpError } = await signUp(
                formData.email,
                formData.password,
                formData.username
            );
            if (signUpError) {
                setError(signUpError.message);
            } else if (data?.user?.identities?.length === 0) {
                // Typically happens if email is already registered and Supabase didn't throw an error directly
                setError('Email already in use.');
            }
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="landing-page">
            <div className="landing-background">
                <div className="glow-orb orb-1"></div>
                <div className="glow-orb orb-2"></div>
            </div>

            <div className="landing-content">
                <div className="landing-brand animate-slideInLeft">
                    <div className="landing-brand-icon">
                        <GraduationCap size={40} />
                    </div>
                    <h1 className="landing-title">Attend<span className="gradient-text">X</span></h1>
                    <p className="landing-subtitle">Smart Semester Attendance Tracker</p>
                    <ul className="landing-features">
                        <li>✨ Auto-generate sessions from your timetable</li>
                        <li>📊 Visual progress tracking and dashboards</li>
                        <li>🔮 Predict safe bunks to hit your target</li>
                    </ul>
                </div>

                <div className="landing-auth animate-slideInRight">
                    <div className="auth-card glass-card">
                        <h2 className="auth-title">{isLogin ? 'Welcome Back 👋' : 'Create Account 🚀'}</h2>
                        <p className="auth-desc">
                            {isLogin ? 'Enter your details to sign in.' : 'Start tracking your attendance today.'}
                        </p>

                        {error && (
                            <div className="auth-error glass-card">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            {!isLogin && (
                                <div className="auth-form-group">
                                    <label>Username</label>
                                    <div className="auth-input-wrapper">
                                        <User className="auth-icon" size={18} />
                                        <input
                                            name="username"
                                            type="text"
                                            className="form-input auth-input"
                                            placeholder="e.g. janesmith"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="auth-form-group">
                                <label>Email Address</label>
                                <div className="auth-input-wrapper">
                                    <Mail className="auth-icon" size={18} />
                                    <input
                                        name="email"
                                        type="email"
                                        className="form-input auth-input"
                                        placeholder="you@university.edu"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-form-group">
                                <label>Password</label>
                                <div className="auth-input-wrapper">
                                    <Lock className="auth-icon" size={18} />
                                    <input
                                        name="password"
                                        type="password"
                                        className="form-input auth-input"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>



                            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                                <ArrowRight size={18} />
                            </button>
                        </form>

                        <div className="auth-switch">
                            <p>
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                            </p>
                            <button
                                className="btn-link gradient-text"
                                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            >
                                {isLogin ? 'Sign up here' : 'Sign in here'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
