// hooks/useAuth.js
import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';

export default function useAuth() {
  const auth = useSelector(selectAuth);
  
  return {
    isAdmin: auth.current?.role === 'admin',
    isOwner: auth.current?.role === 'owner',
    isBranchManager: auth.current?.role === 'branch_manager',
    isEmployee: auth.current?.role === 'employee',
    isAuthenticated: auth.isLoggedIn,
    user: auth.current,
  };
}