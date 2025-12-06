import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import authService from '../services/authService';
import { showSuccess, showError } from '../utils/toast';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [logoutOtherDevices, setLogoutOtherDevices] = useState(false);

    // Password strength indicators
    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        return strength;
    };

    const getStrengthLabel = (strength) => {
        if (strength <= 1) return { label: 'Weak', color: 'bg-red-500' };
        if (strength <= 2) return { label: 'Fair', color: 'bg-orange-500' };
        if (strength <= 3) return { label: 'Good', color: 'bg-yellow-500' };
        if (strength <= 4) return { label: 'Strong', color: 'bg-green-500' };
        return { label: 'Very Strong', color: 'bg-emerald-500' };
    };

    const passwordStrength = getPasswordStrength(formData.newPassword);
    const strengthInfo = getStrengthLabel(passwordStrength);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (formData.newPassword !== formData.confirmPassword) {
            showError('New passwords do not match');
            return;
        }

        if (formData.newPassword.length < 8) {
            showError('Password must be at least 8 characters long');
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            showError('New password must be different from current password');
            return;
        }

        setIsLoading(true);

        try {
            await authService.changePassword(
                formData.currentPassword,
                formData.newPassword,
                logoutOtherDevices
            );

            showSuccess('Password updated successfully!');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Password change failed:', error);
            showError(error.message || 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    const passwordRequirements = [
        { met: formData.newPassword.length >= 8, text: 'At least 8 characters' },
        { met: /[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword), text: 'Upper and lowercase letters' },
        { met: /\d/.test(formData.newPassword), text: 'At least one number' },
        { met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword), text: 'At least one special character' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 bg-white">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                            <ShieldCheck className="w-6 h-6 text-(--brand-primary)" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
                        <p className="text-gray-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Current Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Current Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword.current ? "text" : "password"}
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent transition-all outline-none"
                                        placeholder="Enter current password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('current')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword.new ? "text" : "password"}
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent transition-all outline-none"
                                        placeholder="Enter new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {formData.newPassword && (
                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${strengthInfo.color}`}
                                                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                                />
                                            </div>
                                            <span className={`text-xs font-medium ${strengthInfo.color.replace('bg-', 'text-')}`}>
                                                {strengthInfo.label}
                                            </span>
                                        </div>

                                        {/* Password Requirements */}
                                        <div className="grid grid-cols-2 gap-1 text-xs">
                                            {passwordRequirements.map((req, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex items-center gap-1 ${req.met ? 'text-green-600' : 'text-gray-400'}`}
                                                >
                                                    <CheckCircle2 size={12} className={req.met ? 'text-green-500' : 'text-gray-300'} />
                                                    {req.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword.confirm ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-10 py-3 rounded-xl border transition-all outline-none ${formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                                                ? 'border-red-300 focus:ring-red-500'
                                                : formData.confirmPassword && formData.newPassword === formData.confirmPassword
                                                    ? 'border-green-300 focus:ring-green-500'
                                                    : 'border-gray-200 focus:ring-(--brand-primary)'
                                            } focus:ring-2 focus:border-transparent`}
                                        placeholder="Confirm new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                                    <p className="text-xs text-red-500">Passwords do not match</p>
                                )}
                            </div>

                            {/* Logout other devices option */}
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <input
                                    type="checkbox"
                                    id="logoutOtherDevices"
                                    checked={logoutOtherDevices}
                                    onChange={(e) => setLogoutOtherDevices(e.target.checked)}
                                    className="w-4 h-4 text-(--brand-primary) border-gray-300 rounded focus:ring-(--brand-primary)"
                                />
                                <label htmlFor="logoutOtherDevices" className="text-sm text-gray-700">
                                    Log out from all other devices
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || formData.newPassword !== formData.confirmPassword}
                                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-(--brand-primary) text-white rounded-xl font-bold hover:bg-(--brand-primary)/90 transition-all shadow-lg shadow-(--brand-primary)/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
