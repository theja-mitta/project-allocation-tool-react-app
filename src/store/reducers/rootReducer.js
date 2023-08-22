// rootReducer.js
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // or any other storage you prefer
import authSlice from './authReducer'; // Import the authSlice, not the authReducer

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice, 
  // Add other reducers here if needed
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
