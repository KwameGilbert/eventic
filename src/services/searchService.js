import api from "./api";

const searchService = {
  /**
   * Perform global search across events, awards, contestants, and organizers
   * @param {string} query - The search query
   * @returns {Promise<Object>} Search results
   */
  globalSearch: async (query) => {
    try {
      const response = await api.get("/search", {
        params: { query },
      });
      return response.data;
    } catch (error) {
      console.error("Global search error:", error);
      throw error;
    }
  },
};

export default searchService;
