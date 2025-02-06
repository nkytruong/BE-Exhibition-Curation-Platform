import axios from "axios";
/**
 * Fetch artworks from the Art Institute of Chicago API.
 */
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
