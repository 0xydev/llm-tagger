import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Checkbox, Typography } from '@mui/material';

const TaskChecklist = ({ analysis }) => {
    if (!analysis) {
        return null;
    }

    const checklistItems = [
        { key: 'purposeDefined', label: 'Görev amacı açıkça tanımlanmış' },
        { key: 'stepsProvided', label: 'Görev tamamlama adımları sağlanmış ve açık' },
        { key: 'outputsDescribed', label: 'Beklenen çıktılar iyi açıklanmış' },
        { key: 'acceptanceCriteriaDefined', label: 'Kabul kriterleri belirtilmiş ve kapsamlı' },
        { key: 'testScenariosIncluded', label: 'Test senaryoları dahil edilmiş' },
        { key: 'overallCompleteness', label: 'Genel görev açıklaması tam ve anlaşılır' },
    ];

    return (
        <>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Görev Kontrol Listesi
            </Typography>
            <List>
                {checklistItems.map((item) => (
                    <ListItem key={item.key}>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={analysis[item.key]}
                                tabIndex={-1}
                                disableRipple
                                readOnly
                            />
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
            </List>
        </>
    );
};

export default TaskChecklist;