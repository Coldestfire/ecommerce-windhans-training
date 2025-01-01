import { useSelector } from 'react-redux';
import { UserSlicePath } from '../provider/slice/user.slice';

export const useAuth = () => {
  const user = useSelector(UserSlicePath);
  
  return {
    user,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user
  };
};