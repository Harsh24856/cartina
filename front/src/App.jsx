import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import Profile from './Side branches/Profile'
import Header from './components/Header'

const App = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/exam" element={<Exam />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/start_page" element={<Start_page />} />
              <Route path="/outcome" element={<Outcome />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  );
};

export default App;