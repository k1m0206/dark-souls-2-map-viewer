import { createIcons, Package, Sparkles, X, ChevronRight, BookOpen } from 'lucide';
import { ALL_MAP_ITEMS, type TreasureSpot, type PickableItem } from './all-items';
import { ItemRenderer } from './item-renderer';
import { MAPS } from './maps';
import type { mat4 } from 'gl-matrix';

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]!);
}

export class ItemManager {
  private renderer: ItemRenderer;
  private activeSpots: TreasureSpot[] = [];
  private nearestSpot: TreasureSpot | null = null;
  private showItems = true;

  private promptEl: HTMLElement | null = null;
  private promptLabelEl: HTMLElement | null = null;
  private detailOverlayEl: HTMLElement | null = null;

  constructor(gl: WebGL2RenderingContext) {
    this.renderer = new ItemRenderer(gl);
    this.initUI();
    this.setupKeyBindings();
  }

  private initUI() {
    const stage = document.getElementById('explore-stage') ?? document.body;

    // 1. Proximity HUD Prompt
    let prompt = document.getElementById('loot-prompt-hud');
    if (!prompt) {
      prompt = document.createElement('div');
      prompt.id = 'loot-prompt-hud';
      prompt.className = 'loot-prompt-hud hidden';
      prompt.innerHTML = `
        <button id="btn-interact-loot" class="btn-interact-loot" type="button">
          <span class="interact-key">[E]</span>
          <i data-lucide="sparkles" class="interact-icon" id="loot-prompt-icon"></i>
          <span id="interact-label" class="interact-label">查看 掉落物</span>
        </button>
      `;
      stage.appendChild(prompt);
      prompt.querySelector('#btn-interact-loot')?.addEventListener('click', () => {
        if (this.nearestSpot) {
          this.showDetail(this.nearestSpot);
        }
      });
    }
    this.promptEl = prompt;
    this.promptLabelEl = prompt.querySelector('#interact-label');

    // 2. Item Detail Modal
    let detail = document.getElementById('item-detail-overlay');
    if (!detail) {
      detail = document.createElement('div');
      detail.id = 'item-detail-overlay';
      detail.className = 'item-detail-overlay hidden';
      detail.innerHTML = `
        <div class="item-detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
          <header class="item-detail-header">
            <div class="item-detail-title-wrap">
              <i data-lucide="sparkles" id="detail-header-icon" class="detail-header-icon"></i>
              <div class="detail-header-text">
                <h3 id="detail-title">物品详情</h3>
                <span id="detail-subtitle" class="detail-subtitle">多兰古雷格道具考据</span>
              </div>
            </div>
            <button id="detail-close-btn" class="btn-panel-close" aria-label="关闭详情">
              <i data-lucide="x"></i>
            </button>
          </header>
          <div class="item-detail-content" id="detail-content"></div>
        </div>
      `;
      stage.appendChild(detail);

      detail.querySelector('#detail-close-btn')?.addEventListener('click', () => {
        this.hideDetail();
      });

      detail.addEventListener('click', (e) => {
        if (e.target === detail) this.hideDetail();
      });
    }
    this.detailOverlayEl = detail;

    createIcons({
      icons: {
        Package,
        Sparkles,
        X,
        ChevronRight,
        BookOpen,
      },
    });
  }

  private setupKeyBindings() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'e' || e.key === 'E') {
        // If modal open, don't re-trigger
        if (this.isDetailOpen()) return;
        if (this.nearestSpot) {
          e.preventDefault();
          this.showDetail(this.nearestSpot);
        }
      } else if (e.key === 'Escape') {
        if (this.isDetailOpen()) {
          this.hideDetail();
        }
      }
    });
  }

  public setMaps(mapIds: string[]) {
    const list: TreasureSpot[] = [];
    for (const id of mapIds) {
      const spots = ALL_MAP_ITEMS[id];
      if (spots) {
        list.push(...spots);
      }
    }
    this.activeSpots = list;
    this.nearestSpot = null;
    this.updatePrompt(null);
  }

  public setVisibility(visible: boolean) {
    this.showItems = visible;
    if (!visible) {
      this.updatePrompt(null);
    }
  }

  public update(playerPos: [number, number, number]) {
    if (!this.showItems || this.activeSpots.length === 0) {
      if (this.nearestSpot) {
        this.nearestSpot = null;
        this.updatePrompt(null);
      }
      return;
    }

    let closest: TreasureSpot | null = null;
    let minDistanceSq = 3.2 * 3.2; // 3.2m interaction threshold

    for (let i = 0; i < this.activeSpots.length; i++) {
      const s = this.activeSpots[i];
      const dx = playerPos[0] - s.pos[0];
      const dy = playerPos[1] - s.pos[1];
      const dz = playerPos[2] - s.pos[2];
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < minDistanceSq) {
        minDistanceSq = distSq;
        closest = s;
      }
    }

    if (this.nearestSpot !== closest) {
      this.nearestSpot = closest;
      this.updatePrompt(closest);
    }
  }

  private updatePrompt(spot: TreasureSpot | null) {
    if (!this.promptEl) return;
    if (!spot) {
      this.promptEl.classList.add('hidden');
      return;
    }

    const firstItem = spot.items[0];
    const name = spot.items.length > 1
      ? `${firstItem?.name || '物品'} 等 ${spot.items.length} 件`
      : `${firstItem?.name || '拾取物'}${firstItem && firstItem.count > 1 ? ` ×${firstItem.count}` : ''}`;
    
    const typeLabel = spot.in_chest ? '宝箱' : '掉落物';
    if (this.promptLabelEl) {
      this.promptLabelEl.textContent = `查看 ${typeLabel} · [${name}]`;
    }

    const iconHost = this.promptEl.querySelector('#loot-prompt-icon');
    if (iconHost) {
      iconHost.setAttribute('data-lucide', spot.in_chest ? 'package' : 'sparkles');
      createIcons({ icons: { Package, Sparkles } });
    }

    this.promptEl.classList.remove('hidden');
  }

  public render(vp: mat4, cameraPos: [number, number, number], timeSeconds: number) {
    if (!this.showItems || this.activeSpots.length === 0) return;
    this.renderer.render(vp, cameraPos, timeSeconds, this.activeSpots);
  }

  public showDetail(spot: TreasureSpot) {
    if (!this.detailOverlayEl) return;
    const content = this.detailOverlayEl.querySelector('#detail-content');
    if (!content) return;

    const mapDef = MAPS.find((m) => m.id === spot.mapId);
    const mapName = mapDef?.name ?? spot.mapId;

    const subtitle = this.detailOverlayEl.querySelector('#detail-subtitle');
    if (subtitle) {
      subtitle.textContent = `${mapName} · ${spot.in_chest ? '宝箱发现' : '尸骸拾取'}`;
    }

    const icon = this.detailOverlayEl.querySelector('#detail-header-icon');
    if (icon) {
      icon.setAttribute('data-lucide', spot.in_chest ? 'package' : 'sparkles');
    }

    content.innerHTML = spot.items.map((it: PickableItem) => {
      const loreParagraphs = it.description
        ? it.description
            .split(/\n{2,}/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p) => `<p class="lore-p">${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`)
            .join('')
        : '';

      return `
        <article class="item-detail-card">
          <header class="item-card-row-head">
            <h4 class="item-detail-name">${escapeHtml(it.name)}</h4>
            <div class="item-detail-badges">
              ${it.count > 1 ? `<span class="detail-badge-count">×${it.count}</span>` : ''}
              <span class="detail-badge-cat">${escapeHtml(it.category)}</span>
              <span class="detail-badge-origin">${spot.in_chest ? '宝箱' : '场景拾取'}</span>
            </div>
          </header>

          ${it.summary ? `
            <div class="item-detail-summary">
              <span>${escapeHtml(it.summary)}</span>
            </div>
          ` : ''}

          ${loreParagraphs ? `
            <div class="item-detail-lore">
              <div class="lore-label">说明考据</div>
              <div class="lore-text">${loreParagraphs}</div>
            </div>
          ` : ''}
        </article>
      `;
    }).join('');

    createIcons({
      icons: {
        Package,
        Sparkles,
        X,
        ChevronRight,
        BookOpen,
      },
    });

    this.detailOverlayEl.classList.remove('hidden');
  }

  public hideDetail() {
    this.detailOverlayEl?.classList.add('hidden');
  }

  public isDetailOpen(): boolean {
    return Boolean(this.detailOverlayEl && !this.detailOverlayEl.classList.contains('hidden'));
  }

  public destroy() {
    this.renderer.destroy();
    this.promptEl?.remove();
    this.detailOverlayEl?.remove();
  }
}
