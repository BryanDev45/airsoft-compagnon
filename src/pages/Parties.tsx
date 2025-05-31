
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchHeader from '../components/search/SearchHeader';
import SearchTabs from '../components/search/SearchTabs';
import AdminStoreSection from '../components/admin/AdminStoreSection';
import { useAuth } from '../hooks/useAuth';

// This component will automatically scroll to top on mount
const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

const Parties = () => {
  const navigate = useNavigate();
  const { user, initialLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("parties");

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <div className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <SearchHeader />
            
            <SearchTabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              user={user}
            />
            
            {activeTab === "magasins" && (
              <AdminStoreSection user={user} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Parties;
