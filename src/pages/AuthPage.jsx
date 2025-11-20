import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import toast from "react-hot-toast";

const AuthPage = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.success) {
      toast.success("Registration successful!");
    }
  }, [location.state]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      {isLoginPage ? (
        <LoginForm setError={setError} error={error} />
      ) : (
        <RegisterForm />
      )}
    </div>
  );
};

export default AuthPage;
