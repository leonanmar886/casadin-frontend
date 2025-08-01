"use client"
import BestManPhoto from '@/components/BestManPhoto/BestManPhoto';
import ColorPalette from '@/components/ColorPalette';
import CountdownTimer from '@/components/CountdownTimer';
import CustomButton from '@/components/CustomButton/CustomButton';
import EditablePhoto from '@/components/EditablePhoto';
import FiancePhoto from '@/components/FiancePhoto/FiancePhoto';
import GiftManager from '@/components/GiftManager';
import Navbar from '@/components/Navbar';
import { Product } from '@/components/Product';
import { weddingService } from '@/services/weddingService';
import { base64ToFile, blobUrlToBase64, isBase64Image, localUrlToBase64, shouldUploadImage } from '@/utils/imageUtils';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  store?: string;
}

export default function CriarCasamentoPage() {
  const [nomeNoivo, setNomeNoivo] = useState('Fulano');
  const [nomeNoiva, setNomeNoiva] = useState('Fulana');
  const [dataCasamento, setDataCasamento] = useState('29 de Abril de 2026 às 16h');
  const [textoCasal, setTextoCasal] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed bibendum odio sem, in accumsan lacus vestibulum tincidunt. Pellentesque vitae faucibus mauris. Integer elit urna, egestas vel nibh non, tristique egestas diam.');
  const [localCasamento, setLocalCasamento] = useState('Igreja Nossa Senhora de Fátima - Bairro de Fátima');
  const [isLoading, setIsLoading] = useState(false);
  const [footerPhoto, setFooterPhoto] = useState('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  const [nomesPadrinhos, setNomesPadrinhos] = useState<string[]>([]);
  const [fotosCasal, setFotosCasal] = useState<string[]>([
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  ]);
  const homeRef = useRef<HTMLDivElement>(null);
  const casalRef = useRef<HTMLDivElement>(null);
  const padrinhosRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const presentesRef = useRef<HTMLDivElement>(null);
  const [fotosPadrinhos, setFotosPadrinhos] = useState<(string | null)[]>(Array(nomesPadrinhos.length).fill(null));
  const router = useRouter();

  // Verificar duplicações nos padrinhos
  useEffect(() => {
    const uniqueNomesPadrinhos = nomesPadrinhos.filter((nome, index, self) => 
      index === self.findIndex(n => n === nome)
    );
    
    if (uniqueNomesPadrinhos.length !== nomesPadrinhos.length) {
      setNomesPadrinhos(uniqueNomesPadrinhos);
      // Manter as fotos correspondentes aos nomes únicos
      const uniqueFotos = uniqueNomesPadrinhos.map((nome) => {
        const originalIndex = nomesPadrinhos.indexOf(nome);
        return fotosPadrinhos[originalIndex];
      });
      setFotosPadrinhos(uniqueFotos);
    }
  }, [nomesPadrinhos, fotosPadrinhos]);

  const adicionarPadrinho = () => {
    // Verificar se já existe um padrinho com o mesmo nome para evitar duplicações
    const novoNome = `Padrinho ${nomesPadrinhos.length + 1}`;
    const existingPadrinho = nomesPadrinhos.find(nome => nome === novoNome);
    
    if (existingPadrinho) {
      const uniqueName = `Padrinho ${Date.now()}`;
      setNomesPadrinhos([...nomesPadrinhos, uniqueName]);
    } else {
      setNomesPadrinhos([...nomesPadrinhos, novoNome]);
    }
    setFotosPadrinhos([...fotosPadrinhos, null]);
  };

  const removerPadrinho = (index: number) => {
    const novosNomes = nomesPadrinhos.filter((_, idx) => idx !== index);
    const novasFotos = fotosPadrinhos.filter((_, idx) => idx !== index);
    setNomesPadrinhos(novosNomes);
    setFotosPadrinhos(novasFotos);
  };

  // Função para converter data brasileira para formato datetime-local
  const brazilianDateToDatetimeLocal = (brazilianDate: string): string => {
    const months: { [key: string]: number } = {
      'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
      'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
      'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
    };

    const match = brazilianDate.match(/(\d+)\s+de\s+(\w+)\s+de\s+(\d+)\s+às\s+(\d+)h/);

    if (match) {
      const [, day, month, year, hour] = match;
      const monthIndex = months[month.toLowerCase()];

      if (monthIndex !== undefined) {
        const date = new Date(parseInt(year), monthIndex, parseInt(day), parseInt(hour), 0, 0);
        return date.toISOString().slice(0, 16); // Formato YYYY-MM-DDTHH:MM
      }
    }

    // Fallback: retorna data atual + 1 ano
    const fallbackDate = new Date();
    fallbackDate.setFullYear(fallbackDate.getFullYear() + 1);
    return fallbackDate.toISOString().slice(0, 16);
  };

  // Função para converter datetime-local para formato brasileiro
  const datetimeLocalToBrazilian = (datetimeLocal: string): string => {
    const date = new Date(datetimeLocal);
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();

    return `${day} de ${month} de ${year} às ${hour}h`;
  };

  // Estado para o input datetime-local
  const [datetimeLocal, setDatetimeLocal] = useState(brazilianDateToDatetimeLocal(dataCasamento));

  // Estado para a cor principal do tema
  const [primaryColor, setPrimaryColor] = useState('#138263');
  // Estado para o código do casamento (inicialmente da primeira cor)
  const [weddingCode] = useState('ROSA123');

  // Dados mock para os produtos da lista de presentes
  const [produtos, setProdutos] = useState<Product[]>([
    // Array vazio - sem dados mocados
  ]);

  // Função para converter data brasileira para formato ISO
  const brazilianDateToISO = (brazilianDate: string): string => {
    const months: { [key: string]: number } = {
      'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
      'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
      'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
    };

    const match = brazilianDate.match(/(\d+)\s+de\s+(\w+)\s+de\s+(\d+)\s+às\s+(\d+)h/);

    if (match) {
      const [, day, month, year, hour] = match;
      const monthIndex = months[month.toLowerCase()];
      if (monthIndex !== undefined) {
        const date = new Date(parseInt(year), monthIndex, parseInt(day), parseInt(hour), 0, 0);
        return date.toISOString();
      }
    }
    return new Date().toISOString();
  };

  // Função para salvar os dados do casamento
  const handleSaveWedding = async () => {
    try {
      setIsLoading(true);
      
      // Função auxiliar para processar imagem
      const processImage = async (imageUrl: string, filename: string, uploadFunction: (file: File) => Promise<string>) => {
        
        if (!shouldUploadImage(imageUrl)) {
          return imageUrl;
        }
        
        try {
          let base64: string;
          
          if (imageUrl.startsWith('blob:')) {
            base64 = await blobUrlToBase64(imageUrl);
          } else if (imageUrl.startsWith('/')) {
            base64 = await localUrlToBase64(imageUrl);
          } else if (isBase64Image(imageUrl)) {
            base64 = imageUrl;
          } else {
            // Para URLs externas, tentar converter para base64
            try {
              const response = await fetch(imageUrl);
              const blob = await response.blob();
              base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  if (typeof reader.result === 'string') {
                    resolve(reader.result);
                  } else {
                    reject(new Error('Falha ao converter URL externa para base64'));
                  }
                };
                reader.onerror = () => reject(new Error('Erro ao ler URL externa'));
                reader.readAsDataURL(blob);
              });
            } catch (error) {
              return imageUrl; // Fallback para o valor original
            }
          }
          
          const file = base64ToFile(base64, filename);
          
          const result = await uploadFunction(file);
          return result;
        } catch (error) {
          return imageUrl; // Fallback para o valor original
        }
      };
      
      // Upload das fotos do casal
      const couplePhotoFiles = await Promise.all(
        fotosCasal.map(async (photo, index) => {
          
          if (!shouldUploadImage(photo)) {
            return null;
          }
          
          try {
            let base64: string;
            
            if (photo.startsWith('blob:')) {
              base64 = await blobUrlToBase64(photo);
            } else if (photo.startsWith('/')) {
              base64 = await localUrlToBase64(photo);
            } else if (isBase64Image(photo)) {
              base64 = photo;
            } else {
              // Para URLs externas, tentar converter para base64
              try {
                const response = await fetch(photo);
                const blob = await response.blob();
                base64 = await new Promise<string>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                      resolve(reader.result);
                    } else {
                      reject(new Error('Falha ao converter URL externa para base64'));
                    }
                  };
                  reader.onerror = () => reject(new Error('Erro ao ler URL externa'));
                  reader.readAsDataURL(blob);
                });
              } catch (error) {
                return null; // Fallback para o valor original
              }
            }
            
            const file = base64ToFile(base64, `couple-photo-${index}.jpg`);
            
            return file;
          } catch (error) {
            return null; // Fallback para o valor original
          }
        })
      );
      
      // Filtrar arquivos válidos e fazer upload
      const validFiles = couplePhotoFiles.filter(file => file !== null) as File[];
      const uploadedCouplePhotos = await weddingService.uploadCouplePhotos(validFiles);

      // Upload das fotos dos padrinhos
      const uploadedGodparents = await Promise.all(
        nomesPadrinhos.map(async (nome, index) => {
          const photo = fotosPadrinhos[index];
          const uploadedPhoto = photo ? 
            await processImage(photo, `godparent-photo-${index}.jpg`, weddingService.uploadGodparentPhoto) : 
            null;
          
          return {
            name: nome,
            photo: uploadedPhoto,
            relationship: `Padrinho ${index + 1}`,
            description: `Padrinho ${index + 1}`
          };
        })
      );

      // Upload da foto do footer
      const uploadedFooterPhoto = await processImage(
        footerPhoto, 
        'footer-photo.jpg', 
        weddingService.uploadFooterPhoto
      );

      // Upload das fotos dos presentes
      const uploadedGifts = await Promise.all(
        produtos.map(async (produto) => {
          const uploadedImage = await processImage(
            produto.image,
            `gift-${produto.id}.jpg`,
            weddingService.uploadGiftPhoto
          );
          
          return {
            name: produto.name,
            description: produto.description || produto.name,
            photo: uploadedImage,
            price: produto.price,
            store: produto.store || 'Loja Online'
          };
        })
      );

      const weddingData = {
        coupleName: `${nomeNoivo} e ${nomeNoiva}`,
        primaryColor: primaryColor,
        weddingDate: brazilianDateToISO(dataCasamento),
        weddingLocation: localCasamento,
        couplePhotos: uploadedCouplePhotos,
        description: textoCasal,
        godparents: uploadedGodparents,
        gifts: uploadedGifts,
        footerPhoto: uploadedFooterPhoto
      };
      
      await weddingService.createWedding(weddingData);
      router.push('/home'); // Redireciona para a página home
    } catch (error) {
      alert('Erro ao salvar casamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com a seleção de cor da paleta
  const handleColorSelect = (color: string) => {
    setPrimaryColor(color);
  };

  return (
    <div ref={homeRef} style={{ background: '#F8F8F8', minHeight: '100vh', paddingTop: '66.6px' }}>
      {/* Header */}
      <Navbar
        primaryColor={primaryColor}
        showScrollNav={true}
        homeRef={homeRef}
        casalRef={casalRef}
        padrinhosRef={padrinhosRef}
        infoRef={infoRef}
        presentesRef={presentesRef}
        showAvatar={false}
      />

      {/* Seção do casal */}
      <section style={{ background: '#fff', padding: 64, textAlign: 'center', position: 'relative' }}>
        <h1 style={{ fontSize: 36, fontWeight: 400, margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              type="text"
              value={nomeNoivo}
              onChange={e => setNomeNoivo(e.target.value)}
              style={{
                fontSize: 36,
                fontWeight: 400,
                textAlign: 'center',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: nomeNoivo.length > 0 ? nomeNoivo.length * 20 : 80,
                minWidth: 80,
                maxWidth: 300
              }}
            />
            <EditIcon sx={{ color: '#2563eb', fontSize: 20 }} />
          </span>
          &
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              type="text"
              value={nomeNoiva}
              onChange={e => setNomeNoiva(e.target.value)}
              style={{
                fontSize: 36,
                fontWeight: 400,
                textAlign: 'center',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: nomeNoiva.length > 0 ? nomeNoiva.length * 20 : 80,
                minWidth: 80,
                maxWidth: 300
              }}
            />
            <EditIcon sx={{ color: '#2563eb', fontSize: 20 }} />
          </span>
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
          <Image src="/flores-nova.png" alt="Flores" width={310} height={205} style={{ width: 'auto', height: 'auto' }} />
        </div>
        <div style={{ fontSize: 18, color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <TextField
            type="datetime-local"
            value={datetimeLocal}
            onChange={(e) => {
              setDatetimeLocal(e.target.value);
              setDataCasamento(datetimeLocalToBrazilian(e.target.value));
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#888',
                fontSize: 18,
                textAlign: 'center',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputBase-input': {
                textAlign: 'center',
                padding: '8px 12px',
                width: '200px',
              },
            }}
            InputLabelProps={{
              shrink: false,
            }}
          />
          <EditIcon sx={{ color: '#2563eb', fontSize: 18 }} />
        </div>
        <ColorPalette
          colors={['#EE5D99', '#78B6F0', '#FFB469', '#6CA370', '#A396DB', '#F6F688']}
          weddingCode={weddingCode}
          onColorSelect={handleColorSelect}
          primaryColor={primaryColor}
        />
      </section>

      {/* Contagem regressiva */}
      <section style={{ background: primaryColor, color: '#fff', padding: 32, textAlign: 'center' }}>
        <CountdownTimer targetDate={dataCasamento} size="large" />
      </section>

      {/* O Casal */}
      <section ref={casalRef} style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>O CASAL</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 24 }}>
          <FiancePhoto
            text={nomeNoivo}
            editable={true}
            initialPhoto={fotosCasal[0]}
            onPhotoChange={url => {
              const novas = [...fotosCasal];
              novas[0] = url;
              setFotosCasal(novas);
            }}
          />
          <FiancePhoto
            text={nomeNoiva}
            editable={true}
            initialPhoto={fotosCasal[1]}
            onPhotoChange={url => {
              const novas = [...fotosCasal];
              novas[1] = url;
              setFotosCasal(novas);
            }}
          />
        </div>
        <div style={{ maxWidth: 700, margin: '0 auto', color: '#555', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <textarea
            value={textoCasal}
            onChange={e => setTextoCasal(e.target.value)}
            style={{
              fontSize: 16,
              color: '#555',
              width: '100%',
              minHeight: 80,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              padding: 0,
              margin: 10
            }}
          />
          <EditIcon sx={{ color: '#2563eb', fontSize: 18 }} />
        </div>
      </section>

      {/* Os Padrinhos */}
      <section ref={padrinhosRef} style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>OS PADRINHOS</h1>
        {nomesPadrinhos.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            maxWidth: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: 16
            }}>
              <div
                style={{ 
                  width: 120, 
                  height: 120, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  border: '2px dashed #ccc',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: 48, 
                  color: '#999',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={adicionarPadrinho}
                title="Adicionar padrinho"
              >
                👥
              </div>
              <div style={{ 
                marginTop: 8, 
                fontSize: 16, 
                color: '#666',
                textAlign: 'center',
                maxWidth: 200
              }}>
                Clique para adicionar seus padrinhos
              </div>
            </div>
            <div
              style={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                background: '#E6F4EA', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: 32, 
                color: '#138263', 
                cursor: 'pointer',
                                 transition: 'all 0.2s'
              }}
              onClick={adicionarPadrinho}
            >
              +
            </div>
            <div style={{ marginTop: 8, fontSize: 14, color: '#138263' }}>Adicionar padrinho</div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 32,
            justifyContent: 'center',
            marginBottom: 16,
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            {nomesPadrinhos.map((nome, idx) => (
              <div key={`padrinho-${idx}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <BestManPhoto
                  text={nome}
                  size={80}
                  editable={true}
                  showDelete={true}
                  index={idx}
                  initialPhoto={fotosPadrinhos[idx]}
                  onPhotoChange={(photoUrl) => {
                    const novasFotos = [...fotosPadrinhos];
                    novasFotos[idx] = photoUrl;
                    setFotosPadrinhos(novasFotos);
                  }}
                  onNameChange={(newName) => {
                    const novosNomes = [...nomesPadrinhos];
                    novosNomes[idx] = newName;
                    setNomesPadrinhos(novosNomes);
                  }}
                  onDelete={() => removerPadrinho(idx)}
                />
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div
                style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  background: '#E6F4EA', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: 32, 
                  color: '#138263', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={adicionarPadrinho}
              >
                +
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>Adicionar padrinho</div>
            </div>
          </div>
        )}
      </section>

      {/* Informações */}
      <section ref={infoRef} style={{ background: primaryColor, color: '#fff', padding: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>INFORMAÇÕES</h1>
        <div style={{ fontSize: 18, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <input
            type="text"
            value={localCasamento}
            onChange={e => setLocalCasamento(e.target.value)}
            style={{
              fontSize: 18,
              textAlign: 'center',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              color: '#fff',
              width: localCasamento.length > 0 ? localCasamento.length * 12 : 300,
              minWidth: 300,
              maxWidth: 600
            }}
          />
          <EditIcon sx={{ color: '#fff', fontSize: 18 }} />
        </div>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
        <Image src="/flores-nova.png" alt="Flores" width={310} height={205} style={{ width: 'auto', height: 'auto' }} />
      </div>
        <div style={{ fontSize: 18 }}>{dataCasamento}</div>
      </section>

      {/* Lista de Presentes */}
      <section ref={presentesRef} style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>LISTA DE PRESENTES</h1>
        <GiftManager
          gifts={produtos}
          onGiftsChange={setProdutos}
          primaryColor={primaryColor}
        />
      </section>

      {/* Mensagem final */}
      <section style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>CONTAMOS COM SUA PRESENÇA!</h1>
        <div style={{ margin: '0 auto 16px', maxWidth: 600 }}>
          <EditablePhoto
            src={footerPhoto}
            alt="Casal"
            width={600}
            height={200}
            style={{ borderRadius: 16, objectFit: 'cover' }}
            onPhotoChange={setFooterPhoto}
            editable={true}
          />
        </div>
        <div style={{ color: '#555', fontSize: 16 }}>Com carinho, {nomeNoivo} & {nomeNoiva}.</div>
      </section>

      <div style={{ background: '#fff', display: 'flex', justifyContent: 'center', padding: 32 }}>
        <CustomButton
          sx={{
            width: 376,
            maxWidth: '100%',
            height: 87,
            borderRadius: '27.3px',
            background: 'linear-gradient(180deg, #CDF5EA 0%, #FFFFFF 44.23%)',
            color: '#0B6D51',
            fontFamily: 'var(--font-figtree)',
            fontWeight: 300,
            fontSize: 28,
            boxShadow: '0px 2.664px 2.664px rgba(0, 0, 0, 0.15)',
            textTransform: 'none',
            mt: 1,
            ':hover': {
              background: 'linear-gradient(180deg, #CDF5EA 0%, #FFFFFF 44.23%)',
              opacity: 0.9,
            },
          }}
          onClick={handleSaveWedding}
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </CustomButton>
      </div>
    </div>
  );
}