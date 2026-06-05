import React from 'react'
import "./Footer.css"
import { Link } from 'react-router-dom'

const HOME = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_URL
    : "http://localhost:3002";

const Footer = () => {
  return (
    <div className='footer bg-white mt-5'>
        <p className='mb-0 pt-4 pb-4 text-center text-grey'>Copyright @ {new Date().getFullYear()} <a href={`${HOME}`} target="_blank">Vet and Pets</a>. All Rights Reserved.</p>
    </div>
  )
}

export default Footer