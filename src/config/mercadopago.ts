// Configuração do Mercado Pago
// Substitua estas chaves pelas suas chaves reais do Mercado Pago

export const MERCADO_PAGO_CONFIG = {
  // Chave pública do Mercado Pago
  // Para testes: TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  // Para produção: APP-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  PUBLIC_KEY: process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || 'APP-4eb2d0a5-0c3d-4c3a-8c3d-4c3a8c3d4c3a',
  
  // Ambiente (sandbox ou production)
  ENVIRONMENT: process.env.NEXT_PUBLIC_MERCADO_PAGO_ENVIRONMENT || 'production',
  
  // URLs de redirecionamento
  SUCCESS_URL: process.env.NEXT_PUBLIC_MERCADO_PAGO_SUCCESS_URL || 'https://seusite.com.br/success',
  FAILURE_URL: process.env.NEXT_PUBLIC_MERCADO_PAGO_FAILURE_URL || 'https://seusite.com.br/failure',
  PENDING_URL: process.env.NEXT_PUBLIC_MERCADO_PAGO_PENDING_URL || 'https://seusite.com.br/pending',
};

// Função para obter a chave pública baseada no ambiente
export const getMercadoPagoPublicKey = (): string => {
  // Se a variável de ambiente estiver definida, use ela
  if (process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY) {
    return process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;
  }
  
  // Para desenvolvimento local, usar chave de teste
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'TEST-4eb2d0a5-0c3d-4c3a-8c3d-4c3a8c3d4c3a';
  }
  
  // Para produção, usar chave de produção
  return 'APP_USR-1113e820-47c6-4660-a5a9-7dd71351e1ec';
};

// Função para verificar se está em modo de teste
export const isTestMode = (): boolean => {
  return MERCADO_PAGO_CONFIG.ENVIRONMENT === 'sandbox';
};

// Configurações específicas para cada ambiente
export const MERCADO_PAGO_ENVIRONMENTS = {
  sandbox: {
    name: 'Sandbox (Teste)',
    description: 'Ambiente de testes - use cartões de teste',
    publicKey: 'TEST-d10a348d-8231-4aa6-8c8a-1754c91bd06c',
  },
  production: {
    name: 'Produção',
    description: 'Ambiente de produção - pagamentos reais',
    publicKey: 'APP_USR-1113e820-47c6-4660-a5a9-7dd71351e1ec',
  },
}; 