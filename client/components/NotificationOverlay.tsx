import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotification, NotificationData } from '@/hooks/useNotification';
import { cn } from '@/lib/utils';

const NotificationItem = ({ 
  notification, 
  onDismiss 
}: { 
  notification: NotificationData; 
  onDismiss: (id: string) => void 
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case 'info':
        return <Info className="h-6 w-6 text-blue-600" />;
      default:
        return <Info className="h-6 w-6 text-gray-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div
      className={cn(
        'notification-item',
        'flex items-start space-x-3 p-4 rounded-lg border shadow-lg',
        'transform transition-all duration-300 ease-in-out',
        'animate-in slide-in-from-right-full',
        getBackgroundColor()
      )}
      style={{
        animation: 'slideInFromRight 0.3s ease-out'
      }}
    >
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={cn('text-sm font-semibold', getTextColor())}>
          {notification.title}
        </h4>
        <p className={cn('text-sm mt-1', getTextColor())}>
          {notification.message}
        </p>
        
        {notification.action && (
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={notification.action.onClick}
              className="text-xs"
            >
              {notification.action.label}
            </Button>
          </div>
        )}
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDismiss(notification.id)}
        className="flex-shrink-0 h-6 w-6 p-0 hover:bg-black/10"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const NotificationOverlay = () => {
  const { notifications, removeNotification, subscribe } = useNotification();

  useEffect(() => {
    const unsubscribe = subscribe();
    return unsubscribe;
  }, [subscribe]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutToRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .notification-item {
          animation: slideInFromRight 0.3s ease-out;
        }
        
        .notification-item.removing {
          animation: slideOutToRight 0.3s ease-in;
        }
      `}</style>
      
      <div 
        className="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm w-full pointer-events-none"
        style={{ zIndex: 10000 }}
      >
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <NotificationItem
              notification={notification}
              onDismiss={removeNotification}
            />
          </div>
        ))}
      </div>
    </>
  );
};
