
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginContainer from '../components/auth/LoginContainer';
import LoginLoading from '../components/auth/login/LoginLoading';
import { useLoginLogic } from '../components/auth/login/useLoginLogic';

const Login = () => {
  const { isLoading } = useLoginLogic();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <LoginLoading />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <LoginContainer />
      </main>
      <Footer />
    </div>
  );
};

export default Login;
