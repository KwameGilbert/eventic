import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Mail,
    Phone,
    CreditCard,
    Download,
    Printer,
    Send,
    CheckCircle,
    XCircle,
    RefreshCw,
    AlertCircle,
    TicketCheck,
    Copy,
    ExternalLink,
    MoreVertical,
    Hash,
    Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import organizerService from '../../services/organizerService';

const ViewOrder = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [openDropdown, setOpenDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ horizontal: 'right', vertical: 'bottom' });
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    // Fetch order details from API
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await organizerService.getOrderDetails(id);
                if (response.data) {
                    setOrder(response.data);
                }
            } catch (err) {
                console.error('Error fetching order details:', err);
                setError(err.response?.data?.message || 'Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrderDetails();
        }
    }, [id]);

    // Smart dropdown positioning
    useEffect(() => {
        if (openDropdown && dropdownRef.current && buttonRef.current) {
            const calculatePosition = () => {
                const dropdown = dropdownRef.current;
                const button = buttonRef.current;
                const buttonRect = button.getBoundingClientRect();
                const dropdownRect = dropdown.getBoundingClientRect();

                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                // Calculate available space in all directions
                const spaceRight = viewportWidth - buttonRect.right;
                const spaceLeft = buttonRect.left;
                const spaceBelow = viewportHeight - buttonRect.bottom;
                const spaceAbove = buttonRect.top;

                // Determine horizontal position
                let horizontal = 'right';
                if (spaceRight < dropdownRect.width && spaceLeft > spaceRight) {
                    horizontal = 'left';
                }

                // Determine vertical position
                let vertical = 'bottom';
                if (spaceBelow < dropdownRect.height && spaceAbove > spaceBelow) {
                    vertical = 'top';
                }

                setDropdownPosition({ horizontal, vertical });
            };

            calculatePosition();
            window.addEventListener('resize', calculatePosition);
            window.addEventListener('scroll', calculatePosition, true);

            return () => {
                window.removeEventListener('resize', calculatePosition);
                window.removeEventListener('scroll', calculatePosition, true);
            };
        }
    }, [openDropdown]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setOpenDropdown(false);
            }
        };

        if (openDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [openDropdown]);

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error || !order) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'Unable to load order details'}</p>
                    <Button onClick={() => navigate('/organizer/orders')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Orders
                    </Button>
                </div>
            </div>
        );
    }

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'paid': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'destructive';
            case 'refunded': return 'info';
            default: return 'secondary';
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'paid': return <CheckCircle size={16} />;
            case 'pending': return <Clock size={16} />;
            case 'cancelled': return <XCircle size={16} />;
            case 'refunded': return <RefreshCw size={16} />;
            default: return <AlertCircle size={16} />;
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Could add toast notification here
    };

    // Calculate total tickets from all order items
    const totalTickets = order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    // Get primary event for display
    const primaryEvent = order.primaryEvent || order.events?.[0];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3 md:gap-4">
                    <button
                        onClick={() => navigate('/organizer/orders')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-words">
                                Order #{order.id}
                            </h1>
                            <Badge variant={getStatusStyle(order.status)} className="gap-1 flex-shrink-0">
                                {getStatusIcon(order.status)}
                                {order.status}
                            </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Placed on {formatDateTime(order.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download size={16} />
                        Invoice
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Printer size={16} />
                        Print
                    </Button>
                    <Button size="sm" className="gap-2">
                        <Send size={16} />
                        Resend Tickets
                    </Button>
                    <div className="relative">
                        <Button
                            ref={buttonRef}
                            variant="outline"
                            size="icon"
                            onClick={() => setOpenDropdown(!openDropdown)}
                        >
                            <MoreVertical size={16} />
                        </Button>
                        {openDropdown && (
                            <div
                                ref={dropdownRef}
                                className={`absolute w-48 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 ${dropdownPosition.horizontal === 'left' ? 'right-full mr-2' : 'left-0'
                                    } ${dropdownPosition.vertical === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                                    }`}
                            >
                                <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <Mail size={14} />
                                    Email Customer
                                </button>
                                <button
                                    onClick={() => copyToClipboard(order.id.toString())}
                                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Copy size={14} />
                                    Copy Order ID
                                </button>
                                <hr className="my-1" />
                                <button className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2">
                                    <RefreshCw size={14} />
                                    Process Refund
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile/Tablet Actions */}
                <div className="flex lg:hidden items-center gap-2">
                    {/* Icon-only buttons on mobile */}
                    <Button variant="outline" size="sm" className="gap-1 sm:gap-2">
                        <Download size={16} />
                        <span className="hidden sm:inline">Invoice</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 sm:gap-2">
                        <Printer size={16} />
                        <span className="hidden sm:inline">Print</span>
                    </Button>
                    <div className="relative">
                        <Button
                            ref={buttonRef}
                            variant="outline"
                            size="icon"
                            onClick={() => setOpenDropdown(!openDropdown)}
                        >
                            <MoreVertical size={16} />
                        </Button>
                        {openDropdown && (
                            <div
                                ref={dropdownRef}
                                className={`absolute w-56 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 ${dropdownPosition.horizontal === 'left' ? 'right-full mr-2' : 'left-0'
                                    } ${dropdownPosition.vertical === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                                    }`}
                            >
                                <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <Send size={14} />
                                    Resend Tickets
                                </button>
                                <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <Mail size={14} />
                                    Email Customer
                                </button>
                                <button
                                    onClick={() => copyToClipboard(order.id.toString())}
                                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Copy size={14} />
                                    Copy Order ID
                                </button>
                                <hr className="my-1" />
                                <button className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2">
                                    <RefreshCw size={14} />
                                    Process Refund
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Column */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    {/* Event Info */}
                    {primaryEvent && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Event Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4">
                                    {primaryEvent.bannerImage && (
                                        <img
                                            src={primaryEvent.bannerImage}
                                            alt={primaryEvent.title}
                                            className="w-32 h-20 object-cover rounded-lg"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <Link
                                            to={`/organizer/events/${primaryEvent.id}`}
                                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                        >
                                            {primaryEvent.title}
                                        </Link>
                                        {primaryEvent.eventType && (
                                            <p className="text-xs text-gray-500 mt-1">{primaryEvent.eventType.name}</p>
                                        )}
                                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-gray-400" />
                                                {formatDate(primaryEvent.startTime)} at {formatTime(primaryEvent.startTime)}
                                            </div>
                                            {primaryEvent.venueName && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-gray-400" />
                                                    {primaryEvent.venueName}
                                                    {primaryEvent.address && ` - ${primaryEvent.address}`}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Link to={`/organizer/events/${primaryEvent.id}`}>
                                        <Button variant="outline" size="sm" className="gap-1">
                                            <ExternalLink size={14} />
                                            View Event
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Order Items & Tickets */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TicketCheck size={20} className="text-blue-600" />
                                Tickets ({totalTickets})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.orderItems?.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-4 border border-gray-200 rounded-lg"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">
                                                    {item.ticketType?.name || 'Ticket'}
                                                </h4>
                                                {item.ticketType?.description && (
                                                    <p className="text-xs text-gray-500 mt-1">{item.ticketType.description}</p>
                                                )}
                                                <p className="text-sm text-gray-500 mt-1">
                                                    GH₵{item.unitPrice.toFixed(2)} × {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-gray-900">
                                                GH₵{item.totalPrice.toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Individual Tickets */}
                                        {item.tickets && item.tickets.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-xs text-gray-500 mb-2">
                                                    Individual Tickets ({item.tickets.length}):
                                                </p>
                                                <div className="space-y-2">
                                                    {item.tickets.map((ticket) => (
                                                        <div
                                                            key={ticket.id}
                                                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {ticket.ticketTypeImage && (
                                                                    <img
                                                                        src={ticket.ticketTypeImage}
                                                                        alt={ticket.ticketTypeName}
                                                                        className="w-8 h-8 object-cover rounded"
                                                                    />
                                                                )}
                                                                <button
                                                                    onClick={() => copyToClipboard(ticket.ticketCode)}
                                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-xs font-mono text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
                                                                >
                                                                    {ticket.ticketCode}
                                                                    <Copy size={10} />
                                                                </button>
                                                            </div>
                                                            <Badge
                                                                variant={ticket.status === 'used' ? 'success' : ticket.status === 'cancelled' ? 'destructive' : 'secondary'}
                                                                className="text-xs"
                                                            >
                                                                {ticket.status}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">GH₵{order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Service Fees</span>
                                    <span className="text-gray-900">GH₵{order.fees.toFixed(2)}</span>
                                </div>
                                <hr />
                                <div className="flex justify-between text-lg font-semibold">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-blue-600">GH₵{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Order Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                {order.timeline?.map((item, index) => (
                                    <div key={index} className="flex gap-4 pb-6 last:pb-0">
                                        <div className="relative">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.status === 'completed'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                <CheckCircle size={16} />
                                            </div>
                                            {index < order.timeline.length - 1 && (
                                                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-200" />
                                            )}
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <p className="font-medium text-gray-900">{item.action}</p>
                                            <p className="text-sm text-gray-500">{formatDateTime(item.date)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Customer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                {order.customer?.avatar && (
                                    <img
                                        src={order.customer.avatar}
                                        alt={order.customer.name || 'Customer'}
                                        className="w-12 h-12 rounded-full"
                                    />
                                )}
                                <div>
                                    <p className="font-semibold text-gray-900">{order.customer?.name || 'N/A'}</p>
                                    <p className="text-sm text-gray-500">Customer</p>
                                </div>
                            </div>
                            <hr />
                            <div className="space-y-3">
                                {order.customer?.email && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail size={16} className="text-gray-400" />
                                        <a href={`mailto:${order.customer.email}`} className="text-gray-600 hover:text-blue-600">
                                            {order.customer.email}
                                        </a>
                                    </div>
                                )}
                                {order.customer?.phone && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone size={16} className="text-gray-400" />
                                        <a href={`tel:${order.customer.phone}`} className="text-gray-600 hover:text-blue-600">
                                            {order.customer.phone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Payment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <CreditCard size={20} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Payment</p>
                                        <p className="text-sm text-gray-500">Online Payment</p>
                                    </div>
                                </div>
                                {order.status?.toLowerCase() === 'paid' && <Badge variant="success">Paid</Badge>}
                            </div>
                            <hr />
                            <div className="space-y-2 text-sm">
                                {order.paymentReference && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Reference</span>
                                        <button
                                            onClick={() => copyToClipboard(order.paymentReference)}
                                            className="font-mono text-gray-900 hover:text-blue-600 flex items-center gap-1"
                                        >
                                            {order.paymentReference.slice(0, 16)}...
                                            <Copy size={12} />
                                        </button>
                                    </div>
                                )}
                                {order.paidAt && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Paid at</span>
                                        <span className="text-gray-900">{formatDateTime(order.paidAt)}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Reference */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Reference</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center gap-2">
                                    <Hash size={14} />
                                    Order ID
                                </span>
                                <button
                                    onClick={() => copyToClipboard(order.id.toString())}
                                    className="font-mono font-medium text-gray-900 hover:text-blue-600 flex items-center gap-1"
                                >
                                    {order.id}
                                    <Copy size={12} />
                                </button>
                            </div>
                            {order.paymentReference && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <Hash size={14} />
                                        Reference
                                    </span>
                                    <button
                                        onClick={() => copyToClipboard(order.paymentReference)}
                                        className="font-mono font-medium text-gray-900 hover:text-blue-600 flex items-center gap-1 text-xs"
                                    >
                                        {order.paymentReference}
                                        <Copy size={12} />
                                    </button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Download size={16} />
                                Download Invoice
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Send size={16} />
                                Resend Tickets
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Mail size={16} />
                                Email Customer
                            </Button>
                            {(order.status?.toLowerCase() === 'completed' || order.status?.toLowerCase() === 'paid') && (
                                <Button variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                                    <RefreshCw size={16} />
                                    Process Refund
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ViewOrder;
