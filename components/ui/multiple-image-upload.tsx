"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface MultipleImageUploadProps {
  disabled?: boolean;
  onRemove: (value: string) => void;
  uploadedImageUrls: string[]; // Change to array of strings
  setUploadedImageUrls: React.Dispatch<React.SetStateAction<string[]>>; // Change to array setter
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  disabled,
  onRemove,
  uploadedImageUrls,
  setUploadedImageUrls,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleUploadSuccess = (result: any) => {
    if (result && result.event === "success") {
      setUploadedImageUrls((prevUrls) => [...prevUrls, result.info.secure_url]); // Add new URL to the array
    }
  };

  return (
    <div>
      <div className='mb-4 flex flex-wrap gap-4'>
        {uploadedImageUrls.map((url, index) => (
          <div
            key={index}
            className='relative w-[200px] rounded-md overflow-hidden'>
            <div className='z-10 absolute top-2 right-2'>
              <Button
                type='button'
                onClick={() => onRemove(url)}
                variant={"destructive"}>
                <Trash className='h-4 w-4' />
              </Button>
            </div>
            <Image
              width={200}
              height={200}
              className='object-cover'
              alt='Image'
              src={url}
            />
          </div>
        ))}
      </div>
      <CldUploadWidget onSuccess={handleUploadSuccess} uploadPreset='tgvhbhwa'>
        {({ open }) => {
          function handleOnClick() {
            setUploadedImageUrls([]); // Clear previously uploaded URLs
            open();
          }
          return (
            <Button
              type='button'
              disabled={disabled}
              variant={"secondary"}
              onClick={handleOnClick}>
              Upload Images
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default MultipleImageUpload;
