"use client";
import { useState } from "react";
import { account } from "../appwrite";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

const LoginPage = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  if (user) {
    router.push("/editor");
  }

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const session = await account.createEmailPasswordSession({
        email,
        password
      });
      setLoggedInUser(await account.get());
      router.push("/editor");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await account.deleteSession({ sessionId: 'current' });
    setLoggedInUser(null);
  };

  if (loggedInUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <div className="card-body">
            <p className="text-center text-lg font-medium">
              Logged in as {loggedInUser.name}
            </p>
            <div className="card-actions justify-center">
              <button
                type="button"
                onClick={logout}
                className="btn btn-error"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
        <div className="card-body">
          <h1 className="card-title text-center">Login</h1>
          {error && <p className="text-error text-center">{error}</p>}
          <form onSubmit={login}>
            <fieldset className="fieldset">
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
                className="btn btn-neutral mt-4 w-full"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </fieldset>
          </form>
          <p className="text-center mt-4">
            Don't have an account?{' '}
            <Link href="/register" className="link link-primary">
              Register here
            </Link>
          </p>
        </div>
      </div>
      {/* <div className="relative -right-px "></div>
      <div className="relative -left-px "></div>
      <div className="relative -bottom-px "></div>
      <div className="relative -top-px "></div> */}
    </div>
  );
};

export default LoginPage;
