import React from "react";
import PropTypes from "prop-types";
import { Award, Users, Trophy, DollarSign, Eye } from "lucide-react";
import { Card, CardContent } from "../../../ui/card";

const AwardStats = ({ award }) => {
  const formatCurrency = (amount) => {
    return `GH₵${(amount || 0).toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
              <Trophy size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {award?.stats.total_categories || 0}
              </p>
              <p className="text-xs text-gray-500">Categories</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {award?.stats.total_nominees || 0}
              </p>
              <p className="text-xs text-gray-500">Nominees</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
              <Award size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {award?.stats?.total_votes || 0}
              </p>
              <p className="text-xs text-gray-500">Total Votes</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
              <DollarSign size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {formatCurrency(award?.stats?.revenue)}
              </p>
              <p className="text-xs text-gray-500">Revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
              <Users size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {award?.stats?.unique_voters || 0}
              </p>
              <p className="text-xs text-gray-500">Unique Voters</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
              <Eye size={20} className="text-teal-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {award?.views || 0}
              </p>
              <p className="text-xs text-gray-500">Views</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

AwardStats.propTypes = {
  award: PropTypes.shape({
    views: PropTypes.number,
    stats: PropTypes.shape({
      total_categories: PropTypes.number,
      total_nominees: PropTypes.number,
      total_votes: PropTypes.number,
      revenue: PropTypes.number,
      unique_voters: PropTypes.number,
    }),
  }),
};

export default AwardStats;
