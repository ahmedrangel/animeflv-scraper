import {
  getAnimeInfo,
  getEpisode,
  getLatest,
  getOnAir,
  searchAnime,
  searchAnimesByFilter,
  searchAnimesByURL
} from "animeflv-scraper";

const working = {
  getAnimeInfo: (await getAnimeInfo("one-piece-tv"))?.title !== undefined,
  getEpisode: (await getEpisode("one-piece-tv", 1))?.title !== undefined,
  searchAnime: Boolean((await searchAnime("isekai", 2))?.media?.length || 0 > 0),
  searchAnimesByFilter: Boolean((await searchAnimesByFilter({
    genres: ["Romance"],
    statuses: ["En emisión"],
    types: ["Anime", "OVA"],
    order: "Por Defecto",
    page: 1
  }))?.media?.length || 0 > 0),
  searchAnimesByURL: Boolean((await searchAnimesByURL("https://animeflv.net/browse?q=isekai&page=2"))?.media?.length || 0 > 0),
  getLatest: Boolean((await getLatest())?.length || 0 > 0),
  getOnAir: Boolean((await getOnAir())?.length || 0 > 0)
};

console.info(working);