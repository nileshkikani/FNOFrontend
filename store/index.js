import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { persistReducer } from 'redux-persist';
import { authReducer } from '@/store/authSlice';
import { userReducer } from '@/store/userSlice';
import storage from "redux-persist/lib/storage"


const persistConfig = {
  key: "root",
  storage,
}

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});


export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
