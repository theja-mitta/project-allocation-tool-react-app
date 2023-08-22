// store.js
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import persistedReducer from './reducers/rootReducer'; // Import the persistedReducer directly

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false, // Disable serializable check for all actions
  }),
});

const persistor = persistStore(store);

export { store, persistor };
