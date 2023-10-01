
import {LoginPage, SignUpPage} from './Login/LoginPage'
import * as React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={<LoginPage></LoginPage>} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="*" element={<Navigate replace to='/login'/>}/>
      </Routes>  
    </>
  )
}

export default App
