import { createSlice } from '@reduxjs/toolkit'

export const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    value: {
        username: 'admin',
        loggedIn: false
    }
  },
  reducers: {
    setSession: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = {
        ...state,
        loggedIn: true
      }
    },
    unsetSession: state => {
      state.value = {
        ...state,
        loggedIn: false
      }
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setSession, unsetSession, incrementByAmount } = sessionSlice.actions

export default sessionSlice.reducer