"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import Cropper, { Area } from "react-easy-crop";
import { Camera, User, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Slider } from "./ui/slider";

interface ImagePickerProps {
  currentImageUrl: string | null;
  onImageSelect: (file: File | null) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZES = { sm: 80, md: 96, lg: 120 };
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

async function getCroppedImg(imageSrc: string, crop: Area): Promise<Blob> {
  const image = new window.Image();
  image.src = imageSrc;
  await new Promise((resolve) => { image.onload = resolve; });

  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(
    image,
    crop.x, crop.y, crop.width, crop.height,
    0, 0, 400, 400
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.9);
  });
}

const ImagePicker = ({
  currentImageUrl,
  onImageSelect,
  disabled = false,
  size = "md",
}: ImagePickerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cropper state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const displayUrl = previewUrl || currentImageUrl;
  const hasImage = !!displayUrl;
  const px = SIZES[size];

  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please select a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be less than 5 MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setRawImageUrl(objectUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropModalOpen(true);

    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (!rawImageUrl || !croppedArea) return;

    const croppedBlob = await getCroppedImg(rawImageUrl, croppedArea);
    const croppedFile = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" });

    const croppedPreview = URL.createObjectURL(croppedBlob);
    setPreviewUrl(croppedPreview);
    onImageSelect(croppedFile);
    setCropModalOpen(false);
    setRawImageUrl(null);
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setRawImageUrl(null);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            "relative rounded-full overflow-hidden border-2 border-gray-200 transition-all",
            !disabled && "cursor-pointer hover:border-primary-400 hover:shadow-md",
            disabled && "opacity-70 cursor-default"
          )}
          style={{ width: px, height: px }}
        >
          {hasImage ? (
            <Image
              src={displayUrl!}
              alt="Profile picture"
              fill
              className="object-cover"
              sizes={`${px}px`}
            />
          ) : (
            <div className="w-full h-full bg-primary-100 flex items-center justify-center">
              <User className="w-1/2 h-1/2 text-primary-400" />
            </div>
          )}
          {!disabled && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
        {!disabled && !error && (
          <p className="text-gray-400 text-xs">Click to upload</p>
        )}
      </div>

      <Dialog open={cropModalOpen} onOpenChange={(open) => { if (!open) handleCropCancel(); }}>
        <DialogContent className="bg-white max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Crop your photo</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-64 sm:h-80 bg-gray-900 rounded-lg overflow-hidden">
            {rawImageUrl && (
              <Cropper
                image={rawImageUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="flex items-center gap-3 px-2">
            <ZoomOut className="w-4 h-4 text-gray-500" />
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(val) => setZoom(val[0])}
              className="flex-1"
            />
            <ZoomIn className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCropCancel}>Cancel</Button>
            <Button className="bg-primary-700 text-white" onClick={handleCropSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImagePicker;
