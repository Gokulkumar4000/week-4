import { LeaveRequest } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface LeaveRequestCardProps {
  request: LeaveRequest;
  onViewDetails: (request: LeaveRequest) => void;
  onResubmit?: (request: LeaveRequest) => void;
}

export default function LeaveRequestCard({ request, onViewDetails, onResubmit }: LeaveRequestCardProps) {
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

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-medium text-gray-800 capitalize">
              {request.leaveType.replace(/([A-Z])/g, ' $1').trim()} Leave
            </h4>
            <p className="text-sm text-gray-600">
              {formatDate(request.fromDate)} - {formatDate(request.toDate)}
            </p>
          </div>
          {getStatusBadge(request.status)}
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{request.reason}</p>
        
        {request.status === "rejected" && request.rejectionReason && (
          <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-3">
            <p className="text-sm text-red-700">
              <strong>Rejection Reason:</strong> {request.rejectionReason}
            </p>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {request.status === "approved" && request.approvedBy
              ? `Approved by: ${request.approvedBy}`
              : `Submitted: ${formatDate(request.submittedAt.toString())}`}
          </span>
          <div className="space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(request)}
              className="text-sm text-primary hover:text-blue-700 font-medium"
            >
              View Details
            </Button>
            {request.status === "rejected" && onResubmit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onResubmit(request)}
                className="text-sm text-primary hover:text-blue-700 font-medium"
              >
                Resubmit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
