import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Trash2,
  Key,
  UserCog,
  Ban,
  CheckCircle,
  X,
  Edit,
  Loader2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import adminService from "../../services/adminService";
import { showSuccess, showError } from "../../utils/toast";

/**
 * User Management Modals and Actions Component
 * Handles password reset, role change, status change, and user deletion
 */

// Password Reset Modal
export const ResetPasswordModal = ({ user, onClose, onSuccess }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      showError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const response = await adminService.resetUserPassword(user.id, password);

      if (response.success) {
        showSuccess(
          "Password reset successfully. User will be required to change it on next login.",
        );
        onSuccess();
        onClose();
      } else {
        showError(response.message || "Failed to reset password");
      }
    } catch (err) {
      showError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Key size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Reset Password
              </h2>
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
              The user will be required to change this password on their next
              login.
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
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
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
    {
      value: "super_admin",
      label: "Super Admin",
      description: "Maximum platform access and control",
    },
    { value: "admin", label: "Admin", description: "Full platform access" },
    {
      value: "organizer",
      label: "Organizer",
      description: "Can create events and awards",
    },
    {
      value: "attendee",
      label: "Attendee",
      description: "Can purchase tickets and vote",
    },
    { value: "pos", label: "POS", description: "Point of sale access" },
    {
      value: "scanner",
      label: "Scanner",
      description: "Ticket scanning access",
    },
  ];

  const handleSubmit = async () => {
    if (selectedRole === user.role) {
      showError("Please select a different role");
      return;
    }

    try {
      setIsLoading(true);
      const response = await adminService.updateUserRole(user.id, selectedRole);

      if (response.success) {
        showSuccess("User role updated successfully");
        onSuccess();
        onClose();
      } else {
        showError(response.message || "Failed to update role");
      }
    } catch (err) {
      showError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

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
              className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                selectedRole === role.value
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
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
              {isLoading ? "Updating..." : "Update Role"}
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
    {
      value: "active",
      label: "Active",
      description: "User can access the platform",
      icon: CheckCircle,
      color: "green",
    },
    {
      value: "inactive",
      label: "Inactive",
      description: "User account is deactivated",
      icon: Ban,
      color: "gray",
    },
    {
      value: "suspended",
      label: "Suspended",
      description: "User is temporarily banned",
      icon: X,
      color: "red",
    },
  ];

  const handleSubmit = async () => {
    if (selectedStatus === user.status) {
      showError("Please select a different status");
      return;
    }

    try {
      setIsLoading(true);
      const response = await adminService.updateUserStatus(
        user.id,
        selectedStatus,
      );

      if (response.success) {
        showSuccess("User status updated successfully");
        onSuccess();
        onClose();
      } else {
        showError(response.message || "Failed to update status");
      }
    } catch (err) {
      showError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

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
                className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                  selectedStatus === status.value
                    ? "border-orange-600 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {status.label}
                      </p>
                      <p className="text-sm text-gray-500">
                        {status.description}
                      </p>
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
              {isLoading ? "Updating..." : "Update Status"}
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
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      showError("Please type DELETE to confirm");
      return;
    }

    try {
      setIsLoading(true);
      const response = await adminService.deleteUser(user.id);

      if (response.success) {
        showSuccess("User deleted successfully");
        if (response.data?.warnings?.length > 0) {
          setTimeout(() => {
            response.data.warnings.forEach((warning) => {
              showError(warning, { duration: 3000 });
            });
          }, 500);
        }
        onSuccess();
        onClose();
      } else {
        showError(response.message || "Failed to delete user");
      }
    } catch (err) {
      showError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Delete User</h2>
              <p className="text-sm text-gray-500">
                This action cannot be undone
              </p>
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
              Type <span className="font-bold text-red-600">DELETE</span> to
              confirm
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
              disabled={isLoading || confirmText !== "DELETE"}
            >
              {isLoading ? "Deleting..." : "Delete User"}
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

// Create User Modal
export const CreateUserModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "attendee",
    organization_name: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { value: "attendee", label: "Attendee" },
    { value: "organizer", label: "Organizer" },
    { value: "admin", label: "Admin" },
    { value: "super_admin", label: "Super Admin" },
    { value: "pos", label: "POS" },
    { value: "scanner", label: "Scanner" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await adminService.createUser(formData);

      if (response.success) {
        showSuccess("User created successfully");
        onSuccess();
        onClose();
      } else {
        showError(response.message || "Failed to create user");
      }
    } catch (err) {
      showError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <UserCog size={24} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Create New User
                </h2>
                <p className="text-sm text-gray-500">
                  Manually add a user to the platform
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                placeholder="+233..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {formData.role === "organizer" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                required
                value={formData.organization_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organization_name: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                placeholder="Company Name Ltd."
              />
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-100">
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
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

CreateUserModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

// Edit User Modal
export const EditUserModal = ({ user: initialUser, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    phone: initialUser.phone || "",
    // Organizer fields
    organization_name: "",
    business_name: "",
    business_type: "",
    description: "",
    website: "",
    address: "",
    city: "",
    region: "",
    country: "",
    bio: "",
    // Attendee fields
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    interests: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  React.useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsFetching(true);
        const response = await adminService.getUser(initialUser.id);
        if (response.success) {
          const user = response.data.user;
          const roleData = response.data.role_data;
          
          let roleSpecificData = {};
          if (user.role === 'organizer' && roleData.organizer) {
            roleSpecificData = {
              organization_name: roleData.organizer.organization_name || roleData.organizer.business_name || "",
              business_name: roleData.organizer.business_name || "",
              business_type: roleData.organizer.business_type || "",
              description: roleData.organizer.description || "",
              website: roleData.organizer.website || "",
              address: roleData.organizer.address || "",
              city: roleData.organizer.city || "",
              region: roleData.organizer.region || "",
              country: roleData.organizer.country || "",
              bio: roleData.organizer.bio || roleData.organizer.description || "",
            };
          } else if (user.role === 'attendee' && roleData.attendee) {
            roleSpecificData = {
              first_name: roleData.attendee.first_name || "",
              last_name: roleData.attendee.last_name || "",
              date_of_birth: roleData.attendee.date_of_birth || "",
              gender: roleData.attendee.gender || "",
              interests: roleData.attendee.interests || "",
              bio: roleData.attendee.bio || "",
            };
          }

          setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            ...roleSpecificData
          });
        }
      } catch (err) {
        showError("Failed to fetch user details", err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserDetails();
  }, [initialUser.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await adminService.updateUser(initialUser.id, formData);

      if (response.success) {
        showSuccess("User profile updated successfully");
        onSuccess();
        onClose();
      } else {
        showError(response.message || "Failed to update user");
      }
    } catch (err) {
      showError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Edit size={24} className="text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit User Profile
                </h2>
                <p className="text-sm text-gray-500">
                  Update information for {initialUser.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {isFetching ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4">
            <Loader2 size={40} className="text-orange-500 animate-spin" />
            <p className="text-gray-500">Fetching user details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Role Specific Fields */}
            {initialUser.role === 'organizer' && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Organizer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization/Business Name</label>
                    <input
                      name="organization_name"
                      type="text"
                      value={formData.organization_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                    <input
                      name="business_type"
                      type="text"
                      value={formData.business_type}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      placeholder="e.g. Media, Agency, Individual"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Description</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {initialUser.role === 'attendee' && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Attendee Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </form>
        )}

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
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
            onClick={handleSubmit}
            className="flex-1 bg-orange-600 hover:bg-orange-700"
            disabled={isLoading || isFetching}
          >
            {isLoading ? "Saving Changes..." : "Save Profile"}
          </Button>
        </div>
      </div>
    </div>
  );
};

EditUserModal.propTypes = {
  user: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
