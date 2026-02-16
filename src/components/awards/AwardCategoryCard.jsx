import React from "react";
import { Users } from "lucide-react";
import PropTypes from "prop-types";

const AwardCategoryCard = ({ category, votingStatus, onVoteClick }) => {
  // Check if voting is actually open for this specific category
  // category.voting_status is now 'open' or 'closed' from backend (effective)
  const isCategoryVotingOpen =
    votingStatus === "voting_open" && category.voting_status === "open";

  const handleCardClick = () => {
    if (isCategoryVotingOpen) {
      onVoteClick(category);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`border border-gray-200 rounded-xl overflow-hidden hover:border-(--brand-primary) hover:shadow-md transition-all ${
        isCategoryVotingOpen ? "cursor-pointer" : "cursor-default opacity-80"
      }`}
    >
      {/* Category Image */}
      <div className="relative h-40 bg-gray-200">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-(--brand-primary) to-orange-600"></div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
          {category.description && (
            <p className="text-white/90 text-sm line-clamp-2">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Category Info */}
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={16} className="text-gray-400" />
            <span className="font-medium">
              {category.nominees?.length || 0} Nominees
            </span>
          </div>
          {category.cost_per_vote > 0 && (
            <div className="text-sm font-semibold text-(--brand-primary)">
              GH₵{category.cost_per_vote} per vote
            </div>
          )}
        </div>

        {isCategoryVotingOpen ? (
          <div className="mt-3 text-center text-sm font-semibold text-(--brand-primary)">
            Click to vote →
          </div>
        ) : votingStatus === "voting_open" &&
          category.voting_status === "closed" ? (
          <div className="mt-3 text-center text-sm font-semibold text-red-500">
            Category Voting Closed
          </div>
        ) : null}
      </div>
    </div>
  );
};

AwardCategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
    cost_per_vote: PropTypes.number,
    nominees: PropTypes.array,
    voting_status: PropTypes.string,
  }).isRequired,
  votingStatus: PropTypes.string.isRequired,
  onVoteClick: PropTypes.func.isRequired,
};

export default AwardCategoryCard;
