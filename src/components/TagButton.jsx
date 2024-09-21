import React from 'react';

const TagButton = ({ children, onClick, disabled, style, ...rest }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    style={{ 
      width: '100%', 
      marginBottom: '10px', 
      padding: '5px', 
      ...style 
    }}
    {...rest}
  >
    {children}
  </button>
);

export default TagButton;