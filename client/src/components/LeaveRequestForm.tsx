import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { InsertLeaveRequest } from "@shared/schema";

export default function LeaveRequestForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertLeaveRequest) => {
      await apiRequest("POST", "/api/leave-requests", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Leave request submitted successfully!",
      });
      setFormData({
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/leave-requests"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit leave request",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const requestData: InsertLeaveRequest = {
      userId: user.id,
      employeeId: user.employeeId || user.id,
      employeeName: user.name,
      department: user.department,
      leaveType: formData.leaveType as any,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      reason: formData.reason,
    };

    submitMutation.mutate(requestData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Submit Leave Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 mb-2">
              Leave Type
            </Label>
            <Select 
              value={formData.leaveType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, leaveType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annual">Annual Leave</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="personal">Personal Leave</SelectItem>
                <SelectItem value="emergency">Emergency Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </Label>
              <Input
                id="fromDate"
                type="date"
                value={formData.fromDate}
                onChange={(e) => setFormData(prev => ({ ...prev, fromDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </Label>
              <Input
                id="toDate"
                type="date"
                value={formData.toDate}
                onChange={(e) => setFormData(prev => ({ ...prev, toDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason
            </Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              rows={4}
              placeholder="Please provide a reason for your leave request..."
              required
            />
          </div>

          <Button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-200"
          >
            {submitMutation.isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
