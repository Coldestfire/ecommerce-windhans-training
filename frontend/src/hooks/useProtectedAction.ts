import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useProtectedAction = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const runProtectedAction = (action: () => void) => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    action();
  };

  return runProtectedAction;
}; 