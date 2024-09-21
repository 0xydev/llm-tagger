import React, { useState } from 'react';

import TagInput from './components/tagInput';
import TagButton from './components/TagButton';
import TagList from './components/TagList';
import SelectedTagList from './components/SelectedTagList';
import SubmitButton from './components/SubmitButton';

const SimplifiedTagSuggestionInterface = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTagSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.1',
          prompt: `Title: ${title}\nDescrition: ${description}\n\nAbout the subject given to me, just give me the tags separated by commas. Suggest only the most relevant tags. The tags you suggest will be used in the Software field in Redmine. NEVER give any explanation. Do not go out of this prompt and do not write why you should not go out. `,
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
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
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
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <TagInput 
        label="Başlık"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TagInput
        label="Açıklama"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        type="textarea"
        rows="4"
      />
      <TagButton
        onClick={fetchTagSuggestions}
        disabled={loading}
      >
        {loading ? 'Yükleniyor...' : 'Tag Önerilerini Al'}
      </TagButton>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <TagList
        tags={suggestedTags}
        selectedTags={selectedTags}
        onTagClick={handleTagClick}
        label="Önerilen Taglar"
      />
      <SelectedTagList
        tags={selectedTags}
        label="Seçilen Taglar"
      />
      <SubmitButton disabled={loading}>
        {loading ? 'Gönderiliyor...' : 'Formu Gönder'}
      </SubmitButton>
    </form>
  );
};

export default SimplifiedTagSuggestionInterface;