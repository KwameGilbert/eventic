import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { X, Trophy, Heart, TrendingUp, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Voting Modal Component
 * Displays category nominees and allows users to cast votes
 */
const VotingModal = ({ isOpen, onClose, award, category }) => {
    const [selectedNominee, setSelectedNominee] = useState(null);
    const [voteQuantity, setVoteQuantity] = useState(1);
    const navigate = useNavigate();

    if (!isOpen || !category) return null;

    // Get cost per vote from category (default to 1 if not set or 0)
    const costPerVote = category.cost_per_vote > 0 ? category.cost_per_vote : 1;

    // Predefined vote packages
    const votePackages = [
        { votes: 1, popular: false },
        { votes: 5, popular: true },
        { votes: 10, popular: false },
        { votes: 50, popular: false },
    ];

    const handleVoteSubmit = () => {
        if (!selectedNominee) {
            alert('Please select a nominee to vote for');
            return;
        }

        if (voteQuantity < 1) {
            alert('Please enter a valid number of votes');
            return;
        }

        // Navigate to payment page
        navigate(`/award/${award.slug}/vote/payment`, {
            state: {
                award,
                category,
                nominee: selectedNominee,
                votePackage: {
                    votes: voteQuantity,
                    price: voteQuantity * costPerVote
                }
            }
        });
    };

    const totalCost = voteQuantity * costPerVote;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <div
                        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-(--brand-primary) to-orange-600 text-white p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Trophy size={24} />
                                        <h2 className="text-2xl font-bold">{category.name}</h2>
                                    </div>
                                    <p className="text-white/90 text-sm">{award.title}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                            <div className="p-6">
                                {/* Category Description */}
                                {category.description && (
                                    <p className="text-gray-600 mb-6">{category.description}</p>
                                )}

                                {/* Nominees Grid */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Select a Nominee</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {category.nominees?.map((nominee) => (
                                            <button
                                                key={nominee.id}
                                                onClick={() => setSelectedNominee(nominee)}
                                                className={`text-left p-4 rounded-xl border-2 transition-all ${selectedNominee?.id === nominee.id
                                                    ? 'border-(--brand-primary) bg-(--brand-primary)/5 shadow-md'
                                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    {/* Nominee Image */}
                                                    {nominee.image && (
                                                        <img
                                                            src={nominee.image}
                                                            alt={nominee.name}
                                                            className="w-16 h-16 rounded-lg object-cover shrink-0"
                                                        />
                                                    )}

                                                    {/* Nominee Info */}
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-bold text-gray-900">{nominee.name}</h4>
                                                            {nominee.nominee_code && (
                                                                <span className="text-[12px] font-mono bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase">
                                                                    {nominee.nominee_code}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {nominee.description && (
                                                            <p className="text-sm text-gray-600 line-clamp-2">{nominee.description}</p>
                                                        )}
                                                        {nominee.votes !== undefined && (
                                                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                                                <TrendingUp size={14} />
                                                                <span>{nominee.votes.toLocaleString()} votes</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Selection Indicator */}
                                                    {selectedNominee?.id === nominee.id && (
                                                        <div className="shrink-0">
                                                            <div className="w-6 h-6 bg-(--brand-primary) rounded-full flex items-center justify-center">
                                                                <Heart className="text-white fill-current" size={14} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Vote Package Selection */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Select Vote Quantity</h3>

                                    {/* Quick Select Packages */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                        {votePackages.map((pkg) => (
                                            <button
                                                key={pkg.votes}
                                                onClick={() => setVoteQuantity(pkg.votes)}
                                                className={`relative p-4 rounded-lg border-2 transition-all ${voteQuantity === pkg.votes
                                                        ? 'border-(--brand-primary) bg-(--brand-primary)/5'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {pkg.popular && (
                                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                                                        <span className="bg-(--brand-primary) text-white text-xs font-bold px-2 py-1 rounded-full">
                                                            POPULAR
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-gray-900 mb-1">{pkg.votes}</div>
                                                    <div className="text-xs text-gray-600 mb-2">
                                                        {pkg.votes === 1 ? 'Vote' : 'Votes'}
                                                    </div>
                                                    <div className="text-lg font-bold text-(--brand-primary)">
                                                        GH₵{(pkg.votes * costPerVote).toFixed(2)}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom Quantity Input - Always Visible */}
                                    <div className="border-t border-gray-200 pt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Or enter custom quantity
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={voteQuantity}
                                                    onChange={(e) => setVoteQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                    className="w-full px-4 py-3 border-2 border-(--brand-primary) rounded-lg focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent font-semibold text-lg"
                                                    placeholder="Enter number of votes"
                                                />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-(--brand-primary)">
                                                    GH₵{totalCost.toFixed(2)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    @ GH₵{costPerVote.toFixed(2)}/vote
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary */}
                                {selectedNominee && (
                                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                        <h4 className="font-semibold text-gray-900 mb-3">Your Vote Summary</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Nominee:</span>
                                                <span className="font-semibold text-gray-900">{selectedNominee.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Category:</span>
                                                <span className="font-semibold text-gray-900">{category.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Number of votes:</span>
                                                <span className="font-semibold text-gray-900">{voteQuantity} {voteQuantity === 1 ? 'vote' : 'votes'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Price per vote:</span>
                                                <span className="font-semibold text-gray-900">GH₵{costPerVote.toFixed(2)}</span>
                                            </div>
                                            <div className="border-t border-gray-300 pt-2 mt-2">
                                                <div className="flex justify-between text-base">
                                                    <span className="font-bold text-gray-900">Total:</span>
                                                    <span className="font-bold text-(--brand-primary) text-xl">GH₵{totalCost.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 p-6 bg-white">
                            <div className="flex items-center justify-between gap-4">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleVoteSubmit}
                                    disabled={!selectedNominee}
                                    className="flex items-center gap-2 px-6 py-3 bg-(--brand-primary) text-white rounded-lg hover:opacity-90 transition-opacity font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CreditCard size={20} />
                                    Proceed to Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

VotingModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    award: PropTypes.object.isRequired,
    category: PropTypes.object,
};

export default VotingModal;
