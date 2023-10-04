import { useEffect } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Copyright from '../components/Copyright'
import { RegisterResponse } from '../interfaces'
import { REGISTER } from '../queries'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { userLoggedIn } from '../reducers/userReducer'
import { useMutation } from '@apollo/client'

const loginUrl = 'https://localhost:5173/login'

//checks that the data is valid
function ChecData(data: FormData) {
  const first = data.get('firstName') as string
  const last = data.get('lastName') as string
  const email = data.get('email') as string
  const emailRegex = new RegExp('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$')
  const nametest = new RegExp('^[a-zA-Z]+$')
  console.log(first, last, email)
  if (first === '' || last === '' || email === '') {
    alert('Please fill in all fields')
    return
  }
  if (!emailRegex.test(email as string)) {
    alert('Please enter a valid email')
    return false
  }
  if (!nametest.test(first) || !nametest.test(last)) {
    alert('Please enter a valid name')
    return false
  }

  if (data.get('password') !== data.get('confirmPassword')) {
    alert('Passwords do not match')
    return false
  }
  if ((data.get('password') as string).length < 5) {
    alert('Password must be at least 5 characters long')
    return false
  }
  return true
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()

export default function SignUp() {
  const [register, { data, loading, error }] = useMutation<RegisterResponse>(REGISTER)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!loading && data) {
      dispatch(userLoggedIn(data.register))
      console.log('Logged in as ', data.register.user)
      navigate('/', { replace: true })
    }
  }, [data, dispatch, navigate, loading])

  if (error) {
    console.log(error)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const ok = ChecData(data)
    if (ok) {
      const variables = {
        user: {
          username: 'placeholder', // TODO: implement username
          name: `${data.get('firstName')} ${data.get('lastName')}}`,
          email: data.get('email'),
          password: data.get('password'),
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive spam and other marketing in my email weekly than you."
                />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href={loginUrl} variant="body2">
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
