import React from 'react';
import { Container, Typography } from '@mui/material';
import TagForm from './components/TagForm';

const App = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h5" align="center" gutterBottom>
        LLM Tag Öneri
      </Typography>
      <TagForm />
    </Container>
  );
};

export default App;
