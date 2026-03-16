import { SettingsFormData, settingsSchema } from '@/lib/schemas';
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from './ui/form';
import { CustomFormField } from './FormField';
import { Button } from './ui/button';
import ImagePicker from './ImagePicker';

interface SettingsFormProps {
  initialData: SettingsFormData;
  onSubmit: (data: SettingsFormData, profileImage?: File | null) => Promise<void>;
  userType: "manager" | "tenant";
  profileImageUrl?: string | null;
}

const SettingsForm = ({
  initialData,
  onSubmit,
  userType,
  profileImageUrl,
}: SettingsFormProps) => {
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  });

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      form.reset(initialData);
      setProfileImage(null);
    }
  };

  const handleSubmit = async (data: SettingsFormData) => {
    await onSubmit(data, profileImage);
    setEditMode(false);
    setProfileImage(null);
  };

  return (
    <div className='pt-6 pb-4 px-4 sm:pt-8 sm:pb-5 sm:px-6 md:px-8'>
      <div className='mb-4 sm:mb-5'>
        <h1 className='text-lg sm:text-xl font-semibold'>
          {`${userType.charAt(0).toUpperCase() + userType.slice(1)} Settings`}
        </h1>
        <p className='text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1'>
          Manage your account preferences and personal information
        </p>
      </div>
      <div className='bg-white rounded-xl p-4 sm:p-6'>
        <div className="flex justify-center mb-4 sm:mb-6">
          <ImagePicker
            currentImageUrl={profileImageUrl || null}
            onImageSelect={(file) => setProfileImage(file)}
            disabled={!editMode}
            size="lg"
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 sm:space-y-6'>
            <CustomFormField name="name" label='Name' disabled={!editMode} />
            <CustomFormField name="email" label='Email' type='email' disabled={!editMode} />
            <CustomFormField name="phoneNumber" label='Phone Number' disabled={!editMode} />
            <div className='pt-3 sm:pt-4 flex justify-between'>
              <Button type="button" onClick={toggleEditMode} className='bg-secondary-500 text-white hover:bg-secondary-600 text-xs sm:text-sm px-3 sm:px-4'>
                {editMode ? "Cancel" : "Edit"}
              </Button>
              {editMode && (
                <Button type="submit" className='bg-primary-700 text-white hover:bg-primary-800 text-xs sm:text-sm px-3 sm:px-4'>
                  Save Changes
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SettingsForm;
