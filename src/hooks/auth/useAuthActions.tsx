
import { useLogin } from './actions/useLogin';
import { useRegister } from './actions/useRegister';
import { useLogout } from './actions/useLogout';

export const useAuthActions = () => {
  const { login, loading: loginLoading } = useLogin();
  const { register, loading: registerLoading } = useRegister();
  const { logout, loading: logoutLoading } = useLogout();

  const loading = loginLoading || registerLoading || logoutLoading;

  return {
    loading,
    login,
    register,
    logout
  };
};
