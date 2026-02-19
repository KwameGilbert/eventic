import React from "react";
import PropTypes from "prop-types";
import { Loader2 } from "lucide-react";
import { Button } from "../../ui/button";

const PayoutRejectionModal = ({
  isOpen,
  rejectionReason,
  setRejectionReason,
  onReject,
  onCancel,
  isProcessing,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Reject Payout Request
        </h3>
        <p className="text-gray-600 mb-4">
          Please provide a reason for rejecting this payout request. This will
          be visible to the organizer.
        </p>
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Enter rejection reason..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          rows={4}
        />
        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            onClick={onReject}
            disabled={!rejectionReason.trim() || isProcessing}
          >
            {isProcessing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Reject Payout"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

PayoutRejectionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  payoutId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rejectionReason: PropTypes.string.isRequired,
  setRejectionReason: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool,
};

export default PayoutRejectionModal;
