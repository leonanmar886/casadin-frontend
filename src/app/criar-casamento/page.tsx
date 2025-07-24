"use client"
import CardMarriage from '@/components/CardMarriage/CardMarriage';
import Image from 'next/image';
import { useState, useRef } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';

export default function CriarCasamentoPage() {
  const [nomeNoivo, setNomeNoivo] = useState('Fulano');
  const [nomeNoiva, setNomeNoiva] = useState('Fulana');
  const [dataCasamento, setDataCasamento] = useState('29 de Abril de 2026');
  const [textoCasal, setTextoCasal] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed bibendum odio sem, in accumsan lacus vestibulum tincidunt. Pellentesque vitae faucibus mauris. Integer elit urna, egestas vel nibh non, tristique egestas diam.');
  const [nomesPadrinhos, setNomesPadrinhos] = useState([
    'Padrinho 1',
    'Padrinho 2',
    'Padrinho 3',
    'Padrinho 4',
    'Padrinho 5',
  ]);
  const [fotoNoiva, setFotoNoiva] = useState<string | null>(null);
  const fileInputNoivaRef = useRef<HTMLInputElement>(null);
  const contagemRef = useRef<HTMLDivElement>(null);
  const casalRef = useRef<HTMLDivElement>(null);
  const padrinhosRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const presentesRef = useRef<HTMLDivElement>(null);
  const [fotoNoivo, setFotoNoivo] = useState<string | null>(null);
  const fileInputNoivoRef = useRef<HTMLInputElement>(null);
  const handleFotoNoivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFotoNoivo(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handleFotoNoivaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFotoNoiva(URL.createObjectURL(e.target.files[0]));
    }
  };
  const [fotosPadrinhos, setFotosPadrinhos] = useState<(string | null)[]>(Array(nomesPadrinhos.length).fill(null));
  const fileInputsPadrinhosRef = useRef<(HTMLInputElement | null)[]>([]);
  const handleFotoPadrinhoChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const novasFotos = [...fotosPadrinhos];
      novasFotos[idx] = URL.createObjectURL(e.target.files[0]);
      setFotosPadrinhos(novasFotos);
    }
  };

  return (
    <div style={{ background: '#F8F8F8', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: '#138263', color: '#fff', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, fontSize: 24, letterSpacing: 2 }}>CASADIN</span>
        <nav style={{ display: 'flex', gap: 24 }}>
          <a style={{ cursor: 'pointer' }} onClick={() => contagemRef.current?.scrollIntoView({ behavior: 'smooth' })}>HOME</a>
          <a style={{ cursor: 'pointer' }} onClick={() => casalRef.current?.scrollIntoView({ behavior: 'smooth' })}>O CASAL</a>
          <a style={{ cursor: 'pointer' }} onClick={() => padrinhosRef.current?.scrollIntoView({ behavior: 'smooth' })}>OS PADRINHOS</a>
          <a style={{ cursor: 'pointer' }} onClick={() => infoRef.current?.scrollIntoView({ behavior: 'smooth' })}>INFORMAÇÕES</a>
          <a style={{ cursor: 'pointer' }} onClick={() => presentesRef.current?.scrollIntoView({ behavior: 'smooth' })}>LISTA DE PRESENTES</a>
        </nav>
        <div style={{ background: '#D9D9D9', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>B</div>
      </header>

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
          <input
            type="text"
            value={dataCasamento}
            onChange={e => setDataCasamento(e.target.value)}
            style={{
              fontSize: 18,
              color: '#888',
              textAlign: 'center',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: dataCasamento.length > 0 ? dataCasamento.length * 10 : 120,
              minWidth: 120,
              maxWidth: 300
            }}
          />
          <EditIcon sx={{ color: '#2563eb', fontSize: 18 }} />
        </div>
        <div style={{ position: 'absolute', right: 32, top: 32, textAlign: 'right' }}>
          <div>Paleta de cores</div>
          <div style={{ display: 'flex', gap: 8, margin: '8px 0' }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#E6E6FA', display: 'inline-block' }} />
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#F5E6E8', display: 'inline-block' }} />
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#B8E0D2', display: 'inline-block' }} />
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#F9F7C9', display: 'inline-block' }} />
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#F7D9C4', display: 'inline-block' }} />
          </div>
          <div style={{ fontSize: 14, color: '#888' }}>O código do seu casamento é:</div>
          <div style={{ background: '#E6F4EA', color: '#138263', borderRadius: 8, padding: '2px 12px', fontWeight: 600, display: 'inline-block', marginTop: 4 }}>Ak3t56</div>
        </div>
      </section>

      {/* Contagem regressiva */}
      <section ref={contagemRef} style={{ background: '#138263', color: '#fff', padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>CONTAGEM REGRESSIVA</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <div><div style={{ fontSize: 32, fontWeight: 700 }}>304</div><div>Dias</div></div>
          <div><div style={{ fontSize: 32, fontWeight: 700 }}>00</div><div>Meses</div></div>
          <div><div style={{ fontSize: 32, fontWeight: 700 }}>02</div><div>Minutos</div></div>
          <div><div style={{ fontSize: 32, fontWeight: 700 }}>55</div><div>Segundos</div></div>
        </div>
      </section>

      {/* O Casal */}
      <section ref={casalRef} style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>O CASAL</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginBottom: 16 }}>
          <div>
            <div
              style={{ width: 300, height: 300, borderRadius: '50%', background: '#A9A9A9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 32px', cursor: 'pointer', overflow: 'hidden' }}
              onClick={() => fileInputNoivoRef.current?.click()}
              title="Clique para alterar a foto"
            >
              {fotoNoivo ? (
                <img
                  src={fotoNoivo}
                  alt="Foto do Noivo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <PersonIcon sx={{ color: '#e0e0e0', fontSize: 70 }} />
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputNoivoRef}
                style={{ display: 'none' }}
                onChange={handleFotoNoivoChange}
              />
            </div>
            <div style={{ fontWeight: 500, fontSize: 18 }}>{nomeNoivo}</div>
          </div>
          <div>
            <div
              style={{ width: 300, height: 300, borderRadius: '50%', background: '#A9A9A9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 32px', cursor: 'pointer', overflow: 'hidden' }}
              onClick={() => fileInputNoivaRef.current?.click()}
              title="Clique para alterar a foto"
            >
              {fotoNoiva ? (
                <img
                  src={fotoNoiva}
                  alt="Foto da Noiva"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <PersonIcon sx={{ color: '#e0e0e0', fontSize: 70 }} />
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputNoivaRef}
                style={{ display: 'none' }}
                onChange={handleFotoNoivaChange}
              />
            </div>
            <div style={{ fontWeight: 500, fontSize: 18 }}>{nomeNoiva}</div>
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
              <div
                style={{ width: 80, height: 80, borderRadius: '50%', background: '#A9A9A9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', cursor: 'pointer', overflow: 'hidden' }}
                onClick={() => fileInputsPadrinhosRef.current[idx]?.click()}
                title="Clique para alterar a foto"
              >
                {fotosPadrinhos[idx] ? (
                  <img
                    src={fotosPadrinhos[idx] as string}
                    alt={`Foto do Padrinho ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <PersonIcon sx={{ color: '#e0e0e0', fontSize: 48 }} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={el => fileInputsPadrinhosRef.current[idx] = el}
                  style={{ display: 'none' }}
                  onChange={e => handleFotoPadrinhoChange(idx, e)}
                />
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  type="text"
                  value={nome}
                  onChange={e => {
                    const novosNomes = [...nomesPadrinhos];
                    novosNomes[idx] = e.target.value;
                    setNomesPadrinhos(novosNomes);
                  }}
                  style={{
                    fontWeight: 500,
                    fontSize: 16,
                    textAlign: 'center',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    width: nome.length > 0 ? nome.length * 10 : 60,
                    minWidth: 60,
                    maxWidth: 120
                  }}
                />
                <EditIcon sx={{ color: '#2563eb', fontSize: 18 }} />
              </span>
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E6F4EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#138263', cursor: 'pointer' }}>+</div>
            <div>Adicionar padrinho</div>
          </div>
        </div>
      </section>

      {/* Informações */}
      <section ref={infoRef} style={{ background: '#138263', color: '#fff', padding: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>INFORMAÇÕES</h1>
        <div style={{ fontSize: 18, marginBottom: 8 }}>Igreja Nossa Senhora de Fátima - Bairro de Fátima</div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
          <Image src="/flores-nova.png" alt="Flores" width={310} height={205} />
        </div>
        <div style={{ fontSize: 18 }}>{dataCasamento} às 16h</div>
      </section>

      {/* Lista de Presentes */}
      <section ref={presentesRef} style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>LISTA DE PRESENTES</h1>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 24,
          justifyContent: 'center',
          marginBottom: 16,
          maxWidth: 900,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ margin: 8 }}>
              <CardMarriage text="Air Fryer" />
              <div style={{ fontSize: 14, color: '#555', marginTop: 4 }}>R$ 200,00 / 299,90</div>
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 8 }}>
            <div style={{ width: 120, height: 120, borderRadius: 16, background: '#E6F4EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#138263', cursor: 'pointer' }}>+</div>
            <div>Adicionar produto</div>
          </div>
        </div>
        {/* Paginação mock */}
        <div style={{ margin: '16px 0' }}>
          <span style={{ fontSize: 18, color: '#888' }}>1 ... 5</span>
        </div>
      </section>

      {/* Mensagem final */}
      <section style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>CONTAMOS COM SUA PRESENÇA!</h1>
        <div style={{ margin: '0 auto 16px', maxWidth: 600 }}>
          <Image src="/casal1.jpg" alt="Casal" width={600} height={200} style={{ borderRadius: 16, objectFit: 'cover' }} />
        </div>
        <div style={{ color: '#555', fontSize: 16 }}>Com carinho, {nomeNoivo} & {nomeNoiva}.</div>
      </section>
    </div>
  );
} 