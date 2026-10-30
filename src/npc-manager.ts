import { createIcons, MessageSquare, ShoppingBag, Sparkles, Swords, Shield, Coins, Key, Package, X, ChevronLeft } from 'lucide';
import { KNOWN_NPCS, type NPCDefinition, type NPCDialogueItem } from './npc-data';
import merchantShopData from './merchant-shops.json';
import merchantDetailsData from './merchant-details.json';

type ShopGroup = '全部' | '道具' | '武器' | '防具' | '戒指' | '魔法' | '奇迹' | '咒术';
const SHOP_GROUPS: ShopGroup[] = ['全部', '道具', '武器', '防具', '戒指', '魔法', '奇迹', '咒术'];

interface NativeShopDetail {
  id: number;
  name: string;
  group: string;
  summary: string;
  description: string;
}

export interface NPCShopItem {
  name: string;
  category: string;
  price: number;
  quantity: number | null;
  original?: NativeShopDetail;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]!);
}

function getShopItemIconName(category: string): string {
  if (category === '武器') return 'swords';
  if (category === '防具') return 'shield';
  if (category === '戒指') return 'sparkles';
  if (category === '钥匙余烬' || category === '钥匙') return 'key';
  return 'package';
}

export class NPCManager {
  private activeNpcs: NPCDefinition[] = [];
  private nearestNpc: NPCDefinition | null = null;
  private currentOpenNpc: NPCDefinition | null = null;

  private currentDialogueIndex: number = 0;
  private activeTab: 'dialogue' | 'shop' = 'dialogue';
  private currentShopGroup: ShopGroup = '全部';
  private currentShopItemIndex: number = 0;
  private shopDetailOpen: boolean = false;

  private promptEl: HTMLElement | null = null;
  private promptLabelEl: HTMLElement | null = null;
  private modalEl: HTMLElement | null = null;

  constructor() {
    this.initUI();
    this.setupKeyBindings();
  }

  private initUI() {
    const stage = document.getElementById('explore-stage') ?? document.body;

    // 1. Proximity HUD Prompt
    let prompt = document.getElementById('npc-prompt-hud');
    if (!prompt) {
      prompt = document.createElement('div');
      prompt.id = 'npc-prompt-hud';
      prompt.className = 'loot-prompt-hud hidden';
      prompt.innerHTML = `
        <button id="btn-interact-npc" class="btn-interact-loot" type="button" style="border-color: rgba(82, 183, 136, 0.45);">
          <span class="interact-key">[E]</span>
          <i data-lucide="message-square" class="interact-icon" style="color: #52b788;"></i>
          <span id="npc-interact-label" class="interact-label">与 NPC 交谈</span>
        </button>
      `;
      stage.appendChild(prompt);
      prompt.querySelector('#btn-interact-npc')?.addEventListener('click', () => {
        if (this.nearestNpc) {
          this.showDialogue(this.nearestNpc);
        }
      });
    }
    this.promptEl = prompt;
    this.promptLabelEl = prompt.querySelector('#npc-interact-label');

    // 2. Dialogue & Merchant Shop Modal
    let modal = document.getElementById('npc-dialogue-overlay');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'npc-dialogue-overlay';
      modal.className = 'npc-overlay hidden';
      stage.appendChild(modal);
    }
    this.modalEl = modal;

    createIcons({
      icons: { MessageSquare, ShoppingBag, Sparkles, Swords, Shield, Coins, Key, Package, X, ChevronLeft },
    });
  }

  private setupKeyBindings() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'e' || e.key === 'E') {
        if (this.currentOpenNpc) {
          this.hideDialogue();
        } else if (this.nearestNpc) {
          this.showDialogue(this.nearestNpc);
        }
      } else if (e.key === 'Escape') {
        if (this.currentOpenNpc) {
          this.hideDialogue();
        }
      }
    });
  }

  public setMaps(loadedMapIds: string[]) {
    const mapSet = new Set(loadedMapIds);
    this.activeNpcs = KNOWN_NPCS.filter(npc => mapSet.has(npc.mapId));
    this.nearestNpc = null;
    this.updatePrompt();
  }

  public getActiveNpcs(): NPCDefinition[] {
    return this.activeNpcs;
  }

  public getNearestNpc(): NPCDefinition | null {
    return this.nearestNpc;
  }

  public update(playerPos: [number, number, number]) {
    let closest: NPCDefinition | null = null;
    let minDist = 3.2; // 3.2m interaction threshold

    for (const npc of this.activeNpcs) {
      const dx = playerPos[0] - npc.pos[0];
      const dz = playerPos[2] - npc.pos[2];
      const dist = Math.hypot(dx, dz);
      if (dist < minDist) {
        minDist = dist;
        closest = npc;
      }
    }

    if (this.nearestNpc !== closest) {
      this.nearestNpc = closest;
      this.updatePrompt();
    }
  }

  private updatePrompt() {
    if (!this.promptEl) return;
    if (this.nearestNpc && !this.currentOpenNpc) {
      if (this.promptLabelEl) {
        this.promptLabelEl.textContent = `与 ${this.nearestNpc.name} 交谈`;
      }
      this.promptEl.classList.remove('hidden');
      createIcons({
        icons: { MessageSquare },
        nameAttr: 'data-lucide',
      });
    } else {
      this.promptEl.classList.add('hidden');
    }
  }

  public getNpcShopItems(npcId: string): NPCShopItem[] {
    const shopData = merchantShopData as unknown as Record<string, [string, string, number, number | null][]>;
    let rawList = shopData[npcId];
    if (!rawList) {
      const baseKey = npcId.replace(/_[a-z0-9]+$/, '');
      rawList = shopData[baseKey];
    }
    if (!rawList || rawList.length === 0) return [];

    const details = merchantDetailsData as unknown as Record<string, NativeShopDetail>;
    return rawList.map(([name, cat, price, qty]) => {
      const detailKey = `${cat}:${name}`;
      return {
        name,
        category: cat,
        price,
        quantity: qty,
        original: details[detailKey],
      };
    });
  }

  public showDialogue(npc: NPCDefinition) {
    this.currentOpenNpc = npc;
    this.currentDialogueIndex = 0;
    this.activeTab = 'dialogue';
    this.currentShopGroup = '全部';
    this.currentShopItemIndex = 0;
    this.shopDetailOpen = false;

    this.renderModal();
    if (this.modalEl) {
      this.modalEl.classList.remove('hidden');
    }
    this.updatePrompt();
  }

  public hideDialogue() {
    this.currentOpenNpc = null;
    if (this.modalEl) {
      this.modalEl.classList.add('hidden');
    }
    this.updatePrompt();
  }

  private switchTab(tab: 'dialogue' | 'shop') {
    this.activeTab = tab;
    this.renderModal();
  }

  private renderModal() {
    if (!this.modalEl || !this.currentOpenNpc) return;

    const npc = this.currentOpenNpc;
    const shopItems = this.getNpcShopItems(npc.id);
    const hasShop = shopItems.length > 0;

    const dialogues = npc.dialogues || [];
    const currentDialogue: NPCDialogueItem | undefined = dialogues[this.currentDialogueIndex];

    const isShopMode = this.activeTab === 'shop';

    this.modalEl.innerHTML = `
      <div class="npc-dialogue-box ${isShopMode ? 'item-mode shop-mode' : 'item-mode'}" style="border-top: 3px solid ${npc.color};">
        <!-- 1. Header -->
        <div class="npc-header">
          <div class="npc-header-main">
            <span class="npc-badge" style="background: ${npc.color}22; color: ${npc.color}; border: 1px solid ${npc.color}55;">
              ${hasShop ? '商人 / NPC' : 'NPC'}
            </span>
            <div class="npc-header-title-block">
              <span class="npc-name">${escapeHtml(npc.name)}</span>
              <span class="npc-title">${escapeHtml(npc.title)}</span>
            </div>
          </div>
          <button id="npc-modal-close" class="npc-header-close-btn" type="button" aria-label="关闭">
            <i data-lucide="x"></i>
          </button>
        </div>

        <!-- 2. Tabs Bar -->
        <div class="npc-tabs-bar">
          <button id="tab-btn-dialogue" class="npc-tab-btn ${this.activeTab === 'dialogue' ? 'active' : ''}" type="button">
            <i data-lucide="message-square"></i>
            <span>交谈</span>
            ${dialogues.length > 1 ? `<span class="npc-tab-count">${this.currentDialogueIndex + 1}/${dialogues.length}</span>` : ''}
          </button>
          ${hasShop ? `
            <button id="tab-btn-shop" class="npc-tab-btn ${this.activeTab === 'shop' ? 'active' : ''}" type="button">
              <i data-lucide="shopping-bag"></i>
              <span>售卖</span>
              <span class="npc-tab-count">${shopItems.length}</span>
            </button>
          ` : ''}
        </div>

        <!-- 3. Tab Panel: Dialogue -->
        ${this.activeTab === 'dialogue' ? `
          <div id="npc-panel-dialogue" class="npc-body" style="padding: 10px 0;">
            ${dialogues.length > 1 ? `
              <div class="npc-dialogue-segments">
                ${dialogues.map((d, idx) => `
                  <button class="npc-segment-pill ${idx === this.currentDialogueIndex ? 'active' : ''}" data-idx="${idx}" type="button">
                    ${escapeHtml(d.stage)}
                  </button>
                `).join('')}
              </div>
            ` : ''}

            <div class="npc-dialogue-text-card" style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 16px; margin: 8px 0;">
              <div style="font-size: 11px; color: #8e826e; margin-bottom: 8px; font-weight: 500;">
                ${escapeHtml(currentDialogue?.stage || '交谈')}
              </div>
              <p style="margin: 0; color: #f0e6d2; font-size: 14px; line-height: 1.8; white-space: pre-line;">
                ${escapeHtml(currentDialogue?.text || '……')}
              </p>
            </div>

            ${dialogues.length > 1 ? `
              <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px;">
                <button id="npc-prev-dialogue" class="npc-tab-btn" ${this.currentDialogueIndex === 0 ? 'disabled style="opacity: 0.4;"' : ''} type="button">
                  上一句
                </button>
                <button id="npc-next-dialogue" class="npc-tab-btn" ${this.currentDialogueIndex === dialogues.length - 1 ? 'disabled style="opacity: 0.4;"' : ''} type="button">
                  下一句
                </button>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- 4. Tab Panel: Shop -->
        ${this.activeTab === 'shop' ? `
          <div id="npc-panel-shop" class="npc-shop-browser ${this.shopDetailOpen ? 'detail-open' : ''}">
            <!-- Category filter row -->
            <div class="npc-shop-categories">
              ${SHOP_GROUPS.map(g => {
                const count = g === '全部'
                  ? shopItems.length
                  : shopItems.filter(it => it.category === g || it.original?.group === g).length;
                if (g !== '全部' && count === 0) return '';
                return `
                  <button class="npc-shop-category ${this.currentShopGroup === g ? 'active' : ''}" data-group="${g}" type="button">
                    <span>${g}</span>
                    <span>(${count})</span>
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Content: Catalog & Detail -->
            ${this.renderShopContent(shopItems)}
          </div>
        ` : ''}
      </div>
    `;

    // Bind event listeners
    this.modalEl.querySelector('#npc-modal-close')?.addEventListener('click', () => {
      this.hideDialogue();
    });

    this.modalEl.querySelector('#tab-btn-dialogue')?.addEventListener('click', () => {
      this.switchTab('dialogue');
    });

    this.modalEl.querySelector('#tab-btn-shop')?.addEventListener('click', () => {
      this.switchTab('shop');
    });

    // Dialogue stage pill clicks
    this.modalEl.querySelectorAll('.npc-segment-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt((e.currentTarget as HTMLElement).dataset.idx || '0', 10);
        this.currentDialogueIndex = idx;
        this.renderModal();
      });
    });

    this.modalEl.querySelector('#npc-prev-dialogue')?.addEventListener('click', () => {
      if (this.currentDialogueIndex > 0) {
        this.currentDialogueIndex--;
        this.renderModal();
      }
    });

    this.modalEl.querySelector('#npc-next-dialogue')?.addEventListener('click', () => {
      if (this.currentDialogueIndex < dialogues.length - 1) {
        this.currentDialogueIndex++;
        this.renderModal();
      }
    });

    // Shop category filter clicks
    this.modalEl.querySelectorAll('.npc-shop-category').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentShopGroup = (e.currentTarget as HTMLElement).dataset.group as ShopGroup;
        this.currentShopItemIndex = 0;
        this.shopDetailOpen = false;
        this.renderModal();
      });
    });

    // Shop item card selection clicks
    this.modalEl.querySelectorAll('.npc-shop-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const idx = parseInt((e.currentTarget as HTMLElement).dataset.idx || '0', 10);
        this.currentShopItemIndex = idx;
        this.shopDetailOpen = true;
        this.renderModal();
      });
    });

    this.modalEl.querySelector('#npc-shop-back-btn')?.addEventListener('click', () => {
      this.shopDetailOpen = false;
      this.renderModal();
    });

    createIcons({
      icons: { MessageSquare, ShoppingBag, Sparkles, Swords, Shield, Coins, Key, Package, X, ChevronLeft },
      nameAttr: 'data-lucide',
    });
  }

  private renderShopContent(shopItems: NPCShopItem[]): string {
    const filtered = this.currentShopGroup === '全部'
      ? shopItems
      : shopItems.filter(it => it.category === this.currentShopGroup || it.original?.group === this.currentShopGroup);

    if (filtered.length === 0) {
      return `
        <div style="padding: 30px; text-align: center; color: #8e826e;">
          该分类下无在售商品
        </div>
      `;
    }

    const selectedItem = filtered[Math.min(this.currentShopItemIndex, filtered.length - 1)];

    return `
      <div class="npc-shop-content">
        <!-- Left: Item Catalog List -->
        <div class="npc-shop-catalog">
          ${filtered.map((item, idx) => {
            const isSelected = item === selectedItem;
            const iconName = getShopItemIconName(item.category);
            return `
              <div class="npc-shop-card ${isSelected ? 'active' : ''}" data-idx="${idx}">
                <div class="npc-shop-card-heading">
                  <div class="npc-shop-card-icon">
                    <i data-lucide="${iconName}"></i>
                  </div>
                  <div class="npc-shop-item-info">
                    <strong>${escapeHtml(item.name)}</strong>
                    <small>${escapeHtml(item.category)}</small>
                  </div>
                </div>

                ${item.original?.summary ? `
                  <div class="npc-shop-card-summary">
                    ${escapeHtml(item.original.summary)}
                  </div>
                ` : ''}

                <div class="npc-shop-card-footer">
                  <span class="npc-shop-price">
                    ${item.price > 0 ? `💎 ${item.price.toLocaleString()}` : '免费'}
                    <small>灵魂</small>
                  </span>
                  <span class="npc-shop-stock">
                    ${item.quantity !== null ? `库存: ${item.quantity}` : '无限'}
                  </span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Right: Item Detail View -->
        <div class="npc-shop-detail">
          <button id="npc-shop-back-btn" class="npc-tab-btn npc-shop-back" type="button" style="margin-bottom: 12px;">
            <i data-lucide="chevron-left"></i>
            <span>返回列表</span>
          </button>

          <div class="npc-shop-detail-eyebrow">
            <span>${escapeHtml(selectedItem.original?.group || selectedItem.category)}</span>
            <span>ID: ${selectedItem.original?.id || '---'}</span>
          </div>

          <h3>${escapeHtml(selectedItem.name)}</h3>

          <div class="npc-shop-detail-tags">
            <span>${escapeHtml(selectedItem.category)}</span>
            ${selectedItem.quantity !== null ? `<span>库存限制: ${selectedItem.quantity}</span>` : '<span>无限库存</span>'}
          </div>

          <div class="npc-shop-detail-trade">
            <div>
              <small>购买价格</small>
              <strong>${selectedItem.price > 0 ? `💎 ${selectedItem.price.toLocaleString()} 灵魂` : '免费赠予'}</strong>
            </div>
            <div>
              <small>库存状态</small>
              <strong>${selectedItem.quantity !== null ? `${selectedItem.quantity} 件` : '无限供应'}</strong>
            </div>
          </div>

          ${selectedItem.original?.summary ? `
            <div class="npc-shop-summary">
              ${escapeHtml(selectedItem.original.summary)}
            </div>
          ` : ''}

          <div class="npc-shop-description">
            <span>说明与由来</span>
            <p>${escapeHtml(selectedItem.original?.description || '暂无详细描述记录。')}</p>
          </div>
        </div>
      </div>
    `;
  }
}
