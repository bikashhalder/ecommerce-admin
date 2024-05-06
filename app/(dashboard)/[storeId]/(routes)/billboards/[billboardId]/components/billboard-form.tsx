"use client";
import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import axios from "axios";
import { FormikErrors, useFormik } from "formik";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface BillboardFormProps {
  initialData: Billboard | null;
}

interface FormValues {
  label: string;
  imageUrl: string;
}

const validate = (values: { label: string }) => {
  const errors: FormikErrors<FormValues> = {};
  if (!values.label) {
    errors.label = "Required";
  } else if (values.label.length > 50) {
    errors.label = "Must be 50 characters or less";
  } else if (values.label.length < 3) {
    errors.label = "Must be greater than 3 characters";
  }

  return errors;
};

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(
    initialData ? initialData.imageUrl : ""
  );
  const router = useRouter();
  const params = useParams();

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData ? "Edit a Billboard" : "Add a new Billboard";
  const toastMessage = initialData ? "Billboard Updated" : "Billboard Created";
  const action = initialData ? "Save Changes" : "Create";

  const formik = useFormik({
    initialValues: {
      label: initialData ? initialData.label : "",
      imageUrl: uploadedImageUrl,
    },
    validate,
    onSubmit: async (values) => {
      console.log(values);
      try {
        setLoading(true);
        const updatedValues = { ...values, imageUrl: uploadedImageUrl };
        if (initialData) {
          await axios.patch(
            `/api/${params.storeId}/billboards/${params.billboardId}`,
            updatedValues
          );
        } else {
          await axios.post(`/api/${params.storeId}/billboards`, updatedValues);
        }
        router.push(`/${params.storeId}/billboards`);
        setLoading(false);
        toast.success(toastMessage);
      } catch (error) {
        toast.error("Something went wrong");
      }
      setLoading(false);
    },
  });

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success("Billboard Deleted");
    } catch (error) {
      toast.error(
        "Make sure you removed all categories using the billboard first."
      );
    }
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {initialData && (
          <Button variant='destructive' size='sm' onClick={() => setOpen(true)}>
            <Trash className='h-4 w-4' />
          </Button>
        )}
      </div>
      <Separator />
      <div className='space-y-4 py-2 pb-4'>
        <div>
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor='name'>Background Image</label>
            <ImageUpload
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              disabled={loading}
              onRemove={() => setUploadedImageUrl("")} // Clear uploaded image URL
            />
            <div className='mt-4'>
              <label htmlFor='label'>Name</label>
              <input
                id='label'
                disabled={loading}
                name='label'
                className='w-full mt-2 mb-3 p-2 border-2 rounded-md'
                onChange={formik.handleChange}
                value={formik.values.label}
              />
              {formik.errors.label && (
                <div className='text-red-500'>{formik.errors.label}*</div>
              )}
            </div>
            <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
              <Button type='submit' disabled={loading}>
                {action}
              </Button>
            </div>
          </form>
        </div>
        <Separator />
      </div>
    </>
  );
};

export default BillboardForm;
