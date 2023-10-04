import { createSlice } from '@reduxjs/toolkit'
import { User } from '../interfaces'

type State = {
  readonly user: User | null | undefined
  readonly token: string | null | undefined
}

// :-)
const initialState: State = {
  user: null,
  token: localStorage.getItem('user-token'),
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoggedIn(_state, action) {
      const { user, token } = action.payload
      localStorage.setItem('user-token', token)
      return {
        user,
        token,
      }
    },
    userLoggedOut() {
      localStorage.removeItem('user-token')
      return {
        user: null,
        token: null,
      }
    },
  },
})

export const { userLoggedIn, userLoggedOut } = userSlice.actions
export default userSlice.reducer
