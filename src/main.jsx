import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import connectDB from './config/mongodb'

// Initialize MongoDB connection
connectDB()
  .then(() => console.log('MongoDB connection initialized'))
  .catch((error) => console.error('MongoDB connection error:', error));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />  
  </React.StrictMode>
)
