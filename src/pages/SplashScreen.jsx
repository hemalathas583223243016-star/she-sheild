import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './SplashScreen.css'

export default function SplashScreen() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('loading') // loading | ready

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setPhase('ready')
          return 100
        }
        return prev + 2
      })
    }, 40)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="splash-wrapper">
      {/* Animated Background Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            '--delay': `${Math.random() * 4}s`,
            '--x': `${Math.random() * 100}%`,
            '--duration': `${3 + Math.random() * 4}s`,
            '--size': `${4 + Math.random() * 8}px`
          }} />
        ))}
      </div>

      {/* Glow Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="splash-content">
        {/* Shield Icon */}
        <div className="shield-container animate-float">
          <div className="shield-glow" />
          <div className="shield-icon">
            <svg viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 5L8 18V42C8 60 22 76 40 82C58 76 72 60 72 42V18L40 5Z"
                fill="url(#shieldGrad)" />
              <path d="M28 45L36 53L54 35" stroke="white" strokeWidth="4"
                strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="shieldGrad" x1="8" y1="5" x2="72" y2="82" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ff2d78" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Brand Name */}
        <div className="brand">
          <h1 className="brand-name">
            <span className="she">She</span>
            <span className="shield">Shield</span>
          </h1>
          <p className="brand-tagline">AI-Powered Women Safety Platform</p>
        </div>

        {/* Features Preview */}
        <div className="feature-pills">
          {['🗺️ Safe Routes', '🚨 SOS Alert', '📍 Live Track', '🛡️ Safe Zones'].map((f, i) => (
            <span key={i} className="pill" style={{ animationDelay: `${i * 0.15}s` }}>{f}</span>
          ))}
        </div>

        {/* Progress / CTA */}
        {phase === 'loading' ? (
          <div className="progress-section">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="loading-text">Initializing safety systems... {progress}%</p>
          </div>
        ) : (
          <div className="cta-section animate-scale">
            <button className="get-started-btn" onClick={() => navigate('/login')}>
              <span>Get Started</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <p className="safety-note">🔒 Your safety, our priority</p>
          </div>
        )}
      </div>
    </div>
  )
}
