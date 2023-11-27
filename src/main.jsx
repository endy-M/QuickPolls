import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Poll from './Poll';
import './App.css';
import './custom.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

if (process.env.NODE_ENV === 'production') disableReactDevTools();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer
      position="bottom-center"
      autoClose={500}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/poll/:id" element={<Poll />} />
        <Route path="/:id" element={<Navigate to={`/poll/:id`} replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
