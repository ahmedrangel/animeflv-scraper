# AnimeFLV-Scraper

Librería tipada para extraer información del sitio `https://www3.animeflv.net/`.

## Instalación
```sh
# npm
npm i animeflv-scraper

# yarn
yarn add animeflv-scraper

# pnpm
pnpm add animeflv-scraper
```

## Licencia
[MIT License](https://github.com/ahmedrangel/animeflv-scraper/blob/main/LICENSE)

# Funciones
### getAnimeInfo(params)
|Params|Type|Required|Description|
|-|-|:-:|-|
|`slug`|string|✅|El slug del anime|

```js
import { getAnimeInfo } from "animeflv-scraper";

const result = await getAnimeInfo("one-piece-tv");
```

### getEpisode(params)
|Params|Type|Required|Description|
|-|-|:-:|-|
|`slug`|string|✅|El slug del anime o del episodio|
|`episode`|number|❌|El número de episodio|
> Nota: Si se utiliza el slug de episodio, no se debe utilizar el parámetro de "episode".

```js
import { getEpisode } from "animeflv-scraper";

// Usando slug de anime y número de episodio
const result = await getEpisode("one-piece-tv", 1)
```
```js
// Usando slug del episodio
const result = await getEpisode("one-piece-tv-1")
```

### searchAnime(params)
|Params|Type|Required|Description|
|-|-|:-:|-|
|`query`|string|✅|La consulta de búsqueda|
|`page`|number|❌|El número de página para la búsqueda

```js
import { searchAnime } from "animeflv-scraper";

const result = await searchAnime("Naruto");
```
```js
// Consultando la página número 2
const result = await searchAnime("Naruto", 2);
```

### searchAnimesByFilter(params)
|Params|Type|Required|Description|
|-|-|:-:|-|
|`options`|FilterOptions|❌|Opciones de filtro para la búsqueda|
|`options.genres`|AnimeGenre[]|❌|Géneros de anime|
|`options.types`|AnimeType[]|❌|Tipos de anime|
|`options.statuses`|AnimeStatus[]|❌|Estados de anime|
|`options.order`|FilterOrderType|❌|El orden (por defecto "Por Defecto")|
|`options.page`|number|❌|El número de página (por defecto 1)|

```js
import { searchAnimesByFilter } from "animeflv-scraper";

const result = await searchAnimesByFilter({
  genres: ["Acción", "Artes Marciales", "Aventuras", "Carreras"],
  statuses: ["En emisión", "Finalizado", "Próximamente"],
  types: ["Anime", "OVA", "Especial", "Película"],
  order: "Recientemente Agregados",
  page: 1
});
```

### searchAnimesByURL(params)
|Params|Type|Required|Description|
|-|-|:-:|-|
|`url`|string|✅|La URL específica para buscar animes|

```js
import { searchAnimesByURL } from "animeflv-scraper";

const result = await searchAnimesByURL("https://www3.animeflv.net/browse?q=one+piece");
```

### getLatest()
```js
import { getLatest } from "animeflv-scraper";

const result = await getLatest();
```

### getOnAir()
```js
import { getOnAir } from "animeflv-scraper";

const result = await getOnAir();
```