import React from 'react'
import './Contact.css'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

const Contact = ({ name, github, linkedin }) => {
  return (
      <div className='contact'>
        <h2>{name}</h2>
        <a href={github} target="_blank" rel="noopener noreferrer" className="github-icon">
          <FaGithub size={40} />
        </a>
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-icon">
          <FaLinkedin size={40} />
        </a>
      </div>
  )
}

export default Contact