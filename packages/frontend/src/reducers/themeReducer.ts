import { createSlice } from '@reduxjs/toolkit'

const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches

export type ThemeState = 'dark' | 'light'

const initialState = {
  name: isDark ? 'dark' : 'light',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggle(state) {
      return state.name === 'dark' ? { name: 'light' } : { name: 'dark' }
    },
  },
})

export const { toggle } = themeSlice.actions
export default themeSlice.reducer
