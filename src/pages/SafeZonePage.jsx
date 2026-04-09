import { useState } from 'react'
import Navbar from '../components/Navbar'
import './SafeZonePage.css'

const ZONE_TYPES = [
  { id: 'police', label: 'Police Station', icon: '🚓', color: '#3b82f6', query: 'police+station' },
  { id: 'hospital', label: 'Hospital', icon: '🏥', color: '#22c55e', query: 'hospital' },
  { id: 'bus', label: 'Bus Stop', icon: '🚌', color: '#f59e0b', query: 'bus+stop' },
  { id: 'taxi', label: 'Cab / Taxi', icon: '🚕', color: '#a855f7', query: 'taxi' },
  { id: 'atm', label: 'ATM / Bank', icon: '🏦', color: '#06b6d4', query: 'atm' },
  { id: 'petrol', label: 'Petrol Bunk', icon: '⛽', color: '#ef4444', query: 'petrol+station' },
]

export default function SafeZonePage() {
  const [location, setLocation] = useState(null)
  const [status, setStatus] = useState('idle') // idle | locating | found | error
  const [errMsg, setErrMsg] = useState('')
  const [activeZone, setActiveZone] = useState(null)

  const fetchLocation = () => {
    setStatus('locating')
    setErrMsg('')
    if (!navigator.geolocation) {
      setStatus('error')
      setErrMsg('Geolocation is not supported on this browser')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        setStatus('found')
      },
      (err) => {
        setStatus('error')
        setErrMsg(err.message || 'Location access denied')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const getMapsLink = (query) => {
    if (!location) return '#'
    return `https://www.google.com/maps/search/${query}/@${location.lat},${location.lon},15z`
  }

  const shareLocation = () => {
    if (!location) return
    const link = `https://www.google.com/maps?q=${location.lat},${location.lon}`
    if (navigator.share) {
      navigator.share({ title: '🛡️ My Location - SheShield', url: link })
    } else {
      navigator.clipboard.writeText(link)
      alert('Location link copied to clipboard!')
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="sz-main">
        <div className="sz-header animate-fadeDown">
          <h1>🧭 Safe Zone Finder</h1>
          <p>Instantly locate safe places near your current location</p>
        </div>

        {/* ── LOCATE BUTTON ── */}
        {status === 'idle' && (
          <div className="locate-cta animate-scale">
            <div className="locate-icon">📍</div>
            <h2>Find Safe Places Near You</h2>
            <p>We'll use your GPS to find the nearest police stations, hospitals, bus stops and more</p>
            <button className="locate-btn" onClick={fetchLocation}>
              Locate Me Now
            </button>
          </div>
        )}

        {status === 'locating' && (
          <div className="locate-cta">
            <div className="loading-pulse">📡</div>
            <h2>Acquiring Location...</h2>
            <p>Please allow location access when prompted</p>
          </div>
        )}

        {status === 'error' && (
          <div className="locate-cta error-state">
            <div className="locate-icon">❌</div>
            <h2>Location Access Failed</h2>
            <p>{errMsg}</p>
            <button className="locate-btn" onClick={fetchLocation}>Try Again</button>
          </div>
        )}

        {status === 'found' && location && (
          <div className="sz-content animate-fadeUp">
            {/* Location Bar */}
            <div className="location-bar">
              <div className="loc-info">
                <span className="loc-dot" />
                <div>
                  <p className="loc-label">Your Current Location</p>
                  <p className="loc-coords">{location.lat.toFixed(5)}, {location.lon.toFixed(5)}</p>
                </div>
              </div>
              <div className="loc-actions">
                <button className="loc-action-btn" onClick={shareLocation}>📤 Share</button>
                <a
                  href={`https://www.google.com/maps?q=${location.lat},${location.lon}`}
                  target="_blank"
                  rel="noreferrer"
                  className="loc-action-btn"
                >
                  🗺️ Maps
                </a>
                <button className="loc-action-btn danger" onClick={() => { setStatus('idle'); setLocation(null) }}>
                  🔄 Reset
                </button>
              </div>
            </div>

            {/* Zone Grid */}
            <div className="sz-grid">
              {ZONE_TYPES.map((z) => (
                <a
                  key={z.id}
                  href={getMapsLink(z.query)}
                  target="_blank"
                  rel="noreferrer"
                  className={`zone-card ${activeZone === z.id ? 'active' : ''}`}
                  style={{ '--zone-color': z.color }}
                  onClick={() => setActiveZone(z.id)}
                >
                  <div className="zone-icon-wrap" style={{ background: `${z.color}18` }}>
                    <span className="zone-icon">{z.icon}</span>
                  </div>
                  <span className="zone-label">{z.label}</span>
                  <span className="zone-cta" style={{ color: z.color }}>Find Nearby →</span>
                </a>
              ))}
            </div>

            {/* Emergency Calls */}
            <div className="emergency-panel">
              <h3>🚨 Emergency Helplines</h3>
              <div className="helpline-grid">
                <a href="tel:112"  className="helpline-chip">📞 112 — Emergency</a>
                <a href="tel:100"  className="helpline-chip">🚔 100 — Police</a>
                <a href="tel:108"  className="helpline-chip">🚑 108 — Ambulance</a>
                <a href="tel:1091" className="helpline-chip">👩 1091 — Women Safety</a>
                <a href="tel:181"  className="helpline-chip">🆘 181 — Helpline</a>
                <a href="tel:1098" className="helpline-chip">👶 1098 — Child Line</a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
