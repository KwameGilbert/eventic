import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Home as HomeIcon,
  Trophy,
  Loader2,
  CreditCard,
  Shield,
  AlertCircle,
} from "lucide-react";
import PropTypes from "prop-types";
import voteService from "../services/voteService";
import SEO from "../components/common/SEO";
import {
  showError as showErrorToast,
  showLoading,
  hideLoading,
} from "../utils/toast";

const POLLING_INTERVAL = 3000;

const VotePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { award, category, nominee, votePackage } = location.state || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [network, setNetwork] = useState("MTN");
  const pollingIntervalRef = useRef(null);
  const [error, setError] = useState("");

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

  // Verification polling for direct charge
  const startPolling = (reference) => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const verifyResult = await voteService.confirmPayment({ reference });

        if (verifyResult.success && verifyResult.data?.status === "paid") {
          clearInterval(pollingIntervalRef.current);
          hideLoading();

          navigate("/payment/callback", {
            state: {
              status: "success",
              message: "Payment successful! Your vote has been recorded.",
              voteDetails: verifyResult.data,
            },
            search: `?token=${verifyResult.data.payment_token || ""}`,
          });
        } else if (verifyResult.data?.status === "failed") {
          clearInterval(pollingIntervalRef.current);
          hideLoading();
          showErrorToast("Payment failed. Please try again.");
          setIsProcessing(false);
        }
      } catch (pollErr) {
        console.error("Polling error:", pollErr);
      }
    }, POLLING_INTERVAL);
  };

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();

    setIsProcessing(true);
    setError("");

    try {
      showLoading("Initiating payment...");
      const isCard = network === "CARD";
      const emailToUse = voterInfo.voter_email || "anonymous@eventic.com";

      // Create pending vote
      const voteData = {
        number_of_votes: votePackage.votes,
        voter_email: emailToUse,
        voter_name: voterInfo.voter_name || null,
        voter_phone: voterInfo.voter_phone || null,
        direct_charge: !isCard,
        network: network,
      };

      const result = await voteService.initiateVote(nominee.id, voteData);

      if (!result.success) {
        hideLoading();
        showErrorToast(result.message || "Failed to initiate payment.");
        setIsProcessing(false);
        return;
      }

      const { payment_token, is_direct, reference, checkout_url } = result.data;

      if (checkout_url) {
        hideLoading();
        window.location.href = checkout_url;
      } else if (is_direct || payment_token) {
        // Start polling for direct charge
        showLoading("Waiting for payment authorization on your phone...");
        startPolling(reference);
      } else {
        hideLoading();
        showErrorToast("Failed to initiate payment.");
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
      <SEO
        title={`Payment: ${nominee.name}`}
        description={`Complete your vote for ${nominee.name} in the ${category.name} category.`}
      />
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
                        Phone*
                      </label>
                      <input
                        type="tel"
                        name="voter_phone"
                        value={voterInfo.voter_phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent transition-all"
                        placeholder="054 XXX XXXX"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Direct Mobile Money Network Selection */}
                <div className="space-y-4 mb-6">
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center gap-2 mb-3">
                      <img
                        src="/images/momo-icons.png"
                        alt="MoMo"
                        className="h-5 object-contain"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Pay with Mobile Money
                      </label>
                    </div>

                    <p className="text-[11px] text-gray-500 mb-4 font-medium">
                      Select your network and authorize the payment on your
                      phone via STK push.
                    </p>

                    <div className="flex gap-2">
                      {["MTN", "VODAFONE", "AIRTELTIGO", "CARD"].map((net) => (
                        <button
                          key={net}
                          type="button"
                          onClick={() => setNetwork(net)}
                          className={`flex-1 py-3 px-1 rounded-lg border-2 font-bold text-xs transition-all shadow-sm ${
                            network === net
                              ? "border-(--brand-primary) bg-white text-(--brand-primary) ring-2 ring-(--brand-primary)/10"
                              : "border-gray-100 bg-white text-gray-400 hover:border-gray-200"
                          }`}
                        >
                          {net === "AIRTELTIGO" ? "AT" : net}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-(--brand-primary) text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Pay GH₵{votePackage.price.toFixed(2)}
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                  <Shield size={12} className="text-blue-500" />
                  Secured by Kowri
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

VotePayment.propTypes = {
  // Not strictly props as it's a page component using location.state,
  // but good for documentation.
  award: PropTypes.object,
  category: PropTypes.object,
  nominee: PropTypes.object,
  votePackage: PropTypes.object,
};

export default VotePayment;
