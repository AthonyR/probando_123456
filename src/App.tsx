import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedLayout from './components/ProtectedLayout'
import AuthPage from './pages/AuthPage'
import RoomsPage from './pages/RoomsPage'
import RoomDetailPage from './pages/RoomDetailPage'
import MyBookingsPage from './pages/MyBookingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<AuthPage key="register" register />} />
        <Route path="/login" element={<AuthPage key="login" />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
