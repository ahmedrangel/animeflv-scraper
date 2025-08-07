import { $fetch } from "ofetch";
import { AnimeGenreEnum, AnimeStatusEnum, AnimeTypeEnum, AnimeflvUrls, FilterOrderEnum } from "../helpers";
import type { FilterOptions, SearchAnimeResults } from "../../types";
import { executeSearch } from "./executeSearch";

/** * Realiza una búsqueda usando filtros específicos.
 * @param {FilterOptions} [options] - Opciones de filtro para la búsqueda
 * @param {AnimeGenre[]} [options.genres] - Géneros de anime
 * @param {AnimeType[]} [options.types] - Tipos de anime
 * @param {AnimeStatus[]} [options.statuses] - Estados de anime
 * @param {string} [options.order] - El orden (por defecto "Por Defecto")
 * @param {number} [options.page] - El número de página (por defecto 1)
 * @returns {Promise<SearchAnimeResults | null>}
 * @example await searchAnimesByFilter({ genres: ["Acción"], statuses: ["En emisión"], types: ["Anime", "OVA"], order: "Por Defecto", page: 1 })
 */
export const searchAnimesByFilter = async (options?: FilterOptions): Promise<SearchAnimeResults | null> => {
  try {
    const genres = options?.genres?.map((genre) => {
      return AnimeGenreEnum[genre as keyof typeof AnimeGenreEnum] || genre;
    }) || [];

    const statuses = options?.statuses?.map((status) => {
      return AnimeStatusEnum[status as keyof typeof AnimeStatusEnum] || status;
    }) || [];

    const types = options?.types?.map((type) => {
      return AnimeTypeEnum[type as keyof typeof AnimeTypeEnum] || type;
    }) || [];

    const order = options?.order ? FilterOrderEnum[options.order as unknown as keyof typeof FilterOrderEnum] : "default";

    const filterData = await $fetch(`${AnimeflvUrls.host}/browse`, {
      query: {
        ...genres && Array.isArray(genres) ? { "genre[]": genres } : {},
        ...statuses && Array.isArray(statuses) ? { "status[]": statuses } : {},
        ...types && Array.isArray(types) ? { "type[]": types } : {},
        order: order,
        ...options?.page ? { page: options.page } : {}
      }
    }).catch(() => null);

    return executeSearch(filterData);
  }
  catch {
    return null;
  }
};
