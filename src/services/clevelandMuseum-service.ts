import axios from "axios";

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

export function fetchClevelandArtworkDetail(externalId: number): Promise<any> {
  const url = `https://openaccess-api.clevelandart.org/api/artworks/${externalId}`;
  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Cleveland Museum Detail API Error:", error.message);
      throw new Error(
        "Failed to fetch artwork detail from Cleveland Museum API"
      );
    });
}
