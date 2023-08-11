import React from "react";
import { Input } from "@/shared/components/ui/input";

interface ImagePickerProps {
  setImage: (image: File) => void;
  defaultImage?: string | null;
}

function ImagePicker({ setImage, defaultImage }: ImagePickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = React.useState<string | undefined>();

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  React.useEffect(() => {
    if (defaultImage) {
      setImagePreview(defaultImage);
    }
  }, [defaultImage]);

  return (
    <div className="flex flex-col gap-4">
      <img
        onClick={() => inputRef.current?.click()}
        src={imagePreview}
        alt="Profile"
        height={96}
        width={96}
        className="rounded-full cursor-pointer"
      />
      <Input
        className="hidden"
        ref={inputRef}
        type="file"
        onChange={onChange}
      />
    </div>
  );
}

export default ImagePicker;
