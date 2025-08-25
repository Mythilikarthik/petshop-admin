import React from 'react'
import "./Footer.css"
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer bg-white mt-5'>
        <p className='mb-0 pt-4 pb-4 text-center text-grey'>Copyright @ {new Date().getFullYear()} <Link to="/">Petshop Directory</Link>. All Rights Reserved.</p>
    </div>
  )
}

export default Footer