"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { FormikErrors, useFormik } from "formik";
import { redirect, useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const validate = (values: FormValues) => {
  const errors: FormikErrors<FormValues> = {};
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.name) {
    errors.name = "Name is required";
  }

  // Validate password
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  } else if (values.password.length > 30) {
    errors.password = "Password must be less than 30 characters long";
  }

  return errors;
};

const SignUpForm = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        await axios.post("/api/register", values);

        router.push("/Login");
      } catch (error) {
        toast.error("Something went wrong");
      }
    },
  });
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className='mt-4'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            name='name'
            className='w-full mt-3 mb-3 p-2 border-2 rounded-md'
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.errors.name && (
            <div className='text-red-400'>{formik.errors.name}*</div>
          )}
        </div>

        <div className='mt-4'>
          <label htmlFor='email'>Email</label>
          <input
            type='text'
            name='email'
            className='w-full mt-3 mb-3 p-2 border-2 rounded-md'
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email && (
            <div className='text-red-400'>{formik.errors.email}*</div>
          )}
        </div>
        <div className='mt-3'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            name='password'
            className='w-full mt-2 mb-3 p-2 border-2 rounded-md'
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.errors.password && (
            <div className='text-red-400'>{formik.errors.password}*</div>
          )}
        </div>
        <Button type='submit' className='w-full mt-2'>
          Register
        </Button>
      </form>
    </>
  );
};

export default SignUpForm;
