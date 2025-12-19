import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    X,
    Smartphone,
    Building2,
    AlertCircle,
    ChevronDown,
    Loader2,
    Trophy,
    Calendar
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import financeService from '../../services/financeService';
import { showError, showSuccess } from '../../utils/toast';

/**
 * PayoutRequestModal - Modal component for requesting payouts
 * 
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Function to close the modal
 * @param {Array} eventsData - Array of events with revenue data
 * @param {Array} awardsData - Array of awards with revenue data
 * @param {function} onSuccess - Callback after successful payout request
 */
const PayoutRequestModal = ({ isOpen, onClose, eventsData = [], awardsData = [], onSuccess }) => {
    const [selectedItems, setSelectedItems] = useState({ events: [], awards: [] });
    const [paymentMethod, setPaymentMethod] = useState('mobile_money');
    const [payoutFilter, setPayoutFilter] = useState('all');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [amount, setAmount] = useState('');
    const [paymentDetails, setPaymentDetails] = useState({
        mobileNetwork: '',
        mobileNumber: '',
        mobileAccountName: '',
        bankName: '',
        accountName: '',
        accountNumber: '',
        swiftCode: ''
    });

    // Mobile networks
    const mobileNetworks = [
        'MTN Mobile Money',
        'Vodafone Cash',
        'AirtelTigo Money'
    ];

    // Banks
    const banks = [
        'Ghana Commercial Bank',
        'Ecobank Ghana',
        'Stanbic Bank',
        'Zenith Bank',
        'Fidelity Bank',
        'Access Bank',
        'Standard Chartered',
        'Absa Bank'
    ];

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedItems({ events: [], awards: [] });
            setPaymentMethod('mobile_money');
            setPayoutFilter('all');
            setAmount('');
            setPaymentDetails({
                mobileNetwork: '',
                mobileNumber: '',
                mobileAccountName: '',
                bankName: '',
                accountName: '',
                accountNumber: '',
                swiftCode: ''
            });
        }
    }, [isOpen]);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleItemSelect = (type, itemId) => {
        setSelectedItems(prev => ({
            ...prev,
            [type]: prev[type].includes(itemId)
                ? prev[type].filter(id => id !== itemId)
                : [...prev[type], itemId]
        }));
    };

    const getEligibleItems = () => {
        const eligibleEvents = eventsData.filter(e => e.is_eligible_for_payout);
        const eligibleAwards = awardsData.filter(a => a.is_eligible_for_payout);

        if (payoutFilter === 'events') return { events: eligibleEvents, awards: [] };
        if (payoutFilter === 'awards') return { events: [], awards: eligibleAwards };
        return { events: eligibleEvents, awards: eligibleAwards };
    };

    const getSelectedTotal = () => {
        const selectedEvents = eventsData.filter(e =>
            selectedItems.events.includes(e.event_id) && e.is_eligible_for_payout
        );
        const selectedAwards = awardsData.filter(a =>
            selectedItems.awards.includes(a.award_id) && a.is_eligible_for_payout
        );

        return financeService.calculateSelectedTotal(selectedEvents, selectedAwards);
    };

    const validateForm = () => {
        if (selectedItems.events.length === 0 && selectedItems.awards.length === 0) {
            showError('Please select at least one item for payout');
            return false;
        }

        // Validate amount
        const parsedAmount = parseFloat(amount);
        if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
            showError('Please enter a valid amount');
            return false;
        }

        // Check against available balance
        if (parsedAmount > selectedTotal.total) {
            showError(`Amount exceeds available balance (${financeService.formatCurrency(selectedTotal.total)})`);
            return false;
        }

        if (paymentMethod === 'mobile_money') {
            if (!paymentDetails.mobileNetwork) {
                showError('Please select a mobile network');
                return false;
            }
            if (!paymentDetails.mobileAccountName) {
                showError('Please enter account holder name');
                return false;
            }
            if (!paymentDetails.mobileNumber || paymentDetails.mobileNumber.length < 10) {
                showError('Please enter a valid mobile number');
                return false;
            }
        } else {
            if (!paymentDetails.bankName) {
                showError('Please select a bank');
                return false;
            }
            if (!paymentDetails.accountName) {
                showError('Please enter account holder name');
                return false;
            }
            if (!paymentDetails.accountNumber) {
                showError('Please enter account number');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const parsedAmount = parseFloat(amount);

            // Build events array with id and amount (split amount proportionally if multiple items)
            const selectedEventData = eventsData
                .filter(e => selectedItems.events.includes(e.event_id) && e.is_eligible_for_payout)
                .map(e => ({
                    id: e.event_id,
                    amount: parsedAmount // Use the manually entered amount
                }));

            // Build awards array with id and amount
            const selectedAwardData = awardsData
                .filter(a => selectedItems.awards.includes(a.award_id) && a.is_eligible_for_payout)
                .map(a => ({
                    id: a.award_id,
                    amount: parsedAmount // Use the manually entered amount
                }));

            const payoutData = {
                events: selectedEventData,
                awards: selectedAwardData,
                payment_method: paymentMethod,
                payment_details: paymentMethod === 'mobile_money' ? {
                    mobile_network: paymentDetails.mobileNetwork,
                    mobile_number: paymentDetails.mobileNumber,
                    account_name: paymentDetails.mobileAccountName,
                } : {
                    bank_name: paymentDetails.bankName,
                    account_name: paymentDetails.accountName,
                    account_number: paymentDetails.accountNumber,
                    swift_code: paymentDetails.swiftCode || null,
                }
            };

            const result = await financeService.requestPayout(payoutData);

            if (result.success) {
                const totalRequests = result.events.length + result.awards.length;
                showSuccess(`Successfully requested payout for ${totalRequests} item(s)`);
                onSuccess?.();
                onClose();
            } else {
                const failedCount = result.errors.length;
                const successCount = result.events.length + result.awards.length;

                if (successCount > 0 && failedCount > 0) {
                    showError(`${successCount} payout(s) requested, but ${failedCount} failed`);
                } else if (result.errors.length > 0) {
                    showError(result.errors[0]?.error || 'Failed to request payouts');
                } else {
                    showError('Failed to request payouts. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error requesting payout:', error);
            showError(error.message || 'Failed to request payout');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const eligibleItems = getEligibleItems();
    const selectedTotal = getSelectedTotal();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Request Payout</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={isSubmitting}
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Filter Tabs */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Source</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setPayoutFilter('all')}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                    payoutFilter === 'all'
                                        ? "bg-(--brand-primary) text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                )}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setPayoutFilter('events')}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                    payoutFilter === 'events'
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                )}
                            >
                                Events Only
                            </button>
                            <button
                                onClick={() => setPayoutFilter('awards')}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                    payoutFilter === 'awards'
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                )}
                            >
                                Awards Only
                            </button>
                        </div>
                    </div>

                    {/* Select Items */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-3">Select Items to Withdraw</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {/* Events */}
                            {eligibleItems.events.map((event) => (
                                <label
                                    key={`event-${event.event_id}`}
                                    className={cn(
                                        "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors",
                                        selectedItems.events.includes(event.event_id)
                                            ? "border-blue-600 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.events.includes(event.event_id)}
                                            onChange={() => handleItemSelect('events', event.event_id)}
                                            className="w-4 h-4 text-blue-600 rounded"
                                        />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-blue-600" />
                                                <p className="font-medium text-gray-900">{event.event_name}</p>
                                                <Badge variant="info" className="text-xs">Event</Badge>
                                            </div>
                                            <p className="text-sm text-gray-500">{formatDate(event.event_date)}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-green-600">
                                        {financeService.formatCurrency(event.net_revenue)}
                                    </p>
                                </label>
                            ))}

                            {/* Awards */}
                            {eligibleItems.awards.map((award) => (
                                <label
                                    key={`award-${award.award_id}`}
                                    className={cn(
                                        "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors",
                                        selectedItems.awards.includes(award.award_id)
                                            ? "border-purple-600 bg-purple-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.awards.includes(award.award_id)}
                                            onChange={() => handleItemSelect('awards', award.award_id)}
                                            className="w-4 h-4 text-purple-600 rounded"
                                        />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Trophy size={14} className="text-purple-600" />
                                                <p className="font-medium text-gray-900">{award.award_title}</p>
                                                <Badge className="text-xs bg-purple-100 text-purple-700">Award</Badge>
                                            </div>
                                            <p className="text-sm text-gray-500">{formatDate(award.ceremony_date)}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-green-600">
                                        {financeService.formatCurrency(award.net_revenue)}
                                    </p>
                                </label>
                            ))}

                            {eligibleItems.events.length === 0 && eligibleItems.awards.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No eligible items for payout</p>
                                    <p className="text-sm mt-1">Items become eligible 7 days after completion</p>
                                </div>
                            )}
                        </div>

                        {/* Selected Total */}
                        {(selectedItems.events.length > 0 || selectedItems.awards.length > 0) && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="space-y-2">
                                    {selectedItems.events.length > 0 && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-green-800">Events ({selectedItems.events.length})</span>
                                            <span className="font-semibold text-green-900">
                                                {financeService.formatCurrency(selectedTotal.events)}
                                            </span>
                                        </div>
                                    )}
                                    {selectedItems.awards.length > 0 && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-green-800">Awards ({selectedItems.awards.length})</span>
                                            <span className="font-semibold text-green-900">
                                                {financeService.formatCurrency(selectedTotal.awards)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="pt-2 border-t border-green-300">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-green-800">Available Balance</span>
                                            <span className="text-xl font-bold text-green-600">
                                                {financeService.formatCurrency(selectedTotal.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payout Amount */}
                    {(selectedItems.events.length > 0 || selectedItems.awards.length > 0) && (
                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">Payout Amount</h3>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">GH₵</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-14 pr-4 py-3 text-lg font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Maximum available: {financeService.formatCurrency(selectedTotal.total)}
                            </p>
                        </div>
                    )}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setPaymentMethod('mobile_money')}
                                className={cn(
                                    "p-4 border-2 rounded-lg text-left transition-colors",
                                    paymentMethod === 'mobile_money'
                                        ? "border-(--brand-primary) bg-(--brand-primary)/5"
                                        : "border-gray-200 hover:border-gray-300"
                                )}
                            >
                                <Smartphone size={24} className={paymentMethod === 'mobile_money' ? "text-(--brand-primary)" : "text-gray-400"} />
                                <p className="font-medium text-gray-900 mt-2">Mobile Money</p>
                                <p className="text-sm text-gray-500">MTN, Vodafone, AirtelTigo</p>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('bank_transfer')}
                                className={cn(
                                    "p-4 border-2 rounded-lg text-left transition-colors",
                                    paymentMethod === 'bank_transfer'
                                        ? "border-(--brand-primary) bg-(--brand-primary)/5"
                                        : "border-gray-200 hover:border-gray-300"
                                )}
                            >
                                <Building2 size={24} className={paymentMethod === 'bank_transfer' ? "text-(--brand-primary)" : "text-gray-400"} />
                                <p className="font-medium text-gray-900 mt-2">Bank Transfer</p>
                                <p className="text-sm text-gray-500">Direct bank deposit</p>
                            </button>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-3">Payment Details</h3>

                        {paymentMethod === 'mobile_money' ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Mobile Network *
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={paymentDetails.mobileNetwork}
                                            onChange={(e) => setPaymentDetails(prev => ({ ...prev, mobileNetwork: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary) appearance-none bg-white"
                                        >
                                            <option value="">Select network</option>
                                            {mobileNetworks.map((network) => (
                                                <option key={network} value={network}>{network}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Account Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentDetails.mobileAccountName}
                                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, mobileAccountName: e.target.value }))}
                                        placeholder="Enter account holder name"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Mobile Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={paymentDetails.mobileNumber}
                                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, mobileNumber: e.target.value }))}
                                        placeholder="0XX XXX XXXX"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Bank Name *
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={paymentDetails.bankName}
                                            onChange={(e) => setPaymentDetails(prev => ({ ...prev, bankName: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary) appearance-none bg-white"
                                        >
                                            <option value="">Select bank</option>
                                            {banks.map((bank) => (
                                                <option key={bank} value={bank}>{bank}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Account Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentDetails.accountName}
                                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, accountName: e.target.value }))}
                                        placeholder="Enter account name"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Account Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentDetails.accountNumber}
                                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                                        placeholder="Enter account number"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        SWIFT/BIC Code (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentDetails.swiftCode}
                                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, swiftCode: e.target.value }))}
                                        placeholder="Enter SWIFT code"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notice */}
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                        <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800">
                            <p className="font-medium">Processing Time</p>
                            <p className="mt-1">
                                Payouts are processed within 1-3 business days.
                                You will receive a confirmation email once the transfer is complete.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || (selectedItems.events.length === 0 && selectedItems.awards.length === 0) || !amount || parseFloat(amount) <= 0}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin mr-2" />
                                Processing...
                            </>
                        ) : (
                            `Request Payout ${amount ? financeService.formatCurrency(parseFloat(amount) || 0) : ''}`
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

PayoutRequestModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    eventsData: PropTypes.array,
    awardsData: PropTypes.array,
    onSuccess: PropTypes.func,
};

export default PayoutRequestModal;
