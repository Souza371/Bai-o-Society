import React, { useState } from 'react';
import './Form.css';

function Form({ fields, onSubmit, submitText = 'Enviar', loading = false }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      }
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {errors.general && <div className="error-message">{errors.general}</div>}
      
      {fields.map(field => (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name}>{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={handleChange}
              {...field.attrs}
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type || 'text'}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={handleChange}
              {...field.attrs}
            />
          )}
          {errors[field.name] && (
            <span className="field-error">{errors[field.name]}</span>
          )}
        </div>
      ))}

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Processando...' : submitText}
      </button>
    </form>
  );
}

export default Form;
