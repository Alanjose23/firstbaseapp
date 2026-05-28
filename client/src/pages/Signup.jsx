import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import '../styling/Signup.css';

const Signup = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [addUser, { error, loading }] = useMutation(ADD_USER);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addUser({ variables: { ...formState } });
      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">✦</div>
        <h2>Create Account</h2>
        <p className="auth-subtitle">Start your love story today</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={formState.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        {error && <div className="alert-error">{error.message}</div>}

        <p className="auth-quote">
          "It's so easy to fall in love but hard to find someone who will catch you."
        </p>
      </div>
    </div>
  );
};

export default Signup;
