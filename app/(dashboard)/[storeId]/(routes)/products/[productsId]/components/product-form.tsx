"use client";
import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import MultipleImageUpload from "@/components/ui/multiple-image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Category, Image, Product } from "@prisma/client";
import axios from "axios";
import { FormikErrors, useFormik } from "formik";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
      })
    | null;
  categories: Category[];
}

interface FormValues {
  name: string;
  images: [];
  price: number;
  categoryId: string;
  isFeatured: boolean;
  isArchived: boolean;
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

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState(
    initialData ? initialData.images.map((image) => image.url) : [] // Extracting URLs from each image object
  );

  const [selectedValue, setSelectedValue] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const router = useRouter();
  const params = useParams();

  console.log("is featured", isFeatured);

  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData ? "Edit a Product" : "Add a new Product";
  const toastMessage = initialData ? "Product Updated" : "Product Created";
  const action = initialData ? "Save Changes" : "Create";

  const formik = useFormik({
    initialValues: {
      name: initialData ? initialData.name : "",
      images: [],
      price: 0,
      categoryId: "",
      isFeatured: initialData ? initialData.isFeatured : false,
      isArchived: false,
    },
    validate,
    onSubmit: async (values) => {
      console.log(values);
      try {
        setLoading(true);
        const updatedValues = {
          ...values,
          isFeatured,
          isArchived,
          categoryId: selectedValue,
          images: uploadedImageUrls.map((url) => ({ url })),
        };
        if (initialData) {
          await axios.patch(
            `/api/${params.storeId}/products/${params.productsId}`,
            updatedValues
          );
        } else {
          await axios.post(`/api/${params.storeId}/products`, updatedValues);
        }
        router.refresh();
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
        `/api/${params.storeId}/products/${params.productsId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Product Deleted");
    } catch (error) {
      toast.error("Something went wrong");
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
            <label htmlFor='name'>Images</label>
            <MultipleImageUpload
              uploadedImageUrls={uploadedImageUrls}
              setUploadedImageUrls={setUploadedImageUrls} // Passing the setter function directly
              disabled={loading}
              onRemove={() => setUploadedImageUrls([])} // Clear uploaded image URLs
            />
            <div className='mt-4'>
              <label htmlFor='name'>Name</label>
              <input
                id='name'
                disabled={loading}
                name='name'
                className='w-full mt-2 mb-3 p-2 border-2 rounded-md'
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              {formik.errors.name && (
                <div className='text-red-500'>{formik.errors.name}*</div>
              )}
            </div>
            <div className='mt-4'>
              <label htmlFor='price'>Price</label>
              <input
                id='price'
                disabled={loading}
                name='price'
                className='w-full mt-2 mb-3 p-2 border-2 rounded-md'
                onChange={formik.handleChange}
                value={formik.values.price}
              />
              {formik.errors.price && (
                <div className='text-red-500'>{formik.errors.price}*</div>
              )}
            </div>
            <div className='mt-4'>
              <Select
                disabled={loading}
                name='categoryId'
                onValueChange={(value) => setSelectedValue(value)}
                defaultValue={formik.values.categoryId}>
                <SelectTrigger>
                  <SelectValue placeholder='Select a Category' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='mt-4'>
              <Checkbox
                id='isFeatured'
                checked={isFeatured}
                onCheckedChange={() => setIsFeatured(!isFeatured)}
                disabled={loading}
              />
              <label
                htmlFor='isFeatured'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-3'>
                Featured
              </label>
              <p>This product will appear on the home page</p>
            </div>
            <div className='mt-4'>
              <Checkbox
                id='isArchived'
                checked={isArchived}
                onCheckedChange={() => setIsArchived(!isArchived)}
                disabled={loading}
              />
              <label
                htmlFor='isArchived'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-3'>
                Archived
              </label>
              <p>This product will not appear on the home page</p>
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

export default ProductForm;
