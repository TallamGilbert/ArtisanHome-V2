import { useState, useEffect, useCallback, useRef } from 'react'

// Generic fetch hook
export function useApi(fn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fn()
      if (mountedRef.current) setData(res.data)
    } catch (err) {
      if (mountedRef.current) setError(err?.response?.data?.message || 'Something went wrong')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, deps) // eslint-disable-line

  useEffect(() => { fetch() }, [fetch])

  return { data, loading, error, refetch: fetch }
}

// Mutation hook (POST/PUT/DELETE)
export function useMutation(fn) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fn(...args)
      return res.data
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(', ')
        : 'Something went wrong'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fn])

  return { mutate, loading, error }
}