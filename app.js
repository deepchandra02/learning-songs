async function load() {
  const slugs = await (await fetch("songs/index.json")).json();
  const slug = new URLSearchParams(location.search).get("song") || slugs[0];
  const song = await (await fetch(`songs/${slug}/song.json`)).json();
  render(song);
}

function render(song) {
  document.title = `${song.titleLatin || song.title} – Learn Songs Easily`;
  $("title").textContent = song.titleLatin || song.title;
  $("title").lang = song.titleLatin ? "en" : (song.lang || "");
  $("subtitle").textContent = [song.titleLatin && song.title, song.artist, song.language].filter(Boolean).join(" · ");
  $("note").textContent = song.note || "";

  const box = $("lines");
  box.innerHTML = "";
  for (const l of song.lines) {
    if (l.section) {
      const h = document.createElement("div");
      h.className = "section";
      h.textContent = l.section;
      box.append(h);
    }
    const row = document.createElement("div");
    row.className = "row";
    row.append(
      p("o", l.original, song.lang),
      p("t", l.transliteration),
      p("e", l.translation)
    );
    box.append(row);
  }
  applyPrefs();
}

function p(cls, text, lang) {
  const el = document.createElement("p");
  el.className = cls;
  el.textContent = text || "";
  if (lang) el.lang = lang;
  return el;
}

// Font size
const FS_STEPS = [0.8, 0.9, 1, 1.15, 1.3, 1.5, 1.75];
function applyFont() {
  let i = Number(store.get("fsIndex", "2"));
  if (!(i >= 0 && i < FS_STEPS.length)) i = 2;
  $("lines").style.setProperty("--fs", FS_STEPS[i]);
  $("fs-label").textContent = Math.round(FS_STEPS[i] * 100) + "%";
  $("fs-down").disabled = i === 0;
  $("fs-up").disabled = i === FS_STEPS.length - 1;
  return i;
}
$("fs-down").addEventListener("click", () => { store.set("fsIndex", applyFont() - 1); applyFont(); });
$("fs-up").addEventListener("click", () => { store.set("fsIndex", applyFont() + 1); applyFont(); });
applyFont();

function applyPrefs() {
  const view = store.get("view", "stacked");
  const showT = store.get("showT", "1") === "1";
  const showE = store.get("showE", "1") === "1";
  const box = $("lines");
  box.dataset.view = view;
  box.classList.toggle("hide-t", !showT);
  box.classList.toggle("hide-e", !showE);
  box.style.setProperty("--cols", 1 + (showT ? 1 : 0) + (showE ? 1 : 0));
  document.querySelectorAll("[data-view]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.view === view)));
  $("t-translit").checked = showT;
  $("t-trans").checked = showE;
}

document.querySelectorAll(".seg [data-view]").forEach((b) =>
  b.addEventListener("click", () => { store.set("view", b.dataset.view); applyPrefs(); }));
$("t-translit").addEventListener("change", (e) => { store.set("showT", e.target.checked ? "1" : "0"); applyPrefs(); });
$("t-trans").addEventListener("change", (e) => { store.set("showE", e.target.checked ? "1" : "0"); applyPrefs(); });

load().catch((err) => { $("note").textContent = "Could not load song: " + err.message; });
