import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    Users as UsersIcon,
    Search,
    Filter,
    Mail,
    Phone,
    Calendar,
    Shield,
    UserCheck,
    User,
    Loader2,
    AlertCircle,
    ChevronDown,
    RefreshCw,
    Eye,
    MoreVertical,
    CheckCircle,
    XCircle,
    Clock,
    Trash2,
    Key,
    UserCog,
    Ban
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

const Users = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // User management modals
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [userToManage, setUserToManage] = useState(null);
    const [openActionMenu, setOpenActionMenu] = useState(null);

    // Fetch users on component mount and when filters change
    useEffect(() => {
        fetchUsers();
    }, [selectedRole]);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const params = {};
            if (selectedRole) params.role = selectedRole;
            if (searchQuery) params.search = searchQuery;

            const response = await adminService.getUsers(params);

            if (response.success) {
                setUsers(response.data.users || []);
            } else {
                setError(response.message || 'Failed to fetch users');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.message || 'An error occurred while fetching users');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle search with debounce
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Trigger search on Enter key or button click
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    // Filter users based on search query (client-side filtering for instant feedback)
    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;

        const query = searchQuery.toLowerCase();
        return users.filter(user =>
            user.name?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.phone?.toLowerCase().includes(query)
        );
    }, [users, searchQuery]);

    // Calculate stats
    const stats = useMemo(() => {
        return {
            total: users.length,
            admins: users.filter(u => u.role === 'admin').length,
            organizers: users.filter(u => u.role === 'organizer').length,
            attendees: users.filter(u => u.role === 'attendee').length,
            pos: users.filter(u => u.role === 'pos').length,
            scanner: users.filter(u => u.role === 'scanner').length,
            active: users.filter(u => u.status === 'active').length,
            inactive: users.filter(u => u.status === 'inactive').length,
            suspended: users.filter(u => u.status === 'suspended').length,
        };
    }, [users]);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Never';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRoleBadge = (role) => {
        const variants = {
            admin: { variant: 'destructive', icon: Shield, label: 'Admin' },
            organizer: { variant: 'default', icon: UserCheck, label: 'Organizer' },
            attendee: { variant: 'secondary', icon: User, label: 'Attendee' },
            pos: { variant: 'outline', icon: User, label: 'POS' },
            scanner: { variant: 'outline', icon: User, label: 'Scanner' },
        };
        const config = variants[role] || variants.attendee;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                <Icon size={12} />
                {config.label}
            </Badge>
        );
    };

    const getStatusBadge = (status) => {
        const variants = {
            active: { variant: 'success', icon: CheckCircle, label: 'Active' },
            inactive: { variant: 'secondary', icon: Clock, label: 'Inactive' },
            suspended: { variant: 'destructive', icon: XCircle, label: 'Suspended' },
        };
        const config = variants[status] || variants.inactive;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                <Icon size={12} />
                {config.label}
            </Badge>
        );
    };

    const roles = [
        { value: '', label: 'All Roles' },
        { value: 'admin', label: 'Admins' },
        { value: 'organizer', label: 'Organizers' },
        { value: 'attendee', label: 'Attendees' },
        { value: 'pos', label: 'POS Users' },
        { value: 'scanner', label: 'Scanners' },
    ];

    // Loading state
    if (isLoading && users.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 mt-1">Manage all platform users</p>
                </div>
                <Button
                    onClick={() => fetchUsers()}
                    variant="outline"
                    disabled={isLoading}
                    className="flex items-center gap-2"
                >
                    <RefreshCw size={16} className={cn(isLoading && "animate-spin")} />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedRole('')}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <UsersIcon size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-xs text-gray-500">Total Users</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedRole('organizer')}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <UserCheck size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.organizers}</p>
                                <p className="text-xs text-gray-500">Organizers</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedRole('attendee')}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <User size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.attendees}</p>
                                <p className="text-xs text-gray-500">Attendees</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedRole('admin')}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <Shield size={20} className="text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
                                <p className="text-xs text-gray-500">Admins</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <CheckCircle size={20} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                                <p className="text-xs text-gray-500">Active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filter */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                            <div className="relative flex-1">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or phone..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                />
                            </div>
                            <Button type="submit" disabled={isLoading}>
                                Search
                            </Button>
                        </form>

                        {/* Role Filter */}
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Filter size={18} className="text-gray-500" />
                                <span>{roles.find(r => r.value === selectedRole)?.label || 'All Roles'}</span>
                                <ChevronDown size={16} className={cn("text-gray-500 transition-transform", isFilterOpen && "rotate-180")} />
                            </button>

                            {isFilterOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    {roles.map((role) => (
                                        <button
                                            key={role.value}
                                            onClick={() => {
                                                setSelectedRole(role.value);
                                                setIsFilterOpen(false);
                                            }}
                                            className={cn(
                                                "w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg",
                                                selectedRole === role.value && "bg-red-50 text-red-600"
                                            )}
                                        >
                                            {role.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="text-red-700">{error}</p>
                            <button
                                onClick={fetchUsers}
                                className="mt-2 text-sm font-medium text-red-600 hover:text-red-700"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Users ({filteredUsers.length})</span>
                        {selectedRole && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedRole('')}
                                className="text-gray-500"
                            >
                                Clear filter
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-12">
                            <UsersIcon size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">No users found</p>
                            {(searchQuery || selectedRole) && (
                                <Button
                                    variant="link"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedRole('');
                                    }}
                                    className="mt-2"
                                >
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">User</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Contact</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Role</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Joined</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Last Login</th>
                                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-semibold text-sm">
                                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Mail size={14} />
                                                        <span>{user.email}</span>
                                                    </div>
                                                    {user.phone && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Phone size={14} />
                                                            <span>{user.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                {getRoleBadge(user.role)}
                                            </td>
                                            <td className="py-4 px-4">
                                                {getStatusBadge(user.status)}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar size={14} />
                                                    <span>{formatDate(user.created_at)}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-sm text-gray-600">
                                                    {formatDate(user.last_login_at)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center gap-2 relative">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedUser(user)}
                                                        className="p-2"
                                                    >
                                                        <Eye size={16} />
                                                    </Button>
                                                    <div className="relative">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setOpenActionMenu(openActionMenu === user.id ? null : user.id)}
                                                            className="p-2"
                                                        >
                                                            <MoreVertical size={16} />
                                                        </Button>

                                                        {openActionMenu === user.id && (
                                                            <>
                                                                <div
                                                                    className="fixed inset-0 z-10"
                                                                    onClick={() => setOpenActionMenu(null)}
                                                                />
                                                                <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                                                    <div className="py-1">
                                                                        <button
                                                                            onClick={() => {
                                                                                setUserToManage(user);
                                                                                setShowResetPasswordModal(true);
                                                                                setOpenActionMenu(null);
                                                                            }}
                                                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700"
                                                                        >
                                                                            <Key size={16} className="text-blue-600" />
                                                                            Reset Password
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                setUserToManage(user);
                                                                                setShowRoleModal(true);
                                                                                setOpenActionMenu(null);
                                                                            }}
                                                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700"
                                                                        >
                                                                            <UserCog size={16} className="text-purple-600" />
                                                                            Change Role
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                setUserToManage(user);
                                                                                setShowStatusModal(true);
                                                                                setOpenActionMenu(null);
                                                                            }}
                                                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700"
                                                                        >
                                                                            <Ban size={16} className="text-orange-600" />
                                                                            Change Status
                                                                        </button>
                                                                        <div className="my-1 border-t border-gray-100" />
                                                                        <button
                                                                            onClick={() => {
                                                                                setUserToManage(user);
                                                                                setShowDeleteModal(true);
                                                                                setOpenActionMenu(null);
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* User Detail Modal */}
            {selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    formatDate={formatDate}
                    getRoleBadge={getRoleBadge}
                    getStatusBadge={getStatusBadge}
                />
            )}

            {/* Management Modals */}
            {showResetPasswordModal && userToManage && (
                <ResetPasswordModal
                    user={userToManage}
                    onClose={() => {
                        setShowResetPasswordModal(false);
                        setUserToManage(null);
                    }}
                    onSuccess={() => fetchUsers()}
                />
            )}

            {showRoleModal && userToManage && (
                <ChangeRoleModal
                    user={userToManage}
                    onClose={() => {
                        setShowRoleModal(false);
                        setUserToManage(null);
                    }}
                    onSuccess={() => fetchUsers()}
                />
            )}

            {showStatusModal && userToManage && (
                <ChangeStatusModal
                    user={userToManage}
                    onClose={() => {
                        setShowStatusModal(false);
                        setUserToManage(null);
                    }}
                    onSuccess={() => fetchUsers()}
                />
            )}

            {showDeleteModal && userToManage && (
                <DeleteUserModal
                    user={userToManage}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setUserToManage(null);
                    }}
                    onSuccess={() => fetchUsers()}
                />
            )}
        </div>
    );
};

// User Detail Modal Component
const UserDetailModal = ({ user, onClose, formatDate, getRoleBadge, getStatusBadge }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-linear-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-2xl">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-gray-500">{user.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                {getRoleBadge(user.role)}
                                {getStatusBadge(user.status)}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <XCircle size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">User ID</p>
                            <p className="font-semibold text-gray-900 mt-1">{user.id}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                            <p className="font-semibold text-gray-900 mt-1">{user.phone || 'Not provided'}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Email Verified</p>
                            <p className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                                {user.email_verified ? (
                                    <>
                                        <CheckCircle size={16} className="text-green-600" />
                                        Verified
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={16} className="text-red-600" />
                                        Not Verified
                                    </>
                                )}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">First Login</p>
                            <p className="font-semibold text-gray-900 mt-1">
                                {user.first_login ? 'Yes' : 'No'}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Activity</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Joined</span>
                                <span className="font-medium text-gray-900">{formatDate(user.created_at)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Last Login</span>
                                <span className="font-medium text-gray-900">{formatDate(user.last_login_at)}</span>
                            </div>
                            {user.last_login_ip && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Last Login IP</span>
                                    <span className="font-medium text-gray-900">{user.last_login_ip}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

UserDetailModal.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        role: PropTypes.string,
        status: PropTypes.string,
        email_verified: PropTypes.bool,
        first_login: PropTypes.bool,
        created_at: PropTypes.string,
        last_login_at: PropTypes.string,
        last_login_ip: PropTypes.string,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    formatDate: PropTypes.func.isRequired,
    getRoleBadge: PropTypes.func.isRequired,
    getStatusBadge: PropTypes.func.isRequired,
};

export default Users;
