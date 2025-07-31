// Configuração para SDK React do Mercado Pago
import { initMercadoPago } from '@mercadopago/sdk-react';

// Inicializar Mercado Pago SDK React
export const initializeMercadoPagoReact = () => {
  const publicKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || 'APP_USR-1113e820-47c6-4660-a5a9-7dd71351e1ec';
  
  initMercadoPago(publicKey, {
    locale: 'pt-BR'
  });
  
  console.log('Mercado Pago React SDK inicializado com chave:', publicKey);
};

// Configurações de customização do Brick
export const getBrickCustomization = () => ({
  visual: {
    style: {
      theme: 'default',
      customVariables: {
        // Personalizar cores se necessário
        // baseColor: '#1976d2',
        // baseColorSecondary: '#1565c0',
      },
    },
  },
  paymentMethods: {
    maxInstallments: 12, // Permitir até 12x
  },
});

// Configurações de inicialização padrão
export const getDefaultInitialization = (amount: number, payerEmail: string) => ({
  amount: amount,
  payer: {
    email: payerEmail,
  },
}); 