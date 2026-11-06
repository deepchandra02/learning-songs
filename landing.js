async function loadList() {
  const slugs = await (await fetch("songs/index.json")).json();
  // Optional shared overrides: { "Artist Name": "ABC" }. Missing file or artist -> auto monogram.
  const artists = await fetch("songs/artists.json").then((r) => (r.ok ? r.json() : {})).catch(() => ({}));
  const songs = await Promise.all(slugs.map(async (slug) => {
    const song = await (await fetch(`songs/${slug}/song.json`)).json();
    return { slug, song };
  }));
  const box = $("song-list");
  for (const { slug, song } of songs) {
    const a = document.createElement("a");
    a.className = "card";
    a.href = `song.html?song=${encodeURIComponent(slug)}`;

    const t = document.createElement("h2");
    t.textContent = song.titleLatin || song.title;

    const o = document.createElement("p");
    o.className = "card-orig";
    o.textContent = song.title;
    if (song.lang) o.lang = song.lang;

    const meta = document.createElement("p");
    meta.className = "card-meta";
    meta.textContent = [song.language, song.artist, `${song.lines.length} lines`].filter(Boolean).join(" · ");

    const badge = document.createElement("span");
    badge.className = "card-icon";
    badge.textContent = (artists[song.artist] || monogram(song.artist || song.titleLatin || "?")).slice(0, 3).toUpperCase();
    badge.setAttribute("aria-hidden", "true");
    const body = document.createElement("div");
    body.className = "card-body";
    body.append(t, o, meta);
    const go = document.createElement("span");
    go.className = "card-go";
    go.innerHTML = icon("chevronRight");
    a.append(badge, body, go);
    a.dataset.key = norm(song.titleLatin || song.title);
    box.append(a);
  }
  filter();
}

// Three-letter monogram that covers the whole name:
//  3+ words -> first, middle, last initials   (Lata Mangeshkar Ji -> LMJ)
//  2 words  -> first initial + next consonant of the first word + last initial   (Rabindranath Tagore -> RBT)
//  1 word   -> first three consonants   (Kabir -> KBR)
function monogram(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const cons = (w) => Array.from(w).filter((ch, i) => i > 0 && /[^aeiou\W\d_]/i.test(ch));
  let out;
  if (words.length >= 3) out = [words[0][0], words[Math.floor(words.length / 2)][0], words[words.length - 1][0]];
  else if (words.length === 2) out = [words[0][0], cons(words[0])[0] || words[0][1] || "", words[1][0]];
  else out = [words[0][0], ...cons(words[0]).slice(0, 2)];
  let s = out.join("");
  if (Array.from(s).length < 3) s = Array.from(words.join("")).slice(0, 3).join(""); // short names
  return s.toUpperCase();
}

// Lowercase and strip diacritics so "Amár" matches "amar"
const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

function filter() {
  const q = norm($("search").value);
  let shown = 0;
  document.querySelectorAll(".card").forEach((c) => {
    const hit = c.dataset.key.includes(q);
    c.hidden = !hit;
    if (hit) shown++;
  });
  $("note").textContent = shown ? "" : "No songs match your search.";
}
$("search").addEventListener("input", filter);
loadList().catch((err) => { $("note").textContent = "Could not load songs: " + err.message; });
