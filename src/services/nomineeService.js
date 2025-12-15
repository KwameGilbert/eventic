import api from './api';

const nomineeService = {
    /**
     * Get all nominees for a category
     */
    getByCategory: async (categoryId, includeStats = false) => {
        try {
            const response = await api.get(`/nominees/award-categories/${categoryId}?include_stats=${includeStats}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get all nominees for an award/event
     */
    getByAward: async (awardId, includeStats = false) => {
        try {
            const response = await api.get(`/nominees/events/${awardId}?include_stats=${includeStats}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get single nominee details
     */
    getById: async (nomineeId, includeStats = false) => {
        try {
            const response = await api.get(`/nominees/${nomineeId}?include_stats=${includeStats}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Create new nominee with image upload
     */
    create: async (categoryId, nomineeData) => {
        try {
            // If nomineeData is FormData, use it directly
            // Otherwise, convert to FormData for file upload support
            let formData = nomineeData;
            if (!(nomineeData instanceof FormData)) {
                formData = new FormData();
                Object.keys(nomineeData).forEach(key => {
                    if (nomineeData[key] !== null && nomineeData[key] !== undefined) {
                        formData.append(key, nomineeData[key]);
                    }
                });
            }

            const response = await api.post(`/nominees/award-categories/${categoryId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Update nominee with image upload
     */
    update: async (nomineeId, nomineeData) => {
        try {
            // If nomineeData is FormData, use it directly
            // Otherwise, convert to FormData for file upload support
            let formData = nomineeData;
            if (!(nomineeData instanceof FormData)) {
                formData = new FormData();
                Object.keys(nomineeData).forEach(key => {
                    if (nomineeData[key] !== null && nomineeData[key] !== undefined) {
                        formData.append(key, nomineeData[key]);
                    }
                });
            }

            // Use POST for update to support file uploads (multipart/form-data)
            const response = await api.post(`/nominees/${nomineeId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Delete nominee
     */
    delete: async (nomineeId) => {
        try {
            const response = await api.delete(`/nominees/${nomineeId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Reorder nominees within a category
     */
    reorder: async (categoryId, nomineeOrders) => {
        try {
            const response = await api.post(`/nominees/award-categories/${categoryId}/reorder`, {
                nominees: nomineeOrders
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get nominee statistics
     */
    getStats: async (nomineeId) => {
        try {
            const response = await api.get(`/nominees/${nomineeId}/stats`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default nomineeService;
