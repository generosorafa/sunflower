const DATA = window.SFL_DATA;
const STORAGE_KEY = "sfl-companion-v1";
const V3_STORAGE_KEY = "sfl-companion-flowers-v3";
const SET1_SEEDS = new Set(["Sunpetal Seed", "Bloom Seed", "Lily Seed"]);
const SET2_SEEDS = new Set(["Edelweiss Seed", "Gladiolus Seed", "Lavender Seed", "Clover Seed"]);

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function esc(value = "") {
  return String(value).replace(/[&<>'"]/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[c]));
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

function readBaseState() {
  try {
    const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    state.flowers ||= {};
    state.fish ||= {};
    state.filters ||= {};
    return state;
  } catch {
    return { flowers: {}, fish: {}, filters: {} };
  }
}

function readV3State() {
  try {
    const v3 = JSON.parse(localStorage.getItem(V3_STORAGE_KEY) || "{}");
    v3.owned ||= {};
    v3.recipes ||= {};
    return v3;
  } catch {
    return { owned: {}, recipes: {} };
  }
}

function readState() {
  return { ...readBaseState(), _v3: readV3State() };
}

function writeV3(v3) {
  localStorage.setItem(V3_STORAGE_KEY, JSON.stringify(v3));
}

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj || {}, key);
}

function isOwned(state, name) {
  if (hasOwn(state._v3?.owned, name)) return !!state._v3.owned[name];
  return !!state.flowers?.[name];
}

function recipesFor(state, name) {
  const list = state._v3?.recipes?.[name];
  return Array.isArray(list) ? list : [];
}

function seedInfo(seedName) {
  return DATA.flowerSeeds.find((seed) => seed.name === seedName);
}

function setForSeed(seedName) {
  return SET1_SEEDS.has(seedName) ? "set1" : "set2";
}

function baseCrossbreeds(seedName) {
  return DATA.flowerCrossbreedInputs?.[setForSeed(seedName)] || [];
}

function flowersInSameSet(seedName) {
  const set = setForSeed(seedName);
  return DATA.flowers
    .filter((flower) => setForSeed(flower.seed) === set)
    .map((flower) => flower.name);
}

function validCrossbreeds(seedName) {
  const base = baseCrossbreeds(seedName).map(([name, amount]) => ({ name, amount, kind: "resource" }));
  const flowers = flowersInSameSet(seedName).map((name) => ({ name, amount: 1, kind: "flower" }));
  return [...base, ...flowers];
}

function amountFor(seedName, crossbreed) {
  return validCrossbreeds(seedName).find((item) => item.name === crossbreed)?.amount || 1;
}

function seasonLabel(id) {
  return DATA.seasons.find((season) => season.id === id)?.label || id;
}

function seedCandidates(seedName) {
  const aliases = DATA.assetAliases?.[seedName] || [];
  const slug = slugify(seedName);
  return [
    ...aliases,
    `flowers/${slug}.webp`,
    `flowers/${slug}.png`,
  ].map((path) => /^https?:\/\//.test(path) ? path : `${DATA.assetBase}/${path}`);
}

function flowerCandidates(name) {
  const slug = slugify(name);
  return [
    ...(DATA.assetAliases?.[name] || []),
    `flowers/${slug}.webp`,
    `flowers/${slug}.png`,
    `flowers/${slug}.gif`,
  ].map((path) => /^https?:\/\//.test(path) ? path : `${DATA.assetBase}/${path}`);
}

function imageHTML(name, kind = "flower", className = "") {
  const candidates = kind === "seed" ? seedCandidates(name) : flowerCandidates(name);
  return `<span class="flower-v3-media ${className}">
    <span class="flower-v3-fallback">${kind === "seed" ? "🌱" : "🌺"}</span>
    <img data-v3-candidates="${encodeURIComponent(JSON.stringify(candidates))}" alt="${esc(name)}" loading="lazy" decoding="async" />
  </span>`;
}

function bindImages(root = document) {
  $$('img[data-v3-candidates]', root).forEach((img) => {
    if (img.dataset.v3Bound === "1") return;
    img.dataset.v3Bound = "1";
    let candidates = [];
    try {
      candidates = JSON.parse(decodeURIComponent(img.dataset.v3Candidates || "%5B%5D"));
    } catch {
      candidates = [];
    }
    let index = 0;
    const tryNext = () => {
      if (index >= candidates.length) {
        img.style.display = "none";
        img.closest(".flower-v3-media")?.classList.add("missing");
        return;
      }
      img.src = candidates[index++];
    };
    img.addEventListener("load", () => img.closest(".flower-v3-media")?.classList.add("loaded"), { once: true });
    img.addEventListener("error", tryNext);
    tryNext();
  });
}

function progressForSeed(seedName, state) {
  const flowers = DATA.flowers.filter((flower) => flower.seed === seedName);
  const owned = flowers.filter((flower) => isOwned(state, flower.name)).length;
  return { owned, total: flowers.length, pct: flowers.length ? Math.round(owned / flowers.length * 100) : 0 };
}

function overallProgress(state) {
  const flowerOwned = DATA.flowers.filter((flower) => isOwned(state, flower.name)).length;
  const fishOwned = DATA.fish.filter((fish) => !!state.fish?.[fish.name]).length;
  const total = DATA.flowers.length + DATA.fish.length;
  return {
    flowerOwned,
    flowerPct: DATA.flowers.length ? Math.round(flowerOwned / DATA.flowers.length * 100) : 0,
    overallPct: total ? Math.round((flowerOwned + fishOwned) / total * 100) : 0,
  };
}

function syncProgress(state) {
  const p = overallProgress(state);
  const text = $("#flowerProgressText");
  const bar = $("#flowerProgress");
  const hero = $("#heroProgress");
  if (text) text.textContent = `${p.flowerOwned} / ${DATA.flowers.length} · ${p.flowerPct}%`;
  if (bar) bar.style.width = `${p.flowerPct}%`;
  if (hero) hero.textContent = `${p.overallPct}%`;

  const dashboard = $("#dashboardStats");
  if (dashboard) {
    const firstMetric = dashboard.querySelector(".metric");
    if (firstMetric) {
      const value = firstMetric.querySelector(".value");
      const hint = firstMetric.querySelector(".hint");
      if (value) value.textContent = `${p.flowerOwned} / ${DATA.flowers.length}`;
      if (hint) hint.textContent = `${p.flowerPct}% da coleção marcada`;
    }
  }
}

function activeFilter(state) {
  return state.filters?.flower || "all";
}

function visibleFlowers(state) {
  const filter = activeFilter(state);
  const q = ($("#flowerSearch")?.value || "").trim().toLowerCase();
  const season = $("#seasonSelect")?.value || state.season || "spring";
  const level = Math.max(1, Number($("#levelInput")?.value || state.level || 1));

  return DATA.flowers.filter((flower) => {
    const seed = seedInfo(flower.seed);
    const owned = isOwned(state, flower.name);
    const hay = `${flower.name} ${flower.family} ${flower.seed}`.toLowerCase();
    if (q && !hay.includes(q)) return false;
    if (filter === "missing" && owned) return false;
    if (filter === "owned" && !owned) return false;
    if (filter === "season" && flower.season !== "all" && flower.season !== season) return false;
    if (filter === "available" && seed && level < seed.level) return false;
    return true;
  });
}

function recipeChips(flower, state) {
  const recipes = recipesFor(state, flower.name);
  if (!recipes.length) {
    return `<div class="flower-v3-empty-recipe">
      <span>🔎</span>
      <div><strong>Ainda não registrada</strong><small>Quando descobrir esta flor no jogo, registre abaixo qual crossbreed você usou.</small></div>
    </div>`;
  }

  return `<div class="flower-v3-recipe-list">${recipes.map((crossbreed) => {
    const amount = amountFor(flower.seed, crossbreed);
    return `<span class="flower-v3-recipe-chip">
      <span class="flower-v3-recipe-text"><b>1</b> ${esc(flower.seed)} + <b>${amount}</b> ${esc(crossbreed)}</span>
      <button type="button" data-v3-remove-recipe="${esc(flower.name)}" data-v3-crossbreed="${esc(crossbreed)}" aria-label="Remover combinação">×</button>
    </span>`;
  }).join("")}</div>`;
}

function recipeSelect(flower, state) {
  const selected = new Set(recipesFor(state, flower.name));
  const options = validCrossbreeds(flower.seed).filter((item) => !selected.has(item.name));
  const base = options.filter((item) => item.kind === "resource");
  const flowerOptions = options.filter((item) => item.kind === "flower");

  return `<div class="flower-v3-add-recipe">
    <label for="recipe-${slugify(flower.name)}">Descobri usando…</label>
    <select id="recipe-${slugify(flower.name)}" data-v3-add-recipe="${esc(flower.name)}">
      <option value="">Selecionar crossbreed</option>
      ${base.length ? `<optgroup label="Crops / frutas">${base.map((item) => `<option value="${esc(item.name)}">${item.amount} × ${esc(item.name)}</option>`).join("")}</optgroup>` : ""}
      ${flowerOptions.length ? `<optgroup label="Flores do mesmo conjunto">${flowerOptions.map((item) => `<option value="${esc(item.name)}">1 × ${esc(item.name)}</option>`).join("")}</optgroup>` : ""}
    </select>
  </div>`;
}

function flowerCard(flower, state) {
  const owned = isOwned(state, flower.name);
  const seed = seedInfo(flower.seed);
  const seasonal = flower.season !== "all";
  const season = $("#seasonSelect")?.value || state.season || "spring";
  const currentSeason = !seasonal || flower.season === season;

  return `<article class="flower-v3-card ${owned ? "owned" : ""}">
    <div class="flower-v3-art">
      ${imageHTML(flower.name, "flower", "flower-v3-flower-image")}
      ${owned ? '<span class="flower-v3-owned-label">JÁ TENHO</span>' : ""}
    </div>
    <div class="flower-v3-body">
      <div class="flower-v3-title-row">
        <div>
          <h4>${esc(flower.name)}</h4>
          <span>${esc(flower.family)}</span>
        </div>
        <button type="button" class="flower-v3-check" data-v3-toggle-flower="${esc(flower.name)}" aria-label="${owned ? "Desmarcar" : "Marcar"} ${esc(flower.name)}">${owned ? "✓" : ""}</button>
      </div>

      <div class="flower-v3-badges">
        <span>${esc(flower.seed)}</span>
        ${flower.rarity === "epic" ? '<span class="epic">EPIC</span>' : ""}
        ${seasonal ? `<span class="${currentSeason ? "current" : ""}">${currentSeason ? "● " : ""}${esc(seasonLabel(flower.season))}</span>` : '<span>Todas estações</span>'}
        ${seed ? `<span>Lv ${seed.level}</span>` : ""}
      </div>

      <div class="flower-v3-recipe-box">
        <div class="flower-v3-recipe-heading">
          <div><strong>Receita na sua fazenda</strong><small>A associação exata é descoberta individualmente.</small></div>
        </div>
        ${recipeChips(flower, state)}
        ${recipeSelect(flower, state)}
      </div>
    </div>
  </article>`;
}

function crossbreedSummary(seedName) {
  const base = baseCrossbreeds(seedName);
  return base.map(([name, amount]) => `<span><b>${amount}</b> ${esc(name)}</span>`).join("");
}

function seedGroup(seedName, flowers, state) {
  const seed = seedInfo(seedName);
  const p = progressForSeed(seedName, state);
  const season = $("#seasonSelect")?.value || state.season || "spring";
  const seasonal = seed?.season && seed.season !== "all";
  const inSeason = !seasonal || seed.season === season;

  return `<section class="flower-v3-group" id="flower-seed-${slugify(seedName)}">
    <header class="flower-v3-group-head">
      <div class="flower-v3-seed-identity">
        ${imageHTML(seedName, "seed", "flower-v3-seed-image")}
        <div>
          <div class="flower-v3-seed-title-line">
            <h3>${esc(seedName)}</h3>
            ${seasonal ? `<span class="flower-v3-season-pill ${inSeason ? "on" : "off"}">${inSeason ? "ESTAÇÃO ATUAL" : seasonLabel(seed.season)}</span>` : ""}
          </div>
          <p>${p.owned}/${p.total} flores descobertas · ${p.pct}%</p>
          <div class="flower-v3-seed-meta">
            ${seed ? `<span>Lv ${seed.level}</span><span>${seed.coins} Coins</span><span>${seed.days}d</span>` : ""}
          </div>
        </div>
      </div>
      <div class="flower-v3-group-progress"><span style="width:${p.pct}%"></span></div>
    </header>

    <div class="flower-v3-howto">
      <div class="flower-v3-howto-title"><span>🧬</span><div><strong>Como descobrir flores com ${esc(seedName)}</strong><small>Use 1 semente + um crossbreed válido. O resultado específico é revelado pela sua fazenda.</small></div></div>
      <div class="flower-v3-crossbreed-list">${crossbreedSummary(seedName)}</div>
      <div class="flower-v3-howto-foot">Também é possível usar <b>1 flor do mesmo conjunto</b> como crossbreed. Depois que você descobrir a associação, registre no card da flor para montar sua enciclopédia pessoal.</div>
    </div>

    <div class="flower-v3-grid">${flowers.map((flower) => flowerCard(flower, state)).join("")}</div>
  </section>`;
}

function seedNavigation(groups, state) {
  const note = `<div class="flower-v3-truth">
    <span class="flower-v3-truth-icon">🧬</span>
    <div><strong>As receitas específicas são pessoais da fazenda</strong><p>O código atual salva quais crossbreeds você descobriu para cada flor. Por isso este companion permite registrar suas próprias combinações em vez de mostrar uma receita universal falsa.</p></div>
  </div>`;

  const nav = `<div class="flower-v3-seed-nav">${groups.map(([seedName]) => {
    const p = progressForSeed(seedName, state);
    return `<button type="button" data-v3-seed-jump="${slugify(seedName)}">${imageHTML(seedName, "seed", "flower-v3-nav-image")}<span><b>${esc(seedName.replace(" Seed", ""))}</b><small>${p.owned}/${p.total}</small></span></button>`;
  }).join("")}</div>`;
  return note + nav;
}

function render() {
  const grid = $("#flowerGrid");
  const guide = $("#flowerSeedGuide");
  if (!grid || !guide || !DATA?.flowers?.length) return;

  const state = readState();
  const visible = visibleFlowers(state);
  const seedOrder = DATA.flowerSeeds.map((seed) => seed.name);
  const groups = seedOrder
    .map((seedName) => [seedName, visible.filter((flower) => flower.seed === seedName)])
    .filter(([, flowers]) => flowers.length);

  guide.className = "flower-v3-guide";
  guide.innerHTML = seedNavigation(groups, state);

  if (!groups.length) {
    grid.className = "flower-v3-root";
    grid.innerHTML = '<div class="flower-v3-no-results">Nenhuma flor encontrada com esses filtros.</div>';
  } else {
    grid.className = "flower-v3-root";
    grid.innerHTML = groups.map(([seedName, flowers]) => seedGroup(seedName, flowers, state)).join("");
  }

  bindImages(guide);
  bindImages(grid);
  syncProgress(state);
}

function toggleFlower(name) {
  const state = readState();
  const v3 = readV3State();
  v3.owned[name] = !isOwned(state, name);
  writeV3(v3);
  render();
}

function addRecipe(name, crossbreed) {
  if (!crossbreed) return;
  const v3 = readV3State();
  const list = Array.isArray(v3.recipes[name]) ? v3.recipes[name] : [];
  if (!list.includes(crossbreed)) v3.recipes[name] = [...list, crossbreed];
  v3.owned[name] = true;
  writeV3(v3);
  render();
}

function removeRecipe(name, crossbreed) {
  const v3 = readV3State();
  const list = Array.isArray(v3.recipes[name]) ? v3.recipes[name] : [];
  v3.recipes[name] = list.filter((item) => item !== crossbreed);
  writeV3(v3);
  render();
}

function install() {
  const section = $("#flowers");
  if (!section || section.dataset.v3Installed === "1") return;
  section.dataset.v3Installed = "1";

  $("#flowerSearch")?.addEventListener("input", () => setTimeout(render, 0));
  $("#flowerFilters")?.addEventListener("click", () => setTimeout(render, 0));
  $("#seasonSelect")?.addEventListener("change", () => setTimeout(render, 0));
  $("#levelInput")?.addEventListener("input", () => setTimeout(render, 0));

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const toggle = target.closest("[data-v3-toggle-flower]");
    if (toggle) {
      event.preventDefault();
      toggleFlower(toggle.dataset.v3ToggleFlower);
      return;
    }

    const remove = target.closest("[data-v3-remove-recipe]");
    if (remove) {
      event.preventDefault();
      removeRecipe(remove.dataset.v3RemoveRecipe, remove.dataset.v3Crossbreed);
      return;
    }

    const jump = target.closest("[data-v3-seed-jump]");
    if (jump) {
      document.getElementById(`flower-seed-${jump.dataset.v3SeedJump}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const select = target?.closest("[data-v3-add-recipe]");
    if (select) addRecipe(select.dataset.v3AddRecipe, select.value);
  });

  render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => setTimeout(install, 0), { once: true });
} else {
  setTimeout(install, 0);
}
