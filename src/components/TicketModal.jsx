import React, { useRef, useState, useEffect } from 'react';
import { X, Download, Share2, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
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
    const [imageLoaded, setImageLoaded] = useState(false);
    const [bannerBase64, setBannerBase64] = useState(null);

    // Convert external image to base64 to avoid CORS issues
    useEffect(() => {
        const imageUrl = ticket?.event?.banner_image || ticket?.event?.image;
        if (imageUrl && imageUrl.startsWith('http')) {
            // Try to load the image and convert to base64
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
                    // CORS blocked, use gradient only
                    setBannerBase64(null);
                }
                setImageLoaded(true);
            };
            img.onerror = () => {
                setBannerBase64(null);
                setImageLoaded(true);
            };
            img.src = imageUrl;
        } else {
            setImageLoaded(true);
        }
    }, [ticket]);

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

    // Status colors using hex values
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

    // Get the image source (use base64 for download, original for display)
    const getBannerSrc = (forCanvas = false) => {
        const original = ticket.event?.banner_image || ticket.event?.image || '/images/event-placeholder.jpg';
        if (forCanvas && bannerBase64) {
            return bannerBase64;
        }
        return original;
    };

    // Generate ticket image using html2canvas
    const generateTicketImage = async () => {
        if (!ticketRef.current) return null;

        try {
            // Wait for QR code to load
            const qrImage = ticketRef.current.querySelector('img[alt="Ticket QR Code"]');
            if (qrImage && !qrImage.complete) {
                await new Promise(resolve => {
                    qrImage.onload = resolve;
                    qrImage.onerror = resolve;
                });
            }

            const canvas = await html2canvas(ticketRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                imageTimeout: 10000,
            });

            return canvas;
        } catch (error) {
            console.error('Error generating ticket image:', error);
            return null;
        }
    };

    // Handle save/download ticket as image
    const handleSaveTicket = async () => {
        setIsGenerating(true);
        try {
            const canvas = await generateTicketImage();
            if (!canvas) {
                showError('Failed to generate ticket image');
                return;
            }

            const link = document.createElement('a');
            link.download = `ticket-${ticket.ticket_code || ticket.id}-${ticket.event?.title?.replace(/\s+/g, '-') || 'event'}.png`;
            link.href = canvas.toDataURL('image/png');
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

    // Handle share ticket as image
    const handleShareTicket = async () => {
        setIsGenerating(true);
        try {
            const canvas = await generateTicketImage();
            if (!canvas) {
                showError('Failed to generate ticket image');
                return;
            }

            const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

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
            const link = document.createElement('a');
            link.download = `ticket-${ticket.ticket_code || ticket.id}.png`;
            link.href = canvas.toDataURL('image/png');
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
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                className="relative w-full max-w-md"
                style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
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
                        {/* Ticket Header */}
                        <div style={{
                            position: 'relative',
                            height: '160px',
                            background: 'linear-gradient(135deg, #f97316, #ea580c)',
                            overflow: 'hidden'
                        }}>
                            {/* Banner Image - use base64 if available */}
                            {(bannerBase64 || getBannerSrc()) && (
                                <img
                                    src={bannerBase64 || getBannerSrc()}
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
                            )}
                            {/* Gradient Overlay */}
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
                                bottom: '12px',
                                left: '12px',
                                right: '12px'
                            }}>
                                <p style={{
                                    color: '#fed7aa',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: '2px'
                                }}>
                                    🎫 E-TICKET
                                </p>
                                <h2 style={{
                                    fontSize: '18px',
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    lineHeight: 1.2,
                                    marginBottom: '2px'
                                }}>
                                    {ticket.event?.title || 'Event'}
                                </h2>
                                <p style={{
                                    color: 'rgba(255,255,255,0.85)',
                                    fontSize: '13px',
                                    fontWeight: 500
                                }}>
                                    {ticket.ticketName || ticket.ticket_type?.name || 'General Admission'}
                                </p>
                            </div>
                        </div>

                        {/* Perforated Edge */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0 4px',
                            marginTop: '-5px',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            {Array(20).fill().map((_, i) => (
                                <div key={i} style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: '#f3f4f6'
                                }} />
                            ))}
                        </div>

                        {/* Ticket Body */}
                        <div style={{ padding: '16px' }}>
                            {/* Event Details */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '10px' }}>
                                    <p style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>
                                        📅 Date
                                    </p>
                                    <p style={{ fontWeight: 600, color: '#111827', fontSize: '13px' }}>
                                        {formatDate(ticket.event?.start_time || ticket.event?.date)}
                                    </p>
                                </div>
                                <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '10px' }}>
                                    <p style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>
                                        ⏰ Time
                                    </p>
                                    <p style={{ fontWeight: 600, color: '#111827', fontSize: '13px' }}>
                                        {formatTime(ticket.event?.start_time) || ticket.event?.time || 'TBD'}
                                    </p>
                                </div>
                                <div style={{ gridColumn: 'span 2', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '10px' }}>
                                    <p style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>
                                        📍 Venue
                                    </p>
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
