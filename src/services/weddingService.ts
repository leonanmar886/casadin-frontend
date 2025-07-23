import api from './api';

export const weddingService = {
    joinWedding: async (code: string) => {
        const response = await api.post('/weddings/join', { code });
        return response.data;
    },
}; 