import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface SearchParams {
  text?: string;
  startDate?: string;
  endDate?: string;
  color?: string;
  category?: string;
  upcoming?: boolean;
}

export const searchService = {
  searchEvents: async (token: string, params: SearchParams) => {
    const queryParams = new URLSearchParams();

    if (params.text) queryParams.append('text', params.text);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.color) queryParams.append('color', params.color);
    if (params.category) queryParams.append('category', params.category);
    if (params.upcoming !== undefined) queryParams.append('upcoming', String(params.upcoming));

    const response = await axios.get(`${API_URL}/events/search?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.events;
  },
};
