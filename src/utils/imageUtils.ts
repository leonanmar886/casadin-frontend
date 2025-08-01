export const base64ToFile = (base64: string, filename: string = 'image.jpg'): File => {
  // Detectar o tipo de imagem do base64
  let mimeType = 'image/jpeg';
  let extension = 'jpg';
  
  if (base64.startsWith('data:')) {
    const match = base64.match(/data:([^;]+);base64,/);
    if (match) {
      mimeType = match[1];
      // Extrair extensão do MIME type
      if (mimeType === 'image/png') {
        extension = 'png';
      } else if (mimeType === 'image/webp') {
        extension = 'webp';
      } else if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
        extension = 'jpg';
      }
    }
  }
  
  // Remover o prefixo data:image/...;base64, se existir
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
  
  // Converter base64 para blob
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  
  // Criar File a partir do blob com a extensão correta
  const finalFilename = filename.replace(/\.[^/.]+$/, `.${extension}`);
  return new File([blob], finalFilename, { type: mimeType });
};

export const isBase64Image = (str: string): boolean => {
  return str.startsWith('data:image');
};

export const blobUrlToBase64 = async (blobUrl: string): Promise<string> => {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Falha ao converter blob para base64'));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler blob'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Erro ao converter blob URL para base64:', error);
    throw error;
  }
};

export const localUrlToBase64 = async (localUrl: string): Promise<string> => {
  try {
    // Se for uma URL local (começa com /), buscar a imagem
    if (localUrl.startsWith('/')) {
      const response = await fetch(localUrl);
      
      // Se a imagem não existir (404), usar uma imagem padrão
      if (!response.ok) {
        console.log(`Imagem local não encontrada: ${localUrl}, usando imagem padrão`);
        // Retornar uma imagem padrão em base64 (1x1 pixel transparente)
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      }
      
      const blob = await response.blob();
      
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Falha ao converter URL local para base64'));
          }
        };
        reader.onerror = () => reject(new Error('Erro ao ler URL local'));
        reader.readAsDataURL(blob);
      });
    }
    
    throw new Error('URL não é local');
  } catch (error) {
    console.error('Erro ao converter URL local para base64:', error);
    // Retornar uma imagem padrão em caso de erro
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }
};

export const shouldUploadImage = (imageUrl: string): boolean => {
  // Se for blob ou base64, precisa fazer upload
  if (imageUrl.startsWith('blob:') || isBase64Image(imageUrl)) {
    return true;
  }
  
  // Se for uma URL local (começa com /), precisa fazer upload
  if (imageUrl.startsWith('/')) {
    return true;
  }
  
  // Se for uma URL externa que não é Cloudinary, pode precisar fazer upload
  if (imageUrl.startsWith('http') && !imageUrl.includes('cloudinary.com')) {
    return true;
  }
  
  // Se já é uma URL do Cloudinary, não precisa fazer upload
  if (imageUrl.includes('cloudinary.com')) {
    return false;
  }
  
  // Por padrão, fazer upload para garantir
  return true;
}; 