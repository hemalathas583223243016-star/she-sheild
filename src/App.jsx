import { Routes, Route, Navigate } from 'react-router-dom'
import SplashScreen from './pages/SplashScreen'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import RoutePage from './pages/RoutePage'
import SafeZonePage from './pages/SafeZonePage'
import SOSPage from './pages/SOSPage'
import LiveTrackingPage from './pages/LiveTrackingPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/route" element={<RoutePage />} />
      <Route path="/safezone" element={<SafeZonePage />} />
      <Route path="/sos" element={<SOSPage />} />
      <Route path="/live" element={<LiveTrackingPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
