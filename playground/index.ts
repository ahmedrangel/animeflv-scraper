import { searchAnimesByFilter } from "animeflv-scraper";

const result = await searchAnimesByFilter({
  genres: ["Romance"],
  statuses: ["En emisión"],
  types: ["Anime", "OVA"],
  page: 1,
  order: "Por Defecto"
});

console.info(result);
