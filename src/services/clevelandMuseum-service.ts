import axios from "axios";

/**
 * Fetch artworks from the Cleveland Museum of Art API.
 */
export function fetchClevelandArtworks(
  search: string,
  page: number,
  filter?: Record<string, string>
): Promise<any> {
  let url = `https://openaccess-api.clevelandart.org/api/artworks?page=${page}`;
  if (search) {
    url += `&q=${encodeURIComponent(search)}`;
  }
  if (filter?.artist) {
    url += `&artist=${encodeURIComponent(filter.artist)}`;
  }

  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Cleveland Museum API Error:", error.message);
      throw new Error("Failed to fetch artworks from Cleveland Museum API");
    });
}
