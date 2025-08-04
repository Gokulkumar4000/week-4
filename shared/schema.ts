import { z } from "zod";

export const userRoles = ["employee", "hr"] as const;

export const leaveTypes = ["annual", "sick", "personal", "emergency"] as const;

export const leaveStatus = ["pending", "approved", "rejected"] as const;

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(userRoles),
  department: z.string(),
  employeeId: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
});

export const insertUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
});

export const leaveRequestSchema = z.object({
  id: z.string(),
  userId: z.string(),
  employeeId: z.string(),
  employeeName: z.string(),
  department: z.string(),
  leaveType: z.enum(leaveTypes),
  fromDate: z.string(),
  toDate: z.string(),
  reason: z.string(),
  status: z.enum(leaveStatus).default("pending"),
  rejectionReason: z.string().optional(),
  approvedBy: z.string().optional(),
  submittedAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const insertLeaveRequestSchema = leaveRequestSchema.omit({
  id: true,
  status: true,
  rejectionReason: true,
  approvedBy: true,
  submittedAt: true,
  updatedAt: true,
});

export const updateLeaveRequestSchema = z.object({
  status: z.enum(leaveStatus),
  rejectionReason: z.string().optional(),
  approvedBy: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LeaveRequest = z.infer<typeof leaveRequestSchema>;
export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;
export type UpdateLeaveRequest = z.infer<typeof updateLeaveRequestSchema>;
