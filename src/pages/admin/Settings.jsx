import React, { useState, useEffect } from 'react';
import {
    Globe,
    CreditCard,
//     ToggleLeft,
    Mail,
    Bell,
    Shield,
    Sliders,
    Save,
    RefreshCw,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import adminService from '../../services/adminService';

const Settings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [activeTab, setActiveTab] = useState('general');
    const [showPasswords, setShowPasswords] = useState({});
    const [hasChanges, setHasChanges] = useState(false);

    const tabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'payment', label: 'Payment', icon: CreditCard },
        // { id: 'features', label: 'Features', icon: ToggleLeft },
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'limits', label: 'Limits', icon: Sliders },
    ];

    const fetchSettings = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminService.getSettings();
            if (response && response.data) {
                if (response.success) {
                    setSettings(response.data);
                } else {
                    setError(response.message || 'Failed to load settings');
                }
            }
        } catch (err) {
            setError(err.message || 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleInputChange = (category, key, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);
            const response = await adminService.updateSettings(settings);
            if (response && response.success) {
                setSuccess('Settings updated successfully');
                setHasChanges(false);
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(response.message || 'Failed to update settings');
            }
        } catch (err) {
            setError(err.message || 'Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (error && !settings) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-red-600">{error}</p>
                <Button onClick={fetchSettings} variant="outline" className="gap-2">
                    <RefreshCw size={16} />
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
                    <p className="text-gray-500 text-sm">
                        Configure and manage your platform settings
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {hasChanges && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            Unsaved Changes
                        </Badge>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={saving || !hasChanges}
                        className="gap-2 bg-red-600 hover:bg-red-700"
                    >
                        {saving ? (
                            <>
                                <RefreshCw size={16} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    <CheckCircle size={20} />
                    <span>{success}</span>
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex space-x-8 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-red-600 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* General Settings */}
            {activeTab === 'general' && settings?.general && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe size={20} className="text-gray-500" />
                            General Settings
                        </CardTitle>
                        <CardDescription>
                            Basic platform configuration and branding
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Site Name
                                </label>
                                <input
                                    type="text"
                                    value={settings.general.site_name}
                                    onChange={(e) => handleInputChange('general', 'site_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Email
                                </label>
                                <input
                                    type="email"
                                    value={settings.general.contact_email}
                                    onChange={(e) => handleInputChange('general', 'contact_email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Site Description
                            </label>
                            <textarea
                                value={settings.general.site_description}
                                onChange={(e) => handleInputChange('general', 'site_description', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Support Phone
                                </label>
                                <input
                                    type="tel"
                                    value={settings.general.support_phone}
                                    onChange={(e) => handleInputChange('general', 'support_phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Timezone
                                </label>
                                <select
                                    value={settings.general.timezone}
                                    onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="Africa/Accra">Africa/Accra (GMT)</option>
                                    <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                                    <option value="UTC">UTC</option>
                                    <option value="America/New_York">America/New York (EST)</option>
                                    <option value="Europe/London">Europe/London (GMT)</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Currency
                                </label>
                                <input
                                    type="text"
                                    value={settings.general.currency}
                                    onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Currency Symbol
                                </label>
                                <input
                                    type="text"
                                    value={settings.general.currency_symbol}
                                    onChange={(e) => handleInputChange('general', 'currency_symbol', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date Format
                                </label>
                                <select
                                    value={settings.general.date_format}
                                    onChange={(e) => handleInputChange('general', 'date_format', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="Y-m-d">YYYY-MM-DD</option>
                                    <option value="d/m/Y">DD/MM/YYYY</option>
                                    <option value="m/d/Y">MM/DD/YYYY</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && settings?.payment && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard size={20} className="text-gray-500" />
                            Payment Settings
                        </CardTitle>
                        <CardDescription>
                            Configure payment gateway and revenue sharing
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> Changes to payment settings may affect active transactions. Please proceed with caution.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Paystack Public Key
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.paystack_public ? 'text' : 'password'}
                                        value={settings.payment.paystack_public_key}
                                        onChange={(e) => handleInputChange('payment', 'paystack_public_key', e.target.value)}
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('paystack_public')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPasswords.paystack_public ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Paystack Secret Key
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.paystack_secret ? 'text' : 'password'}
                                        value={settings.payment.paystack_secret_key}
                                        onChange={(e) => handleInputChange('payment', 'paystack_secret_key', e.target.value)}
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('paystack_secret')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPasswords.paystack_secret ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Paystack Fee (%)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={settings.payment.paystack_fee_percent}
                                    onChange={(e) => handleInputChange('payment', 'paystack_fee_percent', parseFloat(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Admin Share (%)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={settings.payment.default_event_admin_share}
                                    onChange={(e) => handleInputChange('payment', 'default_event_admin_share', parseFloat(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Award Admin Share (%)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={settings.payment.default_award_admin_share}
                                    onChange={(e) => handleInputChange('payment', 'default_award_admin_share', parseFloat(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Minimum Payout Amount (GH₵)
                                </label>
                                <input
                                    type="number"
                                    value={settings.payment.min_payout_amount}
                                    onChange={(e) => handleInputChange('payment', 'min_payout_amount', parseFloat(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payout Hold Days
                                </label>
                                <input
                                    type="number"
                                    value={settings.payment.payout_hold_days}
                                    onChange={(e) => handleInputChange('payment', 'payout_hold_days', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Feature Settings (Not implemented yet) */}
            {/* activeTab === 'features' && settings?.features && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ToggleLeft size={20} className="text-gray-500" />
                            Feature Toggles
                        </CardTitle>
                        <CardDescription>
                            Enable or disable platform features
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(settings.features).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900 capitalize">
                                        {key.replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {key === 'enable_event_ticketing' && 'Allow users to create and sell event tickets'}
                                        {key === 'enable_award_voting' && 'Allow users to create awards and accept votes'}
                                        {key === 'enable_organizer_registration' && 'Allow new organizer registrations'}
                                        {key === 'require_event_approval' && 'Events must be approved before publishing'}
                                        {key === 'require_award_approval' && 'Awards must be approved before publishing'}
                                        {key === 'enable_event_reviews' && 'Allow attendees to review events'}
                                        {key === 'enable_refunds' && 'Allow ticket refunds (currently disabled)'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleInputChange('features', key, !value)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-green-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ) */}

            {/* Email Settings */}
            {activeTab === 'email' && settings?.email && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail size={20} className="text-gray-500" />
                            Email Configuration
                        </CardTitle>
                        <CardDescription>
                            SMTP settings for outgoing emails
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SMTP Host
                                </label>
                                <input
                                    type="text"
                                    value={settings.email.smtp_host}
                                    onChange={(e) => handleInputChange('email', 'smtp_host', e.target.value)}
                                    placeholder="smtp.gmail.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SMTP Port
                                </label>
                                <input
                                    type="number"
                                    value={settings.email.smtp_port}
                                    onChange={(e) => handleInputChange('email', 'smtp_port', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SMTP Username
                                </label>
                                <input
                                    type="text"
                                    value={settings.email.smtp_username}
                                    onChange={(e) => handleInputChange('email', 'smtp_username', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SMTP Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.smtp_password ? 'text' : 'password'}
                                        value={settings.email.smtp_password}
                                        onChange={(e) => handleInputChange('email', 'smtp_password', e.target.value)}
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('smtp_password')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPasswords.smtp_password ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Encryption
                                </label>
                                <select
                                    value={settings.email.smtp_encryption}
                                    onChange={(e) => handleInputChange('email', 'smtp_encryption', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="tls">TLS</option>
                                    <option value="ssl">SSL</option>
                                    <option value="none">None</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    From Email
                                </label>
                                <input
                                    type="email"
                                    value={settings.email.from_email}
                                    onChange={(e) => handleInputChange('email', 'from_email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    From Name
                                </label>
                                <input
                                    type="text"
                                    value={settings.email.from_name}
                                    onChange={(e) => handleInputChange('email', 'from_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && settings?.notifications && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell size={20} className="text-gray-500" />
                            Notification Settings
                        </CardTitle>
                        <CardDescription>
                            Configure when and how notifications are sent
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(settings.notifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900 capitalize">
                                        {key.replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {key === 'enable_email_notifications' && 'Send email notifications to users'}
                                        {key === 'enable_sms_notifications' && 'Send SMS notifications (requires SMS gateway)'}
                                        {key === 'notify_new_order' && 'Notify admins when new orders are placed'}
                                        {key === 'notify_new_event' && 'Notify admins when new events are created'}
                                        {key === 'notify_new_award' && 'Notify admins when new awards are created'}
                                        {key === 'notify_payout_request' && 'Notify admins when payout requests are made'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleInputChange('notifications', key, !value)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-green-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && settings?.security && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield size={20} className="text-gray-500" />
                            Security Settings
                        </CardTitle>
                        <CardDescription>
                            Security and authentication configuration
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">Enable Two-Factor Authentication</p>
                                <p className="text-sm text-gray-500">Require 2FA for all admin users</p>
                            </div>
                            <button
                                onClick={() => handleInputChange('security', 'enable_2fa', !settings.security.enable_2fa)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.security.enable_2fa ? 'bg-green-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.security.enable_2fa ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">Require Strong Passwords</p>
                                <p className="text-sm text-gray-500">Enforce password complexity requirements</p>
                            </div>
                            <button
                                onClick={() => handleInputChange('security', 'require_strong_passwords', !settings.security.require_strong_passwords)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.security.require_strong_passwords ? 'bg-green-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.security.require_strong_passwords ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Session Timeout (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={settings.security.session_timeout}
                                    onChange={(e) => handleInputChange('security', 'session_timeout', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Min Password Length
                                </label>
                                <input
                                    type="number"
                                    value={settings.security.min_password_length}
                                    onChange={(e) => handleInputChange('security', 'min_password_length', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Login Attempts
                                </label>
                                <input
                                    type="number"
                                    value={settings.security.max_login_attempts}
                                    onChange={(e) => handleInputChange('security', 'max_login_attempts', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lockout Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={settings.security.lockout_duration}
                                    onChange={(e) => handleInputChange('security', 'lockout_duration', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Limits Settings */}
            {activeTab === 'limits' && settings?.limits && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sliders size={20} className="text-gray-500" />
                            Limits & Restrictions
                        </CardTitle>
                        <CardDescription>
                            Set platform-wide limits and quotas
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Tickets Per Order
                                </label>
                                <input
                                    type="number"
                                    value={settings.limits.max_tickets_per_order}
                                    onChange={(e) => handleInputChange('limits', 'max_tickets_per_order', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <p className="text-sm text-gray-500 mt-1">Maximum tickets in a single order</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Votes Per Transaction
                                </label>
                                <input
                                    type="number"
                                    value={settings.limits.max_votes_per_transaction}
                                    onChange={(e) => handleInputChange('limits', 'max_votes_per_transaction', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <p className="text-sm text-gray-500 mt-1">Maximum votes in a single transaction</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max File Upload Size (MB)
                                </label>
                                <input
                                    type="number"
                                    value={settings.limits.max_file_upload_size}
                                    onChange={(e) => handleInputChange('limits', 'max_file_upload_size', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <p className="text-sm text-gray-500 mt-1">Maximum size for image uploads</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Images Per Event
                                </label>
                                <input
                                    type="number"
                                    value={settings.limits.max_images_per_event}
                                    onChange={(e) => handleInputChange('limits', 'max_images_per_event', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <p className="text-sm text-gray-500 mt-1">Maximum gallery images per event</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Save Button at Bottom */}
            {hasChanges && (
                <div className="flex items-center justify-end gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">You have unsaved changes</p>
                    <Button
                        onClick={fetchSettings}
                        variant="outline"
                        disabled={saving}
                    >
                        Discard
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="gap-2 bg-red-600 hover:bg-red-700"
                    >
                        {saving ? (
                            <>
                                <RefreshCw size={16} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save All Changes
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Settings;
