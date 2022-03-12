import { createSlice } from '@reduxjs/toolkit'

export const networkSlice = createSlice({
  name: 'network',
  initialState: {
    name: "Kovan",
  },
  reducers: {
    changeNetwork: (state, action) => {
      state.name = action.payload.name;
    },
  },
})

// Action creators are generated for each case reducer function
export const {  changeNetwork } = networkSlice.actions

export default networkSlice.reducer