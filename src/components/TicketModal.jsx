import React, { useRef, useState, useEffect } from 'react';
import { X, Download, Share2, Loader2, Ticket, Calendar, Clock, MapPin } from 'lucide-react';
import { domToPng, domToBlob } from 'modern-screenshot';
import { showSuccess, showError } from '../utils/toast';
import PropTypes from 'prop-types';

/**
 * TicketModal Component
 * Displays a ticket with QR code and allows saving/sharing as an image
 * Uses inline hex colors for html2canvas compatibility
 */
const TicketModal = ({ ticket, onClose }) => {
    const ticketRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [bannerBase64, setBannerBase64] = useState(null);

    // Convert external image to base64 using backend API (bypasses CORS)
    useEffect(() => {
        const imageUrl = ticket?.event?.banner_image || ticket?.event?.image;
        if (imageUrl && imageUrl.startsWith('http')) {
            // Use backend API to convert image to base64 (no CORS issues on server)
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const encodedUrl = encodeURIComponent(imageUrl);

            fetch(`${apiUrl}/v1/utils/image-to-base64?url=${encodedUrl}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.data?.base64) {
                        setBannerBase64(data.data.base64);
                    } else {
                        // Fallback: try client-side conversion (might fail due to CORS)
                        fallbackClientConversion(imageUrl);
                    }
                })
                .catch(() => {
                    // Fallback: try client-side conversion
                    fallbackClientConversion(imageUrl);
                });
        }
    }, [ticket]);

    // Fallback client-side image conversion (may fail due to CORS)
    const fallbackClientConversion = (imageUrl) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const base64 = canvas.toDataURL('image/jpeg', 0.8);
                setBannerBase64(base64);
            } catch {
                setBannerBase64(null);
            }
        };
        img.onerror = () => setBannerBase64(null);
        img.src = imageUrl;
    };

    if (!ticket) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColors = (status) => {
        switch (status) {
            case 'active':
                return { bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e', label: 'Active' };
            case 'used':
                return { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6', label: 'Used' };
            case 'cancelled':
                return { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444', label: 'Cancelled' };
            case 'expired':
                return { bg: '#f3f4f6', text: '#4b5563', dot: '#6b7280', label: 'Expired' };
            default:
                return { bg: '#f3f4f6', text: '#4b5563', dot: '#6b7280', label: status || 'Unknown' };
        }
    };

    const getBannerSrc = () => {
        const original = ticket.event?.banner_image || ticket.event?.image || '/images/event-placeholder.jpg';
        return bannerBase64 || original;
    };

    // Filter function to skip external images that would cause CORS errors
    const imageFilter = (node) => {
        // Skip img elements with external URLs (except QR code)
        if (node.tagName === 'IMG') {
            const src = node.getAttribute('src') || '';
            // Allow QR codes (they have CORS headers)
            if (src.includes('qrserver.com')) return true;
            // Allow base64 images
            if (src.startsWith('data:')) return true;
            // Allow local images
            if (src.startsWith('/')) return true;
            // Skip all other external images
            if (src.startsWith('http')) return false;
        }
        return true;
    };

    const handleSaveTicket = async () => {
        setIsGenerating(true);
        try {
            if (!ticketRef.current) {
                showError('Failed to generate ticket image');
                return;
            }

            const dataUrl = await domToPng(ticketRef.current, {
                scale: 2,
                quality: 1,
                filter: imageFilter,
            });

            const link = document.createElement('a');
            link.download = `ticket-${ticket.ticket_code || ticket.id}-${ticket.event?.title?.replace(/\s+/g, '-') || 'event'}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showSuccess('Ticket saved successfully!');
        } catch (error) {
            console.error('Error saving ticket:', error);
            showError('Failed to save ticket');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShareTicket = async () => {
        setIsGenerating(true);
        try {
            if (!ticketRef.current) {
                showError('Failed to generate ticket image');
                return;
            }

            const blob = await domToBlob(ticketRef.current, {
                scale: 2,
                quality: 1,
                filter: imageFilter,
            });

            if (!blob) {
                showError('Failed to generate ticket image');
                return;
            }

            if (navigator.share && navigator.canShare) {
                const file = new File([blob], `ticket-${ticket.id}.png`, { type: 'image/png' });
                const shareData = {
                    title: `Ticket for ${ticket.event?.title}`,
                    text: `My ticket for ${ticket.event?.title}`,
                    files: [file],
                };

                if (navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                    showSuccess('Ticket shared successfully!');
                    return;
                }
            }

            // Fallback: Download
            const dataUrl = await domToPng(ticketRef.current, { scale: 2, filter: imageFilter });
            const link = document.createElement('a');
            link.download = `ticket-${ticket.ticket_code || ticket.id}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showSuccess('Ticket image downloaded. You can now share it manually.');
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error sharing ticket:', error);
                showError('Failed to share ticket');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const statusColors = getStatusColors(ticket.status);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative w-full max-w-md" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 rounded-full transition-colors"
                        style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                    >
                        <X size={20} color="#ffffff" />
                    </button>

                    {/* Ticket Content */}
                    <div ref={ticketRef} style={{ backgroundColor: '#ffffff' }}>
                        {/* Ticket Header with perforated edge built-in */}
                        <div style={{ position: 'relative' }}>
                            {/* Header Image Area */}
                            <div style={{
                                height: '160px',
                                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <img
                                    src={getBannerSrc()}
                                    alt=""
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        opacity: 0.4
                                    }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)'
                                }} />
                                {/* Ticket ID Badge */}
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    left: '12px',
                                    backgroundColor: 'rgba(255,255,255,0.95)',
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: '#1f2937'
                                }}>
                                    #{String(ticket.id).toUpperCase()}
                                </div>
                                {/* Event Info */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '16px',
                                    left: '12px',
                                    right: '12px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        color: '#fed7aa',
                                        fontSize: '10px',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        marginBottom: '2px'
                                    }}>
                                        <Ticket size={12} color="#fed7aa" />
                                        <span>E-TICKET</span>
                                    </div>
                                    <h2 style={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                        color: '#ffffff',
                                        lineHeight: 1.0,
                                        marginBottom: '0px'
                                    }}>
                                        {ticket.event?.title || 'Event'}
                                    </h2>
                                    <p style={{
                                        color: 'rgba(255,255,255,0.85)',
                                        fontSize: '12px',
                                        fontWeight: 500
                                    }}>
                                        {ticket.ticketName || ticket.ticket_type?.name || 'General Admission'}
                                    </p>
                                </div>
                            </div>

                            {/* Perforated Edge - positioned at the bottom of header */}
                            <div style={{
                                position: 'absolute',
                                bottom: '4px',
                                left: 0,
                                right: 0,
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0 2px',
                                zIndex: 10
                            }}>
                                {Array(22).fill().map((_, i) => (
                                    <div key={i} style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        backgroundColor: '#ffffff'
                                    }} />
                                ))}
                            </div>
                        </div>

                        {/* Ticket Body */}
                        <div style={{ padding: '16px 16px 16px 16px' }}>
                            {/* Event Details */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                                        <Calendar size={12} color="#6b7280" />
                                        <p style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>
                                            Date
                                        </p>
                                    </div>
                                    <p style={{ fontWeight: 600, color: '#111827', fontSize: '13px' }}>
                                        {formatDate(ticket.event?.start_time || ticket.event?.date)}
                                    </p>
                                </div>
                                <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                                        <Clock size={12} color="#6b7280" />
                                        <p style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>
                                            Time
                                        </p>
                                    </div>
                                    <p style={{ fontWeight: 600, color: '#111827', fontSize: '13px' }}>
                                        {formatTime(ticket.event?.start_time) || ticket.event?.time || 'TBD'}
                                    </p>
                                </div>
                                <div style={{ gridColumn: 'span 2', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                                        <MapPin size={12} color="#6b7280" />
                                        <p style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>
                                            Venue
                                        </p>
                                    </div>
                                    <p style={{ fontWeight: 600, color: '#111827', fontSize: '13px' }}>
                                        {ticket.event?.venue_name || ticket.event?.venue || 'TBD'}
                                    </p>
                                </div>
                            </div>

                            {/* Status */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                backgroundColor: statusColors.bg,
                                marginBottom: '12px'
                            }}>
                                <span style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: statusColors.dot
                                }} />
                                <span style={{ fontWeight: 600, fontSize: '13px', color: statusColors.text }}>
                                    Status: {statusColors.label}
                                </span>
                            </div>

                            {/* QR Code */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '12px',
                                border: '2px dashed #e5e7eb',
                                borderRadius: '12px',
                                backgroundColor: '#ffffff',
                                marginBottom: '12px'
                            }}>
                                <div style={{
                                    width: '140px',
                                    height: '140px',
                                    backgroundColor: '#ffffff',
                                    padding: '6px',
                                    borderRadius: '8px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    marginBottom: '8px'
                                }}>
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket.qrCode || ticket.ticket_code || ticket.id}`}
                                        alt="Ticket QR Code"
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </div>
                                <p style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 700, color: '#374151' }}>
                                    {ticket.ticket_code || ticket.qrCode}
                                </p>
                                <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>
                                    Scan at entrance
                                </p>
                            </div>

                            {/* Order Reference */}
                            {ticket.order && (
                                <div style={{
                                    backgroundColor: '#fff7ed',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    border: '1px solid #ffedd5',
                                    marginBottom: '12px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: '#c2410c', fontWeight: 500, fontSize: '12px' }}>Order Reference</span>
                                        <span style={{ fontFamily: 'monospace', color: '#7c2d12', fontWeight: 700, fontSize: '12px' }}>
                                            {ticket.order.reference}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Branding */}
                            <div style={{ textAlign: 'center', paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
                                <p style={{ fontSize: '11px', color: '#9ca3af' }}>
                                    Powered by <span style={{ fontWeight: 700, color: '#f97316' }}>Eventic</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ padding: '12px 16px', backgroundColor: '#ffffff' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <button
                                onClick={handleSaveTicket}
                                disabled={isGenerating}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#f97316', color: '#ffffff' }}
                            >
                                {isGenerating ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Download size={18} />
                                )}
                                <span>Save</span>
                            </button>
                            <button
                                onClick={handleShareTicket}
                                disabled={isGenerating}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#ffffff', color: '#f97316', border: '2px solid #f97316' }}
                            >
                                {isGenerating ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Share2 size={18} />
                                )}
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

TicketModal.propTypes = {
    ticket: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default TicketModal;
