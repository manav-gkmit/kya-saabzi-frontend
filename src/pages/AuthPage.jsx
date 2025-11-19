import { useState } from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

const AuthPage = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const [error, setError] = useState(null);

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
