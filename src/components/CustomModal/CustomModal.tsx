import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import CustomButton from "../CustomButton/CustomButton";
import React from "react";

interface CustomModalProps {
    open: boolean;
    onClose: () => void;
    code: string;
    setCode: (code: string) => void;
    onSubmit: () => void;
    loading?: boolean;
    error?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({ open, onClose, code, setCode, onSubmit, loading = false, error = "" }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: '7.992px',
                    boxShadow: '6.66px 6.66px 13.32px rgba(0, 0, 0, 0.25)',
                    p: { xs: 1, md: 2 },
                    position: 'relative',
                    bgcolor: '#fff',
                },
            }}
            BackdropProps={{
                sx: {
                    background: 'rgba(0,0,0,0.5)',
                },
            }}
        >
            <DialogTitle sx={{ p: 0, pb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={onClose} size="large">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    minHeight: { xs: 220, md: 270 },
                    px: 0,
                    py: { xs: 2, md: 4 },
                }}
            >
                <Typography
                    sx={{
                        fontFamily: 'var(--font-figtree)',
                        fontWeight: 550,
                        fontSize: { xs: 25, md: 23.31 },
                        lineHeight: '30px',
                        color: '#2B2B2B',
                        textAlign: 'center',
                        mb: 2,
                    }}
                >
                    Insira o código do casamento
                </Typography>
                <TextField
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="Código do casamento"
                    fullWidth
                    sx={{
                        width: 370,
                        maxWidth: '100%',
                        height: 45.55,
                        borderRadius: '7.992px',
                        background: '#fff',
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '7.992px',
                        },
                        '& fieldset': {
                            borderColor: '#138263',
                            borderWidth: '1.2px',
                        },
                    }}
                    inputProps={{ style: { textAlign: 'center', fontSize: 25 } }}
                    disabled={loading}
                />
                {error && (
                    <Typography sx={{ color: '#FF3131', fontSize: 16, textAlign: 'center' }}>{error}</Typography>
                )}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 370,
                        maxWidth: '100%',
                        mt: 2,
                    }}
                >
                    <CustomButton
                        sx={{
                            width: '100%',
                            height: 66.33,
                            borderRadius: '7.992px',
                            background: '#138263',
                            boxShadow: '0px 3.1968px 3.1968px rgba(0, 0, 0, 0.25)',
                            color: '#fff',
                            fontFamily: 'var(--font-figtree)',
                            fontWeight: 700,
                            fontSize: 19.98,
                            textTransform: 'none',
                            ':hover': {
                                background: '#106b52',
                            },
                        }}
                        onClick={onSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Solicitando...' : 'Solicitar entrada'}
                    </CustomButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default CustomModal; 