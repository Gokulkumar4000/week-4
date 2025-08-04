import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertLeaveRequestSchema, updateLeaveRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup route to initialize Firebase data
  app.post("/api/setup", async (req, res) => {
    try {
      const { initializeFirebaseData } = await import('./firebase-setup');
      await initializeFirebaseData();
      res.json({ message: "Firebase setup completed successfully" });
    } catch (error: any) {
      console.error("Error setting up Firebase:", error);
      res.status(500).json({ message: "Failed to setup Firebase", error: error.message });
    }
  });

  // Leave Requests Routes
  
  // Get all leave requests for HR
  app.get("/api/leave-requests/all", async (req, res) => {
    try {
      const requests = await storage.getAllLeaveRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching all leave requests:", error);
      res.status(500).json({ message: "Failed to fetch leave requests" });
    }
  });

  // Get user's own leave requests
  app.get("/api/leave-requests/my-requests", async (req, res) => {
    try {
      const userId = req.headers["user-id"] as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const requests = await storage.getUserLeaveRequests(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching user leave requests:", error);
      res.status(500).json({ message: "Failed to fetch leave requests" });
    }
  });

  // Submit new leave request
  app.post("/api/leave-requests", async (req, res) => {
    try {
      const validatedData = insertLeaveRequestSchema.parse(req.body);
      const request = await storage.createLeaveRequest(validatedData);
      res.status(201).json(request);
    } catch (error: any) {
      console.error("Error creating leave request:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create leave request" });
    }
  });

  // Update leave request status (for HR)
  app.patch("/api/leave-requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateLeaveRequestSchema.parse(req.body);
      
      const updatedRequest = await storage.updateLeaveRequest(id, validatedData);
      if (!updatedRequest) {
        return res.status(404).json({ message: "Leave request not found" });
      }
      
      res.json(updatedRequest);
    } catch (error: any) {
      console.error("Error updating leave request:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update leave request" });
    }
  });

  // Delete leave request
  app.delete("/api/leave-requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteLeaveRequest(id);
      
      if (!success) {
        return res.status(404).json({ message: "Leave request not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting leave request:", error);
      res.status(500).json({ message: "Failed to delete leave request" });
    }
  });

  // Get leave request by ID
  app.get("/api/leave-requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const request = await storage.getLeaveRequest(id);
      
      if (!request) {
        return res.status(404).json({ message: "Leave request not found" });
      }
      
      res.json(request);
    } catch (error) {
      console.error("Error fetching leave request:", error);
      res.status(500).json({ message: "Failed to fetch leave request" });
    }
  });

  // Users Routes (for user management if needed)
  
  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Create user
  app.post("/api/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
