import { configureStore } from '@reduxjs/toolkit'
import uiReducer from 'store/ui/uiSlice'

export const store = configureStore({
  reducer: {
    uiReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
