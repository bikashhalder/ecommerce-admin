"use client";
import AlertModal from "@/components/modals/alert-modal";
import ApiAlert from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { Store } from "@prisma/client";
import axios from "axios";
import { FormikErrors, useFormik } from "formik";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface SettingsFormProps {
  initialData: Store;
}

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

const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await axios.patch(`/api/stores/${params.storeId}`, values);
        router.refresh();
        toast.success("Store Updated");
      } catch (error) {
        toast.error("Something went wrong");
      }
      setLoading(false);
    },
  });

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push("/");
      toast.success("Store Deleted");
    } catch (error) {
      toast.error("Make sure you removed all products and categories first.");
    }
    setLoading(false);
    setOpen(false);
  };

  const defaultValue = initialData.name;
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className='flex items-center justify-between'>
        <Heading title='Settings' description='Manage Store Preference' />

        <Button variant='destructive' size='sm' onClick={() => setOpen(true)}>
          <Trash className='h-4 w-4' />
        </Button>
      </div>
      <Separator />
      <div className='space-y-4 py-2 pb-4'>
        <div>
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor='name'>Name</label>
            <input
              id='name'
              disabled={loading}
              name='name'
              defaultValue={defaultValue}
              className='w-full mt-2 mb-3 p-2 border-2 rounded-md'
              onChange={formik.handleChange}
              value={formik.values.name || defaultValue}
            />
            {formik.errors.name ? (
              <div className='text-red-500'>{formik.errors.name}*</div>
            ) : null}
            <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
              <Button type='submit' disabled={loading}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
        <Separator />
        <ApiAlert
          title='NEXT_PUBLIC_API_URL'
          description={`${origin}/api/${params.storeId}`}
          variant='public'
        />
      </div>
    </>
  );
};

export default SettingsForm;
