import { useEffect, useState } from 'react'

interface WindowSize {
  width: number
  height: number
}

function useWindowSize(propWidth?: number, propHeight?: number): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: global.window?.innerWidth || propWidth || 1920,
    height: global.window?.innerHeight || propHeight || 1080,
  })

  useEffect(() => {
    const handler = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Set size at the first client-side load
    // handler()
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])

  return windowSize
}

export default useWindowSize
