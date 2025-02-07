import axios from "axios";

export function fetchArtInstituteArtworks(
  search: string,
  page: number,
  filter?: Record<string, string>
): Promise<any> {
  let url = `https://api.artic.edu/api/v1/artworks?fields=id,title,image_id,artist_display&page=${page}`;
  if (search) {
    url += `&q=${encodeURIComponent(search)}`;
  }
  if (filter?.artist) {
    url += `&artist_display=${encodeURIComponent(filter.artist)}`;
  }

  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Art Institute API Error:", error.message);
      throw new Error("Failed to fetch artworks from Art Institute API");
    });
}

export function fetchArtInstituteArtworkDetail(
  externalId: number
): Promise<any> {
  const url = `https://api.artic.edu/api/v1/artworks/${externalId}?fields=id,title,image_id,artist_display,date_display,medium_display,dimensions_display,description`;
  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Art Institute Detail API Error:", error.message);
      throw new Error("Failed to fetch artwork detail from Art Institute API");
    });
}
