import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../client/src/lib/firebase';
import { 
  type User, 
  type InsertUser, 
  type LeaveRequest, 
  type InsertLeaveRequest,
  type UpdateLeaveRequest 
} from "@shared/schema";
import { randomUUID } from "crypto";
import type { IStorage } from './storage';

export class FirebaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    try {
      const userDoc = await getDoc(doc(db, 'users', id));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          id: userDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as User;
      }
      return undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const usersQuery = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(usersQuery);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data();
        return {
          id: userDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as User;
      }
      return undefined;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const id = randomUUID();
      const userData = {
        ...insertUser,
        createdAt: new Date(),
      };
      
      await setDoc(doc(db, 'users', id), userData);
      
      return {
        id,
        ...userData,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Leave request methods
  async getLeaveRequest(id: string): Promise<LeaveRequest | undefined> {
    try {
      const requestDoc = await getDoc(doc(db, 'leaveRequests', id));
      if (requestDoc.exists()) {
        const data = requestDoc.data();
        return {
          id: requestDoc.id,
          ...data,
          submittedAt: data.submittedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as LeaveRequest;
      }
      return undefined;
    } catch (error) {
      console.error('Error getting leave request:', error);
      return undefined;
    }
  }

  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      const requestsQuery = query(
        collection(db, 'leaveRequests'), 
        orderBy('submittedAt', 'desc')
      );
      const querySnapshot = await getDocs(requestsQuery);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          submittedAt: data.submittedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as LeaveRequest;
      });
    } catch (error) {
      console.error('Error getting all leave requests:', error);
      return [];
    }
  }

  async getUserLeaveRequests(userId: string): Promise<LeaveRequest[]> {
    try {
      const requestsQuery = query(
        collection(db, 'leaveRequests'), 
        where('userId', '==', userId),
        orderBy('submittedAt', 'desc')
      );
      const querySnapshot = await getDocs(requestsQuery);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          submittedAt: data.submittedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as LeaveRequest;
      });
    } catch (error) {
      console.error('Error getting user leave requests:', error);
      return [];
    }
  }

  async createLeaveRequest(insertRequest: InsertLeaveRequest): Promise<LeaveRequest> {
    try {
      const id = randomUUID();
      const now = new Date();
      const requestData = {
        ...insertRequest,
        status: 'pending' as const,
        submittedAt: now,
        updatedAt: now,
      };
      
      await setDoc(doc(db, 'leaveRequests', id), requestData);
      
      return {
        id,
        ...requestData,
      };
    } catch (error) {
      console.error('Error creating leave request:', error);
      throw error;
    }
  }

  async updateLeaveRequest(id: string, updates: UpdateLeaveRequest): Promise<LeaveRequest | undefined> {
    try {
      const requestRef = doc(db, 'leaveRequests', id);
      const requestDoc = await getDoc(requestRef);
      
      if (!requestDoc.exists()) {
        return undefined;
      }

      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };
      
      await updateDoc(requestRef, updateData);
      
      // Get the updated document
      const updatedDoc = await getDoc(requestRef);
      const data = updatedDoc.data();
      
      return {
        id: updatedDoc.id,
        ...data,
        submittedAt: data?.submittedAt?.toDate() || new Date(),
        updatedAt: data?.updatedAt?.toDate() || new Date(),
      } as LeaveRequest;
    } catch (error) {
      console.error('Error updating leave request:', error);
      return undefined;
    }
  }

  async deleteLeaveRequest(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'leaveRequests', id));
      return true;
    } catch (error) {
      console.error('Error deleting leave request:', error);
      return false;
    }
  }
}

export const firebaseStorage = new FirebaseStorage();