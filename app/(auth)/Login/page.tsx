import Link from "next/link";
import LoginForm from "./components/login-form";
import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

const Login = async () => {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <>
      <div className=' w-full h-full '>
        <div className='text-center mt-10'>
          <h1 className='text-3xl font-bold'>E-Commerce Management</h1>
          <h2 className='text-muted-foreground mt-3 text-sm'>
            Your Go To E-Commerce Management Platform
          </h2>
        </div>
        <div className='text-center'>
          <h3 className='text-lg font-bold mt-3'>Sign in to your account</h3>
        </div>
        <div className='flex justify-center items-center h-full w-full'>
          <div className='w-1/2 shadow-md p-5 rounded-md'>
            <LoginForm />

            <div className='mt-2 text-center'>
              <span className='bg-white px-2 text-gray-500'>
                Or Sign-In with
              </span>
            </div>
            <div className='flex mt-4'>
              <form
                action={async () => {
                  "use server";
                  await signIn("github");
                }}
                className='w-1/2 border-2 rounded-sm m-1 p-2 flex justify-center'>
                <button type='submit'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-github'>
                    <path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4' />
                    <path d='M9 18c-4.51 2-5-2-7-2' />
                  </svg>
                </button>
              </form>
              <form
                action={async () => {
                  "use server";
                  await signIn("google");
                }}
                className='w-1/2 border-2 rounded-sm m-1 p-2 flex justify-center'>
                <button type='submit'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    x='0px'
                    y='0px'
                    width='24'
                    height='24'
                    viewBox='0 0 30 30'>
                    <path d='M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z'></path>
                  </svg>
                </button>
              </form>
            </div>
            <div className='text-center mt-3 flex'>
              <h3>Create an account?</h3>
              <Link href={"/sign-up"}>
                <div className='underline cursor-pointer ml-1'>Sign Up</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
