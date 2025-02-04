import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home/Home'
import About from './Side branches/About'
import Contact from './Side branches/Contact'
import Exam from './Side branches/Exam'
import Login from './Side branches/Login'
import Signup from './Side branches/Signup'
import Start_page from './Side branches/Start_page'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/start_page" element={<Start_page />} />
      </Routes>
    </BrowserRouter>

    
  )
}

export default App