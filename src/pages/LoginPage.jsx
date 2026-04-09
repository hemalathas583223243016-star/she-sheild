import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email.includes('@')) e.email = 'Enter a valid email'
    if (form.password.length < 4) e.password = 'Password too short'
    return e
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/home')
    }, 1800)
  }

  return (
    <div className="login-wrapper">
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />

      <div className="login-card animate-scale">
        {/* Logo */}
        <div className="login-logo">
          <svg viewBox="0 0 60 68" fill="none" className="logo-svg">
            <path d="M30 3L6 14V32C6 46 17 58 30 62C43 58 54 46 54 32V14L30 3Z"
              fill="url(#lg)" />
            <path d="M21 34L28 41L41 27" stroke="white" strokeWidth="3.5"
              strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="lg" x1="6" y1="3" x2="54" y2="62" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ff2d78" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <div>
            <h1 className="login-brand">SheShield</h1>
            <p className="login-sub">Welcome back 💗</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {/* Email */}
          <div className={`input-group ${errors.email ? 'error' : ''}`}>
            <label>Email Address</label>
            <div className="input-field">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => { setForm({...form, email: e.target.value}); setErrors({...errors, email: ''}) }}
              />
            </div>
            {errors.email && <p className="err-msg">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className={`input-group ${errors.password ? 'error' : ''}`}>
            <label>Password</label>
            <div className="input-field">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => { setForm({...form, password: e.target.value}); setErrors({...errors, password: ''}) }}
              />
              <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <p className="err-msg">{errors.password}</p>}
          </div>

          <button type="submit" className={`login-btn ${loading ? 'loading' : ''}`} disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <span>Sign In Securely</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/home">Enter as Guest</Link></p>
          <p className="emergency-note">🚨 In emergency, <a href="tel:112">call 112</a></p>
        </div>
      </div>
    </div>
  )
}
