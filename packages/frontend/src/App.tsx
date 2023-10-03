import { LoginPage, SignUpPage } from './Login/LoginPage'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import ResetPassword from './Login/ResetPassword'
import Home from './components/Home'
import { useQuery } from '@apollo/client'
import { ALL_USERS } from './queries'
import HomePage from './Home/Homepage'

function App() {
  const result = useQuery(ALL_USERS)
  if (!result.loading) {
    console.log(result.data)
  }
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/createpost" element={<div>Create Post</div>} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    </>
  )
}

export default App
