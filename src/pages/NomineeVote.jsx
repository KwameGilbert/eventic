import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Trophy,
  ArrowLeft,
  AlertCircle,
  CreditCard,
  Plus,
  Minus,
  Shield,
  Lock,
  ArrowRight,
} from "lucide-react";
import awardService from "../services/awardService";
import PageLoader from "../components/ui/PageLoader";

const NomineeVote = () => {
  const { slug, nomineeId } = useParams();
  const navigate = useNavigate();
  const [award, setAward] = useState(null);
  const [category, setCategory] = useState(null);
  const [nominee, setNominee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voteQuantity, setVoteQuantity] = useState(1);

  useEffect(() => {
    const fetchNomineeData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await awardService.getBySlug(slug);
        const awardData = response?.data || response;
        setAward(awardData);

        // Find nominee and category
        let foundNominee = null;
        let foundCategory = null;

        if (awardData?.categories) {
          for (const cat of awardData.categories) {
            const n = cat.nominees?.find(
              (n) => String(n.id) === String(nomineeId),
            );
            if (n) {
              foundNominee = n;
              foundCategory = cat;
              break;
            }
          }
        }

        if (foundNominee) {
          setNominee(foundNominee);
          setCategory(foundCategory);
        } else {
          setError("Nominee not found");
        }
      } catch (err) {
        console.error("Failed to fetch nominee data:", err);
        setError("Failed to load details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNomineeData();
  }, [slug, nomineeId]);

  const handleApplyPopular = (amount) => {
    setVoteQuantity(amount);
  };

  const handleIncrement = () => setVoteQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setVoteQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const totalCost = (category?.cost_per_vote || 0) * voteQuantity;

  const handleProceedToPayment = () => {
    navigate(`/award/${slug}/vote/payment`, {
      state: {
        award,
        category,
        nominee,
        voteQuantity,
        totalCost,
      },
    });
  };

  if (isLoading) {
    return <PageLoader message="Preparing your ballot..." />;
  }

  if (error || !nominee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md border border-gray-100">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-20" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-500 mb-8 font-medium">
            {error || "Could not find nominee"}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(`/award/${slug}`)}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
            >
              Back to Award
            </button>
          </div>
        </div>
      </div>
    );
  }

  const popularPackages = [1, 5, 10, 20, 50, 100];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-gray-900 leading-none">
                Cast Vote
              </h1>
              <span className="text-xs text-gray-500 mt-1">
                {category.name}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-gray-500">
              Price per vote:{" "}
            </span>
            <span className="text-sm font-bold text-(--brand-primary)">
              GH₵{(category.cost_per_vote || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Nominee Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden sticky top-24">
              <div className="aspect-4/3 bg-gray-100 relative">
                {nominee.image || nominee.nominee_image ? (
                  <img
                    src={nominee.image || nominee.nominee_image}
                    alt={nominee.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-bold">
                    {nominee.name.charAt(0)}
                  </div>
                )}
                {nominee.nominee_code && (
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-mono px-2 py-1 rounded">
                    {nominee.nominee_code}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {nominee.name}
                </h2>
                <p className="text-sm text-gray-500 mb-4">{award.title}</p>

                {award.show_results &&
                  (nominee.votes !== undefined ||
                    nominee.total_votes !== undefined) && (
                    <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md border border-gray-100">
                      <span className="text-xs text-gray-500 font-medium uppercase">
                        Current Votes
                      </span>
                      <span className="font-bold text-gray-900">
                        {(
                          nominee.votes ||
                          nominee.total_votes ||
                          0
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Voting Controls */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy size={18} className="text-gray-400" />
                Select Quantity
              </h3>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
                {popularPackages.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleApplyPopular(amount)}
                    className={`py-2 px-3 rounded-md text-sm font-medium border transition-all ${
                      voteQuantity === amount
                        ? "bg-(--brand-primary) border-(--brand-primary) text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 w-full sm:w-2/3">
                <button
                  onClick={handleDecrement}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                >
                  <Minus size={16} />
                </button>
                <div className="flex-1">
                  <label className="block text-[10px] text-gray-500 text-center uppercase tracking-wider font-semibold mb-0.5">
                    Custom
                  </label>
                  <input
                    type="number"
                    value={voteQuantity}
                    onChange={(e) =>
                      setVoteQuantity(
                        Math.max(1, parseInt(e.target.value) || 1),
                      )
                    }
                    className="w-full text-center bg-transparent text-lg font-bold text-gray-900 border-none focus:ring-0 p-0"
                  />
                </div>
                <button
                  onClick={handleIncrement}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-gray-400" />
                Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Quantity</span>
                  <span className="font-medium text-gray-900">
                    {voteQuantity} Votes
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Unit Price</span>
                  <span className="font-medium text-gray-900">
                    GH₵{(category.cost_per_vote || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-3">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-(--brand-primary)">
                    GH₵
                    {totalCost.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Proceed to Payment
                <ArrowRight size={16} />
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Shield size={12} /> Secure Payment
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock size={12} /> Encrypted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NomineeVote;
