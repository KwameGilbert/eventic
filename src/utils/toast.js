/**
 * Toast Utility
 * 
 * SweetAlert2 toast mixins for consistent notifications
 * using the Eventic orange theme.
 */

import Swal from 'sweetalert2';

// Brand colors
const BRAND_ORANGE = '#FF6B35';
const BRAND_ORANGE_DARK = '#E55A2B';

/**
 * Toast Mixin - Small notification at the top-right
 */
export const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    customClass: {
        popup: 'colored-toast',
    },
});

/**
 * Success Toast
 * @param {string} message - Success message to display
 */
export const showSuccess = (message) => {
    return Toast.fire({
        icon: 'success',
        title: message,
        iconColor: BRAND_ORANGE,
    });
};

/**
 * Error Toast
 * @param {string} message - Error message to display
 */
export const showError = (message) => {
    return Toast.fire({
        icon: 'error',
        title: message,
    });
};

/**
 * Info Toast
 * @param {string} message - Info message to display
 */
export const showInfo = (message) => {
    return Toast.fire({
        icon: 'info',
        title: message,
        iconColor: BRAND_ORANGE,
    });
};

/**
 * Warning Toast
 * @param {string} message - Warning message to display
 */
export const showWarning = (message) => {
    return Toast.fire({
        icon: 'warning',
        title: message,
        iconColor: BRAND_ORANGE,
    });
};

/**
 * Loading Toast
 * @param {string} message - Loading message to display
 */
export const showLoading = (message = 'Processing...') => {
    return Swal.fire({
        title: message,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
};

/**
 * Close any open loading dialog
 */
export const hideLoading = () => {
    Swal.close();
};

/**
 * Confirmation Dialog with Orange Theme
 * @param {Object} options - Dialog options
 * @param {string} options.title - Dialog title
 * @param {string} options.text - Dialog text
 * @param {string} options.confirmButtonText - Confirm button text
 * @param {string} options.cancelButtonText - Cancel button text
 * @param {string} options.icon - Icon type
 * @returns {Promise<SweetAlertResult>}
 */
export const showConfirm = ({
    title,
    text,
    confirmButtonText = 'Yes, proceed',
    cancelButtonText = 'Cancel',
    icon = 'question',
}) => {
    return Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonColor: BRAND_ORANGE,
        cancelButtonColor: '#9ca3af',
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true,
    });
};

/**
 * Payment Confirmation Dialog
 * Special dialog for confirming payment before proceeding to Paystack
 * @param {Object} options - Payment details
 * @param {string} options.amount - Formatted amount string (e.g., "GH₵50.00")
 * @param {string} options.email - Customer email
 * @param {number} options.itemCount - Number of tickets
 * @returns {Promise<SweetAlertResult>}
 */
export const showPaymentConfirm = ({ amount, email, itemCount }) => {
    return Swal.fire({
        title: 'Confirm Payment',
        html: `
            <div style="text-align: left; padding: 10px 0;">
                <p style="margin-bottom: 12px;">You are about to pay:</p>
                <div style="background: linear-gradient(135deg, ${BRAND_ORANGE}, ${BRAND_ORANGE_DARK}); 
                            color: white; 
                            padding: 20px; 
                            border-radius: 12px; 
                            text-align: center;
                            margin-bottom: 16px;">
                    <div style="font-size: 32px; font-weight: bold;">${amount}</div>
                    <div style="font-size: 14px; opacity: 0.9; margin-top: 4px;">
                        for ${itemCount} ticket${itemCount > 1 ? 's' : ''}
                    </div>
                </div>
                <p style="font-size: 13px; color: #666;">
                    Receipt will be sent to: <strong>${email}</strong>
                </p>
            </div>
        `,
        icon: 'info',
        iconColor: BRAND_ORANGE,
        showCancelButton: true,
        confirmButtonColor: BRAND_ORANGE,
        cancelButtonColor: '#9ca3af',
        confirmButtonText: '💳 Pay Now',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
    });
};

/**
 * Payment Success Dialog
 * @param {Object} options - Success details
 * @param {string} options.reference - Payment reference
 * @param {string} options.orderId - Order ID
 */
export const showPaymentSuccess = ({ reference, orderId }) => {
    return Swal.fire({
        title: 'Payment Successful! 🎉',
        html: `
            <div style="text-align: center;">
                <p style="margin-bottom: 16px; color: #4B5563;">
                    Your tickets have been confirmed!
                </p>
                <div style="background: #F3F4F6; padding: 12px; border-radius: 8px; font-size: 13px;">
                    <p style="margin: 4px 0;"><strong>Order ID:</strong> #${orderId}</p>
                    <p style="margin: 4px 0;"><strong>Reference:</strong> ${reference}</p>
                </div>
                <p style="margin-top: 16px; font-size: 13px; color: #6B7280;">
                    You will be redirected to your tickets shortly.
                </p>
            </div>
        `,
        icon: 'success',
        iconColor: BRAND_ORANGE,
        confirmButtonColor: BRAND_ORANGE,
        confirmButtonText: 'View My Tickets',
        timer: 5000,
        timerProgressBar: true,
    });
};

/**
 * Order Created Dialog - Before Payment
 * @param {Object} options - Order details
 * @param {string} options.orderId - Order ID
 * @param {string} options.amount - Formatted amount
 * @returns {Promise<SweetAlertResult>}
 */
export const showOrderCreated = ({ orderId, amount }) => {
    return Swal.fire({
        title: 'Order Created!',
        html: `
            <div style="text-align: center;">
                <div style="background: linear-gradient(135deg, ${BRAND_ORANGE}, ${BRAND_ORANGE_DARK}); 
                            color: white; 
                            padding: 16px; 
                            border-radius: 12px; 
                            margin-bottom: 16px;">
                    <p style="margin: 0; font-size: 14px;">Order #${orderId}</p>
                    <p style="margin: 8px 0 0 0; font-size: 24px; font-weight: bold;">${amount}</p>
                </div>
                <p style="color: #4B5563;">
                    Click <strong>Proceed to Pay</strong> to complete your purchase via Paystack.
                </p>
            </div>
        `,
        icon: 'success',
        iconColor: BRAND_ORANGE,
        showCancelButton: true,
        confirmButtonColor: BRAND_ORANGE,
        cancelButtonColor: '#9ca3af',
        confirmButtonText: 'Proceed to Pay 💳',
        cancelButtonText: 'Cancel Order',
        reverseButtons: true,
        allowOutsideClick: false,
    });
};

export default {
    Toast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    hideLoading,
    showConfirm,
    showPaymentConfirm,
    showPaymentSuccess,
    showOrderCreated,
};
