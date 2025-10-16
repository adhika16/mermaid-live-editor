'use client';
import { useState } from 'react';
import { account, ID } from '../appwrite';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push("/editor");
  }

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await account.create({
        userId: ID.unique(),
        email,
        password,
        name,
      });
      // After registration, redirect to login or auto-login
      window.location.href = '/login'; // Or use router.push('/login')
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
        <div className="card-body">
          <h1 className="card-title text-center">Register</h1>
          {error && <p className="text-error text-center">{error}</p>}
          <form onSubmit={register}>
            <fieldset className="fieldset">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input input-bordered"
              />
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input input-bordered"
              />
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input input-bordered"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary mt-4 w-full"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </fieldset>
          </form>
          <p className="text-center mt-4">
            Already have an account?{' '}
            <Link href="/login" className="link link-primary">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;