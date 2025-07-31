"use client"
import Product from '@/components/Product';
import Image from 'next/image';
import { useState, useRef } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import FiancePhoto from '@/components/FiancePhoto/FiancePhoto';
import BestManPhoto from '@/components/BestManPhoto/BestManPhoto';
import CountdownTimer from '@/components/CountdownTimer';
import CustomButton from '@/components/CustomButton/CustomButton';
import TextField from '@mui/material/TextField';
import ColorPalette from '@/components/ColorPalette';
import { weddingService } from '@/services/weddingService';
import Navbar from '@/components/Navbar';
import EditablePhoto from '@/components/EditablePhoto';

export default function CriarCasamentoPage() {
  const [nomeNoivo, setNomeNoivo] = useState('Fulano');
  const [nomeNoiva, setNomeNoiva] = useState('Fulana');
  const [dataCasamento, setDataCasamento] = useState('29 de Abril de 2026 às 16h');
  const [textoCasal, setTextoCasal] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed bibendum odio sem, in accumsan lacus vestibulum tincidunt. Pellentesque vitae faucibus mauris. Integer elit urna, egestas vel nibh non, tristique egestas diam.');
  const [localCasamento, setLocalCasamento] = useState('Igreja Nossa Senhora de Fátima - Bairro de Fátima');
  const [isLoading, setIsLoading] = useState(false);
  const [footerPhoto, setFooterPhoto] = useState('/casal1.jpg');
  const [nomesPadrinhos, setNomesPadrinhos] = useState([
    'Padrinho 1',
    'Padrinho 2',
    'Padrinho 3',
    'Padrinho 4',
    'Padrinho 5',
  ]);
  const homeRef = useRef<HTMLDivElement>(null);
  const casalRef = useRef<HTMLDivElement>(null);
  const padrinhosRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const presentesRef = useRef<HTMLDivElement>(null);
  const [fotosPadrinhos, setFotosPadrinhos] = useState<(string | null)[]>(Array(nomesPadrinhos.length).fill(null));

  const adicionarPadrinho = () => {
    const novoNome = `Padrinho ${nomesPadrinhos.length + 1}`;
    setNomesPadrinhos([...nomesPadrinhos, novoNome]);
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
  const [produtos, setProdutos] = useState([
    { id: 1, name: 'Air Fryer', price: 299.90, image: '/airfryer.png' },
    { id: 2, name: 'Jogo de Panelas', price: 450.00, image: '/airfryer.png' },
    { id: 3, name: 'Mixer', price: 180.00, image: '/airfryer.png' },
    { id: 4, name: 'Jogo de Copos', price: 120.00, image: '/airfryer.png' },
    { id: 5, name: 'Toalhas de Banho', price: 89.90, image: '/airfryer.png' },
    { id: 6, name: 'Jogo de Lençóis', price: 220.00, image: '/airfryer.png' },
    { id: 7, name: 'Aspirador de Pó', price: 350.00, image: '/airfryer.png' },
    { id: 8, name: 'Jogo de Pratos', price: 280.00, image: '/airfryer.png' },
  ]);

  // Funções para editar produtos
  const handleProductNameChange = (id: number, newName: string) => {
    setProdutos(produtos.map(produto => 
      produto.id === id ? { ...produto, name: newName } : produto
    ));
  };

  const handleProductPriceChange = (id: number, newPrice: number) => {
    setProdutos(produtos.map(produto => 
      produto.id === id ? { ...produto, price: newPrice } : produto
    ));
  };

  const handleProductImageChange = (id: number, newImage: string) => {
    setProdutos(produtos.map(produto => 
      produto.id === id ? { ...produto, image: newImage } : produto
    ));
  };

  const handleProductDelete = (id: number) => {
    setProdutos(produtos.filter(produto => produto.id !== id));
  };

  const adicionarProduto = () => {
    const novoId = Math.max(...produtos.map(p => p.id)) + 1;
    const novoProduto = {
      id: novoId,
      name: 'Novo Produto',
      price: 0,
      image: '/airfryer.png'
    };
    setProdutos([...produtos, novoProduto]);
  };

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
      
      const weddingData = {
        coupleName: `${nomeNoivo} e ${nomeNoiva}`,
        primaryColor: primaryColor,
        weddingDate: brazilianDateToISO(dataCasamento),
        weddingLocation: localCasamento,
        couplePhotos: [], // Por enquanto vazio, pode ser implementado depois
        description: textoCasal,
        godparents: nomesPadrinhos.map((nome, index) => ({
          name: nome,
          photo: fotosPadrinhos[index] || null,
          relationship: `Padrinho ${index + 1}`,
          description: `Padrinho ${index + 1}`
        })),
        gifts: produtos.map(produto => ({
          name: produto.name,
          description: produto.name,
          photo: produto.image,
          price: produto.price,
          store: 'Loja Online'
        })),
        footerPhoto: footerPhoto
      };

      await weddingService.createWedding(weddingData);
      alert('Casamento salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar casamento:', error);
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
          <Image src="/flores-nova.png" alt="Flores" width={310} height={205} />
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 32 }}>
            <FiancePhoto text={nomeNoivo} />
            <FiancePhoto text={nomeNoiva} />
          </div>
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 120,
          justifyContent: 'center',
          marginBottom: 16,
          maxWidth: 400,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          {nomesPadrinhos.map((nome, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <BestManPhoto
                text={nome}
                size={80}
                editable={true}
                showDelete={true}
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
              style={{ width: 80, height: 80, borderRadius: '50%', background: '#E6F4EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#138263', cursor: 'pointer' }}
              onClick={adicionarPadrinho}
            >+</div>
            <div>Adicionar padrinho</div>
          </div>
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
          <Image src="/flores-nova.png" alt="Flores" width={310} height={205} />
        </div>
        <div style={{ fontSize: 18 }}>{dataCasamento}</div>
      </section>

      {/* Lista de Presentes */}
      <section ref={presentesRef} style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>LISTA DE PRESENTES</h1>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 24,
          justifyContent: 'center',
          marginBottom: 16,
          maxWidth: 1200,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          {produtos.map((produto) => (
            <div key={produto.id} style={{ margin: 8 }}>
              <Product
                id={produto.id}
                name={produto.name}
                price={produto.price}
                image={produto.image}
                editable={true}
                showDelete={true}
                onNameChange={(newName) => handleProductNameChange(produto.id, newName)}
                onPriceChange={(newPrice) => handleProductPriceChange(produto.id, newPrice)}
                onImageChange={(newImage) => handleProductImageChange(produto.id, newImage)}
                onDelete={() => handleProductDelete(produto.id)}
              />
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 8 }}>
            <div 
              style={{ width: 250, height: 280, borderRadius: 16, background: '#E6F4EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#138263', cursor: 'pointer' }}
              onClick={adicionarProduto}
            >+</div>
            <div style={{ marginTop: 8, color: '#555' }}>Adicionar produto</div>
          </div>
        </div>
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