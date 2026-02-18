import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Search, Filter, Database } from "lucide-react";
import { Card, CardContent } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import awardService from "../../../../services/awardService";
import adminService from "../../../../services/adminService";

const AwardTransactions = ({ award, isAdmin = false }) => {
  const [transactions, setTransactions] = useState(award?.transactions || []);
  const [loading, setLoading] = useState(!award?.transactions);
  const [pagination, setPagination] = useState({
    total: award?.total_votes || award?.transactions?.length || 0,
    current_page: 1,
    last_page: Math.ceil((award?.total_votes || 0) / 50) || 1,
    per_page: 50,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "paid",
    category_id: "",
  });

  const fetchTransactions = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const service = isAdmin ? adminService : awardService;
        const response = await service.getAwardTransactions(award.id, {
          ...filters,
          page,
        });

        if (response.success) {
          setTransactions(response.data.transactions);
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    },
    [award.id, filters, isAdmin],
  );

  useEffect(() => {
    // Only fetch if we don't have initial data OR if filters are active
    const hasFilters =
      filters.search || filters.category_id || filters.status !== "paid";
    if (!award?.transactions || hasFilters) {
      fetchTransactions(1);
    } else {
      setLoading(false);
    }
  }, [fetchTransactions, award?.transactions]);

  const handlePageChange = (newPage) => {
    fetchTransactions(newPage);
  };

  const formatCurrency = (amount) => {
    return `GH₵${(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by voter, reference or code..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && fetchTransactions(1)}
          />
        </div>

        <select
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
          value={filters.category_id}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category_id: e.target.value }))
          }
        >
          <option value="">All Categories</option>
          {award?.categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
        >
          <option value="paid">Paid Only</option>
          <option value="pending">Pending</option>
          <option value="all">All Status</option>
        </select>

        <Button
          variant="secondary"
          className="gap-2"
          onClick={() => fetchTransactions(1)}
        >
          <Filter size={16} />
          Filter
        </Button>
      </div>

      <Card className="overflow-hidden border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Voter & Ref
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Nominee & Category
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">
                    Votes
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">
                    Gross
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right text-blue-600">
                    {isAdmin ? "Organizer Share" : "My Share"}
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right text-red-500">
                    Platform
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="8" className="px-6 py-6">
                        <div className="h-4 bg-gray-100 rounded w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 text-sm">
                          {tx.voter_name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                          {tx.reference}
                        </div>
                        {tx.payment_method && (
                          <div className="text-[9px] text-gray-500 uppercase mt-1 px-1.5 py-0.5 bg-gray-100 rounded-full w-fit font-bold">
                            {tx.payment_method}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm truncate max-w-[180px]">
                            {tx.nominee_name}
                          </span>
                          <span className="text-[11px] text-gray-500 truncate max-w-[150px]">
                            {tx.category_name}
                          </span>
                          <span className="text-[10px] text-orange-600 font-black mt-1">
                            #{tx.nominee_code}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-900 font-bold text-xs border border-gray-200">
                          {tx.number_of_votes}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-bold text-gray-900 text-sm">
                          {formatCurrency(tx.gross_amount)}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {formatCurrency(tx.cost_per_vote)}/each
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-bold text-blue-700 text-sm">
                          {formatCurrency(tx.organizer_amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-bold text-red-600 text-sm">
                          {formatCurrency(tx.admin_amount)}
                        </div>
                        <div className="text-[9px] text-gray-400">
                          fee: {formatCurrency(tx.payment_fee)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[11px] text-gray-600 font-medium">
                        {formatDate(tx.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`text-[10px] font-bold border ${
                            tx.status === "paid"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : tx.status === "pending"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {tx.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-20 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                          <Database size={32} className="text-gray-200" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            No transactions found
                          </p>
                          <p className="text-sm">
                            Try adjusting your filters or search terms
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-bold text-gray-900">
              {(pagination.current_page - 1) * pagination.per_page + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-gray-900">
              {Math.min(
                pagination.current_page * pagination.per_page,
                pagination.total,
              )}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-900">{pagination.total}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              variant="outline"
              size="sm"
              className="h-8"
            >
              Prev
            </Button>

            <div className="flex items-center -space-x-px">
              {[...Array(pagination.last_page).keys()].map((page) => {
                const p = page + 1;
                if (
                  p === 1 ||
                  p === pagination.last_page ||
                  (p >= pagination.current_page - 1 &&
                    p <= pagination.current_page + 1)
                ) {
                  return (
                    <Button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      variant={
                        pagination.current_page === p ? "default" : "outline"
                      }
                      className={`h-8 w-8 p-0 rounded-none first:rounded-l-md last:rounded-r-md ${
                        pagination.current_page === p
                          ? "bg-orange-600 hover:bg-orange-700"
                          : ""
                      }`}
                      size="sm"
                    >
                      {p}
                    </Button>
                  );
                } else if (
                  p === pagination.current_page - 2 ||
                  p === pagination.current_page + 2
                ) {
                  return (
                    <span key={p} className="w-8 text-center text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <Button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              variant="outline"
              size="sm"
              className="h-8"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

AwardTransactions.propTypes = {
  award: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool,
};

export default AwardTransactions;
