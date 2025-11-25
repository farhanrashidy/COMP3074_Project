import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function SignInPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [ password, setPassword ] = useState('');
  const [ error, setError ] = useState(null);

  const submit = async (e) => {
    e.preventDefault();

    // TODO: see if the password can be hashed client-side before sending to the server

    const { loginError } = await signIn(email, password);
    if (loginError)
      setError(loginError.message); 
    else
      setError(null);
  };

  // if (sent) return <div>Check your email for a magic link</div>;
  return (
    <>
      <form onSubmit={submit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign In</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </>
  );
}