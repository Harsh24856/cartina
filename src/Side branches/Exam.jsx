import React from 'react'
import './Exam.css'
import { Link } from 'react-router-dom';
const Exam = () => {
  return (
    <div className='container2'>
      <div className='exam'>
        <h1>Courses</h1>
        <div className='exam_container1'>
            <div className='exam_box1'>
                <h2>Engineering </h2>
                <p>Preparing for  JEE(main), JEE(advanced), GATE, etc.</p>
                <Link to='/start_page'><button className='exam-btn'>Get Started</button></Link>
            </div>
            <div className='exam_box2'> 
                <h2>Medical</h2>
                <p>Preparing for NEET UG ,NEET PG , AIPMT, etc.</p>
                <Link to='/start_page'><button className='exam-btn'>Get Started</button></Link>
            </div>
            <div className='exam_box3'>
                <h2>Other Exams</h2>
                <p>Prepare for CLAT, BBA, BCA,CBSE Board Exams, etc.</p>
                <Link to='/start_page'><button className='exam-btn'>Get Started</button></Link>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Exam