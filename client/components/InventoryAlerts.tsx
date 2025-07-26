import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  useInventoryWebSocket,
  useLowStockAlerts,
  useSyncStatus,
  useInventoryUpdates,
  InventoryWebSocketEvent
} from "@/hooks/useInventoryWebSocket";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Wifi,
  WifiOff,
  TrendingUp,
  TrendingDown,
  Package,
  Zap,
  Bell,
  X,
  RefreshCw,
  Users
} from "lucide-react";

interface AlertItem {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'sync_error' | 'connection' | 'inventory_change';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  warehouse?: string;
  itemCode?: string;
  acknowledged: boolean;
  data?: any;
}

interface InventoryAlertsProps {
  onRefreshInventory?: () => void;
  className?: string;
}

export default function InventoryAlerts({ onRefreshInventory, className }: InventoryAlertsProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [recentEvents, setRecentEvents] = useState<InventoryWebSocketEvent[]>([]);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const { toast } = useToast();

  const {
    connected,
    connecting,
    error: wsError,
    lastEvent,
    subscriptions,
    reconnectAttempts,
    connect,
    disconnect
  } = useInventoryWebSocket({
    subscriptions: ['inventory_updates', 'stock_movements', 'low_stock_alerts', 'sync_status'],
    autoConnect: false, // Disable auto-connect to prevent errors when WebSocket server is not available
    autoReconnect: false,
    maxReconnectAttempts: 3
  });

  // Handle low stock alerts
  useLowStockAlerts((event) => {
    const lowStockItems = event.data?.items || [];
    
    lowStockItems.forEach((item: any) => {
      const alert: AlertItem = {
        id: `low-stock-${item.itemCode}-${item.warehouse}-${Date.now()}`,
        type: 'low_stock',
        title: 'Low Stock Alert',
        message: `${item.description} (${item.itemCode}) in ${item.warehouse}: ${item.quantity} remaining`,
        severity: item.quantity === 0 ? 'critical' : item.quantity <= 5 ? 'high' : 'medium',
        timestamp: event.timestamp,
        warehouse: item.warehouse,
        itemCode: item.itemCode,
        acknowledged: false,
        data: item
      };

      setAlerts(prev => [alert, ...prev.slice(0, 49)]); // Keep last 50 alerts

      // Show toast notification
      toast({
        title: alert.title,
        description: alert.message,
        variant: alert.severity === 'critical' ? 'destructive' : 'default'
      });
    });
  });

  // Handle sync status events
  useSyncStatus((event) => {
    let alert: AlertItem;

    if (event.type === 'sync_complete') {
      alert = {
        id: `sync-complete-${Date.now()}`,
        type: 'connection',
        title: 'Sync Complete',
        message: `Updated ${event.data?.updatedItems || 0} items. ${event.data?.lowStockItems || 0} items are low on stock.`,
        severity: 'low',
        timestamp: event.timestamp,
        warehouse: event.warehouse,
        acknowledged: false,
        data: event.data
      };

      if (onRefreshInventory) {
        onRefreshInventory();
      }
    } else if (event.type === 'sync_error') {
      alert = {
        id: `sync-error-${Date.now()}`,
        type: 'sync_error',
        title: 'Sync Failed',
        message: event.data?.error || 'Failed to sync with Sage X3',
        severity: 'high',
        timestamp: event.timestamp,
        warehouse: event.warehouse,
        acknowledged: false,
        data: event.data
      };

      toast({
        title: alert.title,
        description: alert.message,
        variant: 'destructive'
      });
    } else {
      return;
    }

    setAlerts(prev => [alert, ...prev.slice(0, 49)]);
  });

  // Handle inventory updates
  useInventoryUpdates((event) => {
    const change = event.data;
    
    let alert: AlertItem;
    if (change?.type === 'updated') {
      const quantityChange = change.changes?.find((c: any) => c.field === 'quantity');
      
      if (quantityChange) {
        const direction = quantityChange.newValue > quantityChange.oldValue ? 'increased' : 'decreased';
        const difference = Math.abs(quantityChange.newValue - quantityChange.oldValue);
        
        alert = {
          id: `inventory-change-${change.item.itemCode}-${Date.now()}`,
          type: 'inventory_change',
          title: 'Inventory Updated',
          message: `${change.item.description} quantity ${direction} by ${difference} in ${change.item.warehouse}`,
          severity: 'low',
          timestamp: event.timestamp,
          warehouse: change.item.warehouse,
          itemCode: change.item.itemCode,
          acknowledged: false,
          data: change
        };

        setAlerts(prev => [alert, ...prev.slice(0, 49)]);
      }
    }
  });

  // Track all events for recent activity
  useEffect(() => {
    if (lastEvent) {
      setRecentEvents(prev => [lastEvent, ...prev.slice(0, 19)]); // Keep last 20 events
    }
  }, [lastEvent]);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');

  return (
    <div className={className}>
      {/* Connection Status */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {connected ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">Connected to real-time updates</span>
                </>
              ) : connecting ? (
                <>
                  <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                  <span className="text-sm font-medium text-blue-600">
                    Connecting... {reconnectAttempts > 0 && `(Attempt ${reconnectAttempts})`}
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Real-time alerts disabled {error && `- ${error}`}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {subscriptions.length} channels
              </Badge>
              {!connected && (
                <Button size="sm" variant="outline" onClick={connect}>
                  Enable Real-time
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts Summary */}
      {unacknowledgedAlerts.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Active Alerts ({unacknowledgedAlerts.length})
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowAllAlerts(!showAllAlerts)}>
                  {showAllAlerts ? 'Hide' : 'Show All'}
                </Button>
                <Button size="sm" variant="outline" onClick={clearAllAlerts}>
                  Clear All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {criticalAlerts.length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertTitle className="text-red-700">Critical Alerts</AlertTitle>
                <AlertDescription className="text-red-600">
                  {criticalAlerts.length} critical alerts require immediate attention
                </AlertDescription>
              </Alert>
            )}

            {(showAllAlerts ? unacknowledgedAlerts : unacknowledgedAlerts.slice(0, 5)).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{alert.title}</div>
                      <div className="text-sm opacity-90">{alert.message}</div>
                      <div className="text-xs opacity-75 mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                        {alert.warehouse && ` • ${alert.warehouse}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="h-6 w-6 p-0"
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissAlert(alert.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {!showAllAlerts && unacknowledgedAlerts.length > 5 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAllAlerts(true)}
                className="w-full"
              >
                Show {unacknowledgedAlerts.length - 5} more alerts
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEvents.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-2 text-sm py-1">
                  <div className="flex items-center gap-2 flex-1">
                    {event.type === 'inventory_updated' && <TrendingUp className="h-3 w-3 text-blue-500" />}
                    {event.type === 'stock_movement' && <TrendingDown className="h-3 w-3 text-orange-500" />}
                    {event.type === 'low_stock_alert' && <AlertTriangle className="h-3 w-3 text-red-500" />}
                    {event.type === 'sync_complete' && <CheckCircle className="h-3 w-3 text-green-500" />}
                    {event.type === 'sync_error' && <X className="h-3 w-3 text-red-500" />}
                    <span className="flex-1 truncate">
                      {event.type.replace('_', ' ')}
                      {event.warehouse && ` • ${event.warehouse}`}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
