import { createTheme } from '@mui/material/styles'

const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#006876',
    },
    secondary: {
      main: '#006c4d',
    },
    text: {
      primary: '#006876',
      secondary: '#006c4d',
    },
    success: {
      main: '#87f8c8',
    },
    warning: {
      main: '#dbe1ff',
    },
    error: {
      main: '#ba1a1a',
    },
    background: {
      default: '#f5fff3',
      paper: '#f5fff3',
    },
    divider: '#6f797b',
  },
})

const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#51d7ee',
    },
    secondary: {
      main: '#6adbad',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#6adbad',
    },
    success: {
      main: '#6adbad',
    },
    warning: {
      main: '#4dd9e6',
    },
    error: {
      main: '#ffb4ab',
    },
    background: {
      default: '#191c1d',
      paper: '#2e3132',
    },
  },
})

export { lightTheme, darkTheme }
