import { useState, useEffect, useRef, useCallback } from 'react';

export interface InventoryWebSocketEvent {
  type: 'inventory_updated' | 'stock_movement' | 'low_stock_alert' | 'sync_complete' | 'sync_error' | 'connection' | 'subscribed' | 'unsubscribed' | 'error';
  data: any;
  timestamp: string;
  warehouse?: string;
  channel?: string;
}

export interface WebSocketHookOptions {
  url?: string;
  autoConnect?: boolean;
  autoReconnect?: boolean;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
  subscriptions?: string[];
}

export interface WebSocketState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  lastEvent: InventoryWebSocketEvent | null;
  subscriptions: string[];
  reconnectAttempts: number;
}

export function useInventoryWebSocket(options: WebSocketHookOptions = {}) {
  const {
    url = 'ws://localhost:8081',
    autoConnect = false, // Disable auto-connect until WebSocket server is available
    autoReconnect = false, // Disable auto-reconnect to prevent spam errors
    reconnectDelay = 5000,
    maxReconnectAttempts = 3,
    subscriptions = []
  } = options;

  const [state, setState] = useState<WebSocketState>({
    connected: false,
    connecting: false,
    error: null,
    lastEvent: null,
    subscriptions: [],
    reconnectAttempts: 0
  });

  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const eventListeners = useRef<Map<string, Set<(event: InventoryWebSocketEvent) => void>>>(new Map());

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setState(prev => ({ ...prev, connecting: true, error: null }));

    try {
      // Check if WebSocket is supported
      if (typeof WebSocket === 'undefined') {
        throw new Error('WebSocket is not supported in this environment');
      }

      // Check if URL is reachable (simplified check)
      if (!url || url.includes('localhost:8081')) {
        console.info('WebSocket server not configured or unavailable, real-time features disabled');
        setState(prev => ({
          ...prev,
          error: 'Real-time server not available',
          connecting: false
        }));
        return;
      }

      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setState(prev => ({
          ...prev,
          connected: true,
          connecting: false,
          error: null,
          reconnectAttempts: 0
        }));

        // Subscribe to initial channels
        if (subscriptions.length > 0) {
          subscribe(subscriptions);
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const message: InventoryWebSocketEvent = JSON.parse(event.data);
          
          setState(prev => ({ ...prev, lastEvent: message }));

          // Trigger event listeners
          const listeners = eventListeners.current.get(message.type) || new Set();
          listeners.forEach(listener => listener(message));

          // Handle subscription confirmations
          if (message.type === 'subscribed' && message.data?.channels) {
            setState(prev => ({
              ...prev,
              subscriptions: [...new Set([...prev.subscriptions, ...message.data.channels])]
            }));
          }

          if (message.type === 'unsubscribed' && message.data?.channels) {
            setState(prev => ({
              ...prev,
              subscriptions: prev.subscriptions.filter(sub => !message.data.channels.includes(sub))
            }));
          }

        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.reason);
        setState(prev => ({
          ...prev,
          connected: false,
          connecting: false,
          subscriptions: []
        }));

        // Auto-reconnect if enabled
        if (autoReconnect && state.reconnectAttempts < maxReconnectAttempts) {
          setState(prev => ({ ...prev, reconnectAttempts: prev.reconnectAttempts + 1 }));
          
          reconnectTimeout.current = setTimeout(() => {
            console.log(`Attempting to reconnect (${state.reconnectAttempts + 1}/${maxReconnectAttempts})`);
            connect();
          }, reconnectDelay);
        }
      };

      ws.current.onerror = (error) => {
        console.warn('WebSocket connection failed (this is expected if no WebSocket server is running)');
        setState(prev => ({
          ...prev,
          error: 'WebSocket server unavailable',
          connecting: false
        }));
      };

    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to create WebSocket connection',
        connecting: false
      }));
    }
  }, [url, autoReconnect, reconnectDelay, maxReconnectAttempts, subscriptions, state.reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }

    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }

    setState(prev => ({
      ...prev,
      connected: false,
      connecting: false,
      subscriptions: [],
      reconnectAttempts: 0
    }));
  }, []);

  const subscribe = useCallback((channels: string[]) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'subscribe',
        channels
      }));
    }
  }, []);

  const unsubscribe = useCallback((channels: string[]) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'unsubscribe',
        channels
      }));
    }
  }, []);

  const addEventListener = useCallback((eventType: string, listener: (event: InventoryWebSocketEvent) => void) => {
    if (!eventListeners.current.has(eventType)) {
      eventListeners.current.set(eventType, new Set());
    }
    eventListeners.current.get(eventType)!.add(listener);

    // Return cleanup function
    return () => {
      eventListeners.current.get(eventType)?.delete(listener);
    };
  }, []);

  const removeEventListener = useCallback((eventType: string, listener: (event: InventoryWebSocketEvent) => void) => {
    eventListeners.current.get(eventType)?.delete(listener);
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      disconnect();
    };
  }, [disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    addEventListener,
    removeEventListener,
    sendMessage
  };
}

// Helper hooks for specific event types
export function useInventoryUpdates(callback: (event: InventoryWebSocketEvent) => void) {
  const { addEventListener, connected } = useInventoryWebSocket({
    subscriptions: ['inventory_updates']
  });

  useEffect(() => {
    if (connected) {
      return addEventListener('inventory_updated', callback);
    }
  }, [addEventListener, callback, connected]);
}

export function useStockMovements(callback: (event: InventoryWebSocketEvent) => void) {
  const { addEventListener, connected } = useInventoryWebSocket({
    subscriptions: ['stock_movements']
  });

  useEffect(() => {
    if (connected) {
      return addEventListener('stock_movement', callback);
    }
  }, [addEventListener, callback, connected]);
}

export function useLowStockAlerts(callback: (event: InventoryWebSocketEvent) => void) {
  const { addEventListener, connected } = useInventoryWebSocket({
    subscriptions: ['low_stock_alerts']
  });

  useEffect(() => {
    if (connected) {
      return addEventListener('low_stock_alert', callback);
    }
  }, [addEventListener, callback, connected]);
}

export function useSyncStatus(callback: (event: InventoryWebSocketEvent) => void) {
  const { addEventListener, connected } = useInventoryWebSocket({
    subscriptions: ['sync_status']
  });

  useEffect(() => {
    if (connected) {
      const cleanup1 = addEventListener('sync_complete', callback);
      const cleanup2 = addEventListener('sync_error', callback);
      
      return () => {
        cleanup1();
        cleanup2();
      };
    }
  }, [addEventListener, callback, connected]);
}
