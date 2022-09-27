import React from 'react'
import { Link } from 'raviger'
import { ACTIVATED_DISTRICTS } from '../utils/constants'
import { parameterize } from '../utils/url'

export const Home = () => {
  return (
    <section className="my-4">
      <div className="2xl:max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-4">
          {ACTIVATED_DISTRICTS.map((district) => (
            <div
              key={district.id}
              className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 rounded-xl"
            >
              <h1 className="text-4xl text-slate-900 dark:text-white font-bold">
                {district.name}
              </h1>
              <Link
                href={`/district/${parameterize(district.name)}/capacity`}
                className="btn mt-8"
              >
                Go To Dashboard
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
