import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Calendar,
  ChevronRight,
  Download,
  Plus,
  Trophy,
  Loader2,
  CreditCard,
  Smartphone,
  Building2,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../lib/utils";
import financeService from "../../services/financeService";
import { showError, showSuccess } from "../../utils/toast";
import { exportFinanceReport, exportFinanceSummary } from "../../utils/export";
import PayoutRequestModal from "../../components/organizer/PayoutRequestModal";

const Finance = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  // Data states
  const [isLoading, setIsLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [eventsData, setEventsData] = useState([]);
  const [awardsData, setAwardsData] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [error, setError] = useState(null);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "events", label: "Event Revenue" },
    { id: "awards", label: "Awards Revenue" },
    { id: "payouts", label: "Payout History" },
  ];

  // Fetch financial data on mount
  useEffect(() => {
    fetchFinancialOverview();
  }, []);

  const fetchFinancialOverview = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await financeService.getOverview();

      if (response.success) {
        setOverview(response.data);
      } else {
        setError(response.message || "Failed to fetch financial data");
      }
    } catch (err) {
      console.error("Error fetching financial overview:", err);
      setError(
        err.message || "An error occurred while fetching financial data",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEventsRevenue = async () => {
    try {
      const response = await financeService.getEventsRevenue();
      if (response.success) {
        setEventsData(response.data.events || []);
      }
    } catch (err) {
      console.error("Error fetching events revenue:", err);
      showError("Failed to fetch events revenue");
    }
  };

  const fetchAwardsRevenue = async () => {
    try {
      const response = await financeService.getAwardsRevenue();
      if (response.success) {
        setAwardsData(response.data.awards || []);
      }
    } catch (err) {
      console.error("Error fetching awards revenue:", err);
      showError("Failed to fetch awards revenue");
    }
  };

  const fetchPayoutHistory = async () => {
    try {
      const response = await financeService.getPayoutHistory();
      if (response.success) {
        setPayouts(response.data.payouts || []);
      }
    } catch (err) {
      console.error("Error fetching payout history:", err);
      showError("Failed to fetch payout history");
    }
  };

  const handleTabChange = async (tabId) => {
    setActiveTab(tabId);

    // Fetch data when switching to specific tabs
    if (tabId === "events" && eventsData.length === 0) {
      await fetchEventsRevenue();
    } else if (tabId === "awards" && awardsData.length === 0) {
      await fetchAwardsRevenue();
    } else if (tabId === "payouts" && payouts.length === 0) {
      await fetchPayoutHistory();
    }
  };

  const handleExportReport = async () => {
    try {
      // Make sure we have the data for the active tab
      if (activeTab === "overview") {
        // Ensure we have both events and awards data
        if (eventsData.length === 0) await fetchEventsRevenue();
        if (awardsData.length === 0) await fetchAwardsRevenue();

        if (eventsData.length === 0 && awardsData.length === 0) {
          showError("No data available to export");
          return;
        }

        exportFinanceSummary(overview, eventsData, awardsData);
        showSuccess("Finance summary exported successfully");
      } else if (activeTab === "events") {
        if (eventsData.length === 0) await fetchEventsRevenue();

        if (eventsData.length === 0) {
          showError("No events data to export");
          return;
        }

        exportFinanceReport(eventsData, "events");
        showSuccess(`Exported ${eventsData.length} events successfully`);
      } else if (activeTab === "awards") {
        if (awardsData.length === 0) await fetchAwardsRevenue();

        if (awardsData.length === 0) {
          showError("No awards data to export");
          return;
        }

        exportFinanceReport(awardsData, "awards");
        showSuccess(`Exported ${awardsData.length} awards successfully`);
      } else if (activeTab === "payouts") {
        if (payouts.length === 0) await fetchPayoutHistory();

        if (payouts.length === 0) {
          showError("No payout history to export");
          return;
        }

        // Export payouts (using events format as template)
        const payoutColumns = payouts.map((p) => ({
          id: p.id,
          date: p.date,
          method: `${p.method} •••• ${p.accountEnding}`,
          amount: p.amount,
          status: p.status,
          events: p.events.join(", "),
        }));

        const { arrayToCSV, downloadCSV } = await import("../../utils/export");
        const csv = arrayToCSV(payoutColumns, [
          { key: "id", label: "Payout ID" },
          { key: "date", label: "Date" },
          { key: "events", label: "Items" },
          { key: "method", label: "Payment Method" },
          { key: "amount", label: "Amount (GH₵)" },
          { key: "status", label: "Status" },
        ]);
        downloadCSV(
          csv,
          `payout-history-${new Date().toISOString().split("T")[0]}`,
        );
        showSuccess(`Exported ${payouts.length} payouts successfully`);
      }
    } catch (error) {
      console.error("Export error:", error);
      showError("Failed to export report");
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2
            size={48}
            className="animate-spin text-(--brand-primary) mx-auto mb-4"
          />
          <p className="text-gray-600">Loading financial data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">
                Error Loading Financial Data
              </h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchFinancialOverview}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = overview?.summary || {};
  const revenueBreakdown = overview?.revenue_breakdown || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
          <p className="text-gray-500 mt-1">
            Track your revenue and manage payouts
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleExportReport}
          >
            <Download size={18} />
            Export Report
          </Button>
          <Button
            className="gap-2"
            onClick={() => {
              // Fetch latest data for payout modal
              if (eventsData.length === 0) fetchEventsRevenue();
              if (awardsData.length === 0) fetchAwardsRevenue();
              setShowPayoutModal(true);
            }}
            disabled={(stats.available_balance || 0) <= 0}
          >
            <Plus size={18} />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <DollarSign size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {financeService.formatCurrency(
                    stats.total_gross_revenue || 0,
                  )}
                </p>
                <p className="text-xs text-gray-500">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {financeService.formatCurrency(stats.available_balance || 0)}
                </p>
                <p className="text-xs text-gray-500">Available Balance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Clock size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {financeService.formatCurrency(stats.pending_balance || 0)}
                </p>
                <p className="text-xs text-gray-500">Pending Payouts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <CheckCircle size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {financeService.formatCurrency(stats.completed_payouts || 0)}
                </p>
                <p className="text-xs text-gray-500">Paid Out</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <CreditCard size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {financeService.formatCurrency(
                    stats.total_platform_fees || 0,
                  )}
                </p>
                <p className="text-xs text-gray-500">Platform Fees</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown Card */}
      {revenueBreakdown.events_revenue && revenueBreakdown.awards_revenue && (
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">
                    Events Ticketing
                  </span>
                  <span className="text-xs font-semibold text-blue-700">
                    {revenueBreakdown.events_revenue.percentage}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {financeService.formatCurrency(
                    revenueBreakdown.events_revenue.net || 0,
                  )}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Gross:{" "}
                  {financeService.formatCurrency(
                    revenueBreakdown.events_revenue.gross || 0,
                  )}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-900">
                    Awards Voting
                  </span>
                  <span className="text-xs font-semibold text-purple-700">
                    {revenueBreakdown.awards_revenue.percentage}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  {financeService.formatCurrency(
                    revenueBreakdown.awards_revenue.net || 0,
                  )}
                </p>
                <p className="text-xs text-purple-700 mt-1">
                  Gross:{" "}
                  {financeService.formatCurrency(
                    revenueBreakdown.awards_revenue.gross || 0,
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "pb-3 border-b-2 whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "border-(--brand-primary) text-(--brand-primary)"
                  : "border-transparent text-gray-500 hover:text-gray-700",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-12 gap-6">
          {/* Top Performers */}
          <div className="col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {overview?.top_performers?.top_event && (
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-gray-600">
                          Top Event
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900">
                        {overview.top_performers.top_event.name}
                      </h4>
                      <p className="text-2xl font-bold text-blue-600 mt-2">
                        {financeService.formatCurrency(
                          overview.top_performers.top_event.revenue,
                        )}
                      </p>
                    </div>
                  )}
                  {overview?.top_performers?.top_award && (
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy size={16} className="text-purple-600" />
                        <span className="text-sm font-medium text-gray-600">
                          Top Award
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900">
                        {overview.top_performers.top_award.name}
                      </h4>
                      <p className="text-2xl font-bold text-purple-600 mt-2">
                        {financeService.formatCurrency(
                          overview.top_performers.top_award.revenue,
                        )}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {overview.top_performers.top_award.votes.toLocaleString()}{" "}
                        votes
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Events Revenue */}
          <div className="col-span-12 lg:col-span-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Recent Event Revenue
                  </CardTitle>
                  <button
                    onClick={() => handleTabChange("events")}
                    className="text-sm text-(--brand-primary) hover:underline"
                  >
                    View All
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {eventsData.length === 0 ? (
                  <button
                    onClick={fetchEventsRevenue}
                    className="w-full py-4 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Click to load events
                  </button>
                ) : (
                  <div className="space-y-3">
                    {eventsData.slice(0, 4).map((event) => (
                      <Link
                        key={event.event_id}
                        to={`/organizer/finance/events/${event.event_id}`}
                        className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">
                              {event.event_name}
                            </h4>
                            {event.payout_status === "completed" ? (
                              <Badge variant="success" className="text-xs">
                                Paid
                              </Badge>
                            ) : (
                              <Badge variant="warning" className="text-xs">
                                Pending
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(event.event_date)} •{" "}
                            {event.total_orders} orders
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {financeService.formatCurrency(event.net_revenue)}
                          </p>
                          <p className="text-xs text-gray-500">Net revenue</p>
                        </div>
                        <ChevronRight
                          size={20}
                          className="text-gray-400 ml-4"
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Payouts */}
          <div className="col-span-12 lg:col-span-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Payouts</CardTitle>
                  <button
                    onClick={() => handleTabChange("payouts")}
                    className="text-sm text-(--brand-primary) hover:underline"
                  >
                    View All
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {payouts.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign
                      size={32}
                      className="mx-auto text-gray-300 mb-2"
                    />
                    <p className="text-sm text-gray-500">No payouts yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payouts.slice(0, 3).map((payout) => (
                      <div key={payout.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle size={18} className="text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {financeService.formatCurrency(payout.amount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(payout.date)}
                          </p>
                        </div>
                        <Badge variant="success">{payout.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === "events" && (
        <Card>
          <CardContent className="p-0">
            {eventsData.length === 0 ? (
              <div className="text-center py-12">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No events yet
                </h3>
                <p className="text-gray-500">
                  Create your first event to see revenue here
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Event
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Date
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Orders
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Gross Revenue
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Platform Fee
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Net Revenue
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Status
                      </th>
                      <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsData.map((event) => (
                      <tr
                        key={event.event_id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <Link
                            to={`/organizer/events/${event.event_slug}`}
                            className="font-medium text-gray-900 hover:text-(--brand-primary)"
                          >
                            {event.event_name}
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {formatDate(event.event_date)}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {event.total_orders}
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-900">
                          {financeService.formatCurrency(event.gross_revenue)}
                        </td>
                        <td className="py-4 px-4 text-sm text-red-600">
                          -{financeService.formatCurrency(event.platform_fee)}
                        </td>
                        <td className="py-4 px-4 font-semibold text-green-600">
                          {financeService.formatCurrency(event.net_revenue)}
                        </td>
                        <td className="py-4 px-4">
                          {event.payout_status === "completed" ? (
                            <Badge variant="success">Paid Out</Badge>
                          ) : event.is_eligible_for_payout ? (
                            <Badge variant="warning">Available</Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link to={`/organizer/events/${event.event_slug}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Awards Tab - NEW! */}
      {activeTab === "awards" && (
        <Card>
          <CardContent className="p-0">
            {awardsData.length === 0 ? (
              <div className="text-center py-12">
                <Trophy size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No awards yet
                </h3>
                <p className="text-gray-500">
                  Create your first award to see voting revenue here
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Award
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Date
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Votes
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Gross Revenue
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Platform Fee
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Net Revenue
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Status
                      </th>
                      <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {awardsData.map((award) => (
                      <tr
                        key={award.award_id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <Link
                            to={`/organizer/awards/${award.award_slug}`}
                            className="font-medium text-gray-900 hover:text-(--brand-primary)"
                          >
                            {award.award_title}
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {formatDate(award.ceremony_date)}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {award.total_votes.toLocaleString()}
                          <span className="text-xs text-gray-500 ml-1">
                            ({award.total_voters} voters)
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-900">
                          {financeService.formatCurrency(award.gross_revenue)}
                        </td>
                        <td className="py-4 px-4 text-sm text-red-600">
                          -{financeService.formatCurrency(award.platform_fee)}
                        </td>
                        <td className="py-4 px-4 font-semibold text-green-600">
                          {financeService.formatCurrency(award.net_revenue)}
                        </td>
                        <td className="py-4 px-4">
                          {award.payout_status === "completed" ? (
                            <Badge variant="success">Paid Out</Badge>
                          ) : award.is_eligible_for_payout ? (
                            <Badge variant="warning">Available</Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link to={`/organizer/awards/${award.award_slug}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payouts Tab */}
      {activeTab === "payouts" && (
        <Card>
          <CardContent className="p-0">
            {payouts.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No payouts yet
                </h3>
                <p className="text-gray-500">
                  Request your first payout to see it here
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Payout ID
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Date
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Items
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Method
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Amount
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((payout) => (
                      <tr
                        key={payout.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">
                            {payout.id}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {formatDate(payout.date)}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {payout.events.join(", ")}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            {payout.method === "Mobile Money" ? (
                              <Smartphone size={14} className="text-gray-400" />
                            ) : (
                              <Building2 size={14} className="text-gray-400" />
                            )}
                            {payout.method} •••• {payout.accountEnding}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-semibold text-gray-900">
                          {financeService.formatCurrency(payout.amount)}
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={getStatusStyle(payout.status)}>
                            {payout.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payout Request Modal */}
      <PayoutRequestModal
        isOpen={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
        eventsData={eventsData}
        awardsData={awardsData}
        onSuccess={() => {
          fetchFinancialOverview();
          if (activeTab === "events") fetchEventsRevenue();
          if (activeTab === "awards") fetchAwardsRevenue();
        }}
      />
    </div>
  );
};

export default Finance;
