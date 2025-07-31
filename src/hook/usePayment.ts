import { useCallback, useState } from 'react';
import { MercadoPagoPaymentResponse, paymentService, PaymentStatusResponse } from '../services/paymentService';
import { useAuth } from './useAuth';

interface UsePaymentReturn {
  loading: boolean;
  error: string | null;
  createPixPayment: (giftId: number, amount: number, payerEmail: string) => Promise<MercadoPagoPaymentResponse | null>;
  createCardPayment: (giftId: number, amount: number, cardToken: string, payerEmail: string) => Promise<MercadoPagoPaymentResponse | null>;
  getPaymentStatus: (paymentId: number) => Promise<PaymentStatusResponse | null>;
  pollPaymentStatus: (
    paymentId: number,
    onStatusChange: (status: PaymentStatusResponse) => void,
    onComplete: (status: string) => void,
    intervalMs?: number
  ) => Promise<NodeJS.Timeout>;
  clearError: () => void;
}

export function usePayment(): UsePaymentReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createPixPayment = useCallback(async (
    giftId: number, 
    amount: number, 
    payerEmail: string
  ): Promise<MercadoPagoPaymentResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const payment = await paymentService.createPixPayment(giftId, amount, payerEmail);
      return payment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar pagamento Pix';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCardPayment = useCallback(async (
    giftId: number, 
    amount: number, 
    cardToken: string, 
    payerEmail: string
  ): Promise<MercadoPagoPaymentResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const payment = await paymentService.createCardPayment(giftId, amount, cardToken, payerEmail);
      return payment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar pagamento com cartão';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentStatus = useCallback(async (
    paymentId: number
  ): Promise<PaymentStatusResponse | null> => {
    setError(null);
    
    try {
      const status = await paymentService.getPaymentStatus(paymentId);
      return status;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao consultar status do pagamento';
      setError(errorMessage);
      return null;
    }
  }, []);

  const pollPaymentStatus = useCallback(async (
    paymentId: number,
    onStatusChange: (status: PaymentStatusResponse) => void,
    onComplete: (status: string) => void,
    intervalMs: number = 5000
  ): Promise<NodeJS.Timeout> => {
    return paymentService.pollPaymentStatus(paymentId, onStatusChange, onComplete, intervalMs);
  }, []);

  return {
    loading,
    error,
    createPixPayment,
    createCardPayment,
    getPaymentStatus,
    pollPaymentStatus,
    clearError,
  };
} 