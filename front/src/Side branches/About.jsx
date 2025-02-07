import React from 'react'
import './About.css'

const About = () => {
  return (
    <div className='page2'>
      <video autoPlay loop muted playsInline className='video-background' id='video2'>
        <source src="/video2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className='section2'>
        <h1>About</h1>
        <p>Cartina is a platform that helps you generate roadmaps for your exams.</p>
        <p>Our intelligent system analyzes your study patterns and creates personalized learning paths.</p>
        <p>Key features of Cartina include:</p>
        <ul>
          <li>Personalized study schedules</li>
          <li>Smart topic prioritization</li>
          <li>Progress tracking</li>
          <li>Resource recommendations</li>
        </ul>
       
      </div>
    </div>
  )
}

export default About