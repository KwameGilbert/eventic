import api from './api';

const categoryService = {
    /**
     * Get all categories for an award/event
     */
    getByAward: async (awardId, includeResults = false) => {
        try {
            const response = await api.get(`/award-categories/events/${awardId}?include_results=${includeResults}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get single category details
     */
    getById: async (categoryId, includeResults = false) => {
        try {
            const response = await api.get(`/award-categories/${categoryId}?include_results=${includeResults}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Create new category
     */
    create: async (awardId, categoryData) => {
        try {
            const response = await api.post(`/award-categories/events/${awardId}`, categoryData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Update category
     */
    update: async (categoryId, categoryData) => {
        try {
            const response = await api.put(`/award-categories/${categoryId}`, categoryData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Delete category
     */
    delete: async (categoryId) => {
        try {
            const response = await api.delete(`/award-categories/${categoryId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Reorder categories
     */
    reorder: async (awardId, categoryOrders) => {
        try {
            const response = await api.post(`/award-categories/events/${awardId}/reorder`, {
                categories: categoryOrders
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get category statistics
     */
    getStats: async (categoryId) => {
        try {
            const response = await api.get(`/award-categories/${categoryId}/stats`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default categoryService;
