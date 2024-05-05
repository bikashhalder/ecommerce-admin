import { auth } from "@/auth";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import React from "react";
import SettingsForm from "./components/SettingsForm";

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const session = await auth();

  if (!session) {
    redirect("/Login");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId: session.user?.id,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
