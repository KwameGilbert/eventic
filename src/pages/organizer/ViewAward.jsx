import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    DollarSign,
    Trophy,
    Edit,
    Trash2,
    Share2,
    ExternalLink,
    MoreVertical,
    Globe,
    Phone,
    Facebook,
    Instagram,
    Twitter,
    Video,
    Map,
    Users,
    Award as AwardIcon,
    Loader2,
    AlertTriangle,
    Image as ImageIcon,
    Plus,
    CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import awardService from '../../services/awardService';
import categoryService from '../../services/categoryService';
import nomineeService from '../../services/nomineeService';
import CategoryModal from '../../components/organizer/awards/CategoryModal';
import NomineeModal from '../../components/organizer/awards/NomineeModal';

const ViewAward = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [openDropdown, setOpenDropdown] = useState(false);

    // Loading and error states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Award data from API
    const [award, setAward] = useState(null);

    // Modal states
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [nomineeModalOpen, setNomineeModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedNominee, setSelectedNominee] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);

    // Drag and drop states
    const [draggedCategory, setDraggedCategory] = useState(null);
    const [draggedNominee, setDraggedNominee] = useState(null);

    // Fetch award data
    useEffect(() => {
        const fetchAwardDetails = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await awardService.getAwardDetails(id);

                if (response.success && response.data) {
                    setAward(response.data);
                } else {
                    setError(response.message || 'Failed to load award details');
                }
            } catch (err) {
                console.error('Error fetching award details:', err);
                setError(err.message || 'An error occurred while loading award details');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchAwardDetails();
        }
    }, [id]);

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'published': return 'success';
            case 'draft': return 'warning';
            case 'completed': return 'secondary';
            case 'closed': return 'destructive';
            default: return 'secondary';
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Refresh award data
    const refreshAwardData = async () => {
        try {
            const response = await awardService.getAwardDetails(id);
            if (response.success && response.data) {
                setAward(response.data);
            }
        } catch (err) {
            console.error('Error refreshing award:', err);
        }
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
        refreshAwardData();
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm('Are you sure you want to delete this category? All nominees will be deleted too.')) {
            return;
        }
        try {
            await categoryService.delete(categoryId);
            refreshAwardData();
        } catch (err) {
            console.error('Error deleting category:', err);
            alert('Failed to delete category');
        }
    };

    // Nominee modal handlers
    const openNomineeModal = (categoryId, nominee = null) => {
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
        refreshAwardData();
    };

    const handleDeleteNominee = async (nomineeId) => {
        if (!window.confirm('Are you sure you want to delete this nominee?')) {
            return;
        }
        try {
            await nomineeService.delete(nomineeId);
            refreshAwardData();
        } catch (err) {
            console.error('Error deleting nominee:', err);
            alert('Failed to delete nominee');
        }
    };

    // Drag and drop handlers for categories
    const handleCategoryDragStart = (e, category) => {
        setDraggedCategory(category);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleCategoryDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleCategoryDrop = async (e, targetCategory) => {
        e.preventDefault();
        if (!draggedCategory || draggedCategory.id === targetCategory.id) {
            setDraggedCategory(null);
            return;
        }

        const categories = [...award.categories];
        const draggedIndex = categories.findIndex(c => c.id === draggedCategory.id);
        const targetIndex = categories.findIndex(c => c.id === targetCategory.id);

        categories.splice(draggedIndex, 1);
        categories.splice(targetIndex, 0, draggedCategory);

        const reorderedCategories = categories.map((cat, index) => ({
            id: cat.id,
            display_order: index
        }));

        try {
            await categoryService.reorder(id, reorderedCategories);
            refreshAwardData();
        } catch (err) {
            console.error('Error reordering categories:', err);
        }
        setDraggedCategory(null);
    };

    // Drag and drop handlers for nominees
    const handleNomineeDragStart = (e, nominee) => {
        setDraggedNominee(nominee);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleNomineeDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleNomineeDrop = async (e, targetNominee, categoryId) => {
        e.preventDefault();
        if (!draggedNominee || draggedNominee.id === targetNominee.id) {
            setDraggedNominee(null);
            return;
        }

        const category = award.categories.find(c => c.id === categoryId);
        if (!category) return;

        const nominees = [...category.nominees];
        const draggedIndex = nominees.findIndex(n => n.id === draggedNominee.id);
        const targetIndex = nominees.findIndex(n => n.id === targetNominee.id);

        nominees.splice(draggedIndex, 1);
        nominees.splice(targetIndex, 0, draggedNominee);

        const reorderedNominees = nominees.map((nom, index) => ({
            id: nom.id,
            display_order: index
        }));

        try {
            await nomineeService.reorder(categoryId, reorderedNominees);
            refreshAwardData();
        } catch (err) {
            console.error('Error reordering nominees:', err);
        }
        setDraggedNominee(null);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-500">Loading award details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md w-full">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Award</h3>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <Button onClick={() => navigate('/organizer/awards')}>
                            Back to Awards
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // No award found
    if (!award) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md w-full">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Award Not Found</h3>
                        <p className="text-gray-500 mb-4">The award you are looking for does not exist.</p>
                        <Button onClick={() => navigate('/organizer/awards')}>
                            Back to Awards
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/organizer/awards')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">{award.title}</h1>
                            <Badge variant={getStatusStyle(award.status)}>{award.status?.toUpperCase()}</Badge>
                            {award.voting_status && (
                                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                    <AwardIcon size={12} className="mr-1" />
                                    {award.voting_status}
                                </Badge>
                            )}
                        </div>
                        <p className="text-gray-500 mt-1">Award ID: #{award.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Share2 size={16} />
                        Share
                    </Button>
                    <Link to={`/organizer/awards/${award.id}/edit`}>
                        <Button size="sm" className="gap-2">
                            <Edit size={16} />
                            Edit Award
                        </Button>
                    </Link>
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setOpenDropdown(!openDropdown)}
                        >
                            <MoreVertical size={16} />
                        </Button>
                        {openDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                                <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <ExternalLink size={14} />
                                    View Public Page
                                </button>
                                <hr className="my-1" />
                                <button className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2">
                                    <Trash2 size={14} />
                                    Delete Award
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <Trophy size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{award.stats?.total_categories || 0}</p>
                                <p className="text-xs text-gray-500">Categories</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Users size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{award.stats?.total_nominees || 0}</p>
                                <p className="text-xs text-gray-500">Nominees</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <AwardIcon size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{award.stats?.total_votes?.toLocaleString() || 0}</p>
                                <p className="text-xs text-gray-500">Total Votes</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <DollarSign size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">GH₵{award.stats?.revenue?.toLocaleString() || 0}</p>
                                <p className="text-xs text-gray-500">Revenue</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <Users size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{award.stats?.unique_voters?.toLocaleString() || 0}</p>
                                <p className="text-xs text-gray-500">Unique Voters</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                                <ImageIcon size={20} className="text-teal-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{award.views?.toLocaleString() || 0}</p>
                                <p className="text-xs text-gray-500">Views</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Column */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    {/* Main Image */}
                    <Card className="overflow-hidden">
                        {award.image ? (
                            <img
                                src={award.image}
                                alt={award.title}
                                className="w-full h-64 object-cover"
                            />
                        ) : (
                            <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                                <ImageIcon size={48} className="text-gray-300" />
                            </div>
                        )}
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">About This Award</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 whitespace-pre-line">{award.description || 'No description provided.'}</p>
                        </CardContent>
                    </Card>

                    {/* Award Video */}
                    {award.videoUrl && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Video size={20} className="text-orange-500" />
                                    Award Video
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                                    <iframe
                                        src={award.videoUrl.includes('youtu.be')
                                            ? award.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/').split('?')[0]
                                            : award.videoUrl.includes('youtube.com/watch')
                                                ? award.videoUrl.replace('watch?v=', 'embed/')
                                                : award.videoUrl
                                        }
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="Award Video"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Categories & Nominees */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Trophy size={20} className="text-orange-500" />
                                Categories & Nominees
                            </CardTitle>
                            <Button
                                size="sm"
                                className="gap-2"
                                onClick={() => openCategoryModal()}
                            >
                                <Plus size={16} />
                                Add Category
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {award.categories && award.categories.length > 0 ? (
                                award.categories.map((category) => (
                                    <div
                                        key={category.id}
                                        draggable
                                        onDragStart={(e) => handleCategoryDragStart(e, category)}
                                        onDragOver={handleCategoryDragOver}
                                        onDrop={(e) => handleCategoryDrop(e, category)}
                                        className={`border border-gray-200 rounded-lg p-4 cursor-move transition-all ${draggedCategory?.id === category.id ? 'opacity-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{category.name}</h4>
                                                {category.description && (
                                                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                                                )}
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-sm text-gray-500">
                                                        Cost per vote: <span className="font-semibold text-gray-900">GH₵{category.cost_per_vote}</span>
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        Total votes: <span className="font-semibold text-gray-900">{category.total_votes || 0}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="gap-2"
                                                    onClick={() => openNomineeModal(category.id)}
                                                >
                                                    <Plus size={14} />
                                                    Add Nominee
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openCategoryModal(category)}
                                                >
                                                    <Edit size={14} />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDeleteCategory(category.id)}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Nominees */}
                                        {category.nominees && category.nominees.length > 0 ? (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                                                {category.nominees.map((nominee) => (
                                                    <div
                                                        key={nominee.id}
                                                        draggable
                                                        onDragStart={(e) => handleNomineeDragStart(e, nominee)}
                                                        onDragOver={handleNomineeDragOver}
                                                        onDrop={(e) => handleNomineeDrop(e, nominee, category.id)}
                                                        className={`group relative border border-gray-100 rounded-lg p-3 hover:border-orange-200 transition-colors cursor-move ${draggedNominee?.id === nominee.id ? 'opacity-50' : ''
                                                            }`}
                                                    >
                                                        {/* Action buttons */}
                                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                            <button
                                                                onClick={() => openNomineeModal(category.id, nominee)}
                                                                className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
                                                                title="Edit"
                                                            >
                                                                <Edit size={12} className="text-gray-600" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteNominee(nominee.id)}
                                                                className="p-1 bg-white rounded shadow-sm hover:bg-red-50"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={12} className="text-red-600" />
                                                            </button>
                                                        </div>
                                                        {nominee.image && (
                                                            <img
                                                                src={nominee.image}
                                                                alt={nominee.name}
                                                                className="w-full h-24 object-cover rounded-lg mb-2"
                                                            />
                                                        )}
                                                        <h5 className="font-medium text-sm text-gray-900">{nominee.name}</h5>
                                                        {nominee.total_votes !== undefined && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {nominee.total_votes} votes
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-500">No nominees added yet</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Trophy size={32} className="mx-auto text-gray-300 mb-2" />
                                    <p className="text-gray-500 text-sm">No categories created yet</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Votes */}
                    {award.recent_votes && award.recent_votes.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Users size={20} className="text-orange-500" />
                                    Recent Votes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {award.recent_votes.map((vote) => (
                                        <div key={vote.id} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{vote.voter}</p>
                                                <p className="text-xs text-gray-500">voted for <span className="font-medium">{vote.nominee}</span></p>
                                                <p className="text-xs text-gray-400">{vote.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-orange-600">{vote.votes} votes</p>
                                                <p className="text-xs text-gray-500">GH₵{vote.amount}</p>
                                                <p className="text-xs text-gray-400">{vote.created_at}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Vote Analytics */}
                    {award.vote_analytics && award.vote_analytics.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <AwardIcon size={20} className="text-orange-500" />
                                    Vote Analytics (Last 7 Days)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {award.vote_analytics.map((day, index) => {
                                        const maxVotes = Math.max(...award.vote_analytics.map(d => d.votes));
                                        const percentage = maxVotes > 0 ? (day.votes / maxVotes) * 100 : 0;
                                        return (
                                            <div key={index} className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-gray-600 w-8">{day.day}</span>
                                                <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                                                    <div
                                                        className="bg-orange-500 h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                                                        {day.votes}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Contact & Social */}
                    {(award.contact || award.socialMedia || award.phone || award.website || award.facebook || award.twitter || award.instagram) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Globe size={20} className="text-orange-500" />
                                    Contact & Social Media
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {(award.contact?.phone || award.phone) && (
                                        <a href={`tel:${award.contact?.phone || award.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500">
                                            <Phone size={16} />
                                            {award.contact?.phone || award.phone}
                                        </a>
                                    )}
                                    {(award.contact?.website || award.website) && (
                                        <a href={`http://${award.contact?.website || award.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500">
                                            <Globe size={16} />
                                            Website
                                        </a>
                                    )}
                                    {(award.socialMedia?.facebook || award.facebook) && (
                                        <a href={award.socialMedia?.facebook || award.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                                            <Facebook size={16} />
                                            Facebook
                                        </a>
                                    )}
                                    {(award.socialMedia?.twitter || award.twitter) && (
                                        <a href={award.socialMedia?.twitter || award.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-sky-500">
                                            <Twitter size={16} />
                                            Twitter / X
                                        </a>
                                    )}
                                    {(award.socialMedia?.instagram || award.instagram) && (
                                        <a href={award.socialMedia?.instagram || award.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-pink-600">
                                            <Instagram size={16} />
                                            Instagram
                                        </a>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* Award Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Award Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Calendar size={18} className="text-gray-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900">{formatDate(award.ceremony_date)}</p>
                                    <p className="text-sm text-gray-500">Ceremony Date</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-gray-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900">{award.venue || '—'}</p>
                                    <p className="text-sm text-gray-500">
                                        {[
                                            award.location,
                                            award.city,
                                            award.region,
                                            award.country
                                        ].filter(Boolean).join(', ') || '—'}
                                    </p>
                                    {award.mapUrl && (
                                        <a
                                            href={award.mapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-orange-500 hover:underline flex items-center gap-1 mt-1"
                                        >
                                            <Map size={14} />
                                            View on Maps
                                        </a>
                                    )}
                                </div>
                            </div>
                            {award.voting_start && award.voting_end && (
                                <>
                                    <div className="flex items-start gap-3">
                                        <AwardIcon size={18} className="text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900">{new Date(award.voting_start).toLocaleDateString()}</p>
                                            <p className="text-sm text-gray-500">Voting Starts</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <AwardIcon size={18} className="text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900">{new Date(award.voting_end).toLocaleDateString()}</p>
                                            <p className="text-sm text-gray-500">Voting Ends</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Organizer Info */}
                    {award.organizer && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Organized By</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-3">
                                    {award.organizer.avatar && (
                                        <img
                                            src={award.organizer.avatar}
                                            alt={award.organizer.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-gray-900">{award.organizer.name}</p>
                                            {award.organizer.verified && (
                                                <CheckCircle size={14} className="text-blue-500" />
                                            )}
                                        </div>
                                        {award.organizer.bio && (
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-3">{award.organizer.bio}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link to={`/organizer/awards/${award.id}/edit`} className="block">
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <Edit size={16} />
                                    Edit Award
                                </Button>
                            </Link>
                            <Button variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                                <Trash2 size={16} />
                                Delete Award
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    <Card>
                        <CardContent className="p-4 text-sm text-gray-500 space-y-1">
                            <p>Created: {formatDate(award.created_at)}</p>
                            <p>Last updated: {formatDate(award.updated_at)}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Modals */}
            <CategoryModal
                isOpen={categoryModalOpen}
                onClose={closeCategoryModal}
                awardId={id}
                category={selectedCategory}
                onSuccess={handleCategorySuccess}
            />

            <NomineeModal
                isOpen={nomineeModalOpen}
                onClose={closeNomineeModal}
                categoryId={activeCategory}
                nominee={selectedNominee}
                onSuccess={handleNomineeSuccess}
            />
        </div>
    );
};

export default ViewAward;
