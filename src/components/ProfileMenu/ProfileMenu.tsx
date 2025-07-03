import React from "react";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import xClose from "@/assets/x-close.svg";
import logoutIcon from "@/assets/logout-icon.svg";

interface ProfileMenuProps {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
    user: { name?: string } | null;
    logout: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ open, anchorEl, onClose, user, logout }) => {
    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 306,
                    height: '100vh',
                    top: 0,
                    right: 0,
                    position: 'fixed',
                    bgcolor: '#fff',
                    boxShadow: '-6.66px 0px 13.32px rgba(0, 0, 0, 0.25)',
                    borderRadius: '9.99px 0px 0px 9.99px',
                    p: 3,
                },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#D9D9D9', width: 47, height: 47, fontSize: 26, color: '#000', fontFamily: 'Figtree', fontWeight: 400 }}>
                            {user?.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Typography sx={{ ml: 2, fontFamily: 'Figtree', fontWeight: 400, fontSize: 20, color: '#000' }}>
                            {user?.name || 'Usuário'}
                        </Typography>
                        <IconButton onClick={onClose} sx={{ ml: 'auto' }}>
                            <Image src={xClose} alt="Fechar" width={20} height={20} />
                        </IconButton>
                    </Box>
                    <Box sx={{ borderBottom: '0.666px solid #707070', mb: 2 }} />
                </div>
                <Box
                    onClick={logout}
                    sx={{
                        width: 279.72,
                        height: 39.96,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '6.66px 13.32px',
                        gap: '6.66px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        mb: 2,
                        transition: 'background 0.2s',
                        '&:hover': {
                            background: 'rgba(255,49,49,0.04)',
                        },
                    }}
                >
                    <Image src={logoutIcon} alt="Logout" width={18} height={18} />
                    <Typography
                        sx={{
                            fontFamily: 'Figtree',
                            fontWeight: 400,
                            fontSize: 20,
                            lineHeight: '20px',
                            color: '#FF3131',
                            ml: 2,
                        }}
                    >
                        Sair
                    </Typography>
                </Box>
            </Box>
        </Popover>
    );
};

export default ProfileMenu; 