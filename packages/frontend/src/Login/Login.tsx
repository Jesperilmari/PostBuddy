import React, { useEffect, useState } from "react"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import CssBaseline from "@mui/material/CssBaseline"
import TextField from "@mui/material/TextField"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import Link from "@mui/material/Link"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Typography from "@mui/material/Typography"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { useMutation } from "@apollo/client"
import { LOGIN } from "../queries"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { userLoggedIn } from "../reducers/userReducer"
import { LoginResponse } from "../interfaces"
import Copyright from "../components/Copyright"
import { Alert } from "@mui/material"

const signupUrl = "/signup"
const resetPasswordUrl = "/resetpassword"

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()

//checks that the data is valid
function checkData(
  data: FormData,
  setInfo: React.Dispatch<React.SetStateAction<boolean>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>
) {
  const email = data.get("email") as string
  const password = data.get("password") as string
  const emailRegex = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")
  if (password === "" || email === "") {
    setMessage("Please fill in all fields")
    setInfo(true)
    return false
  }
  if (!emailRegex.test(email as string)) {
    setMessage("Please enter a valid email")
    setInfo(true)
    return false
  }
  return true
}

export default function SignInSide() {
  const [login, { data, loading, error }] = useMutation<LoginResponse>(LOGIN)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [info, setInfo] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!loading && data) {
      dispatch(userLoggedIn(data.login))
      console.log("Logged in as ", data.login.user)
      navigate("/", { replace: true })
    }
  }, [data, dispatch, navigate, loading])

  useEffect(() => {
    if (error) {
      console.log(error)
      setInfo(true)
      setMessage("wrong password or email")
    }
  }, [error])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const ok = checkData(data, setInfo, setMessage)

    if (ok) {
      const variables = {
        usernameOrEmail: data.get("email"),
        password: data.get("password"),
      }
      login({
        variables,
      })
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Avatar
              sx={{ m: 1, bgcolor: "secondary.main", alignSelf: "center" }}
            >
              <LockOutlinedIcon />
            </Avatar>
            <Typography
              sx={{ alignSelf: "center" }}
              component="h1"
              variant="h5"
            >
              Login
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{
                mt: 1,
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {info ? (
                <Alert
                  severity="error"
                  onClose={() => {
                    setInfo(false)
                  }}
                >
                  {message}
                </Alert>
              ) : null}
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    variant="body2"
                    onClick={() => navigate(resetPasswordUrl)}
                  >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link variant="body2" onClick={() => navigate(signupUrl)}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}
