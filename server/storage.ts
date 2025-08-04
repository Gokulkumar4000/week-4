import { 
  type User, 
  type InsertUser, 
  type LeaveRequest, 
  type InsertLeaveRequest,
  type UpdateLeaveRequest 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Leave request methods
  getLeaveRequest(id: string): Promise<LeaveRequest | undefined>;
  getAllLeaveRequests(): Promise<LeaveRequest[]>;
  getUserLeaveRequests(userId: string): Promise<LeaveRequest[]>;
  createLeaveRequest(request: InsertLeaveRequest): Promise<LeaveRequest>;
  updateLeaveRequest(id: string, updates: UpdateLeaveRequest): Promise<LeaveRequest | undefined>;
  deleteLeaveRequest(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private leaveRequests: Map<string, LeaveRequest>;

  constructor() {
    this.users = new Map();
    this.leaveRequests = new Map();
    this.initializeTestData();
  }

  private initializeTestData() {
    // Initialize empty - users will be created dynamically from Firebase auth
    // Create some sample leave requests with placeholder user IDs that will be updated
    this.createSampleLeaveRequests();
  }
  
  private createSampleLeaveRequests() {
    // These will be created when users login and their Firebase UIDs are known
    // For now, keep empty to avoid mismatched user IDs
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      createdAt: new Date(),
    };
    this.users.set(insertUser.id, user);
    
    // Create sample leave requests for this user if it's one of our test accounts
    this.createSampleDataForUser(user);
    
    return user;
  }

  private createSampleDataForUser(user: User) {
    if (user.email === "gokulkumar@gncipl.com" && user.role === "employee") {
      // Create sample leave requests for employee
      const request1: LeaveRequest = {
        id: `req-${user.id}-1`,
        userId: user.id,
        employeeId: user.employeeId || "EMP001",
        employeeName: user.name,
        department: user.department || "Engineering",
        leaveType: "annual",
        fromDate: "2024-12-25",
        toDate: "2024-12-29",
        reason: "Family vacation during holidays",
        status: "pending",
        submittedAt: new Date("2024-12-15"),
        updatedAt: new Date("2024-12-15"),
      };

      const request2: LeaveRequest = {
        id: `req-${user.id}-2`,
        userId: user.id,
        employeeId: user.employeeId || "EMP001",
        employeeName: user.name,
        department: user.department || "Engineering",
        leaveType: "sick",
        fromDate: "2024-12-10",
        toDate: "2024-12-12",
        reason: "Fever and flu symptoms",
        status: "approved",
        approvedBy: "Gokul",
        submittedAt: new Date("2024-12-09"),
        updatedAt: new Date("2024-12-10"),
      };

      this.leaveRequests.set(request1.id, request1);
      this.leaveRequests.set(request2.id, request2);
    }
  }

  // Leave request methods
  async getLeaveRequest(id: string): Promise<LeaveRequest | undefined> {
    return this.leaveRequests.get(id);
  }

  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    return Array.from(this.leaveRequests.values()).sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  async getUserLeaveRequests(userId: string): Promise<LeaveRequest[]> {
    return Array.from(this.leaveRequests.values())
      .filter(request => request.userId === userId)
      .sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
  }

  async createLeaveRequest(insertRequest: InsertLeaveRequest): Promise<LeaveRequest> {
    const id = randomUUID();
    const now = new Date();
    const request: LeaveRequest = {
      ...insertRequest,
      id,
      status: "pending",
      submittedAt: now,
      updatedAt: now,
    };
    this.leaveRequests.set(id, request);
    return request;
  }

  async updateLeaveRequest(id: string, updates: UpdateLeaveRequest): Promise<LeaveRequest | undefined> {
    const request = this.leaveRequests.get(id);
    if (!request) {
      return undefined;
    }

    const updatedRequest: LeaveRequest = {
      ...request,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.leaveRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async deleteLeaveRequest(id: string): Promise<boolean> {
    return this.leaveRequests.delete(id);
  }
}

export const storage = new MemStorage();
