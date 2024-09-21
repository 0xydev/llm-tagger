import React from 'react';

const TagList = ({ tags, selectedTags, onTagClick, label }) => (
  <div>
    {label && <p><strong>{label}</strong></p>}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onTagClick(tag)}
          style={{
            padding: '5px',
            backgroundColor: selectedTags.includes(tag) ? '#007bff' : '#f0f0f0',
            color: selectedTags.includes(tag) ? 'white' : 'black',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  </div>
);

export default TagList;