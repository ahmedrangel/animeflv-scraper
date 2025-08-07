import { load } from "cheerio";
import type { EpisodeInfoData, EpisodeServersData } from "../../types";
import { callAnimeFLV } from "../helpers";

/** * Obtiene los enlaces de streaming y descarga de un episodio de anime
 * @param {string} slug - El slug del anime o del episodio
 * @param {number} [episode] - El número del episodio (opcional si se usa el slug del episodio)
 * @returns {Promise<EpisodeInfoData | null>}
 * @example await getEpisode("one-piece-tv", 1) // Usando slug de anime y número de episodio
 * @example await getEpisode("one-piece-tv-1") // Usando slug del episodio
 */
export const getEpisode = async (slug: string, episode?: number): Promise<EpisodeInfoData | null> => {
  if (!slug || (typeof slug) !== "string") throw new Error("Slug no válido o no proporcionado");
  try {
    const episodeData = async () => {
      if (slug && !episode)
        return await callAnimeFLV(`/ver/${slug}`);
      else if (slug && episode)
        return await callAnimeFLV(`/ver/${slug}-${episode}`);
      else return null;
    };

    const data = await episodeData();
    if (!data) return null;
    const $ = load(data);

    const episodeLinks: EpisodeInfoData = {
      title: $("body > div.Wrapper > div.Body > div > div > div > nav.Brdcrmb > a").next("i").next("a").text(),
      number: Number($("body > div.Wrapper > div.Body > div > div > div > div.CapiTop > h2.SubTitle").text().replace("Episodio ", "")),
      servers: [] as EpisodeServersData[]
    };

    const scripts = $("script");
    const serversFind = scripts.map((_, el) => $(el).html()).get().find(script => script?.includes("var videos ="));
    const serversObj = serversFind?.match(/var videos = (\{.*\})/)?.[1];
    if (serversObj) {
      const servers = JSON.parse(serversObj).SUB;
      for (const s of servers) {
        episodeLinks.servers.push({
          name: s?.title,
          download: s?.url?.replace("mega.nz/#!", "mega.nz/file/"),
          embed: s?.code?.replace("mega.nz/embed#!", "mega.nz/embed/")
        });
      }
    }

    const otherDownloads = $("body > div.Wrapper > div.Body > div > div > div > div > div > table > tbody > tr");

    for (const el of otherDownloads) {
      const name = $(el).find("td").eq(0).text();
      const lookFor = ["Zippyshare", "1Fichier"];
      if (lookFor.includes(name)) {
        episodeLinks.servers.push({
          name: $(el).find("td").eq(0).text(),
          download: $(el).find("td:last-child a").attr("href") as string
        });
      }
    }
    return episodeLinks;
  }
  catch {
    return null;
  }
};
