import React from 'react'

const Error404 = () => {
  return (
    <div>
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="flex flex-col items-center">
          <div className="flex md:gap-x-3 flex-col md:flex-row">
            <div className="flex-1 md:border-r-2">
              <h1 className="font-bold md:text-center text-green-600 text-8xl">
                404
              </h1>
            </div>
            <div className="flex-1 mt-3 md:mt-0 md:ml-3 place-self-center">
              <h6 className="md:mb-2 text-2xl font-bold text-gray-800 md:text-3xl">
                Page not found
              </h6>
              <p className="text-gray-500 md:text-sm">
                Please check the URL and try again.
              </p>
            </div>
          </div>
          <a
            href="/"
            className="px-6 py-2 my-3 text-sm font-semibold text-green-700 bg-green-200 rounded"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}

export default Error404
