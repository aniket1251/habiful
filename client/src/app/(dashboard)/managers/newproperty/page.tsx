"use client";
import { CustomFormField } from "@/components/FormField";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PropertyFormData, propertySchema } from "@/lib/schemas";
import { useCreatePropertyMutation, useGetAuthUserQuery } from "@/state/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { AmenityEnum, HighlightEnum, PropertyTypeEnum } from "@/lib/constants";
import { formatEnumString, toE164 } from "@/lib/utils";
import { useRouter } from "next/navigation";

const NewProperty = () => {
  const [createProperty] = useCreatePropertyMutation();
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();

  const handlePropertyDropdownLabel = (value: string) => {
    if (value === "Tinyhouse") return "Tiny House";
    return value;
  };

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      description: "",
      pricePerMonth: 1000,
      securityDeposit: 500,
      applicationFee: 100,
      isPetsAllowed: true,
      isParkingIncluded: true,
      photoUrls: [],
      amenities: [],
      highlights: [],
      beds: 1,
      baths: 1,
      squareFeet: 1000,
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    try {
      if (!authUser?.userInfo.cognitoId) {
        throw new Error("No manager ID found");
      }
      const phoneE164 = toE164(data.phoneNumber);
      console.log("before", data.phoneNumber);
      console.log("after", phoneE164);

      if (!phoneE164) {
        throw new Error("Invalid phone number");
      }

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "photoUrls") {
          const files = value as File[];
          files.forEach((file: File) => {
            formData.append("photos", file);
          });
        } else if (key === "phoneNumber") {
          formData.append("phoneNumber", phoneE164);
        } else if (key === "amenities" || key === "highlights") {
          (value as string[]).forEach((v) => {
            formData.append(key, v);
          });
        } else {
          formData.append(key, String(value));
        }
      });

      formData.append("managerCognitoId", authUser?.userInfo.cognitoId);

      await createProperty(formData).unwrap();
      router.replace("/managers/properties");
    } catch (err) {
      console.error("Failed to create property:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <Header
        title="Add New Property"
        subtitle="Create a new property listing with detailed information"
      />
      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 space-y-10"
          >
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <CustomFormField
                  name="name"
                  label="Property Name"
                  placeholder="e.g. Skyline Residency, Greenview Apartments"
                />
                <CustomFormField
                  name="phoneNumber"
                  label="Contact Number"
                  type="phone"
                  placeholder="Enter contact number"
                />
                <CustomFormField
                  name="description"
                  label="Description"
                  type="textarea"
                  placeholder="Describe the property, surroundings, and what makes it special..."
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Fees */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Fees</h2>
              <CustomFormField
                name="pricePerMonth"
                label="Price per Month"
                type="number"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  name="securityDeposit"
                  label="Security Deposit"
                  type="number"
                />
                <CustomFormField
                  name="applicationFee"
                  label="Application Fee"
                  type="number"
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Property Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomFormField
                  name="beds"
                  label="Number of Beds"
                  type="number"
                />
                <CustomFormField
                  name="baths"
                  label="Number of Baths"
                  type="number"
                />
                <CustomFormField
                  name="squareFeet"
                  label="Square Feet"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CustomFormField
                  name="isPetsAllowed"
                  label="Pets Allowed"
                  type="switch"
                />
                <CustomFormField
                  name="isParkingIncluded"
                  label="Parking Included"
                  type="switch"
                />
              </div>
              <div className="mt-4">
                <CustomFormField
                  name="propertyType"
                  label="Property Type"
                  type="select"
                  placeholder="Select property type"
                  options={Object.keys(PropertyTypeEnum).map((type) => ({
                    value: type,
                    label: handlePropertyDropdownLabel(type),
                  }))}
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Amenities and Highlights */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Amenities and Highlights
              </h2>
              <div className="space-y-6">
                <CustomFormField
                  name="amenities"
                  label="Amenities"
                  type="multi-select"
                  placeholder="Select available amenities"
                  options={Object.keys(AmenityEnum).map((amenity) => ({
                    value: amenity,
                    label: formatEnumString(amenity),
                  }))}
                />
                <CustomFormField
                  name="highlights"
                  label="Highlights"
                  type="multi-select"
                  placeholder="Choose key highlights"
                  options={Object.keys(HighlightEnum).map((highlight) => ({
                    value: highlight,
                    label: formatEnumString(highlight),
                  }))}
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Photos */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Photos</h2>
              <CustomFormField
                name="photoUrls"
                label="Property Photos"
                type="file"
                accept="image/*"
              />
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Additional Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">
                Additional Information
              </h2>
              <CustomFormField
                name="address"
                label="Address"
                placeholder="Street name, building number"
              />
              <div className="flex justify-between gap-4">
                <CustomFormField
                  name="city"
                  label="City"
                  className="w-full"
                  placeholder="e.g. Bengaluru"
                />
                <CustomFormField
                  name="state"
                  label="State"
                  className="w-full"
                  placeholder="e.g. Karnataka"
                />
                <CustomFormField
                  name="postalCode"
                  label="Postal Code"
                  className="w-full"
                  placeholder="e.g. 560102"
                />
              </div>
              <CustomFormField
                name="country"
                label="Country"
                placeholder="e.g. India"
              />
            </div>

            <Button
              type="submit"
              className="bg-primary-700 text-white w-full mt-8"
            >
              Create Property
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewProperty;
