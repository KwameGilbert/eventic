import React from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Smartphone,
  Building2,
  Users,
  Loader2,
  AlertCircle,
  Activity,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { cn } from "../../../lib/utils";
import adminService from "../../../services/adminService";
import PropTypes from "prop-types";

const PayoutDetailModal = ({
  isOpen,
  payoutId,
  data,
  isLoading,
  onClose,
  onApprove,
  onReject,
  onComplete,
}) => {
  if (!isOpen) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Payout Details</h3>
            <p className="text-sm text-gray-500">Request #{payoutId}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full w-8 h-8 p-0 border-0 hover:bg-gray-100"
            onClick={onClose}
          >
            <XCircle size={18} />
          </Button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2
              size={40}
              className="animate-spin text-red-600 mx-auto mb-4"
            />
            <p className="text-gray-500">Loading payout details...</p>
          </div>
        ) : data ? (
          <div className="p-6 space-y-8">
            {/* Status Banner */}
            <div
              className={cn(
                "p-4 rounded-xl flex items-center justify-between",
                data.status === "completed"
                  ? "bg-green-50 border border-green-100"
                  : data.status === "rejected"
                    ? "bg-red-50 border border-red-100"
                    : data.status === "processing"
                      ? "bg-blue-50 border border-blue-100"
                      : "bg-yellow-50 border border-yellow-100",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    data.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : data.status === "rejected"
                        ? "bg-red-100 text-red-600"
                        : data.status === "processing"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-yellow-100 text-yellow-600",
                  )}
                >
                  {data.status === "completed" ? (
                    <CheckCircle size={20} />
                  ) : data.status === "rejected" ? (
                    <XCircle size={20} />
                  ) : data.status === "processing" ? (
                    <Activity size={20} />
                  ) : (
                    <Clock size={20} />
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 capitalize">
                    {data.status_label || data.status}
                  </p>
                  <p className="text-xs text-gray-500">
                    Submitted on {formatDate(data.created_at)}
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {adminService.formatCurrency(data.amount)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Organizer Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Organizer Details
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {data.organizer?.name}
                      </p>
                      <p className="text-xs text-gray-500">Organization</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                      <Users size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {data.organizer?.email}
                      </p>
                      <p className="text-xs text-gray-500">Contact Email</p>
                    </div>
                  </div>
                  {data.organizer?.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                        <Smartphone size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {data.organizer?.phone}
                        </p>
                        <p className="text-xs text-gray-500">Phone Number</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Source Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Source Information
                </h4>
                <div className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Type</span>
                    <Badge
                      variant={
                        data.payout_type === "event" ? "info" : "secondary"
                      }
                      className="capitalize"
                    >
                      {data.payout_type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Item</span>
                    <span
                      className="text-sm font-medium text-gray-900 text-right max-w-[150px] truncate"
                      title={data.source_name}
                    >
                      {data.source_name}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Requested Amount
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {adminService.formatCurrency(data.amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method Details */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Payment Destination
                </h4>
                <div className="p-5 border border-gray-100 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Method</p>
                    <div className="flex items-center gap-2">
                      {data.payment_method?.includes("Mobile") ? (
                        <Smartphone size={16} className="text-gray-400" />
                      ) : (
                        <Building2 size={16} className="text-gray-400" />
                      )}
                      <p className="text-sm font-bold text-gray-900">
                        {data.payment_method}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Bank/Network</p>
                    <p className="text-sm font-bold text-gray-900">
                      {data.bank_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Account Number</p>
                    <p className="text-sm font-bold text-gray-900 tracking-wider">
                      {data.account_number}
                    </p>
                  </div>
                  <div className="sm:col-span-3">
                    <p className="text-xs text-gray-500 mb-1">Account Name</p>
                    <p className="text-sm font-bold text-gray-900">
                      {data.account_name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Processed Info */}
              {data.status !== "pending" && (
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                    Processing Details
                  </h4>
                  <div className="p-4 bg-gray-50 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4 border border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Processed By</p>
                      <p className="text-sm font-medium text-gray-900">
                        {data.processed_by || "System"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Processed At</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(data.processed_at)}
                      </p>
                    </div>
                    {data.rejection_reason && (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-red-500 font-bold mb-1">
                          Rejection Reason
                        </p>
                        <p className="text-sm text-red-700 bg-red-100/50 p-3 rounded-lg border border-red-200">
                          {data.rejection_reason}
                        </p>
                      </div>
                    )}
                    {data.notes && (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-gray-500 mb-1">
                          Admin Notes
                        </p>
                        <p className="text-sm text-gray-700 italic bg-white p-3 rounded-lg border border-gray-100">
                          `{data.notes}`
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions within Modal */}
            <div className="pt-6 border-t border-gray-100 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Close
              </Button>

              {data.status === "pending" && (
                <>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => onApprove(data.id)}
                  >
                    Approve Payout
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => onReject(data.id)}
                  >
                    Reject
                  </Button>
                </>
              )}

              {data.status === "processing" && (
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => onComplete(data.id)}
                >
                  Mark as Completed
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <AlertCircle size={40} className="mx-auto mb-4 text-gray-300" />
            <p>Failed to load payout details. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

PayoutDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  payoutId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  data: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    status_label: PropTypes.string,
    created_at: PropTypes.string,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    organizer: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
    }),
    payout_type: PropTypes.string,
    source_name: PropTypes.string,
    payment_method: PropTypes.string,
    bank_name: PropTypes.string,
    account_number: PropTypes.string,
    account_name: PropTypes.string,
    processed_by: PropTypes.string,
    processed_at: PropTypes.string,
    rejection_reason: PropTypes.string,
    notes: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default PayoutDetailModal;
