import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Mail, X } from 'lucide-react';
import { Button } from '../ui/button';
import { showSuccess, showError } from '../../utils/toast';

/**
 * EmailAttendeesModal
 * Modal for composing and sending emails to selected attendees
 */
const EmailAttendeesModal = ({ isOpen, onClose, attendees = [], onSend }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();

        if (!subject.trim()) {
            showError('Please enter an email subject');
            return;
        }

        if (!message.trim()) {
            showError('Please enter an email message');
            return;
        }

        try {
            setSending(true);

            // Call the onSend callback if provided
            if (onSend) {
                await onSend({ subject, message, attendees });
            }

            showSuccess(`Email sent successfully to ${attendees.length} attendee${attendees.length > 1 ? 's' : ''}`);

            // Reset form and close
            setSubject('');
            setMessage('');
            onClose();
        } catch (error) {
            console.error('Email send error:', error);
            showError(error.message || 'Failed to send email');
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Email Attendees</h2>
                            <p className="text-sm text-gray-500">
                                Sending to {attendees.length} attendee{attendees.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                        disabled={sending}
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSend} className="flex-1 overflow-y-auto">
                    <div className="px-6 py-4 space-y-4">
                        {/* Recipients Preview */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Recipients
                            </label>
                            <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                                <div className="flex flex-wrap gap-2">
                                    {attendees.slice(0, 10).map((attendee, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                                        >
                                            {attendee.name || attendee.email}
                                        </span>
                                    ))}
                                    {attendees.length > 10 && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                            +{attendees.length - 10} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                Subject *
                            </label>
                            <input
                                id="subject"
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                placeholder="Enter email subject"
                                required
                                disabled={sending}
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                Message *
                            </label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={8}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                                placeholder="Enter your message..."
                                required
                                disabled={sending}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                You can use basic formatting and links in your email message.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={sending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={sending}
                            className="gap-2"
                        >
                            {sending ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Mail className="w-4 h-4" />
                                    Send Email
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

EmailAttendeesModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    attendees: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
    })),
    onSend: PropTypes.func,
};

export default EmailAttendeesModal;
