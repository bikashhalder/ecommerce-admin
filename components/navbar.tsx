import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import MainNav from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Logout from "./logout";
// import { signOut } from "next-auth/react";

const Navbar = async () => {
  const session = await auth();
  const email = session?.user?.email!;

  const users = await prismadb.user.findUnique({
    where: {
      email,
    },
  });
  if (!users?.id) {
    redirect("/Login");
  }

  const store = await prismadb.store.findMany({
    where: {
      userId: users.id,
    },
  });

  return (
    <div className='border-b'>
      <div className='flex h-16 items-center px-4'>
        <StoreSwitcher items={store} />
        <MainNav className='mx-6' />
        <div className='ml-auto flex items-center space-x-4 cursor-pointer'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-20'>
              <DropdownMenuItem>
                <Logout />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
