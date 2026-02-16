import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Star,
  Clock,
  Trash2,
} from "lucide-react";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";

const AwardHeader = ({
  award,
  navigate,
  fetchAwardDetails,
  awardVotingStatus,
  getStatusColor,
  onSubmitForApproval,
  onDeleteAward,
  isStatusChanging,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/organizer/awards")}
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back</span>
        </Button>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              {award?.title}
            </h1>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge
                className={`text-[10px] px-2 py-0 h-5 ${getStatusColor(award?.status)}`}
              >
                {award?.status?.toUpperCase()}
              </Badge>
              <Badge
                className={`text-[10px] px-2 py-0 h-5 ${
                  awardVotingStatus === "Active"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-red-100 text-red-800 border-red-200"
                }`}
              >
                AWARD VOTING: {awardVotingStatus.toUpperCase()}
              </Badge>
              {award?.is_featured && (
                <Badge className="text-[10px] px-2 py-0 h-5 bg-yellow-100 text-yellow-800 border-yellow-200">
                  <Star size={10} className="fill-yellow-500 mr-1" />
                  FEATURED
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
            <span>ID: #{award?.id}</span>
            {award?.award_code && (
              <>
                <span className="text-gray-300">•</span>
                <span className="font-mono bg-gray-100 px-1 py-0 rounded text-[10px] uppercase">
                  Code: {award.award_code}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {award?.status === "draft" && (
          <>
            <Button
              onClick={onDeleteAward}
              variant="destructive"
              size="sm"
              disabled={isStatusChanging}
              className="h-8 gap-2"
            >
              <Trash2 size={14} />
              <span className="hidden lg:inline text-xs">Delete</span>
            </Button>
            <Button
              onClick={onSubmitForApproval}
              variant="default"
              size="sm"
              disabled={isStatusChanging}
              className="h-8 bg-orange-600 hover:bg-orange-700 gap-2"
            >
              <Clock size={14} />
              <span className="text-xs">Submit for Review</span>
            </Button>
          </>
        )}

        <Link to={`/award/${award?.slug}`} target="_blank">
          <Button variant="outline" size="sm" className="h-8 gap-2">
            <ExternalLink size={14} />
            <span className="hidden sm:inline text-xs">View Public Page</span>
          </Button>
        </Link>
        <Button
          onClick={fetchAwardDetails}
          variant="outline"
          size="sm"
          className="h-8"
        >
          <RefreshCw size={14} />
        </Button>
      </div>
    </div>
  );
};

AwardHeader.propTypes = {
  award: PropTypes.object,
  navigate: PropTypes.func.isRequired,
  fetchAwardDetails: PropTypes.func.isRequired,
  awardVotingStatus: PropTypes.string.isRequired,
  getStatusColor: PropTypes.func.isRequired,
  onSubmitForApproval: PropTypes.func,
  onDeleteAward: PropTypes.func,
  isStatusChanging: PropTypes.bool,
};

export default AwardHeader;
