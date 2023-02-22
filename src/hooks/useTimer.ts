import { useEffect, useState } from 'react'

const useTimer = (simulatedAtTimestamp: number) => {
  const [timeSince, setTimeSince] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (simulatedAtTimestamp) {
        setTimeSince(new Date().valueOf() - simulatedAtTimestamp)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [simulatedAtTimestamp])

  return Math.trunc(timeSince / 1000)
}

export { useTimer }
