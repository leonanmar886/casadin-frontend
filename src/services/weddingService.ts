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
    console.log('Tentando fazer join no casamento com código:', code);
    
    try {
      // Primeira tentativa: rota /weddings/join
      const response = await api.post('/weddings/join', {
        invitationCode: code
      });
      console.log('Resposta do join (join):', response);
      return response.data;
    } catch (error) {
      console.log('Erro na primeira tentativa (join):', error);
      
      try {
        // Segunda tentativa: rota /weddings/invitation
        const response = await api.post('/weddings/invitation', {
          invitationCode: code
        });
        console.log('Resposta do join (invitation):', response);
        return response.data;
      } catch (invitationError) {
        console.log('Erro na segunda tentativa (invitation):', invitationError);
        
        try {
          // Terceira tentativa: formato diferente
          const response = await api.post('/weddings/join', {
            code: code
          });
          console.log('Resposta do join (code):', response);
          return response.data;
        } catch (codeError) {
          console.log('Erro na terceira tentativa (code):', codeError);
          throw codeError; // Re-throw o último erro
        }
      }
    }
  },

  // Buscar casamento pelo código de convite
  getWeddingByCode: async (code: string) => {
    console.log('Buscando casamento pelo código:', code);
    
    try {
      // Primeiro, tentar fazer o join para verificar se o código é válido
      const joinResponse = await api.post('/weddings/join', {
        invitationCode: code
      });
      
      console.log('Resposta do join:', joinResponse);
      
      // Se o join foi bem-sucedido, buscar os detalhes do casamento
      if (joinResponse.data && joinResponse.data.weddingId) {
        const weddingResponse = await api.get(`/weddings/${joinResponse.data.weddingId}`);
        return weddingResponse.data;
      } else {
        // Se não temos o ID, tentar buscar diretamente pelo código
        const response = await api.get(`/weddings/invitation/${code}`);
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao buscar casamento por código:', error);
      throw error;
    }
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

  // Buscar todos os casamentos do usuário e separar por tipo
  getAllMyWeddings: async () => {
    try {
      const response = await api.get('/weddings/my-weddings');
      console.log('Todos os casamentos retornados:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar casamentos:', error);
      return [];
    }
  },

  // Buscar casamentos criados pelo usuário (onde ele é noiva/noivo)
  getMyCreatedWeddings: async () => {
    try {
      const allWeddings = await weddingService.getAllMyWeddings();
      
      // Filtrar apenas os casamentos onde o usuário é criador
      const createdWeddings = allWeddings.filter((wedding: any) => {
        console.log('Verificando casamento:', wedding.coupleName, wedding);
        // Verificar se o usuário é criador baseado em diferentes campos possíveis
        const isCreator = wedding.isCreator === true || 
                         wedding.role === 'fiance' || 
                         wedding.userRole === 'fiance' ||
                         wedding.isOwner === true;
        console.log('É criador?', isCreator);
        return isCreator;
      });
      
      console.log('Casamentos criados filtrados:', createdWeddings);
      return createdWeddings;
    } catch (error) {
      console.error('Erro ao buscar meus casamentos criados:', error);
      return [];
    }
  },

  // Buscar convites do usuário (casamentos que ele tem acesso como convidado)
  getMyInvitations: async () => {
    try {
      const allWeddings = await weddingService.getAllMyWeddings();
      
      // Filtrar apenas os casamentos onde o usuário é convidado
      const invitations = allWeddings.filter((wedding: any) => {
        console.log('Verificando convite:', wedding.coupleName, wedding);
        // Verificar se o usuário é convidado baseado em diferentes campos possíveis
        const isGuest = wedding.isCreator === false || 
                       wedding.role === 'guest' || 
                       wedding.userRole === 'guest' ||
                       wedding.isOwner === false;
        console.log('É convidado?', isGuest);
        return isGuest;
      });
      
      console.log('Convites filtrados:', invitations);
      return invitations;
    } catch (error) {
      console.error('Erro ao buscar convites:', error);
      return [];
    }
  },
};