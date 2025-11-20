import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import useValidation from "../../hooks/useValidation";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { validateEmail, validatePassword } = useValidation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setError(emailValidationError);
      return;
    }
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }
    setError(null);

    try {
      await register({ username, email, password });
      navigate("/login", { state: { success: true } });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.detail) {
        if (Array.isArray(error.response.data.detail)) {
          const errorMessages = error.response.data.detail.map(err => err.msg).join(', ');
          setError(errorMessages);
        } else {
          setError(error.response.data.detail);
        }
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto mt-10"
    >
      <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
        Register
      </h2>
      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}
      <div className="mb-4">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email">Email</label>
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
        <label htmlFor="password">Password</label>
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
        Register
      </button>
      <p className="text-center text-gray-600 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-green-600 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
