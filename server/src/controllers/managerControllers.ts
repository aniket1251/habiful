import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";
import { uploadToCloudinary } from "../utils/uploadUtils";

const prisma = new PrismaClient();

export const getManager = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) throw new Error("Missing manager id");
    const manager = await prisma.manager.findUnique({
      where: { id: Number(id) },
    });

    if (manager) {
      res.json(manager);
    } else {
      res.status(404).json({ message: "Manager not found" });
    }
  } catch (err: any) {
    res.status(500).json({ message: "Something went wrong while loading your profile." });
  }
};

export const updateManager = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber } = req.body;
    if (!id) throw new Error("Missing manager id");

    let profileImageUrl: string | undefined;
    if (req.file) {
      const publicId = `manager-${id}-${Date.now()}`;
      profileImageUrl = await uploadToCloudinary(req.file.buffer, publicId, "profile-pictures");
    }

    const updatedManager = await prisma.manager.update({
      where: { id: Number(id) },
      data: { name, email, phoneNumber, ...(profileImageUrl && { profileImageUrl }) },
    });

    res.json(updatedManager);
  } catch (err: any) {
    console.error("Update manager error:", err);
    res.status(500).json({ message: "Something went wrong while updating your settings." });
  }
};

export const getManagerProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) throw new Error("Missing manager id");
    const properties = await prisma.property.findMany({
      where: { managerId: Number(id) },
      include: { location: true },
    });

    const propertiesWithFormattedLocation = await Promise.all(
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

    res.json(propertiesWithFormattedLocation);
  } catch (err: any) {
    res.status(500).json({ message: "Something went wrong while loading properties." });
  }
};
