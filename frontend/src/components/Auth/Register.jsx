import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateRegisterForm } from '../../utils/validateForm';
import Button from '../Common/Button';

const InputField = ({ label, name, type = 'text', placeholder, value, onChange, error }) => (
  <div>
    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>{label}</label>
    <input 
      type={type} 
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '12px',
        borderRadius: 'var(--border-radius-sm)',
        border: `1px solid ${error ? 'var(--danger-color)' : 'var(--border-color)'}`,
        backgroundColor: 'var(--surface-color-secondary)',
        color: 'var(--text-primary)'
      }}
    />
    {error && <span style={{ color: 'var(--danger-color)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{error}</span>}
  </div>
);

const Register = () => {
  const { register, isLoading, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateRegisterForm(formData);
    
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    await register(formData.email, formData.password, formData.name, formData.username);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-color)',
      padding: 'var(--spacing-4)'
    }}>
      <div style={{
        maxWidth: '450px',
        width: '100%',
        backgroundColor: 'var(--surface-color)',
        padding: 'var(--spacing-8)',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary-color)', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            Socialize
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Create your account and start connecting!</p>
        </div>

        {authError && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: 'rgba(255, 59, 48, 0.1)', 
            color: 'var(--danger-color)', 
            borderRadius: 'var(--border-radius-sm)', 
            marginBottom: 'var(--spacing-4)',
            fontSize: '14px'
          }}>
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <InputField label="Full Name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} error={formErrors.name} />
          <InputField label="Username" name="username" placeholder="johndoe123" value={formData.username} onChange={handleChange} error={formErrors.username} />
          <InputField label="Email Address" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} error={formErrors.email} />
          <InputField label="Password" name="password" type="password" placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} error={formErrors.password} />
          <InputField label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat password" value={formData.confirmPassword} onChange={handleChange} error={formErrors.confirmPassword} />
          
          <Button type="submit" loading={isLoading} style={{ marginTop: '12px', width: '100%' }}>
            Sign Up
          </Button>
        </form>

        <div style={{ marginTop: 'var(--spacing-6)', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
