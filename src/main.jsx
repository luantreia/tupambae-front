import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { LocationProvider } from './context/LocationContext'
import { NotificationProvider } from './context/NotificationContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <LocationProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </LocationProvider>
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>,
)
