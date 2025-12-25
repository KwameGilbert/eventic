import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Home as HomeIcon, CheckCircle, ArrowLeft, Lock, Trophy, Loader2, Shield, AlertCircle } from 'lucide-react';
import voteService from '../services/voteService';
import { showError as showErrorToast, showLoading, hideLoading, showSuccess } from '../utils/toast';

// Paystack public key
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

const VotePayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { award, category, nominee, votePackage } = location.state || {};

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paystackLoaded, setPaystackLoaded] = useState(false);
    const [error, setError] = useState('');

    // Ref to track payment completion
    const paymentCompleteRef = useRef(false);

    // Voter info
    const [voterInfo, setVoterInfo] = useState({
        voter_name: '',
        voter_email: '',
        voter_phone: '',
    });

    // Load Paystack script
    useEffect(() => {
        const existingScript = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');

        if (existingScript) {
            setPaystackLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        script.onload = () => setPaystackLoaded(true);
        document.body.appendChild(script);
    }, []);

    // Redirect if no data
    if (!award || !category || !nominee || !votePackage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm">
                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Payment Request</h2>
                    <Link to="/awards" className="text-(--brand-primary) hover:underline font-semibold">
                        Browse Award Events →
                    </Link>
                </div>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVoterInfo(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handlePaystackPayment = async (e) => {
        e.preventDefault();

        // Validate voter info
        if (!voterInfo.voter_email) {
            showErrorToast('Please enter your email address');
            return;
        }

        if (!paystackLoaded || !window.PaystackPop) {
            showErrorToast('Payment system is loading. Please try again.');
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            // Show loading
            showLoading('Initiating vote...');

            // Initiate vote on backend
            const voteData = {
                number_of_votes: votePackage.votes,
                voter_email: voterInfo.voter_email,
                voter_name: voterInfo.voter_name || null,
                voter_phone: voterInfo.voter_phone || null,
            };

            const result = await voteService.initiateVote(nominee.id, voteData);

            hideLoading();

            if (!result.success || !result.data) {
                showErrorToast(result.message || 'Failed to initiate vote. Please try again.');
                setIsProcessing(false);
                return;
            }

            const { vote_id, reference, total_amount } = result.data;

            // Convert amount to kobo (Paystack uses smallest currency unit)
            const amountInKobo = Math.round(total_amount * 100);

            // Initialize Paystack popup
            const handler = window.PaystackPop.setup({
                key: PAYSTACK_PUBLIC_KEY,
                email: voterInfo.voter_email,
                amount: amountInKobo,
                currency: 'GHS',
                ref: reference,
                metadata: {
                    vote_id: vote_id,
                    nominee_id: nominee.id,
                    nominee_name: nominee.name,
                    category_id: category.id,
                    category_name: category.name,
                    award_id: award.id,
                    award_title: award.title,
                    number_of_votes: votePackage.votes,
                    custom_fields: [
                        {
                            display_name: "Vote ID",
                            variable_name: "vote_id",
                            value: String(vote_id)
                        },
                        {
                            display_name: "Nominee",
                            variable_name: "nominee_name",
                            value: nominee.name
                        },
                        {
                            display_name: "Number of Votes",
                            variable_name: "number_of_votes",
                            value: String(votePackage.votes)
                        }
                    ]
                },
                callback: function (response) {
                    showLoading('Verifying payment...');

                    // Confirm payment with backend
                    voteService.confirmPayment(response.reference)
                        .then(confirmResult => {
                            hideLoading();

                            if (confirmResult.success && confirmResult.data?.status === 'paid') {
                                // Mark payment as complete
                                paymentCompleteRef.current = true;

                                // Show success and redirect
                                showSuccess(confirmResult.message || 'Vote submitted successfully!');
                                setPaymentSuccess(true);
                            } else {
                                showErrorToast('Payment verification failed. Please contact support with reference: ' + response.reference);
                            }
                        })
                        .catch((err) => {
                            hideLoading();
                            console.error('Payment confirmation error:', err);

                            // Even if verification fails, payment might have succeeded
                            paymentCompleteRef.current = true;
                            showSuccess('Payment completed. Your vote will be confirmed shortly.');
                            setPaymentSuccess(true);
                        })
                        .finally(() => {
                            setIsProcessing(false);
                        });
                },
                onClose: function () {
                    setIsProcessing(false);
                    // User closed payment modal - don't show error
                }
            });

            handler.openIframe();

        } catch (err) {
            hideLoading();
            console.error('Vote initiation error:', err);
            showErrorToast(err.message || 'Something went wrong. Please try again.');
            setIsProcessing(false);
        }
    };

    // Success State
    if (paymentSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Vote Submitted Successfully!</h2>
                    <p className="text-gray-600 mb-6">
                        Your {votePackage.votes} {votePackage.votes === 1 ? 'vote' : 'votes'} for <strong>{nominee.name}</strong> has been recorded.
                    </p>
                    <div className="space-y-3">
                        <Link
                            to={`/award/${award.slug}`}
                            className="block w-full px-4 py-3 bg-(--brand-primary) text-white rounded-lg hover:opacity-90 transition-opacity font-bold"
                        >
                            Back to Award
                        </Link>
                        <Link
                            to="/"
                            className="block w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                        >
                            Go to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Link to="/" className="hover:text-(--brand-primary)">
                                <HomeIcon size={16} />
                            </Link>
                            <span>/</span>
                            <Link to="/awards" className="hover:text-(--brand-primary)">Award Events</Link>
                            <span>/</span>
                            <Link to={`/award/${award.slug}`} className="hover:text-(--brand-primary)">{award.title}</Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">Payment</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error Alert */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-semibold text-red-800">Error</h4>
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Payment Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            {/* Back Button */}
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                            >
                                <ArrowLeft size={20} />
                                <span>Back</span>
                            </button>

                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Voter Information</h2>

                            {/* Voter Info Form */}
                            <form onSubmit={handlePaystackPayment}>
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address*
                                        </label>
                                        <input
                                            type="email"
                                            name="voter_email"
                                            value={voterInfo.voter_email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent"
                                            placeholder="yourmail@gmail.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name (optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="voter_name"
                                            value={voterInfo.voter_name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number (optional)
                                        </label>
                                        <input
                                            type="tel"
                                            name="voter_phone"
                                            value={voterInfo.voter_phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent"
                                            placeholder="+233 XX XXX XXXX"
                                        />
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
                                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                        <Shield className="text-white" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-green-800">Secure Payment with Paystack</h3>
                                        <p className="text-sm text-green-700">Pay securely using your card or mobile money</p>
                                    </div>
                                </div>

                                {/* Accepted Payment Methods */}
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <span className="text-sm text-gray-500">We accept:</span>
                                    <div className="flex gap-2">
                                        <div className="px-3 py-1.5 bg-gray-100 rounded text-xs font-medium text-gray-700">Visa</div>
                                        <div className="px-3 py-1.5 bg-gray-100 rounded text-xs font-medium text-gray-700">Mastercard</div>
                                        <div className="px-3 py-1.5 bg-gray-100 rounded text-xs font-medium text-gray-700">MTN MoMo</div>
                                        <div className="px-3 py-1.5 bg-gray-100 rounded text-xs font-medium text-gray-700">Vodafone Cash</div>
                                    </div>
                                </div>

                                {/* Security Notice */}
                                <div className="p-4 bg-gray-50 rounded-lg flex items-start gap-3 mb-6">
                                    <Lock className="text-green-600 shrink-0 mt-0.5" size={20} />
                                    <div className="text-sm text-gray-600">
                                        <strong className="text-gray-900">Secure Payment</strong>
                                        <p>Your payment information is encrypted and secure.</p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isProcessing || !paystackLoaded}
                                    className="w-full bg-(--brand-primary) text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={20} />
                                            Pay GH₵{votePackage.price.toFixed(2)}
                                        </>
                                    )}
                                </button>

                                {!paystackLoaded && (
                                    <p className="text-center text-sm text-gray-500 mt-2">
                                        <Loader2 className="inline animate-spin mr-1" size={14} />
                                        Loading payment system...
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

                            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">Award</div>
                                    <div className="font-semibold text-gray-900">{award.title}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">Category</div>
                                    <div className="font-semibold text-gray-900">{category.name}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">Nominee</div>
                                    <div className="font-semibold text-gray-900">{nominee.name}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">Number of Votes</div>
                                    <div className="font-semibold text-gray-900">{votePackage.votes} {votePackage.votes === 1 ? 'vote' : 'votes'}</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold text-gray-900">GH₵{votePackage.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Processing Fee</span>
                                    <span className="font-semibold text-gray-900">GH₵0.00</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="font-bold text-(--brand-primary) text-xl">GH₵{votePackage.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VotePayment;
