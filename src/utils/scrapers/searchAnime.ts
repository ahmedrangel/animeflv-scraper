import { $fetch } from "ofetch";
import { AnimeflvUrls } from "../helpers";
import type { SearchAnimeResults } from "../../types";
import { executeSearch } from "./executeSearch";

/** * Realiza una búsqueda
 * @param {string} query - La consulta de búsqueda
 * @param {number} [page] - El número de página para la búsqueda (opcional)
 */
export const searchAnime = async (query: string, page?: number): Promise<SearchAnimeResults | null> => {
  if (!query || (typeof query) !== "string") throw new Error("Consulta de búsqueda no válida o no proporcionada");
  const fixedQuery = query.toLowerCase().replace(/\s+/g, "+");
  try {
    const searchData = await $fetch(`${AnimeflvUrls.host}/browse`, {
      query: {
        q: fixedQuery,
        ...(page ? { page } : {})
      }
    }).catch(() => null);
    if (!searchData) return null;

    return executeSearch(searchData);
  }
  catch {
    return null;
  }
};
