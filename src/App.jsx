import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import TagForm from './components/TagForm';
import TaskQualityChecker from './components/TaskQualityChecker';

const App = () => {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Project Management Tool
                    </Typography>
                    <Button color="inherit" component={Link} to="/">
                        Tag Form
                    </Button>
                    <Button color="inherit" component={Link} to="/task-checker">
                        Task Quality Checker
                    </Button>
                </Toolbar>
            </AppBar>
            <Container>
                <Routes>
                    <Route path="/" element={<TagForm />} />
                    <Route path="/task-checker" element={<TaskQualityChecker />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;