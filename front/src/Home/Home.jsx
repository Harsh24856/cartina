import React from 'react';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import './Home.css';
import Exam from '../Side branches/Exam';
import About from '../Side branches/About';
import Contact from '../Side branches/Contact';

const Home = () => {
  const { isAuthenticated, logout } = useAuth();
  
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
    <div className='container'>
      
      
      <div id="home" className='start' onMouseEnter={()=>{
        document.querySelector('.home_btn').style.backgroundColor = 'gray';
        document.querySelector('.home_btn').style.color = 'whitesmoke';
      }} onMouseLeave={()=>{
        document.querySelector('.home_btn').style.backgroundColor = 'transparent';
        document.querySelector('.home_btn').style.color = 'rgb(135, 133, 133)';
      }}>
        <div className='mid'>
          <h1>Generate Roadmap</h1>
          <Link to='/start_page'><button>Get Started</button></Link>
        </div>
      </div>
      <div id="about" className='about'>
        <h1>Hello there,</h1>
        <h2>Welcome to Cartina, your personalized AI-driven Roadmap generator</h2>
        <div className='about_web'>
          <div></div>
          <div className='features-container'>
            <div className='feature-box'>
              <i className="fa-solid fa-user-graduate"></i>
              <h3>Personalized Learning Paths</h3>
              <p>Tailored educational journeys just for you</p>
            </div>
            <div className='feature-box'>
              <i className="fa-solid fa-brain"></i>
              <h3>AI-Powered Roadmap Generation</h3>
              <p>Smart recommendations to guide your learning</p>
            </div>
            <div className='feature-box'>
              <i className="fa-solid fa-chart-line"></i>
              <h3>Track Your Progress</h3>
              <p>Monitor and visualize your learning advancement</p>
            </div>
          </div>
         
          </div>
        </div> 
      </div>
      <div id="exam" onMouseEnter={()=>{
        document.querySelector('.exam_btn').style.backgroundColor = 'gray';
        document.querySelector('.exam_btn').style.color = 'whitesmoke';
        
      }} onMouseLeave={()=>{
        document.querySelector('.exam_btn').style.backgroundColor = 'transparent';
        document.querySelector('.exam_btn').style.color = 'rgb(135, 133, 133)';
      }}>
        <Exam />
      </div>
      <div id="about-section" onMouseEnter={()=>{
        document.querySelector('.about_btn').style.backgroundColor = 'gray';
        document.querySelector('.about_btn').style.color = 'whitesmoke';
        
      }} onMouseLeave={()=>{
        document.querySelector('.about_btn').style.backgroundColor = 'transparent';
        document.querySelector('.about_btn').style.color = 'rgb(135, 133, 133)';
      }}>
        <About />
      </div>
      <div id="contact" className='contact_page' onMouseEnter={()=>{
        document.querySelector('.contact_btn').style.backgroundColor = 'gray';
        document.querySelector('.contact_btn').style.color = 'whitesmoke';
      }} onMouseLeave={()=>{
        document.querySelector('.contact_btn').style.backgroundColor = 'transparent';
        document.querySelector('.contact_btn').style.color = 'rgb(135, 133, 133)';
      }}>
        <div className='des'></div>
        <h1>Contact Us</h1>
        
      <Contact 
  name='Harsh Sehra' 
  github='https://github.com/Harsh24856' 
  linkedin='https://www.linkedin.com/in/harsh-sehra-223a81346/'
/><Contact 
  name='Vedant Angra' 
  github='https://github.com/Vedant1816' 
  linkedin='https://www.linkedin.com/in/vedant-angra-470970312/'
/><Contact 
  name='Ujjwal Dhawan' 
  github=': https://github.com/ujjwaldhawan' 
  linkedin='https://www.linkedin.com/in/ujjwal-dhawan-3a21a9325/'
/><Contact 
  name='Pradyumnan Thakur' 
  github='https://github.com/kriz-cell' 
  linkedin=''
/><Contact 
  name='Uday Salhan' 
  github='https://github.com/ch1mkin' 
  linkedin='https://auctiongenie.in'
/>
      </div>
    </div>
    
  );
};

export default Home;