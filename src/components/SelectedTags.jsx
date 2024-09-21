import React from 'react';
import { Box, Chip, Typography } from '@mui/material';

const SelectedTags = ({ selectedTags }) => {
  return (
    <>
      <Typography variant="h6">Seçilen Taglar:</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {selectedTags.map((tag) => (
          <Chip key={tag} label={tag} color="primary" />
        ))}
      </Box>
    </>
  );
};

export default SelectedTags;
