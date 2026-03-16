"use client";
import Loading from "@/components/Loading";
import SettingsForm from "@/components/SettingsForm";
import { useUpdateTenantSettingsMutation } from "@/state/api";
import { useAuth } from "@/app/(auth)/authProvider";
import React from "react";

const TenantSettings = () => {
  const { user, isLoading } = useAuth();
  const [updateTenant] = useUpdateTenantSettingsMutation();

  if (isLoading) return <Loading />;

  const initialData = {
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  };

  const handleSubmit = async (data: typeof initialData, profileImage?: File | null) => {
    await updateTenant({ id: user!.id, ...data, ...(profileImage && { profileImage }) });
  };

  return <SettingsForm initialData={initialData} onSubmit={handleSubmit} userType="tenant" profileImageUrl={user?.profileImageUrl} />;
};

export default TenantSettings;
