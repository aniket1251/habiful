import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";
import { uploadToCloudinary } from "../utils/uploadUtils";

const prisma = new PrismaClient();

export const getTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) throw new Error("Missing tenant id");
    const tenant = await prisma.tenant.findUnique({
      where: { id: Number(id) },
      include: { favorites: true },
    });

    if (tenant) {
      res.json(tenant);
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (err: any) {
    res.status(500).json({ message: "Something went wrong while loading your profile." });
  }
};

export const updateTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber } = req.body;
    if (!id) throw new Error("Missing tenant id");

    let profileImageUrl: string | undefined;
    if (req.file) {
      const publicId = `tenant-${id}-${Date.now()}`;
      profileImageUrl = await uploadToCloudinary(req.file.buffer, publicId, "profile-pictures");
    }

    const updatedTenant = await prisma.tenant.update({
      where: { id: Number(id) },
      data: { name, email, phoneNumber, ...(profileImageUrl && { profileImageUrl }) },
    });

    res.json(updatedTenant);
  } catch (err: any) {
    console.error("Update tenant error:", err);
    res.status(500).json({ message: "Something went wrong while updating your settings." });
  }
};

export const getCurrentResidences = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) throw new Error("Missing tenant id");
    const properties = await prisma.property.findMany({
      where: { tenants: { some: { id: Number(id) } } },
      include: { location: true },
    });

    const residencesWithFormattedLocation = await Promise.all(
      properties.map(async (property) => {
        const coordinates: { coordinates: string }[] =
          await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

        const geoJson: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
        const longitude = geoJson.coordinates[0];
        const latitude = geoJson.coordinates[1];

        return {
          ...property,
          location: {
            ...property.location,
            coordinates: { longitude, latitude },
          },
        };
      })
    );

    res.json(residencesWithFormattedLocation);
  } catch (err: any) {
    res.status(500).json({ message: "Something went wrong while loading residences." });
  }
};

export const addFavoriteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, propertyId } = req.params;
    if (!id) throw new Error("Missing tenant id");
    const tenant = await prisma.tenant.findUnique({
      where: { id: Number(id) },
      include: { favorites: true },
    });

    const propertyIdNumber = Number(propertyId);
    const existingFavorites = tenant?.favorites || [];

    if (!existingFavorites.some((fav) => fav.id === propertyIdNumber)) {
      const updatedTenant = await prisma.tenant.update({
        where: { id: Number(id) },
        data: { favorites: { connect: { id: propertyIdNumber } } },
        include: { favorites: true },
      });
      res.json(updatedTenant);
    } else {
      res.status(409).json({ message: "Property already added as favorite" });
    }
  } catch (err: any) {
    res.status(500).json({ message: "Something went wrong while adding to favorites." });
  }
};

export const removeFavoriteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, propertyId } = req.params;
    if (!id) throw new Error("Missing tenant id");
    const propertyIdNumber = Number(propertyId);

    const updatedTenant = await prisma.tenant.update({
      where: { id: Number(id) },
      data: { favorites: { disconnect: { id: propertyIdNumber } } },
      include: { favorites: true },
    });
    res.json(updatedTenant);
  } catch (err: any) {
    res.status(500).json({ message: "Something went wrong while removing from favorites." });
  }
};
