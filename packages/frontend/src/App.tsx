import { LoginPage, SignUpPage } from "./Login/LoginPage"
import { Routes, Route, Navigate } from "react-router-dom"
import "./App.css"
import ResetPassword from "./Login/ResetPassword"
import MainContent from "./components/MainContent"
import { ThemeProvider, CssBaseline } from "@mui/material"
import { darkTheme, lightTheme } from "./themes"
import { useSelector } from "react-redux"
import { ThemeState } from "./reducers/themeReducer"
import { RootState } from "./reducers/store"

function App() {
  const theme = useSelector<RootState, ThemeState>((state) => state.theme.name)
  const selected = theme === "dark" ? darkTheme : lightTheme
  return (
    <>
      <ThemeProvider theme={selected}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="*" element={<Navigate replace to="/login" />} />
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
