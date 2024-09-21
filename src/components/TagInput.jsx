import React from 'react';

const TagInput = ({ label, value, onChange, required = false, ...rest }) => (
  <div style={{ marginBottom: '10px' }}>
    {label && <label>{label}</label>}
    {rest.type === 'textarea' ? (
      <textarea 
        value={value}
        onChange={onChange}
        required={required}
        style={{ width: '100%', padding: '5px', ...rest.style }}
        {...rest}
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={onChange}
        required={required}
        style={{ width: '100%', padding: '5px', ...rest.style }}
        {...rest}
      />
    )}
  </div>
);

export default TagInput;
