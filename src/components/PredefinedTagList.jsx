import React from 'react';
import { Box, Chip, Typography } from '@mui/material';

const PredefinedTagList = ({ predefinedTags, selectedTags, onTagClick }) => {
  return (
    <>
      <Typography variant="h6">Önceden Tanımlanmış Tagler:</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {predefinedTags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            clickable
            color={selectedTags.includes(tag) ? 'primary' : 'default'}
            onClick={() => onTagClick(tag)}
          />
        ))}
      </Box>
    </>
  );
};

export default PredefinedTagList;
