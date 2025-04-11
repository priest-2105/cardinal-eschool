import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import authReducer from "./authSlice";

const encryptor = encryptTransform({
  secretKey: 'my-super-secret-key',
  onError: function (error) {
    console.error('Encryption error:', error);
  },
});

const persistConfig = {
  key: 'root',
  storage,
  transforms: [encryptor],
};

// Explicitly handle undefined values in the persisted state
const rootReducer = combineReducers({
  auth: authReducer,
});

type RootReducerState = ReturnType<typeof rootReducer>;


const persistedReducer = persistReducer<Partial<RootReducerState>>(
  persistConfig,
  rootReducer as any 
);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
  });
};

export const store = makeStore();
export const persistor = persistStore(store);

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
