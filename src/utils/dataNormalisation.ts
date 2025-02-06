export interface Artwork {
  external_id: number;
  api_source: "artInstitute" | "clevelandMuseum";
  item_title: string;
  artist: string;
  image_url: string;
  item_created_at: string;
}

// Normalize Art Institute of Chicago data
export function normalizeArtInstituteData(apiData: any): Artwork[] {
  return apiData.data.map((item: any) => ({
    external_id: Number(item.id),
    api_source: "artInstitute",
    item_title: item.title,
    artist: item.artist_display || "Unknown Artist",
    image_url: item.image_id
      ? `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`
      : "",
    item_created_at: item.date_display,
  }));
}

// Normalize Cleveland Museum data
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
    item_created_at: item.creation_date,
  }));
}
