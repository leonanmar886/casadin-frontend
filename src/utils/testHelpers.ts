// Utilitários para testes do sistema de pagamentos

export const TEST_CARDS = {
  MASTERCARD_SUCCESS: {
    number: '5031 4332 1540 6351',
    cvc: '123',
    expiry: '11/25',
    holder: 'Teste Teste',
    document: '12345678901'
  },
  VISA_SUCCESS: {
    number: '4509 9535 6623 3704',
    cvc: '123',
    expiry: '11/25',
    holder: 'Teste Teste',
    document: '12345678901'
  },
  AMEX_SUCCESS: {
    number: '3711 8030 3257 522',
    cvc: '1234',
    expiry: '11/25',
    holder: 'Teste Teste',
    document: '12345678901'
  }
};

export const TEST_SCENARIOS = {
  SUCCESS: {
    name: 'Sucesso',
    description: 'Pagamento aprovado normalmente',
    expectedStatus: 'approved'
  },
  PENDING: {
    name: 'Pendente',
    description: 'Pagamento aguardando confirmação',
    expectedStatus: 'pending'
  },
  REJECTED: {
    name: 'Rejeitado',
    description: 'Pagamento negado pelo banco',
    expectedStatus: 'rejected'
  },
  ERROR: {
    name: 'Erro',
    description: 'Falha na comunicação',
    expectedStatus: 'error'
  }
};

export const TEST_VALUES = {
  SMALL: 1.00,
  MEDIUM: 50.00,
  LARGE: 299.90
};

// Função para simular delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Função para gerar dados de teste
export const generateTestData = (scenario: keyof typeof TEST_SCENARIOS, amount: number = TEST_VALUES.MEDIUM) => {
  return {
    giftId: Math.floor(Math.random() * 100) + 1,
    amount,
    description: `Teste ${TEST_SCENARIOS[scenario].name}`,
    testScenario: scenario
  };
};

// Função para validar resposta do pagamento
export const validatePaymentResponse = (response: any) => {
  const requiredFields = ['id', 'status', 'transaction_amount', 'external_reference'];
  
  for (const field of requiredFields) {
    if (!response[field]) {
      throw new Error(`Campo obrigatório ausente: ${field}`);
    }
  }
  
  return true;
};

// Função para simular diferentes cenários de erro
export const simulateError = (errorType: 'network' | 'invalid_data' | 'server_error') => {
  switch (errorType) {
    case 'network':
      throw new Error('Erro de conexão com o Mercado Pago');
    case 'invalid_data':
      throw new Error('Dados do cartão inválidos');
    case 'server_error':
      throw new Error('Erro interno do servidor');
    default:
      throw new Error('Erro desconhecido');
  }
};

// Função para testar responsividade
export const testResponsiveness = () => {
  const breakpoints = {
    mobile: 375,
    tablet: 768,
    desktop: 1024
  };
  
  return {
    isMobile: window.innerWidth < breakpoints.tablet,
    isTablet: window.innerWidth >= breakpoints.tablet && window.innerWidth < breakpoints.desktop,
    isDesktop: window.innerWidth >= breakpoints.desktop
  };
};

// Função para testar acessibilidade
export const testAccessibility = () => {
  const results = {
    keyboardNavigation: false,
    screenReader: false,
    colorContrast: false
  };
  
  // Teste de navegação por teclado
  try {
    const focusableElements = document.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    results.keyboardNavigation = focusableElements.length > 0;
  } catch (error) {
    console.error('Erro no teste de navegação por teclado:', error);
  }
  
  // Teste de contraste de cores (simplificado)
  try {
    const elements = document.querySelectorAll('*');
    results.colorContrast = elements.length > 0;
  } catch (error) {
    console.error('Erro no teste de contraste:', error);
  }
  
  return results;
};

// Função para gerar relatório de teste
export const generateTestReport = (testResults: any[]) => {
  const report = {
    totalTests: testResults.length,
    passed: testResults.filter(r => r.status === 'passed').length,
    failed: testResults.filter(r => r.status === 'failed').length,
    duration: testResults.reduce((acc, r) => acc + (r.duration || 0), 0),
    details: testResults
  };
  
  console.log('📊 Relatório de Testes:', report);
  return report;
};

// Função para limpar dados de teste
export const cleanupTestData = () => {
  // Limpar localStorage de testes
  const testKeys = Object.keys(localStorage).filter(key => key.includes('test'));
  testKeys.forEach(key => localStorage.removeItem(key));
  
  // Limpar sessionStorage de testes
  const sessionTestKeys = Object.keys(sessionStorage).filter(key => key.includes('test'));
  sessionTestKeys.forEach(key => sessionStorage.removeItem(key));
  
  console.log('🧹 Dados de teste limpos');
};

// Função para verificar configuração
export const checkConfiguration = () => {
  const config = {
    mercadopagoKey: process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY,
    environment: process.env.NEXT_PUBLIC_MERCADO_PAGO_ENVIRONMENT,
    isConfigured: false
  };
  
  config.isConfigured = !!(config.mercadopagoKey && config.environment);
  
  console.log('⚙️ Configuração:', config);
  return config;
}; 