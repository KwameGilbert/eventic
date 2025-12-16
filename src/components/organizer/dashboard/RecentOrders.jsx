import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { ArrowRight, Clock } from 'lucide-react';
import PropTypes from 'prop-types';

const RecentOrders = ({ orders }) => {
    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'destructive';
            case 'refunded': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Recent Orders</CardTitle>
                    <Button variant="link" size="sm" className="text-xs gap-1">
                        View All
                        <ArrowRight size={12} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {orders.map((order, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                            {/* Customer Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
                                <img
                                    src={order.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.customer)}&background=f97316&color=fff`}
                                    alt={order.customer}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Order Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-(--brand-primary) transition-colors">
                                        {order.customer}
                                    </p>
                                    <Badge variant={getStatusStyle(order.status)} className="text-[10px] px-1.5 py-0">
                                        {order.status}
                                    </Badge>
                                </div>
                                <p className="text-xs text-gray-500 truncate mt-0.5">
                                    {order.event} · {order.tickets} ticket{order.tickets > 1 ? 's' : ''}
                                </p>
                            </div>

                            {/* Amount & Time */}
                            <div className="text-right shrink-0">
                                <p className="text-sm font-semibold text-gray-900">${order.amount}</p>
                                <p className="text-xs text-gray-400 flex items-center justify-end gap-1 mt-0.5">
                                    <Clock size={10} />
                                    {order.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

RecentOrders.propTypes = {
    orders: PropTypes.arrayOf(
        PropTypes.shape({
            customer: PropTypes.string.isRequired,
            event: PropTypes.string.isRequired,
            tickets: PropTypes.number.isRequired,
            amount: PropTypes.number.isRequired,
            time: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
            avatar: PropTypes.string,
        })
    ).isRequired,
};

export default RecentOrders;
