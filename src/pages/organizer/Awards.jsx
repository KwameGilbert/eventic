import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    Calendar,
    MapPin,
    Award as AwardIcon,
    Trophy,
    TrendingUp,
    LayoutGrid,
    List,
    Loader2,
    AlertTriangle,
    Users
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
import awardService from '../../services/awardService';

const Awards = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Data state
    const [awards, setAwards] = useState([]);
    const [stats, setStats] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Icon mapping for stats
    const iconMap = {
        'Trophy': Trophy,
        'Calendar': Calendar,
        'TrendingUp': TrendingUp,
        'Edit': Edit,
        'Award': AwardIcon,
    };

    // Fetch awards data on component mount
    useEffect(() => {
        const fetchAwards = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await awardService.getAwardsData();

                if (response.success && response.data) {
                    setAwards(response.data.awards || []);
                    setStats(response.data.stats || []);
                    setTabs(response.data.tabs || []);
                } else {
                    setError(response.message || 'Failed to fetch awards');
                }
            } catch (err) {
                setError(err.message || 'An error occurred while fetching awards');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAwards();
    }, []);

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'published': return 'success';      // Green
            case 'draft': return 'warning';          // Yellow/Orange
            case 'voting open': return 'info';       // Blue (computed from voting dates)
            case 'completed': return 'secondary';    // Gray
            case 'closed': return 'destructive';     // Red
            case 'cancelled': return 'destructive';  // Red
            default: return 'secondary';             // Gray
        }
    };

    const filteredAwards = awards.filter(award => {
        // Special handling for "Voting Open" tab - check voting_status instead of status
        let matchesTab;
        if (activeTab === 'all') {
            matchesTab = true;
        } else if (activeTab.toLowerCase() === 'voting open') {
            // For "Voting Open" tab, check the voting_status field
            matchesTab = award.voting_status && award.voting_status.toLowerCase() === 'voting open';
        } else {
            // For other tabs (published, draft, completed, closed), check the status field
            const normalizedStatus = award.status.toLowerCase();
            const normalizedTab = activeTab.toLowerCase();
            matchesTab = normalizedStatus === normalizedTab;
        }

        const matchesSearch = award.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (award.venue_name && award.venue_name.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesTab && matchesSearch;
    });

    const toggleDropdown = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdown && !event.target.closest('.dropdown-container')) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdown]);


    // Loading State
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading awards...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md w-full">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Awards</h3>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()}>Try Again</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Grid View Component
    const GridView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAwards.map((award) => (
                <Card
                    key={award.id}
                    className={cn("group relative cursor-pointer", openDropdown === award.id ? "overflow-visible z-50" : "overflow-hidden")}
                    onClick={() => navigate(`/organizer/awards/${award.id}`)}
                >
                    {/* Award Banner */}
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src={award.banner_image || award.image}
                            alt={award.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                            <Badge variant={getStatusStyle(award.status)}>
                                {award.status}
                            </Badge>
                            {award.voting_status && (
                                <Badge variant="secondary" className="bg-orange-500/90 backdrop-blur-sm text-white">
                                    <AwardIcon size={12} className="mr-1" />
                                    {award.voting_status}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Actions Dropdown */}
                    <div className="absolute top-3 right-3 z-50" onClick={(e) => e.stopPropagation()}>
                        <div className="relative dropdown-container">
                            <button
                                onClick={() => toggleDropdown(award.id)}
                                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                            >
                                <MoreVertical size={16} className="text-gray-700" />
                            </button>
                            {openDropdown === award.id && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                                    <Link
                                        to={`/organizer/awards/${award.id}`}
                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Eye size={14} />
                                        View Details
                                    </Link>
                                    <Link
                                        to={`/organizer/awards/${award.id}/edit`}
                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Edit size={14} />
                                        Edit Award
                                    </Link>

                                    <hr className="my-1 text-gray-200" />
                                    <button className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2">
                                        <Trash2 size={14} />
                                        Delete Award
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Award Content */}
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-1">
                            {award.title}
                        </h3>

                        <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar size={14} />
                                <span>{award.ceremony_date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin size={14} />
                                <span className="truncate">{award.venue_name}</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <Trophy size={14} />
                                    <span>{award.categories_count || 0} categories</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <Users size={14} />
                                    <span>{award.total_votes || 0} votes</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Revenue</span>
                                <span className="text-sm font-semibold text-orange-500">
                                    GH₵{(award.revenue || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    // Table/List View Component
    const ListView = () => (
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[210px]">Award</th>
                            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[120px]">Ceremony Date</th>
                            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[120px]">Venue</th>
                            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Status</th>
                            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Categories</th>
                            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Votes</th>
                            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Revenue</th>
                            <th className="text-right py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[120px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAwards.map((award) => (
                            <tr
                                key={award.id}
                                className={cn("border-b border-gray-50 hover:bg-gray-50 transition-colors group cursor-pointer")}
                                onClick={() => navigate(`/organizer/awards/${award.id}`)}
                            >
                                {/* Award */}
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={award.banner_image || award.image}
                                            alt={award.title}
                                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-gray-900 truncate group-hover:text-orange-500 transition-colors" title={award.title}>
                                                {award.title}
                                            </p>
                                            <p className="text-xs text-gray-500">Award Ceremony</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Ceremony Date */}
                                <td className="py-4 px-4">
                                    <p className="text-sm text-gray-900 whitespace-nowrap">{award.ceremony_date}</p>
                                </td>

                                {/* Venue */}
                                <td className="py-4 px-4">
                                    <p className="text-sm text-gray-600 truncate" title={award.venue_name}>{award.venue_name}</p>
                                </td>

                                {/* Status */}
                                <td className="py-4 px-4">
                                    <Badge variant={getStatusStyle(award.status)}>
                                        {award.status}
                                    </Badge>
                                </td>

                                {/* Categories */}
                                <td className="py-4 px-4">
                                    <span className="text-sm text-gray-900">
                                        {award.categories_count || 0}
                                    </span>
                                </td>

                                {/* Votes */}
                                <td className="py-4 px-4">
                                    <span className="text-sm text-gray-900">
                                        {award.total_votes || 0}
                                    </span>
                                </td>

                                {/* Revenue */}
                                <td className="py-4 px-4">
                                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                        GH₵{(award.revenue || 0).toLocaleString()}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-end gap-1">
                                        <Link
                                            to={`/organizer/awards/${award.id}`}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <Link
                                            to={`/organizer/awards/${award.id}/edit`}
                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Edit Award"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => {/* Handle delete */ }}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Award"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>
        </Card>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Awards</h1>
                    <p className="text-gray-500 mt-1">Manage and monitor all your awards</p>
                </div>
                <Link to="/organizer/awards/create">
                    <Button className="gap-2">
                        <Plus size={18} />
                        Create Award
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = iconMap[stat.icon] || Trophy;
                    return (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${stat.color}15` }}
                                    >
                                        <Icon size={20} style={{ color: stat.color }} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-xs text-gray-500">{stat.label}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Filters & Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Tabs */}
                        <div className="flex gap-1 overflow-x-auto pb-2 lg:pb-0">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors",
                                        activeTab === tab.id
                                            ? "bg-orange-500 text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                    )}
                                >
                                    {tab.label}
                                    <span className={cn(
                                        "ml-2 px-1.5 py-0.5 text-xs rounded-full",
                                        activeTab === tab.id
                                            ? "bg-white/20 text-white"
                                            : "bg-gray-100 text-gray-600"
                                    )}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search, View Toggle & Filter */}
                        <div className="flex gap-2">
                            <div className="relative flex-1 lg:w-64">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search awards..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                />
                            </div>

                            {/* View Toggle */}
                            <div className="flex bg-gray-100 rounded-lg p-0.5">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        "p-2 rounded-md transition-all",
                                        viewMode === 'grid'
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                    )}
                                    title="Grid view"
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        "p-2 rounded-md transition-all",
                                        viewMode === 'list'
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                    )}
                                    title="List view"
                                >
                                    <List size={18} />
                                </button>
                            </div>

                            <Button variant="outline" size="icon">
                                <Filter size={16} />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Awards View */}
            {viewMode === 'grid' ? <GridView /> : <ListView />}

            {/* Empty State */}
            {filteredAwards.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy size={24} className="text-orange-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No awards found</h3>
                        <p className="text-gray-500 mb-4">
                            {searchQuery
                                ? "Try adjusting your search terms"
                                : "Get started by creating your first award"
                            }
                        </p>
                        <Link to="/organizer/awards/create">
                            <Button className="gap-2">
                                <Plus size={18} />
                                Create Award
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Awards;
