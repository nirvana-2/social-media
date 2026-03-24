import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateLoginForm } from '../../utils/validateForm';
import Button from '../Common/Button';

const Login = () => {
  const { login, isLoading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // clear error on typing
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateLoginForm(formData);
    
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    await login(formData.email, formData.password);
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
        maxWidth: '400px',
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
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Log in to continue.</p>
        </div>

        {error && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: 'rgba(255, 59, 48, 0.1)', 
            color: 'var(--danger-color)', 
            borderRadius: 'var(--border-radius-sm)', 
            marginBottom: 'var(--spacing-4)',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--border-radius-sm)',
                border: `1px solid ${formErrors.email ? 'var(--danger-color)' : 'var(--border-color)'}`,
                backgroundColor: 'var(--surface-color-secondary)',
                color: 'var(--text-primary)'
              }}
            />
            {formErrors.email && <span style={{ color: 'var(--danger-color)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.email}</span>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--border-radius-sm)',
                border: `1px solid ${formErrors.password ? 'var(--danger-color)' : 'var(--border-color)'}`,
                backgroundColor: 'var(--surface-color-secondary)',
                color: 'var(--text-primary)'
              }}
            />
            {formErrors.password && <span style={{ color: 'var(--danger-color)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.password}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="#" style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: '500' }}>Forgot password?</Link>
          </div>

          <Button type="submit" loading={isLoading} style={{ marginTop: '8px', width: '100%' }}>
            Log In
          </Button>
        </form>

        <div style={{ marginTop: 'var(--spacing-6)', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
