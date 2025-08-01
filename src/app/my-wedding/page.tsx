"use client";
import { useEffect, useState, useRef } from "react";
import { weddingService } from "@/services/weddingService";
import Navbar from "@/components/Navbar";
import FiancePhoto from "@/components/FiancePhoto/FiancePhoto";
import BestManPhoto from "@/components/BestManPhoto/BestManPhoto";
import CountdownTimer from "@/components/CountdownTimer";
import EditablePhoto from "@/components/EditablePhoto";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Product from "@/components/Product";
import CopyWeddingCodeButton from "@/components/CopyWeddingCody/CopyWeddingCodeButton";

export default function MyWeddingPage() {
    const [wedding, setWedding] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const homeRef = useRef<HTMLDivElement>(null);
    const casalRef = useRef<HTMLDivElement>(null);
    const padrinhosRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);
    const presentesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchWedding = async () => {
            try {
                const data = await weddingService.getMyWeddings();
                if (data && data.length > 0) {
                    setWedding(data[0]);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchWedding();
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: 60 }}>Carregando...</div>;
    }
    if (!wedding) {
        return <div style={{ textAlign: 'center', marginTop: 60 }}>Nenhum casamento encontrado.</div>;
    }

    return (
        <div style={{ background: '#F8F8F8', minHeight: '100vh', paddingTop: '66.6px' }}>
            <Navbar
                primaryColor={wedding.primaryColor || "#138263"}
                showScrollNav={true}
                homeRef={homeRef}
                casalRef={casalRef}
                padrinhosRef={padrinhosRef}
                infoRef={infoRef}
                presentesRef={presentesRef}
                showAvatar={false}
            />
            {/* Seção do casal */}
            <section ref={casalRef} style={{ background: '#fff', padding: 40, textAlign: 'center', position: 'relative' }}>
                <h1 style={{ fontSize: 36, fontWeight: 400, margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                    {wedding.coupleName}
                </h1>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
                    <img src="/flores-nova.png" alt="Flores" width={310} height={205} />
                </div>
                <div style={{ fontSize: 18, color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    {wedding.weddingDate}
                </div>
                {/* Botão do código do casamento */}
                {wedding.invitationCode && (
                    <CopyWeddingCodeButton
                        code={wedding.invitationCode}
                        primaryColor={wedding.primaryColor || '#138263'}
                        textColor="#fff"
                    />
                )}

            </section>
            {/* Contagem regressiva */}
            <section style={{ background: wedding.primaryColor, color: '#fff', padding: 32, textAlign: 'center' }}>
                <CountdownTimer targetDate={wedding.weddingDate} size="large" />
            </section>
            {/* O Casal */}
            <section style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
                <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>O CASAL</h1>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 24 }}>
                    <FiancePhoto text={wedding.coupleName.split(' e ')[0]} editable={false} initialPhoto={wedding.couplePhotos?.[0]} />
                    <FiancePhoto text={wedding.coupleName.split(' e ')[1] || ''} editable={false} initialPhoto={wedding.couplePhotos?.[1]} />
                </div>
                <div style={{ maxWidth: 700, margin: '0 auto', color: '#555', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <div style={{ fontSize: 16, color: '#555', width: '100%', minHeight: 80 }}>{wedding.description}</div>
                </div>
            </section>
            {/* Os Padrinhos */}
            <section ref={padrinhosRef} style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
                <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>OS PADRINHOS</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 120, justifyContent: 'center', marginBottom: 16, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
                    {wedding.godparents?.map((padrinho: any, idx: number) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <BestManPhoto text={padrinho.name} size={80} editable={false} showDelete={false} initialPhoto={padrinho.photo} />
                        </div>
                    ))}
                </div>
            </section>
            {/* Informações */}
            <section ref={infoRef} style={{ background: wedding.primaryColor, color: '#fff', padding: 32, textAlign: 'center' }}>
                <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>INFORMAÇÕES</h1>
                <div style={{ fontSize: 18, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <span style={{ fontSize: 18 }}>{wedding.weddingLocation}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
                    <img src="/flores-nova.png" alt="Flores" width={310} height={205} />
                </div>
                <div style={{ fontSize: 18 }}>{wedding.weddingDate}</div>
            </section>
            {/* Lista de Presentes */}
            <section ref={presentesRef} style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
                <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>LISTA DE PRESENTES</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, justifyContent: 'center', marginBottom: 16, maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto' }}>
                    {wedding.gifts?.map((produto: any, idx: number) => (
                        <div key={idx} style={{ margin: 8 }}>
                            <Product id={idx} name={produto.name} price={produto.price} image={produto.photo} editable={false} showDelete={false} />
                        </div>
                    ))}
                </div>
            </section>
            {/* Mensagem final */}
            <section style={{ background: '#fff', padding: 32, textAlign: 'center' }}>
                <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>CONTAMOS COM SUA PRESENÇA!</h1>
                <div style={{ margin: '0 auto 16px', maxWidth: 600 }}>
                    <EditablePhoto src={wedding.footerPhoto} alt="Casal" width={600} height={200} style={{ borderRadius: 16, objectFit: 'cover' }} editable={false} />
                </div>
                <div style={{ color: '#555', fontSize: 16 }}>Com carinho, {wedding.coupleName}.</div>
            </section>
        </div>
    );
}
