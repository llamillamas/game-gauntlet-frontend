'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useAppStore, useBetStore } from '@/lib/store'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'

interface WebSocketMessage {
  type: 'odds_update' | 'bet_settled' | 'party_update' | 'balance_update' | 'error'
  payload: unknown
}

interface OddsPayload {
  gameId: string
  odds: number
}

interface SettlementPayload {
  betId: string
  status: 'settled' | 'cancelled'
  winnings?: number
  txHash?: string
}

interface BalancePayload {
  usdcBalance: number
  solBalance: number
}

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const reconnectAttempts = useRef(0)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  
  const { setWsConnected, setIsOnline } = useAppStore()
  const { updateOdds, updateBet } = useBetStore()
  
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return
    
    try {
      wsRef.current = new WebSocket(WS_URL)
      
      wsRef.current.onopen = () => {
        console.log('[WS] Connected')
        setWsConnected(true)
        reconnectAttempts.current = 0
      }
      
      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          setLastMessage(message)
          
          switch (message.type) {
            case 'odds_update': {
              const { gameId, odds } = message.payload as OddsPayload
              updateOdds(gameId, odds)
              break
            }
            
            case 'bet_settled': {
              const { betId, status, winnings, txHash } = message.payload as SettlementPayload
              updateBet(betId, { status, winnings, txHash, settledAt: new Date() })
              break
            }
            
            case 'balance_update': {
              // Handled by parent component through lastMessage
              break
            }
            
            case 'error': {
              console.error('[WS] Server error:', message.payload)
              break
            }
          }
        } catch (err) {
          console.error('[WS] Failed to parse message:', err)
        }
      }
      
      wsRef.current.onclose = () => {
        console.log('[WS] Disconnected')
        setWsConnected(false)
        scheduleReconnect()
      }
      
      wsRef.current.onerror = (error) => {
        console.error('[WS] Error:', error)
      }
    } catch (err) {
      console.error('[WS] Connection failed:', err)
      scheduleReconnect()
    }
  }, [setWsConnected, updateOdds, updateBet])
  
  const scheduleReconnect = useCallback(() => {
    if (reconnectAttempts.current >= 5) {
      console.log('[WS] Max reconnect attempts reached')
      setIsOnline(false)
      return
    }
    
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
    reconnectAttempts.current++
    
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})`)
    
    reconnectTimeoutRef.current = setTimeout(() => {
      connect()
    }, delay)
  }, [connect, setIsOnline])
  
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    setWsConnected(false)
  }, [setWsConnected])
  
  const send = useCallback((type: string, payload: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }))
    } else {
      console.warn('[WS] Cannot send - not connected')
    }
  }, [])
  
  const subscribe = useCallback((channel: string) => {
    send('subscribe', { channel })
  }, [send])
  
  const unsubscribe = useCallback((channel: string) => {
    send('unsubscribe', { channel })
  }, [send])
  
  // Auto-connect on mount
  useEffect(() => {
    connect()
    
    // Handle online/offline
    const handleOnline = () => {
      setIsOnline(true)
      connect()
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      disconnect()
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      disconnect()
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [connect, disconnect, setIsOnline])
  
  return {
    connect,
    disconnect,
    send,
    subscribe,
    unsubscribe,
    lastMessage,
    isConnected: useAppStore((s) => s.wsConnected),
  }
}
