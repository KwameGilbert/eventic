import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
    Mail
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
    const [activeTab, setActiveTab] = useState('overview');
    const [expandedCategories, setExpandedCategories] = useState({});

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ceremony_date: '',
        voting_start: '',
        voting_end: '',
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
                    voting_start: awardData.voting_start ? awardData.voting_start.substring(0, 16) : '',
                    voting_end: awardData.voting_end ? awardData.voting_end.substring(0, 16) : '',
                    status: awardData.status || 'draft',
                    is_featured: awardData.is_featured || false,
                    platform_fee_percentage: awardData.platform_fee_percentage || 5.0,
                    banner_image: awardData.banner_image || ''
                });

                // Expand all categories by default
                if (awardData.categories) {
                    const expanded = {};
                    awardData.categories.forEach(cat => {
                        expanded[cat.id] = true;
                    });
                    setExpandedCategories(expanded);
                }
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

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
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

    const formatCurrency = (amount) => {
        return `GH₵${(amount || 0).toLocaleString()}`;
    };

    const getStatusColor = (status) => {
        const colors = {
            published: 'bg-green-100 text-green-800 border-green-200',
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            draft: 'bg-gray-100 text-gray-800 border-gray-200',
            closed: 'bg-red-100 text-red-800 border-red-200',
            completed: 'bg-blue-100 text-blue-800 border-blue-200',
        };
        return colors[status] || colors.draft;
    };

    const getVotingStatus = () => {
        if (!award?.voting_start || !award?.voting_end) return 'Not Set';
        const now = new Date();
        const start = new Date(award.voting_start);
        const end = new Date(award.voting_end);

        if (now < start) return 'Not Started';
        if (now > end) return 'Ended';
        return 'Active';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-orange-600 mx-auto mb-4" />
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

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Eye },
        { id: 'categories', label: 'Categories & Votes', icon: Trophy },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const votingStatus = getVotingStatus();

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
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{award?.title}</h1>
                            <Badge className={getStatusColor(award?.status)}>
                                {award?.status?.toUpperCase()}
                            </Badge>
                            <Badge className={
                                votingStatus === 'Active' ? 'bg-green-100 text-green-800' :
                                    votingStatus === 'Ended' ? 'bg-gray-100 text-gray-800' :
                                        'bg-yellow-100 text-yellow-800'
                            }>
                                Voting: {votingStatus}
                            </Badge>
                            {award?.is_featured && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                    <Star size={12} className="fill-yellow-500 mr-1" />
                                    Featured
                                </Badge>
                            )}
                        </div>
                        <p className="text-gray-500 mt-1 text-sm">Award ID: #{award?.id}</p>
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
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{award?.categories_count || 0}</p>
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
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{award?.nominees_count || 0}</p>
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
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{(award?.total_votes || 0).toLocaleString()}</p>
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
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(award?.total_revenue)}</p>
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
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{award?.platform_fee_percentage || 5}%</p>
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
                                    {formatCurrency((award?.total_revenue || 0) * (award?.platform_fee_percentage || 5) / 100)}
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
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'border-orange-600 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
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
                            <CardContent>
                                <p className="text-gray-700 whitespace-pre-wrap">{award?.description || 'No description'}</p>
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
                                            .sort((a, b) => (b.total_votes || 0) - (a.total_votes || 0))
                                            .slice(0, 5)
                                            .map((category, index) => {
                                                const maxVotes = Math.max(...award.categories.map(c => c.total_votes || 0));
                                                const percentage = maxVotes > 0 ? ((category.total_votes || 0) / maxVotes) * 100 : 0;
                                                return (
                                                    <div key={category.id} className="flex items-center gap-3">
                                                        <span className="text-sm font-medium text-gray-600 w-6">{index + 1}.</span>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between mb-1">
                                                                <span className="text-sm font-medium text-gray-900">{category.name}</span>
                                                                <span className="text-sm text-gray-600">{category.total_votes || 0} votes</span>
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
                                    <Calendar size={18} className="text-gray-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900">{formatDate(award?.ceremony_date)}</p>
                                        <p className="text-sm text-gray-500">Ceremony Date</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <AwardIcon size={18} className="text-gray-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900">{formatDate(award?.voting_start)}</p>
                                        <p className="text-sm text-gray-500">Voting Starts</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <AwardIcon size={18} className="text-gray-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900">{formatDate(award?.voting_end)}</p>
                                        <p className="text-sm text-gray-500">Voting Ends</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

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
                                        <p className="font-semibold text-gray-900">{award?.organizer_name}</p>
                                        <p className="text-sm text-gray-500">Organizer ID: #{award?.organizer_id}</p>
                                    </div>
                                </div>
                                {award?.organizer_email && (
                                    <a href={`mailto:${award.organizer_email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
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
                                    <span className="font-semibold text-gray-900">{award?.platform_fee_percentage || 5}%</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Metadata */}
                        <Card>
                            <CardContent className="p-4 text-sm text-gray-500 space-y-1">
                                <p>Created: {formatDate(award?.created_at)}</p>
                                <p>Updated: {formatDate(award?.updated_at)}</p>
                                <p className="font-mono text-xs break-all">Slug: {award?.slug}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === 'categories' && (
                <div className="space-y-4">
                    {award?.categories && award.categories.length > 0 ? (
                        award.categories.map((category) => (
                            <Card key={category.id}>
                                <CardHeader
                                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => toggleCategory(category.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {expandedCategories[category.id] ? (
                                                <ChevronDown size={20} className="text-gray-400" />
                                            ) : (
                                                <ChevronRight size={20} className="text-gray-400" />
                                            )}
                                            <div>
                                                <CardTitle className="text-lg">{category.name}</CardTitle>
                                                {category.description && (
                                                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-gray-900">{category.total_votes || 0} votes</p>
                                                <p className="text-xs text-gray-500">{formatCurrency(category.cost_per_vote)}/vote</p>
                                            </div>
                                            <Badge className="bg-blue-100 text-blue-800">
                                                {category.nominees?.length || 0} nominees
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                {expandedCategories[category.id] && (
                                    <CardContent>
                                        {category.nominees && category.nominees.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-gray-200">
                                                            <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                                                            <th className="text-left py-3 px-4 font-medium text-gray-600">Nominee</th>
                                                            <th className="text-right py-3 px-4 font-medium text-gray-600">Votes</th>
                                                            <th className="text-right py-3 px-4 font-medium text-gray-600">Revenue</th>
                                                            <th className="text-right py-3 px-4 font-medium text-gray-600">% of Votes</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {category.nominees
                                                            .sort((a, b) => (b.total_votes || 0) - (a.total_votes || 0))
                                                            .map((nominee, index) => {
                                                                const categoryTotalVotes = category.nominees.reduce((sum, n) => sum + (n.total_votes || 0), 0);
                                                                const votePercentage = categoryTotalVotes > 0 ? ((nominee.total_votes || 0) / categoryTotalVotes) * 100 : 0;
                                                                return (
                                                                    <tr key={nominee.id} className="border-b border-gray-100">
                                                                        <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                                                                        <td className="py-3 px-4">
                                                                            <div className="flex items-center gap-3">
                                                                                {nominee.image ? (
                                                                                    <img
                                                                                        src={nominee.image}
                                                                                        alt={nominee.name}
                                                                                        className="w-10 h-10 rounded-full object-cover"
                                                                                    />
                                                                                ) : (
                                                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                                        <Users size={16} className="text-gray-400" />
                                                                                    </div>
                                                                                )}
                                                                                <div>
                                                                                    <p className="font-medium text-gray-900">{nominee.name}</p>
                                                                                    {nominee.description && (
                                                                                        <p className="text-xs text-gray-500 truncate max-w-xs">{nominee.description}</p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-right py-3 px-4 font-semibold">{nominee.total_votes || 0}</td>
                                                                        <td className="text-right py-3 px-4 text-green-600 font-semibold">
                                                                            {formatCurrency((nominee.total_votes || 0) * category.cost_per_vote)}
                                                                        </td>
                                                                        <td className="text-right py-3 px-4">
                                                                            <div className="flex items-center justify-end gap-2">
                                                                                <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                                    <div
                                                                                        className="h-full bg-orange-500 rounded-full"
                                                                                        style={{ width: `${votePercentage}%` }}
                                                                                    />
                                                                                </div>
                                                                                <span className="text-sm">{votePercentage.toFixed(1)}%</span>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr className="bg-gray-50 font-semibold">
                                                            <td className="py-3 px-4" colSpan={2}>Total</td>
                                                            <td className="text-right py-3 px-4">
                                                                {category.nominees.reduce((sum, n) => sum + (n.total_votes || 0), 0)}
                                                            </td>
                                                            <td className="text-right py-3 px-4 text-green-600">
                                                                {formatCurrency(category.nominees.reduce((sum, n) => sum + ((n.total_votes || 0) * category.cost_per_vote), 0))}
                                                            </td>
                                                            <td className="text-right py-3 px-4">100%</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Users size={32} className="mx-auto text-gray-300 mb-2" />
                                                <p className="text-gray-500 text-sm">No nominees in this category</p>
                                            </div>
                                        )}
                                    </CardContent>
                                )}
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Trophy size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">No categories available</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {activeTab === 'settings' && (
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
                                            Save
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ceremony Date</label>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Voting Start</label>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Voting End</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image URL</label>
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

                    {/* Platform Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Platform Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
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
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        checked={formData.is_featured}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Featured Award</span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1 ml-8">Featured awards appear prominently on the homepage</p>
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
                                    Platform commission on voting revenue. Current fee: {formData.platform_fee_percentage}%
                                </p>
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm">
                                        <span className="text-gray-600">Estimated Platform Earnings:</span>
                                        <span className="font-bold text-green-600 ml-2">
                                            {formatCurrency((award?.total_revenue || 0) * formData.platform_fee_percentage / 100)}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AdminAwardDetail;
