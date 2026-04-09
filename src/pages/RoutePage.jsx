import { useState } from 'react'
import Navbar from '../components/Navbar'
import './RoutePage.css'

const TIME_LABELS = {
  day:     { label: 'Day Time',   icon: '☀️', risk: 0 },
  evening: { label: 'Evening',    icon: '🌆', risk: 2 },
  night:   { label: 'Night Time', icon: '🌙', risk: 4 },
}

const AREA_RISK = {
  forest: 4, isolated: 3, alley: 3, dark: 3,
  mall: -1, hospital: -1, 'bus stand': -1, market: -1,
  park: 1, road: 0, street: 1,
}

export default function RoutePage() {
  const [source, setSource]           = useState('')
  const [destination, setDestination] = useState('')
  const [timeMode, setTimeMode]       = useState(() => {
    const h = new Date().getHours()
    return h >= 21 || h < 6 ? 'night' : h >= 18 ? 'evening' : 'day'
  })
  const [crowd, setCrowd]             = useState('medium')
  const [lighting, setLighting]       = useState('good')
  const [result, setResult]           = useState(null)
  const [loading, setLoading]         = useState(false)

  const analyzeRoute = () => {
    if (!source.trim() || !destination.trim()) {
      alert('Please enter both source and destination')
      return
    }

    setLoading(true)
    setResult(null)

    setTimeout(() => {
      let score = 0
      const reasons = []
      const tips    = []

      // Time risk
      const t = TIME_LABELS[timeMode]
      score += t.risk
      reasons.push({ icon: t.icon, text: t.label, severity: t.risk >= 3 ? 'high' : t.risk >= 1 ? 'medium' : 'low' })

      // Area keyword risk
      const combined = (source + ' ' + destination).toLowerCase()
      Object.entries(AREA_RISK).forEach(([kw, r]) => {
        if (combined.includes(kw)) {
          score += r
          if (r > 0) reasons.push({ icon: '📍', text: `Contains "${kw}" area`, severity: r >= 3 ? 'high' : 'medium' })
          if (r < 0) reasons.push({ icon: '✅', text: `${kw} area — public & safe`, severity: 'low' })
        }
      })

      // Crowd
      if (crowd === 'low')  { score += 2; reasons.push({ icon: '👤', text: 'Low crowd density — vulnerability ↑', severity: 'high' }) }
      if (crowd === 'high') { score -= 1; reasons.push({ icon: '👥', text: 'High crowd — safety ↑', severity: 'low' }) }
      if (crowd === 'medium') reasons.push({ icon: '🧑‍🤝‍🧑', text: 'Moderate crowd', severity: 'medium' })

      // Lighting
      if (lighting === 'poor') { score += 3; reasons.push({ icon: '🔦', text: 'Poor lighting — high risk', severity: 'high' }) }
      if (lighting === 'good') reasons.push({ icon: '💡', text: 'Good lighting', severity: 'low' })
      if (lighting === 'moderate') { score += 1; reasons.push({ icon: '🕯️', text: 'Moderate lighting', severity: 'medium' }) }

      // Tips
      if (timeMode === 'night') tips.push('🌙 Share your live location with a trusted contact')
      if (crowd === 'low')  tips.push('👀 Stay in visible, well-known paths')
      if (lighting === 'poor') tips.push('🔦 Carry a flashlight or enable your phone torch')
      tips.push('📱 Keep your phone charged and SOS ready')
      tips.push('🚶‍♀️ Walk confidently at a steady pace')

      const level = score >= 6 ? 'HIGH' : score >= 3 ? 'MEDIUM' : 'SAFE'

      const routeLink = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&travelmode=walking`

      setResult({ score, level, reasons, tips, routeLink, source, destination })
      setLoading(false)
    }, 1400)
  }

  const riskConfig = {
    SAFE:   { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)',   emoji: '🟢' },
    MEDIUM: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  emoji: '🟡' },
    HIGH:   { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   emoji: '🔴' },
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="route-main">
        <div className="route-header animate-fadeDown">
          <h1>🗺️ AI Safe Route Planner</h1>
          <p>Smart path analysis based on crime data, lighting, crowd & time of day</p>
        </div>

        <div className="route-layout">
          {/* ── INPUT PANEL ── */}
          <div className="route-input-panel animate-fadeUp">
            <div className="input-section">
              <label className="field-label">📍 From</label>
              <input
                className="route-input"
                placeholder="Enter starting location..."
                value={source}
                onChange={e => setSource(e.target.value)}
              />
            </div>

            <div className="input-section">
              <label className="field-label">🎯 To</label>
              <input
                className="route-input"
                placeholder="Enter destination..."
                value={destination}
                onChange={e => setDestination(e.target.value)}
              />
            </div>

            {/* Time of Day */}
            <div className="input-section">
              <label className="field-label">🕒 Time of Day</label>
              <div className="chip-group">
                {Object.entries(TIME_LABELS).map(([k, v]) => (
                  <button
                    key={k}
                    className={`chip ${timeMode === k ? 'active' : ''}`}
                    onClick={() => setTimeMode(k)}
                  >
                    {v.icon} {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Crowd */}
            <div className="input-section">
              <label className="field-label">👥 Crowd Level</label>
              <div className="chip-group">
                {['low', 'medium', 'high'].map(c => (
                  <button
                    key={c}
                    className={`chip ${crowd === c ? 'active' : ''}`}
                    onClick={() => setCrowd(c)}
                  >
                    {c === 'low' ? '👤' : c === 'medium' ? '🧑‍🤝‍🧑' : '👥'} {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Lighting */}
            <div className="input-section">
              <label className="field-label">💡 Lighting Condition</label>
              <div className="chip-group">
                {['poor', 'moderate', 'good'].map(l => (
                  <button
                    key={l}
                    className={`chip ${lighting === l ? 'active' : ''}`}
                    onClick={() => setLighting(l)}
                  >
                    {l === 'poor' ? '🔦' : l === 'moderate' ? '🕯️' : '💡'} {l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              className={`analyze-btn ${loading ? 'loading' : ''}`}
              onClick={analyzeRoute}
              disabled={loading}
            >
              {loading ? <><span className="spinner" /> Analyzing...</> : '🧠 Analyze Route Safety'}
            </button>
          </div>

          {/* ── RESULT PANEL ── */}
          <div className="route-result-panel">
            {!result && !loading && (
              <div className="result-placeholder">
                <div className="placeholder-shield">🛡️</div>
                <h3>Enter route details to get AI safety analysis</h3>
                <p>We analyze time, crowd, lighting & crime data to rate your path</p>
              </div>
            )}

            {loading && (
              <div className="result-placeholder">
                <div className="loading-brain">🧠</div>
                <h3>AI Analyzing Route...</h3>
                <p>Processing safety parameters...</p>
              </div>
            )}

            {result && (
              <div className="result-card animate-scale">
                {/* Risk Level Badge */}
                <div
                  className="risk-badge"
                  style={{
                    background: riskConfig[result.level].bg,
                    border: `1px solid ${riskConfig[result.level].border}`,
                    color: riskConfig[result.level].color
                  }}
                >
                  <span className="risk-emoji">{riskConfig[result.level].emoji}</span>
                  <div>
                    <p className="risk-level-label">Risk Level</p>
                    <p className="risk-level-value">{result.level}</p>
                  </div>
                  <div className="risk-score">
                    Score: {result.score < 0 ? 0 : result.score}/10
                  </div>
                </div>

                {/* Route */}
                <div className="route-path">
                  <span className="path-from">📍 {result.source}</span>
                  <span className="path-arrow">→</span>
                  <span className="path-to">🎯 {result.destination}</span>
                </div>

                {/* Reasons */}
                <div className="analysis-section">
                  <h4>📊 Safety Analysis</h4>
                  <div className="reason-list">
                    {result.reasons.map((r, i) => (
                      <div key={i} className={`reason-row ${r.severity}`}>
                        <span>{r.icon}</span>
                        <span>{r.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="analysis-section">
                  <h4>💡 Safety Tips</h4>
                  <div className="tips-list">
                    {result.tips.map((tip, i) => (
                      <p key={i} className="tip-item">{tip}</p>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <a
                  href={result.routeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="open-maps-btn"
                >
                  🗺️ Open Route in Google Maps
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
