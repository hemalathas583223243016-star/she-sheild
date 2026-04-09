import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './HomePage.css'

const features = [
  {
    icon: '🗺️',
    title: 'AI Safe Route',
    desc: 'Intelligent path planning based on crime data, lighting, crowd density & time of day.',
    color: '#ff2d78',
    route: '/route',
    tag: 'AI Powered'
  },
  {
    icon: '🧭',
    title: 'Safe Zones',
    desc: 'Instantly locate nearby police stations, hospitals, bus stops & safe public places.',
    color: '#a855f7',
    route: '/safezone',
    tag: 'Real-time'
  },
  {
    icon: '🚨',
    title: 'SOS Emergency',
    desc: 'One-tap emergency alert with live GPS location sent directly to your contacts.',
    color: '#ef4444',
    route: '/sos',
    tag: 'Instant'
  },
  {
    icon: '📍',
    title: 'Live Tracking',
    desc: 'Share your real-time location with trusted contacts while you travel.',
    color: '#06b6d4',
    route: '/live',
    tag: 'Live'
  },
  {
    icon: '🎤',
    title: 'Voice Trigger',
    desc: 'Secretly activate SOS with a hidden voice command — no need to look at phone.',
    color: '#f59e0b',
    route: '/sos',
    tag: 'Smart'
  },
  {
    icon: '📳',
    title: 'Shake Alert',
    desc: 'Abnormal motion detected? Your phone automatically triggers an emergency alert.',
    color: '#22c55e',
    route: '/sos',
    tag: 'Auto'
  },
]

const stats = [
  { value: '50K+', label: 'Women Protected' },
  { value: '99.9%', label: 'Uptime' },
  { value: '< 2s', label: 'Alert Speed' },
  { value: '24/7', label: 'Active Monitoring' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="home-main">

        {/* ── HERO ── */}
        <section className="hero-section">
          <div className="hero-badge animate-fadeDown">
            <span className="badge-dot" />
            AI-Powered Women Safety Platform
          </div>

          <h1 className="hero-title animate-fadeUp">
            Your Safety is Our
            <br />
            <span className="gradient-text">Top Priority 💗</span>
          </h1>

          <p className="hero-subtitle animate-fadeUp" style={{ animationDelay: '0.1s' }}>
            SheShield uses AI to find the safest routes based on real-time crime data,
            lighting, crowd density, and time of day — keeping you protected every step.
          </p>

          <div className="hero-actions animate-fadeUp" style={{ animationDelay: '0.2s' }}>
            <button className="hero-btn primary" onClick={() => navigate('/route')}>
              🗺️ Find Safe Route
            </button>
            <button className="hero-btn secondary" onClick={() => navigate('/sos')}>
              🚨 Emergency SOS
            </button>
          </div>

          {/* Floating Shield */}
          <div className="hero-shield animate-float">
            <svg viewBox="0 0 200 230" fill="none">
              <path d="M100 10L20 50V110C20 160 56 203 100 220C144 203 180 160 180 110V50L100 10Z"
                fill="url(#heroGrad)" opacity="0.15" />
              <path d="M100 10L20 50V110C20 160 56 203 100 220C144 203 180 160 180 110V50L100 10Z"
                fill="none" stroke="url(#heroGrad)" strokeWidth="2" />
              <path d="M70 115L88 133L132 89" stroke="url(#heroGrad)" strokeWidth="6"
                strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="heroGrad" x1="20" y1="10" x2="180" y2="220" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ff2d78" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="stats-section">
          {stats.map((s, i) => (
            <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="stat-value gradient-text">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </section>

        {/* ── FEATURES GRID ── */}
        <section className="features-section">
          <div className="section-header">
            <h2>Everything You Need to Stay Safe</h2>
            <p>Comprehensive safety tools designed specifically for women</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div
                key={i}
                className="feature-card"
                style={{ animationDelay: `${i * 0.08}s`, '--accent': f.color }}
                onClick={() => navigate(f.route)}
              >
                <div className="feature-tag" style={{ background: `${f.color}22`, color: f.color }}>
                  {f.tag}
                </div>
                <div className="feature-icon-wrap" style={{ background: `${f.color}18` }}>
                  <span className="feature-icon">{f.icon}</span>
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
                <div className="feature-arrow" style={{ color: f.color }}>
                  Explore →
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── EMERGENCY STRIP ── */}
        <section className="emergency-strip">
          <div className="strip-inner">
            <div className="strip-left">
              <span className="strip-icon">🚨</span>
              <div>
                <h3>In Danger Right Now?</h3>
                <p>Tap SOS — your location is sent instantly to emergency contacts</p>
              </div>
            </div>
            <button className="strip-btn" onClick={() => navigate('/sos')}>
              TRIGGER SOS
            </button>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="home-footer">
          <p>💗 SheShield — Empowering women through AI safety technology</p>
          <p>🚔 Emergency: <a href="tel:112">112</a> &nbsp;|&nbsp; 🆘 Women Helpline: <a href="tel:1091">1091</a></p>
        </footer>
      </main>
    </div>
  )
}
