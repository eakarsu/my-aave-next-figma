import { configureStore } from '@reduxjs/toolkit'
import networkReducer from './slices/network-slice'
import appReducer from './slices/app-slice'
import reservesReducer from './slices/reserves-slice'

export default configureStore({
  reducer: {
      app:appReducer,
      network:networkReducer,
      reserves:reservesReducer,
  },
  
})