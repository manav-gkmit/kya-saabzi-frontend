import { useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="flex justify-center items-center min-h-screen">
      {isLoginPage ? <LoginForm /> : <RegisterForm />}
    </div>
  );
};

export default AuthPage;