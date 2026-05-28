import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import '../styling/Login.css';

const Login = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, loading }] = useMutation(LOGIN_USER);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { ...formState } });
      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
    }
    setFormState({ email: '', password: '' });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">♥</div>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue your journey</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formState.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {error && <div className="alert-error">{error.message}</div>}

        <p className="auth-quote">
          "To love is to burn, to be on fire."<br />— Jane Austen
        </p>
      </div>
    </div>
  );
};

export default Login;
