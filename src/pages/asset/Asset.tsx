import { navigate } from 'raviger'
import { useState, useEffect } from 'react'
import { isValidUUID } from '../../utils/common'

export const Asset = () => {
  const [id, setId] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (isValidUUID(id)) {
      navigate(`/assets/${id}`)
    }
  }

  useEffect(() => {
    if (id && !isValidUUID(id)) {
      setError('Invalid ID')
    } else {
      setError('')
    }
  }, [id])

  return (
    <section className="my-4">
      <div className="2xl:max-w-7xl mx-auto px-4">
        <div>
          <h1 className="mb-8 text-2xl font-bold text-slate-700 dark:text-slate-300">
            Search Asset
          </h1>
          <div className="flex gap-2">
            <input
              type="text"
              className="input text-xl py-2 px-4"
              placeholder="Enter asset id"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSubmit}>
              Search
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </section>
  )
}
