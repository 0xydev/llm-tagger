import React from 'react';
import { Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

const AnalysisResult = ({ analysis }) => {
    if (!analysis || !analysis.feedback) return null;

    const feedbackItems = typeof analysis.feedback === 'string'
        ? analysis.feedback.split('\n')
        : Object.entries(analysis.feedback).map(([key, value]) => `${key}: ${value}`);

    return (
        <Paper elevation={2} sx={{ mt: 2, p: 2, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
                Detaylı Analiz Geri Bildirimi
            </Typography>
            <List>
                {feedbackItems.map((feedback, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={feedback} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default AnalysisResult;