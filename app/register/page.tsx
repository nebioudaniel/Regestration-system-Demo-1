'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.firstName.trim()) newErrors.firstName = 'First Name is required.';
    if (!form.lastName.trim()) newErrors.lastName = 'Last Name is required.';

    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid.';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone Number is required.';
    } else if (!/^\d{10,}$/.test(form.phone)) {
      newErrors.phone = 'Phone Number is invalid (min 10 digits).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/profile');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Registration network error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Enter your first name' },
    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Enter your last name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email' },
    { name: 'phone', label: 'Phone Number', type: 'text', placeholder: 'Enter your phone number' },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white font-sans p-4">
      {/* Removed the containing div that was acting like a 'square thing' */}
      {/* Also removed its background color, border, and shadow */}

      <div className="w-full max-w-md p-8"> {/* Only max-width and padding to center content */}
        <h1 className="text-5xl font-extrabold mb-8 text-white text-center">
          Register for Multiverse
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name} className="flex flex-col space-y-2">
              <Label htmlFor={name} className="capitalize text-white text-sm">
                {label}
              </Label>
              <Input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                className={`bg-black border ${ // Input background is black, border is white/red
                  errors[name] ? 'border-red-500' : 'border-white' // No gray border
                } text-white placeholder:text-white focus:border-white focus-visible:ring-offset-black`} // Pure white focus
              />
              {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
            </div>
          ))}

          <div className="text-center pt-4">
            <Link href="/" className="text-sm text-white hover:underline transition-colors duration-200">
              &larr; Back to Home
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-3 sm:px-10 sm:py-4 rounded-lg font-semibold text-lg
                       bg-white text-black hover:bg-black hover:text-white border border-white
                       transition-all duration-200 ease-in-out flex items-center justify-center
                       focus-visible:ring-2 focus-visible:ring-white"
          >
            {loading ? 'Submitting...' : 'Create Account'}
          </Button>
        </form>
      </div>
    </main>
  );
}