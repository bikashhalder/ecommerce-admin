import { auth } from "@/auth";
import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
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
    <>
      {/* ----- found problem in navbar ----- */}
      <Navbar />
      {children}
    </>
  );
}
