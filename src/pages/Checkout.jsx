import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  ChevronRight,
  Clock,
  CreditCard,
  MapPin,
  Calendar,
  CheckCircle,
  Loader2,
  Shield,
  AlertCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import orderService from "../services/orderService";
import { Badge } from "../components/ui/badge";
import {
  showPaymentSuccess,
  showError as showErrorToast,
  showLoading,
  hideLoading,
} from "../utils/toast";

// Polling interval for payment verification
const POLLING_INTERVAL = 3000;

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, isLoaded, clearCart } = useCart();
  const { user } = useAuth();

  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Ref to track if payment was completed successfully (prevents empty cart redirect)
  const paymentCompleteRef = useRef(false);
  const pollingIntervalRef = useRef(null);

  // Payment state
  const [network, setNetwork] = useState("MTN");

  // Billing form state
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Initialize billing info from user data
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || "").split(" ");
      setBillingInfo({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // Redirect if cart is empty (but not after successful payment)
  useEffect(() => {
    if (isLoaded && cartItems.length === 0 && !paymentCompleteRef.current) {
      navigate("/cart");
    }
  }, [cartItems, isLoaded, navigate]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          navigate("/cart", {
            state: { message: "Your session expired. Please try again." },
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate totals using orderService
  const { subtotal, fees, total, itemCount } =
    orderService.calculateTotal(cartItems);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Verification polling
  const startPolling = (orderId) => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const verifyResult = await orderService.verifyPayment(orderId);
        const data = verifyResult.data || verifyResult;

        if (data.status === "paid" || data.status === "completed") {
          clearInterval(pollingIntervalRef.current);
          hideLoading();
          paymentCompleteRef.current = true;
          showPaymentSuccess({
            reference: data.payment_reference || data.reference,
            orderId: data.order_id || data.id,
          }).then(() => {
            clearCart();
            navigate("/my-tickets", {
              state: {
                paymentSuccess: true,
                orderId: data.order_id || data.id,
              },
            });
          });
        } else if (data.status === "failed") {
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

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  // Handle Kowri payment
  const handleKowriPayment = async () => {
    // Validate billing info
    if (!billingInfo.email || !billingInfo.firstName) {
      showErrorToast("Please fill in your name and email address");
      return;
    }

    if (!billingInfo.phone) {
      showErrorToast("Please provide a phone number for Mobile Money");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Show loading
      showLoading("Creating your order...");

      // 1. Create order on backend
      const result = await orderService.processCheckout(cartItems, billingInfo);

      if (!result.success) {
        hideLoading();
        showErrorToast(
          result.error || "Failed to create order. Please try again.",
        );
        setIsProcessing(false);
        return;
      }

      const { kowri } = result;

      // 2. Initialize payment
      showLoading("Initializing payment...");
      const isCard = network === "CARD";

      const payload = {
        direct_charge: !isCard,
        network: network,
        phone: billingInfo.phone,
      };

      const initResult = await orderService.initializePayment(
        kowri.orderId,
        payload,
      );

      if (!initResult.success) {
        hideLoading();
        showErrorToast("Failed to initialize payment. Please try again.");
        setIsProcessing(false);
        return;
      }

      const { pay_token, mode, checkout_url } = initResult.data;

      if (checkout_url) {
        hideLoading();
        window.location.href = checkout_url;
      } else if (mode === "direct" || pay_token) {
        showLoading("Waiting for payment authorization on your phone...");
        startPolling(kowri.orderId);
      } else {
        hideLoading();
        showErrorToast("Could not initiate payment.");
        setIsProcessing(false);
      }
    } catch (err) {
      hideLoading();
      console.error("Checkout error:", err);
      showErrorToast(err.message || "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Mobile Sticky Timer */}
      <div className="lg:hidden sticky top-0 z-10 bg-orange-500 text-white px-4 py-3 text-center font-bold shadow-md flex items-center justify-center gap-2">
        <Clock size={18} />
        <span>{formatTime(timeLeft)} left to complete purchase</span>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <nav className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <Link
                to="/"
                className="hover:text-[var(--brand-primary)] flex items-center gap-1"
              >
                <Home size={16} />
              </Link>
              <ChevronRight size={16} />
              <Link to="/cart" className="hover:text-[var(--brand-primary)]">
                My cart
              </Link>
              <ChevronRight size={16} />
              <span className="text-gray-900 font-medium">Checkout</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle
              className="text-red-600 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div>
              <h4 className="font-semibold text-red-800">Error</h4>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">
                  Order summary
                </h2>
                <span className="text-sm text-gray-500">
                  {itemCount} tickets
                </span>
              </div>
              <div className="p-6">
                {/* Desktop Header */}
                <div className="hidden md:grid grid-cols-12 text-sm font-medium text-gray-500 mb-4 pb-2 border-b border-gray-100">
                  <div className="col-span-6">Event / Ticket</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                <div className="space-y-6">
                  {cartItems.map((item) =>
                    Object.entries(item.tickets).map(([ticketName, qty]) => {
                      const numericQty = parseInt(qty, 10);
                      if (numericQty <= 0) return null;
                      const ticketType = item.event.ticketTypes?.find(
                        (t) => t.name === ticketName,
                      );
                      const unitPrice =
                        ticketType?.effectivePrice || ticketType?.price || 0;
                      const isSale = ticketType?.isSaleActive;

                      return (
                        <div
                          key={`${item.id}-${ticketName}`}
                          className="flex flex-col md:grid md:grid-cols-12 gap-4 border-b border-gray-100 last:border-0 pb-6 md:pb-0"
                        >
                          <div className="col-span-6">
                            <div className="flex gap-4">
                              <img
                                src={item.event.image}
                                alt={item.event.title}
                                className="w-20 h-20 md:w-16 md:h-16 object-cover rounded-lg shrink-0 shadow-sm"
                              />
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                                  {item.event.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="text-sm text-[var(--brand-primary)] font-medium">
                                    {ticketName}
                                  </p>
                                  {isSale && (
                                    <Badge
                                      variant="success"
                                      className="text-[10px] py-0"
                                    >
                                      SALE
                                    </Badge>
                                  )}
                                </div>

                                {/* Mobile Price/Qty Row */}
                                <div className="flex md:hidden items-center justify-between mt-2 bg-gray-50 p-2 rounded-lg">
                                  <span className="text-sm text-gray-600">
                                    GH₵{unitPrice.toFixed(2)} × {numericQty}
                                  </span>
                                  <span className="font-bold text-gray-900">
                                    GH₵{(unitPrice * numericQty).toFixed(2)}
                                  </span>
                                </div>

                                <div className="hidden md:block space-y-1 text-xs text-gray-500 mt-1">
                                  <div className="flex items-center gap-1.5">
                                    <Calendar size={12} />
                                    <span>{formatDate(item.event.date)}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <MapPin size={12} />
                                    <span className="line-clamp-1">
                                      {item.event.venue}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="hidden md:flex col-span-2 items-center justify-center text-gray-900">
                            GH₵{unitPrice.toFixed(2)}
                          </div>
                          <div className="hidden md:flex col-span-2 items-center justify-center text-gray-900">
                            {numericQty}
                          </div>
                          <div className="hidden md:flex col-span-2 items-center justify-end font-bold text-[var(--brand-primary)]">
                            GH₵{(unitPrice * numericQty).toFixed(2)}
                          </div>
                        </div>
                      );
                    }),
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  Contact Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      First name*
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={billingInfo.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all outline-none"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Last name*
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={billingInfo.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all outline-none"
                      placeholder="Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={billingInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all outline-none"
                      placeholder="yourmail@gmail.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone*
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={billingInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-(--brand-primary) focus:ring-2 focus:ring-(--brand-primary)/20 transition-all outline-none"
                      placeholder="024 XXX XXXX"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Payment</h2>
              </div>
              <div className="p-6">
                {/* Paystack Info */}
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <Shield className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-green-800">
                      Secure Payment with Kowri
                    </h3>
                    <p className="text-sm text-green-700">
                      Pay securely using Mobile Money or Card via Kowri
                    </p>
                  </div>
                </div>

                {/* Direct Mobile Money Network Selection */}
                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center gap-2 mb-4">
                      <img
                        src="/images/momo-icons.png"
                        alt="MoMo"
                        className="h-6 object-contain"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      <label className="block text-sm font-bold text-gray-700">
                        Pay with Mobile Money
                      </label>
                    </div>

                    <p className="text-xs text-gray-500 mb-4">
                      Choose your network and authorize the payment on your
                      phone.
                    </p>

                    <div className="flex gap-3">
                      {["MTN", "VODAFONE", "AIRTELTIGO", "CARD"].map((net) => (
                        <button
                          key={net}
                          type="button"
                          onClick={() => setNetwork(net)}
                          className={`flex-1 py-4 px-2 rounded-xl border-2 font-bold text-sm transition-all shadow-sm ${
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

                {/* Pay Button */}
                <button
                  onClick={handleKowriPayment}
                  disabled={isProcessing}
                  className="w-full bg-(--brand-primary) text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-(--brand-primary)/30 flex items-center justify-center gap-2 text-lg uppercase transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={24} />
                      Pay GH₵{total.toFixed(2)} Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Desktop Timer */}
              <div className="hidden lg:flex bg-orange-400 text-white p-4 rounded-xl items-center justify-center gap-2 font-bold shadow-md">
                <Clock size={20} />
                <span>{formatTime(timeLeft)} left</span>
              </div>

              {/* Total Summary */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Summary
                </h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-gray-600 font-medium">
                    <span>Subtotal ({itemCount} tickets)</span>
                    <span>GH₵{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600 font-medium">
                    <span>Processing Fee (1.5%)</span>
                    <span>GH₵{fees.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-(--brand-primary)">
                      GH₵{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg text-sm text-green-800">
                  <CheckCircle size={16} className="shrink-0 mt-0.5" />
                  <p>Your transaction is secured with SSL encryption.</p>
                </div>
              </div>

              {/* Refund Policy */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">Refund Policy</h3>
                <p className="text-sm text-gray-600">
                  Tickets are non-refundable. However, you may transfer your
                  ticket to another person up to 24 hours before the event.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
