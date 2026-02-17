import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  DollarSign,
  Users,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Save,
  Star,
  Edit3,
  CheckCircle,
  XCircle,
  Percent,
  Image as ImageIcon,
  ExternalLink,
  Calendar,
  Trophy,
  RefreshCw,
  Award as AwardIcon,
  Eye,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Mail,
  Plus,
  Trash2,
  Edit,
  MapPin,
  Globe,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Video,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import adminService from "../../services/adminService";
import categoryService from "../../services/categoryService";
import nomineeService from "../../services/nomineeService";
import CategoryModal from "../../components/organizer/awards/CategoryModal";
import NomineeModal from "../../components/organizer/awards/NomineeModal";
import AwardResults from "../../components/organizer/awards/view_award/AwardResults";
import { showSuccess, showError, showConfirm } from "../../utils/toast";

const AdminAwardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [award, setAward] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedCategories, setExpandedCategories] = useState({});

  // Modal states
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [nomineeModalOpen, setNomineeModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedNominee, setSelectedNominee] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  // Drag and drop states
  const [draggedCategory, setDraggedCategory] = useState(null);
  const [draggedNominee, setDraggedNominee] = useState(null);

  const [isTogglingVoting, setIsTogglingVoting] = useState(false);
  const [togglingCategory, setTogglingCategory] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ceremony_date: "",
    voting_start: "",
    voting_end: "",
    venue_name: "",
    address: "",
    city: "",
    region: "",
    country: "",
    map_url: "",
    status: "",
    is_featured: false,
    show_results: true,
    platform_fee_percentage: 5.0,
    banner_image: "",
    phone: "",
    website: "",
    facebook: "",
    twitter: "",
    instagram: "",
    video_url: "",
    award_code: "",
  });

  useEffect(() => {
    fetchAwardDetails();
  }, [id]);

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  const getGoogleMapsEmbedUrl = (url, address, city) => {
    if (url && url.includes("google.com/maps/embed")) return url;
    if (!address && !city) return null;
    const query = encodeURIComponent(`${address || ""} ${city || ""}`.trim());
    return `https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  };

  const fetchAwardDetails = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      setError(null);
      const response = await adminService.getAwardDetails(id);

      if (response.success) {
        const awardData = response.data.award;
        setAward(awardData);

        // Populate form data
        setFormData({
          title: awardData.title || "",
          description: awardData.description || "",
          ceremony_date: awardData.ceremony_date
            ? awardData.ceremony_date.substring(0, 16)
            : "",
          voting_start: awardData.voting_start
            ? awardData.voting_start.substring(0, 16)
            : "",
          voting_end: awardData.voting_end
            ? awardData.voting_end.substring(0, 16)
            : "",
          venue_name: awardData.venue_name || awardData.venue || "",
          address: awardData.address || awardData.location || "",
          city: awardData.city || "",
          region: awardData.region || "",
          country: awardData.country || "",
          map_url: awardData.map_url || awardData.mapUrl || "",
          status: awardData.status || "draft",
          is_featured: awardData.is_featured || false,
          show_results: awardData.show_results !== false,
          platform_fee_percentage: awardData.platform_fee_percentage || 5.0,
          banner_image: awardData.banner_image || "",
          phone: awardData.phone || awardData.contact?.phone || "",
          website: awardData.website || awardData.contact?.website || "",
          facebook: awardData.facebook || awardData.socialMedia?.facebook || "",
          twitter: awardData.twitter || awardData.socialMedia?.twitter || "",
          instagram:
            awardData.instagram || awardData.socialMedia?.instagram || "",
          video_url: awardData.video_url || awardData.videoUrl || "",
          award_code: awardData.award_code || "",
        });

        // Expand all categories by default if not already set
        if (
          awardData.categories &&
          Object.keys(expandedCategories).length === 0
        ) {
          const expanded = {};
          awardData.categories.forEach((cat) => {
            expanded[cat.id] = true;
          });
          setExpandedCategories(expanded);
        }
      } else {
        setError(response.message || "Failed to fetch award details");
      }
    } catch (err) {
      console.error("Error fetching award details:", err);
      setError(err.message || "An error occurred while fetching award details");
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await adminService.updateAward(id, formData);

      if (response.success) {
        showSuccess("Award updated successfully");
        setIsEditing(false);
        fetchAwardDetails();
      } else {
        showError(response.message || "Failed to update award");
      }
    } catch (err) {
      showError(err.message || "Failed to update award");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVoting = async (status) => {
    try {
      setIsTogglingVoting(true);
      const response = await adminService.toggleVoting(id, status);

      if (response.success) {
        showSuccess(response.message || `Voting is now ${status}`);
        if (response.data && response.data.award) {
          setAward(response.data.award);
        } else {
          setAward((prev) => ({ ...prev, voting_status: status }));
        }
      } else {
        showError(response.message || "Failed to toggle voting status");
      }
    } catch (err) {
      showError(err.message || "Failed to toggle voting status");
    } finally {
      setIsTogglingVoting(false);
    }
  };

  const handleToggleCategoryVoting = async (e, categoryId, status) => {
    if (e) e.stopPropagation();
    try {
      setTogglingCategory(categoryId);
      const response = await categoryService.toggleVoting(categoryId, status);

      if (response.success) {
        showSuccess(response.message || `Category voting is now ${status}`);
        const awardData = response.data;
        const effectiveStatus = awardData?.voting_status || status;
        // Update the specific category in the local state
        setAward((prev) => ({
          ...prev,
          categories: prev.categories.map((cat) =>
            String(cat.id) === String(categoryId)
              ? {
                  ...cat,
                  voting_status: effectiveStatus,
                  internal_voting_status:
                    awardData?.internal_voting_status || status,
                }
              : cat,
          ),
        }));
      } else {
        showError(response.message || "Failed to toggle category voting");
      }
    } catch (err) {
      showError(err.message || "Failed to toggle category voting");
    } finally {
      setTogglingCategory(null);
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Category modal handlers
  const openCategoryModal = (category = null) => {
    setSelectedCategory(category);
    setCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
    setSelectedCategory(null);
  };

  const handleCategorySuccess = () => {
    fetchAwardDetails(true);
  };

  const handleDeleteCategory = async (e, categoryId) => {
    e.stopPropagation();
    const result = await showConfirm({
      title: "Delete Category?",
      text: "This will permanently delete the category and all its nominees. This action cannot be undone.",
      confirmButtonText: "Yes, delete it",
      icon: "warning",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await categoryService.delete(categoryId);
      showSuccess("Category deleted successfully");
      fetchAwardDetails();
    } catch (err) {
      console.error("Error deleting category:", err);
      showError("Failed to delete category");
    }
  };

  // Nominee modal handlers
  const openNomineeModal = (e, categoryId, nominee = null) => {
    if (e) e.stopPropagation();
    setActiveCategory(categoryId);
    setSelectedNominee(nominee);
    setNomineeModalOpen(true);
  };

  const closeNomineeModal = () => {
    setNomineeModalOpen(false);
    setSelectedNominee(null);
    setActiveCategory(null);
  };

  const handleNomineeSuccess = () => {
    fetchAwardDetails(true);
  };

  const handleDeleteNominee = async (e, nomineeId) => {
    if (e) e.stopPropagation();
    const result = await showConfirm({
      title: "Delete Nominee?",
      text: "This will permanently remove this nominee. This action cannot be undone.",
      confirmButtonText: "Yes, delete it",
      icon: "warning",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await nomineeService.delete(nomineeId);
      showSuccess("Nominee deleted successfully");
      fetchAwardDetails();
    } catch (err) {
      console.error("Error deleting nominee:", err);
      showError("Failed to delete nominee");
    }
  };

  // Drag and drop handlers for categories
  const handleCategoryDragStart = (e, category) => {
    setDraggedCategory(category);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleCategoryDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleCategoryDrop = async (e, targetCategory) => {
    e.preventDefault();
    if (!draggedCategory || draggedCategory.id === targetCategory.id) {
      setDraggedCategory(null);
      return;
    }

    const categories = [...award.categories];
    const draggedIndex = categories.findIndex(
      (c) => c.id === draggedCategory.id,
    );
    const targetIndex = categories.findIndex((c) => c.id === targetCategory.id);

    categories.splice(draggedIndex, 1);
    categories.splice(targetIndex, 0, draggedCategory);

    const reorderedCategories = categories.map((cat, index) => ({
      id: cat.id,
      display_order: index,
    }));

    try {
      await categoryService.reorder(id, reorderedCategories);
      fetchAwardDetails(true);
    } catch (err) {
      console.error("Error reordering categories:", err);
    }
    setDraggedCategory(null);
  };

  // Drag and drop handlers for nominees
  const handleNomineeDragStart = (e, nominee) => {
    setDraggedNominee(nominee);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleNomineeDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleNomineeDrop = async (e, targetNominee, categoryId) => {
    e.preventDefault();
    if (!draggedNominee || draggedNominee.id === targetNominee.id) {
      setDraggedNominee(null);
      return;
    }

    const category = award.categories.find((c) => c.id === categoryId);
    if (!category) return;

    const nominees = [...category.nominees];
    const draggedIndex = nominees.findIndex((n) => n.id === draggedNominee.id);
    const targetIndex = nominees.findIndex((n) => n.id === targetNominee.id);

    nominees.splice(draggedIndex, 1);
    nominees.splice(targetIndex, 0, draggedNominee);

    const reorderedNominees = nominees.map((nom, index) => ({
      id: nom.id,
      display_order: index,
    }));

    try {
      await nomineeService.reorder(categoryId, reorderedNominees);
      fetchAwardDetails(true);
    } catch (err) {
      console.error("Error reordering nominees:", err);
    }
    setDraggedNominee(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return `GH₵${(amount || 0).toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      published: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      draft: "bg-gray-100 text-gray-800 border-gray-200",
      closed: "bg-red-100 text-red-800 border-red-200",
      completed: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return colors[status] || colors.draft;
  };

  const getVotingStatus = () => {
    return award?.voting_status === "open" ? "Active" : "Closed";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2
            size={48}
            className="animate-spin text-orange-600 mx-auto mb-4"
          />
          <p className="text-gray-600">Loading award details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/admin/awards")}>
            <ArrowLeft size={16} />
            Back to Awards
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Award Details</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">
                Error Loading Award
              </h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchAwardDetails}
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

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "categories", label: "Categories & Votes", icon: Trophy },
    { id: "results", label: "Results", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const votingStatus = getVotingStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/admin/awards")}>
            <ArrowLeft size={16} />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {award?.title}
              </h1>
              <Badge className={getStatusColor(award?.status)}>
                {award?.status?.toUpperCase()}
              </Badge>
              <Badge
                className={
                  votingStatus === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                Voting: {votingStatus}
              </Badge>
              {award?.is_featured && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <Star size={12} className="fill-yellow-500 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span>Award ID: #{award?.id}</span>
              {award?.award_code && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs uppercase">
                    Code: {award.award_code}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/award/${award?.slug}`} target="_blank">
            <Button variant="outline" size="sm">
              <ExternalLink size={16} />
              <span className="hidden sm:inline">View Public Page</span>
            </Button>
          </Link>
          <Button onClick={fetchAwardDetails} variant="outline" size="sm">
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                <Trophy size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {award?.stats?.total_categories ||
                    award?.categories_count ||
                    0}
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
                  {award?.stats?.total_nominees || award?.nominees_count || 0}
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
                <AwardIcon size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {(
                    award?.stats?.total_votes ||
                    award?.total_votes ||
                    0
                  ).toLocaleString()}
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
                  {formatCurrency(
                    award?.stats?.revenue || award?.total_revenue,
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
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                <Percent size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {award?.platform_fee_percentage || 5}%
                </p>
                <p className="text-xs text-gray-500">Platform Fee</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <DollarSign size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    ((award?.stats?.revenue || award?.total_revenue || 0) *
                      (award?.platform_fee_percentage || 5)) /
                      100,
                  )}
                </p>
                <p className="text-xs text-gray-500">Platform Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Banner Image */}
            <Card className="overflow-hidden">
              {award?.banner_image ? (
                <img
                  src={award.banner_image}
                  alt={award.title}
                  className="w-full h-48 sm:h-64 object-cover"
                />
              ) : (
                <div className="w-full h-48 sm:h-64 bg-gray-100 flex items-center justify-center">
                  <ImageIcon size={48} className="text-gray-400" />
                </div>
              )}
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Award</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {award?.description || "No description"}
                </p>

                {award?.video_url && getYoutubeEmbedUrl(award.video_url) && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Video size={16} className="text-orange-600" />
                      Award Video
                    </h4>
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      <iframe
                        src={getYoutubeEmbedUrl(award.video_url)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Award Video"
                      ></iframe>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Categories by Votes */}
            {award?.categories && award.categories.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 size={20} className="text-orange-600" />
                    Categories Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {award.categories
                      .sort(
                        (a, b) => (b.total_votes || 0) - (a.total_votes || 0),
                      )
                      .slice(0, 5)
                      .map((category, index) => {
                        const maxVotes = Math.max(
                          ...award.categories.map((c) => c.total_votes || 0),
                        );
                        const percentage =
                          maxVotes > 0
                            ? ((category.total_votes || 0) / maxVotes) * 100
                            : 0;
                        return (
                          <div
                            key={category.id}
                            className="flex items-center gap-3"
                          >
                            <span className="text-sm font-medium text-gray-600 w-6">
                              {index + 1}.
                            </span>
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">
                                  {category.name}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {category.total_votes || 0} votes
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Award Details */}
            <Card>
              <CardHeader>
                <CardTitle>Award Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar
                    size={18}
                    className="text-gray-400 mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatDate(award?.ceremony_date)}
                    </p>
                    <p className="text-sm text-gray-500">Ceremony Date</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AwardIcon
                    size={18}
                    className="text-gray-400 mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatDate(award?.voting_start)}
                    </p>
                    <p className="text-sm text-gray-500">Voting Starts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AwardIcon
                    size={18}
                    className="text-gray-400 mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatDate(award?.voting_end)}
                    </p>
                    <p className="text-sm text-gray-500">Voting Ends</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className="text-gray-400 mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {award?.venue_name || "Not specified"}
                      </p>
                      <p className="text-sm text-gray-500">{award?.address}</p>
                      <p className="text-sm text-gray-500">
                        {award?.city}
                        {award?.region ? `, ${award.region}` : ""},{" "}
                        {award?.country}
                      </p>
                    </div>
                  </div>
                  {(award?.address || award?.city || award?.map_url) && (
                    <div className="w-full h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 mt-1">
                      <iframe
                        src={getGoogleMapsEmbedUrl(
                          award.map_url,
                          award.address,
                          award.city,
                        )}
                        className="w-full h-full border-0"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Venue Map"
                      ></iframe>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact & Links */}
            {(award?.phone ||
              award?.website ||
              award?.facebook ||
              award?.twitter ||
              award?.instagram ||
              award?.video_url) && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact & Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {award?.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-gray-400" />
                      <span className="text-gray-700">{award.phone}</span>
                    </div>
                  )}
                  {award?.website && (
                    <a
                      href={award.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <Globe size={14} />
                      Website
                    </a>
                  )}
                  <div className="flex gap-3 pt-1">
                    {award?.facebook && (
                      <a
                        href={award.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Facebook size={16} className="text-blue-600" />
                      </a>
                    )}
                    {award?.twitter && (
                      <a
                        href={award.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Twitter size={16} className="text-blue-400" />
                      </a>
                    )}
                    {award?.instagram && (
                      <a
                        href={award.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Instagram size={16} className="text-pink-600" />
                      </a>
                    )}
                  </div>
                  {award?.video_url && (
                    <a
                      href={award.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-red-600 hover:underline pt-1"
                    >
                      <Video size={14} />
                      Watch Video
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Organizer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Organizer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users size={24} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {award?.organizer_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Organizer ID: #{award?.organizer_id}
                    </p>
                  </div>
                </div>
                {award?.organizer_email && (
                  <a
                    href={`mailto:${award.organizer_email}`}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <Mail size={14} />
                    {award.organizer_email}
                  </a>
                )}
              </CardContent>
            </Card>

            {/* Status & Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className={getStatusColor(award?.status)}>
                    {award?.status?.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Featured</span>
                  {award?.is_featured ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : (
                    <XCircle size={20} className="text-gray-400" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Platform Fee</span>
                  <span className="font-semibold text-gray-900">
                    {award?.platform_fee_percentage || 5}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardContent className="p-4 text-sm text-gray-500 space-y-1">
                <p>Created: {formatDate(award?.created_at)}</p>
                <p>Updated: {formatDate(award?.updated_at)}</p>
                <p className="font-mono text-xs break-all">
                  Slug: {award?.slug}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Manage Categories
            </h3>
            <Button
              size="sm"
              className="gap-2"
              onClick={() => openCategoryModal()}
            >
              <Plus size={16} />
              Add Category
            </Button>
          </div>

          {award?.categories && award.categories.length > 0 ? (
            award.categories.map((category) => (
              <Card
                key={category.id}
                draggable
                onDragStart={(e) => handleCategoryDragStart(e, category)}
                onDragOver={handleCategoryDragOver}
                onDrop={(e) => handleCategoryDrop(e, category)}
                className={
                  draggedCategory?.id === category.id ? "opacity-50" : ""
                }
              >
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      {expandedCategories[category.id] ? (
                        <ChevronDown
                          size={20}
                          className="text-gray-400 shrink-0"
                        />
                      ) : (
                        <ChevronRight
                          size={20}
                          className="text-gray-400 shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <CardTitle className="text-lg truncate">
                          {category.name}
                        </CardTitle>
                        {category.description && (
                          <p className="text-sm text-gray-500 mt-1 truncate max-w-md">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                      {/* Voting Status Toggle */}
                      <div
                        className="flex items-center gap-2 mr-2 bg-white px-2.5 py-1 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                        onClick={(e) =>
                          handleToggleCategoryVoting(
                            e,
                            category.id,
                            (category.internal_voting_status ||
                              category.voting_status) === "open"
                              ? "closed"
                              : "open",
                          )
                        }
                      >
                        {togglingCategory === category.id ? (
                          <Loader2
                            size={14}
                            className="animate-spin text-orange-600"
                          />
                        ) : (category.internal_voting_status ||
                            category.voting_status) === "open" ? (
                          <CheckCircle size={14} className="text-green-600" />
                        ) : (
                          <XCircle size={14} className="text-red-600" />
                        )}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-tight ${
                            category.voting_status === "open"
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          Category Voting:{" "}
                          {category.voting_status === "open"
                            ? "OPEN"
                            : "CLOSED"}
                          {award?.voting_status !== "open" &&
                            (category.internal_voting_status ||
                              category.voting_status) === "open" && (
                              <span className="ml-1 opacity-60">
                                (Suppressed by Award)
                              </span>
                            )}
                          {award?.voting_status !== "open" &&
                            (category.internal_voting_status ||
                              category.voting_status) === "closed" && (
                              <span className="ml-1 opacity-60 text-red-400">
                                (Award Closed)
                              </span>
                            )}
                        </span>
                      </div>

                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900">
                          {category.total_votes || 0} votes
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(category.cost_per_vote)}/vote
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {category.nominees?.length || 0} nominees
                      </Badge>
                      <div className="flex items-center gap-1 border-l pl-4 ml-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            openCategoryModal(category);
                          }}
                        >
                          <Edit size={14} className="text-gray-500" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => handleDeleteCategory(e, category.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                {expandedCategories[category.id] && (
                  <CardContent>
                    <div className="flex justify-between items-center mb-4 pb-2 border-b">
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Nominees
                      </h4>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1 text-xs"
                        onClick={(e) => openNomineeModal(e, category.id)}
                      >
                        <Plus size={14} />
                        Add Nominee
                      </Button>
                    </div>
                    {category.nominees && category.nominees.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-medium text-gray-600 text-xs uppercase">
                                #
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-600 text-xs uppercase">
                                Nominee
                              </th>
                              <th className="text-right py-3 px-4 font-medium text-gray-600 text-xs uppercase">
                                Votes
                              </th>
                              <th className="text-right py-3 px-4 font-medium text-gray-600 text-xs uppercase">
                                Revenue
                              </th>
                              <th className="text-right py-3 px-4 font-medium text-gray-600 text-xs uppercase">
                                %
                              </th>
                              <th className="text-right py-3 px-4 font-medium text-gray-600 text-xs uppercase w-20">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {category.nominees
                              .sort(
                                (a, b) =>
                                  (a.display_order || 0) -
                                  (b.display_order || 0),
                              )
                              .map((nominee, index) => {
                                const categoryTotalVotes =
                                  category.nominees.reduce(
                                    (sum, n) => sum + (n.total_votes || 0),
                                    0,
                                  );
                                const votePercentage =
                                  categoryTotalVotes > 0
                                    ? ((nominee.total_votes || 0) /
                                        categoryTotalVotes) *
                                      100
                                    : 0;
                                return (
                                  <tr
                                    key={nominee.id}
                                    draggable
                                    onDragStart={(e) =>
                                      handleNomineeDragStart(e, nominee)
                                    }
                                    onDragOver={handleNomineeDragOver}
                                    onDrop={(e) =>
                                      handleNomineeDrop(e, nominee, category.id)
                                    }
                                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-move ${draggedNominee?.id === nominee.id ? "opacity-50" : ""}`}
                                  >
                                    <td className="py-3 px-4 text-gray-500 text-sm font-mono">
                                      {index + 1}
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="flex items-center gap-3">
                                        {nominee.image ? (
                                          <img
                                            src={nominee.image}
                                            alt={nominee.name}
                                            className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-gray-200"
                                          />
                                        ) : (
                                          <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                                            <Users
                                              size={12}
                                              className="text-gray-400"
                                            />
                                          </div>
                                        )}
                                        <div className="min-w-0">
                                          <p className="font-medium text-gray-900 text-sm truncate">
                                            {nominee.name}
                                          </p>
                                          {nominee.nominee_code && (
                                            <p className="text-[10px] text-orange-600 font-bold font-mono">
                                              CODE: {nominee.nominee_code}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="text-right py-3 px-4 font-semibold text-sm">
                                      {nominee.total_votes || 0}
                                    </td>
                                    <td className="text-right py-3 px-4 text-green-600 font-semibold text-sm">
                                      {formatCurrency(
                                        (nominee.total_votes || 0) *
                                          category.cost_per_vote,
                                      )}
                                    </td>
                                    <td className="text-right py-3 px-4">
                                      <div className="flex items-center justify-end gap-2">
                                        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                                          <div
                                            className="h-full bg-orange-500 rounded-full"
                                            style={{
                                              width: `${votePercentage}%`,
                                            }}
                                          />
                                        </div>
                                        <span className="text-xs font-medium">
                                          {votePercentage.toFixed(0)}%
                                        </span>
                                      </div>
                                    </td>
                                    <td className="text-right py-3 px-4">
                                      <div className="flex items-center justify-end gap-1">
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-7 w-7"
                                          onClick={(e) =>
                                            openNomineeModal(
                                              e,
                                              category.id,
                                              nominee,
                                            )
                                          }
                                        >
                                          <Edit
                                            size={12}
                                            className="text-gray-500"
                                          />
                                        </Button>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-7 w-7 text-red-500 hover:text-red-600"
                                          onClick={(e) =>
                                            handleDeleteNominee(e, nominee.id)
                                          }
                                        >
                                          <Trash2 size={12} />
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-lg bg-gray-50">
                        <Users
                          size={32}
                          className="mx-auto text-gray-200 mb-2"
                        />
                        <p className="text-gray-500 text-sm font-medium">
                          No nominees yet
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-2 text-orange-600 hover:text-orange-700"
                          onClick={(e) => openNomineeModal(e, category.id)}
                        >
                          <Plus size={14} className="mr-1" />
                          Add First Nominee
                        </Button>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-16 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Trophy size={32} className="text-gray-300" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  No Categories Found
                </h4>
                <p className="text-gray-500 max-w-sm mb-6">
                  Start by adding categories and nominees for this award.
                </p>
                <Button className="gap-2" onClick={() => openCategoryModal()}>
                  <Plus size={16} />
                  Create Category
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "results" && <AwardResults award={award} />}

      {activeTab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Edit Form */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Edit Award</CardTitle>
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit3 size={16} />
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        fetchAwardDetails();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      Save
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ceremony Date
                </label>
                <input
                  type="datetime-local"
                  name="ceremony_date"
                  value={formData.ceremony_date}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voting Start
                  </label>
                  <input
                    type="datetime-local"
                    name="voting_start"
                    value={formData.voting_start}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voting End
                  </label>
                  <input
                    type="datetime-local"
                    name="voting_end"
                    value={formData.voting_end}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  name="banner_image"
                  value={formData.banner_image}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Venue & Location */}
          <Card>
            <CardHeader>
              <CardTitle>Venue & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Name
                </label>
                <input
                  type="text"
                  name="venue_name"
                  value={formData.venue_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Map URL
                </label>
                <input
                  type="url"
                  name="map_url"
                  value={formData.map_url}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact & Media */}
          <Card>
            <CardHeader>
              <CardTitle>Contact & Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook
                  </label>
                  <input
                    type="text"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter
                  </label>
                  <input
                    type="text"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL
                </label>
                <input
                  type="url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Platform Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                  <option value="completed">Completed</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">
                    Manual Voting Override
                  </span>
                  <div
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      award?.voting_status === "open"
                        ? "bg-orange-600"
                        : "bg-gray-200"
                    } ${isTogglingVoting ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() =>
                      !isTogglingVoting &&
                      handleToggleVoting(
                        award?.voting_status === "open" ? "closed" : "open",
                      )
                    }
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        award?.voting_status === "open"
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Current Status:{" "}
                  {isTogglingVoting ? (
                    <Loader2
                      size={12}
                      className="inline animate-spin text-orange-600 mx-1"
                    />
                  ) : (
                    <span
                      className={`font-semibold ${award?.voting_status === "open" ? "text-green-600" : "text-red-600"}`}
                    >
                      {award?.voting_status === "open" ? "OPEN" : "CLOSED"}
                    </span>
                  )}
                  . This overrides the date range.
                </p>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Featured Award
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-8">
                  Featured awards appear prominently on the homepage
                </p>
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="show_results"
                    checked={formData.show_results}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Show Results Publicly
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-8">
                  If enabled, vote counts will be visible to the public
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Percent size={14} className="inline mr-1" />
                  Platform Fee Percentage
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="platform_fee_percentage"
                    value={formData.platform_fee_percentage}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    min="0"
                    max="100"
                    step="0.1"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                  />
                  <span className="text-gray-600 font-medium">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Platform commission on voting revenue. Current fee:{" "}
                  {formData.platform_fee_percentage}%
                </p>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">
                    <span className="text-gray-600">
                      Estimated Platform Earnings:
                    </span>
                    <span className="font-bold text-green-600 ml-2">
                      {formatCurrency(
                        ((award?.stats?.revenue || award?.total_revenue || 0) *
                          formData.platform_fee_percentage) /
                          100,
                      )}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Award Code
                </label>
                <input
                  type="text"
                  name="award_code"
                  value={formData.award_code}
                  onChange={handleInputChange}
                  disabled={!isEditing || award?.nominees_count > 0}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 uppercase"
                  maxLength={10}
                />
                {award?.nominees_count > 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Award code cannot be changed because this award already has
                    nominees.
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Used as a prefix for nominee codes (e.g., GMA1, GMA2)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {/* Modals */}
      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={closeCategoryModal}
        onSuccess={handleCategorySuccess}
        awardId={id}
        category={selectedCategory}
      />

      <NomineeModal
        isOpen={nomineeModalOpen}
        onClose={closeNomineeModal}
        onSuccess={handleNomineeSuccess}
        categoryId={activeCategory}
        nominee={selectedNominee}
      />
    </div>
  );
};

export default AdminAwardDetail;
