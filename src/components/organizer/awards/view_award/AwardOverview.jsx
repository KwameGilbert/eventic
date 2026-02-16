import React from "react";
import PropTypes from "prop-types";
import { MapPin, Image as ImageIcon, BarChart3, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

const AwardOverview = ({
  award,
  getYoutubeEmbedUrl,
  getGoogleMapsEmbedUrl,
  formatDate,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column (Details) */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>About This Award</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-gray-600">
              <p className="whitespace-pre-wrap">
                {award?.description || "No description provided."}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Ceremony Date:</dt>
                    <dd className="font-medium text-gray-900">
                      {formatDate(award?.ceremony_date)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Voting Starts:</dt>
                    <dd className="font-medium text-gray-900">
                      {formatDate(award?.voting_start)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Voting Ends:</dt>
                    <dd className="font-medium text-gray-900">
                      {formatDate(award?.voting_end)}
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {award?.venue_name || "Manual Venue"}
                    </p>
                    <p>
                      {[
                        award?.address,
                        award?.city,
                        award?.region,
                        award?.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Performance Summary */}
        {award?.categories?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} className="text-orange-600" />
                Categories Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {award.categories.slice(0, 5).map((category) => {
                  const totalVotes = award?.stats?.total_votes || 0;
                  const percentage =
                    totalVotes > 0
                      ? ((category.total_votes || 0) / totalVotes) * 100
                      : 0;
                  return (
                    <div key={category.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">
                          {category.name}
                        </span>
                        <span className="text-gray-500">
                          {category.total_votes || 0} votes (
                          {percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {award.categories.length > 5 && (
                  <p className="text-center text-xs text-gray-500 pt-2 cursor-pointer hover:text-orange-600 underline">
                    View all in Categories tab
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {award?.video_url && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video size={20} className="text-orange-600" />
                Promo Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <iframe
                  src={getYoutubeEmbedUrl(award.video_url)}
                  title="Promo Video"
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Column (Media & Map) */}
      <div className="space-y-6">
        <Card className="overflow-hidden shadow-sm">
          <div className="aspect-4/3 bg-gray-100 relative">
            {award?.banner_image ? (
              <img
                src={award.banner_image}
                alt={award.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <ImageIcon size={48} />
              </div>
            )}
          </div>
        </Card>

        {award?.map_url && (
          <Card className="overflow-hidden shadow-sm">
            <CardHeader className="py-4">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin size={18} className="text-orange-600" />
                Location Map
              </CardTitle>
            </CardHeader>
            <div className="aspect-square bg-gray-100">
              <iframe
                src={getGoogleMapsEmbedUrl(
                  award.map_url,
                  award.address,
                  award.city,
                )}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Venue Map"
              ></iframe>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

AwardOverview.propTypes = {
  award: PropTypes.object,
  getYoutubeEmbedUrl: PropTypes.func.isRequired,
  getGoogleMapsEmbedUrl: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
};

export default AwardOverview;
