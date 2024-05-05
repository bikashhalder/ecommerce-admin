"use client";
import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Billboard, Category } from "@prisma/client";
import axios from "axios";
import { FormikErrors, useFormik } from "formik";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

interface FormValues {
  name: string;
  billboardId: string;
}

const validate = (values: { name: string }) => {
  const errors: FormikErrors<FormValues> = {};
  if (!values.name) {
    errors.name = "Required";
  } else if (values.name.length > 50) {
    errors.name = "Must be 50 characters or less";
  } else if (values.name.length < 3) {
    errors.name = "Must be greater than 3 characters";
  }

  return errors;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  console.log("selected value", selectedValue);
  const router = useRouter();
  const params = useParams();

  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData ? "Edit a Category" : "Add a new Category";
  const toastMessage = initialData ? "Category Updated" : "Category Created";
  const action = initialData ? "Save Changes" : "Create";

  const formik = useFormik({
    initialValues: {
      name: initialData ? initialData.name : "",
      billboardId: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const updatedValues = { ...values, billboardId: selectedValue };
        if (initialData) {
          await axios.patch(
            `/api/categories/${params.categoryId}`,
            updatedValues
          );
        } else {
          await axios.post(`/api/${params.storeId}/categories`, updatedValues);
        }
        router.refresh();
        setLoading(false);
        toast.success(toastMessage);
        router.push(`/${params.storeId}/categories`);
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
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success("Category Deleted");
    } catch (error) {
      toast.error(
        "Make sure you removed all products using the category first."
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
            <div className='mt-4'>
              <label htmlFor='name'>Name</label>
              <input
                id='name'
                disabled={loading}
                name='name'
                className='w-full mt-2 mb-3 p-2 border-2 rounded-md'
                onChange={formik.handleChange}
                value={formik.values.name}
                placeholder='Category Name'
              />
              {formik.errors.name && (
                <div className='text-red-500'>{formik.errors.name}*</div>
              )}
            </div>
            <div className='mt-4'>
              <label htmlFor='billboardId'>Billboard Id</label>
              <Select
                disabled={loading}
                name='billboardId'
                onValueChange={(value) => setSelectedValue(value)}
                defaultValue={formik.values.billboardId}>
                <SelectTrigger>
                  <SelectValue placeholder='Select a Billboard' />
                </SelectTrigger>
                <SelectContent>
                  {billboards.map((billboard) => (
                    <SelectItem key={billboard.id} value={billboard.id}>
                      {billboard.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default CategoryForm;
