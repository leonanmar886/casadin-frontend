import React from 'react';
import { useRouter } from 'next/navigation';
import casadinLogo from "@/assets/casadin-logo.svg";
import Image from "next/image";
import Avatar from "@mui/material/Avatar";

interface NavItem {
  label: string;
  onClick: () => void;
}

interface NavbarProps {
  primaryColor?: string;
  navItems?: NavItem[];
  showScrollNav?: boolean;
  homeRef?: React.RefObject<HTMLDivElement | null>;
  casalRef?: React.RefObject<HTMLDivElement | null>;
  padrinhosRef?: React.RefObject<HTMLDivElement | null>;
  infoRef?: React.RefObject<HTMLDivElement | null>;
  presentesRef?: React.RefObject<HTMLDivElement | null>;
  userInitial?: string;
  onAvatarClick?: (event: React.MouseEvent<HTMLElement>) => void;
  showAvatar?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  primaryColor = '#138263',
  navItems,
  showScrollNav = false,
  homeRef,
  casalRef,
  padrinhosRef,
  infoRef,
  presentesRef,
  userInitial = 'B',
  onAvatarClick,
  showAvatar = true,
}) => {
  const router = useRouter();

  // Navegação padrão para home
  const defaultNavItems: NavItem[] = [];

  // Navegação de scroll para página de casamento
  const scrollNavItems: NavItem[] = [
    {
      label: 'HOME',
      onClick: () => homeRef?.current?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      label: 'O CASAL',
      onClick: () => casalRef?.current?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      label: 'OS PADRINHOS',
      onClick: () => padrinhosRef?.current?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      label: 'INFORMAÇÕES',
      onClick: () => infoRef?.current?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      label: 'LISTA DE PRESENTES',
      onClick: () => presentesRef?.current?.scrollIntoView({ behavior: 'smooth' })
    }
  ];

  const currentNavItems = navItems || (showScrollNav ? scrollNavItems : defaultNavItems);

  return (
    <header style={{ 
      background: primaryColor, 
      color: '#fff', 
      padding: '16px 32px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      height: 66.6,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    }}>
      <div 
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => router.push('/home')}
      >
        <Image src={casadinLogo} alt="CASADIN logo" height={40} style={{ width: 'auto' }} />
      </div>
      
      <nav style={{ 
        display: 'flex', 
        gap: 24, 
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        {currentNavItems.map((item, index) => (
          <a 
            key={index}
            style={{ cursor: 'pointer' }} 
            onClick={item.onClick}
          >
            {item.label}
          </a>
        ))}
      </nav>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {showAvatar && (
          <Avatar
                         sx={{ 
               bgcolor: '#D9D9D9', 
               width: 47, 
               height: 47, 
               fontSize: 26, 
               color: '#000', 
               fontFamily: 'var(--font-figtree)', 
               fontWeight: 400, 
               cursor: onAvatarClick ? 'pointer' : 'default'
             }}
            onClick={onAvatarClick}
          >
            {userInitial}
          </Avatar>
        )}
      </div>
    </header>
  );
};

export default Navbar; 