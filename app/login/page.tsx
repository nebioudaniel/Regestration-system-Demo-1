'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button
import { Input } from '@/components/ui/input';   // Assuming shadcn/ui Input
import { Label } from '@/components/ui/label';   // Assuming shadcn/ui Label (optional but good practice)
import Link from 'next/link';                     // For a back to home link

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // State for login error message
  const [loading, setLoading] = useState(false); // State for loading indicator

  useEffect(() => {
    // Client-side check for authentication
    if (typeof window !== 'undefined' && localStorage.getItem('admin-auth') === 'true') {
      router.push('/dashboard');
    }
  }, [router]); // Add router to dependency array for useEffect

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true); // Start loading

    // Simulate a network request for a more realistic feel, even if it's just local storage
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        if (typeof window !== 'undefined') { // Ensure localStorage is available
          localStorage.setItem('admin-auth', 'true');
        }
        router.push('/dashboard');
      } else {
        setError('Invalid username or password.'); // Set specific error message
      }
      setLoading(false); // End loading
    }, 500); // Simulate network latency
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white font-sans p-4">
      {/* Login Form Container - styled for minimalist look */}
      <div className="w-full max-w-md p-8 text-center">
        <h1 className="text-4xl font-extrabold mb-8 text-white">
          Admin Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Input */}
          <div className="flex flex-col space-y-2 text-left">
            <Label htmlFor="username-input" className="text-white text-sm">Username</Label>
            <Input
              id="username-input"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`bg-black border ${
                error ? 'border-red-500' : 'border-white' // Highlight border on error
              } text-white placeholder:text-white focus:border-white focus-visible:ring-offset-black`}
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col space-y-2 text-left">
            <Label htmlFor="password-input" className="text-white text-sm">Password</Label>
            <Input
              id="password-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`bg-black border ${
                error ? 'border-red-500' : 'border-white' // Highlight border on error
              } text-white placeholder:text-white focus:border-white focus-visible:ring-offset-black`}
              required
            />
          </div>

          {/* Error Message Display */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Login Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-3 sm:px-10 sm:py-4 rounded-lg font-semibold text-lg
                       bg-white text-black hover:bg-black hover:text-white border border-white
                       transition-all duration-200 ease-in-out flex items-center justify-center
                       focus-visible:ring-2 focus-visible:ring-white"
          >
            {loading ? 'Logging In...' : 'Login'}
          </Button>

          {/* Back to Home Link */}
          <div className="text-center pt-4">
            <Link href="/" className="text-sm text-white hover:underline transition-colors duration-200">
              &larr; Back to Home
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}