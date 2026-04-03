import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import useValidation from "../../hooks/useValidation";

const LoginForm = ({ error, setError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { emailError, validateEmail } = useValidation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto py-12 md:py-24 px-8 spell-fade-up">
      <div className="flex flex-col gap-4 mb-16 text-center">
        <div className="w-20 h-20 mx-auto bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[var(--color-text-main)] tracking-tight">Welcome back!</h1>
        <p className="font-sans text-xl text-[var(--color-text-muted)] font-medium">Let's see what's cooking.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 soft-card p-6 md:p-10 mb-8 border-none">
        
        {error && <div className="bg-[var(--color-primary-light)] text-[var(--color-primary)] p-4 rounded-xl font-bold text-center text-sm">{error}</div>}
        {emailError && <div className="bg-[var(--color-primary-light)] text-[var(--color-primary)] p-4 rounded-xl font-bold text-center text-sm">{emailError}</div>}
        
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-display font-bold text-[var(--color-text-main)] ml-2">Email address</label>
            <input
              type="email"
              placeholder="mom@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-soft"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-display font-bold text-[var(--color-text-main)] ml-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-soft"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-4 w-full justify-center">
          {loading ? "Signing in..." : "Sign In 👋"}
        </button>
      </form>

      <div className="text-center font-sans font-medium text-[var(--color-text-muted)]">
        Don't have an account?{" "}
        <Link to="/register" className="text-[var(--color-secondary)] font-bold hover:underline ml-1">
          Sign up free
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
