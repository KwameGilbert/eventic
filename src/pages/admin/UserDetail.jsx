import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Calendar,
    Shield,
    Building2,
    MapPin,
    Ticket,
    Trophy,
    Vote,
    CheckCircle,
    XCircle,
    Loader2,
    AlertCircle,
    ExternalLink,
    Eye,
    TrendingUp,
    ShoppingBag,
    Wallet,
    Key,
    UserCog,
    Ban,
    Trash2,
    MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
import adminService from '../../services/adminService';
import {
    ResetPasswordModal,
    ChangeRoleModal,
    ChangeStatusModal,
    DeleteUserModal
} from './UserManagementModals';

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [roleData, setRoleData] = useState({});
    const [stats, setStats] = useState({});
    const [activeTab, setActiveTab] = useState('overview');

    // User management modals
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [openActionMenu, setOpenActionMenu] = useState(false);

    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await adminService.getUser(id);

            if (response.success) {
                setUserData(response.data.user);
                setRoleData(response.data.role_data || {});
                setStats(response.data.stats || {});
            } else {
                setError(response.message || 'Failed to fetch user details');
            }
        } catch (err) {
            console.error('Error fetching user:', err);
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return `GH₵${(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const getRoleBadge = (role) => {
        const variants = {
            admin: { variant: 'destructive', label: 'Admin' },
            super_admin: { variant: 'destructive', label: 'Super Admin' },
            organizer: { variant: 'info', label: 'Organizer' },
            attendee: { variant: 'success', label: 'Attendee' },
            support: { variant: 'warning', label: 'Support' },
        };
        const config = variants[role] || { variant: 'secondary', label: role };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const getStatusBadge = (status) => {
        const variants = {
            active: { variant: 'success', label: 'Active' },
            inactive: { variant: 'secondary', label: 'Inactive' },
            suspended: { variant: 'destructive', label: 'Suspended' },
            pending: { variant: 'warning', label: 'Pending' },
            published: { variant: 'success', label: 'Published' },
            draft: { variant: 'secondary', label: 'Draft' },
            completed: { variant: 'info', label: 'Completed' },
            paid: { variant: 'success', label: 'Paid' },
            used: { variant: 'info', label: 'Used' },
            processing: { variant: 'warning', label: 'Processing' },
            rejected: { variant: 'destructive', label: 'Rejected' },
        };
        const config = variants[status?.toLowerCase()] || { variant: 'secondary', label: status };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading user details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => navigate('/admin/users')} className="gap-2">
                    <ArrowLeft size={18} />
                    Back to Users
                </Button>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
                        <div>
                            <h3 className="font-semibold text-red-800 mb-1">Error Loading User</h3>
                            <p className="text-red-700">{error}</p>
                            <Button onClick={fetchUserDetails} className="mt-4">
                                Retry
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!userData) {
        return null;
    }

    const isOrganizer = userData.role === 'organizer';
    const isAttendee = userData.role === 'attendee';

    // Get tabs based on role
    const getTabs = () => {
        const baseTabs = [{ id: 'overview', label: 'Overview', icon: User }];

        if (isOrganizer) {
            return [
                ...baseTabs,
                { id: 'organization', label: 'Organization', icon: Building2 },
                { id: 'events', label: 'Events', icon: Calendar, count: roleData.events?.length || 0 },
                { id: 'awards', label: 'Awards', icon: Trophy, count: roleData.awards?.length || 0 },
                { id: 'payouts', label: 'Payouts', icon: Wallet, count: roleData.payouts?.length || 0 },
            ];
        }

        if (isAttendee) {
            return [
                ...baseTabs,
                { id: 'orders', label: 'Orders', icon: ShoppingBag, count: roleData.orders?.length || 0 },
                { id: 'tickets', label: 'Tickets', icon: Ticket, count: roleData.tickets?.length || 0 },
                { id: 'votes', label: 'Votes', icon: Vote, count: roleData.votes?.length || 0 },
            ];
        }

        return baseTabs;
    };

    const tabs = getTabs();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/admin/users')} className="gap-2">
                    <ArrowLeft size={18} />
                    Back
                </Button>
            </div>

            {/* User Header Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                            {userData.avatar ? (
                                <img src={userData.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                userData.name?.charAt(0)?.toUpperCase() || 'U'
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
                                {getRoleBadge(userData.role)}
                                {getStatusBadge(userData.status)}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Mail size={14} />
                                    {userData.email}
                                </div>
                                {userData.phone && (
                                    <div className="flex items-center gap-1">
                                        <Phone size={14} />
                                        {userData.phone}
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    Joined {formatDate(userData.created_at)}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        {isOrganizer && (
                            <div className="flex gap-4 md:gap-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_events || 0}</p>
                                    <p className="text-xs text-gray-500">Events</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_awards || 0}</p>
                                    <p className="text-xs text-gray-500">Awards</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.total_revenue)}</p>
                                    <p className="text-xs text-gray-500">Revenue</p>
                                </div>
                            </div>
                        )}

                        {isAttendee && (
                            <div className="flex gap-4 md:gap-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_tickets || 0}</p>
                                    <p className="text-xs text-gray-500">Tickets</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_orders || 0}</p>
                                    <p className="text-xs text-gray-500">Orders</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.total_spent)}</p>
                                    <p className="text-xs text-gray-500">Spent</p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="relative shrink-0">
                            <Button
                                variant="outline"
                                onClick={() => setOpenActionMenu(!openActionMenu)}
                                className="gap-2"
                            >
                                <MoreVertical size={16} />
                                Actions
                            </Button>

                            {openActionMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setOpenActionMenu(false)}
                                    />
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    setShowResetPasswordModal(true);
                                                    setOpenActionMenu(false);
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700"
                                            >
                                                <Key size={16} className="text-blue-600" />
                                                Reset Password
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowRoleModal(true);
                                                    setOpenActionMenu(false);
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700"
                                            >
                                                <UserCog size={16} className="text-purple-600" />
                                                Change Role
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowStatusModal(true);
                                                    setOpenActionMenu(false);
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700"
                                            >
                                                <Ban size={16} className="text-orange-600" />
                                                Change Status
                                            </button>
                                            <div className="my-1 border-t border-gray-100" />
                                            <button
                                                onClick={() => {
                                                    setShowDeleteModal(true);
                                                    setOpenActionMenu(false);
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm text-red-600"
                                            >
                                                <Trash2 size={16} />
                                                Delete User
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex gap-1 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors font-medium",
                                    activeTab === tab.id
                                        ? "border-red-600 text-red-600 bg-red-50/50"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                <Icon size={18} />
                                {tab.label}
                                {tab.count > 0 && (
                                    <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                                        {tab.count}
                                    </Badge>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-12 gap-6">
                        {/* User Details */}
                        <Card className="col-span-12 lg:col-span-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User size={20} className="text-gray-500" />
                                    Account Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">User ID</p>
                                        <p className="font-medium">#{userData.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{userData.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium">{userData.phone || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Role</p>
                                        <div className="mt-1">{getRoleBadge(userData.role)}</div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <div className="mt-1">{getStatusBadge(userData.status)}</div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email Verified</p>
                                        <p className="font-medium flex items-center gap-1">
                                            {userData.email_verified_at ? (
                                                <><CheckCircle size={14} className="text-green-600" /> Yes</>
                                            ) : (
                                                <><XCircle size={14} className="text-red-600" /> No</>
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Registered</p>
                                        <p className="font-medium">{formatDateTime(userData.created_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Last Login</p>
                                        <p className="font-medium">{formatDateTime(userData.last_login_at)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats Summary */}
                        <Card className="col-span-12 lg:col-span-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp size={20} className="text-gray-500" />
                                    Summary Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isOrganizer && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <p className="text-2xl font-bold text-blue-900">{stats.total_events || 0}</p>
                                            <p className="text-sm text-blue-700">Total Events</p>
                                        </div>
                                        <div className="p-4 bg-purple-50 rounded-lg">
                                            <p className="text-2xl font-bold text-purple-900">{stats.total_awards || 0}</p>
                                            <p className="text-sm text-purple-700">Total Awards</p>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <p className="text-2xl font-bold text-green-900">{stats.total_tickets_sold || 0}</p>
                                            <p className="text-sm text-green-700">Tickets Sold</p>
                                        </div>
                                        <div className="p-4 bg-orange-50 rounded-lg">
                                            <p className="text-2xl font-bold text-orange-900">{(stats.total_votes || 0).toLocaleString()}</p>
                                            <p className="text-sm text-orange-700">Total Votes</p>
                                        </div>
                                        <div className="p-4 bg-emerald-50 rounded-lg col-span-2">
                                            <p className="text-2xl font-bold text-emerald-900">{formatCurrency(stats.total_revenue)}</p>
                                            <p className="text-sm text-emerald-700">
                                                Total Revenue (Events: {formatCurrency(stats.events_revenue)} | Awards: {formatCurrency(stats.awards_revenue)})
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {isAttendee && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <p className="text-2xl font-bold text-blue-900">{stats.total_orders || 0}</p>
                                            <p className="text-sm text-blue-700">Total Orders</p>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <p className="text-2xl font-bold text-green-900">{stats.total_tickets || 0}</p>
                                            <p className="text-sm text-green-700">Total Tickets</p>
                                        </div>
                                        <div className="p-4 bg-purple-50 rounded-lg">
                                            <p className="text-2xl font-bold text-purple-900">{stats.events_attended || 0}</p>
                                            <p className="text-sm text-purple-700">Events Attended</p>
                                        </div>
                                        <div className="p-4 bg-orange-50 rounded-lg">
                                            <p className="text-2xl font-bold text-orange-900">{(stats.total_votes_purchased || 0).toLocaleString()}</p>
                                            <p className="text-sm text-orange-700">Votes Purchased</p>
                                        </div>
                                        <div className="p-4 bg-emerald-50 rounded-lg col-span-2">
                                            <p className="text-2xl font-bold text-emerald-900">{formatCurrency(stats.total_spent)}</p>
                                            <p className="text-sm text-emerald-700">Total Amount Spent</p>
                                        </div>
                                    </div>
                                )}

                                {!isOrganizer && !isAttendee && (
                                    <div className="text-center py-8 text-gray-500">
                                        <Shield size={48} className="mx-auto mb-4 text-gray-300" />
                                        <p>This is an {userData.role} account</p>
                                        <p className="text-sm">Account age: {stats.account_age_days || 0} days</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Balance Card for Organizers */}
                        {isOrganizer && roleData.balance && (
                            <Card className="col-span-12">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Wallet size={20} className="text-gray-500" />
                                        Financial Balance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <p className="text-sm text-green-700">Available Balance</p>
                                            <p className="text-xl font-bold text-green-900">
                                                {formatCurrency(roleData.balance.available_balance)}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-sm text-yellow-700">Pending Balance</p>
                                            <p className="text-xl font-bold text-yellow-900">
                                                {formatCurrency(roleData.balance.pending_balance)}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-sm text-blue-700">Total Earned</p>
                                            <p className="text-xl font-bold text-blue-900">
                                                {formatCurrency(roleData.balance.total_earned)}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                            <p className="text-sm text-gray-700">Total Withdrawn</p>
                                            <p className="text-xl font-bold text-gray-900">
                                                {formatCurrency(roleData.balance.total_withdrawn)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* ORGANIZATION TAB (Organizers only) */}
                {activeTab === 'organization' && isOrganizer && roleData.organizer && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 size={20} className="text-gray-500" />
                                Organization Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Business Name</p>
                                        <p className="font-medium text-lg">{roleData.organizer.business_name || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Business Type</p>
                                        <p className="font-medium">{roleData.organizer.business_type || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Description</p>
                                        <p className="text-gray-700">{roleData.organizer.description || 'No description'}</p>
                                    </div>
                                    {roleData.organizer.website && (
                                        <div>
                                            <p className="text-sm text-gray-500">Website</p>
                                            <a href={roleData.organizer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                {roleData.organizer.website}
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="font-medium flex items-center gap-1">
                                            <MapPin size={14} className="text-gray-400" />
                                            {[roleData.organizer.address, roleData.organizer.city, roleData.organizer.region, roleData.organizer.country]
                                                .filter(Boolean).join(', ') || 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Verification Status</p>
                                        <Badge variant={roleData.organizer.verification_status === 'verified' ? 'success' : 'warning'}>
                                            {roleData.organizer.verification_status || 'Pending'}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Featured</p>
                                        <Badge variant={roleData.organizer.is_featured ? 'success' : 'secondary'}>
                                            {roleData.organizer.is_featured ? 'Yes' : 'No'}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Registered</p>
                                        <p className="font-medium">{formatDate(roleData.organizer.created_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* EVENTS TAB (Organizers only) */}
                {activeTab === 'events' && isOrganizer && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar size={20} className="text-gray-500" />
                                Events ({roleData.events?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {roleData.events?.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>No events created yet</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-gray-50">
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Event</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Date</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Status</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Tickets</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Revenue</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {roleData.events?.map((event) => (
                                                <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                    <td className="py-4 px-4">
                                                        <p className="font-medium text-gray-900">{event.title}</p>
                                                        <p className="text-sm text-gray-500">{event.venue_name}</p>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-gray-600">
                                                        {formatDate(event.start_time)}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        {getStatusBadge(event.status)}
                                                    </td>
                                                    <td className="py-4 px-4 font-medium">{event.tickets_sold}</td>
                                                    <td className="py-4 px-4 font-semibold text-green-600">
                                                        {formatCurrency(event.revenue)}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <Link to={`/admin/events/${event.id}`}>
                                                            <Button variant="ghost" size="sm" className="gap-1">
                                                                <Eye size={14} /> View
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

                {/* AWARDS TAB (Organizers only) */}
                {activeTab === 'awards' && isOrganizer && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy size={20} className="text-gray-500" />
                                Awards ({roleData.awards?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {roleData.awards?.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Trophy size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>No awards created yet</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-gray-50">
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Award</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Ceremony</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Status</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Votes</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Revenue</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {roleData.awards?.map((award) => (
                                                <tr key={award.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                    <td className="py-4 px-4">
                                                        <p className="font-medium text-gray-900">{award.title}</p>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-gray-600">
                                                        {formatDate(award.ceremony_date)}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        {getStatusBadge(award.status)}
                                                    </td>
                                                    <td className="py-4 px-4 font-medium">{(award.total_votes || 0).toLocaleString()}</td>
                                                    <td className="py-4 px-4 font-semibold text-green-600">
                                                        {formatCurrency(award.revenue)}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <Link to={`/admin/awards/${award.id}`}>
                                                            <Button variant="ghost" size="sm" className="gap-1">
                                                                <Eye size={14} /> View
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

                {/* PAYOUTS TAB (Organizers only) */}
                {activeTab === 'payouts' && isOrganizer && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wallet size={20} className="text-gray-500" />
                                Payout Requests ({roleData.payouts?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {roleData.payouts?.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Wallet size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>No payout requests yet</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-gray-50">
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Date</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Source</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Method</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Amount</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {roleData.payouts?.map((payout) => (
                                                <tr key={payout.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                    <td className="py-4 px-4 text-sm text-gray-600">
                                                        {formatDate(payout.created_at)}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <p className="font-medium text-gray-900">{payout.source}</p>
                                                        <Badge variant="secondary" className="text-xs">{payout.payout_type}</Badge>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-gray-600">
                                                        {payout.payment_method === 'mobile_money' ? 'Mobile Money' : 'Bank Transfer'}
                                                    </td>
                                                    <td className="py-4 px-4 font-semibold text-green-600">
                                                        {formatCurrency(payout.amount)}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        {getStatusBadge(payout.status)}
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

                {/* ORDERS TAB (Attendees only) */}
                {activeTab === 'orders' && isAttendee && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingBag size={20} className="text-gray-500" />
                                Orders ({roleData.orders?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {roleData.orders?.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>No orders yet</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-gray-50">
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Order</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Date</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Events</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Items</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Amount</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {roleData.orders?.map((order) => (
                                                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                    <td className="py-4 px-4">
                                                        <p className="font-medium text-gray-900">{order.order_number}</p>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-gray-600">
                                                        {formatDate(order.created_at)}
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-gray-600">
                                                        {order.events?.join(', ')}
                                                    </td>
                                                    <td className="py-4 px-4">{order.items_count}</td>
                                                    <td className="py-4 px-4 font-semibold">
                                                        {formatCurrency(order.total_amount)}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        {getStatusBadge(order.status)}
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

                {/* TICKETS TAB (Attendees only) */}
                {activeTab === 'tickets' && isAttendee && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Ticket size={20} className="text-gray-500" />
                                Tickets ({roleData.tickets?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {roleData.tickets?.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Ticket size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>No tickets yet</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-gray-50">
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Ticket Code</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Event</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Event Date</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Type</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Status</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Checked In</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {roleData.tickets?.map((ticket) => (
                                                <tr key={ticket.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                    <td className="py-4 px-4">
                                                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{ticket.ticket_code}</code>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <p className="font-medium text-gray-900">{ticket.event_title}</p>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-gray-600">
                                                        {formatDate(ticket.event_date)}
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-gray-600">{ticket.ticket_type}</td>
                                                    <td className="py-4 px-4">
                                                        {getStatusBadge(ticket.status)}
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-gray-600">
                                                        {ticket.checked_in_at ? formatDateTime(ticket.checked_in_at) : '-'}
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

                {/* VOTES TAB (Attendees only) */}
                {activeTab === 'votes' && isAttendee && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Vote size={20} className="text-gray-500" />
                                Vote Purchases ({roleData.votes?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {roleData.votes?.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Vote size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>No vote purchases yet</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-gray-50">
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Date</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Award</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Category</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Nominee</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Votes</th>
                                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {roleData.votes?.map((vote) => (
                                                <tr key={vote.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                    <td className="py-4 px-4 text-sm text-gray-600">
                                                        {formatDate(vote.created_at)}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <p className="font-medium text-gray-900">{vote.award_title}</p>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-gray-600">{vote.category_name}</td>
                                                    <td className="py-4 px-4 text-sm text-gray-600">{vote.nominee_name}</td>
                                                    <td className="py-4 px-4 font-medium">{vote.number_of_votes}</td>
                                                    <td className="py-4 px-4 font-semibold text-green-600">
                                                        {formatCurrency(vote.amount)}
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
            </div>

            {/* User Management Modals */}
            {showResetPasswordModal && userData && (
                <ResetPasswordModal
                    user={userData}
                    onClose={() => setShowResetPasswordModal(false)}
                    onSuccess={() => fetchUserDetails()}
                />
            )}

            {showRoleModal && userData && (
                <ChangeRoleModal
                    user={userData}
                    onClose={() => setShowRoleModal(false)}
                    onSuccess={() => fetchUserDetails()}
                />
            )}

            {showStatusModal && userData && (
                <ChangeStatusModal
                    user={userData}
                    onClose={() => setShowStatusModal(false)}
                    onSuccess={() => fetchUserDetails()}
                />
            )}

            {showDeleteModal && userData && (
                <DeleteUserModal
                    user={userData}
                    onClose={() => setShowDeleteModal(false)}
                    onSuccess={() => navigate('/admin/users')}
                />
            )}
        </div>
    );
};

export default UserDetail;
