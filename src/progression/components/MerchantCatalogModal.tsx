import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Search, 
  ShoppingBag, 
  Sparkles, 
  Flame, 
  MapPin, 
  Coins, 
  Scroll, 
  ShieldAlert, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  Filter,
  Info
} from 'lucide-react';
import { 
  DRANGLEIC_MERCHANTS, 
  MERCHANT_CATEGORY_CONFIG, 
  searchMerchantItems 
} from '../data/merchantData';
import { MerchantItemCategory, MerchantItem, MerchantNPC } from '../types/souls';

interface MerchantCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMap: (mapId: string) => void;
  initialSearchQuery?: string;
}

export const MerchantCatalogModal: React.FC<MerchantCatalogModalProps> = ({
  isOpen,
  onClose,
  onNavigateToMap,
  initialSearchQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<MerchantItemCategory | 'all'>('all');
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('all');

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered merchants and goods
  const filteredMerchants = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return DRANGLEIC_MERCHANTS.map(merchant => {
      // Filter items within this merchant
      const matchingItems = merchant.items.filter(item => {
        // Category check
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // Search text check
        if (!query) return true;

        const matchName = item.name.toLowerCase().includes(query);
        const matchNameEn = item.nameEn?.toLowerCase().includes(query) ?? false;
        const matchNotes = item.notes?.toLowerCase().includes(query) ?? false;
        const matchReq = item.requirement?.toLowerCase().includes(query) ?? false;
        const matchCategory = MERCHANT_CATEGORY_CONFIG[item.category]?.label.toLowerCase().includes(query) ?? false;
        const matchMerchant = merchant.name.toLowerCase().includes(query) || merchant.roleLabel.toLowerCase().includes(query);

        return matchName || matchNameEn || matchNotes || matchReq || matchCategory || matchMerchant;
      });

      return {
        ...merchant,
        filteredItems: matchingItems,
      };
    }).filter(merchant => {
      // If merchant filter selected
      if (selectedMerchantId !== 'all' && merchant.id !== selectedMerchantId) {
        return false;
      }
      return merchant.filteredItems.length > 0;
    });
  }, [searchQuery, selectedCategory, selectedMerchantId]);

  const totalMatchingItems = useMemo(() => {
    return filteredMerchants.reduce((sum, m) => sum + m.filteredItems.length, 0);
  }, [filteredMerchants]);

  if (!isOpen) return null;

  const categories: { id: MerchantItemCategory | 'all'; label: string; count?: number }[] = [
    { id: 'all', label: '全部' },
    { id: 'magic', label: '魔法 (法师)' },
    { id: 'hex', label: '暗术 (暗术士)' },
    { id: 'miracle', label: '奇迹 (圣职)' },
    { id: 'pyromancy', label: '咒术' },
    { id: 'weapon_shield', label: '武器/盾牌' },
    { id: 'armor', label: '防具/套装' },
    { id: 'ring', label: '戒指' },
    { id: 'key_item', label: '关键道具' },
    { id: 'consumable', label: '素材/药水' },
  ];

  const quickSearchTags = [
    '思乡', '暗珠', '银猫戒指', '刺剑', '怀念香木', '将熄余烬', 
    '月光大剑', '扭曲之刃', '封印太阳', '阳光之剑', '雷枪', '盖多勒套装'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-5xl bg-[#11131c] border border-[#4a3e2e] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden text-stone-200">
        
        {/* Top Header */}
        <div className="p-3.5 sm:p-5 border-b border-stone-800 bg-gradient-to-r from-[#171a26] via-[#141724] to-[#0f111a] flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-950/80 border border-amber-500/70 flex items-center justify-center glow-ember shrink-0">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-cinzel text-amber-200">
                  多兰古雷格全商人与法术图鉴
                </h2>
                <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-600/60 text-amber-300">
                  共 {totalMatchingItems} 项物品
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-400">
                支持搜索全部法术、暗术、奇迹、咒术、Boss魂武器及关键道具商人
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors shrink-0"
            aria-label="关闭图鉴"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Quick Tags */}
        <div className="p-3 sm:p-4 border-b border-stone-800/80 bg-[#0e1017] space-y-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索法术、武器、戒指、商人名字（如：思乡、暗珠、银猫、卡莉希欧、月光大剑）..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-black/60 border border-stone-700 rounded-xl text-xs sm:text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Merchant Dropdown Select */}
            <select
              value={selectedMerchantId}
              onChange={(e) => setSelectedMerchantId(e.target.value)}
              className="hidden sm:block px-3 py-2 bg-black/60 border border-stone-700 rounded-xl text-xs sm:text-sm text-stone-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">全部NPC商人 ({DRANGLEIC_MERCHANTS.length} 位)</option>
              {DRANGLEIC_MERCHANTS.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.roleLabel})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Filter Tag Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            <span className="text-stone-500 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              热门搜索:
            </span>
            {quickSearchTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className={`px-2 py-0.5 rounded-lg border shrink-0 transition-colors ${
                  searchQuery === tag
                    ? 'bg-amber-900/60 border-amber-500 text-amber-200'
                    : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-xl font-medium border shrink-0 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-950 border-amber-500 text-amber-200 shadow-sm shadow-amber-950'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Goods List Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-6">
          {filteredMerchants.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <ShoppingBag className="w-12 h-12 text-stone-600 mx-auto" />
              <p className="text-base font-semibold text-stone-400">未找到符合条件的商人或物品</p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                尝试更换关键词（如搜「法术」、「暗珠」、「戒指」）或清除筛选分类
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedMerchantId('all');
                }}
                className="px-4 py-1.5 rounded-xl bg-amber-950/60 border border-amber-600/70 text-xs text-amber-300 hover:bg-amber-900/60 transition-colors"
              >
                清空所有筛选
              </button>
            </div>
          ) : (
            filteredMerchants.map(merchant => (
              <div 
                key={merchant.id}
                className="rounded-xl sm:rounded-2xl bg-[#141724]/90 border border-stone-800/90 overflow-hidden shadow-lg"
              >
                {/* Merchant Header */}
                <div className="p-3 sm:p-4 bg-gradient-to-r from-stone-900/90 via-[#171a27] to-stone-900/80 border-b border-stone-800/80 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-black/60 border border-amber-700/60 flex items-center justify-center shrink-0">
                      <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm sm:text-base text-stone-100 font-cinzel">
                          {merchant.name}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-700/60 text-amber-300 font-medium">
                          {merchant.roleLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                        <span>{merchant.locationName}</span>
                      </p>
                    </div>
                  </div>

                  {/* Jump to Map button */}
                  <button
                    onClick={() => {
                      onNavigateToMap(merchant.locationMapId);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 border border-amber-600/60 text-amber-200 text-xs font-medium transition-all active:scale-95 shrink-0"
                    title={`前往 ${merchant.locationName}`}
                  >
                    <span>定位地图</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>

                {/* Pre-requisite condition if exists */}
                {merchant.condition && (
                  <div className="px-3 sm:px-4 py-2 bg-amber-950/20 border-b border-amber-900/30 flex items-center gap-2 text-[11px] sm:text-xs text-amber-300/90">
                    <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><strong className="text-amber-200">交互条件：</strong>{merchant.condition}</span>
                  </div>
                )}

                {/* Merchant Items Grid */}
                <div className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                  {merchant.filteredItems.map(item => {
                    const catConfig = MERCHANT_CATEGORY_CONFIG[item.category];

                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border flex flex-col justify-between gap-2 transition-all ${
                          item.isKeyMustBuy
                            ? 'bg-[#1b1c2b]/95 border-amber-500/50 shadow-sm shadow-amber-950/30'
                            : 'bg-black/40 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div>
                          {/* Item Name & Badges */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="font-bold text-xs sm:text-sm text-stone-100">
                                  {item.name}
                                </h4>
                                {item.isKeyMustBuy && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-900/80 border border-amber-500 text-amber-200 font-bold shrink-0">
                                    推荐必买
                                  </span>
                                )}
                                {item.isBossTransposition && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950/80 border border-purple-500 text-purple-200 font-semibold shrink-0">
                                    Boss魂兑换
                                  </span>
                                )}
                              </div>
                              {item.nameEn && (
                                <p className="text-[10px] font-mono text-stone-500">
                                  {item.nameEn}
                                </p>
                              )}
                            </div>

                            <span className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 font-medium ${catConfig.badgeColor}`}>
                              {catConfig.label}
                            </span>
                          </div>

                          {/* Notes / Advice */}
                          {item.notes && (
                            <p className="text-[11px] text-stone-300 mt-1.5 leading-relaxed bg-black/40 p-1.5 rounded-lg border border-stone-800/80">
                              {item.notes}
                            </p>
                          )}
                        </div>

                        {/* Bottom Row: Requirements & Cost */}
                        <div className="pt-2 border-t border-stone-800/70 flex flex-wrap items-center justify-between gap-1 text-[11px]">
                          {item.requirement ? (
                            <span className="font-mono text-amber-400/90 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/50">
                              要求: {item.requirement}
                            </span>
                          ) : (
                            <span className="text-stone-500 font-mono">数量: {item.quantity}</span>
                          )}

                          <div className="flex items-center gap-1 text-amber-300 font-mono font-bold shrink-0">
                            <Coins className="w-3 h-3 text-amber-400" />
                            <span>{item.price}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-stone-800 bg-[#0f111a] flex items-center justify-between text-xs text-stone-400 shrink-0">
          <span className="text-[11px] text-stone-400">
            原罪学者版本全商人数据 • 涵盖全流派法术与神兵
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors"
          >
            关闭
          </button>
        </div>

      </div>
    </div>
  );
};
