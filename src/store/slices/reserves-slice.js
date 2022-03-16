import { createSlice } from '@reduxjs/toolkit'

export const reservesSlice = createSlice({
  name: 'reserves',
  initialState: {
    reserves: [],
    reserveData:[],
    ltvData:[],
    pricesETH:[],
    balances:[],
    deposited:[],
    borrowable:[],
    borrowed:[],
    currentReserve:''
  },
  reducers: {
    changeReserves: (state, action) => {
      state.reserves = action.payload;
    },
    
    changeReserveData:(state, action) =>{
      state.reserveData = action.payload
    },

    changeLtvData:(state, action)=>{
      state.ltvData = action.payload
    },
    
    changePricesETH:(state, action) =>{
      state.pricesETH = action.payload
    },

    changeBalances:(state, action) =>{
      state.balances = action.payload
    },
    changeDeposited:(state, action) =>{
      state.deposited = action.payload
    },
    changeCurrentReserve:(state, action) =>{
      state.currentReserve = action.payload
    },
    changeBorrowable:(state, action) =>{
      state.borrowable = action.payload
    },

    changeBorrowed:(state, action) =>{
      state.borrowed = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const {  changeReserves } = reservesSlice.actions
export const {  changeBalances } = reservesSlice.actions
export const {  changeCurrentReserve } = reservesSlice.actions
export const {  changeReserveData } = reservesSlice.actions
export const {  changeLtvData } = reservesSlice.actions
export const {  changeDeposited } = reservesSlice.actions
export const {  changeBorrowable } = reservesSlice.actions
export const {  changeBorrowed } = reservesSlice.actions
export const {  changePricesETH } = reservesSlice.actions

export default reservesSlice.reducer