import React from "react";
import PropTypes from "prop-types";
import {
  Loader2,
  Edit3,
  Save,
  X,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";

const AwardSettings = ({
  award,
  formData,
  isEditing,
  setIsEditing,
  isSaving,
  handleInputChange,
  handleImageUpload,
  removeBannerImage,
  handleSave,
  fetchAwardDetails,
  isTogglingAwardVoting,
  handleToggleAwardVoting,
  isTogglingResults,
  handleToggleResults,
  onCloseAward,
  isStatusChanging,
  countries,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Edit Form */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit Award Details</CardTitle>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Award Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ceremony Date
              </label>
              <input
                type="datetime-local"
                name="ceremony_date"
                value={formData.ceremony_date}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Award Code
              </label>
              <input
                type="text"
                name="award_code"
                value={formData.award_code}
                onChange={handleInputChange}
                disabled={!isEditing || award?.nominees_count > 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 uppercase text-sm"
                maxLength={10}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voting Starts
              </label>
              <input
                type="datetime-local"
                name="voting_start"
                value={formData.voting_start}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voting Ends
              </label>
              <input
                type="datetime-local"
                name="voting_end"
                value={formData.voting_end}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue Name
              </label>
              <input
                type="text"
                name="venue_name"
                value={formData.venue_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 text-sm"
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Maps Embed URL
            </label>
            <input
              type="url"
              name="map_url"
              value={formData.map_url}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="https://www.google.com/maps/embed?..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banner Image
            </label>
            {formData.bannerImagePreview ? (
              <div className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                <img
                  src={formData.bannerImagePreview}
                  alt="Banner preview"
                  className="w-full h-40 object-cover"
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={removeBannerImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-md"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${isEditing ? "border-gray-300 hover:border-orange-300 cursor-pointer" : "border-gray-200 bg-gray-50"}`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={!isEditing}
                  className="hidden"
                  id="banner-image-upload"
                />
                <label
                  htmlFor="banner-image-upload"
                  className={`flex flex-col items-center ${isEditing ? "cursor-pointer" : ""}`}
                >
                  <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 font-medium">
                    Click to upload banner image
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Recommended size: 1200x600px
                  </span>
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Side Settings */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Voting Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-gray-700">
                  Award Voting Status
                </span>
                <div
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    award?.voting_status === "open"
                      ? "bg-orange-600"
                      : "bg-gray-200"
                  } ${isTogglingAwardVoting ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() =>
                    !isTogglingAwardVoting &&
                    handleToggleAwardVoting(
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
                {isTogglingAwardVoting ? (
                  <Loader2
                    size={12}
                    className="inline animate-spin text-orange-600 mx-1"
                  />
                ) : (
                  <span
                    className={`font-semibold ${
                      award?.voting_status === "open"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {award?.voting_status === "open" ? "OPEN" : "CLOSED"}
                  </span>
                )}
                . This overrides the date range.
              </p>
            </div>

            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-gray-700">
                  Show Results Publicly
                </span>
                <div
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.show_results ? "bg-orange-600" : "bg-gray-200"
                  } ${isTogglingResults ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !isTogglingResults && handleToggleResults()}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.show_results ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Current Status:{" "}
                {isTogglingResults ? (
                  <Loader2
                    size={12}
                    className="inline animate-spin text-orange-600 mx-1"
                  />
                ) : (
                  <span
                    className={`font-semibold ${
                      formData.show_results ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formData.show_results ? "VISIBLE" : "HIDDEN"}
                  </span>
                )}
                . If enabled, vote counts will be visible to the public.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Social Section */}
        <Card>
          <CardHeader>
            <CardTitle>Contact & Social Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter
              </label>
              <input
                type="text"
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video URL (YouTube/Vimeo)
              </label>
              <input
                type="text"
                name="video_url"
                value={formData.video_url}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50/30">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle size={20} />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-gray-900">Close Award</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Closing the award will end all voting and mark the event as
                  complete. This action is usually performed after the ceremony.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onCloseAward}
                disabled={isStatusChanging || award?.status === "closed"}
                className="text-red-600 border-red-200 hover:bg-red-50 shrink-0"
              >
                Close Award
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

AwardSettings.propTypes = {
  award: PropTypes.object,
  formData: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleImageUpload: PropTypes.func.isRequired,
  removeBannerImage: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  fetchAwardDetails: PropTypes.func.isRequired,
  isTogglingAwardVoting: PropTypes.bool.isRequired,
  handleToggleAwardVoting: PropTypes.func.isRequired,
  isTogglingResults: PropTypes.bool.isRequired,
  handleToggleResults: PropTypes.func.isRequired,
  onCloseAward: PropTypes.func.isRequired,
  isStatusChanging: PropTypes.bool.isRequired,
  countries: PropTypes.array.isRequired,
};

export default AwardSettings;
