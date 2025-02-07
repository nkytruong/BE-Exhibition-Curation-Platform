import { Request, Response, NextFunction } from "express";
import { fetchArtInstituteArtworks } from "../services/artIntChicago-service";
import { fetchClevelandArtworks } from "../services/clevelandMuseum-service";
import { normalizeArtInstituteData, normalizeClevelandData } from "../utils/dataNormalisation";

/**
 * Fetch artworks from both museum APIs, normalize data, and return combined results.
 */
export function searchArtworks(req: Request, res: Response, next: NextFunction): void {
  const { q = "", page = "1", artist } = req.query;
  const pageNum = parseInt(page as string, 10) || 1;
  const artworksPerPage = 40;
  const filter: Record<string, string> = {};
  if (artist) {
    filter.artist = artist as string;
  }

  // Fetch data from both APIs concurrently
  Promise.all([
    fetchArtInstituteArtworks(q as string, pageNum, filter),
    fetchClevelandArtworks(q as string, pageNum, filter),
  ])
    .then(([artInstituteRes, clevelandRes]) => {
      const artInstituteArtworks = normalizeArtInstituteData(artInstituteRes);
      const clevelandArtworks = normalizeClevelandData(clevelandRes);
      let combinedResults = [...artInstituteArtworks, ...clevelandArtworks];

      if (artist) {
        combinedResults = combinedResults.filter((artwork) =>
          artwork.artist.toLowerCase().includes((artist as string).toLowerCase())
        );
      }

      const startIndex = (pageNum - 1) * artworksPerPage;
      const pagedResults = combinedResults.slice(startIndex, startIndex + artworksPerPage);
      const totalPages = Math.ceil(combinedResults.length / artworksPerPage);

      res.status(200).json({
        artworks: pagedResults,
        meta: {
          totalArtworks: combinedResults.length,
          totalPages,
          currentPage: pageNum,
          artworksPerPage,
        }
      });
    })
    .catch(next);
}
