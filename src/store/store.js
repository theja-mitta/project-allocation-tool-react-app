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


// import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
// import rootReducer from './reducers/rootReducer';

// const authMiddleware = (store) => (next) => (action) => {
//   const result = next(action);

//   // if (action.type === 'SET_JWT_TOKEN') {
//   //   localStorage.setItem('authToken', JSON.stringify(action.payload));
//   // } else if (action.type === 'CLEAR_JWT_TOKEN') {
//   //   localStorage.removeItem('authToken');
//   // }

//   return result;
// };

// const store = configureStore({
//   reducer: rootReducer,
//   middleware: [authMiddleware, ...getDefaultMiddleware()],
// });

// export default store;
