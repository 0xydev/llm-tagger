import React from 'react';
import { List, ListItem, ListItemText, IconButton, TextField, Button, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const SubtaskList = ({ subtasks, onSubtaskAdd, onSubtaskRemove, onSubtaskChange }) => {
    const [newSubtask, setNewSubtask] = React.useState('');

    const handleAddSubtask = () => {
        if (newSubtask.trim()) {
            onSubtaskAdd(newSubtask.trim());
            setNewSubtask('');
        }
    };

    return (
        <Box>
            <List>
                {subtasks.map((subtask, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={
                                <TextField
                                    fullWidth
                                    value={subtask}
                                    onChange={(e) => onSubtaskChange(index, e.target.value)}
                                />
                            }
                        />
                        <IconButton edge="end" aria-label="delete" onClick={() => onSubtaskRemove(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
            <Box display="flex" mt={2}>
                <TextField
                    fullWidth
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Yeni alt görev ekle"
                />
                <Button onClick={handleAddSubtask}>Ekle</Button>
            </Box>
        </Box>
    );
};

export default SubtaskList;