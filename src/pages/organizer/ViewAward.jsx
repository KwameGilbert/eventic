import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  AlertCircle,
  Eye,
  Trophy,
  Settings,
  BarChart3,
  History,
} from "lucide-react";
import awardService from "../../services/awardService";
import categoryService from "../../services/categoryService";
import nomineeService from "../../services/nomineeService";
import CategoryModal from "../../components/organizer/awards/CategoryModal";
import NomineeModal from "../../components/organizer/awards/NomineeModal";
import { showSuccess, showError, showConfirm } from "../../utils/toast";

// Sub-components
import AwardHeader from "../../components/organizer/awards/view_award/AwardHeader";
import AwardStats from "../../components/organizer/awards/view_award/AwardStats";
import AwardOverview from "../../components/organizer/awards/view_award/AwardOverview";
import AwardCategories from "../../components/organizer/awards/view_award/AwardCategories";
import AwardSettings from "../../components/organizer/awards/view_award/AwardSettings";
import AwardResults from "../../components/organizer/awards/view_award/AwardResults";
import AwardTransactions from "../../components/organizer/awards/view_award/AwardTransactions";

const ViewAward = () => {
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

  const [isTogglingAwardVoting, setIsTogglingAwardVoting] = useState(false);
  const [togglingCategoryId, setTogglingCategoryId] = useState(null);

  // Countries (static for now)
  const countries = [
    "Ghana",
    "Nigeria",
    "Kenya",
    "South Africa",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Spain",
    "Italy",
    "Netherlands",
    "India",
    "Japan",
    "China",
    "Brazil",
    "Mexico",
    "Other",
  ];

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
    banner_image: null,
    bannerImagePreview: "",
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

  const fetchAwardDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await awardService.getAwardDetails(id);

      if (response.success && response.data) {
        const awardData = response.data.award || response.data;
        setAward(awardData);

        // Populate form data
        setFormData({
          title: awardData.title || "",
          description: awardData.description || "",
          ceremony_date: awardData.ceremony_date
            ? new Date(awardData.ceremony_date).toISOString().substring(0, 16)
            : "",
          voting_start: awardData.voting_start
            ? new Date(awardData.voting_start).toISOString().substring(0, 16)
            : "",
          voting_end: awardData.voting_end
            ? new Date(awardData.voting_end).toISOString().substring(0, 16)
            : "",
          venue_name: awardData.venue || awardData.venue_name || "",
          address: awardData.location || awardData.address || "",
          city: awardData.city || "",
          region: awardData.region || "",
          country: awardData.country || "",
          map_url: awardData.mapUrl || awardData.map_url || "",
          status: awardData.status || "draft",
          is_featured: awardData.is_featured || false,
          show_results: awardData.show_results !== false,
          banner_image: null,
          bannerImagePreview: awardData.banner_image || awardData.image || "",
          phone: awardData.contact?.phone || awardData.phone || "",
          website: awardData.contact?.website || awardData.website || "",
          facebook: awardData.facebook || awardData.socialMedia?.facebook || "",
          twitter: awardData.twitter || awardData.socialMedia?.twitter || "",
          instagram:
            awardData.instagram || awardData.socialMedia?.instagram || "",
          video_url: awardData.video_url || awardData.videoUrl || "",
          award_code: awardData.award_code || "",
        });

        // Expand all categories by default
        if (awardData.categories) {
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
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          banner_image: file,
          bannerImagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBannerImage = () => {
    setFormData((prev) => ({
      ...prev,
      banner_image: null,
      bannerImagePreview: "",
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "banner_image" && formData[key]) {
          data.append("banner_image", formData[key]);
        } else if (key !== "bannerImagePreview" && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      const response = await awardService.update(id, data);

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

  const [isStatusChanging, setIsStatusChanging] = useState(false);

  const handleUpdateStatus = async (newStatus) => {
    try {
      setIsStatusChanging(true);
      let response;

      if (newStatus === "pending") {
        response = await awardService.submitForApproval(id);
      } else {
        // For other status updates like 'closed'
        const data = new FormData();
        data.append("status", newStatus);
        response = await awardService.update(id, data);
      }

      if (response.success) {
        showSuccess(`Award status updated to ${newStatus}`);
        fetchAwardDetails();
      } else {
        showError(response.message || "Failed to update status");
      }
    } catch (err) {
      showError(err.message || "Failed to update status");
    } finally {
      setIsStatusChanging(false);
    }
  };

  const handleDeleteAward = async () => {
    const result = await showConfirm({
      title: "Delete Award?",
      text: "This will permanently delete the award and all its categories and nominees. This action cannot be undone.",
      confirmButtonText: "Yes, delete it",
      icon: "warning",
    });

    if (!result.isConfirmed) return;

    try {
      setIsStatusChanging(true);
      const response = await awardService.delete(id);
      if (response.success) {
        showSuccess("Award deleted successfully");
        navigate("/organizer/awards");
      } else {
        showError(response.message || "Failed to delete award");
      }
    } catch (err) {
      showError(err.message || "Failed to delete award");
    } finally {
      setIsStatusChanging(false);
    }
  };

  const handleToggleAwardVoting = async (status) => {
    try {
      setIsTogglingAwardVoting(true);
      const response = await awardService.toggleVoting(id, status);

      if (response.success) {
        showSuccess(response.message || `Award voting is now ${status}`);
        if (response.data && response.data.award) {
          setAward(response.data.award);
        } else if (response.award) {
          setAward(response.award);
        } else {
          setAward((prev) => ({
            ...prev,
            voting_status: status,
          }));
        }
      } else {
        showError(response.message || "Failed to toggle award voting status");
      }
    } catch (err) {
      showError(err.message || "Failed to toggle award voting status");
    } finally {
      setIsTogglingAwardVoting(false);
    }
  };

  const handleToggleCategoryVoting = async (e, categoryId, status) => {
    if (e) e.stopPropagation();
    try {
      setTogglingCategoryId(categoryId);
      const response = await categoryService.toggleVoting(categoryId, status);

      if (response.success) {
        showSuccess(response.message || `Category voting is now ${status}`);
        const awardData = response.data;
        const effectiveStatus = awardData?.voting_status || status;

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
      setTogglingCategoryId(null);
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const openCategoryModal = (category = null) => {
    setSelectedCategory(category);
    setCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = async (e, categoryId) => {
    e.stopPropagation();
    const result = await showConfirm({
      title: "Delete Category?",
      text: "This will permanently delete the category and all its nominees. This action cannot be undone.",
      confirmButtonText: "Yes, delete it",
      icon: "warning",
    });

    if (!result.isConfirmed) return;

    try {
      await categoryService.delete(categoryId);
      showSuccess("Category deleted successfully");
      fetchAwardDetails();
    } catch (err) {
      console.log(err);
      showError("Failed to delete category");
    }
  };

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

  const handleDeleteNominee = async (e, nomineeId) => {
    if (e) e.stopPropagation();
    const result = await showConfirm({
      title: "Delete Nominee?",
      text: "This will permanently remove this nominee. This action cannot be undone.",
      confirmButtonText: "Yes, delete it",
      icon: "warning",
    });

    if (!result.isConfirmed) return;

    try {
      await nomineeService.delete(nomineeId);
      showSuccess("Nominee deleted successfully");
      fetchAwardDetails();
    } catch (err) {
      console.log(err);
      showError("Failed to delete nominee");
    }
  };

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
      fetchAwardDetails();
    } catch (err) {
      console.error("Error reordering categories:", err);
    }
    setDraggedCategory(null);
  };

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
      fetchAwardDetails();
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

  const formatCurrency = (amount) => `GH₵${(amount || 0).toLocaleString()}`;

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
      <div className="space-y-6 p-6">
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

  const awardVotingStatus =
    award?.voting_status === "open" ? "Active" : "Closed";

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "categories", label: "Categories & Votes", icon: Trophy },
    { id: "results", label: "Results", icon: BarChart3 },
    { id: "transactions", label: "Transactions", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="space-y-4 container mx-auto">
      <AwardHeader
        award={award}
        navigate={navigate}
        fetchAwardDetails={fetchAwardDetails}
        awardVotingStatus={awardVotingStatus}
        getStatusColor={getStatusColor}
        onSubmitForApproval={() => handleUpdateStatus("pending")}
        onDeleteAward={handleDeleteAward}
        isStatusChanging={isStatusChanging}
      />

      <AwardStats award={award} />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                <Icon
                  className={`-ml-0.5 mr-2 h-4 w-4 ${activeTab === tab.id ? "text-orange-500" : "text-gray-400 group-hover:text-gray-500"}`}
                />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === "overview" && (
          <AwardOverview
            award={award}
            getYoutubeEmbedUrl={getYoutubeEmbedUrl}
            getGoogleMapsEmbedUrl={getGoogleMapsEmbedUrl}
            formatDate={formatDate}
          />
        )}

        {activeTab === "transactions" && <AwardTransactions award={award} />}

        {activeTab === "categories" && (
          <AwardCategories
            award={award}
            expandedCategories={expandedCategories}
            toggleCategory={toggleCategory}
            openCategoryModal={openCategoryModal}
            handleToggleCategoryVoting={handleToggleCategoryVoting}
            togglingCategoryId={togglingCategoryId}
            formatCurrency={formatCurrency}
            handleDeleteCategory={handleDeleteCategory}
            openNomineeModal={openNomineeModal}
            handleDeleteNominee={handleDeleteNominee}
            handleCategoryDragStart={handleCategoryDragStart}
            handleCategoryDragOver={handleCategoryDragOver}
            handleCategoryDrop={handleCategoryDrop}
            handleNomineeDragStart={handleNomineeDragStart}
            handleNomineeDragOver={handleNomineeDragOver}
            handleNomineeDrop={handleNomineeDrop}
            draggedCategory={draggedCategory}
            draggedNominee={draggedNominee}
          />
        )}

        {activeTab === "results" && <AwardResults award={award} />}

        {activeTab === "settings" && (
          <AwardSettings
            award={award}
            formData={formData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isSaving={isSaving}
            handleInputChange={handleInputChange}
            handleImageUpload={handleImageUpload}
            removeBannerImage={removeBannerImage}
            handleSave={handleSave}
            fetchAwardDetails={fetchAwardDetails}
            isTogglingAwardVoting={isTogglingAwardVoting}
            handleToggleAwardVoting={handleToggleAwardVoting}
            onCloseAward={() => handleUpdateStatus("closed")}
            isStatusChanging={isStatusChanging}
            countries={countries}
          />
        )}
      </div>

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={closeCategoryModal}
        onSuccess={fetchAwardDetails}
        awardId={id}
        category={selectedCategory}
      />

      <NomineeModal
        isOpen={nomineeModalOpen}
        onClose={closeNomineeModal}
        onSuccess={fetchAwardDetails}
        categoryId={activeCategory}
        nominee={selectedNominee}
      />
    </div>
  );
};

export default ViewAward;
