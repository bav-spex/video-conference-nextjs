import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: []
  },
  reducers: {},
  extraReducers: builder => {}
})

export default userSlice.reducer
