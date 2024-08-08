import { configureStore } from '@reduxjs/toolkit'
import sessionReducer from './sessionSlice'
import newSessionLoginSlice from './newSessionLoginSlice'

export default configureStore({
  reducer: {
    session: sessionReducer,
    newSessionLogin: newSessionLoginSlice
  }
})