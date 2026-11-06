# Learn Songs Easily

A small personal site for learning non-English songs, line by line. Each song shows the
**transliteration** (main line), the **original script**, and an English **translation**.

Live site: https://deepchandra02.github.io/learning-songs/

Plain HTML, CSS and JavaScript. There is no build step and no dependencies.

## Features

- Landing page with a card per song, title search (transliterated title) and an artist badge
- Song page with **Stacked** or **Columns** layout, an A−/A+ font size control, and switches to
  hide the transliteration or translation (handy for self-testing)
- **Auto / Light / Dark** mode, plus pastel colour palettes (Blossom, Mint, Lavender, Peach, Sky)
- Your layout, font size, mode and palette are remembered in the browser

## Project layout

```
index.html        landing page (song list + search)
song.html         song page, opened as song.html?song=<slug>
app.js            song page logic
landing.js        landing page logic
theme.js          mode, palette and storage code shared by both pages
icons.js          inline icon set
style.css         all styles and colour palettes
songs/
  index.json      list of song folder names, in display order
  artists.json    optional artist name -> three-letter badge
  <slug>/song.json   one folder per song
```

## Adding a song

1. Create `songs/<slug>/song.json`:

   ```json
   {
     "title": "আমার সোনার বাংলা",
     "titleLatin": "Amar Shonar Bangla",
     "artist": "Rabindranath Tagore",
     "language": "Bengali",
     "lang": "bn",
     "note": "Optional text shown under the lyrics.",
     "lines": [
       {
         "section": "Verse",
         "original": "...",
         "transliteration": "...",
         "translation": "..."
       }
     ]
   }
   ```

   - `lang` is the language code (`bn`, `hi`, ...), used for fonts and accessibility.
   - `section` is optional. It starts a new labelled group (Verse, Chorus, ...).
   - Each line holds all three versions together, so they can't drift out of alignment.

2. Add the folder name to `songs/index.json`:

   ```json
   ["amar-shonar-bangla", "kabir-ke-dohe", "your-new-song"]
   ```

3. Optional: set the artist's badge in `songs/artists.json`. The key must match `artist`
   exactly. Without an entry, a three-letter badge is generated from the name.

   ```json
   { "Rabindranath Tagore": "RBT" }
   ```

## Run locally

The pages load JSON with `fetch`, so open them through a local server rather than from the file system:

```bash
python3 -m http.server 8123
```

Then visit http://localhost:8123.

## Deploying

The site is served by GitHub Pages from the root of the `main` branch. Every push to `main`
redeploys it.

## Notes on the sample songs

The two included songs are stand-ins: the Tagore lyrics and Kabir's dohas are in the public
domain. The transliterations and translations were written for this project, so please check
them. Replace them with your own songs. Mind copyright if you add lyrics to a public repository.
