import React, { useState } from 'react';
import {
    User,
    Building2,
    CreditCard,
    Bell,
    Shield,
    Users,
    Camera,
    Mail,
    Phone,
    Globe,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Save,
    Eye,
    EyeOff,
    Smartphone,
    Trash2,
    Plus,
    ChevronDown,
    Check,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';

const OrganizerSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Profile state
    const [profile, setProfile] = useState({
        firstName: 'John',
        lastName: 'Organizer',
        email: 'john@eventic.com',
        phone: '+233 24 123 4567',
        avatar: 'https://ui-avatars.com/api/?name=John+Organizer&background=f97316&color=fff&size=200'
    });

    // Business state
    const [business, setBusiness] = useState({
        name: 'Eventic Productions',
        type: 'event_company',
        description: 'We create unforgettable experiences through world-class events and entertainment.',
        email: 'contact@eventicproductions.com',
        phone: '+233 30 123 4567',
        website: 'https://eventicproductions.com',
        address: '123 Event Street',
        city: 'Accra',
        country: 'Ghana',
        facebook: 'https://facebook.com/eventicproductions',
        twitter: 'https://twitter.com/eventicprod',
        instagram: 'https://instagram.com/eventicproductions',
        linkedin: ''
    });

    // Payment methods state
    const [paymentMethods, setPaymentMethods] = useState([
        {
            id: 1,
            type: 'mobile_money',
            network: 'MTN Mobile Money',
            number: '024 123 4567',
            isDefault: true
        },
        {
            id: 2,
            type: 'bank',
            bankName: 'Ghana Commercial Bank',
            accountName: 'Eventic Productions Ltd',
            accountNumber: '****4521',
            isDefault: false
        }
    ]);

    // Notifications state
    const [notifications, setNotifications] = useState({
        emailNewOrder: true,
        emailRefund: true,
        emailPayout: true,
        emailMarketing: false,
        pushNewOrder: true,
        pushEventReminder: true,
        pushPayoutComplete: true,
        smsNewOrder: false,
        smsEventReminder: true
    });

    // Security state
    const [security, setSecurity] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false
    });

    // Team members state
    const [teamMembers, setTeamMembers] = useState([
        {
            id: 1,
            name: 'Sarah Manager',
            email: 'sarah@eventicproductions.com',
            role: 'Manager',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Manager&background=22c55e&color=fff',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Mike Assistant',
            email: 'mike@eventicproductions.com',
            role: 'Assistant',
            avatar: 'https://ui-avatars.com/api/?name=Mike+Assistant&background=3b82f6&color=fff',
            status: 'Active'
        }
    ]);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'business', label: 'Business', icon: Building2 },
        { id: 'payment', label: 'Payment Methods', icon: CreditCard },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'team', label: 'Team', icon: Users },
    ];

    const businessTypes = [
        { id: 'individual', label: 'Individual' },
        { id: 'event_company', label: 'Event Company' },
        { id: 'venue', label: 'Venue / Location' },
        { id: 'agency', label: 'Agency' },
        { id: 'nonprofit', label: 'Non-Profit Organization' },
    ];

    const roles = [
        { id: 'admin', label: 'Admin', description: 'Full access to all features' },
        { id: 'manager', label: 'Manager', description: 'Can manage events and view reports' },
        { id: 'assistant', label: 'Assistant', description: 'Can create and edit events' },
        { id: 'viewer', label: 'Viewer', description: 'View-only access' },
    ];

    const handleSave = () => {
        // Simulate save
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your account and preferences</p>
                </div>
                {saveSuccess && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                        <Check size={18} />
                        <span className="text-sm font-medium">Settings saved successfully!</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Sidebar Tabs */}
                <div className="col-span-12 lg:col-span-3">
                    <Card>
                        <CardContent className="p-2">
                            <nav className="space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                                activeTab === tab.id
                                                    ? "bg-(--brand-primary) text-white"
                                                    : "text-gray-600 hover:bg-gray-100"
                                            )}
                                        >
                                            <Icon size={18} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Area */}
                <div className="col-span-12 lg:col-span-9 space-y-6">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Update your personal details and profile picture</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Avatar */}
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <img
                                            src={profile.avatar}
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-(--brand-primary) rounded-full flex items-center justify-center cursor-pointer hover:bg-(--brand-primary-dark) transition-colors">
                                            <Camera size={16} className="text-white" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Profile Picture</p>
                                        <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB</p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.firstName}
                                            onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.lastName}
                                            onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={profile.phone}
                                                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button onClick={handleSave} className="gap-2">
                                        <Save size={18} />
                                        Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Business Tab */}
                    {activeTab === 'business' && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Business Information</CardTitle>
                                    <CardDescription>Manage your organization details shown on event pages</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Organization Name
                                            </label>
                                            <input
                                                type="text"
                                                value={business.name}
                                                onChange={(e) => setBusiness(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Business Type
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={business.type}
                                                    onChange={(e) => setBusiness(prev => ({ ...prev, type: e.target.value }))}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary) appearance-none bg-white"
                                                >
                                                    {businessTypes.map((type) => (
                                                        <option key={type.id} value={type.id}>{type.label}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Business Email
                                            </label>
                                            <input
                                                type="email"
                                                value={business.email}
                                                onChange={(e) => setBusiness(prev => ({ ...prev, email: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Description
                                            </label>
                                            <textarea
                                                value={business.description}
                                                onChange={(e) => setBusiness(prev => ({ ...prev, description: e.target.value }))}
                                                rows={3}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary) resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={business.phone}
                                                onChange={(e) => setBusiness(prev => ({ ...prev, phone: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Website
                                            </label>
                                            <div className="relative">
                                                <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="url"
                                                    value={business.website}
                                                    onChange={(e) => setBusiness(prev => ({ ...prev, website: e.target.value }))}
                                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Location</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Street Address
                                            </label>
                                            <div className="relative">
                                                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={business.address}
                                                    onChange={(e) => setBusiness(prev => ({ ...prev, address: e.target.value }))}
                                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                value={business.city}
                                                onChange={(e) => setBusiness(prev => ({ ...prev, city: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                value={business.country}
                                                onChange={(e) => setBusiness(prev => ({ ...prev, country: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Social Media</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Facebook
                                            </label>
                                            <div className="relative">
                                                <Facebook size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="url"
                                                    value={business.facebook}
                                                    onChange={(e) => setBusiness(prev => ({ ...prev, facebook: e.target.value }))}
                                                    placeholder="https://facebook.com/..."
                                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Twitter / X
                                            </label>
                                            <div className="relative">
                                                <Twitter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="url"
                                                    value={business.twitter}
                                                    onChange={(e) => setBusiness(prev => ({ ...prev, twitter: e.target.value }))}
                                                    placeholder="https://twitter.com/..."
                                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Instagram
                                            </label>
                                            <div className="relative">
                                                <Instagram size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="url"
                                                    value={business.instagram}
                                                    onChange={(e) => setBusiness(prev => ({ ...prev, instagram: e.target.value }))}
                                                    placeholder="https://instagram.com/..."
                                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                LinkedIn
                                            </label>
                                            <div className="relative">
                                                <Linkedin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="url"
                                                    value={business.linkedin}
                                                    onChange={(e) => setBusiness(prev => ({ ...prev, linkedin: e.target.value }))}
                                                    placeholder="https://linkedin.com/..."
                                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end">
                                <Button onClick={handleSave} className="gap-2">
                                    <Save size={18} />
                                    Save Changes
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Payment Methods Tab */}
                    {activeTab === 'payment' && (
                        <>
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Payment Methods</CardTitle>
                                            <CardDescription>Manage how you receive payouts</CardDescription>
                                        </div>
                                        <Button className="gap-2">
                                            <Plus size={18} />
                                            Add Payment Method
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {paymentMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                className={cn(
                                                    "flex items-center justify-between p-4 border rounded-lg",
                                                    method.isDefault ? "border-(--brand-primary) bg-(--brand-primary)/5" : "border-gray-200"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-lg flex items-center justify-center",
                                                        method.type === 'mobile_money' ? "bg-yellow-100" : "bg-blue-100"
                                                    )}>
                                                        {method.type === 'mobile_money' ? (
                                                            <Smartphone size={24} className="text-yellow-600" />
                                                        ) : (
                                                            <Building2 size={24} className="text-blue-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-gray-900">
                                                                {method.type === 'mobile_money' ? method.network : method.bankName}
                                                            </p>
                                                            {method.isDefault && (
                                                                <Badge variant="success" className="text-xs">Default</Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500 mt-0.5">
                                                            {method.type === 'mobile_money' ? method.number : `${method.accountName} • ${method.accountNumber}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {!method.isDefault && (
                                                        <Button variant="outline" size="sm">
                                                            Set as Default
                                                        </Button>
                                                    )}
                                                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Payout Schedule</CardTitle>
                                    <CardDescription>Choose when you want to receive your payouts</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {['manual', 'weekly', 'biweekly', 'monthly'].map((schedule) => (
                                            <label
                                                key={schedule}
                                                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
                                            >
                                                <input
                                                    type="radio"
                                                    name="payoutSchedule"
                                                    value={schedule}
                                                    defaultChecked={schedule === 'manual'}
                                                    className="w-4 h-4 text-(--brand-primary)"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900 capitalize">{schedule}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {schedule === 'manual' && 'Request payouts manually when you need them'}
                                                        {schedule === 'weekly' && 'Receive payouts every week on Monday'}
                                                        {schedule === 'biweekly' && 'Receive payouts every two weeks'}
                                                        {schedule === 'monthly' && 'Receive payouts on the 1st of each month'}
                                                    </p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Email Notifications</CardTitle>
                                    <CardDescription>Choose what emails you want to receive</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            { key: 'emailNewOrder', label: 'New Order', description: 'Get notified when someone purchases tickets' },
                                            { key: 'emailRefund', label: 'Refund Requests', description: 'Get notified about refund requests' },
                                            { key: 'emailPayout', label: 'Payout Updates', description: 'Get notified when payouts are processed' },
                                            { key: 'emailMarketing', label: 'Marketing & Tips', description: 'Receive tips to grow your events' },
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center justify-between py-3">
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.label}</p>
                                                    <p className="text-sm text-gray-500">{item.description}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications[item.key]}
                                                        onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-(--brand-primary)/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--brand-primary)"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Push Notifications</CardTitle>
                                    <CardDescription>Manage browser and mobile push notifications</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            { key: 'pushNewOrder', label: 'New Orders', description: 'Real-time notifications for new ticket purchases' },
                                            { key: 'pushEventReminder', label: 'Event Reminders', description: 'Reminders before your events start' },
                                            { key: 'pushPayoutComplete', label: 'Payout Complete', description: 'When payouts are deposited to your account' },
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center justify-between py-3">
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.label}</p>
                                                    <p className="text-sm text-gray-500">{item.description}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications[item.key]}
                                                        onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-(--brand-primary)/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--brand-primary)"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>SMS Notifications</CardTitle>
                                    <CardDescription>Important updates via text message</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            { key: 'smsNewOrder', label: 'New Orders', description: 'SMS for high-value orders' },
                                            { key: 'smsEventReminder', label: 'Event Day Reminder', description: 'SMS reminder on your event day' },
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center justify-between py-3">
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.label}</p>
                                                    <p className="text-sm text-gray-500">{item.description}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications[item.key]}
                                                        onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-(--brand-primary)/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--brand-primary)"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end">
                                <Button onClick={handleSave} className="gap-2">
                                    <Save size={18} />
                                    Save Preferences
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Change Password</CardTitle>
                                    <CardDescription>Update your password to keep your account secure</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                value={security.currentPassword}
                                                onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                value={security.newPassword}
                                                onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1.5">
                                            Must be at least 8 characters with uppercase, lowercase, and numbers
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={security.confirmPassword}
                                                onChange={(e) => setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button onClick={handleSave}>Update Password</Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Two-Factor Authentication</CardTitle>
                                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-lg flex items-center justify-center",
                                                security.twoFactorEnabled ? "bg-green-100" : "bg-gray-100"
                                            )}>
                                                <Shield size={24} className={security.twoFactorEnabled ? "text-green-600" : "text-gray-400"} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {security.twoFactorEnabled ? 'Two-factor authentication is enabled' : 'Two-factor authentication is disabled'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {security.twoFactorEnabled
                                                        ? 'Your account is protected with 2FA'
                                                        : 'Protect your account with an authenticator app'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant={security.twoFactorEnabled ? "outline" : "default"}
                                            onClick={() => setSecurity(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
                                        >
                                            {security.twoFactorEnabled ? 'Disable' : 'Enable'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                                    <CardDescription>Irreversible and destructive actions</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-red-800">Delete Account</p>
                                                <p className="text-sm text-red-600 mt-1">
                                                    Permanently delete your account and all associated data
                                                </p>
                                            </div>
                                            <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-100">
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Team Tab */}
                    {activeTab === 'team' && (
                        <>
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Team Members</CardTitle>
                                            <CardDescription>Manage who has access to your organizer account</CardDescription>
                                        </div>
                                        <Button className="gap-2">
                                            <Plus size={18} />
                                            Invite Member
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Current User */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={profile.avatar}
                                                    alt={`${profile.firstName} ${profile.lastName}`}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-gray-900">
                                                            {profile.firstName} {profile.lastName}
                                                        </p>
                                                        <Badge variant="secondary">You</Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-500">{profile.email}</p>
                                                </div>
                                            </div>
                                            <Badge>Owner</Badge>
                                        </div>

                                        {/* Team Members */}
                                        {teamMembers.map((member) => (
                                            <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={member.avatar}
                                                        alt={member.name}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{member.name}</p>
                                                        <p className="text-sm text-gray-500">{member.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <select
                                                            defaultValue={member.role.toLowerCase()}
                                                            className="appearance-none bg-white px-3 py-1.5 pr-8 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20"
                                                        >
                                                            {roles.map((role) => (
                                                                <option key={role.id} value={role.id}>{role.label}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                    </div>
                                                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Role Permissions</CardTitle>
                                    <CardDescription>Understand what each role can do</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {roles.map((role) => (
                                            <div key={role.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                                                    <Users size={16} className="text-gray-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{role.label}</p>
                                                    <p className="text-sm text-gray-500">{role.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrganizerSettings;
