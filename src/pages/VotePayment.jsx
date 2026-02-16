import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Home as HomeIcon,
  CheckCircle,
  Lock,
  Trophy,
  Loader2,
  Shield,
  AlertCircle,
} from "lucide-react";
import voteService from "../services/voteService";
import {
  showError as showErrorToast,
  showLoading,
  hideLoading,
  showSuccess,
} from "../utils/toast";

const VotePayment = () => {
  const location = useLocation();
  const { award, category, nominee, votePackage } = location.state || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Ref to track payment completion
  const paymentCompleteRef = useRef(false);

  // Voter info
  const [voterInfo, setVoterInfo] = useState({
    voter_name: "",
    voter_email: "",
    voter_phone: "",
  });

  // Redirect if no data
  if (!award || !category || !nominee || !votePackage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Invalid Payment Request
          </h2>
          <Link
            to="/awards"
            className="text-(--brand-primary) hover:underline font-semibold"
          >
            Browse Award Events →
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVoterInfo((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    setIsProcessing(true);
    setError("");

    // Use provided email or fallback to anonymous
    const emailToUse = voterInfo.voter_email || "anonymous@eventic.com";

    try {
      // Show loading
      showLoading("Initiating vote...");

      // Initiate vote on backend
      const voteData = {
        number_of_votes: votePackage.votes,
        voter_email: emailToUse,
        voter_name: voterInfo.voter_name || null,
        voter_phone: voterInfo.voter_phone || null,
      };

      const result = await voteService.initiateVote(nominee.id, voteData);

      hideLoading();

      if (!result.success || !result.data) {
        showErrorToast(
          result.message || "Failed to initiate vote. Please try again.",
        );
        setIsProcessing(false);
        return;
      }

      const { checkout_url, vote_id } = result.data;

      if (checkout_url) {
        // Redirect to ExpressPay
        showSuccess("Redirecting to payment gateway...");
        window.location.href = checkout_url;
      } else {
        showErrorToast("Failed to generate payment link.");
        setIsProcessing(false);
      }
    } catch (err) {
      hideLoading();
      console.error("Vote initiation error:", err);
      showErrorToast(err.message || "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Complete Payment
            </h1>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-(--brand-primary)">
                <HomeIcon size={16} />
              </Link>
              <span>/</span>
              <Link to="/awards" className="hover:text-(--brand-primary)">
                Award Events
              </Link>
              <span>/</span>
              <Link
                to={`/award/${award.slug}`}
                className="hover:text-(--brand-primary)"
              >
                {award.title}
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle
              className="text-red-600 flex-shrink-0 mt-0.5"
              size={18}
            />
            <div>
              <h4 className="font-semibold text-red-900 text-sm">
                Payment Error
              </h4>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 max-w-xl mx-auto">
          {/* Top - Verification Summary */}
          <div>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">
                Verification Summary
              </h3>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 overflow-hidden shrink-0">
                  {nominee.image || nominee.nominee_image ? (
                    <img
                      src={nominee.image || nominee.nominee_image}
                      alt={nominee.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold text-xl">
                      {nominee.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg leading-tight">
                    {nominee.name}
                  </h4>
                  <p className="text-sm text-gray-500">{category.name}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vote Quantity</span>
                  <span className="font-medium text-gray-900">
                    {votePackage.votes}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unit Cost</span>
                  <span className="font-medium text-gray-900">
                    GH₵{(votePackage.price / votePackage.votes).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Due</span>
                  <span className="font-bold text-(--brand-primary) text-xl">
                    GH₵{votePackage.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom - Payment Form */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Payer Details
              </h2>

              <form onSubmit={handlePayment}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Email Address{" "}
                      <span className="text-gray-400 font-normal normal-case">
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="email"
                      name="voter_email"
                      value={voterInfo.voter_email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent transition-all"
                      placeholder="receipts@example.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Name{" "}
                        <span className="text-gray-400 font-normal normal-case">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="voter_name"
                        value={voterInfo.voter_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Phone{" "}
                        <span className="text-gray-400 font-normal normal-case">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="tel"
                        name="voter_phone"
                        value={voterInfo.voter_phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent transition-all"
                        placeholder="024 XXX XXXX"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gray-900 text-white font-bold py-3.5 px-6 rounded-lg hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span className="text-sm">Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      <span className="text-sm">
                        Pay Securely GH₵{votePackage.price.toFixed(2)}
                      </span>
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                  <Shield size={12} className="text-blue-500" />
                  Secured by ExpressPay
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotePayment;
