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
    // Create test users
    const employee1: User = {
      id: "emp1",
      email: "john.doe@company.com",
      name: "John Doe",
      role: "employee",
      department: "Engineering",
      employeeId: "EMP001",
      createdAt: new Date("2024-01-01"),
    };

    const employee2: User = {
      id: "emp2",
      email: "alice.smith@company.com",
      name: "Alice Smith",
      role: "employee",
      department: "Marketing",
      employeeId: "EMP002",
      createdAt: new Date("2024-01-01"),
    };

    const hrUser: User = {
      id: "hr1",
      email: "sarah.wilson@company.com",
      name: "Sarah Wilson",
      role: "hr",
      department: "Human Resources",
      createdAt: new Date("2024-01-01"),
    };

    this.users.set(employee1.id, employee1);
    this.users.set(employee2.id, employee2);
    this.users.set(hrUser.id, hrUser);

    // Create test leave requests
    const request1: LeaveRequest = {
      id: "req1",
      userId: employee1.id,
      employeeId: "EMP001",
      employeeName: "John Doe",
      department: "Engineering",
      leaveType: "annual",
      fromDate: "2024-12-25",
      toDate: "2024-12-29",
      reason: "Family vacation during holidays",
      status: "pending",
      submittedAt: new Date("2024-12-15"),
      updatedAt: new Date("2024-12-15"),
    };

    const request2: LeaveRequest = {
      id: "req2",
      userId: employee1.id,
      employeeId: "EMP001",
      employeeName: "John Doe",
      department: "Engineering",
      leaveType: "sick",
      fromDate: "2024-12-10",
      toDate: "2024-12-12",
      reason: "Fever and flu symptoms",
      status: "approved",
      approvedBy: "Sarah Wilson",
      submittedAt: new Date("2024-12-09"),
      updatedAt: new Date("2024-12-10"),
    };

    const request3: LeaveRequest = {
      id: "req3",
      userId: employee2.id,
      employeeId: "EMP002",
      employeeName: "Alice Smith",
      department: "Marketing",
      leaveType: "personal",
      fromDate: "2024-12-18",
      toDate: "2024-12-20",
      reason: "Personal matters",
      status: "pending",
      submittedAt: new Date("2024-12-16"),
      updatedAt: new Date("2024-12-16"),
    };

    this.leaveRequests.set(request1.id, request1);
    this.leaveRequests.set(request2.id, request2);
    this.leaveRequests.set(request3.id, request3);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
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
