import { ArtworkDetail } from "../types/types";
import { Artwork } from "../types/types";

export function normalizeArtInstituteData(apiData: any): Artwork[] {
  return apiData.data.map((item: any) => ({
    external_id: Number(item.id),
    api_source: "artInstitute",
    item_title: item.title,
    artist: item.artist_display || "Unknown Artist",
    image_url: item.image_id
      ? `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`
      : "",
    item_created_at: item.date_display || "Unknown Creation Date",
  }));
}

export function normalizeClevelandData(apiData: any): Artwork[] {
  return apiData.data.map((item: any) => ({
    external_id: String(item.id),
    api_source: "clevelandMuseum",
    item_title: item.title,
    artist:
      item.creators && item.creators.length > 0
        ? item.creators[0].description
        : "Unknown Artist",
    image_url: item.images && item.images.web ? item.images.web.url : "",
    item_created_at: item.creation_date || "Unknown Creation Date",
  }));
}

export function normalizeArtInstituteArtworkDetail(
  apiData: any
): ArtworkDetail {
  const item = apiData.data;
  return {
    external_id: Number(item.id),
    api_source: "artInstitute",
    item_title: item.title,
    artist: item.artist_display || "Unknown Artist",
    image_url: item.image_id
      ? `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`
      : "",
    item_created_at: item.date_display || "Unknown",
    description: item.publication_history || "",
    medium: item.medium_display || "",
    dimensions: item.dimensions_display || "",
  };
}

export function normalizeClevelandArtworkDetail(apiData: any): ArtworkDetail {
  const item = apiData.data;
  return {
    external_id: Number(item.id),
    api_source: "clevelandMuseum",
    item_title: item.title,
    artist:
      item.creators && item.creators.length > 0
        ? item.creators[0].description
        : "Unknown Artist",
    image_url: item.images && item.images.web ? item.images.web.url : "",
    item_created_at: item.creation_date || "Unknown",
    description: item.description || "",
    medium: item.medium || "",
    dimensions: item.dimensions || "",
  };
}
