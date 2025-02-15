import { Request, Response, NextFunction } from "express";
import {
  fetchArtInstituteArtworkDetail,
  fetchArtInstituteArtworks,
} from "../services/artIntChicago-service";
import {
  fetchClevelandArtworkDetail,
  fetchClevelandArtworks,
} from "../services/clevelandMuseum-service";
import {
  normaliseArtInstituteArtworkDetail,
  normaliseArtInstituteData,
  normaliseClevelandArtworkDetail,
  normaliseClevelandData,
} from "../utils/dataNormalisation";

/**
 * Fetch artworks from both museum APIs, normalise data, and return combined results.
 */
export function searchArtworks(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const { q = "", page = "1", artist, source } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const artworksPerPage = 40;
    const filter: Record<string, string> = {};
    
    if (artist) {
      filter.artist = artist as string;
    }
    
    if (source) {
      let fetchFunction;
      if (source === "artInstitute") {
        fetchFunction = fetchArtInstituteArtworks;
      } else if (source === "clevelandMuseum") {
        fetchFunction = fetchClevelandArtworks;
      }
      fetchFunction!(q as string, pageNum, filter)
        .then((apiRes) => {
          const artworks = source === "artInstitute"
            ? normaliseArtInstituteData(apiRes)
            : normaliseClevelandData(apiRes);
          const totalPages = Math.ceil(artworks.length / artworksPerPage);
          res.status(200).send({
            artworks,
            meta: {
              totalArtworks: artworks.length,
              totalPages,
              currentPage: pageNum,
              artworksPerPage,
            },
          });
        })
        .catch(next);
    } else {
      Promise.all([
        fetchArtInstituteArtworks(q as string, pageNum, filter),
        fetchClevelandArtworks(q as string, pageNum, filter),
      ])
        .then(([artInstituteRes, clevelandRes]) => {
          const artInstituteArtworks = normaliseArtInstituteData(artInstituteRes);
          const clevelandArtworks = normaliseClevelandData(clevelandRes);
          let combinedResults = [...artInstituteArtworks, ...clevelandArtworks];
    
          if (artist) {
            combinedResults = combinedResults.filter((artwork) =>
              artwork.artist.toLowerCase().includes((artist as string).toLowerCase())
            );
          }
    
          const startIndex = (pageNum - 1) * artworksPerPage;
          const pagedResults = combinedResults.slice(
            startIndex,
            startIndex + artworksPerPage
          );
          const totalPages = Math.ceil(combinedResults.length / artworksPerPage);
    
          res.status(200).send({
            artworks: pagedResults,
            meta: {
              totalArtworks: combinedResults.length,
              totalPages,
              currentPage: pageNum,
              artworksPerPage,
            },
          });
        })
        .catch(next);
    }
  }
  

export function getArtworkDetail(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { id } = req.params; // e.g., "artInstitute-123"
  const parts = id.split("-");
  if (parts.length !== 2) {
    res.status(400).send({ msg: "Invalid artwork ID format" });
    return;
  }
  const [api_source, externalIdStr] = parts;
  const externalId = parseInt(externalIdStr, 10);
  if (isNaN(externalId)) {
    res.status(400).send({ msg: "Invalid artwork external ID" });
    return;
  }

  if (api_source === "artInstitute") {
    fetchArtInstituteArtworkDetail(externalId)
      .then((apiData) => {
        const artwork = normaliseArtInstituteArtworkDetail(apiData);
        res.status(200).send({ artwork });
      })
      .catch(next);
  } else if (api_source === "clevelandMuseum") {
    fetchClevelandArtworkDetail(externalId)
      .then((apiData) => {
        const artwork = normaliseClevelandArtworkDetail(apiData);
        res.status(200).send({ artwork });
      })
      .catch(next);
  } else {
    res.status(400).send({ msg: "Unknown artwork source" });
  }
}
