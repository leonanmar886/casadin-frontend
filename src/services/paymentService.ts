import api from './api';

export interface CreatePaymentDto {
  giftId: number;
  amount: number;
  method: 'pix' | 'card';
  cardToken?: string;
  payerEmail: string;
}

export interface MercadoPagoPaymentResponse {
  id: number;
  status: string;
  status_detail?: string;
  payment_method_id: string;
  payment_type_id: string;
  transaction_amount: number;
  date_created: string;
  date_approved?: string;
  external_reference: string;
  point_of_interaction?: {
    transaction_data?: {
      qr_code?: string;
      qr_code_base64?: string;
      ticket_url?: string;
    };
  };
  description?: string;
  [key: string]: unknown;
}

export interface PaymentStatusResponse {
  id: number;
  status: string;
  transaction_amount: number;
  external_reference: string;
  date_created: string;
}

export const paymentService = {
  // Criar pagamento (Pix ou Cartão)
  createPayment: async (paymentData: CreatePaymentDto): Promise<MercadoPagoPaymentResponse> => {
    const response = await api.post('/weddings/payments', paymentData);
    return response.data;
  },

  // Consultar status de pagamento
  getPaymentStatus: async (paymentId: number): Promise<PaymentStatusResponse> => {
    const response = await api.get(`/weddings/payments/status/${paymentId}`);
    return response.data;
  },

  // Criar pagamento Pix
  createPixPayment: async (giftId: number, amount: number, payerEmail: string): Promise<MercadoPagoPaymentResponse> => {
    return paymentService.createPayment({
      giftId,
      amount,
      method: 'pix',
      payerEmail
    });
  },

  // Criar pagamento com cartão
  createCardPayment: async (giftId: number, amount: number, cardToken: string, payerEmail: string): Promise<MercadoPagoPaymentResponse> => {
    return paymentService.createPayment({
      giftId,
      amount,
      method: 'card',
      cardToken,
      payerEmail
    });
  },

  // Monitorar status de pagamento com polling
  pollPaymentStatus: async (
    paymentId: number,
    onStatusChange: (status: PaymentStatusResponse) => void,
    onComplete: (status: string) => void,
    intervalMs: number = 5000
  ): Promise<NodeJS.Timeout> => {
    const interval = setInterval(async () => {
      try {
        const status = await paymentService.getPaymentStatus(paymentId);
        onStatusChange(status);

        if (status.status === 'approved') {
          clearInterval(interval);
          onComplete('approved');
        } else if (status.status === 'rejected' || status.status === 'cancelled') {
          clearInterval(interval);
          onComplete(status.status);
        }
      } catch (error) {
        console.error('Erro ao consultar status do pagamento:', error);
      }
    }, intervalMs);

    return interval;
  },

  getToken: () => localStorage.getItem('auth_token'),
}; 