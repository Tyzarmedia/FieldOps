import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { getSyncService, SyncEvent } from '../services/syncService';

interface ClientConnection {
  ws: WebSocket;
  id: string;
  subscriptions: Set<string>;
  lastPing: number;
}

export class InventoryWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, ClientConnection> = new Map();
  private pingInterval: NodeJS.Timeout;

  constructor(port: number = 8081) {
    this.wss = new WebSocketServer({ port });
    this.setupEventListeners();
    this.startPingInterval();
    
    console.log(`WebSocket server started on port ${port}`);
  }

  private setupEventListeners() {
    const syncService = getSyncService();

    this.wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
      const clientId = this.generateClientId();
      const client: ClientConnection = {
        ws,
        id: clientId,
        subscriptions: new Set(),
        lastPing: Date.now()
      };

      this.clients.set(clientId, client);
      
      console.log(`Client connected: ${clientId}`);

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'connection',
        data: { clientId, message: 'Connected to inventory WebSocket server' },
        timestamp: new Date().toISOString()
      });

      // Handle incoming messages
      ws.on('message', (message: Buffer) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleClientMessage(clientId, data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          this.sendToClient(clientId, {
            type: 'error',
            data: { message: 'Invalid JSON message' },
            timestamp: new Date().toISOString()
          });
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        console.log(`Client disconnected: ${clientId}`);
        this.clients.delete(clientId);
      });

      // Handle pong response
      ws.on('pong', () => {
        const client = this.clients.get(clientId);
        if (client) {
          client.lastPing = Date.now();
        }
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });
    });

    // Listen to sync service events
    syncService.on('inventory_updated', (event: SyncEvent) => {
      this.broadcastToSubscribers('inventory_updates', event);
    });

    syncService.on('stock_movement', (event: SyncEvent) => {
      this.broadcastToSubscribers('stock_movements', event);
    });

    syncService.on('low_stock_alert', (event: SyncEvent) => {
      this.broadcastToSubscribers('low_stock_alerts', event);
    });

    syncService.on('sync_complete', (event: SyncEvent) => {
      this.broadcastToSubscribers('sync_status', event);
    });

    syncService.on('sync_error', (event: SyncEvent) => {
      this.broadcastToSubscribers('sync_status', event);
    });
  }

  private handleClientMessage(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (message.type) {
      case 'subscribe':
        this.handleSubscription(clientId, message.channels || []);
        break;
        
      case 'unsubscribe':
        this.handleUnsubscription(clientId, message.channels || []);
        break;
        
      case 'ping':
        this.sendToClient(clientId, {
          type: 'pong',
          data: { timestamp: new Date().toISOString() },
          timestamp: new Date().toISOString()
        });
        break;
        
      case 'get_subscriptions':
        this.sendToClient(clientId, {
          type: 'subscriptions',
          data: { subscriptions: Array.from(client.subscriptions) },
          timestamp: new Date().toISOString()
        });
        break;
        
      default:
        this.sendToClient(clientId, {
          type: 'error',
          data: { message: `Unknown message type: ${message.type}` },
          timestamp: new Date().toISOString()
        });
    }
  }

  private handleSubscription(clientId: string, channels: string[]) {
    const client = this.clients.get(clientId);
    if (!client) return;

    const validChannels = ['inventory_updates', 'stock_movements', 'low_stock_alerts', 'sync_status'];
    const subscribedChannels: string[] = [];

    for (const channel of channels) {
      if (validChannels.includes(channel)) {
        client.subscriptions.add(channel);
        subscribedChannels.push(channel);
      }
    }

    this.sendToClient(clientId, {
      type: 'subscribed',
      data: { 
        channels: subscribedChannels,
        message: `Subscribed to ${subscribedChannels.length} channels`
      },
      timestamp: new Date().toISOString()
    });
  }

  private handleUnsubscription(clientId: string, channels: string[]) {
    const client = this.clients.get(clientId);
    if (!client) return;

    const unsubscribedChannels: string[] = [];

    for (const channel of channels) {
      if (client.subscriptions.has(channel)) {
        client.subscriptions.delete(channel);
        unsubscribedChannels.push(channel);
      }
    }

    this.sendToClient(clientId, {
      type: 'unsubscribed',
      data: { 
        channels: unsubscribedChannels,
        message: `Unsubscribed from ${unsubscribedChannels.length} channels`
      },
      timestamp: new Date().toISOString()
    });
  }

  private sendToClient(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (!client || client.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      client.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error(`Error sending message to client ${clientId}:`, error);
      this.clients.delete(clientId);
      return false;
    }
  }

  private broadcastToSubscribers(channel: string, message: SyncEvent) {
    let sentCount = 0;
    
    for (const [clientId, client] of this.clients) {
      if (client.subscriptions.has(channel)) {
        if (this.sendToClient(clientId, {
          channel,
          ...message
        })) {
          sentCount++;
        }
      }
    }

    console.log(`Broadcasted ${message.type} to ${sentCount} subscribers on channel ${channel}`);
  }

  private startPingInterval() {
    this.pingInterval = setInterval(() => {
      const now = Date.now();
      const timeout = 30000; // 30 seconds

      for (const [clientId, client] of this.clients) {
        if (now - client.lastPing > timeout) {
          console.log(`Client ${clientId} timed out, disconnecting`);
          client.ws.terminate();
          this.clients.delete(clientId);
        } else if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.ping();
        }
      }
    }, 15000); // Check every 15 seconds
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public getConnectedClients(): number {
    return this.clients.size;
  }

  public getClientSubscriptions(): Array<{ clientId: string; subscriptions: string[] }> {
    return Array.from(this.clients.entries()).map(([clientId, client]) => ({
      clientId,
      subscriptions: Array.from(client.subscriptions)
    }));
  }

  public close() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    
    for (const client of this.clients.values()) {
      client.ws.close();
    }
    
    this.wss.close();
    console.log('WebSocket server closed');
  }
}

// Export factory function
export function createWebSocketServer(port?: number): InventoryWebSocketServer {
  return new InventoryWebSocketServer(port);
}
