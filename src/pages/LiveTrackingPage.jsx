import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import './LiveTrackingPage.css'

export default function LiveTrackingPage() {
  const [tracking, setTracking] = useState(false)
  const [location, setLocation] = useState(null)
  const [history, setHistory]   = useState([])
  const [elapsed, setElapsed]   = useState(0)
  const [shared, setShared]     = useState(false)
  const watchIdRef = useRef(null)
  const timerRef   = useRef(null)

  const startTracking = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported'); return }
    setTracking(true)
    setElapsed(0)
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          acc: pos.coords.accuracy,
          time: new Date().toLocaleTimeString(),
        }
        setLocation(loc)
        setHistory(h => [loc, ...h.slice(0, 9)])
      },
      (err) => { console.error(err); alert('Location error: ' + err.message) },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const stopTracking = () => {
    if (watchIdRef.current) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null }
    if (timerRef.current)   { clearInterval(timerRef.current); timerRef.current = null }
    setTracking(false)
  }

  const shareLocation = () => {
    if (!location) return
    const link = `https://www.google.com/maps?q=${location.lat},${location.lon}`
    const msg  = `🛡️ I am being tracked on SheShield. Live location: ${link}`
    if (navigator.share) { navigator.share({ title: 'My Live Location', text: msg, url: link }) }
    else { navigator.clipboard.writeText(link); alert('Location copied!') }
    setShared(true)
  }

  useEffect(() => () => stopTracking(), [])

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="lt-main">
        <div className="lt-header animate-fadeDown">
          <h1>📍 Live Tracking</h1>
          <p>Share your real-time GPS location with trusted contacts</p>
        </div>

        <div className="lt-layout">
          {/* ── CONTROL PANEL ── */}
          <div className="lt-control animate-fadeUp">
            <div className={`track-status-display ${tracking ? 'active' : ''}`}>
              <div className={`status-orb ${tracking ? 'pulsing' : ''}`}>
                {tracking ? '📡' : '🛰️'}
              </div>
              <div>
                <p className="status-title">{tracking ? 'TRACKING ACTIVE' : 'NOT TRACKING'}</p>
                {tracking && <p className="status-elapsed">{fmt(elapsed)} elapsed</p>}
              </div>
              {tracking && <div className="live-badge">LIVE</div>}
            </div>

            {!tracking ? (
              <button className="track-btn start" onClick={startTracking}>
                ▶ Start Live Tracking
              </button>
            ) : (
              <button className="track-btn stop" onClick={stopTracking}>
                ◼ Stop Tracking
              </button>
            )}

            {location && (
              <div className="coords-display">
                <div className="coord-row">
                  <span className="coord-label">Latitude</span>
                  <span className="coord-val">{location.lat.toFixed(6)}</span>
                </div>
                <div className="coord-row">
                  <span className="coord-label">Longitude</span>
                  <span className="coord-val">{location.lon.toFixed(6)}</span>
                </div>
                <div className="coord-row">
                  <span className="coord-label">Accuracy</span>
                  <span className="coord-val">±{Math.round(location.acc)}m</span>
                </div>
                <div className="coord-row">
                  <span className="coord-label">Updated</span>
                  <span className="coord-val">{location.time}</span>
                </div>
              </div>
            )}

            {location && (
              <div className="lt-actions">
                <button className={`share-btn ${shared ? 'shared' : ''}`} onClick={shareLocation}>
                  {shared ? '✅ Shared!' : '📤 Share Location'}
                </button>
                <a
                  href={`https://www.google.com/maps?q=${location.lat},${location.lon}`}
                  target="_blank"
                  rel="noreferrer"
                  className="maps-open-btn"
                >
                  🗺️ Open Maps
                </a>
              </div>
            )}

            {/* Contacts to notify */}
            <div className="notify-panel">
              <h3>📞 Notify Contacts</h3>
              <div className="notify-list">
                {[{ name: 'Mom', phone: '916380717258' }, { name: 'Friend', phone: '916384142900' }].map((c, i) => (
                  <div key={i} className="notify-row">
                    <span className="notify-name">{c.name}</span>
                    <a
                      href={location
                        ? `sms:${c.phone}?body=${encodeURIComponent(`🛡️ SheShield Tracking: https://maps.google.com?q=${location.lat},${location.lon}`)}`
                        : '#'
                      }
                      className={`notify-sms ${!location ? 'disabled' : ''}`}
                    >
                      📩 SMS
                    </a>
                    <a href={`tel:${c.phone}`} className="notify-call">📞</a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── HISTORY PANEL ── */}
          <div className="lt-history">
            <h3 className="history-title">📋 Location History</h3>
            {history.length === 0 ? (
              <div className="history-empty">
                <p>🛰️</p>
                <p>Start tracking to see location updates</p>
              </div>
            ) : (
              <div className="history-list">
                {history.map((h, i) => (
                  <div key={i} className={`history-item ${i === 0 ? 'latest' : ''}`}>
                    <span className="h-time">{h.time}</span>
                    <span className="h-coords">{h.lat.toFixed(5)}, {h.lon.toFixed(5)}</span>
                    <a
                      href={`https://www.google.com/maps?q=${h.lat},${h.lon}`}
                      target="_blank"
                      rel="noreferrer"
                      className="h-link"
                    >
                      →
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Safety Tips */}
            <div className="safety-tips-box">
              <h4>🛡️ Safety Reminders</h4>
              <ul>
                <li>Share your live link with at least 2 trusted people</li>
                <li>Keep your phone charged during travel</li>
                <li>Use SOS button if you feel unsafe at any moment</li>
                <li>Inform someone about your expected arrival time</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
