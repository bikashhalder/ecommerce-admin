"use server";
import { signIn } from "@/auth";
import { CredentialsSignin } from "next-auth";

interface LoginFormProps {
  email: string;
  password: string;
}

const handleLogin = async ({ email, password }: LoginFormProps) => {
  try {
    await signIn("credentials", {
      email,
      password,
    });
  } catch (error) {
    const err = error as CredentialsSignin;
    return err.message;
  }
};

export { handleLogin };
