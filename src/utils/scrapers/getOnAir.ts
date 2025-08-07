import { load } from "cheerio";
import { AnimeflvUrls, callAnimeFLV } from "../helpers";
import type { AnimeOnAirData, AnimeType } from "../../types";

/** Obtiene los animes que están en emisión actualmente.
 * @returns {Promise<AnimeOnAirData[]>}
 * @example await getOnAir()
 */
export const getOnAir = async (): Promise<AnimeOnAirData[]> => {
  try {
    const onAirData = await callAnimeFLV();
    if (!onAirData) return [];
    const $ = load(onAirData);

    const onAir: AnimeOnAirData[] = [];
    if ($(".ListSdbr > li").length > 0) {
      $(".ListSdbr > li").each((i, el) => {
        const temp: AnimeOnAirData = {
          title: $(el).find("a").remove("span").text(),
          type: $(el).find("a").children("span").text() as AnimeType,
          slug: $(el).find("a").attr("href")!.replace("/anime/", ""),
          url: AnimeflvUrls.host + $(el).find("a").attr("href") as string
        };

        onAir.push(temp);
      });
    }

    return onAir;
  }
  catch {
    return [];
  }
};
