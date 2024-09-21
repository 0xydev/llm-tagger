import React from 'react';

const SubmitButton = ({ children, disabled, ...rest }) => (
  <button
    type="submit"
    disabled={disabled}
    style={{
      width: '100%',
      padding: '5px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer'
    }}
    {...rest}
  >
    {children}
  </button>
);

export default SubmitButton;