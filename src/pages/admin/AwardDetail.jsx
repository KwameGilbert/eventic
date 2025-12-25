import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Trophy,
    Calendar,
    Clock,
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
    Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import adminService from '../../services/adminService';
import { showSuccess, showError } from '../../utils/toast';

const AdminAwardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [award, setAward] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ceremony_date: '',
        voting_start_date: '',
        voting_end_date: '',
        status: '',
        is_featured: false,
        platform_fee_percentage: 5.0,
        banner_image: ''
    });

    useEffect(() => {
        fetchAwardDetails();
    }, [id]);

    const fetchAwardDetails = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await adminService.getAwardDetails(id);

            if (response.success) {
                const awardData = response.data.award;
                setAward(awardData);

                // Populate form data
                setFormData({
                    title: awardData.title || '',
                    description: awardData.description || '',
                    ceremony_date: awardData.ceremony_date ? awardData.ceremony_date.substring(0, 16) : '',
                    voting_start_date: awardData.voting_start_date ? awardData.voting_start_date.substring(0, 16) : '',
                    voting_end_date: awardData.voting_end_date ? awardData.voting_end_date.substring(0, 16) : '',
                    status: awardData.status || 'draft',
                    is_featured: awardData.is_featured || false,
                    platform_fee_percentage: awardData.platform_fee_percentage || 5.0,
                    banner_image: awardData.banner_image || ''
                });
            } else {
                setError(response.message || 'Failed to fetch award details');
            }
        } catch (err) {
            console.error('Error fetching award details:', err);
            setError(err.message || 'An error occurred while fetching award details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const response = await adminService.updateAward(id, formData);

            if (response.success) {
                showSuccess('Award updated successfully');
                setIsEditing(false);
                fetchAwardDetails();
            } else {
                showError(response.message || 'Failed to update award');
            }
        } catch (err) {
            showError(err.message || 'Failed to update award');
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            published: 'bg-green-100 text-green-800 border-green-200',
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            draft: 'bg-gray-100 text-gray-800 border-gray-200',
            completed: 'bg-blue-100 text-blue-800 border-blue-200',
            closed: 'bg-purple-100 text-purple-800 border-purple-200',
        };
        return colors[status] || colors.draft;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading award details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => navigate('/admin/awards')}>
                        <ArrowLeft size={16} />
                        Back to Awards
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900">Award Details</h1>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
                        <div>
                            <h3 className="font-semibold text-red-800 mb-1">Error Loading Award</h3>
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => navigate('/admin/awards')}>
                        <ArrowLeft size={16} />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{award?.title}</h1>
                        <p className="text-gray-500 mt-1">Award ID: #{award?.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>
                            <Edit3 size={16} />
                            Edit Award
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => {
                                setIsEditing(false);
                                fetchAwardDetails();
                            }}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Save size={16} />
                                )}
                                Save Changes
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Status and Featured */}
            <div className="flex items-center gap-3">
                <Badge className={getStatusColor(award?.status)}>
                    {award?.status}
                </Badge>
                {award?.is_featured && (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        <Star size={14} className="fill-yellow-500" />
                        Featured
                    </Badge>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Banner Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Banner Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!isEditing ? (
                                <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                                    {award?.banner_image ? (
                                        <img
                                            src={award.banner_image}
                                            alt={award.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon size={48} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Banner Image URL
                                    </label>
                                    <input
                                        type="url"
                                        name="banner_image"
                                        value={formData.banner_image}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!isEditing ? (
                                <>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Title</label>
                                        <p className="text-gray-900 font-medium mt-1">{award?.title}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Description</label>
                                        <p className="text-gray-900 mt-1 whitespace-pre-wrap">{award?.description || 'No description'}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            required
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
                                            rows={6}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Dates */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Important Dates</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!isEditing ? (
                                <>
                                    <div className="flex items-start gap-2">
                                        <Calendar size={18} className="text-gray-500 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Ceremony Date</p>
                                            <p className="text-gray-900">{formatDate(award?.ceremony_date)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Clock size={18} className="text-gray-500 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Voting Period</p>
                                            <p className="text-gray-900">
                                                {formatDate(award?.voting_start_date)} - {formatDate(award?.voting_end_date)}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ceremony Date *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="ceremony_date"
                                            value={formData.ceremony_date}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Voting Start Date *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="voting_start_date"
                                            value={formData.voting_start_date}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Voting End Date *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="voting_end_date"
                                            value={formData.voting_end_date}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - 1 column */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Trophy size={18} className="text-purple-600" />
                                    <span className="text-sm text-gray-700">Categories</span>
                                </div>
                                <span className="font-bold text-purple-600">{award?.categories_count || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Users size={18} className="text-blue-600" />
                                    <span className="text-sm text-gray-700">Total Votes</span>
                                </div>
                                <span className="font-bold text-blue-600">{award?.total_votes || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <DollarSign size={18} className="text-green-600" />
                                    <span className="text-sm text-gray-700">Total Revenue</span>
                                </div>
                                <span className="font-bold text-green-600">
                                    {adminService.formatCurrency(award?.total_revenue || 0)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Organizer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Organizer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p className="font-medium text-gray-900">{award?.organizer_name}</p>
                                <p className="text-sm text-gray-600">Organizer ID: #{award?.organizer_id}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status & Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status & Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!isEditing ? (
                                <>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Status</label>
                                        <p className="mt-1">
                                            <Badge className={getStatusColor(award?.status)}>
                                                {award?.status}
                                            </Badge>
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Featured</label>
                                        <p className="mt-1">
                                            {award?.is_featured ? (
                                                <CheckCircle size={20} className="text-green-600" />
                                            ) : (
                                                <XCircle size={20} className="text-gray-400" />
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Platform Fee</label>
                                        <p className="text-gray-900 font-medium mt-1">
                                            {award?.platform_fee_percentage || 5.0}%
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="pending">Pending</option>
                                            <option value="published">Published</option>
                                            <option value="completed">Completed</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="is_featured"
                                                checked={formData.is_featured}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Featured Award</span>
                                        </label>
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
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            />
                                            <span className="text-gray-600">%</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Platform commission on vote revenue
                                        </p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div>
                                <span className="text-gray-500">Created:</span>
                                <p className="text-gray-900">{formatDate(award?.created_at)}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Last Updated:</span>
                                <p className="text-gray-900">{formatDate(award?.updated_at)}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Slug:</span>
                                <p className="text-gray-900 font-mono text-xs">{award?.slug}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminAwardDetail;
