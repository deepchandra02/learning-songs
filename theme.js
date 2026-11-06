const $ = (id) => document.getElementById(id);
const store = {
  get(k, d) { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

const PALETTES = [
  ["default", "Classic", "linear-gradient(90deg,#faf8f5 50%,#b4532a 50%)"],
  ["blossom", "Blossom", "linear-gradient(90deg,#fdf0f3 50%,#d86b8e 50%)"],
  ["mint", "Mint", "linear-gradient(90deg,#eef8f2 50%,#3fa07a 50%)"],
  ["lavender", "Lavender", "linear-gradient(90deg,#f3f0fc 50%,#8468d8 50%)"],
  ["peach", "Peach", "linear-gradient(90deg,#fff3ea 50%,#ee8b5b 50%)"],
  ["sky", "Sky", "linear-gradient(90deg,#eef6fc 50%,#4f9bd6 50%)"],
];
const root = document.documentElement;
const dark = matchMedia("(prefers-color-scheme: dark)");

function applyTheme() {
  const mode = store.get("mode", "auto");
  root.dataset.mode = mode === "auto" ? (dark.matches ? "dark" : "light") : mode;
  const pal = store.get("palette", "default");
  if (pal === "default") delete root.dataset.palette; else root.dataset.palette = pal;
  document.querySelectorAll("[data-mode]").forEach((b) => {
    if (b.tagName === "BUTTON") b.setAttribute("aria-pressed", String(b.dataset.mode === mode));
  });
  document.querySelectorAll("#palette-list button").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.palette === pal)));
}
dark.addEventListener("change", applyTheme);

document.querySelectorAll(".seg [data-mode]").forEach((b) =>
  b.addEventListener("click", () => { store.set("mode", b.dataset.mode); applyTheme(); }));

for (const [id, label, swatch] of PALETTES) {
  const b = document.createElement("button");
  b.type = "button";
  b.dataset.palette = id;
  b.innerHTML = '<span class="sw"></span>' + label;
  b.firstChild.style.setProperty("--sw", swatch);
  b.addEventListener("click", () => { store.set("palette", id); applyTheme(); });
  $("palette-list").append(b);
}

// Colors panel: one button opens it, × (or the button again) collapses it
function setPanel(open) {
  $("colors-panel").hidden = !open;
  $("colors-btn").setAttribute("aria-expanded", String(open));
}
$("colors-btn").addEventListener("click", () => setPanel($("colors-panel").hidden));
$("colors-close").addEventListener("click", () => { setPanel(false); $("colors-btn").focus(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setPanel(false); });
applyTheme();

