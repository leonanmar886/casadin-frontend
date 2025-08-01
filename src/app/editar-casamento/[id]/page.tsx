"use client";
import BestManPhoto from '@/components/BestManPhoto/BestManPhoto';
import ColorPalette from '@/components/ColorPalette/ColorPalette';
import CustomButton from '@/components/CustomButton/CustomButton';
import EditablePhoto from '@/components/EditablePhoto/EditablePhoto';
import GiftManager from '@/components/GiftManager/GiftManager';
import Navbar from '@/components/Navbar/Navbar';
import { useAuth } from "@/hook/useAuth";
import { weddingService } from "@/services/weddingService";
import { base64ToFile, blobUrlToBase64, isBase64Image, localUrlToBase64, shouldUploadImage } from "@/utils/imageUtils";
import EditIcon from '@mui/icons-material/Edit';
import { TextField } from '@mui/material';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  store?: string;
}

interface WeddingData {
  id: number;
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

export default function EditarCasamentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const router = useRouter();
  const [weddingId, setWeddingId] = useState<number | null>(null);

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setWeddingId(parseInt(resolvedParams.id));
    };
    loadParams();
  }, [params]);

  // Refs para navegação
  const homeRef = useRef<HTMLDivElement>(null);
  const casalRef = useRef<HTMLDivElement>(null);
  const padrinhosRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const presentesRef = useRef<HTMLDivElement>(null);

  // Estados do casamento
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Estados do formulário
  const [nomeNoivo, setNomeNoivo] = useState('');
  const [nomeNoiva, setNomeNoiva] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#138263');
  const [dataCasamento, setDataCasamento] = useState('');
  const [datetimeLocal, setDatetimeLocal] = useState('');
  const [localCasamento, setLocalCasamento] = useState('');
  const [textoCasal, setTextoCasal] = useState('');
  const [fotosCasal, setFotosCasal] = useState<string[]>([]);
  const [nomesPadrinhos, setNomesPadrinhos] = useState<string[]>([]);
  const [fotosPadrinhos, setFotosPadrinhos] = useState<(string | null)[]>([]);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [footerPhoto, setFooterPhoto] = useState('');

  // Carregar dados do casamento
  useEffect(() => {
    if (!weddingId) return;
    
    const loadWedding = async () => {
      try {
        const wedding = await weddingService.getWedding(weddingId);
        setWeddingData(wedding);
        
        // Preencher formulário com dados existentes
        const coupleNames = wedding.coupleName.split(' e ');
        setNomeNoivo(coupleNames[0] || '');
        setNomeNoiva(coupleNames[1] || '');
        setPrimaryColor(wedding.primaryColor);
        setDataCasamento(wedding.weddingDate);
        setDatetimeLocal(wedding.weddingDate);
        setLocalCasamento(wedding.weddingLocation);
        setTextoCasal(wedding.description);
        setFotosCasal(wedding.couplePhotos);
        setNomesPadrinhos(wedding.godparents.map((g: { name: string }) => g.name));
        setFotosPadrinhos(wedding.godparents.map((g: { photo: string | null }) => g.photo));
        setProdutos(wedding.gifts.map((gift: { name: string; description: string; photo: string; price: number; store: string }, index: number) => ({
          id: index + 1,
          name: gift.name,
          price: gift.price,
          image: gift.photo,
          description: gift.description,
          store: gift.store
        })));
        setFooterPhoto(wedding.footerPhoto);
      } catch {
        // Erro ao carregar casamento
        alert('Erro ao carregar dados do casamento.');
        router.push('/home');
      } finally {
        setIsLoading(false);
      }
    };

    if (weddingId) {
      loadWedding();
    }
  }, [weddingId, router]);

  // Verificar se o usuário é o dono do casamento
  useEffect(() => {
    if (weddingData && user) {
      // Aqui você pode adicionar lógica para verificar se o usuário é o dono
      // Por enquanto, assumimos que se conseguiu carregar, pode editar
    }
  }, [weddingData, user]);



  // Funções para padrinhos
  const adicionarPadrinho = () => {
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
    setNomesPadrinhos(nomesPadrinhos.filter((_, i) => i !== index));
    setFotosPadrinhos(fotosPadrinhos.filter((_, i) => i !== index));
  };

  // Função para salvar alterações
  const handleSaveWedding = async () => {
    try {
      setIsSaving(true);
      
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
                    } catch {
          return imageUrl;
        }
          }
          
          const file = base64ToFile(base64, filename);
          const result = await uploadFunction(file);
          return result;
        } catch {
          return imageUrl;
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
              } catch {
                return null;
              }
            }
            
            const file = base64ToFile(base64, `couple-photo-${index}.jpg`);
            return file;
          } catch {
            return null;
          }
        })
      );

      const validFiles = couplePhotoFiles.filter(file => file !== null) as File[];
      const uploadedCouplePhotos = await weddingService.uploadCouplePhotos(validFiles);

      // Upload das fotos dos padrinhos
      const uploadedGodparents = await Promise.all(
        nomesPadrinhos.map(async (nome, index) => {
          const photo = fotosPadrinhos[index];
          const uploadedPhoto = photo ? await processImage(photo, `godparent-${index}.jpg`, weddingService.uploadGodparentPhoto) : null;
          
          return {
            name: nome,
            photo: uploadedPhoto,
            relationship: `Padrinho ${index + 1}`,
            description: `Padrinho ${index + 1}`
          };
        })
      );

      // Upload da foto de rodapé
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
        weddingDate: dataCasamento,
        weddingLocation: localCasamento,
        couplePhotos: uploadedCouplePhotos,
        description: textoCasal,
        godparents: uploadedGodparents,
        gifts: uploadedGifts,
        footerPhoto: uploadedFooterPhoto
      };
      
      if (!weddingId) return;
      await weddingService.updateWedding(weddingId, weddingData);
      router.push('/home');
          } catch {
        // Erro ao atualizar casamento
        alert('Erro ao atualizar casamento. Tente novamente.');
      } finally {
      setIsSaving(false);
    }
  };

  // Função para lidar com a seleção de cor da paleta
  const handleColorSelect = (color: string) => {
    setPrimaryColor(color);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Carregando dados do casamento...</p>
      </div>
    );
  }

  if (!weddingData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Casamento não encontrado.</p>
      </div>
    );
  }

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
              setDataCasamento(e.target.value);
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent',
                },
              },
              '& .MuiInputBase-input': {
                fontSize: 18,
                color: '#888',
                textAlign: 'center',
                border: 'none',
                background: 'transparent',
                outline: 'none',
              },
            }}
          />
          <EditIcon sx={{ color: '#888', fontSize: 18 }} />
        </div>
      </section>

      {/* Seção do casal com fotos */}
      <section ref={casalRef} style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>FOTOS DO CASAL</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {fotosCasal.map((foto, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <EditablePhoto
                src={foto}
                alt={`Foto do casal ${index + 1}`}
                width={200}
                height={200}
                style={{ borderRadius: 16, objectFit: 'cover' }}
                onPhotoChange={(newPhoto) => {
                  const novasFotos = [...fotosCasal];
                  novasFotos[index] = newPhoto;
                  setFotosCasal(novasFotos);
                }}
                editable={true}
              />
            </div>
          ))}
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #ccc',
              color: '#666',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onClick={() => setFotosCasal([...fotosCasal, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='])}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Adicionar foto</div>
            </div>
          </div>
        </div>
      </section>

      {/* Paleta de cores */}
      <section style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>PALETA DE CORES</h1>
        <ColorPalette onColorSelect={handleColorSelect} primaryColor={primaryColor} />
      </section>

      {/* Seção dos padrinhos */}
      <section ref={padrinhosRef} style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>PADRINHOS</h1>
        {nomesPadrinhos.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: 40,
            border: '2px dashed #ccc',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onClick={adicionarPadrinho}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>👥</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: '#666', marginBottom: 8 }}>
            Clique para adicionar seus padrinhos
          </div>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 16, 
          maxWidth: 1200, 
          margin: '0 auto' 
        }}>
          {nomesPadrinhos.map((nome, idx) => (
            <div key={`padrinho-${idx}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <BestManPhoto
                text={nome}
                size={80}
                editable={true}
                showDelete={true}
                initialPhoto={fotosPadrinhos[idx]}
                index={idx}
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
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        <button
          onClick={adicionarPadrinho}
          style={{
            background: primaryColor,
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
        >
          Adicionar padrinho
        </button>
      </div>
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
        disabled={isSaving}
      >
        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
      </CustomButton>
    </div>
  </div>
  );
} 