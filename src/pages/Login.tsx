import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';

const Login = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/account');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <LoginForm onSuccess={handleSuccess} />
    </div>
  );
};

export default Login;
