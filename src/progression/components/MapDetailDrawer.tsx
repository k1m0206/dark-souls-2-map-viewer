import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  CheckSquare, 
  Square, 
  Skull, 
  Sparkles, 
  Key, 
  Users, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Sword,
  Info,
  CheckCircle2,
  ExternalLink,
  Scale,
  MapPin,
  BookOpen
} from 'lucide-react';
import { MapNode, UserProgress } from '../types/souls';
import { SpoilerText } from './SpoilerText';

interface MapDetailDrawerProps {
  node: MapNode | null;
  allNodes: MapNode[];
  onClose: () => void;
  userProgress: UserProgress;
  onToggleChecklist: (taskId: string) => void;
  onToggleBoss: (bossId: string) => void;
  onToggleItem: (itemId: string) => void;
  onToggleMapComplete: (mapId: string) => void;
  onNavigateToNode: (nodeId: string) => void;
  isSpoilerProtectionOn?: boolean;
}

export const MapDetailDrawer: React.FC<MapDetailDrawerProps> = ({
  node,
  allNodes,
  onClose,
  userProgress,
  onToggleChecklist,
  onToggleBoss,
  onToggleItem,
  onToggleMapComplete,
  onNavigateToNode,
  isSpoilerProtectionOn = true,
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'bosses' | 'items' | 'npc' | 'tricks' | 'choices'>('checklist');

  if (!node) return null;

  const isMapCompleted = userProgress.completedMaps.includes(node.id);
  const completedTaskCount = node.checklists.filter(c => userProgress.completedChecklists.includes(c.id)).length;
  const progressPercent = node.checklists.length > 0 
    ? Math.round((completedTaskCount / node.checklists.length) * 100) 
    : 100;

  return (
    <div className="fixed top-0 sm:top-[61px] bottom-0 right-0 z-40 w-full sm:max-w-xl landscape:max-w-md landscape:text-xs bg-stone-950 border-l border-stone-800 shadow-2xl flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-3 sm:p-5 landscape:p-2 border-b border-stone-800 bg-stone-900 shrink-0">
        <div className="flex items-center justify-between mb-1 landscape:mb-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] sm:text-xs uppercase font-mono px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-stone-300">
              {node.stageName} • {node.branchName}
            </span>
            <span className="text-[10px] sm:text-xs text-stone-400 font-mono">
              SL {node.levelRecommendation.replace('SL ', '')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            aria-label="关闭侧边栏"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-2xl landscape:text-base font-bold font-cinzel text-stone-100">
              {node.name}
            </h2>
            <div className="text-[10px] sm:text-xs text-stone-400 font-serif italic landscape:hidden">
              {node.nameEn}
            </div>
          </div>

          {/* Mark Map Complete Button */}
          <button
            onClick={() => onToggleMapComplete(node.id)}
            className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold border transition-all shrink-0 ${
              isMapCompleted
                ? 'bg-stone-800 border-stone-700 text-stone-300'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isMapCompleted ? 'text-emerald-500/90' : 'text-stone-500'}`} />
            <span>{isMapCompleted ? '已探索' : '标记探索'}</span>
          </button>
        </div>

        {/* Lore Quote (hidden in landscape to save critical vertical space) */}
        <div className="text-[11px] sm:text-xs text-stone-300 bg-stone-950/40 border-l-2 border-amber-700/60 px-2.5 py-1 rounded-r italic my-1.5 landscape:hidden landscape-hide">
          {node.lore}
        </div>

        {/* Progress Bar within this map */}
        <div className="mt-1.5 landscape:mt-1 flex items-center justify-between text-[10px] sm:text-xs text-stone-400">
          <span>完成度: {completedTaskCount}/{node.checklists.length}</span>
          <span className="font-mono text-stone-300 font-semibold">{progressPercent}%</span>
        </div>
        <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden mt-0.5">
          <div
            className="h-full bg-amber-600/80 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mt-2.5 landscape:mt-1.5 pt-1.5 border-t border-stone-800/80 overflow-x-auto text-[11px] sm:text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'checklist'
                ? 'bg-stone-800 border border-amber-700/60 text-amber-200 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-stone-400" />
            <span>流程清单 ({node.checklists.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bosses')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'bosses'
                ? 'bg-stone-800 border border-amber-700/60 text-amber-200 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <Skull className="w-3.5 h-3.5 text-stone-400" />
            <span>首领打法 ({node.bosses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('items')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'items'
                ? 'bg-stone-800 border border-amber-700/60 text-amber-200 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-400" />
            <span>重要收集 ({node.keyItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('npc')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'npc'
                ? 'bg-stone-800 border border-amber-700/60 text-amber-200 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-stone-400" />
            <span>NPC支线 ({node.npcInteractions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tricks')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'tricks'
                ? 'bg-stone-800 border border-amber-700/60 text-amber-200 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-stone-400" />
            <span>机制与近道</span>
          </button>

          {node.choices && node.choices.length > 0 && (
            <button
              onClick={() => setActiveTab('choices')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all shrink-0 ${
                activeTab === 'choices'
                  ? 'bg-stone-800 border border-amber-700/60 text-amber-200 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-stone-400" />
              <span>抉择与后果 ({node.choices.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Drawer Body - Scrollable content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* TAB 1: CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="space-y-3">
            <div className="text-xs text-stone-400 mb-2">
              点击方框可勾选保存你的推图进度，数据自动保存在本地浏览器中：
            </div>
            {node.checklists.map((item) => {
              const isChecked = userProgress.completedChecklists.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => onToggleChecklist(item.id)}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-stone-900/30 border-stone-800/60 text-stone-400'
                      : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 text-stone-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600/70" />
                    ) : (
                      <Square className="w-4 h-4 text-stone-500" />
                    )}
                  </div>
                  <div className="flex-1 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        item.category === 'essential'
                          ? 'bg-amber-950/30 border border-amber-800/40 text-amber-300/90'
                          : 'bg-stone-800/80 border border-stone-700/80 text-stone-300'
                      }`}>
                        {item.category === 'essential' ? '核心主线' :
                         item.category === 'boss' ? '首领讨伐' :
                         item.category === 'npc' ? 'NPC支线' :
                         item.category === 'secret' ? '隐藏近道' : '宝物收集'}
                      </span>
                    </div>
                    <p className={`leading-relaxed ${isChecked ? 'line-through text-stone-500' : ''}`}>
                      {item.task}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: BOSSES */}
        {activeTab === 'bosses' && (
          <div className="space-y-4">
            {node.bosses.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-sm">
                此地图无首领战，属于安全据点或中继通道。
              </div>
            ) : (
              node.bosses.map(boss => {
                const isDefeated = userProgress.defeatedBosses.includes(boss.id);
                return (
                  <div
                    key={boss.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isDefeated
                        ? 'bg-stone-900/40 border-stone-800/60'
                        : boss.isGreatSoul
                        ? 'bg-stone-900/80 border-amber-800/50 shadow-md'
                        : 'bg-stone-900/60 border-stone-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-stone-100 font-cinzel text-base flex items-center gap-1.5">
                            <Skull className={`w-4 h-4 ${boss.isGreatSoul ? 'text-amber-400' : 'text-stone-400'}`} />
                            <span>{boss.name}</span>
                          </h4>
                          {boss.isGreatSoul && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800/50 text-amber-300/90 font-medium">
                              始源古魂
                            </span>
                          )}
                          {boss.isOptional && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-stone-400">
                              可选
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-stone-400 font-serif italic">
                          {boss.nameEn}
                        </div>
                      </div>

                      {/* Defeated Toggle */}
                      <button
                        onClick={() => onToggleBoss(boss.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs border font-medium transition-colors ${
                          isDefeated
                            ? 'bg-stone-800 border-stone-700 text-stone-300'
                            : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isDefeated ? 'text-emerald-500/90' : 'text-stone-500'}`} />
                        <span>{isDefeated ? '已击败' : '标记击破'}</span>
                      </button>
                    </div>

                    {/* Boss Strategy Tips */}
                    <div className="text-xs text-stone-300 bg-black/30 p-2.5 rounded-lg border border-stone-800/80 mb-2 leading-relaxed">
                      <span className="text-stone-300 font-semibold flex items-center gap-1 mb-1">
                        <Sword className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>攻略破法：</span>
                      </span>
                      {boss.tips}
                    </div>

                    {/* Transpose Weapon */}
                    <div className="text-xs text-stone-400 flex items-center gap-1.5">
                      <Sword className="w-3.5 h-3.5 text-stone-500" />
                      <span>灵魂炼化神兵:</span>
                      <span className="text-stone-300 font-mono">{boss.transposeWeapon}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 3: KEY ITEMS */}
        {activeTab === 'items' && (
          <div className="space-y-3">
            {node.keyItems.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-sm">
                暂无特殊关键道具记录。
              </div>
            ) : (
              node.keyItems.map(item => {
                const isObtained = userProgress.obtainedItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => onToggleItem(item.id)}
                    className={`p-3 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition-all ${
                      isObtained
                        ? 'bg-stone-900/40 border-stone-800 text-stone-400'
                        : 'bg-stone-900/70 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-stone-800/80 border border-stone-700/60 shrink-0">
                        {item.type === 'estus_shard' || item.type === 'sublime_bone_dust' ? (
                          <Sparkles className="w-3.5 h-3.5 text-amber-400/90" />
                        ) : (
                          <Key className="w-3.5 h-3.5 text-stone-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-stone-100 flex items-center gap-2">
                          <span>{item.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-800/80 text-stone-400 border border-stone-700/60">
                            {item.type === 'estus_shard' ? '原素碎片' :
                             item.type === 'sublime_bone_dust' ? '贵人骨灰' :
                             item.type === 'fragrant_branch' ? '怀念香木' : '关键剧情道具'}
                          </span>
                        </div>
                        <div className="text-xs text-stone-400 mt-1 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                          <span>获取位置: {item.location}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                        isObtained
                          ? 'bg-stone-800 border-stone-700 text-stone-300'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {isObtained ? '已拾取' : '未拾取'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 4: NPC INTERACTIONS */}
        {activeTab === 'npc' && (
          <div className="space-y-4">
            {node.npcInteractions.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-sm">
                该地图无核心NPC关键支线事件。
              </div>
            ) : (
              node.npcInteractions.map((npc, idx) => (
                <div
                  key={`${npc.npcId}-${idx}`}
                  className="p-4 rounded-xl border border-stone-800 bg-stone-900/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                      <Users className="w-4 h-4 text-stone-400" />
                      <span>{npc.npcName}</span>
                    </h4>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-800 border border-stone-700 text-stone-400">
                      步骤 {npc.stepNumber} / {npc.totalSteps}
                    </span>
                  </div>

                  <p className="text-xs text-stone-200 leading-relaxed bg-stone-950/40 p-2.5 rounded-lg border border-stone-800/80">
                    {npc.actionRequired}
                  </p>

                  {npc.warning && (
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-rose-950/20 border border-rose-900/40 text-xs text-rose-300/90">
                      <AlertTriangle className="w-4 h-4 text-rose-400/90 shrink-0 mt-0.5" />
                      <span>{npc.warning}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 5: TRICKS & TRAPS */}
        {activeTab === 'tricks' && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-stone-400" />
              <span>推图机关、陷阱逃生与特别捷径</span>
            </h4>
            {node.trapsAndTricks.map((trick, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-stone-800 bg-stone-900/60 text-xs text-stone-300 flex items-start gap-2.5 leading-relaxed"
              >
                <AlertTriangle className="w-4 h-4 text-amber-500/80 shrink-0 mt-0.5" />
                <span>{trick}</span>
              </div>
            ))}

            {/* Outgoing Connections */}
            <div className="pt-4 border-t border-stone-800">
              <h5 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                后续通往地图与解锁条件
              </h5>
              <div className="space-y-2">
                {node.connectionsTo.map((conn, idx) => {
                  const targetMap = allNodes.find(n => n.id === conn.targetId);
                  const targetDisplayName = targetMap ? `${targetMap.name} (${targetMap.nameEn})` : conn.targetId;
                  return (
                    <div
                      key={idx}
                      onClick={() => onNavigateToNode(conn.targetId)}
                      className="p-2.5 rounded-lg border border-stone-800 bg-stone-900/70 hover:border-amber-700/60 hover:bg-stone-800/60 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400/90 shrink-0" />
                        <span className="text-stone-200 font-semibold">{targetDisplayName}</span>
                        {conn.requirement && (
                          <span className="text-[10px] text-amber-400/90 font-mono">
                            【{conn.requirement}】
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400 hover:text-amber-300 shrink-0">点击查看</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CHOICES & CONSEQUENCES */}
        {activeTab === 'choices' && (
          <div className="space-y-5">
            <div className="text-xs text-stone-300 bg-stone-900/60 p-3 rounded-xl border border-stone-800 flex items-start gap-2">
              <Scale className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                本图关键抉择点汇集：包含<strong className="text-stone-100 font-semibold">推荐选择、多分支后果分析</strong>及防剧透遮罩（点击即可揭晓剧透内容）。
              </div>
            </div>

            {node.choices && node.choices.map((choice) => (
              <div
                key={choice.id}
                className="p-4 rounded-2xl border border-stone-800 bg-stone-900/70 space-y-3.5"
              >
                {/* Choice Title */}
                <div>
                  <h4 className="text-base font-bold text-stone-100 font-cinzel">
                    {choice.title}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                    {choice.situation}
                  </p>
                </div>

                {/* Recommended choice highlight box */}
                <div className="p-3 rounded-xl bg-stone-900/90 border border-amber-700/50 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400/90 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-amber-300/90 mr-1.5">【推荐策略】：</span>
                    <span className="text-stone-200 leading-relaxed">
                      {choice.recommendedChoice}
                    </span>
                  </div>
                </div>

                {/* Options and consequences */}
                <div className="space-y-2.5 pt-1">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    可选方案与对应后果详情：
                  </h5>

                  {choice.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={`p-3 rounded-xl border transition-all ${
                        opt.isRecommended
                          ? 'border-stone-700 bg-stone-900/70'
                          : 'border-stone-800 bg-stone-950/60'
                      }`}
                    >
                      {/* Option Header */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${
                            opt.isRecommended ? 'text-stone-100' : 'text-stone-300'
                          }`}>
                            选项 {optIdx + 1}：{opt.label}
                          </span>
                        </div>
                        {opt.isRecommended ? (
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-stone-800 border border-emerald-700/60 text-emerald-400/90 shrink-0 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>推荐路线</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800/80 border border-stone-700 text-stone-400 shrink-0">
                            备选/受苦
                          </span>
                        )}
                      </div>

                      {/* Consequence Text */}
                      <div className="text-xs text-stone-300 leading-relaxed mb-1.5 bg-black/30 p-2.5 rounded-lg border border-stone-800/80">
                        <strong className="text-stone-300 font-semibold mr-1">执行后果：</strong>
                        <span>{opt.consequence}</span>
                      </div>

                      {/* Lore Reasoning if present */}
                      {opt.loreReasoning && (
                        <div className="text-[11px] text-stone-400 italic font-serif mb-2 flex items-center gap-1.5 pl-2 border-l-2 border-stone-700">
                          <BookOpen className="w-3 h-3 text-stone-500 shrink-0" />
                          <span>魂学考据：{opt.loreReasoning}</span>
                        </div>
                      )}

                      {/* Spoiler Masked Content if present */}
                      {opt.spoilerContent && (
                        <div className="mt-2 pt-2 border-t border-stone-800/80">
                          <div className="text-[10px] font-mono text-stone-400 mb-1 flex items-center gap-1">
                            <span>详细剧情与结局剧透：</span>
                          </div>
                          <SpoilerText
                            text={opt.spoilerContent}
                            isProtected={isSpoilerProtectionOn}
                            label="点击揭晓涉及结局与剧情的详细剧透"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
