import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Menu, 
  Search, 
  RotateCcw, 
  Flame, 
  CheckSquare, 
  X, 
  ShoppingBag, 
  MapPin, 
  Sparkles, 
  Coins, 
  ArrowRight,
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import { RouteFilterType } from '../utils/progressionLogic';
import { NPCId } from '../types/souls';
import { searchMerchantItems, MERCHANT_CATEGORY_CONFIG } from '../data/merchantData';
import { MAP_NODES } from '../data/soulsData';

interface HeaderProps {
  routeFilter: RouteFilterType;
  onSelectRouteFilter: (filter: RouteFilterType) => void;
  npcFilter: NPCId | 'all';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenMenu: () => void;
  onResetView: () => void;
  completionPercentage: number;
  isSpoilerProtectionOn: boolean;
  onSelectMapNode?: (mapId: string) => void;
  onOpenMerchantCatalog?: () => void;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  routeFilter,
  onSelectRouteFilter,
  npcFilter,
  searchQuery,
  onSearchChange,
  onOpenMenu,
  onResetView,
  completionPercentage,
  isSpoilerProtectionOn,
  onSelectMapNode,
  onOpenMerchantCatalog,
  onBack,
}) => {
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const isFiltered = routeFilter !== 'all' || npcFilter !== 'all' || searchQuery.trim().length > 0;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Matching merchant wares & spells
  const matchedMerchantItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchMerchantItems(searchQuery).slice(0, 5);
  }, [searchQuery]);

  // Matching map locations
  const matchedMaps = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return MAP_NODES.filter(m => m.name.toLowerCase().includes(q) || m.nameEn.toLowerCase().includes(q)).slice(0, 3);
  }, [searchQuery]);

  const getRouteLabel = (filter: RouteFilterType) => {
    switch (filter) {
      case 'golden_path': return '推荐流程';
      case 'four_souls': return '始源四巨魂';
      case 'endings': return '结局分支';
      case 'dlc': return 'DLC三部曲';
      default: return '全部地图';
    }
  };

  return (
    <header 
      className="sticky top-0 z-40 bg-[#0e1017]/95 backdrop-blur-md border-b border-[#3b352b] py-1.5 sm:py-2 shadow-xl shrink-0 w-full"
      style={{
        paddingLeft: 'max(0.6rem, var(--safe-left, 0px))',
        paddingRight: 'max(0.6rem, var(--safe-right, 0px))',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3 w-full">
        
        {/* Left: Brand Identity & Back Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-amber-600/70 bg-gradient-to-r from-stone-900 to-amber-950/80 hover:border-amber-400 text-amber-200 hover:text-amber-100 text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer shadow-md active:scale-95"
              title="返回"
              aria-label="返回"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>返回</span>
            </button>
          )}
          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-700/50 via-orange-950/70 to-black border border-amber-500/60 shadow-inner glow-ember shrink-0">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h1 className="text-xs sm:text-sm md:text-base font-bold font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 tracking-wide whitespace-nowrap">
                <span className="inline sm:hidden">全流程攻略</span>
                <span className="hidden sm:inline">全流程全探索互动攻略</span>
              </h1>
            </div>
            <p className="text-[10px] text-stone-400 hidden lg:block">
              原罪学者（PC DX11 / PS4 / Xbox One）• 主线、支线与DLC
            </p>
          </div>
        </div>

        {/* Center: Search Input & Results Dropdown */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-[140px] sm:max-w-xs md:max-w-sm min-w-[75px]">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="搜索法术/物品/地图..."
            value={searchQuery}
            onFocus={() => setIsSearchDropdownOpen(true)}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsSearchDropdownOpen(true);
            }}
            className="w-full pl-7 pr-6 py-1 sm:py-1.5 bg-black/60 border border-stone-700 rounded-lg sm:rounded-xl text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => {
                onSearchChange('');
                setIsSearchDropdownOpen(false);
              }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 p-0.5"
              title="清空搜索"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Intelligent Live Search Dropdown */}
          {isSearchDropdownOpen && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#12141e] border border-[#4a3f32] rounded-xl shadow-2xl p-2 z-50 text-xs text-stone-200 max-h-[70vh] overflow-y-auto space-y-2.5 min-w-[280px] sm:min-w-[340px]">
              
              {/* Matched Merchant Wares & Spells */}
              {matchedMerchantItems.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-mono text-amber-400/90 font-semibold px-1 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3 text-amber-400" />
                      商人售卖法术与物品 ({matchedMerchantItems.length})
                    </span>
                  </div>
                  <div className="space-y-1">
                    {matchedMerchantItems.map(({ item, merchant }) => {
                      const catBadge = MERCHANT_CATEGORY_CONFIG[item.category];
                      return (
                        <div
                          key={`${merchant.id}-${item.id}`}
                          onClick={() => {
                            if (onSelectMapNode) {
                              onSelectMapNode(merchant.locationMapId);
                            }
                            setIsSearchDropdownOpen(false);
                          }}
                          className="p-1.5 rounded-lg bg-black/40 hover:bg-amber-950/40 border border-stone-800/80 hover:border-amber-600/70 cursor-pointer transition-all flex items-start justify-between gap-1.5 group"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-stone-100 group-hover:text-amber-200 truncate">
                                {item.name}
                              </span>
                              <span className={`text-[9px] px-1 py-0.2 rounded border ${catBadge.badgeColor}`}>
                                {catBadge.label}
                              </span>
                            </div>
                            <p className="text-[10px] text-stone-400 truncate mt-0.5 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5 text-stone-500" />
                              <span>{merchant.name} • {merchant.locationName}</span>
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[11px] font-mono font-bold text-amber-300">
                              {item.price}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Matched Maps */}
              {matchedMaps.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-mono text-cyan-400/90 font-semibold px-1 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    匹配地图节点 ({matchedMaps.length})
                  </div>
                  <div className="space-y-1">
                    {matchedMaps.map(m => (
                      <div
                        key={m.id}
                        onClick={() => {
                          if (onSelectMapNode) {
                            onSelectMapNode(m.id);
                          }
                          setIsSearchDropdownOpen(false);
                        }}
                        className="p-1.5 rounded-lg bg-black/40 hover:bg-cyan-950/40 border border-stone-800 hover:border-cyan-600/70 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <span className="font-semibold text-stone-200">{m.name}</span>
                        <span className="text-[10px] font-mono text-stone-500">{m.branchName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Jump to Full Merchant Catalog */}
              {onOpenMerchantCatalog && (
                <div className="pt-1.5 border-t border-stone-800">
                  <button
                    onClick={() => {
                      onOpenMerchantCatalog();
                      setIsSearchDropdownOpen(false);
                    }}
                    className="w-full py-1.5 px-2 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 border border-amber-600/60 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>查看全部18位商人与法术全书</span>
                    <ArrowRight className="w-3 h-3 text-amber-400" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions & Menu Button */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Active Filter badge (if filter active, desktop only) */}
          {routeFilter !== 'all' && (
            <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-600/70 text-[11px] text-amber-300">
              <span>{getRouteLabel(routeFilter)}</span>
              <button 
                onClick={() => onSelectRouteFilter('all')}
                className="hover:text-amber-100 ml-0.5"
                title="清除筛选"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Progress summary badge */}
          <div 
            className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg bg-stone-900/80 border border-stone-800 text-[11px] sm:text-xs text-stone-300 shrink-0"
            title="总探索进度"
          >
            <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-amber-400 font-bold">{completionPercentage}%</span>
          </div>

          {/* Reset Camera View button */}
          <button
            onClick={onResetView}
            className="hidden sm:flex p-1.5 rounded-lg border border-stone-800 bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors shrink-0"
            title="重置视角至起点"
            aria-label="重置视角"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Dedicated Menu Bar Trigger Button (Always visible on all screens!) */}
          <button
            onClick={onOpenMenu}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 shrink-0 ${
              isFiltered
                ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-amber-950/50'
                : 'bg-gradient-to-r from-amber-700/40 to-amber-900/50 border-amber-600/80 text-amber-200 hover:bg-amber-900/70 hover:border-amber-400'
            }`}
          >
            <Menu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>菜单</span>
            {isFiltered && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
