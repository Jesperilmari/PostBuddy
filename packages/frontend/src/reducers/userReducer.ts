import { createSlice } from '@reduxjs/toolkit'

// :-)
const initialState = {
  user: null,
  token: localStorage.getItem('user-token'),
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoggedIn(state, action) {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      localStorage.setItem('user-token', token)
    },
    userLoggedOut(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('user-token')
    },
  },
})

export const { userLoggedIn, userLoggedOut } = userSlice.actions
export default userSlice.reducer
