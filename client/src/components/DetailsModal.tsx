import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LeaveRequest } from "@shared/schema";
import { format } from "date-fns";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: LeaveRequest | null;
}

export default function DetailsModal({ isOpen, onClose, request }: DetailsModalProps) {
  if (!request) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const calculateDuration = (fromDate: string, toDate: string) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} working day${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Leave Request Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee</label>
              <p className="text-sm text-gray-900 mt-1">{request.employeeName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee ID</label>
              <p className="text-sm text-gray-900 mt-1">{request.employeeId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <p className="text-sm text-gray-900 mt-1">{request.department}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Leave Type</label>
              <p className="text-sm text-gray-900 mt-1 capitalize">
                {request.leaveType.replace(/([A-Z])/g, ' $1').trim()} Leave
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">From Date</label>
              <p className="text-sm text-gray-900 mt-1">
                {format(new Date(request.fromDate), "MMMM dd, yyyy")}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">To Date</label>
              <p className="text-sm text-gray-900 mt-1">
                {format(new Date(request.toDate), "MMMM dd, yyyy")}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <p className="text-sm text-gray-900 mt-1">
              {calculateDuration(request.fromDate, request.toDate)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <p className="text-sm text-gray-900 mt-1">{request.reason}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <div className="mt-1">
              {getStatusBadge(request.status)}
            </div>
          </div>

          {request.rejectionReason && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
              <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{request.rejectionReason}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Submitted On</label>
            <p className="text-sm text-gray-900 mt-1">
              {format(new Date(request.submittedAt), "MMMM dd, yyyy 'at' h:mm a")}
            </p>
          </div>

          {request.approvedBy && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Approved By</label>
              <p className="text-sm text-gray-900 mt-1">{request.approvedBy}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
