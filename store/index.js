import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { persistReducer } from 'redux-persist';
import { authReducer } from '@/store/authSlice';
import { userReducer } from '@/store/userSlice';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    }
  };
};

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  whitelist: ['authState', 'isUser', 'isCookie', 'rememberMe']
};

const userPersistConfig = {
  key: 'user',
  storage: storage,
  whitelist: ['userEmail']
};

const persistedReducer = persistReducer(authPersistConfig, authReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const rootReducer = combineReducers({
  auth: persistedReducer,
  user: persistedUserReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});


export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
