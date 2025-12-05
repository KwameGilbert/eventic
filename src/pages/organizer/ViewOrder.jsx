import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    User,
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
    DollarSign,
    Hash
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const ViewOrder = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [openDropdown, setOpenDropdown] = useState(false);

    // Mock order data - would be fetched from API
    const order = {
        id: 'ORD-001248',
        referenceNumber: 'REF-8X7KL2M9',
        customer: {
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+1 234 567 8900',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff'
        },
        event: {
            id: 1,
            name: 'Summer Music Festival 2024',
            date: '2024-06-15',
            time: '18:00',
            venue: 'Central Park Amphitheater',
            address: '123 Park Avenue, New York, NY 10001',
            image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop'
        },
        tickets: [
            {
                id: 'TKT-001',
                name: 'VIP Pass',
                quantity: 2,
                unitPrice: 150,
                total: 300,
                qrCodes: ['QR-VIP-001', 'QR-VIP-002']
            },
            {
                id: 'TKT-002',
                name: 'General Admission',
                quantity: 1,
                unitPrice: 59,
                total: 59,
                qrCodes: ['QR-GA-001']
            }
        ],
        subtotal: 359,
        fees: 17.95,
        tax: 28.72,
        discount: 0,
        totalAmount: 405.67,
        status: 'Completed',
        paymentMethod: 'Credit Card',
        cardLast4: '4242',
        cardBrand: 'Visa',
        transactionId: 'txn_1234567890',
        orderDate: '2024-05-28T14:32:00',
        paidAt: '2024-05-28T14:32:15',
        notes: '',
        timeline: [
            { action: 'Order placed', date: '2024-05-28T14:32:00', status: 'completed' },
            { action: 'Payment received', date: '2024-05-28T14:32:15', status: 'completed' },
            { action: 'Tickets sent', date: '2024-05-28T14:32:30', status: 'completed' },
            { action: 'Confirmation email sent', date: '2024-05-28T14:33:00', status: 'completed' },
        ]
    };

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'destructive';
            case 'refunded': return 'info';
            default: return 'secondary';
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return <CheckCircle size={16} />;
            case 'pending': return <Clock size={16} />;
            case 'cancelled': return <XCircle size={16} />;
            case 'refunded': return <RefreshCw size={16} />;
            default: return <AlertCircle size={16} />;
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateStr) => {
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Could add toast notification here
    };

    const totalTickets = order.tickets.reduce((sum, t) => sum + t.quantity, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/organizer/orders')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">{order.id}</h1>
                            <Badge variant={getStatusStyle(order.status)} className="gap-1">
                                {getStatusIcon(order.status)}
                                {order.status}
                            </Badge>
                        </div>
                        <p className="text-gray-500 mt-1">
                            Placed on {formatDateTime(order.orderDate)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
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
                            variant="outline"
                            size="icon"
                            onClick={() => setOpenDropdown(!openDropdown)}
                        >
                            <MoreVertical size={16} />
                        </Button>
                        {openDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                                <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <Mail size={14} />
                                    Email Customer
                                </button>
                                <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Event Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                <img
                                    src={order.event.image}
                                    alt={order.event.name}
                                    className="w-32 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <Link
                                        to={`/organizer/events/${order.event.id}`}
                                        className="font-semibold text-gray-900 hover:text-(--brand-primary) transition-colors"
                                    >
                                        {order.event.name}
                                    </Link>
                                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            {formatDate(order.event.date)} at {formatTime(order.event.time)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-gray-400" />
                                            {order.event.venue}
                                        </div>
                                    </div>
                                </div>
                                <Link to={`/organizer/events/${order.event.id}`}>
                                    <Button variant="outline" size="sm" className="gap-1">
                                        <ExternalLink size={14} />
                                        View Event
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tickets */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TicketCheck size={20} className="text-(--brand-primary)" />
                                Tickets ({totalTickets})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.tickets.map((ticket, index) => (
                                    <div
                                        key={ticket.id}
                                        className="p-4 border border-gray-200 rounded-lg"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{ticket.name}</h4>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    ${ticket.unitPrice.toFixed(2)} × {ticket.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-gray-900">
                                                ${ticket.total.toFixed(2)}
                                            </p>
                                        </div>

                                        {/* QR Codes */}
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <p className="text-xs text-gray-500 mb-2">Ticket Codes:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {ticket.qrCodes.map((qr, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => copyToClipboard(qr)}
                                                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-600 hover:bg-gray-200 transition-colors"
                                                    >
                                                        {qr}
                                                        <Copy size={10} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Service Fees</span>
                                    <span className="text-gray-900">${order.fees.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="text-gray-900">${order.tax.toFixed(2)}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-600">Discount</span>
                                        <span className="text-green-600">-${order.discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <hr />
                                <div className="flex justify-between text-lg font-semibold">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-(--brand-primary)">${order.totalAmount.toFixed(2)}</span>
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
                                {order.timeline.map((item, index) => (
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
                                <img
                                    src={order.customer.avatar}
                                    alt={order.customer.name}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <p className="font-semibold text-gray-900">{order.customer.name}</p>
                                    <p className="text-sm text-gray-500">Customer</p>
                                </div>
                            </div>
                            <hr />
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail size={16} className="text-gray-400" />
                                    <a href={`mailto:${order.customer.email}`} className="text-gray-600 hover:text-(--brand-primary)">
                                        {order.customer.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone size={16} className="text-gray-400" />
                                    <a href={`tel:${order.customer.phone}`} className="text-gray-600 hover:text-(--brand-primary)">
                                        {order.customer.phone}
                                    </a>
                                </div>
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
                                        <p className="font-medium text-gray-900">{order.cardBrand} •••• {order.cardLast4}</p>
                                        <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                                    </div>
                                </div>
                                <Badge variant="success">Paid</Badge>
                            </div>
                            <hr />
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Transaction ID</span>
                                    <button
                                        onClick={() => copyToClipboard(order.transactionId)}
                                        className="font-mono text-gray-900 hover:text-(--brand-primary) flex items-center gap-1"
                                    >
                                        {order.transactionId.slice(0, 12)}...
                                        <Copy size={12} />
                                    </button>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Paid at</span>
                                    <span className="text-gray-900">{formatDateTime(order.paidAt)}</span>
                                </div>
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
                                    onClick={() => copyToClipboard(order.id)}
                                    className="font-mono font-medium text-gray-900 hover:text-(--brand-primary) flex items-center gap-1"
                                >
                                    {order.id}
                                    <Copy size={12} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center gap-2">
                                    <Hash size={14} />
                                    Reference
                                </span>
                                <button
                                    onClick={() => copyToClipboard(order.referenceNumber)}
                                    className="font-mono font-medium text-gray-900 hover:text-(--brand-primary) flex items-center gap-1"
                                >
                                    {order.referenceNumber}
                                    <Copy size={12} />
                                </button>
                            </div>
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
                            {order.status === 'Completed' && (
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
