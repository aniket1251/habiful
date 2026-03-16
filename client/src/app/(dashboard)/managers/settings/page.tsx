"use client";
import Loading from "@/components/Loading";
import SettingsForm from "@/components/SettingsForm";
import { useUpdateManagerSettingsMutation } from "@/state/api";
import { useAuth } from "@/app/(auth)/authProvider";
import React from "react";

const ManagerSettings = () => {
  const { user, isLoading } = useAuth();
  const [updateManager] = useUpdateManagerSettingsMutation();

  if (isLoading) return <Loading />;

  const initialData = {
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  };

  const handleSubmit = async (data: typeof initialData, profileImage?: File | null) => {
    await updateManager({ id: user!.id, ...data, ...(profileImage && { profileImage }) });
  };

  return <SettingsForm initialData={initialData} onSubmit={handleSubmit} userType="manager" profileImageUrl={user?.profileImageUrl} />;
};

export default ManagerSettings;
