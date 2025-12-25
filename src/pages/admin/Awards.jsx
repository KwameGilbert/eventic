import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Trophy,
    Search,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Star,
    StarOff,
    Loader2,
    AlertCircle,
    Clock,
    DollarSign,
    Users,
    RefreshCw,
    Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import adminService from '../../services/adminService';
import { showSuccess, showError, showConfirm } from '../../utils/toast';

const AdminAwards = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [awards, setAwards] = useState([]);
    const [filteredAwards, setFilteredAwards] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [featuredFilter, setFeaturedFilter] = useState('all');
    const [processingActions, setProcessingActions] = useState({});
    const [stats, setStats] = useState({
        total: 0,
        published: 0,
        pending: 0,
        featured: 0,
        completed: 0
    });

    useEffect(() => {
        fetchAwards();
    }, []);

    useEffect(() => {
        filterAwards();
    }, [awards, searchTerm, statusFilter, featuredFilter]);

    const fetchAwards = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await adminService.getAwards();

            if (response.success) {
                const awardsData = response.data.awards || [];
                setAwards(awardsData);

                // Calculate stats
                setStats({
                    total: awardsData.length,
                    published: awardsData.filter(a => a.status === 'published').length,
                    pending: awardsData.filter(a => a.status === 'pending').length,
                    featured: awardsData.filter(a => a.is_featured).length,
                    completed: awardsData.filter(a => a.status === 'completed').length,
                });
            } else {
                setError(response.message || 'Failed to fetch awards');
            }
        } catch (err) {
            console.error('Error fetching awards:', err);
            setError(err.message || 'An error occurred while fetching awards');
        } finally {
            setIsLoading(false);
        }
    };

    const filterAwards = () => {
        let filtered = [...awards];

        // Search filter
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(award =>
                award.title?.toLowerCase().includes(search) ||
                award.organizer_name?.toLowerCase().includes(search) ||
                award.slug?.toLowerCase().includes(search)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(award => award.status === statusFilter);
        }

        // Featured filter
        if (featuredFilter === 'featured') {
            filtered = filtered.filter(award => award.is_featured);
        } else if (featuredFilter === 'not-featured') {
            filtered = filtered.filter(award => !award.is_featured);
        }

        setFilteredAwards(filtered);
    };

    const handleApproveAward = async (awardId) => {
        try {
            setProcessingActions(prev => ({ ...prev, [`approve-${awardId}`]: true }));
            const response = await adminService.approveAward(awardId);

            if (response.success) {
                showSuccess('Award approved successfully');
                fetchAwards();
            } else {
                showError(response.message || 'Failed to approve award');
            }
        } catch (err) {
            showError(err.message || 'Failed to approve award');
        } finally {
            setProcessingActions(prev => ({ ...prev, [`approve-${awardId}`]: false }));
        }
    };

    const handleRejectAward = async (awardId) => {
        const result = await showConfirm({
            title: 'Reject Award',
            text: 'Are you sure you want to reject this award? This action cannot be undone.',
            confirmButtonText: 'Yes, reject',
            icon: 'warning'
        });

        if (!result.isConfirmed) return;

        try {
            setProcessingActions(prev => ({ ...prev, [`reject-${awardId}`]: true }));
            const response = await adminService.rejectAward(awardId);

            if (response.success) {
                showSuccess('Award rejected successfully');
                fetchAwards();
            } else {
                showError(response.message || 'Failed to reject award');
            }
        } catch (err) {
            showError(err.message || 'Failed to reject award');
        } finally {
            setProcessingActions(prev => ({ ...prev, [`reject-${awardId}`]: false }));
        }
    };

    const handleToggleFeatured = async (awardId, currentStatus) => {
        try {
            setProcessingActions(prev => ({ ...prev, [`feature-${awardId}`]: true }));
            const response = await adminService.toggleAwardFeatured(awardId, !currentStatus);

            if (response.success) {
                showSuccess(currentStatus ? 'Award unfeatured' : 'Award featured');
                fetchAwards();
            } else {
                showError(response.message || 'Failed to update feature status');
            }
        } catch (err) {
            showError(err.message || 'Failed to update feature status');
        } finally {
            setProcessingActions(prev => ({ ...prev, [`feature-${awardId}`]: false }));
        }
    };

    const handleChangeStatus = async (awardId, newStatus) => {
        try {
            setProcessingActions(prev => ({ ...prev, [`status-${awardId}`]: true }));
            const response = await adminService.updateAwardStatus(awardId, newStatus);

            if (response.success) {
                showSuccess(`Award status changed to ${newStatus}`);
                fetchAwards();
            } else {
                showError(response.message || 'Failed to change status');
            }
        } catch (err) {
            showError(err.message || 'Failed to change status');
        } finally {
            setProcessingActions(prev => ({ ...prev, [`status-${awardId}`]: false }));
        }
    };

    const handleDeleteAward = async (awardId) => {
        const result = await showConfirm({
            title: 'Delete Award',
            text: 'Are you sure you want to delete this award? This action cannot be undone and will delete all associated categories, nominees, and votes.',
            confirmButtonText: 'Yes, delete',
            icon: 'warning'
        });

        if (!result.isConfirmed) return;

        try {
            setProcessingActions(prev => ({ ...prev, [`delete-${awardId}`]: true }));
            const response = await adminService.deleteAward(awardId);

            if (response.success) {
                showSuccess('Award deleted successfully');
                fetchAwards();
            } else {
                showError(response.message || 'Failed to delete award');
            }
        } catch (err) {
            showError(err.message || 'Failed to delete award');
        } finally {
            setProcessingActions(prev => ({ ...prev, [`delete-${awardId}`]: false }));
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
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

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading awards...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Award Events</h1>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
                        <div>
                            <h3 className="font-semibold text-red-800 mb-1">Error Loading Awards</h3>
                            <p className="text-red-700">{error}</p>
                            <button
                                onClick={fetchAwards}
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
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Award Events</h1>
                    <p className="text-gray-500 mt-1">Manage all awards on the platform</p>
                </div>
                <Button onClick={fetchAwards} variant="outline" size="sm">
                    <RefreshCw size={16} />
                    Refresh
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                                <Trophy size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-xs text-gray-500">Total Awards</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                                <CheckCircle size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
                                <p className="text-xs text-gray-500">Published</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0">
                                <Clock size={20} className="text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                                <p className="text-xs text-gray-500">Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                                <Star size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
                                <p className="text-xs text-gray-500">Featured</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                <CheckCircle size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                                <p className="text-xs text-gray-500">Completed</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search awards..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="pending">Pending</option>
                            <option value="draft">Draft</option>
                            <option value="completed">Completed</option>
                            <option value="closed">Closed</option>
                        </select>

                        {/* Featured Filter */}
                        <select
                            value={featuredFilter}
                            onChange={(e) => setFeaturedFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="all">All Awards</option>
                            <option value="featured">Featured Only</option>
                            <option value="not-featured">Not Featured</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Awards List */}
            <Card>
                <CardHeader>
                    <CardTitle>Awards ({filteredAwards.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredAwards.length === 0 ? (
                        <div className="text-center py-12">
                            <Trophy size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500">No awards found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAwards.map((award) => (
                                <div
                                    key={award.id}
                                    className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                                        {/* Award Image */}
                                        <div className="w-full sm:w-20 md:w-24 h-20 md:h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                            {award.banner_image ? (
                                                <img
                                                    src={award.banner_image}
                                                    alt={award.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Trophy size={32} className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Award Details */}
                                        <div className="flex-1 min-w-0 w-full">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                                                            {award.title}
                                                        </h3>
                                                        {award.is_featured && (
                                                            <Star size={16} className="text-yellow-500 fill-yellow-500 shrink-0" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        by {award.organizer_name || 'Unknown Organizer'}
                                                    </p>
                                                </div>
                                                <Badge className={getStatusColor(award.status)}>
                                                    {award.status.toUpperCase()}
                                                </Badge>
                                            </div>

                                            {/* Award Meta */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-3">
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <Calendar size={14} className="shrink-0" />
                                                    <span className="truncate">{formatDate(award.ceremony_date)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <Trophy size={14} className="shrink-0" />
                                                    <span>{award.categories_count || 0} categories</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <Users size={14} className="shrink-0" />
                                                    <span>{award.total_votes || 0} votes</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <DollarSign size={14} className="shrink-0" />
                                                    <span>{adminService.formatCurrency(award.total_revenue || 0)}</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-2">
                                                {/* View Award */}
                                                <Link to={`/award/${award.slug}`} target="_blank">
                                                    <Button size="sm" variant="outline" className="text-xs sm:text-sm">
                                                        <Eye size={14} />
                                                        <span className="hidden sm:inline">Public View</span>
                                                    </Button>
                                                </Link>

                                                {/* Edit Award */}
                                                <Link to={`/admin/awards/${award.id}`}>
                                                    <Button size="sm" variant="outline" className="text-xs sm:text-sm">
                                                        <Edit size={14} />
                                                        <span className="hidden sm:inline">Admin View</span>
                                                    </Button>
                                                </Link>

                                                {/* Approve/Reject for pending awards */}
                                                {award.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleApproveAward(award.id)}
                                                            disabled={processingActions[`approve-${award.id}`]}
                                                            className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                                                        >
                                                            {processingActions[`approve-${award.id}`] ? (
                                                                <Loader2 size={14} className="animate-spin" />
                                                            ) : (
                                                                <CheckCircle size={14} />
                                                            )}
                                                            <span className="hidden sm:inline">Approve</span>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleRejectAward(award.id)}
                                                            disabled={processingActions[`reject-${award.id}`]}
                                                            className="text-red-600 border-red-600 hover:bg-red-50 text-xs sm:text-sm"
                                                        >
                                                            {processingActions[`reject-${award.id}`] ? (
                                                                <Loader2 size={14} className="animate-spin" />
                                                            ) : (
                                                                <XCircle size={14} />
                                                            )}
                                                            <span className="hidden sm:inline">Reject</span>
                                                        </Button>
                                                    </>
                                                )}

                                                {/* Toggle Featured */}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleToggleFeatured(award.id, award.is_featured)}
                                                    disabled={processingActions[`feature-${award.id}`]}
                                                    className="text-xs sm:text-sm"
                                                >
                                                    {processingActions[`feature-${award.id}`] ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : award.is_featured ? (
                                                        <StarOff size={14} />
                                                    ) : (
                                                        <Star size={14} />
                                                    )}
                                                    <span className="hidden md:inline">{award.is_featured ? 'Unfeature' : 'Feature'}</span>
                                                </Button>

                                                {/* Status Change Dropdown */}
                                                <select
                                                    value={award.status}
                                                    onChange={(e) => handleChangeStatus(award.id, e.target.value)}
                                                    disabled={processingActions[`status-${award.id}`]}
                                                    className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                >
                                                    <option value="draft">Draft</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="published">Published</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="closed">Closed</option>
                                                </select>

                                                {/* Delete Award */}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDeleteAward(award.id)}
                                                    disabled={processingActions[`delete-${award.id}`]}
                                                    className="text-red-600 border-red-600 hover:bg-red-50 text-xs sm:text-sm"
                                                >
                                                    {processingActions[`delete-${award.id}`] ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={14} />
                                                    )}
                                                    <span className="hidden sm:inline">Delete</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminAwards;
