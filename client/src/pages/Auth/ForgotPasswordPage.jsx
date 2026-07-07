import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiCheck } from 'react-icons/fi';

const ForgotPasswordPage = () => {
  const { token } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent! Check your email.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.resetPassword(token, password);
      setResetDone(true);
      toast.success('Password reset successful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (resetDone) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <FiCheck size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Password Reset!</h2>
          <p className="text-charcoal-light mb-6">Your password has been updated successfully.</p>
          <Link to="/login" className="bg-accent text-primary px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-accent-dark no-underline transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-charcoal mb-2">Reset Password</h1>
            <p className="text-charcoal-light">Enter your new password</p>
          </div>
          <form onSubmit={handleResetPassword} className="bg-white rounded-xl border border-border p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">New Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="At least 6 characters" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-accent text-primary py-2.5 rounded-lg font-semibold text-sm hover:bg-accent-dark disabled:opacity-50 border-none cursor-pointer transition-colors">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FiMail size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Check Your Email</h2>
          <p className="text-charcoal-light mb-6">We've sent a password reset link to {email}. Please check your inbox.</p>
          <Link to="/login" className="text-primary font-medium hover:underline">Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2">Forgot Password?</h1>
          <p className="text-charcoal-light">Enter your email to receive a reset link</p>
        </div>
        <form onSubmit={handleRequestReset} className="bg-white rounded-xl border border-border p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" size={18} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="you@example.com" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-accent text-primary py-2.5 rounded-lg font-semibold text-sm hover:bg-accent-dark disabled:opacity-50 border-none cursor-pointer transition-colors">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <p className="text-center text-sm text-charcoal-light">
            Remember your password? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
