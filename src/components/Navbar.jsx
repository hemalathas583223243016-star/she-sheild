import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const links = [
    { to: '/home',     label: 'Home',         icon: '🏠' },
    { to: '/route',    label: 'Safe Route',   icon: '🗺️' },
    { to: '/safezone', label: 'Safe Zone',    icon: '🧭' },
    { to: '/sos',      label: 'SOS',          icon: '🚨' },
    { to: '/live',     label: 'Live Track',   icon: '📍' },
  ]

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Brand */}
        <div className="nav-brand" onClick={() => navigate('/home')}>
          <svg viewBox="0 0 40 46" fill="none" className="nav-shield">
            <path d="M20 2L4 10V22C4 32 11 40 20 44C29 40 36 32 36 22V10L20 2Z"
              fill="url(#navGrad)" />
            <path d="M13 23L19 29L28 18" stroke="white" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="navGrad" x1="4" y1="2" x2="36" y2="44" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ff2d78" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <span className="nav-logo-text">SheShield</span>
        </div>

        {/* Desktop Links */}
        <div className="nav-links">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </div>

        {/* SOS Quick Button */}
        <button className="nav-sos-btn" onClick={() => navigate('/sos')}>
          🚨 SOS
        </button>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <span>{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
