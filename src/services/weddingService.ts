import api from './api';

const TOKEN_KEY = 'auth_token';


export const weddingService = {
    joinWedding: async (code: string) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) throw new Error('Token não encontrado');
        const response = await api.post(
            '/weddings/join',
            {
                invitationCode: code
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log(response);

        return response.data;
    },

    getToken: () => localStorage.getItem(TOKEN_KEY),
}; 