import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CreditCard, Home as HomeIcon, CheckCircle, ArrowLeft, Lock, Trophy } from 'lucide-react';

const VotePayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { award, category, nominee, votePackage } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Redirect if no data
    if (!award || !category || !nominee || !votePackage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm">
                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Payment Request</h2>
                    <Link to="/awards" className="text-(--brand-primary) hover:underline font-semibold">
                        Browse Awards →
                    </Link>
                </div>
            </div>
        );
    }

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setPaymentSuccess(true);
        }, 2000);
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
                            to="/my-votes"
                            className="block w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                        >
                            View My Votes
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
                            <Link to="/awards" className="hover:text-(--brand-primary)">Awards</Link>
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

                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

                            {/* Payment Method Selection */}
                            <div className="mb-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setPaymentMethod('card')}
                                        className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'card'
                                                ? 'border-(--brand-primary) bg-(--brand-primary)/5'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <CreditCard className="mx-auto mb-2" size={24} />
                                        <div className="font-semibold">Credit/Debit Card</div>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('mobile')}
                                        className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'mobile'
                                                ? 'border-(--brand-primary) bg-(--brand-primary)/5'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="text-2xl mb-2">📱</div>
                                        <div className="font-semibold">Mobile Money</div>
                                    </button>
                                </div>
                            </div>

                            {/* Payment Form */}
                            <form onSubmit={handlePayment}>
                                {paymentMethod === 'card' ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="1234 5678 9012 3456"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Expiry Date
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    CVV
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="123"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Cardholder Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mobile Money Provider
                                            </label>
                                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent">
                                                <option>MTN Mobile Money</option>
                                                <option>Vodafone Cash</option>
                                                <option>AirtelTigo Money</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                placeholder="024 123 4567"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Security Notice */}
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg flex items-start gap-3">
                                    <Lock className="text-green-600 shrink-0 mt-0.5" size={20} />
                                    <div className="text-sm text-gray-600">
                                        <strong className="text-gray-900">Secure Payment</strong>
                                        <p>Your payment information is encrypted and secure.</p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full mt-6 bg-(--brand-primary) text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={20} />
                                            Pay GH₵{votePackage.price.toFixed(2)}
                                        </>
                                    )}
                                </button>
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
