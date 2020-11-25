import React, { useState } from 'react'
import { Link, Prompt } from 'react-router-dom';

function Home() {
  const [save, setSave] = useState(false)
  return (
    <div>
      <h1>HOME</h1>
      <Link to="/login">Login</Link>
      <Link to="/e-flyer">e-Flyer</Link>
      <Link to="/qrcode-scanner">QR code Scanner</Link>
      <Prompt
        when={!save}
        message="You haven't save your project"
      />
    </div>
  )
}

export default Home
