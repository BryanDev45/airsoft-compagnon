
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const LoginButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Button variant="default" className="bg-airsoft-red hover:bg-red-700" onClick={handleLogin}>
      Se connecter
    </Button>
  );
};

export default LoginButton;
