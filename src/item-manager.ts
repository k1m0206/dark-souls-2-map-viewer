import { createIcons, Package, Sparkles, X } from 'lucide';
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

    // 2. Item Detail Modal (Exact Soul 1 item modal replica)
    let detail = document.getElementById('item-detail-overlay');
    if (!detail) {
      detail = document.createElement('div');
      detail.id = 'item-detail-overlay';
      detail.className = 'npc-overlay hidden';
      detail.innerHTML = `
        <div class="npc-dialogue-box item-mode" role="dialog" aria-modal="true" aria-labelledby="npc-box-name">
          <div class="npc-header">
            <span class="npc-badge" id="npc-box-badge">ITEM</span>
            <span class="npc-name" id="npc-box-name"></span>
            <span class="npc-title" id="npc-box-title"></span>
            <span class="npc-stage-badge" id="npc-box-stage"></span>
            <button class="npc-header-close-btn" id="detail-close-btn" type="button" aria-label="关闭" title="关闭">
              <i data-lucide="x"></i>
            </button>
          </div>

          <div class="npc-tab-panel" id="npc-panel-items">
            <div class="npc-body" id="npc-box-items-body">
              <div class="item-pickup-dialog-content" id="detail-content"></div>
            </div>
          </div>
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

  public clearPrompt() {
    this.nearestSpot = null;
    this.promptEl?.classList.add('hidden');
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

  public render(vp: mat4, camera: mat4 | [number, number, number], timeSeconds: number) {
    if (!this.showItems || this.activeSpots.length === 0) return;
    this.renderer.render(vp, camera, timeSeconds, this.activeSpots);
  }

  public showDetail(spot: TreasureSpot) {
    if (!this.detailOverlayEl) return;
    const content = this.detailOverlayEl.querySelector('#detail-content');
    if (!content) return;

    const mapDef = MAPS.find((m) => m.id === spot.mapId);
    const mapName = mapDef?.name ?? spot.mapId;

    const badgeEl = this.detailOverlayEl.querySelector('#npc-box-badge') as HTMLElement | null;
    const nameEl = this.detailOverlayEl.querySelector('#npc-box-name');
    const titleEl = this.detailOverlayEl.querySelector('#npc-box-title');
    const stageEl = this.detailOverlayEl.querySelector('#npc-box-stage');

    if (badgeEl) {
      if (spot.in_chest) {
        badgeEl.textContent = 'CHEST';
        badgeEl.style.background = '#b58900';
        badgeEl.style.color = '#fff';
      } else {
        badgeEl.textContent = 'ITEM';
        badgeEl.style.background = '#0288d1';
        badgeEl.style.color = '#fff';
      }
    }

    const firstItem = spot.items[0];
    const mainTitle = spot.items.length > 1
      ? `同位置物品 · ${spot.items.length} 项`
      : (firstItem ? `${firstItem.name}${firstItem.count > 1 ? ` ×${firstItem.count}` : ''}` : '拾取物');

    if (nameEl) nameEl.textContent = mainTitle;
    if (titleEl) titleEl.textContent = `· ${mapName}`;
    if (stageEl) {
      stageEl.textContent = `[ ${spot.in_chest ? '宝箱藏物' : '战利品掉落'} · 共 ${spot.items.length} 项 ]`;
    }

    content.innerHTML = spot.items.map((it: PickableItem) => `
      <div class="item-pickup-card">
        <div class="item-pickup-head">
          <span class="item-pickup-icon">
            <i data-lucide="${spot.in_chest ? 'package' : 'sparkles'}"></i>
          </span>
          <div class="item-pickup-info">
            <strong class="item-pickup-name">${escapeHtml(it.name)}</strong>
            <div class="item-pickup-badges">
              <span class="item-badge-count">数量 ×${it.count}</span>
              <span class="item-badge-cat">${escapeHtml(it.category)}</span>
              <span class="item-badge-cat">${spot.in_chest ? '宝箱' : '地面掉落'}</span>
            </div>
          </div>
        </div>
        ${it.summary ? `<p class="item-pickup-desc">${escapeHtml(it.summary)}</p>` : ''}
        ${it.description.trim() ? `<details class="item-pickup-full-desc"><summary>查看道具详情</summary><p>${escapeHtml(it.description)}</p></details>` : ''}
      </div>
    `).join('');

    createIcons({
      icons: {
        Package,
        Sparkles,
        X,
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
