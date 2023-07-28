import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render( // Use createRoot instead of ReactDOM.render
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <App />
    </PersistGate>
  </Provider>
);


// import React from 'react';
// import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';
// import store from './store/store';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import 'bootstrap/dist/css/bootstrap.min.css';

// ReactDOM.render(
//   <Provider store={store}>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </Provider>,
//   document.getElementById('root')
// );

// reportWebVitals();


