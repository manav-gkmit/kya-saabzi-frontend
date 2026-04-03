import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import useValidation from "../../hooks/useValidation";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register } = useAuth();
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
      await register({ username, email, password, invite_code: inviteCode.trim() || null });
      navigate("/login");
    } catch (error) {
      console.error("Failed to register", error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto py-12 md:py-24 px-8 spell-fade-up">
      <div className="flex flex-col gap-4 mb-12 text-center">
        <div className="w-20 h-20 mx-auto bg-[var(--color-secondary-light)] text-[var(--color-secondary)] rounded-full flex items-center justify-center mb-2">
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path></svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[var(--color-text-main)] tracking-tight">Join the family</h1>
        <p className="font-sans text-lg text-[var(--color-text-muted)] font-medium max-w-sm mx-auto">Create an account to start tracking your family's favorite meals.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 soft-card p-6 md:p-10 mb-8 border-none bg-white">
        
        {error && <div className="bg-[var(--color-primary-light)] text-[var(--color-primary)] p-4 rounded-xl font-bold text-center text-sm">{error}</div>}
        {emailError && <div className="bg-[var(--color-primary-light)] text-[var(--color-primary)] p-4 rounded-xl font-bold text-center text-sm">{emailError}</div>}

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-display font-bold text-sm text-[var(--color-text-main)] opacity-70 uppercase tracking-wide ml-2">Your Name</label>
            <input
              type="text"
              placeholder="What should we call you?"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-soft"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-display font-bold text-sm text-[var(--color-text-main)] opacity-70 uppercase tracking-wide ml-2">Email address</label>
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
            <label className="font-display font-bold text-sm text-[var(--color-text-main)] opacity-70 uppercase tracking-wide ml-2">Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-soft"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-display font-bold text-sm text-[var(--color-text-main)] opacity-70 uppercase tracking-wide ml-2">Invite Code (Optional)</label>
            <input
              type="text"
              placeholder="Join an existing family"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="input-soft"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-4 w-full justify-center">
          {loading ? "Creating..." : "Sign up free ✨"}
        </button>
      </form>

      <div className="text-center font-sans font-medium text-[var(--color-text-muted)]">
        Already have an account?{" "}
        <Link to="/login" className="text-[var(--color-secondary)] font-bold hover:underline ml-1">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
