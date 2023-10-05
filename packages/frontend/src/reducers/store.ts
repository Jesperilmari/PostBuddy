import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import userReducer from './userReducer'
import { User } from '../interfaces'
import alertReducer from './alertReducer'

const rootReducer = combineReducers({
  user: userReducer,
  alert: alertReducer,
})

export type RootState = {
  user: {
    user?: User
    token?: string
  }
  alert: {
    active: boolean
    alert: {
        severity: 'success' | 'info' | 'warning' | 'error'
        message?: string | 'alert'
        title: string | null
        onClose: boolean
        timeout: number
        outlined: boolean
        filled: boolean
    }
  }
}

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk], // TODO: dunno if needed?
})

export default store
