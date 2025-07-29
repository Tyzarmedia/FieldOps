# Sage X3 Inventory Integration

This document provides a complete guide for integrating your fiber installation business inventory with Sage X3 ERP system.

## 🚀 Overview

The integration provides:
- ✅ **Real-time inventory sync** from Sage X3
- ✅ **Stock movement tracking** with technician assignments
- ✅ **Low stock alerts** and notifications
- ✅ **WebSocket-based live updates**
- ✅ **Comprehensive inventory management interface**
- ✅ **Purchase order tracking**
- ✅ **Multi-warehouse support**
- ✅ **Issue/Return workflow** for technicians

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│   Express API   │◄──►│    Sage X3      │
│                 │    │                 │    │    Server       │
│ - Inventory UI  │    │ - REST APIs     │    │                 │
│ - Real-time     │    │ - WebSocket     │    │ - REST APIs     │
│   Updates       │    │ - Sync Service  │    │ - Database      │
│ - Alerts        │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │
        └───────────────────────┘
              WebSocket
          (Real-time Updates)
```

## 🔧 Setup Instructions

### 1. Environment Configuration

Create a `.env` file with your Sage X3 configuration:

```bash
# Sage X3 Integration Configuration
SAGE_X3_BASE_URL=https://your-sage-server.com:8124
SAGE_X3_USERNAME=admin
SAGE_X3_PASSWORD=your_password
SAGE_X3_DATABASE=X3V12
SAGE_X3_POOL_ALIAS=NODEMGR
SAGE_X3_REQUEST_CONFIG=

# Server Configuration
PORT=8080
NODE_ENV=development

# WebSocket Configuration
WEBSOCKET_PORT=8081
```

### 2. Sage X3 Server Requirements

Ensure your Sage X3 server has:
- REST API enabled
- Authentication configured
- Network access from your application server
- Proper user permissions for inventory operations

### 3. Dependencies Installation

The integration requires these dependencies (already included):
```bash
npm install axios ws @types/ws
```

## 📋 API Endpoints

### Inventory Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory/items` | Get all inventory items |
| GET | `/api/inventory/item/:itemCode` | Get specific item |
| GET | `/api/inventory/movements` | Get stock movements |
| POST | `/api/inventory/movements` | Create stock movement |
| GET | `/api/inventory/low-stock` | Get low stock items |
| POST | `/api/inventory/sync` | Manual sync with Sage X3 |
| GET | `/api/inventory/stats` | Get inventory statistics |
| POST | `/api/inventory/issue` | Issue item to technician |
| POST | `/api/inventory/return` | Return item from technician |

### Sync Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sync/schedules` | Get sync schedules |
| POST | `/api/sync/schedules` | Create sync schedule |
| PUT | `/api/sync/schedules/:id` | Update sync schedule |
| DELETE | `/api/sync/schedules/:id` | Delete sync schedule |
| POST | `/api/sync/manual` | Trigger manual sync |
| GET | `/api/sync/status` | Get sync status |

## 🔄 Real-time Features

### WebSocket Integration

The system uses WebSocket for real-time updates on port 8081:

**Connection:**
```javascript
const ws = new WebSocket('ws://localhost:8081');
```

**Subscription Channels:**
- `inventory_updates` - Item quantity/status changes
- `stock_movements` - New stock transactions
- `low_stock_alerts` - Stock level warnings
- `sync_status` - Sync completion/errors

**React Hook Usage:**
```typescript
import { useInventoryWebSocket } from '@/hooks/useInventoryWebSocket';

const { connected, lastEvent, subscribe } = useInventoryWebSocket({
  subscriptions: ['inventory_updates', 'low_stock_alerts']
});
```

### Automatic Sync Schedules

Configure automatic syncing:
```typescript
// Hourly sync for main warehouse
{
  name: 'Main Warehouse Hourly Sync',
  warehouse: 'MAIN',
  frequency: 'hourly',
  enabled: true,
  notifyOnLowStock: true,
  lowStockThreshold: 10
}
```

## 💼 Business Workflows

### 1. Issue Equipment to Technician

```typescript
POST /api/inventory/issue
{
  "itemCode": "FO-001",
  "quantity": 50,
  "technicianId": "TECH-001",
  "jobReference": "JOB-12345",
  "warehouse": "MAIN",
  "notes": "Fiber installation job"
}
```

### 2. Return Equipment from Field

```typescript
POST /api/inventory/return
{
  "itemCode": "FO-001",
  "quantity": 20,
  "technicianId": "TECH-001",
  "warehouse": "MAIN",
  "condition": "Good",
  "notes": "Unused materials returned"
}
```

### 3. Stock Movement Tracking

All movements are automatically tracked and synchronized with Sage X3:
- ➡️ **OUT**: Equipment issued to technicians
- ⬅️ **IN**: Equipment returned from field
- 🔄 **TRANSFER**: Between warehouses
- ⚖️ **ADJUSTMENT**: Stock corrections

## 📊 Inventory Management Interface

### Features

1. **Real-time Dashboard**
   - Live inventory levels
   - Low stock alerts
   - Sync status indicators

2. **Advanced Filtering**
   - By warehouse
   - By category
   - Low stock only
   - Search by item code/description

3. **Stock Operations**
   - Issue to technician
   - Return from field
   - Transfer between warehouses
   - View movement history

4. **Analytics**
   - Inventory by category
   - Warehouse distribution
   - Stock trends
   - Usage patterns

### Navigation

- **Stock Managers**: Automatically redirected to full inventory management
- **Technicians**: Access via `/stock-on-hand` route
- **All Users**: Available at `/stock` route

## 🚨 Alert System

### Alert Types

1. **Critical Alerts**
   - Out of stock items
   - Sync failures
   - Connection issues

2. **High Priority**
   - Low stock warnings
   - Failed movements
   - Authentication errors

3. **Medium Priority**
   - Approaching reorder levels
   - Scheduled sync delays

4. **Low Priority**
   - Successful syncs
   - Routine updates

### Notification Methods

- 🔔 **In-app notifications** via toast messages
- 📡 **Real-time alerts** via WebSocket
- 📧 **Email notifications** (configurable)
- 📱 **Push notifications** (future enhancement)

## 🔍 Troubleshooting

### Common Issues

1. **Authentication Failures**
   ```
   Error: Failed to authenticate with Sage X3
   ```
   - Check username/password in .env
   - Verify Sage X3 user permissions
   - Confirm database name

2. **Connection Timeouts**
   ```
   Error: Request timeout
   ```
   - Check network connectivity
   - Verify Sage X3 server URL and port
   - Check firewall settings

3. **WebSocket Connection Issues**
   ```
   WebSocket disconnected
   ```
   - Verify port 8081 is accessible
   - Check browser security settings
   - Review proxy configurations

### Debug Mode

Enable detailed logging:
```bash
LOG_LEVEL=debug
```

### Testing Connection

Use the test endpoint:
```bash
curl -X POST http://localhost:8080/api/inventory/sync \
  -H "Content-Type: application/json" \
  -d '{"warehouse": "MAIN"}'
```

## 🚀 Deployment

### Production Checklist

- [ ] Configure environment variables
- [ ] Set up SSL certificates for HTTPS
- [ ] Configure WebSocket proxy
- [ ] Set up monitoring and logging
- [ ] Test Sage X3 connectivity
- [ ] Configure backup sync schedules
- [ ] Set up alert notifications

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080 8081
CMD ["npm", "start"]
```

### Environment Variables for Production

```bash
SAGE_X3_BASE_URL=https://your-production-sage-server.com:8124
SAGE_X3_USERNAME=prod_user
SAGE_X3_PASSWORD=secure_password
NODE_ENV=production
LOG_LEVEL=info
WEBSOCKET_PORT=8081
```

## 📈 Performance Optimization

### Caching Strategy

- **Redis cache** for frequent Sage X3 queries
- **Local storage** for UI state persistence
- **Background sync** for non-critical updates

### Rate Limiting

- **API rate limits** to prevent Sage X3 overload
- **Queue management** for bulk operations
- **Retry logic** with exponential backoff

## 🔒 Security Considerations

- **Environment variables** for sensitive data
- **HTTPS/WSS** for encrypted communication
- **Authentication tokens** with expiration
- **Input validation** for all API endpoints
- **Role-based access** control

## 📝 Future Enhancements

- [ ] **Mobile app integration**
- [ ] **Barcode scanning** for stock operations
- [ ] **Predictive analytics** for stock levels
- [ ] **Integration with GPS** for location tracking
- [ ] **Advanced reporting** with custom dashboards
- [ ] **Multi-tenant support** for different companies

## 🆘 Support

For technical support:
1. Check this documentation
2. Review server logs
3. Test Sage X3 connectivity
4. Contact your Sage X3 administrator
5. Reach out to development team

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Compatibility**: Sage X3 Version 12+
