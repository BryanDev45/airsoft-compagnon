
import React from 'react';
import RegisterHeader from './RegisterHeader';
import RegisterTabs from './components/RegisterTabs';
import RegisterFooter from './components/RegisterFooter';
import { useRegisterContainer } from './hooks/useRegisterContainer';

const RegisterContainer = () => {
  const { isAnyLoading } = useRegisterContainer();

  return (
    <div className="w-full max-w-md">
      <RegisterHeader />

      <div className="mt-8">
        <div className="bg-white py-8 px-6 shadow rounded-lg border-2 border-airsoft-red">
          <RegisterTabs isAnyLoading={isAnyLoading} />
          <RegisterFooter />
        </div>
      </div>
    </div>
  );
};

export default RegisterContainer;
