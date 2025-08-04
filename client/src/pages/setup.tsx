import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Building, UserPlus, FileText, CheckCircle } from "lucide-react";

export default function Setup() {
  const [isLoading, setIsLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const { toast } = useToast();

  const initializeData = async () => {
    setIsLoading(true);
    
    try {
      console.log('🔧 Setting up Firebase with sample data...');
      
      // Sample employees data
      const employees = [
        {
          email: 'john.doe@company.com',
          password: 'password123',
          userData: {
            name: 'John Doe',
            role: 'employee' as const,
            department: 'Engineering',
            employeeId: 'EMP001',
          }
        },
        {
          email: 'alice.smith@company.com',
          password: 'password123',
          userData: {
            name: 'Alice Smith',
            role: 'employee' as const,
            department: 'Marketing',
            employeeId: 'EMP002',
          }
        }
      ];

      // Sample HR user
      const hrUser = {
        email: 'sarah.wilson@company.com',
        password: 'password123',
        userData: {
          name: 'Sarah Wilson',
          role: 'hr' as const,
          department: 'Human Resources',
        }
      };

      const allUsers = [...employees, hrUser];
      const createdUsers: { [key: string]: string } = {};

      // Create users
      for (const user of allUsers) {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            user.email,
            user.password
          );
          
          const userData = {
            ...user.userData,
            email: user.email,
            createdAt: new Date(),
          };
          
          await setDoc(doc(db, 'users', userCredential.user.uid), userData);
          createdUsers[user.email] = userCredential.user.uid;
          
          console.log(`✅ Created user: ${user.userData.name} (${user.email})`);
        } catch (error: any) {
          if (error.code === 'auth/email-already-in-use') {
            console.log(`⚠️ User ${user.email} already exists, skipping...`);
          } else {
            console.error(`❌ Error creating user ${user.email}:`, error.message);
            throw error;
          }
        }
      }

      // Create sample leave requests
      const sampleRequests = [
        {
          employeeEmail: 'john.doe@company.com',
          request: {
            employeeId: 'EMP001',
            employeeName: 'John Doe',
            department: 'Engineering',
            leaveType: 'annual' as const,
            fromDate: '2024-12-25',
            toDate: '2024-12-29',
            reason: 'Family vacation during holidays',
            status: 'pending' as const,
            submittedAt: new Date('2024-12-15'),
            updatedAt: new Date('2024-12-15'),
          }
        },
        {
          employeeEmail: 'john.doe@company.com',
          request: {
            employeeId: 'EMP001',
            employeeName: 'John Doe',
            department: 'Engineering',
            leaveType: 'sick' as const,
            fromDate: '2024-12-10',
            toDate: '2024-12-12',
            reason: 'Fever and flu symptoms',
            status: 'approved' as const,
            approvedBy: 'Sarah Wilson',
            submittedAt: new Date('2024-12-09'),
            updatedAt: new Date('2024-12-10'),
          }
        },
        {
          employeeEmail: 'alice.smith@company.com',
          request: {
            employeeId: 'EMP002',
            employeeName: 'Alice Smith',
            department: 'Marketing',
            leaveType: 'personal' as const,
            fromDate: '2024-12-18',
            toDate: '2024-12-20',
            reason: 'Personal matters',
            status: 'pending' as const,
            submittedAt: new Date('2024-12-16'),
            updatedAt: new Date('2024-12-16'),
          }
        }
      ];

      // Add leave requests to Firestore
      for (const { employeeEmail, request } of sampleRequests) {
        try {
          const userId = createdUsers[employeeEmail];
          if (userId) {
            const docRef = doc(collection(db, 'leaveRequests'));
            const requestData = {
              ...request,
              userId,
              id: docRef.id,
            };
            
            await setDoc(docRef, requestData);
            console.log(`✅ Created leave request for ${request.employeeName}`);
          }
        } catch (error: any) {
          console.error(`❌ Error creating leave request:`, error.message);
        }
      }

      console.log('🎉 Firebase setup completed successfully!');
      
      toast({
        title: "Setup Complete!",
        description: "Sample users and leave requests have been created.",
      });
      
      setSetupComplete(true);
      
    } catch (error: any) {
      console.error('❌ Error setting up Firebase:', error);
      toast({
        title: "Setup Error",
        description: error.message || "Failed to initialize Firebase data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="text-white text-2xl" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            HR Leave Management Portal Setup
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Initialize your system with sample data to get started
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!setupComplete ? (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">What will be created:</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center space-x-2">
                    <UserPlus size={16} />
                    <span>2 Sample Employees (Engineering & Marketing)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserPlus size={16} />
                    <span>1 HR Manager</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText size={16} />
                    <span>3 Sample Leave Requests</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Test Credentials:</h3>
                <div className="space-y-1 text-sm text-yellow-800">
                  <div><strong>Employee 1:</strong> john.doe@company.com / password123</div>
                  <div><strong>Employee 2:</strong> alice.smith@company.com / password123</div>
                  <div><strong>HR Manager:</strong> sarah.wilson@company.com / password123</div>
                </div>
              </div>

              <Button
                onClick={initializeData}
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all"
                size="lg"
              >
                {isLoading ? "Setting up..." : "Initialize Firebase Data"}
              </Button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-green-800">Setup Complete!</h3>
              <p className="text-gray-600">
                Your HR Leave Management Portal is ready to use. You can now log in with the test credentials.
              </p>
              <Button
                onClick={() => window.location.href = '/login'}
                className="bg-primary text-white hover:bg-blue-700"
              >
                Go to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}