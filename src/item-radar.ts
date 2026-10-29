import { createIcons, Package, Sparkles, MapPin, Gem, Search, X, BookOpen } from 'lucide';
import { ALL_MAP_ITEMS, type TreasureSpot } from './all-items';
import { MAPS } from './maps';

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]!);
}

export class ItemRadar {
  private overlayEl: HTMLElement | null = null;
  private currentMapId: string = 'all';
  private playerMapId: string = '';
  private playerPos: [number, number, number] = [0, 0, 0];
  private selectedCategory: string = 'all';
  private searchKeyword: string = '';
  private onTeleportCallback: ((spot: TreasureSpot) => void) | null = null;
  private onDetailCallback: ((spot: TreasureSpot) => void) | null = null;

  constructor() {
    this.initUI();
  }

  private initUI() {
    let overlay = document.getElementById('item-radar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'item-radar-overlay';
      overlay.className = 'item-radar-overlay hidden';
      overlay.innerHTML = `
        <div class="item-radar-modal" role="dialog" aria-modal="true" aria-labelledby="radar-title">
          <header class="item-radar-header">
            <div class="radar-header-text">
              <div class="radar-title-wrap">
                <i data-lucide="gem" class="radar-header-icon"></i>
                <h2 id="radar-title">多兰古雷格 · 地图道具雷达</h2>
                <span id="radar-map-badge" class="radar-map-badge">全部地图</span>
              </div>
              <small id="radar-count-badge">全地图 27 域物品地毯检索 · 支持跨区域瞬移与故事考据</small>
            </div>
            <button id="radar-close-btn" class="btn-panel-close" aria-label="关闭物品列表">
              <i data-lucide="x"></i>
            </button>
          </header>

          <div class="radar-map-bar">
            <div class="radar-map-tabs-container">
              <span class="radar-map-tabs-label">地图：</span>
              <div class="radar-map-tabs" id="radar-map-tabs" role="tablist" aria-label="地图选择">
                <button class="radar-map-tab-btn active" data-map="all" type="button" role="tab">全部地图</button>
                ${MAPS.map((m) => `<button class="radar-map-tab-btn" data-map="${m.id}" type="button" role="tab">${escapeHtml(m.name)}${m.isDlc ? ' <small class="dlc-badge">DLC</small>' : ''}</button>`).join('')}
              </div>
            </div>
            <span class="radar-map-mode-tag" id="radar-map-mode-tag">全27区域聚合</span>
          </div>

          <div class="radar-filter-bar">
            <div class="radar-search-box">
              <i data-lucide="search"></i>
              <input id="radar-search-input" type="search" placeholder="搜索道具名称、武器、防具、戒指、原素碎片…" aria-label="搜索道具">
            </div>
            <div class="radar-category-tabs" id="radar-category-tabs">
              <button class="radar-cat-btn active" data-cat="all">全部</button>
              <button class="radar-cat-btn" data-cat="equip">武器防具</button>
              <button class="radar-cat-btn" data-cat="ring">戒指</button>
              <button class="radar-cat-btn" data-cat="key">钥匙余烬</button>
              <button class="radar-cat-btn" data-cat="spell">法术咒术</button>
              <button class="radar-cat-btn" data-cat="upgrade">强化材料</button>
              <button class="radar-cat-btn" data-cat="consumable">灵魂消耗</button>
            </div>
          </div>

          <div class="radar-item-list" id="radar-item-list"></div>
        </div>
      `;
      const overlayHost = document.getElementById('explore-stage') ?? document.body;
      overlayHost.appendChild(overlay);

      overlay.querySelector('#radar-close-btn')?.addEventListener('click', () => {
        this.close();
      });

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.close();
      });

      const searchInput = overlay.querySelector<HTMLInputElement>('#radar-search-input');
      searchInput?.addEventListener('input', () => {
        this.searchKeyword = searchInput.value.trim().toLowerCase();
        this.renderList();
      });

      const mapTabs = overlay.querySelector('#radar-map-tabs');
      mapTabs?.addEventListener('click', (e) => {
        const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.radar-map-tab-btn');
        if (!btn) return;
        const targetMap = btn.dataset.map || 'all';
        this.selectMap(targetMap);
      });

      const catTabs = overlay.querySelector('#radar-category-tabs');
      catTabs?.addEventListener('click', (e) => {
        const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.radar-cat-btn');
        if (!btn) return;
        catTabs.querySelectorAll('.radar-cat-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedCategory = btn.dataset.cat || 'all';
        this.renderList();
      });

      createIcons({
        icons: {
          Package,
          Sparkles,
          MapPin,
          Gem,
          Search,
          X,
          BookOpen,
        },
      });
    }

    this.overlayEl = overlay;
  }

  public selectMap(mapId: string, skipRender = false) {
    this.currentMapId = mapId;

    const overlay = this.overlayEl;
    if (overlay) {
      const tabs = overlay.querySelectorAll('.radar-map-tab-btn');
      tabs.forEach((tab) => {
        const target = (tab as HTMLElement).dataset.map;
        if (target === mapId) {
          tab.classList.add('active');
          tab.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
        } else {
          tab.classList.remove('active');
        }
      });

      const badge = overlay.querySelector('#radar-map-badge');
      const tag = overlay.querySelector('#radar-map-mode-tag');
      if (mapId === 'all') {
        if (badge) badge.textContent = '全部地图';
        if (tag) tag.textContent = '全27区域聚合';
      } else {
        const mapDef = MAPS.find((m) => m.id === mapId);
        const mapName = mapDef?.name ?? mapId;
        if (badge) badge.textContent = mapName;
        if (tag) tag.textContent = mapDef?.isDlc ? '失落王冠 DLC' : '大陆区域';
      }
    }

    if (!skipRender) {
      this.renderList();
    }
  }

  public open(
    mapId: string,
    playerPos: [number, number, number],
    onTeleport: (spot: TreasureSpot) => void,
    onDetail?: (spot: TreasureSpot) => void
  ) {
    this.playerMapId = mapId;
    this.playerPos = [...playerPos];
    this.onTeleportCallback = onTeleport;
    this.onDetailCallback = onDetail || null;

    if (!this.currentMapId || this.currentMapId === 'all') {
      this.currentMapId = mapId;
    }

    const searchInput = document.getElementById('radar-search-input') as HTMLInputElement | null;
    if (searchInput) searchInput.value = '';
    this.searchKeyword = '';

    this.selectMap(this.currentMapId, true);
    this.renderList();
    this.overlayEl?.classList.remove('hidden');
  }

  public close() {
    this.overlayEl?.classList.add('hidden');
  }

  public isOpen(): boolean {
    return Boolean(this.overlayEl && !this.overlayEl.classList.contains('hidden'));
  }

  private filterSpot(spot: TreasureSpot): boolean {
    // 关键字搜索过滤
    if (this.searchKeyword) {
      const matchName = spot.items.some((it) => it.name.toLowerCase().includes(this.searchKeyword));
      const matchCat = spot.items.some((it) => it.category.toLowerCase().includes(this.searchKeyword));
      const matchSummary = spot.items.some((it) => it.summary?.toLowerCase().includes(this.searchKeyword));
      if (!matchName && !matchCat && !matchSummary) return false;
    }

    // 分类筛选过滤
    if (this.selectedCategory === 'all') return true;
    if (this.selectedCategory === 'equip') {
      return spot.items.some((it) => it.category === '武器' || it.category === '防具');
    }
    if (this.selectedCategory === 'ring') {
      return spot.items.some((it) => it.category === '戒指');
    }
    if (this.selectedCategory === 'key') {
      return spot.items.some((it) => it.category === '钥匙余烬');
    }
    if (this.selectedCategory === 'spell') {
      return spot.items.some((it) => it.category === '法术咒术');
    }
    if (this.selectedCategory === 'upgrade') {
      return spot.items.some((it) => it.category === '强化材料');
    }
    if (this.selectedCategory === 'consumable') {
      return spot.items.some((it) => it.category === '灵魂' || it.category === '消耗品');
    }

    return true;
  }

  private renderList() {
    const container = document.getElementById('radar-item-list');
    if (!container) return;
    container.replaceChildren();

    const allSpots: TreasureSpot[] = this.currentMapId === 'all'
      ? Object.values(ALL_MAP_ITEMS).flat()
      : (ALL_MAP_ITEMS[this.currentMapId] || []);
    const spots = allSpots.filter((s) => this.filterSpot(s));

    const countBadge = document.getElementById('radar-count-badge');
    if (countBadge) {
      if (this.currentMapId === 'all') {
        countBadge.textContent = `全地图共 ${spots.length} 处宝藏记录 · 支持跨地图瞬移`;
      } else {
        const mapName = MAPS.find((m) => m.id === this.currentMapId)?.name ?? this.currentMapId;
        countBadge.textContent = `${mapName} 共 ${spots.length} 处宝藏记录 · 靠近或点击查看详情`;
      }
    }

    if (spots.length === 0) {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'radar-empty-state';
      emptyEl.innerHTML = `
        <div class="empty-icon"><i data-lucide="package"></i></div>
        <p>未找到符合筛选条件的拾取物或宝箱</p>
        <small>请尝试切换地图、分类或精简搜索关键词</small>
      `;
      container.appendChild(emptyEl);
      createIcons({ icons: { Package } });
      return;
    }

    // 计算到玩家的距离并排序（同地图由近及远，跨地图按地图目录排序）
    const sorted = [...spots].map((spot) => {
      const isCurrentMap = spot.mapId === this.playerMapId;
      let distance = 0;
      if (isCurrentMap) {
        const dx = this.playerPos[0] - spot.pos[0];
        const dy = this.playerPos[1] - spot.pos[1];
        const dz = this.playerPos[2] - spot.pos[2];
        distance = Math.round(Math.hypot(dx, dy, dz));
      }
      return { spot, distance, isCurrentMap };
    });

    sorted.sort((a, b) => {
      if (a.isCurrentMap && !b.isCurrentMap) return -1;
      if (!a.isCurrentMap && b.isCurrentMap) return 1;
      if (a.isCurrentMap && b.isCurrentMap) return a.distance - b.distance;
      if (a.spot.mapId !== b.spot.mapId) {
        const idxA = MAPS.findIndex((m) => m.id === a.spot.mapId);
        const idxB = MAPS.findIndex((m) => m.id === b.spot.mapId);
        return idxA - idxB;
      }
      return a.spot.id.localeCompare(b.spot.id);
    });

    for (const { spot, distance, isCurrentMap } of sorted) {
      const card = document.createElement('div');
      card.className = `radar-item-card ${spot.in_chest ? 'chest-card' : 'orb-card'}`;

      const itemTitle = spot.items.map((it) => `${it.name}${it.count > 1 ? ` ×${it.count}` : ''}`).join('、');
      const categories = [...new Set(spot.items.map((it) => it.category))];
      const spotMapName = MAPS.find((m) => m.id === spot.mapId)?.name ?? spot.mapId;
      const distText = isCurrentMap ? `距您 ${distance}m` : '跨地图';
      const teleportBtnText = isCurrentMap ? '前往附近' : `前往 ${spotMapName}`;
      const teleportBtnClass = isCurrentMap ? 'btn-radar-teleport' : 'btn-radar-teleport cross-map-teleport';
      const teleportBtnTitle = isCurrentMap ? '传送到物品面前' : `跨地图前往 [${escapeHtml(spotMapName)}] 物品面前`;

      const firstSummary = spot.items[0]?.summary || '';

      card.innerHTML = `
        <div class="radar-card-header">
          <div class="radar-card-badges-left">
            <div class="radar-card-type-tag ${spot.in_chest ? 'chest' : 'orb'}">
              <i data-lucide="${spot.in_chest ? 'package' : 'sparkles'}"></i>
              <span>${spot.in_chest ? '宝箱' : '光点'}</span>
            </div>
            <span class="radar-map-pill">${escapeHtml(spotMapName)}</span>
            ${spot.items.length > 1 ? `<span class="radar-tag-pill">合集 ${spot.items.length} 件</span>` : ''}
            ${categories.map((category) => `<span class="radar-tag-pill">${escapeHtml(category)}</span>`).join('')}
          </div>
          <span class="radar-dist-pill ${isCurrentMap ? '' : 'cross-map'}">${distText}</span>
        </div>

        <div class="radar-card-body">
          <div class="radar-card-info">
            <strong class="radar-card-title">${escapeHtml(itemTitle)}</strong>
            ${firstSummary ? `<p class="item-summary-line">${escapeHtml(firstSummary)}</p>` : ''}
            <div class="radar-card-coords">坐标: [${spot.pos.map((n) => n.toFixed(1)).join(', ')}]</div>
          </div>

          <div class="radar-card-actions">
            <button class="btn-radar-detail" type="button" title="查看物品说明与背景故事">
              <i data-lucide="book-open"></i>
              <span>详情</span>
            </button>
            <button class="${teleportBtnClass}" type="button" title="${teleportBtnTitle}">
              <i data-lucide="map-pin"></i>
              <span>${escapeHtml(teleportBtnText)}</span>
            </button>
          </div>
        </div>
      `;

      card.querySelector('.btn-radar-detail')?.addEventListener('click', () => {
        if (this.onDetailCallback) {
          this.onDetailCallback(spot);
        }
      });

      card.querySelector('.btn-radar-teleport')?.addEventListener('click', () => {
        if (this.onTeleportCallback) {
          this.onTeleportCallback(spot);
          this.close();
        }
      });

      container.appendChild(card);
    }

    createIcons({
      icons: {
        Package,
        Sparkles,
        MapPin,
        Gem,
        Search,
        X,
        BookOpen,
      },
    });
  }
}
