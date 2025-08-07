import { load } from "cheerio";
import { $fetch } from "ofetch";
import { AnimeflvUrls } from "../helpers";
import type { AnimeGenre, AnimeInfoData, AnimeRelated, AnimeStatus, AnimeType } from "../../types";

/** * Obtiene la información de un anime por su slug
 * @param {string} slug - El slug del anime
 * @returns {Promise<AnimeInfoData | null>}
 * @example await getAnimeInfo("one-piece-tv") // Usando slug del anime
 */
export const getAnimeInfo = async (
  slug: string
): Promise<AnimeInfoData | null> => {
  if (!slug || (typeof slug) !== "string") throw new Error("Slug no válido o no proporcionado");
  try {
    const url = `${AnimeflvUrls.host}/anime/${slug}`;
    const html = await $fetch<string>(url).catch(() => null);
    if (!html) return null;

    const $ = load(html);

    const scripts = $("script");
    const nextAiringFind = scripts.map((_, el) => $(el).html()).get().find(script => script?.includes("var anime_info ="));
    const nextAiringInfo = nextAiringFind?.match(/anime_info = (\[.*\])/)?.[1];

    const animeInfo: AnimeInfoData = {
      title: $("body > div.Wrapper > div > div > div.Ficha.fchlt > div.Container > h1").text(),
      alternative_titles: [],
      status: $("body > div.Wrapper > div > div > div.Container > div > aside > p > span").text() as AnimeStatus,
      rating: $("#votes_prmd").text(),
      type: $("body > div.Wrapper > div > div > div.Ficha.fchlt > div.Container > span").text() as AnimeType,
      cover: AnimeflvUrls.images + ($("body > div.Wrapper > div > div > div.Container > div > aside > div.AnimeCover > div > figure > img").attr("src") as string),
      synopsis: $("body > div.Wrapper > div > div > div.Container > div > main > section:nth-child(1) > div.Description > p").text(),
      genres: $("body > div.Wrapper > div > div > div.Container > div > main > section:nth-child(1) > nav > a")
        .map((_, el) => $(el).text().trim())
        .get() as AnimeGenre[],
      next_airing_episode: nextAiringInfo ? JSON.parse(nextAiringInfo)?.[3] : undefined,
      episodes: [],
      url
    };

    const episodesFind = scripts.map((_, el) => $(el).html()).get().find(script => script?.includes("var episodes ="));
    const episodesArray = episodesFind?.match(/episodes = (\[\[.*\].*])/)?.[1];

    if (episodesArray) {
      for (let i = 1; i <= JSON.parse(episodesArray as string)?.length; i++) {
        if (animeInfo.episodes instanceof Array) {
          animeInfo.episodes.push({
            number: i,
            slug: slug + "-" + i,
            url: AnimeflvUrls.host + "/ver/" + slug + "-" + i
          });
        }
      }
    }

    $("body > div.Wrapper > div > div > div.Ficha.fchlt > div.Container > div:nth-child(3) > span").each((i, el) => {
      animeInfo.alternative_titles.push($(el).text());
    });

    // Relacionados
    const relatedEls = $("ul.ListAnmRel > li");
    const relatedAnimes: AnimeRelated[] = [];
    relatedEls.each((_, el) => {
      const link = $(el).find("a");
      const href = link.attr("href");
      const title = link.text().trim();
      const relation = $(el).text().match(/\(([^)]+)\)$/)?.[1];
      if (href && title) {
        const slug = href.match(/\/anime\/([^/]+)/)?.[1] || href;
        relatedAnimes.push({
          title,
          relation,
          slug,
          url: `${AnimeflvUrls.host}${href}`
        });
      }
    });

    // Asigna la propiedad si hay elementos
    if (relatedAnimes.length > 0) {
      animeInfo.related = relatedAnimes;
    }

    return animeInfo;
  }
  catch {
    return null;
  }
};
