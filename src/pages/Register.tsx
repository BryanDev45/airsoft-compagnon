
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RegisterContainer from '../components/auth/register/RegisterContainer';

export default function Register() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <RegisterContainer />
      </main>
      <Footer />
    </div>
  );
}
