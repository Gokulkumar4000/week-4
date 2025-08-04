import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Building, LogOut, User } from "lucide-react";
import { LeaveRequest } from "@shared/schema";
import LeaveRequestForm from "@/components/LeaveRequestForm";
import LeaveRequestCard from "@/components/LeaveRequestCard";
import DetailsModal from "@/components/DetailsModal";

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: leaveRequests = [], isLoading, error } = useQuery<LeaveRequest[]>({
    queryKey: ["/api/leave-requests", "my-requests"],
    retry: 3,
    retryDelay: 1000,
    staleTime: 30000, // 30 seconds
    enabled: !!user,
  });

  const filteredRequests = leaveRequests.filter(request => {
    if (statusFilter === "all") return true;
    return request.status === statusFilter;
  });

  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Calculate leave balance (mock data for now)
  const leaveBalance = {
    annual: 15,
    sick: 8,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Building className="text-white text-sm" size={16} />
              </div>
              <h1 className="text-xl font-semibold text-gray-800">Employee Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="text-gray-600 text-sm" size={16} />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Leave Request Form */}
          <div className="lg:col-span-1">
            <LeaveRequestForm />

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Leave Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{leaveBalance.annual}</div>
                    <div className="text-sm text-gray-600">Annual</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-success">{leaveBalance.sick}</div>
                    <div className="text-sm text-gray-600">Sick</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leave History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold text-gray-800">My Leave Requests</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant={statusFilter === "all" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setStatusFilter("all")}
                      className="px-3 py-1 text-sm rounded-full"
                    >
                      All
                    </Button>
                    <Button
                      variant={statusFilter === "pending" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setStatusFilter("pending")}
                      className="px-3 py-1 text-sm rounded-full"
                    >
                      Pending
                    </Button>
                    <Button
                      variant={statusFilter === "approved" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setStatusFilter("approved")}
                      className="px-3 py-1 text-sm rounded-full"
                    >
                      Approved
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {statusFilter === "all" 
                        ? "No leave requests found. Submit your first request above!"
                        : `No ${statusFilter} requests found.`
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRequests.map((request) => (
                      <LeaveRequestCard
                        key={request.id}
                        request={request}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        request={selectedRequest}
      />
    </div>
  );
}
