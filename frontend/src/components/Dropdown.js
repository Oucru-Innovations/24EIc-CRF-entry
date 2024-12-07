import React from 'react';

function Dropdown({ label, options, name, value, onChange }) {
  return (
    <div>
      <label>{label}:</label>
      <select name={name} value={value} onChange={onChange} required>
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.reason || option.event}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;
