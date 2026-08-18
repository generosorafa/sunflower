const DATA = window.SFL_DATA;
const STORAGE_KEY = "sfl-companion-v2";
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const defaultState = {
  theme: "dark",
  season: "spring",
  level: 25,
  flowers: {},
  fish: {},
  craft: {},
  prices: {},
  modifiers: { xpBonus: 0, timeBonus: 0, outputMultiplier: 1, ingredientMultiplier: 1 },
  filters: { flower: "all", fish: "focus", craft: "Todos", recipeBuilding: "Todos" },
  delivery: {
    npc: "gambit",
    rewardType: "sfl",
    reward: 0,
    bonus: 0,
    lines: [{ item: "", amount: 1 }, { item: "", amount: 1 }]
  }
};

function loadState() {
  try {
    const v2 = localStorage.getItem(STORAGE_KEY);
    const legacy = localStorage.getItem("sfl-companion-v1");
    const saved = JSON.parse(v2 || legacy || "{}");
    return {
      ...structuredClone(defaultState),
      ...saved,
      modifiers: { ...defaultState.modifiers, ...(saved.modifiers || {}) },
      filters: { ...defaultState.filters, ...(saved.filters || {}) },
      delivery: { ...defaultState.delivery, ...(saved.delivery || {}) },
      flowers: saved.flowers || {},
      fish: saved.fish || {},
      craft: saved.craft || {},
      prices: saved.prices || {}
    };
  } catch {
    return structuredClone(defaultState);
  }
}

let state = loadState();
let motionAnimate = null;

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateDashboardHeader();
}

function esc(value = "") {
  return String(value).replace(/[&<>'"]/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[c]));
}

function fmt(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(value) || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: digits }).format(value);
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${fmt(seconds / 60, 1)} min`;
  if (seconds < 86400) return `${fmt(seconds / 3600, 1)}h`;
  return `${fmt(seconds / 86400, 1)}d`;
}

function seasonInfo(id = state.season) {
  return DATA.seasons.find(s => s.id === id) || DATA.seasons[0];
}

function slugify(name) {
  return String(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

const FALLBACK_EMOJI = {
  flower: "🌺",
  fish: "🐟",
  recipe: "🍲",
  craft: "🛠️",
  seed: "🌱",
  ingredient: "📦",
  npc: "👤"
};

function assetCandidates(name, kind = "ingredient") {
  const base = DATA.assetBase;
  const slug = slugify(name);
  const candidates = [];
  const add = path => {
    const url = /^https?:\/\//.test(path) ? path : `${base}/${path}`;
    if (!candidates.includes(url)) candidates.push(url);
  };

  (DATA.assetAliases?.[name] || []).forEach(add);

  if (kind === "flower" || kind === "seed") {
    add(`flowers/${slug}.webp`);
    add(`flowers/${slug}.png`);
    add(`flowers/${slug}.gif`);
  }

  if (kind === "fish" || DATA.fish.some(f => f.name === name)) {
    add(`fish/${slug}.png`);
    add(`fish/${slug}.webp`);
  }

  if (kind === "recipe" || DATA.recipes.some(r => r.name === name)) {
    add(`food/${slug}.png`);
    add(`food/${slug}.webp`);
    add(`processedFoods/${slug}.webp`);
    add(`processedFoods/${slug}.png`);
  }

  if (kind === "craft") {
    add(`sfts/${slug}.webp`);
    add(`sfts/${slug}.png`);
    add(`sfts/${slug}.gif`);
    add(`sfts/aoe/${slug}.png`);
    add(`sfts/aoe/${slug}.webp`);
    add(`icons/${slug}.webp`);
    add(`icons/${slug}.png`);
  }

  // Ingredientes: tenta os diretórios públicos mais comuns do projeto oficial.
  add(`resources/${slug}.webp`);
  add(`resources/${slug}.png`);
  add(`icons/${slug}.webp`);
  add(`icons/${slug}.png`);
  add(`fruit/${slug}/${slug}.webp`);
  add(`fruit/${slug}/${slug}.png`);
  add(`fruit/${slug}/${slug}_fruit.webp`);
  add(`fruit/${slug}/${slug}_fruit.png`);
  add(`crops/${slug}/proc_sprite.png`);
  add(`animals/${slug}.webp`);
  add(`animals/${slug}.png`);
  add(`food/${slug}.png`);
  add(`food/${slug}.webp`);

  return candidates;
}

function mediaHTML(name, kind = "ingredient", size = "md", extraClass = "") {
  const candidates = assetCandidates(name, kind);
  const payload = encodeURIComponent(JSON.stringify(candidates));
  const fallback = FALLBACK_EMOJI[kind] || FALLBACK_EMOJI.ingredient;
  return `<span class="asset-media asset-${size} ${extraClass}" title="${esc(name)}">
    <span class="asset-fallback" aria-hidden="true">${fallback}</span>
    <img data-asset-name="${esc(name)}" data-candidates="${payload}" alt="${esc(name)}" loading="lazy" decoding="async" />
  </span>`;
}

function bindAssetImages(root = document) {
  $$('img[data-candidates]', root).forEach(img => {
    if (img.dataset.bound === "1") return;
    img.dataset.bound = "1";
    let candidates = [];
    try { candidates = JSON.parse(decodeURIComponent(img.dataset.candidates || "%5B%5D")); } catch { candidates = []; }
    let index = 0;
    const loadNext = () => {
      if (index >= candidates.length) {
        img.hidden = true;
        img.parentElement?.classList.add("asset-missing");
        return;
      }
      img.hidden = false;
      img.src = candidates[index++];
    };
    img.addEventListener("load", () => img.parentElement?.classList.add("asset-loaded"));
    img.addEventListener("error", loadNext);
    loadNext();
  });
}

function ingredientChips(ingredients, compact = false) {
  const entries = Object.entries(ingredients || {});
  if (!entries.length) return '<span class="muted-text">Sem materiais adicionais</span>';
  return `<div class="ingredient-list ${compact ? "compact" : ""}">${entries.map(([name, amount]) => `
    <span class="ingredient-chip">${mediaHTML(name, "ingredient", compact ? "xs" : "sm")}<span><b>${fmt(amount, 2)}</b> ${esc(name)}</span></span>`).join("")}</div>`;
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  $("#themeBtn").textContent = theme === "dark" ? "☀" : "☾";
  document.querySelector('meta[name="theme-color"]').setAttribute("content", theme === "dark" ? "#07100c" : "#f3f8f3");
  saveState();
}

function navigate(view, updateHash = true) {
  $$(".view").forEach(section => section.classList.toggle("active", section.id === view));
  $$('[data-view]').forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
  if (updateHash) history.replaceState(null, "", `#${view}`);
  window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  animateView(view);
}

function animateView(view) {
  if (!window.gsap || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const root = document.getElementById(view);
  if (!root) return;
  const targets = root.querySelectorAll(".section-head, .progress-card, .toolbar, .panel, .collection-grid, .grid, .table-wrap, .hero");
  window.gsap.fromTo(targets, { opacity: 0, y: 9 }, { opacity: 1, y: 0, duration: .38, stagger: .035, ease: "power2.out", clearProps: "opacity,transform" });
}

function toggleOwned(bucket, name, el) {
  state[bucket][name] = !state[bucket][name];
  saveState();
  if (motionAnimate && el) motionAnimate(el, { scale: [1, .88, 1] }, { duration: .23 });
  if (bucket === "flowers") renderFlowers();
  if (bucket === "fish") renderFish();
  if (bucket === "craft") renderCrafting();
  renderDashboardStats();
}

function progress(bucket, total) {
  const count = Object.values(state[bucket]).filter(Boolean).length;
  return { count, total, pct: total ? Math.round(count / total * 100) : 0 };
}

function updateDashboardHeader() {
  const season = seasonInfo();
  const fp = progress("flowers", DATA.flowers.length);
  const fishp = progress("fish", DATA.fish.length);
  const overall = Math.round((fp.count + fishp.count) / Math.max(1, fp.total + fishp.total) * 100);
  if ($("#heroSeason")) $("#heroSeason").textContent = `${season.icon} ${season.label}`;
  if ($("#heroLevel")) $("#heroLevel").textContent = state.level;
  if ($("#heroProgress")) $("#heroProgress").textContent = `${overall}%`;
}

function renderDashboardStats() {
  const flower = progress("flowers", DATA.flowers.length);
  const fish = progress("fish", DATA.fish.length);
  const craft = progress("craft", DATA.crafting.length);
  const currentFish = DATA.fish.filter(f => f.seasons.includes(state.season));
  const missingNow = currentFish.filter(f => !state.fish[f.name]).length;
  const cards = [
    ["🌺", "Flores", `${flower.count} / ${flower.total}`, `${flower.pct}% da coleção marcada`],
    ["🎣", "Peixes", `${fish.count} / ${fish.total}`, `${missingNow} faltando nesta estação`],
    ["🛠️", "Crafting", `${craft.count} / ${craft.total}`, "itens marcados como feitos"],
    ["🍳", "Receitas", `${DATA.recipes.length}`, "receitas comparáveis no calculador"]
  ];
  $("#dashboardStats").innerHTML = cards.map(([icon, label, value, hint]) => `
    <div class="metric"><div class="label">${icon} ${label}</div><div class="value">${value}</div><div class="hint">${hint}</div></div>`).join("");
  updateDashboardHeader();
}

function renderLinks() {
  $("#linkGrid").innerHTML = DATA.links.map(link => `
    <a class="card quick-card" href="${link.url}" target="_blank" rel="noopener">
      <span class="arrow">↗</span><span class="emoji">${link.kind === "game" ? "🎮" : "🔗"}</span>
      <strong>${esc(link.label)}</strong><span>${link.kind === "game" ? "Abrir o jogo em nova aba" : "Abrir referência em nova aba"}</span>
    </a>`).join("");
}

function renderSeasonSelect() {
  const select = $("#seasonSelect");
  select.innerHTML = DATA.seasons.map(s => `<option value="${s.id}">${s.icon} ${s.label}</option>`).join("");
  select.value = state.season;
}

// ---------- Flowers ----------
function flowerSeedFor(name) {
  return DATA.flowerSeeds.find(s => s.name === name);
}

function renderFlowerSeedGuide() {
  const current = state.season;
  $("#flowerSeedGuide").innerHTML = DATA.flowerSeeds.map(seed => {
    const locked = state.level < seed.level;
    const isSeason = seed.season === current;
    const familyFlowers = DATA.flowers.filter(f => f.seed === seed.name);
    const owned = familyFlowers.filter(f => state.flowers[f.name]).length;
    const set = ["Sunpetal Seed", "Bloom Seed", "Lily Seed"].includes(seed.name)
      ? DATA.flowerCrossbreedInputs.set1
      : DATA.flowerCrossbreedInputs.set2;
    return `<div class="card seed-card ${isSeason ? "current-season" : ""}">
      <div class="card-media-row">${mediaHTML(seed.name, "seed", "lg")}
        <div><div class="item-title"><h3>${esc(seed.name)}</h3>${isSeason ? '<span class="badge accent">ESTAÇÃO</span>' : ''}</div>
        <div class="item-meta"><span class="badge ${locked ? "danger" : "accent"}">Lv ${seed.level}</span><span class="badge">${seed.coins} Coins</span><span class="badge">${seed.days}d</span></div></div>
      </div>
      <p><b>${owned}/${familyFlowers.length}</b> descobertas neste grupo. Crossbreed: ${set.slice(0, 4).map(([n, a]) => `${a} ${n}`).join(", ")}.</p>
    </div>`;
  }).join("");
  bindAssetImages($("#flowerSeedGuide"));
}

function renderFlowers() {
  const filter = state.filters.flower;
  const q = ($("#flowerSearch")?.value || "").toLowerCase().trim();
  const filtered = DATA.flowers.filter(f => {
    const seed = flowerSeedFor(f.seed);
    const owned = !!state.flowers[f.name];
    const hay = `${f.name} ${f.family} ${f.seed}`.toLowerCase();
    if (q && !hay.includes(q)) return false;
    if (filter === "missing" && owned) return false;
    if (filter === "owned" && !owned) return false;
    if (filter === "season" && f.season !== "all" && f.season !== state.season) return false;
    if (filter === "available" && seed && state.level < seed.level) return false;
    return true;
  });

  const order = { epic: 0, seasonal: 1, normal: 2 };
  filtered.sort((a, b) => (order[a.rarity] ?? 9) - (order[b.rarity] ?? 9) || a.seed.localeCompare(b.seed) || a.name.localeCompare(b.name));

  $("#flowerGrid").innerHTML = filtered.length ? filtered.map(f => {
    const seed = flowerSeedFor(f.seed);
    const owned = !!state.flowers[f.name];
    const locked = seed && state.level < seed.level;
    const seasonal = f.season !== "all";
    return `<article class="item-card visual-card ${owned ? "done" : ""} ${locked ? "locked" : ""}">
      <div class="visual-hero">${mediaHTML(f.name, "flower", "xl")}${owned ? '<span class="owned-ribbon">JÁ TENHO</span>' : ''}</div>
      <div class="visual-body">
        <div class="item-title"><strong>${esc(f.name)}</strong><button class="check" data-flower="${esc(f.name)}" aria-label="${owned ? "Desmarcar" : "Marcar"} ${esc(f.name)}">${owned ? "✓" : ""}</button></div>
        <div class="item-meta">
          <span class="badge">${esc(f.family)}</span>
          ${f.rarity === "epic" ? '<span class="badge purple">EPIC</span>' : ''}
          ${seasonal ? `<span class="badge ${f.season === state.season ? "accent" : ""}">${seasonInfo(f.season).icon} ${seasonInfo(f.season).label}</span>` : '<span class="badge">Todas estações</span>'}
          ${locked ? `<span class="badge danger">Lv ${seed.level}</span>` : `<span class="badge accent">Lv ${seed.level}</span>`}
        </div>
        <div class="item-details">Semente: <strong>${esc(f.seed)}</strong>${seasonal && f.season !== state.season ? " · fora da estação selecionada" : ""}</div>
      </div>
    </article>`;
  }).join("") : '<div class="empty">Nenhuma flor encontrada com esses filtros.</div>';

  $$('[data-flower]').forEach(btn => btn.onclick = () => toggleOwned("flowers", btn.dataset.flower, btn));
  const p = progress("flowers", DATA.flowers.length);
  $("#flowerProgressText").textContent = `${p.count} / ${p.total} · ${p.pct}%`;
  $("#flowerProgress").style.width = `${p.pct}%`;
  renderFlowerSeedGuide();
  bindAssetImages($("#flowerGrid"));
}

// ---------- Fishing ----------
function fishPriority(f) {
  let score = 0;
  if (!state.fish[f.name]) score += 10;
  if (f.seasons.includes(state.season)) score += 8;
  score += ({ "marine marvel": 5, expert: 4, advanced: 2, basic: 1 }[f.type] || 0);
  return score;
}

function renderFish() {
  const filter = state.filters.fish;
  const q = ($("#fishSearch")?.value || "").toLowerCase().trim();
  const filtered = DATA.fish.filter(f => {
    const owned = !!state.fish[f.name];
    const hay = `${f.name} ${f.type} ${f.baits.join(" ")} ${f.likes.join(" ")}`.toLowerCase();
    if (q && !hay.includes(q)) return false;
    if (filter === "focus" && (!f.seasons.includes(state.season) || owned)) return false;
    if (filter === "missing" && owned) return false;
    if (["basic", "advanced", "expert", "marine marvel"].includes(filter) && f.type !== filter) return false;
    return true;
  }).sort((a, b) => fishPriority(b) - fishPriority(a) || a.name.localeCompare(b.name));

  $("#fishGrid").innerHTML = filtered.length ? filtered.map(f => {
    const caught = !!state.fish[f.name];
    const now = f.seasons.includes(state.season);
    return `<article class="item-card visual-card ${caught ? "done" : ""} ${!now ? "locked" : ""}">
      <div class="visual-hero fish-hero">${mediaHTML(f.name, "fish", "xl")}${caught ? '<span class="owned-ribbon">PESCADO</span>' : ''}</div>
      <div class="visual-body">
        <div class="item-title"><strong>${esc(f.name)}</strong><button class="check" data-fish="${esc(f.name)}" aria-label="${caught ? "Desmarcar" : "Marcar"} ${esc(f.name)}">${caught ? "✓" : ""}</button></div>
        <div class="item-meta">
          <span class="badge ${f.type === "marine marvel" ? "purple" : f.type === "expert" ? "gold" : f.type === "advanced" ? "blue" : ""}">${esc(f.type.toUpperCase())}</span>
          <span class="badge ${now ? "accent" : ""}">${now ? "PESCÁVEL AGORA" : "FORA DA ESTAÇÃO"}</span>
          ${f.difficulty ? `<span class="badge">Dif. ${f.difficulty}/5</span>` : ""}
        </div>
        <div class="item-details"><b>Isca:</b> ${esc(f.baits.join(", "))}<br><b>Chum:</b> ${esc(f.likes.join(", ") || "—")}<br><b>Estações:</b> ${f.seasons.map(s => seasonInfo(s).icon).join(" ")}</div>
      </div>
    </article>`;
  }).join("") : '<div class="empty">Nenhum peixe encontrado. Se o filtro for “Foco agora”, você pode já ter marcado todos os pescáveis desta estação.</div>';

  $$('[data-fish]').forEach(btn => btn.onclick = () => toggleOwned("fish", btn.dataset.fish, btn));
  const p = progress("fish", DATA.fish.length);
  $("#fishProgressText").textContent = `${p.count} / ${p.total} · ${p.pct}%`;
  $("#fishProgress").style.width = `${p.pct}%`;
  bindAssetImages($("#fishGrid"));
}

// ---------- Crafting ----------
function ingredientsText(obj) {
  const entries = Object.entries(obj || {});
  return entries.length ? entries.map(([k, v]) => `${fmt(v, 2)} ${k}`).join(" · ") : "Sem materiais adicionais";
}

function renderCraftFilters() {
  const cats = ["Todos", ...new Set(DATA.crafting.map(x => x.category))];
  $("#craftFilters").innerHTML = cats.map(c => `<button class="chip-btn ${state.filters.craft === c ? "active" : ""}" data-craft-filter="${esc(c)}">${esc(c)}</button>`).join("");
  $$('[data-craft-filter]').forEach(btn => btn.onclick = () => {
    state.filters.craft = btn.dataset.craftFilter;
    saveState();
    renderCrafting();
  });
}

function renderCrafting() {
  renderCraftFilters();
  const q = ($("#craftSearch")?.value || "").toLowerCase().trim();
  const filtered = DATA.crafting.filter(item => {
    if (state.filters.craft !== "Todos" && item.category !== state.filters.craft) return false;
    return !q || `${item.name} ${item.category} ${ingredientsText(item.ingredients)} ${item.note}`.toLowerCase().includes(q);
  });

  $("#craftGrid").innerHTML = filtered.length ? filtered.map(item => {
    const done = !!state.craft[item.name];
    return `<article class="item-card visual-card ${done ? "done" : ""}">
      <div class="visual-hero craft-hero">${mediaHTML(item.name, "craft", "xl")}${done ? '<span class="owned-ribbon">FEITO</span>' : ''}</div>
      <div class="visual-body">
        <div class="item-title"><strong>${esc(item.name)}</strong><button class="check" data-craft="${esc(item.name)}">${done ? "✓" : ""}</button></div>
        <div class="item-meta"><span class="badge">${esc(item.category)}</span>${item.coins ? `<span class="badge gold">${fmt(item.coins, 0)} Coins</span>` : ""}${item.stock ? `<span class="badge">Estoque ${item.stock}</span>` : ""}${item.island === "desert" ? '<span class="badge danger">Desert</span>' : ""}</div>
        <div class="craft-materials"><b>Materiais</b>${ingredientChips(item.ingredients, true)}</div>
        <div class="item-details"><b>Uso:</b> ${esc(item.note || "—")}</div>
      </div>
    </article>`;
  }).join("") : '<div class="empty">Nada encontrado.</div>';

  $$('[data-craft]').forEach(btn => btn.onclick = () => toggleOwned("craft", btn.dataset.craft, btn));
  const p = progress("craft", DATA.crafting.length);
  $("#craftProgressText").textContent = `${p.count} / ${p.total} · ${p.pct}%`;
  $("#craftProgress").style.width = `${p.pct}%`;
  bindAssetImages($("#craftGrid"));
}

// ---------- Prices + Cooking ----------
function allPriceItems() {
  return [...new Set([...DATA.priceItems, ...DATA.recipes.flatMap(r => Object.keys(r.ingredients))])].sort((a, b) => a.localeCompare(b));
}

function priceOf(name) {
  const v = Number(state.prices[name]);
  return Number.isFinite(v) && v > 0 ? v : null;
}

function renderPriceGrid() {
  $("#priceGrid").innerHTML = allPriceItems().map(name => `
    <div class="field price-field">
      ${mediaHTML(name, "ingredient", "sm")}
      <label>${esc(name)}</label>
      <div class="price-input-wrap"><input class="price-input" data-price="${esc(name)}" type="number" min="0" step="0.0001" value="${state.prices[name] ?? ""}" placeholder="0.0000"><span>SFL</span></div>
    </div>`).join("");

  $$('[data-price]').forEach(input => input.addEventListener("input", () => {
    state.prices[input.dataset.price] = input.value;
    saveState();
    renderRecipes();
    renderDeliveryResults();
  }));
  bindAssetImages($("#priceGrid"));
}

function recipeMetrics(recipe) {
  const m = state.modifiers;
  const xp = recipe.xp * (1 + Number(m.xpBonus || 0) / 100) * Math.max(1, Number(m.outputMultiplier || 1));
  const seconds = recipe.seconds * Math.max(.05, 1 - Number(m.timeBonus || 0) / 100);
  let cost = 0;
  let complete = true;
  for (const [name, amount] of Object.entries(recipe.ingredients)) {
    const p = priceOf(name);
    if (p === null) { complete = false; break; }
    cost += p * amount;
  }
  cost *= Math.max(1, Number(m.ingredientMultiplier || 1));
  return {
    xp,
    seconds,
    cost: complete ? cost : null,
    xpSfl: complete && cost > 0 ? xp / cost : null,
    xpDay: seconds > 0 ? xp * 86400 / seconds : null
  };
}

function renderRecipeFilters() {
  const buildings = ["Todos", ...new Set(DATA.recipes.map(r => r.building))];
  $("#recipeBuildingFilters").innerHTML = buildings.map(b => `<button class="chip-btn ${state.filters.recipeBuilding === b ? "active" : ""}" data-recipe-building="${esc(b)}">${esc(b)}</button>`).join("");
  $$('[data-recipe-building]').forEach(btn => btn.onclick = () => {
    state.filters.recipeBuilding = btn.dataset.recipeBuilding;
    saveState();
    renderRecipes();
  });
}

function renderRecipes() {
  renderRecipeFilters();
  const q = ($("#recipeSearch")?.value || "").toLowerCase().trim();
  const sort = $("#recipeSort")?.value || "xpDay";
  const rows = DATA.recipes.filter(r => {
    if (state.filters.recipeBuilding !== "Todos" && r.building !== state.filters.recipeBuilding) return false;
    return !q || `${r.name} ${r.building} ${Object.keys(r.ingredients).join(" ")}`.toLowerCase().includes(q);
  }).map(r => ({ ...r, metrics: recipeMetrics(r) }));

  const sorters = {
    xpDay: (a, b) => (b.metrics.xpDay ?? -1) - (a.metrics.xpDay ?? -1),
    xpSfl: (a, b) => (b.metrics.xpSfl ?? -1) - (a.metrics.xpSfl ?? -1),
    xp: (a, b) => b.metrics.xp - a.metrics.xp,
    cost: (a, b) => (a.metrics.cost ?? Infinity) - (b.metrics.cost ?? Infinity),
    time: (a, b) => a.metrics.seconds - b.metrics.seconds
  };
  rows.sort(sorters[sort] || sorters.xpDay);
  const best = rows[0]?.name;

  $("#recipeBody").innerHTML = rows.map(r => `<tr class="${r.name === best ? "best-row" : ""}">
    <td><div class="table-item">${mediaHTML(r.name, "recipe", "md")}<div><strong>${esc(r.name)}</strong>${r.featured ? '<br><span class="badge accent">POWER XP</span>' : ""}</div></div></td>
    <td>${esc(r.building)}</td>
    <td>${ingredientChips(r.ingredients, true)}</td>
    <td class="metric-cell">${fmt(r.metrics.xp, 0)}</td>
    <td>${formatTime(r.metrics.seconds)}</td>
    <td class="metric-cell">${r.metrics.cost === null ? "—" : fmt(r.metrics.cost, 4)}</td>
    <td class="metric-cell">${r.metrics.xpSfl === null ? "—" : fmt(r.metrics.xpSfl, 0)}</td>
    <td class="metric-cell">${fmt(r.metrics.xpDay, 0)}</td>
  </tr>`).join("") || '<tr><td colspan="8">Nenhuma receita encontrada.</td></tr>';
  bindAssetImages($("#recipeBody"));
}

function bindModifiers() {
  const map = { xpBonus: "xpBonus", timeBonus: "timeBonus", outputMultiplier: "outputMultiplier", ingredientMultiplier: "ingredientMultiplier" };
  Object.entries(map).forEach(([id, key]) => {
    const input = document.getElementById(id);
    input.value = state.modifiers[key];
    input.addEventListener("input", () => {
      state.modifiers[key] = Number(input.value) || 0;
      saveState();
      renderRecipes();
    });
  });
}

// ---------- Deliveries ----------
function deliveryItemOptions(selected = "") {
  const items = [...new Set([...allPriceItems(), ...DATA.recipes.map(r => r.name), ...DATA.crafting.map(i => i.name)])].sort((a, b) => a.localeCompare(b));
  return `<option value="">Selecione…</option>` + items.map(i => `<option value="${esc(i)}" ${i === selected ? "selected" : ""}>${esc(i)}</option>`).join("");
}

function renderSflNpcs() {
  const npcs = DATA.deliveryNPCs.filter(n => n.reward === "sfl");
  $("#sflNpcGrid").innerHTML = npcs.map(n => `<div class="card npc-card" style="${state.level >= n.level ? "" : "opacity:.55"}">
    <div class="npc-icon">👺</div>
    <div><div class="item-title"><h3>${esc(n.name)}</h3><span class="badge ${state.level >= n.level ? "accent" : "danger"}">Lv ${n.level}</span></div>
    <p>${esc(n.focus)}</p><div class="item-meta"><span class="badge gold">FLOWER / SFL</span></div></div>
  </div>`).join("");
}

function renderNpcTable() {
  $("#npcBody").innerHTML = DATA.deliveryNPCs.map(n => `<tr><td><strong>${esc(n.name)}</strong></td><td>${n.level}</td><td><span class="badge ${n.reward === "sfl" ? "gold" : ""}">${n.reward === "sfl" ? "FLOWER / SFL" : "Coins"}</span></td><td>${esc(n.focus)}</td><td>${esc(n.skill || "—")}</td></tr>`).join("");
}

function renderDeliveryNpcSelect() {
  const select = $("#deliveryNpc");
  select.innerHTML = DATA.deliveryNPCs.map(n => `<option value="${n.id}">${esc(n.name)} · ${n.reward === "sfl" ? "SFL" : "Coins"}</option>`).join("");
  select.value = state.delivery.npc;
  $("#deliveryRewardType").value = state.delivery.rewardType;
  $("#deliveryReward").value = state.delivery.reward;
  $("#deliveryBonus").value = state.delivery.bonus;
}

function kindForItem(name) {
  if (DATA.fish.some(f => f.name === name)) return "fish";
  if (DATA.recipes.some(r => r.name === name)) return "recipe";
  if (DATA.crafting.some(r => r.name === name)) return "craft";
  if (DATA.flowers.some(r => r.name === name)) return "flower";
  return "ingredient";
}

function renderOrderBuilder() {
  if (!state.delivery.lines?.length) state.delivery.lines = [{ item: "", amount: 1 }];
  $("#orderBuilder").innerHTML = state.delivery.lines.map((line, index) => `<div class="order-line">
    <div class="delivery-preview">${line.item ? mediaHTML(line.item, kindForItem(line.item), "md") : '<span class="empty-preview">?</span>'}</div>
    <select class="compact-input delivery-item" data-index="${index}">${deliveryItemOptions(line.item)}</select>
    <input class="compact-input delivery-amount" data-index="${index}" type="number" min="0" step="0.01" value="${line.amount || 1}" aria-label="Quantidade">
    <button class="remove-line" data-remove-line="${index}" title="Remover">×</button>
  </div>`).join("");

  $$(".delivery-item").forEach(el => el.onchange = () => {
    state.delivery.lines[+el.dataset.index].item = el.value;
    saveState();
    renderOrderBuilder();
    renderDeliveryResults();
  });
  $$(".delivery-amount").forEach(el => el.oninput = () => {
    state.delivery.lines[+el.dataset.index].amount = Number(el.value) || 0;
    saveState();
    renderDeliveryResults();
  });
  $$('[data-remove-line]').forEach(btn => btn.onclick = () => {
    state.delivery.lines.splice(+btn.dataset.removeLine, 1);
    saveState();
    renderOrderBuilder();
    renderDeliveryResults();
  });
  bindAssetImages($("#orderBuilder"));
}

function renderDeliveryResults() {
  if (!$("#deliveryResults")) return;
  let cost = 0;
  let complete = true;
  let hasItems = false;
  for (const line of state.delivery.lines || []) {
    if (!line.item || !line.amount) continue;
    hasItems = true;
    const p = priceOf(line.item);
    if (p === null) { complete = false; continue; }
    cost += p * Number(line.amount || 0);
  }
  if (!hasItems) complete = false;
  const reward = Number(state.delivery.reward || 0) * (1 + Number(state.delivery.bonus || 0) / 100);
  const isSfl = state.delivery.rewardType === "sfl";
  const profit = isSfl && complete ? reward - cost : null;
  const roi = profit !== null && cost > 0 ? profit / cost * 100 : null;
  const badge = profit === null ? "" : profit >= 0 ? "positive" : "negative";

  $("#deliveryResults").innerHTML = `
    <div class="result-box"><span>Custo dos itens</span><strong>${complete ? `${fmt(cost, 4)} SFL` : "Preços incompletos"}</strong></div>
    <div class="result-box"><span>Recompensa ajustada</span><strong>${fmt(reward, 4)} ${isSfl ? "SFL" : "Coins"}</strong></div>
    <div class="result-box ${badge}"><span>${isSfl ? "Lucro / prejuízo" : "Comparação"}</span><strong>${profit === null ? (isSfl ? "—" : "Moedas ≠ SFL") : `${profit >= 0 ? "+" : ""}${fmt(profit, 4)} SFL${roi !== null ? ` · ${fmt(roi, 1)}%` : ""}`}</strong></div>`;
}

function bindDelivery() {
  $("#deliveryNpc").onchange = e => {
    state.delivery.npc = e.target.value;
    const npc = DATA.deliveryNPCs.find(n => n.id === e.target.value);
    state.delivery.rewardType = npc?.reward === "sfl" ? "sfl" : "coins";
    $("#deliveryRewardType").value = state.delivery.rewardType;
    saveState();
    renderDeliveryResults();
  };
  $("#deliveryRewardType").onchange = e => {
    state.delivery.rewardType = e.target.value;
    saveState();
    renderDeliveryResults();
  };
  $("#deliveryReward").oninput = e => {
    state.delivery.reward = Number(e.target.value) || 0;
    saveState();
    renderDeliveryResults();
  };
  $("#deliveryBonus").oninput = e => {
    state.delivery.bonus = Number(e.target.value) || 0;
    saveState();
    renderDeliveryResults();
  };
  $("#addOrderLine").onclick = () => {
    state.delivery.lines.push({ item: "", amount: 1 });
    saveState();
    renderOrderBuilder();
  };
}

// ---------- Quick links popover ----------
function showQuickLinks() {
  let pop = $("#quickPopover");
  if (pop) { pop.remove(); return; }
  pop = document.createElement("div");
  pop.id = "quickPopover";
  pop.className = "panel quick-popover";
  pop.innerHTML = DATA.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener"><span>${esc(l.label)}</span><span>↗</span></a>`).join("");
  document.body.appendChild(pop);
  setTimeout(() => document.addEventListener("click", function close(e) {
    if (!pop.contains(e.target) && e.target !== $("#quickLinksBtn")) {
      pop.remove();
      document.removeEventListener("click", close);
    }
  }), 0);
}

// ---------- Three.js background ----------
function initScene() {
  if (!window.THREE || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const canvas = $("#scene");
  try {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.35));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, .1, 100);
    camera.position.z = 8;
    const count = innerWidth < 700 ? 24 : 54;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - .5) * 14;
      positions[i * 3 + 1] = (Math.random() - .5) * 9;
      positions[i * 3 + 2] = (Math.random() - .5) * 5;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x73de8a, size: .045, transparent: true, opacity: .34 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    function resize() {
      renderer.setSize(innerWidth, innerHeight, false);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    }
    resize();
    addEventListener("resize", resize, { passive: true });
    function tick() {
      points.rotation.y += .00035;
      points.rotation.x += .0001;
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    tick();
  } catch {
    canvas.style.display = "none";
  }
}

function bindUI() {
  $$('[data-view]').forEach(btn => btn.addEventListener("click", () => navigate(btn.dataset.view)));
  $$('[data-go]').forEach(btn => btn.addEventListener("click", () => navigate(btn.dataset.go)));
  $$('[data-view-link]').forEach(link => link.addEventListener("click", e => {
    e.preventDefault();
    navigate(link.dataset.viewLink);
  }));
  $("#themeBtn").onclick = () => setTheme(state.theme === "dark" ? "light" : "dark");
  $("#quickLinksBtn").onclick = showQuickLinks;

  $("#seasonSelect").onchange = e => {
    state.season = e.target.value;
    saveState();
    renderFlowers();
    renderFish();
    renderSflNpcs();
    renderDashboardStats();
  };
  $("#levelInput").oninput = e => {
    state.level = Math.max(1, Number(e.target.value) || 1);
    saveState();
    renderFlowers();
    renderSflNpcs();
    renderDashboardStats();
  };
  $("#resetBtn").onclick = () => {
    if (confirm("Apagar checklists, preços e preferências salvas neste navegador?")) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("sfl-companion-v1");
      location.reload();
    }
  };

  $("#flowerSearch").oninput = renderFlowers;
  $$('[data-filter]', $("#flowerFilters")).forEach(btn => btn.onclick = () => {
    state.filters.flower = btn.dataset.filter;
    $$('[data-filter]', $("#flowerFilters")).forEach(b => b.classList.toggle("active", b === btn));
    saveState();
    renderFlowers();
  });
  $("#fishSearch").oninput = renderFish;
  $$('[data-filter]', $("#fishFilters")).forEach(btn => btn.onclick = () => {
    state.filters.fish = btn.dataset.filter;
    $$('[data-filter]', $("#fishFilters")).forEach(b => b.classList.toggle("active", b === btn));
    saveState();
    renderFish();
  });
  $("#craftSearch").oninput = renderCrafting;
  $("#recipeSearch").oninput = renderRecipes;
  $("#recipeSort").onchange = renderRecipes;
  $("#clearPrices").onclick = () => {
    if (confirm("Zerar todos os preços em SFL?")) {
      state.prices = {};
      saveState();
      renderPriceGrid();
      renderRecipes();
      renderDeliveryResults();
    }
  };
}

function syncFilterButtons() {
  $$('[data-filter]', $("#flowerFilters")).forEach(b => b.classList.toggle("active", b.dataset.filter === state.filters.flower));
  $$('[data-filter]', $("#fishFilters")).forEach(b => b.classList.toggle("active", b.dataset.filter === state.filters.fish));
}

async function init() {
  document.documentElement.dataset.theme = state.theme;
  $("#themeBtn").textContent = state.theme === "dark" ? "☀" : "☾";
  renderSeasonSelect();
  $("#levelInput").value = state.level;
  renderLinks();
  renderDashboardStats();
  syncFilterButtons();
  renderFlowers();
  renderFish();
  renderCrafting();
  renderPriceGrid();
  bindModifiers();
  renderRecipes();
  renderSflNpcs();
  renderNpcTable();
  renderDeliveryNpcSelect();
  renderOrderBuilder();
  renderDeliveryResults();
  bindDelivery();
  bindUI();

  const hash = location.hash.replace("#", "");
  if (["dashboard", "flowers", "fishing", "crafting", "cooking", "deliveries"].includes(hash)) navigate(hash, false);

  try {
    const motion = await import("https://cdn.jsdelivr.net/npm/motion@12.23.12/+esm");
    motionAnimate = motion.animate;
  } catch { /* CSS/GSAP remain as graceful fallback */ }

  setTimeout(() => animateView(hash || "dashboard"), 60);
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("load", initScene, { once: true });