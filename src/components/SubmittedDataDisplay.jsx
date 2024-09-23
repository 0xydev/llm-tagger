import React from 'react';
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { JSONTree } from 'react-json-tree';

const SubmittedDataDisplay = ({ data, apiInteractions }) => {
    if (!data && (!apiInteractions || apiInteractions.length === 0)) return null;

    return (
        <Paper elevation={3} sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                İşlem Detayları
            </Typography>

            {data && (
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Gönderilen Veriler</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <JSONTree data={data} theme="twilight" invertTheme={true} />
                    </AccordionDetails>
                </Accordion>
            )}

            {apiInteractions && apiInteractions.map((interaction, index) => (
                <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{interaction.type}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">İstek:</Typography>
                            <JSONTree data={interaction.request} theme="twilight" invertTheme={true} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">Yanıt:</Typography>
                            <JSONTree data={interaction.response} theme="twilight" invertTheme={true} />
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Paper>
    );
};

export default SubmittedDataDisplay;