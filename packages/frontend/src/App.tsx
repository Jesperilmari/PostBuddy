import { LoginPage, SignUpPage } from './Login/LoginPage'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import ResetPassword from './Login/ResetPassword'
import Home from './components/Home'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage></LoginPage>} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    </>
  )
}

export default App
