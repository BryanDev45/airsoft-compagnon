
import React from 'react';
import { Separator } from "@/components/ui/separator";
import LoginHeader from './LoginHeader';
import LoginForm from './LoginForm';
import SocialLogin from './SocialLogin';

const LoginContainer = () => {
  return (
    <div className="max-w-md w-full space-y-8">
      <LoginHeader />
      
      <LoginForm />
      
      <Separator className="my-4">
        <span className="px-2 text-xs text-gray-500">OU</span>
      </Separator>
      
      <SocialLogin />
    </div>
  );
};

export default LoginContainer;
