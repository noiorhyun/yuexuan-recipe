'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // For registration success
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      // Assume login uses email (or username) as identifier
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('user', JSON.stringify(data));
      router.push('/recipes');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async () => {
    setError('');
    setSuccessMessage('');

    if (!email || !password) {
      setError('Email and password are required for registration.');
      return;
    }

    try {
      // Assuming register endpoint needs email, password, and username.
      // We'll derive a simple username from the email for this example.
      // Adjust this based on your actual register API requirements.
      const username = email.split('@')[0]; 
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccessMessage('Registration successful! You can now log in.');
      // Optionally clear fields: setEmail(''); setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className={styles.form}>
      <h2>Login or Register</h2>
      {error && <div className={styles.error}>{error}</div>}
      {successMessage && <div className={styles.success}>{successMessage}</div>}
      
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Use a container for buttons */}
      <div className={styles.buttonContainer}>
        <button type="submit" className={styles.loginButton}> 
          Login
        </button>
        <button 
          type="button" 
          onClick={handleRegister} 
          className={styles.registerButton}
        >
          Register
        </button>
      </div>
    </form>
  );
} 