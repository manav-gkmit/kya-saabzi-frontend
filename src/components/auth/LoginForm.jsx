import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import useValidation from "../../hooks/useValidation";

const LoginForm = ({ error, setError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { emailError, validateEmail } = useValidation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      return;
    }

    try {
      await login({ email, password });
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md mx-auto mt-10"
    >
      <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
        Login
      </h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {emailError && (
        <p className="text-red-500 text-center mb-4">{emailError}</p>
      )}
      <div className="mb-4">
        <label for="email">Email</label>
        <input
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="mb-6">
        <label for="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Login
      </button>
      <p className="text-center text-gray-600 mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-green-600 hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
