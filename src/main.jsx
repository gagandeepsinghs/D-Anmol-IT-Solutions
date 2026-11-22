import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'
import './components/AdvisorBookingModal.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('The application root element is missing.')

const app = (
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

if (rootElement.hasChildNodes() && !(window.location.pathname === '/contact' && window.location.search)) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
