import { createSlice } from '@reduxjs/toolkit'
import { markStates } from 'utils/misc'

const initialState = {
  isSidebarOpen: true,
  language: 'en',
  colorThemeMode: process.env.NEXT_PUBLIC_COMPANY,
  menuName: 'Home',
  subMenuName: '',
  notifications: [],
  isMeetingStarted: false
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    resetUIStore: state => {
      markStates(initialState, state)
    },
    markUI: (state, action) => {
      markStates(action.payload, state)
    },
    toggleSidebar: state => {
      state.isSidebarOpen = !state.isSidebarOpen
    }
  },
  extraReducers: builder => {}
})

export const { markUI, resetUIStore, toggleSidebar } = uiSlice.actions

export const selectIsSidebarOpen = state => state.uiReducer.isSidebarOpen

export const selectColorThemeMode = state => state.uiReducer.colorThemeMode

export const selectLanguage = state => state.uiReducer.language

export const selectMenuName = state => state.uiReducer.menuName

export const selectSubMenName = state => state.uiReducer.subMenuName

export const selectNotifications = state => state.uiReducer.notifications

export const selectIsMeetingStarted = state => state.uiReducer.isMeetingStarted

export default uiSlice.reducer
