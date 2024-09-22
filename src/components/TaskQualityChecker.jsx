import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper, CircularProgress, Snackbar, Alert } from '@mui/material';
import TaskChecklist from './TaskChecklist';
import AnalysisResult from './AnalysisResult';
import { parseLLMResponse } from './utils';

const TaskQualityChecker = () => {
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        purpose: '',
        steps: '',
        outputs: '',
        acceptanceCriteria: '',
        observationNotes: '',
        tcpTraffic: '',
        guiOutput: '',
    });
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaskData(prevData => ({
            ...prevData,
            [name]: value || ''
        }));
    };

    const analyzeTask = async () => {
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
                    prompt: `Analyze the following task details and provide feedback in Turkish:
          
                            Task Title: ${taskData.title}
                            Description: ${taskData.description}
                            Purpose: ${taskData.purpose}
                            Steps: ${taskData.steps}
                            Expected Outputs: ${taskData.outputs}
                            Acceptance Criteria: ${taskData.acceptanceCriteria}
                            Observation Notes: ${taskData.observationNotes}
                            TCP Traffic: ${taskData.tcpTraffic}
                            GUI Output: ${taskData.guiOutput}
                            
                            Analyze the task for the following criteria:
                            1. Is the purpose of the task clearly defined?
                            2. Are the steps for completing the task provided and clear?
                            3. Are the expected outputs (artifacts, packages, screens) well described?
                            4. Are acceptance criteria specified and comprehensive?
                            5. Are test scenarios included (observation, TCP traffic, GUI output)?
                            6. Is the overall task description complete and understandable?
                            
                            Provide the analysis result in the following JSON format:
                            {
                              "purposeDefined": boolean,
                              "stepsProvided": boolean,
                              "outputsDescribed": boolean,
                              "acceptanceCriteriaDefined": boolean,
                              "testScenariosIncluded": boolean,
                              "overallCompleteness": boolean,
                              "feedback": "Detailed feedback and suggestions for improvement for each aspect"
                            }
                            Important: Ensure that your response is MUST a valid JSON object and NOTHING ELSE. Do not include any explanatory text outside the JSON object.`,
                    stream: false
                }),
            });

            if (!response.ok) {
                throw new Error('API yanıt vermedi');
            }

            const data = await response.json();
            const parsedResponse = parseLLMResponse(data.response);
            setAnalysis(parsedResponse);
        } catch (error) {
            console.error('Görev analiz edilirken hata oluştu:', error);
            setError('Görev analiz edilirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const loadExampleScenario = async () => {
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
                    prompt: `Generate an example task scenario for a software development task in Turkish. Provide the response as a valid JSON object with the following structure:

{
    "title": "Task title here",
    "description": "Task description here",
    "purpose": "Task purpose here",
    "steps": "Task steps here",
    "outputs": "Expected outputs here",
    "acceptanceCriteria": "Acceptance criteria here",
    "observationNotes": "Observation notes here",
    "tcpTraffic": "TCP traffic details here",
    "guiOutput": "GUI output details here"
}

Ensure that the response is a valid JSON object and nothing else. Do not include any explanatory text outside the JSON object.`,
                    stream: false
                }),
            });

            if (!response.ok) {
                throw new Error('API yanıt vermedi');
            }

            const data = await response.json();
            const exampleScenario = parseLLMResponse(data.response);

            const requiredFields = ['title', 'description', 'purpose', 'steps', 'outputs', 'acceptanceCriteria', 'observationNotes', 'tcpTraffic', 'guiOutput'];
            const missingFields = requiredFields.filter(field => !exampleScenario[field]);

            if (missingFields.length > 0) {
                throw new Error(`Eksik alanlar: ${missingFields.join(', ')}`);
            }

            setTaskData(exampleScenario);
        } catch (error) {
            console.error('Örnek senaryo yüklenirken hata oluştu:', error);
            setError(`Örnek senaryo yüklenirken bir hata oluştu: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, margin: '20px auto' }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Görev Kalite Kontrolü
                </Typography>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={loadExampleScenario}
                    sx={{ mb: 2 }}
                    disabled={loading}
                >
                    Örnek Senaryo Yükle
                </Button>
                {Object.entries(taskData).map(([key, value]) => (
                    <TextField
                        key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        multiline
                        rows={key === 'description' || key === 'steps' ? 4 : 2}
                        fullWidth
                        margin="normal"
                        name={key}
                        value={value}
                        onChange={handleInputChange}
                    />
                ))}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={analyzeTask}
                    sx={{ mt: 2 }}
                    disabled={loading || !taskData.title.trim()}
                >
                    {loading ? <CircularProgress size={24} /> : 'Görevi Analiz Et'}
                </Button>
                {analysis && !error && (
                    <>
                        <TaskChecklist analysis={analysis} />
                        <AnalysisResult analysis={analysis} />
                    </>
                )}
            </Paper>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default TaskQualityChecker;