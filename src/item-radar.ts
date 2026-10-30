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
                <h2 id="radar-title">物品</h2>
              </div>
              <small id="radar-count-badge">正在读取物品…</small>
            </div>
            <button id="radar-close-btn" class="btn-panel-close" aria-label="关闭物品列表">
              <i data-lucide="x"></i>
            </button>
          </header>

          <div class="radar-filter-bar">
            <div class="radar-filter-row">
              <select id="radar-map-select" class="radar-map-select" aria-label="选择地图">
                <option value="all">全部地图</option>
                ${MAPS.map((m) => `<option value="${m.id}">${escapeHtml(m.name)}${m.isDlc ? ' · DLC' : ''}</option>`).join('')}
              </select>
              <div class="radar-search-box">
                <i data-lucide="search"></i>
                <input id="radar-search-input" type="search" placeholder="搜索物品" aria-label="搜索物品">
              </div>
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

      overlay.querySelector<HTMLSelectElement>('#radar-map-select')?.addEventListener('change', (e) => {
        this.selectMap((e.currentTarget as HTMLSelectElement).value);
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

    const mapSelect = this.overlayEl?.querySelector<HTMLSelectElement>('#radar-map-select');
    if (mapSelect) mapSelect.value = mapId;

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
      countBadge.textContent = `${spots.length} 处`;
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
      const spotMapName = MAPS.find((m) => m.id === spot.mapId)?.name ?? spot.mapId;
      const distText = isCurrentMap ? `距您 ${distance}m` : '跨地图';
      const teleportBtnText = isCurrentMap ? '前往' : `前往 ${spotMapName}`;
      const teleportBtnClass = isCurrentMap ? 'btn-radar-teleport' : 'btn-radar-teleport cross-map-teleport';
      const teleportBtnTitle = isCurrentMap ? '前往物品附近' : `跨地图前往 [${escapeHtml(spotMapName)}] 的物品附近`;

      const firstSummary = spot.items[0]?.summary || '';

      card.innerHTML = `
        <div class="radar-card-header">
          <div class="radar-card-badges-left">
            <div class="radar-card-type-tag ${spot.in_chest ? 'chest' : 'orb'}">
              <i data-lucide="${spot.in_chest ? 'package' : 'sparkles'}"></i>
              <span>${spot.in_chest ? '宝箱' : '光点'}</span>
            </div>
            <span class="radar-map-pill">${escapeHtml(spotMapName)}</span>
          </div>
          <span class="radar-dist-pill ${isCurrentMap ? '' : 'cross-map'}">${distText}</span>
        </div>

        <div class="radar-card-body">
          <div class="radar-card-info">
            <strong class="radar-card-title">${escapeHtml(itemTitle)}</strong>
            ${firstSummary ? `<p class="item-summary-line">${escapeHtml(firstSummary)}</p>` : ''}
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
