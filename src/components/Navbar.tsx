import React from 'react'
import Logo from './Logo'

const Navbar = () => {
  // wallet connection component data

  return (
    <div className="flex justify-between w-full px-12 py-6 bg-white">
      <Logo />
      <button>Connect</button>
    </div>
  )
}

export default Navbar
