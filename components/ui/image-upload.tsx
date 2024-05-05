import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onRemove: (value: string) => void;
  uploadedImageUrl: string;
  setUploadedImageUrl: React.Dispatch<React.SetStateAction<string>>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onRemove,
  uploadedImageUrl,
  setUploadedImageUrl,
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
      setUploadedImageUrl(result.info.secure_url);
    }
  };

  return (
    <div>
      <div className='mb-4 flex items-center gap-4'>
        {uploadedImageUrl && (
          <div className='relative w-[200px] rounded-md overflow-hidden'>
            <div className='z-10 absolute top-2 right-2'>
              <Button
                type='button'
                onClick={() => onRemove(uploadedImageUrl)}
                variant={"destructive"}>
                <Trash className='h-4 w-4' />
              </Button>
            </div>
            <Image
              width={200}
              height={200}
              className='object-cover'
              alt='Image'
              src={uploadedImageUrl}
            />
          </div>
        )}
      </div>
      <CldUploadWidget onSuccess={handleUploadSuccess} uploadPreset='tgvhbhwa'>
        {({ open }) => {
          function handleOnClick() {
            setUploadedImageUrl("");
            open();
          }
          return (
            <Button
              type='button'
              disabled={disabled}
              variant={"secondary"}
              onClick={handleOnClick}>
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
