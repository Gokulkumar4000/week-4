import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LeaveRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: LeaveRequest | null;
}

export default function RejectionModal({ isOpen, onClose, request }: RejectionModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      await apiRequest("PATCH", `/api/leave-requests/${id}`, {
        status: "rejected",
        rejectionReason: reason,
      });
    },
    onSuccess: () => {
      toast({
        title: "Request rejected",
        description: "The leave request has been rejected with feedback.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/leave-requests"] });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject request",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setRejectionReason("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (request && rejectionReason.trim()) {
      rejectMutation.mutate({ id: request.id, reason: rejectionReason.trim() });
    }
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Reject Leave Request
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Employee: <span className="font-medium">{request.employeeName}</span>
          </p>
          <p className="text-sm text-gray-600">
            Leave Period: <span className="font-medium">
              {format(new Date(request.fromDate), "MMM dd")} - {format(new Date(request.toDate), "MMM dd, yyyy")}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason
            </Label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              placeholder="Please provide a reason for rejecting this leave request..."
              required
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={rejectMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="flex-1"
              disabled={rejectMutation.isPending || !rejectionReason.trim()}
            >
              {rejectMutation.isPending ? "Rejecting..." : "Reject Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
