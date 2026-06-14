import { useRef, useCallback, useEffect } from 'react'

export function useAutoSave(callback: () => void, delay = 3000) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  const trigger = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => savedCallback.current(), delay)
  }, [delay])

  const cancel = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  useEffect(() => cancel, [cancel])

  return { trigger, cancel }
}