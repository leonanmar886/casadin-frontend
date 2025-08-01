import api from './api';

const TOKEN_KEY = 'auth_token';

interface Godparent {
  name: string;
  photo: string | null;
  relationship: string;
  description: string;
}

interface Gift {
  name: string;
  description: string;
  photo: string;
  price: number;
  store: string;
}

interface PaymentStats {
  id: number;
  name: string;
  price: string;
  amountPaid: string;
  amountRemaining: string;
  isFullyPaid: boolean;
  progressPercentage: number;
  paymentStatus: string;
  paidAt: string | null;
}

interface WeddingData {
  coupleName: string;
  primaryColor: string;
  weddingDate: string;
  weddingLocation: string;
  couplePhotos: string[];
  description: string;
  godparents: Godparent[];
  gifts: Gift[];
  footerPhoto: string;
}

export const weddingService = {
  joinWedding: async (code: string) => {
    const response = await api.post('/weddings/join', {
      invitationCode: code
    });
    console.log(response);

    return response.data;
  },

  createWedding: async (weddingData: WeddingData) => {
    console.log('Creating wedding with data:', weddingData);
    const response = await api.post('/weddings', weddingData);
    return response.data;
  },

  updateWedding: async (id: string, body: any) => {
    return api.patch(`/weddings/${id}`, body);
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),

  getMyWeddings: async () => {
    const response = await api.get('/weddings/my-weddings');
    return response.data;
  },

  getGiftPaymentStats: async (giftId: number): Promise<PaymentStats> => {
    const response = await api.get(`/weddings/gifts/${giftId}/payment-stats`);
    return response.data;
  },
};