import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getInventoryItems,
  getInventoryItem,
  getStockMovements,
  createStockMovement,
  getPurchaseOrders,
  getLowStockItems,
  syncInventory,
  getInventoryStats,
  issueInventory,
  returnInventory,
} from "./routes/inventory";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Inventory API routes
  app.get("/api/inventory/items", getInventoryItems);
  app.get("/api/inventory/item/:itemCode", getInventoryItem);
  app.get("/api/inventory/movements", getStockMovements);
  app.post("/api/inventory/movements", createStockMovement);
  app.get("/api/inventory/purchase-orders", getPurchaseOrders);
  app.get("/api/inventory/low-stock", getLowStockItems);
  app.post("/api/inventory/sync", syncInventory);
  app.get("/api/inventory/stats", getInventoryStats);
  app.post("/api/inventory/issue", issueInventory);
  app.post("/api/inventory/return", returnInventory);

  return app;
}
