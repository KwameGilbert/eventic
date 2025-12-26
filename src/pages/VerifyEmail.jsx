import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import api from '../services/api';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error, already_verified
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        const emailParam = searchParams.get('email');

        if (!token || !emailParam) {
            setStatus('error');
            setMessage('Invalid verification link. Missing token or email.');
            return;
        }

        setEmail(emailParam);
        verifyEmail(token, emailParam);
    }, [searchParams]);

    const verifyEmail = async (token, email) => {
        try {
            const response = await api.get('/auth/verify-email', {
                params: { token, email }
            });

            if (response.success) {
                if (response.message.includes('already')) {
                    setStatus('already_verified');
                } else {
                    setStatus('success');
                }
                setMessage(response.message);
            } else {
                setStatus('error');
                setMessage(response.message || 'Verification failed');
            }
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'An error occurred during verification');
        }
    };

    const handleResendVerification = async () => {
        if (!email) return;

        try {
            setStatus('verifying');
            const response = await api.post('/auth/resend-verification', { email });

            if (response.success) {
                setStatus('resent');
                setMessage('A new verification email has been sent to your inbox.');
            } else {
                setStatus('error');
                setMessage(response.message || 'Failed to resend verification email');
            }
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Failed to resend verification email');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    {/* Logo */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Eventic
                        </h1>
                    </div>

                    {/* Verifying State */}
                    {status === 'verifying' && (
                        <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Verifying your email...
                            </h2>
                            <p className="text-gray-500">
                                Please wait while we verify your email address.
                            </p>
                        </div>
                    )}

                    {/* Success State */}
                    {status === 'success' && (
                        <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Email Verified!
                            </h2>
                            <p className="text-gray-500">
                                {message || 'Your email has been successfully verified. You can now enjoy all features of Eventic.'}
                            </p>
                            <div className="pt-4">
                                <Button
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-red-600 hover:bg-red-700 gap-2"
                                >
                                    Continue to Login
                                    <ArrowRight size={16} />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Already Verified State */}
                    {status === 'already_verified' && (
                        <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Already Verified
                            </h2>
                            <p className="text-gray-500">
                                Your email address has already been verified. You can proceed to use your account.
                            </p>
                            <div className="pt-4">
                                <Button
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-red-600 hover:bg-red-700 gap-2"
                                >
                                    Go to Login
                                    <ArrowRight size={16} />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {status === 'error' && (
                        <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Verification Failed
                            </h2>
                            <p className="text-gray-500">
                                {message || 'We could not verify your email. The link may be invalid or expired.'}
                            </p>
                            <div className="pt-4 space-y-3">
                                {email && (
                                    <Button
                                        onClick={handleResendVerification}
                                        variant="outline"
                                        className="w-full gap-2"
                                    >
                                        <Mail size={16} />
                                        Resend Verification Email
                                    </Button>
                                )}
                                <Button
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-red-600 hover:bg-red-700"
                                >
                                    Back to Login
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Resent State */}
                    {status === 'resent' && (
                        <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                                <Mail className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Email Sent!
                            </h2>
                            <p className="text-gray-500">
                                {message || 'A new verification email has been sent. Please check your inbox and spam folder.'}
                            </p>
                            <div className="pt-4">
                                <Button
                                    onClick={() => navigate('/login')}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Back to Login
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Need help?{' '}
                            <Link to="/contact" className="text-red-600 hover:underline">
                                Contact Support
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
