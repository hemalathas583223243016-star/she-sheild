import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import './SOSPage.css'

const STORAGE_KEY = 'sheshield_contacts'

function loadContacts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
  catch { return [] }
}

export default function SOSPage() {
  /* ── State ── */
  const [status, setStatus]       = useState('idle')    // idle | locating | countdown | sent
  const [location, setLocation]   = useState(null)
  const [countdown, setCountdown] = useState(null)
  const [contacts, setContacts]   = useState(loadContacts)
  const [showForm, setShowForm]   = useState(false)
  const [newName, setNewName]     = useState('')
  const [newPhone, setNewPhone]   = useState('')
  const [formErr, setFormErr]     = useState('')
  const [voiceOn, setVoiceOn]     = useState(false)
  const [voiceText, setVoiceText] = useState('Tap to activate secret voice trigger')
  const [shakeOn, setShakeOn]     = useState(false)
  const [log, setLog]             = useState([])
  const recogRef  = useRef(null)
  const lastAccRef = useRef(null)
  const countRef  = useRef(null)

  /* Save contacts to localStorage whenever they change */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts))
  }, [contacts])

  const addLog = (msg) =>
    setLog(prev => [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev.slice(0, 7)])

  /* ────────────────────────────────────────
     CONTACT MANAGEMENT
  ──────────────────────────────────────── */
  const addContact = () => {
    const name  = newName.trim()
    const phone = newPhone.trim().replace(/\s+/g, '')
    if (!name)             { setFormErr('Please enter a name'); return }
    if (!/^\+?\d{7,15}$/.test(phone)) { setFormErr('Enter a valid phone number (7–15 digits)'); return }
    if (contacts.length >= 5)          { setFormErr('Maximum 5 contacts allowed'); return }
    setContacts(prev => [...prev, { id: Date.now(), name, phone }])
    setNewName(''); setNewPhone(''); setFormErr(''); setShowForm(false)
  }

  const removeContact = (id) => setContacts(prev => prev.filter(c => c.id !== id))

  /* ────────────────────────────────────────
     GPS
  ──────────────────────────────────────── */
  const getLocation = () => new Promise((res, rej) => {
    if (!navigator.geolocation) { rej('Geolocation not supported'); return }
    navigator.geolocation.getCurrentPosition(
      p  => res({ lat: p.coords.latitude, lon: p.coords.longitude }),
      () => rej('Location access denied')
    )
  })

  /* ────────────────────────────────────────
     MAIN SOS TRIGGER
  ──────────────────────────────────────── */
  const triggerSOS = async () => {
    if (status !== 'idle') return
    if (contacts.length === 0) {
      alert('⚠️ Please add at least one emergency contact before triggering SOS.')
      setShowForm(true)
      return
    }

    setStatus('locating')
    addLog('📡 Acquiring GPS location...')

    try {
      const loc = await getLocation()
      setLocation(loc)
      addLog(`✅ Location: ${loc.lat.toFixed(4)}, ${loc.lon.toFixed(4)}`)
      setStatus('countdown')

      let c = 5
      setCountdown(c)
      countRef.current = setInterval(() => {
        c--
        setCountdown(c)
        if (c <= 0) {
          clearInterval(countRef.current)
          setCountdown(null)
          setStatus('sent')
          addLog(`🚨 SOS alert sent to ${contacts.length} contact(s)!`)
        }
      }, 1000)
    } catch (e) {
      addLog(`❌ ${e}`)
      setStatus('idle')
    }
  }

  const cancelSOS = () => {
    clearInterval(countRef.current)
    setStatus('idle')
    setCountdown(null)
    setLocation(null)
    addLog('🚫 SOS cancelled by user')
  }

  /* ────────────────────────────────────────
     VOICE TRIGGER
  ──────────────────────────────────────── */
  const toggleVoice = () => {
    if (voiceOn) {
      recogRef.current?.stop()
      setVoiceOn(false)
      setVoiceText('Tap to activate secret voice trigger')
      addLog('🎤 Voice trigger off')
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setVoiceText('❌ Not supported on this browser'); return }
    const r = new SR()
    r.lang = 'en-US'
    r.continuous = true
    r.onresult = (e) => {
      const t = e.results[e.results.length - 1][0].transcript.toLowerCase()
      setVoiceText(`Heard: "${t}"`)
      const triggers = ["help me", "save me", "hello who's this", "hello who is this", "danger"]
      if (triggers.some(kw => t.includes(kw))) {
        addLog('🎤 Voice trigger activated!')
        r.stop(); setVoiceOn(false)
        triggerSOS()
      }
    }
    r.onerror = () => { setVoiceText('⚠️ Mic error — try again'); setVoiceOn(false) }
    r.start()
    recogRef.current = r
    setVoiceOn(true)
    setVoiceText('🎤 Listening — say "Help Me", "Save Me" or "Danger"')
    addLog('🎤 Voice trigger on')
  }

  /* ────────────────────────────────────────
     SHAKE DETECTION
  ──────────────────────────────────────── */
  const shakeHandlerRef = useRef(null)
  const toggleShake = () => {
    if (shakeOn) {
      window.removeEventListener('devicemotion', shakeHandlerRef.current)
      setShakeOn(false); addLog('📳 Shake detection off'); return
    }
    shakeHandlerRef.current = (e) => {
      const a = e.accelerationIncludingGravity
      if (!a) return
      const cur = a.x + a.y + a.z
      if (lastAccRef.current !== null && Math.abs(cur - lastAccRef.current) > 25) {
        addLog('📳 Shake detected!')
        window.removeEventListener('devicemotion', shakeHandlerRef.current)
        setShakeOn(false)
        triggerSOS()
      }
      lastAccRef.current = cur
    }
    window.addEventListener('devicemotion', shakeHandlerRef.current)
    setShakeOn(true); addLog('📳 Shake detection on')
  }

  /* ────────────────────────────────────────
     COMPUTED
  ──────────────────────────────────────── */
  const mapsLink = location
    ? `https://www.google.com/maps?q=${location.lat},${location.lon}`
    : null

  const smsBody = location
    ? encodeURIComponent(
        `🚨 EMERGENCY! I need immediate help!\n📍 My live location: ${mapsLink}\n\n— Sent via SheShield Safety App`
      )
    : ''

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="sos-main">

        <div className="sos-header animate-fadeDown">
          <h1>🚨 Emergency SOS</h1>
          <p>Tap the button — your live GPS location is instantly sent to your saved contacts</p>
        </div>

        <div className="sos-layout">

          {/* ══════════════════════════════
              LEFT — BIG SOS BUTTON
          ══════════════════════════════ */}
          <div className="sos-center-col">
            <div className="sos-rings">
              <div className="ring ring-1" />
              <div className="ring ring-2" />
              <div className="ring ring-3" />

              <button
                className={`sos-button ${status}`}
                onClick={status === 'idle' ? triggerSOS : undefined}
                disabled={status === 'locating'}
              >
                {status === 'idle'      && <><span className="sos-label">SOS</span><span className="sos-sub">TAP TO ALERT</span></>}
                {status === 'locating'  && <><span className="sos-label">📡</span><span className="sos-sub">LOCATING...</span></>}
                {status === 'countdown' && countdown !== null && <><span className="sos-label">{countdown}</span><span className="sos-sub">SENDING IN...</span></>}
                {status === 'sent'      && <><span className="sos-label">✅</span><span className="sos-sub">ALERT SENT!</span></>}
              </button>
            </div>

            {/* What SOS does — transparent explanation */}
            <div className="sos-how-it-works">
              <p className="how-title">⚡ What happens when you tap SOS?</p>
              <ol>
                <li>📡 Your GPS location is captured</li>
                <li>🔗 A Google Maps link of your location is created</li>
                <li>📩 An SMS is prepared for each of your saved contacts</li>
                <li>✅ You tap "Send" on the SMS links to dispatch alerts</li>
              </ol>
            </div>

            {/* Countdown cancel */}
            {(status === 'countdown' || status === 'sent') && (
              <button className="cancel-btn" onClick={cancelSOS}>
                🚫 Cancel & Reset
              </button>
            )}
          </div>

          {/* ══════════════════════════════
              RIGHT — CONTROLS
          ══════════════════════════════ */}
          <div className="sos-right-col">

            {/* ── CONTACTS MANAGER ── */}
            <div className="sos-card contacts-card">
              <div className="card-head">
                <h3>📞 Emergency Contacts</h3>
                <span className="contact-count">{contacts.length}/5</span>
              </div>
              <p className="card-sub">
                Your contacts are saved locally on your device — never uploaded or shared.
              </p>

              {contacts.length === 0 ? (
                <div className="no-contacts">
                  <span>👥</span>
                  <p>No contacts added yet. Add someone you trust.</p>
                </div>
              ) : (
                <div className="contacts-list">
                  {contacts.map((c) => (
                    <div key={c.id} className="contact-row">
                      <div className="c-avatar">{c.name[0].toUpperCase()}</div>
                      <div className="c-info">
                        <span className="c-name">{c.name}</span>
                        {/* Phone shown only if SOS is active with location */}
                        {status === 'sent' || status === 'countdown'
                          ? <span className="c-phone-visible">📞 {c.phone}</span>
                          : <span className="c-phone-hidden">••••••••••</span>
                        }
                      </div>
                      {/* SMS link — only shown after location is acquired */}
                      {location && (
                        <a
                          href={`sms:${c.phone}?body=${smsBody}`}
                          className="sms-send-btn"
                          title="Send SMS Alert"
                        >
                          📩 Send
                        </a>
                      )}
                      {/* Delete only in idle state */}
                      {status === 'idle' && (
                        <button className="delete-contact" onClick={() => removeContact(c.id)} title="Remove">
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add Contact */}
              {contacts.length < 5 && !showForm && (
                <button className="add-contact-btn" onClick={() => setShowForm(true)}>
                  + Add Emergency Contact
                </button>
              )}

              {showForm && (
                <div className="add-form animate-scale">
                  <input
                    className="form-input"
                    placeholder="Contact Name (e.g. Mom)"
                    value={newName}
                    onChange={e => { setNewName(e.target.value); setFormErr('') }}
                    maxLength={30}
                  />
                  <input
                    className="form-input"
                    placeholder="Phone with country code (e.g. +919876543210)"
                    value={newPhone}
                    onChange={e => { setNewPhone(e.target.value); setFormErr('') }}
                    type="tel"
                    maxLength={16}
                  />
                  {formErr && <p className="form-err">⚠️ {formErr}</p>}
                  <div className="form-actions">
                    <button className="form-save" onClick={addContact}>Save Contact</button>
                    <button className="form-cancel" onClick={() => { setShowForm(false); setFormErr('') }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>

            {/* ── VOICE TRIGGER ── */}
            <div className="sos-card">
              <h3>🎤 Secret Voice Trigger</h3>
              <p className="card-sub">Say a trigger phrase — SOS fires automatically, no one knows</p>
              <button className={`toggle-btn ${voiceOn ? 'active' : ''}`} onClick={toggleVoice}>
                {voiceOn ? '🔴 Listening — speak now' : '🎤 Enable Voice Trigger'}
              </button>
              <p className="status-text">{voiceText}</p>
              {voiceOn && (
                <div className="trigger-phrases">
                  <p>Say any of these:</p>
                  <div className="phrases">
                    {['"Help Me"', '"Save Me"', '"Danger"', '"Hello who\'s this"'].map((p, i) => (
                      <span key={i} className="phrase-chip">{p}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── SHAKE ── */}
            <div className="sos-card">
              <h3>📳 Shake to Alert</h3>
              <p className="card-sub">Shake your phone hard — SOS triggers automatically</p>
              <button className={`toggle-btn ${shakeOn ? 'active' : ''}`} onClick={toggleShake}>
                {shakeOn ? '✅ Shake detection ON' : '📳 Enable Shake Detection'}
              </button>
            </div>

            {/* ── QUICK CALLS ── */}
            <div className="sos-card">
              <h3>🏥 Quick Emergency Numbers</h3>
              <p className="card-sub">Tap to call instantly</p>
              <div className="call-grid">
                <a href="tel:112"  className="call-chip red">📞 112 — Emergency</a>
                <a href="tel:100"  className="call-chip blue">🚔 100 — Police</a>
                <a href="tel:108"  className="call-chip orange">🚑 108 — Ambulance</a>
                <a href="tel:1091" className="call-chip pink">👩 1091 — Women</a>
              </div>
            </div>

            {/* ── LOG ── */}
            {log.length > 0 && (
              <div className="sos-card log-card">
                <h3>📋 Activity Log</h3>
                <div className="log-list">
                  {log.map((l, i) => <p key={i} className="log-item">{l}</p>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
