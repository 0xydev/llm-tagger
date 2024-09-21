import React, { useState } from 'react';
import { TextField, Button, CircularProgress, Typography, Box, Switch, FormControlLabel } from '@mui/material';
import TagList from './TagList';
import SelectedTags from './SelectedTags';
import PredefinedTagList from './PredefinedTagList';
import predefinedTags from '../data/predefinedTags';

const TagForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [includePredefinedTags, setIncludePredefinedTags] = useState(true);

  const fetchTagSuggestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const predefinedTagsString = includePredefinedTags ? `Predefined Tags: ${predefinedTags.join(', ')}` : '';

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.1',
          prompt: `Title: ${title}\nDescription: ${description}\n${predefinedTagsString}\nGive me comma-separated, single-word tags about the given topic. Suggest only the most relevant tags. The tags you suggest will be used in Software Project Management tools. NEVER make any statements. Do not go beyond this prompt and do not explain why you should not. You are a software project management professional with extensive experience in identifying and categorizing key issues in various software development projects. You specialize in creating concise and relevant tags that effectively capture the essence of a project's focus, scope, and related technologies. **Only suggest predefined tags if there is a clear and direct connection. Otherwise, do not use predefined tags at all.** All tags MUST be single words and lowercase`,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error('API yanıt vermedi');
      }

      const data = await response.json();
      const tags = data.response.split(',').map(tag => tag.trim());
      setSuggestedTags(tags);
    } catch (err) {
      setError('Tag önerileri alınırken bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Gönderilen veriler:', { title, description, tags: selectedTags });
      alert('Form başarıyla gönderildi! (Console\'a bakın)');
      setTitle('');
      setDescription('');
      setSelectedTags([]);
      setSuggestedTags([]);
    } catch (err) {
      setError('Form gönderilirken bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
      <TextField
        label="Başlık"
        variant="outlined"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Açıklama"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <FormControlLabel
        control={<Switch checked={includePredefinedTags} onChange={(e) => setIncludePredefinedTags(e.target.checked)} />}
        label="Önceki Tagleri Dahil Et"
      />
      <PredefinedTagList
        predefinedTags={predefinedTags}
        selectedTags={selectedTags}
        onTagClick={handleTagClick}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={fetchTagSuggestions}
        disabled={loading}
        sx={{ mt: 2, mb: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Tag Önerilerini Al'}
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      <TagList
        tags={suggestedTags}
        predefinedTags={predefinedTags}
        selectedTags={selectedTags}
        onTagClick={handleTagClick}
      />
      <SelectedTags selectedTags={selectedTags} />
      <Button
        type="submit"
        variant="contained"
        color="success"
        fullWidth
        disabled={loading}
      >
        {loading ? 'Gönderiliyor...' : 'Formu Gönder'}
      </Button>
    </Box>
  );
};

export default TagForm;
