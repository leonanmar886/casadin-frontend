import api from './api';

const TOKEN_KEY = 'auth_token';

interface WeddingData {
  coupleName: string;
  primaryColor: string;
  weddingDate: string;
  weddingLocation: string;
  couplePhotos: string[];
  description: string;
  godparents: Array<{
    name: string;
    photo: string | null;
    relationship: string;
    description: string;
  }>;
  gifts: Array<{
    name: string;
    description: string;
    photo: string;
    price: number;
    store: string;
  }>;
  footerPhoto: string;
}

interface UploadResponse {
  url: string;
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

interface UploadMultipleResponse {
  urls: string[];
}

export const weddingService = {
  createWedding: async (weddingData: WeddingData) => {
    const response = await api.post('/weddings', weddingData);
    return response.data;
  },

  joinWedding: async (code: string) => {
    const response = await api.post('/weddings/join', { code });
    return response.data;
  },

  getWedding: async (id: number) => {
    const response = await api.get(`/weddings/${id}`);
    return response.data;
  },

  getMyWeddings: async () => {
    const response = await api.get('/weddings/my-weddings');
    return response.data;
  },

  getGiftPaymentStats: async (giftId: number): Promise<PaymentStats> => {
    const response = await api.get(`/weddings/gifts/${giftId}/payment-stats`);
    return response.data;
  },

  // Funções para upload de fotos
  uploadGiftPhoto: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await api.post<UploadResponse>('/weddings/upload/gift-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.url;
  },

  uploadGodparentPhoto: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await api.post<UploadResponse>('/weddings/upload/godparent-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.url;
  },

  uploadFooterPhoto: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await api.post<UploadResponse>('/weddings/upload/footer-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.url;
  },

  uploadCouplePhotos: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('photos', file);
    });
    
    const response = await api.post<UploadMultipleResponse>('/weddings/upload/couple-photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.urls;
  },

  deleteWedding: async (id: number) => {
    const response = await api.delete(`/weddings/${id}`);
    return response.data;
  },

  updateWedding: async (id: number, weddingData: WeddingData) => {
    const response = await api.patch(`/weddings/${id}`, weddingData);
    return response.data;
  },
};