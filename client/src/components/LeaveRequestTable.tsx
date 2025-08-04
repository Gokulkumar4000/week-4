import { LeaveRequest } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Eye } from "lucide-react";
import { format } from "date-fns";

interface LeaveRequestTableProps {
  requests: LeaveRequest[];
  onApprove: (request: LeaveRequest) => void;
  onReject: (request: LeaveRequest) => void;
  onViewDetails: (request: LeaveRequest) => void;
}

export default function LeaveRequestTable({ requests, onApprove, onReject, onViewDetails }: LeaveRequestTableProps) {
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

  const calculateDuration = (fromDate: string, toDate: string) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {getInitials(request.employeeName)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                    <div className="text-sm text-gray-500">{request.department}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-900 capitalize">
                  {request.leaveType.replace(/([A-Z])/g, ' $1').trim()} Leave
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-900">
                  {formatDate(request.fromDate)} - {formatDate(request.toDate)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-900">
                  {calculateDuration(request.fromDate, request.toDate)}
                </span>
              </TableCell>
              <TableCell>
                {getStatusBadge(request.status)}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {request.status === "pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onApprove(request)}
                        className="text-success hover:text-green-700 transition-colors"
                      >
                        <Check size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReject(request)}
                        className="text-error hover:text-red-700 transition-colors"
                      >
                        <X size={16} />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(request)}
                    className="text-primary hover:text-blue-700 transition-colors"
                  >
                    <Eye size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
