import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { ApolloProvider } from '@apollo/client'
import apolloClient from './apolloClient.ts'
import { Provider } from 'react-redux'
import store from './reducers/store.ts'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { lightTheme } from './themes.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      {/* Redux store */}
      <Provider store={store}>
        {/* Graphql client*/}
        <ApolloProvider client={apolloClient}>
          {/* React router */}
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ApolloProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
)
