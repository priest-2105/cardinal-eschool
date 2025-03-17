import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createEncryptor from 'redux-persist-transform-encrypt'
import authReducer from "./authSlice"

const encryptor = createEncryptor({
  secretKey: 'my-super-secret-key', // Use a secure key in production
  onError: function (error) {
    console.error('Encryption error:', error)
  },
})

const persistConfig = {
  key: 'root',
  storage,
  transforms: [encryptor],
}

const rootReducer = combineReducers({
  auth: authReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
  })
}

export const store = makeStore()
export const persistor = persistStore(store)

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']