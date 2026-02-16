import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import voteService from "../services/voteService";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [message, setMessage] = useState("Verifying your payment...");
  const [voteDetails, setVoteDetails] = useState(null);

  // Prevent double processing in Strict Mode
  const processingRef = useRef(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid payment token. Please try again.");
      return;
    }

    if (processingRef.current) return;
    processingRef.current = true;

    const verifyPayment = async () => {
      try {
        const response = await voteService.confirmPayment({ token });

        if (response.success && response.data?.status === "paid") {
          setStatus("success");
          setMessage("Payment successful! Your vote has been recorded.");
          setVoteDetails(response.data);
        } else {
          setStatus("error");
          setMessage(response.message || "Payment verification failed.");
          if (response.data?.vote_details) {
            setVoteDetails(response.data.vote_details);
          }
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "An error occurred while verifying your payment. Please contact support.",
        );

        // Check for vote details in error response to allow redirect
        if (err.response?.data?.data?.vote_details) {
          setVoteDetails(err.response.data.data.vote_details);
        } else if (err.response?.data?.data?.order_id) {
          // If we only have reference but no details, we can't easily build the URL
          // unless we fetch it, but backend should have provided it.
        }
      }
    };

    verifyPayment();
  }, [searchParams]);

  // Auto-redirect effect
  useEffect(() => {
    let timer;
    if (status === "success") {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status, navigate]);

  if (status === "processing") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <Loader2 className="w-12 h-12 text-(--brand-primary) animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-900">
          Verifying Payment...
        </h2>
        <p className="text-gray-500 mt-2">
          Please wait while we confirm your transaction.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-8">{message}</p>

          {voteDetails && (
            <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                {voteDetails.nominee?.image && (
                  <img
                    src={voteDetails.nominee.image}
                    alt={voteDetails.nominee.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {voteDetails.nominee?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {voteDetails.category?.name}
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Votes Purchased</span>
                <span className="font-bold text-gray-900">
                  {voteDetails.number_of_votes}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-2">
              Redirecting to homepage in {countdown} seconds...
            </p>
            <button
              onClick={() =>
                navigate(`/award/${voteDetails?.award?.slug || ""}`)
              }
              className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
            >
              Back to Award
            </button>
            <Link
              to="/"
              className="block w-full py-3 px-4 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-8">{message}</p>

        <div className="space-y-3">
          <button
            onClick={() => {
              if (voteDetails?.award?.slug && voteDetails?.nominee?.id) {
                navigate(
                  `/award/${voteDetails.award.slug}/nominee/${voteDetails.nominee.id}`,
                );
              } else {
                navigate(`/awards`);
              }
            }}
            className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
          >
            Try Again
          </button>
          <Link
            to="/"
            className="block w-full py-3 px-4 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
