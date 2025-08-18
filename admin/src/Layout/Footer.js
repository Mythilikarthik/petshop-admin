import React from 'react'
import "./Footer.css"

const Footer = () => {
  return (
    <div className='footer bg-white mt-5'>
        <p className='mb-0 pt-4 pb-4 text-center text-grey'>Copyright @ {new Date().getFullYear()} Petshop Directory. All Rights Reserved.</p>
    </div>
  )
}

export default Footer