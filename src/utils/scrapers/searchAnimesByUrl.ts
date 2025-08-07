import { $fetch } from "ofetch";
import type { SearchAnimeResults } from "../../types";
import { executeSearch } from "./executeSearch";

/** * Realiza una búsqueda de animes por una URL específica
 * @param {string} url - La URL específica para buscar animes
 * @returns {Promise<SearchAnimeResults | null>}
 * @example await searchAnimesByURL("https://www3.animeflv.net/browse?q=one+piece")
 */
export const searchAnimesByURL = async (url: string): Promise<SearchAnimeResults | null> => {
  if (!url || (typeof url) !== "string") throw new Error("URL no válido o no proporcionado");
  try {
    const specificData = await $fetch<string>(url).catch(() => null);
    if (!specificData) return null;
    return executeSearch(specificData);
  }
  catch {
    return null;
  }
};
