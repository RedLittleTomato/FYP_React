import React from 'react'
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>HOME</h1>
      <Link to="/login">Login</Link>
      <Link to="/e-flyer">e-Flyer</Link>
      <Link to="/qrcode-scanner">QR code Scanner</Link>
    </div>
  )
}

export default Home
