import { createSlice } from '@reduxjs/toolkit'

export const reservesSlice = createSlice({
  name: 'reserves',
  initialState: {
    reserves: [],
    balances:[],
    currentReserve:''
  },
  reducers: {
    changeReserves: (state, action) => {
      state.reserves = action.payload;
    },

    changeBalances:(state, action) =>{
      state.balances = action.payload
    },
    changeCurrentReserve:(state, action) =>{
      state.currentReserve = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const {  changeReserves } = reservesSlice.actions
export const {  changeBalances } = reservesSlice.actions
export const {  changeCurrentReserve } = reservesSlice.actions

export default reservesSlice.reducer