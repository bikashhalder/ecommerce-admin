import { auth } from "@/auth";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  // const email = session?.user?.email!;

  // console.log("email", email);

  // const users = await prismadb.user.findUnique({
  //   where: {
  //     email,
  //   },
  // });

  if (!session?.user?.id) {
    redirect("/Login");
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
};

export default layout;
