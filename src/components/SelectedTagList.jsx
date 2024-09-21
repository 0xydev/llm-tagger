import React from 'react';

const SelectedTagList = ({ tags, label }) => (
  <div>
    {label && <p><strong>{label}</strong></p>}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
      {tags.map((tag) => (
        <span key={tag} style={{ padding: '5px', backgroundColor: '#007bff', color: 'white', borderRadius: '3px' }}>
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default SelectedTagList;