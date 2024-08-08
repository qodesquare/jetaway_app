import { createSlice } from '@reduxjs/toolkit'

export const newSessionLoginSlice = createSlice({
  name: 'newSessionLogin',
  initialState: {
    value: false
  },
  reducers: {
    setActive: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = true
    },
    setInActive: state => {
      state.value = false
    }
  }
})

// Action creators are generated for each case reducer function
export const { setActive, setInActive } = newSessionLoginSlice.actions

export default newSessionLoginSlice.reducer