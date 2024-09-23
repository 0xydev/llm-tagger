import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

const ImproveContentDialog = ({ open, onClose, improvedContent }) => {
    const handleSelect = (option) => {
        onClose(improvedContent[option]);
    };

    return (
        <Dialog open={open} onClose={() => onClose(null)} maxWidth="md" fullWidth>
            <DialogTitle>İyileştirilmiş İçerik Önerileri</DialogTitle>
            <DialogContent>
                {Object.entries(improvedContent).map(([option, content]) => (
                    <Box key={option} sx={{ mb: 3 }}>
                        <Typography variant="h6">Seçenek {option.slice(-1)}</Typography>
                        <Typography variant="subtitle1">Başlık:</Typography>
                        <Typography paragraph>{content.title}</Typography>
                        <Typography variant="subtitle1">Açıklama:</Typography>
                        <Typography paragraph>{content.description}</Typography>
                        <Button variant="outlined" onClick={() => handleSelect(option)}>
                            Bu Seçeneği Kullan
                        </Button>
                    </Box>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(null)}>İptal</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ImproveContentDialog;