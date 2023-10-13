import { useEffect, useState } from "react"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import CssBaseline from "@mui/material/CssBaseline"
import TextField from "@mui/material/TextField"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import Link from "@mui/material/Link"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import Copyright from "../components/Copyright"
import { RegisterResponse } from "../interfaces"
import { REGISTER } from "../queries"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { userLoggedIn } from "../reducers/userReducer"
import { useMutation } from "@apollo/client"
import { Alert } from "@mui/material"

const loginUrl = "/login"

//checks that the data is valid
function ChecData(
  data: FormData,
  setInfo: React.Dispatch<React.SetStateAction<boolean>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>
) {
  const first = data.get("firstName") as string
  const last = data.get("lastName") as string
  const email = data.get("email") as string
  const username = data.get("userName") as string
  const emailRegex = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")
  const nametest = new RegExp("^[a-zA-Z]+$")
  console.log(first, last, email)

  if (first === "" || last === "" || email === "" || username === "") {
    setMessage("Please fill in all the fields")
    setInfo(true)
    return false
  }

  if (!emailRegex.test(email as string)) {
    setMessage("Please enter a valid email")
    setInfo(true)
    return false
  }
  if (!nametest.test(first) || !nametest.test(last)) {
    setMessage("Please enter a valid name")
    setInfo(true)
    return false
  }

  if (data.get("password") !== data.get("confirmPassword")) {
    setMessage("Passwords do not match")
    setInfo(true)
    return false
  }
  if ((data.get("password") as string).length < 5) {
    setMessage("Password must be at least 5 characters long")
    setInfo(true)
    return false
  }
  return true
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()

export default function SignUp() {
  const [register, { data, loading, error }] =
    useMutation<RegisterResponse>(REGISTER)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [info, setInfo] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!loading && data) {
      dispatch(userLoggedIn(data.register))
      console.log("Logged in as ", data.register.user)
      navigate("/", { replace: true })
    }
  }, [data, dispatch, navigate, loading])

  useEffect(() => {
    if (error) {
      console.log(error)
      setMessage("register failed: " + error.message)
      setInfo(true)
    }
  }, [error])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const ok = ChecData(data, setInfo, setMessage)
    if (ok) {
      const variables = {
        user: {
          username: data.get("username"),
          name: `${data.get("firstName")} ${data.get("lastName")}`,
          email: data.get("email"),
          password: data.get("password"),
        },
      }
      register({
        variables,
      })
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="retype-password"
                />
              </Grid>
              {info ? (
                <Grid item xs={12}>
                  <Alert
                    severity="error"
                    onClose={() => {
                      setInfo(false)
                    }}
                  >
                    {message}
                  </Alert>
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive spam and other marketing in my email weekly than you."
                />
              </Grid>
            </Grid>
            <p id='alert'
              style={{color: "red"}}
              >
                &nbsp;
              </p>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link variant="body2" onClick={() => navigate(loginUrl)}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright />
      </Container>
    </ThemeProvider>
  )
}
