import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TextField, Button, CircularProgress, Typography, Box, Switch, FormControlLabel, Snackbar, Alert, Grid } from '@mui/material';
import TagList from './TagList';
import SelectedTags from './SelectedTags';
import PredefinedTagList from './PredefinedTagList';
import SubtaskList from './SubtaskList';
import ImproveContentDialog from './ImproveContentDialog';
import SubmittedDataDisplay from './SubmittedDataDisplay';
import predefinedTags from '../data/predefinedTags';
import debounce from 'lodash/debounce';

const API_URL = 'http://localhost:11434/api/generate';
const MODEL = 'llama3.1';

const TagForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subtasks: [],
    });
    const [suggestedTags, setSuggestedTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [includePredefinedTags, setIncludePredefinedTags] = useState(false);
    const [autoSuggest, setAutoSuggest] = useState(false);
    const [openImproveDialog, setOpenImproveDialog] = useState(false);
    const [improvedContent, setImprovedContent] = useState({ option1: { title: '', description: '' }, option2: { title: '', description: '' } });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [submittedData, setSubmittedData] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [apiInteractions, setApiInteractions] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        console.log(`Form verisi güncellendi: ${name} = ${value}`);
    };

    const callAPI = async (type, prompt) => {
        const request = {
            model: MODEL,
            prompt: prompt,
            stream: false
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });

        if (!response.ok) throw new Error('API yanıt vermedi');

        const data = await response.json();

        setApiInteractions(prev => [...prev, { type, request, response: data }]);

        return data;
    };

    const fetchTagSuggestions = useCallback(async () => {
        if (!formData.title && !formData.description && formData.subtasks.length === 0) return;

        setLoading(true);
        setError(null);

        try {
            const predefinedTagsString = includePredefinedTags ? `Predefined Tags: ${predefinedTags.join(', ')}` : '';
            const subtasksString = formData.subtasks.length > 0 ? `Subtasks: ${formData.subtasks.join(', ')}` : '';

            const prompt = `Title: ${formData.title}\nDescription: ${formData.description}\n${subtasksString}\n${predefinedTagsString}\nGive me comma-separated, single-word tags about the given topic, including subtasks if provided. Suggest only the most relevant tags. The tags you suggest will be used in Software Project Management tools. NEVER make any statements. Do not go beyond this prompt and do not explain why you should not. You are a software project management professional with extensive experience in identifying and categorizing key issues in various software development projects. You specialize in creating concise and relevant tags that effectively capture the essence of a project's focus, scope, and related technologies. **Only suggest predefined tags if there is a clear and direct connection. Otherwise, do not use predefined tags at all.** All tags MUST be single words and lowercase`;

            const data = await callAPI('Tag Suggestions', prompt);

            console.log('API yanıtı:', data);
            const tags = data.response.split(',').map(tag => tag.trim());
            setSuggestedTags(tags);
        } catch (err) {
            setError('Tag önerileri alınırken bir hata oluştu: ' + err.message);
            setSnackbar({ open: true, message: 'Tag önerileri alınamadı.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    }, [formData, includePredefinedTags]);

    const debouncedFetchTagSuggestions = useMemo(
        () => debounce(fetchTagSuggestions, 1000),
        [fetchTagSuggestions]
    );

    useEffect(() => {
        if (autoSuggest) {
            debouncedFetchTagSuggestions();
        }
        return () => debouncedFetchTagSuggestions.cancel();
    }, [formData, autoSuggest, debouncedFetchTagSuggestions]);

    const handleTagClick = useCallback((tag) => {
        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(tag)
                ? prevSelectedTags.filter((t) => t !== tag)
                : [...prevSelectedTags, tag]
        );
    }, []);

    const handleSubtaskAdd = useCallback((newSubtask) => {
        setFormData(prev => ({ ...prev, subtasks: [...prev.subtasks, newSubtask] }));
    }, []);

    const handleSubtaskRemove = useCallback((index) => {
        setFormData(prev => ({ ...prev, subtasks: prev.subtasks.filter((_, i) => i !== index) }));
    }, []);

    const handleSubtaskChange = useCallback((index, newValue) => {
        setFormData(prev => {
            const updatedSubtasks = [...prev.subtasks];
            updatedSubtasks[index] = newValue;
            return { ...prev, subtasks: updatedSubtasks };
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const dataToSubmit = { ...formData, tags: selectedTags };
            console.log('Gönderilen veriler:', dataToSubmit);

            setSubmittedData(dataToSubmit);
            setSnackbar({ open: true, message: 'Form başarıyla gönderildi!', severity: 'success' });
            setFormData({ title: '', description: '', subtasks: [] });
            setSelectedTags([]);
            setSuggestedTags([]);
        } catch (err) {
            setError('Form gönderilirken bir hata oluştu: ' + err.message);
            setSnackbar({ open: true, message: 'Form gönderilemedi.', severity: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleImproveContent = async () => {
        setLoading(true);
        setError(null);

        try {
            const prompt = `Improve the following title and description for a software project task. Use the same language as the input. High probability Turkish:
                Title: ${formData.title}
                Description: ${formData.description}
                
                Provide two improved versions for both the title and description. Your response MUST BE in the following JSON format and nothing else:
                {
                    "option1": {
                        "title": "Improved title 1",
                        "description": "Improved description 1"
                    },
                    "option2": {
                        "title": "Improved title 2",
                        "description": "Improved description 2"
                    }
                }`;

            const data = await callAPI('Improve Content', prompt);

            console.log('İçerik geliştirme API yanıtı:', data);
            let improvedContent;

            try {
                improvedContent = JSON.parse(data.response);
            } catch (jsonError) {
                const jsonMatch = data.response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    try {
                        improvedContent = JSON.parse(jsonMatch[0]);
                    } catch (extractError) {
                        throw new Error('JSON yapısı çıkarılamadı');
                    }
                } else {
                    throw new Error('Yanıt beklenen formatta değil');
                }
            }

            if (!improvedContent.option1 || !improvedContent.option2) {
                throw new Error('Yanıt beklenen yapıda değil');
            }

            setImprovedContent(improvedContent);
            setOpenImproveDialog(true);
        } catch (err) {
            setError('İçerik geliştirme sırasında bir hata oluştu: ' + err.message);
            setSnackbar({ open: true, message: 'İçerik geliştirilemedi.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleImproveContentClose = useCallback((selectedContent) => {
        if (selectedContent) {
            setFormData(prev => ({
                ...prev,
                title: selectedContent.title,
                description: selectedContent.description
            }));
            console.log('Seçilen geliştirilmiş içerik:', selectedContent);
        }
        setOpenImproveDialog(false);
    }, []);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
                <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
                    <TextField
                        label="Başlık"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        label="Açıklama"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleImproveContent}
                        disabled={loading || !formData.title || !formData.description}
                        sx={{ mt: 2, mb: 2 }}
                    >
                        İçeriği Geliştir
                    </Button>
                    <SubtaskList
                        subtasks={formData.subtasks}
                        onSubtaskAdd={handleSubtaskAdd}
                        onSubtaskRemove={handleSubtaskRemove}
                        onSubtaskChange={handleSubtaskChange}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 2 }}>
                        <FormControlLabel
                            control={<Switch checked={includePredefinedTags} onChange={(e) => setIncludePredefinedTags(e.target.checked)} />}
                            label="Önceki Tagleri Dahil Et"
                        />
                        <FormControlLabel
                            control={<Switch checked={autoSuggest} onChange={(e) => setAutoSuggest(e.target.checked)} />}
                            label="Otomatik Öneri"
                        />
                    </Box>
                    <PredefinedTagList
                        predefinedTags={predefinedTags}
                        selectedTags={selectedTags}
                        onTagClick={handleTagClick}
                    />
                    {!autoSuggest && (
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
                    )}
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
                        disabled={submitting}
                        sx={{ mt: 2 }}
                    >
                        {submitting ? 'Gönderiliyor...' : 'Formu Gönder'}
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={12} md={4}>
                <SubmittedDataDisplay data={submittedData} apiInteractions={apiInteractions} />
            </Grid>
            <ImproveContentDialog
                open={openImproveDialog}
                onClose={handleImproveContentClose}
                improvedContent={improvedContent}
            />
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default TagForm;