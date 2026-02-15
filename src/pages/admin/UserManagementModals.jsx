import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Trash2, Key, UserCog, Ban, CheckCircle, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import adminService from '../../services/adminService';
import { showSuccess, showError } from '../../utils/toast';

/**
 * User Management Modals and Actions Component
 * Handles password reset, role change, status change, and user deletion
 */

// Password Reset Modal
export const ResetPasswordModal = ({ user, onClose, onSuccess }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        try {
            setIsLoading(true);
            const response = await adminService.resetUserPassword(user.id, password);

            if (response.success) {
                showSuccess('Password reset successfully. User will be required to change it on next login.');
                onSuccess();
                onClose();
            } else {
                showError(response.message || 'Failed to reset password');
            }
        } catch (err) {
            showError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Key size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
                            <p className="text-sm text-gray-500">{user.name}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            placeholder="Enter new password"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            placeholder="Confirm new password"
                            required
                        />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                            The user will be required to change this password on their next login.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

ResetPasswordModal.propTypes = {
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

// Change Role Modal
export const ChangeRoleModal = ({ user, onClose, onSuccess }) => {
    const [selectedRole, setSelectedRole] = useState(user.role);
    const [isLoading, setIsLoading] = useState(false);

    const roles = [
        { value: 'super_admin', label: 'Super Admin', description: 'Maximum platform access and control' },
        { value: 'admin', label: 'Admin', description: 'Full platform access' },
        { value: 'organizer', label: 'Organizer', description: 'Can create events and awards' },
        { value: 'attendee', label: 'Attendee', description: 'Can purchase tickets and vote' },
        { value: 'pos', label: 'POS', description: 'Point of sale access' },
        { value: 'scanner', label: 'Scanner', description: 'Ticket scanning access' },
    ];

    const handleSubmit = async () => {
        if (selectedRole === user.role) {
            showError('Please select a different role');
            return;
        }

        try {
            setIsLoading(true);
            const response = await adminService.updateUserRole(user.id, selectedRole);

            if (response.success) {
                showSuccess('User role updated successfully');
                onSuccess();
                onClose();
            } else {
                showError(response.message || 'Failed to update role');
            }
        } catch (err) {
            showError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                            <UserCog size={24} className="text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Change Role</h2>
                            <p className="text-sm text-gray-500">{user.name}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-3">
                    {roles.map((role) => (
                        <button
                            key={role.value}
                            onClick={() => setSelectedRole(role.value)}
                            className={`w-full text-left p-4 border-2 rounded-lg transition-all ${selectedRole === role.value
                                    ? 'border-purple-600 bg-purple-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900">{role.label}</p>
                                    <p className="text-sm text-gray-500">{role.description}</p>
                                </div>
                                {selectedRole === role.value && (
                                    <CheckCircle size={20} className="text-purple-600" />
                                )}
                            </div>
                        </button>
                    ))}

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="flex-1"
                            disabled={isLoading || selectedRole === user.role}
                        >
                            {isLoading ? 'Updating...' : 'Update Role'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ChangeRoleModal.propTypes = {
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

// Change Status Modal
export const ChangeStatusModal = ({ user, onClose, onSuccess }) => {
    const [selectedStatus, setSelectedStatus] = useState(user.status);
    const [isLoading, setIsLoading] = useState(false);

    const statuses = [
        { value: 'active', label: 'Active', description: 'User can access the platform', icon: CheckCircle, color: 'green' },
        { value: 'inactive', label: 'Inactive', description: 'User account is deactivated', icon: Ban, color: 'gray' },
        { value: 'suspended', label: 'Suspended', description: 'User is temporarily banned', icon: X, color: 'red' },
    ];

    const handleSubmit = async () => {
        if (selectedStatus === user.status) {
            showError('Please select a different status');
            return;
        }

        try {
            setIsLoading(true);
            const response = await adminService.updateUserStatus(user.id, selectedStatus);

            if (response.success) {
                showSuccess('User status updated successfully');
                onSuccess();
                onClose();
            } else {
                showError(response.message || 'Failed to update status');
            }
        } catch (err) {
            showError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                            <UserCog size={24} className="text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Change Status</h2>
                            <p className="text-sm text-gray-500">{user.name}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-3">
                    {statuses.map((status) => {
                        const Icon = status.icon;
                        return (
                            <button
                                key={status.value}
                                onClick={() => setSelectedStatus(status.value)}
                                className={`w-full text-left p-4 border-2 rounded-lg transition-all ${selectedStatus === status.value
                                        ? 'border-orange-600 bg-orange-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Icon size={20} className="text-gray-600" />
                                        <div>
                                            <p className="font-semibold text-gray-900">{status.label}</p>
                                            <p className="text-sm text-gray-500">{status.description}</p>
                                        </div>
                                    </div>
                                    {selectedStatus === status.value && (
                                        <CheckCircle size={20} className="text-orange-600" />
                                    )}
                                </div>
                            </button>
                        );
                    })}

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="flex-1"
                            disabled={isLoading || selectedStatus === user.status}
                        >
                            {isLoading ? 'Updating...' : 'Update Status'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ChangeStatusModal.propTypes = {
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

// Delete User Confirmation
export const DeleteUserModal = ({ user, onClose, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    const handleDelete = async () => {
        if (confirmText !== 'DELETE') {
            showError('Please type DELETE to confirm');
            return;
        }

        try {
            setIsLoading(true);
            const response = await adminService.deleteUser(user.id);

            if (response.success) {
                showSuccess('User deleted successfully');
                if (response.data?.warnings?.length > 0) {
                    setTimeout(() => {
                        response.data.warnings.forEach(warning => {
                            showError(warning, { duration: 3000 });
                        });
                    }, 500);
                }
                onSuccess();
                onClose();
            } else {
                showError(response.message || 'Failed to delete user');
            }
        } catch (err) {
            showError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <Trash2 size={24} className="text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Delete User</h2>
                            <p className="text-sm text-gray-500">This action cannot be undone</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800 font-medium mb-2">
                            You are about to delete:
                        </p>
                        <p className="text-base font-semibold text-red-900">{user.name}</p>
                        <p className="text-sm text-red-700">{user.email}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type <span className="font-bold text-red-600">DELETE</span> to confirm
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                            placeholder="Type DELETE"
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                            disabled={isLoading || confirmText !== 'DELETE'}
                        >
                            {isLoading ? 'Deleting...' : 'Delete User'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

DeleteUserModal.propTypes = {
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};
