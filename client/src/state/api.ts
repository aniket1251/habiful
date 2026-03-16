import { cleanParams, withToast } from "@/lib/utils";
import { Application, Lease, Manager, Payment, Property, Tenant } from "@/types/prismaTypes";
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { FiltersState } from ".";

// Token management - access token stored in memory
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wrapper that handles 401 → refresh (cookie sent automatically) → retry
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Attempt refresh — cookie sent automatically
    const refreshResult = await baseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const data = refreshResult.data as { accessToken: string };
      setAccessToken(data.accessToken);

      // Retry original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed — redirect to login
      setAccessToken(null);
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
    }
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "api",
  tagTypes: ["Managers", "Tenants", "Properties", "PropertyDetails", "Leases", "Payments", "Applications"],
  endpoints: (build) => ({
    // property related endpoints
    getProperties: build.query<Property[], Partial<FiltersState> & { favoriteIds?: number[] }>({
      query: (filters) => {
        const params = cleanParams({
          location: filters.location,
          priceMin: filters.priceRange?.[0],
          priceMax: filters.priceRange?.[1],
          beds: filters.beds,
          baths: filters.baths,
          propertyType: filters.propertyType,
          squareFeetMin: filters.squareFeet?.[0],
          squareFeetMax: filters.squareFeet?.[1],
          amenities: Array.isArray(filters.amenities) ? filters.amenities.join(",") : undefined,
          availableFrom: filters.availableFrom,
          favoriteIds: filters.favoriteIds?.join(","),
          latitude: filters.coordinates?.[1],
          longitude: filters.coordinates?.[0],
        });
        return { url: "properties", params };
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Properties" as const, id })), { type: "Properties", id: "LIST" }]
          : [{ type: "Properties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to fetch properties." });
      },
    }),

    getProperty: build.query<Property, number>({
      query: (id) => `properties/${id}`,
      providesTags: (result, error, id) => [{ type: "PropertyDetails", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to load property details." });
      },
    }),

    // tenant related endpoints
    getTenant: build.query<Tenant, number>({
      query: (id) => `tenants/${id}`,
      providesTags: (result) => [{ type: "Tenants", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to load tenant profile." });
      },
    }),

    getCurrentResidences: build.query<Property[], number>({
      query: (id) => `tenants/${id}/current-residences`,
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.filter((item): item is Property => Boolean(item?.id)).map(({ id }) => ({ type: "Properties" as const, id })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to fetch current residences." });
      },
    }),

    updateTenantSettings: build.mutation<Tenant, { id: number; profileImage?: File } & Partial<Tenant>>({
      query: ({ id, profileImage, ...updatedTenant }) => {
        if (profileImage) {
          const formData = new FormData();
          Object.entries(updatedTenant).forEach(([key, value]) => {
            if (value !== undefined) formData.append(key, String(value));
          });
          formData.append("profileImage", profileImage);
          return { url: `tenants/${id}`, method: "PUT", body: formData };
        }
        return { url: `tenants/${id}`, method: "PUT", body: updatedTenant };
      },
      invalidatesTags: (result) => [{ type: "Tenants", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { success: "Settings updated successfully!", error: "Failed to update settings." });
      },
    }),

    addFavoriteProperty: build.mutation<Tenant, { id: number; propertyId: number }>({
      query: ({ id, propertyId }) => ({
        url: `tenants/${id}/favorites/${propertyId}`,
        method: "POST",
      }),
      invalidatesTags: (result) => [
        { type: "Tenants", id: result?.id },
        { type: "Properties", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { success: "Added to favorites!", error: "Failed to add to favorites." });
      },
    }),

    removeFavoriteProperty: build.mutation<Tenant, { id: number; propertyId: number }>({
      query: ({ id, propertyId }) => ({
        url: `tenants/${id}/favorites/${propertyId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => [
        { type: "Tenants", id: result?.id },
        { type: "Properties", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { success: "Removed from favorites!", error: "Failed to remove from favorites." });
      },
    }),

    // manager related endpoints
    updateManagerSettings: build.mutation<Manager, { id: number; profileImage?: File } & Partial<Manager>>({
      query: ({ id, profileImage, ...updatedManager }) => {
        if (profileImage) {
          const formData = new FormData();
          Object.entries(updatedManager).forEach(([key, value]) => {
            if (value !== undefined) formData.append(key, String(value));
          });
          formData.append("profileImage", profileImage);
          return { url: `managers/${id}`, method: "PUT", body: formData };
        }
        return { url: `managers/${id}`, method: "PUT", body: updatedManager };
      },
      invalidatesTags: (result) => [{ type: "Managers", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { success: "Details updated successfully!", error: "Failed to update settings." });
      },
    }),

    createProperty: build.mutation<Property, FormData>({
      query: (newProperty) => ({
        url: "properties",
        method: "POST",
        body: newProperty,
      }),
      invalidatesTags: (result) => [
        { type: "Properties", id: "LIST" },
        { type: "Managers", id: result?.manager?.id },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { success: "Property created successfully!", error: "Failed to create property." });
      },
    }),

    getManagerProperties: build.query<Property[], number>({
      query: (id) => `managers/${id}/properties`,
      providesTags: (result) => {
        if (!result) return [{ type: "Properties", id: "LIST" }];
        const validItems = result.filter((item): item is Property => Boolean(item && item.id));
        return [
          ...validItems.map((item) => ({ type: "Properties" as const, id: item.id })),
          { type: "Properties", id: "LIST" },
        ];
      },
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to load manager properties." });
      },
    }),

    // leases related endpoints
    getLeases: build.query<Lease[], void>({
      query: () => "leases",
      providesTags: ["Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to fetch leases." });
      },
    }),

    getPropertyLeases: build.query<Lease[], number>({
      query: (propertyId) => `properties/${propertyId}/leases`,
      providesTags: ["Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to fetch property leases." });
      },
    }),

    getPayments: build.query<Payment[], number>({
      query: (leaseId) => `leases/${leaseId}/payments`,
      providesTags: ["Payments"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to fetch payment info." });
      },
    }),

    // application related endpoints
    getApplications: build.query<Application[], { userId?: number; userType?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.userId) queryParams.append("userId", params.userId.toString());
        if (params.userType) queryParams.append("userType", params.userType);
        return `applications?${queryParams.toString()}`;
      },
      providesTags: ["Applications"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to fetch applications." });
      },
    }),

    updateApplicationStatus: build.mutation<Application & { lease?: Lease }, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `applications/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Applications", "Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { success: "Application status updated successfully!", error: "Failed to update application settings." });
      },
    }),

    createApplication: build.mutation<Application, Partial<Application>>({
      query: (body) => ({
        url: "applications",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Applications"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { success: "Application created successfully!", error: "Failed to create applications." });
      },
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useGetTenantQuery,
  useUpdateTenantSettingsMutation,
  useGetCurrentResidencesQuery,
  useAddFavoritePropertyMutation,
  useRemoveFavoritePropertyMutation,
  useUpdateManagerSettingsMutation,
  useCreatePropertyMutation,
  useGetManagerPropertiesQuery,
  useGetLeasesQuery,
  useGetPropertyLeasesQuery,
  useGetPaymentsQuery,
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useCreateApplicationMutation,
} = api;
