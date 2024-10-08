import React from 'react';
import { Box, Chip, Typography } from '@mui/material';

const TagList = ({ tags, predefinedTags, selectedTags, onTagClick }) => {
  return (
    <>
      <Typography variant="h6">Önerilen Tagler:</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            clickable
            color={predefinedTags.includes(tag) ? 'secondary' : selectedTags.includes(tag) ? 'primary' : 'default'}
            onClick={() => onTagClick(tag)}
          />
        ))}
      </Box>
    </>
  );
};

export default TagList;
