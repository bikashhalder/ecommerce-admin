"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "../ui/modal";
import { FormikErrors, useFormik } from "formik";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface FormValues {
  name: string;
}

const validate = (values: { name: string | any[] }) => {
  const errors: FormikErrors<FormValues> = {};
  if (!values.name) {
    errors.name = "Required";
  } else if (values.name.length > 15) {
    errors.name = "Must be 15 characters or less";
  } else if (values.name.length < 3) {
    errors.name = "Must be greater then 3 characters";
  }

  return errors;
};

export const StoreModal = () => {
  const storeModal = useStoreModal();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const response = await axios.post(`/api/stores`, values);
        window.location.assign(`/${response.data.id}`);
        toast.success("Store Created");
      } catch (error) {
        toast.error("Something went wrong");
      }
      setLoading(false);
    },
  });

  return (
    <>
      <Modal
        title='Create Store'
        description='Add a new store to manage products'
        isOpen={storeModal.isOpen}
        onClose={storeModal.onClose}>
        <div className='space-y-4 py-2 pb-4'>
          <div>
            <form onSubmit={formik.handleSubmit}>
              <label htmlFor='name'>Name</label>
              <input
                id='name'
                disabled={loading}
                name='name'
                placeholder='E-Commerce'
                className='w-full mt-2 mb-3 p-2 border-2 rounded-md'
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              {formik.errors.name ? (
                <div className='text-red-500'>{formik.errors.name}*</div>
              ) : null}
              <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                <Button
                  type='button'
                  variant='outline'
                  disabled={loading}
                  onClick={storeModal.onClose}>
                  Cancel
                </Button>
                <Button type='submit' disabled={loading}>
                  Continue
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};
