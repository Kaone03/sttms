import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-white rounded-2xl px-4 py-2 mb-6">
            <img src="/sttms-logo.svg" alt="STTMS" className="h-16 w-auto" />
          </div>
          <p className="text-white/60 mt-2">
            Smart Tender Transparency and Monitoring System
          </p>
          <p className="text-white/40 text-sm mt-1">Republic of South Africa</p>
        </div>

        <div className="card">
          <div className="card-body">
            <h2 className="text-xl font-semibold text-center mb-6">Sign In</h2>

            {error && (
              <div className="alert-danger mb-4 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Login Failed</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-10"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-text-muted text-center mb-4"></p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => { setEmail('admin@sttms.gov.za'); setPassword('admin123'); }}
                  className="btn btn-ghost justify-start"
                >
                  Admin
                </button>
                <button
                  onClick={() => { setEmail('procurement@treasury.gov.za'); setPassword('procurement123'); }}
                  className="btn btn-ghost justify-start"
                >
                  Procurement
                </button>
                <button
                  onClick={() => { setEmail('auditor@auditor.gov.za'); setPassword('auditor123'); }}
                  className="btn btn-ghost justify-start"
                >
                  Auditor
                </button>
                <button
                  onClick={() => { setEmail('supplier@construction.co.za'); setPassword('supplier123'); }}
                  className="btn btn-ghost justify-start"
                >
                  Supplier
                </button>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-text-muted mb-2">
                Don't have an account?{' '}
                <Link to="/register" className="text-secondary hover:underline font-medium">
                  Register here
                </Link>
              </p>
              <Link to="/public" className="text-sm text-secondary hover:underline">
                Continue as Public User
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-white/40 text-sm mt-6">
          National Treasury - Republic of South Africa
        </p>
      </div>
    </div>
  );
}
