import React from 'react'
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Home/Home'
import About from './Side branches/About'
import Contact from './Side branches/Contact'
import Exam from './Side branches/Exam'
import Login from './Side branches/Login'
import Signup from './Side branches/Signup'
import Start_page from './Side branches/Start_page'
import { AuthProvider } from './context/AuthContext'
import Outcome from './Side branches/outcome'
import ErrorBoundary from './components/ErrorBoundary'

const router = createBrowserRouter(
  [
    { path: "/", element: <Home /> },
    { path: "/about", element: <About /> },
    { path: "/exam", element: <Exam /> },
    { path: "/contact", element: <Contact /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/start_page", element: <Start_page /> },
    { path: "/outcome", element: <Outcome /> },
  ],
  {
    future: {
      v7_relativeSplatPath: true
    }
  }
)

const App = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </AuthProvider>
  )
}

export default App