import { useEffect } from 'react'
import axios from 'axios'

function PingIPanalitycs() {
  useEffect(() => {
    const callPingAnalytics = async () => {
      const STORAGE_KEY = 'ping_analytics_last_call'
      const COOLDOWN_MS = 300 * 1000 // 300 seconds in milliseconds
      
      try {
        // Get last call time from localStorage
        const lastCallTime = localStorage.getItem(STORAGE_KEY)
        const now = Date.now()
        
        // Check if we should make the call
        const shouldCall = !lastCallTime || (now - parseInt(lastCallTime)) > COOLDOWN_MS
        
        if (shouldCall) {
          // Make the API call
          await axios.get('/ip-analytics/ping')
          
          // Update the last call time in localStorage
          localStorage.setItem(STORAGE_KEY, now.toString())
          
          console.log('Ping analytics called successfully')
        } else {
          console.log('Ping analytics skipped - within cooldown period')
        }
      } catch (error) {
        console.error('Failed to call ping analytics:', error)
      }
    }

    callPingAnalytics()
  }, []) // Empty dependency array ensures this runs only once on mount

  return null // This component doesn't render anything
}

export default PingIPanalitycs
