import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import userReducer from './userReducer'
import { User } from '../interfaces'

const rootReducer = combineReducers({
  user: userReducer,
})

export type RootState = {
  user: {
    user?: User
    token?: string
  }
}

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk], // TODO: dunno if needed?
})

export default store
