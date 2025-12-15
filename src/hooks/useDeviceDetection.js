import { useEffect, useState } from 'react'

export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isDesktop: !!navigator.maxTouchPoints ? 'mobile' : 'computer',
    orientation: !navigator.maxTouchPoints ? 'desktop' : !window.screen.orientation.angle ? 'portrait' : 'landscape'
  })

  useEffect(() => {
    function handleResize() {
      setDeviceInfo({
        isDesktop: !!navigator.maxTouchPoints ? 'mobile' : 'computer',
        orientation: !navigator.maxTouchPoints ? 'desktop' : !window.screen.orientation.angle ? 'portrait' : 'landscape'
      })
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return deviceInfo
}
