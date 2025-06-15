
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCreateTeam } from '@/hooks/team/useCreateTeam';
import CreateTeamForm from '@/components/team/create/CreateTeamForm';

const CreateTeam = () => {
  const { 
    register,
    handleSubmit,
    setValue,
    errors,
    onSubmit,
    isSubmitting,
    navigate
  } = useCreateTeam();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="shadow-lg border-t-4 border-airsoft-red">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold text-center">Créer une équipe</CardTitle>
              <CardDescription className="text-center">
                Remplissez le formulaire ci-dessous pour créer votre équipe
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <CreateTeamForm
                register={register}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                errors={errors}
                isSubmitting={isSubmitting}
                setValue={setValue}
                navigate={navigate}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateTeam;
