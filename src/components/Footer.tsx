import React from 'react'

const Footer = () => {
  return (
    <div className="flex justify-between w-full px-12 bg-white py-7">
      <div className="text-base">
        UniSwapper © 2022 xToken, LLC. All rights reserved.
      </div>
      <div className="flex">
        <img
          className="cursor-pointer mr-7"
          alt="Twitter"
          src="/assets/twitter.svg"
          onClick={() => window.open('https://twitter.com', '_blank')}
        />
        <img
          className="cursor-pointer"
          alt="Github"
          src="/assets/github.svg"
          onClick={() => window.open('https://github.com', '_blank')}
        />
      </div>
    </div>
  )
}

export default Footer
