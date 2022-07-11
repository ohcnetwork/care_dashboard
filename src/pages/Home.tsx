import React from 'react'
import { Link } from 'raviger'

export const Home = () => {
  return (
    <div>
      Hello Home
      <br />
      <Link className="underline" href={'/404'}>
        About
      </Link>
    </div>
  )
}
