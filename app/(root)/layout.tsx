import { auth } from "@/auth";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  const email = session?.user?.email!;

  const users = await prismadb.user.findUnique({
    where: {
      email,
    },
  });

  console.log("session", session);

  if (!users?.id) {
    redirect("/Login");
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId: users?.id,
    },
  });

  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
};

export default layout;
