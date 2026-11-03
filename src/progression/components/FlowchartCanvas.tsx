import React, { useRef, useState, useEffect, useMemo } from 'react';
import { 
  Flame, 
  Skull, 
  Sparkles, 
  Key, 
  Users, 
  AlertTriangle, 
  Check, 
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronRight,
  ShieldAlert,
  Compass,
  ShoppingBag
} from 'lucide-react';
import { MapNode, UserProgress } from '../types/souls';
import { calculateNodePosition, generateBezierPath, checkLineCrossesCards } from '../utils/progressionLogic';
import { STAGES_CONFIG } from '../data/soulsData';
import { getMerchantsForMap } from '../data/merchantData';

interface FlowchartCanvasProps {
  nodes: MapNode[];
  allNodes: MapNode[];
  selectedNode: MapNode | null;
  onSelectNode: (node: MapNode) => void;
  userProgress: UserProgress;
  onToggleMapComplete: (mapId: string) => void;
  highlightedNpc: string | 'all';
  panOffset: { x: number; y: number };
  zoomLevel: number;
  onPanChange: (offset: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
}

export const FlowchartCanvas: React.FC<FlowchartCanvasProps> = ({
  nodes,
  allNodes,
  selectedNode,
  onSelectNode,
  userProgress,
  onToggleMapComplete,
  highlightedNpc,
  panOffset,
  zoomLevel,
  onPanChange,
  onZoomChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Pre-calculate positions for all nodes
  const nodePositions = useMemo(() => {
    const posMap = new Map<string, ReturnType<typeof calculateNodePosition>>();
    allNodes.forEach(node => {
      posMap.set(node.id, calculateNodePosition(node));
    });
    return posMap;
  }, [allNodes]);

  // Compute connections across all visible/active nodes
  const connectionPaths = useMemo(() => {
    const paths: {
      fromId: string;
      toId: string;
      pathString: string;
      requirement?: string;
      isHighlighted: boolean;
      isSecret?: boolean;
      crossesOtherCards?: boolean;
    }[] = [];

    const visibleNodeIds = new Set(nodes.map(n => n.id));

    allNodes.forEach(sourceNode => {
      const sourcePos = nodePositions.get(sourceNode.id);
      if (!sourcePos) return;

      sourceNode.connectionsTo.forEach(conn => {
        const targetNode = allNodes.find(n => n.id === conn.targetId);
        const targetPos = nodePositions.get(conn.targetId);
        if (!targetNode || !targetPos) return;

        // Calculate connection anchor points: forward exits right, backward exits left
        const isForward = targetPos.x >= sourcePos.x;
        let startX: number;
        let startY: number;
        let endX: number;
        let endY: number;

        if (isForward) {
          startX = sourcePos.x + sourcePos.width;
          startY = sourcePos.y + sourcePos.height / 2;
          endX = targetPos.x;
          endY = targetPos.y + targetPos.height / 2;
        } else {
          startX = sourcePos.x;
          startY = sourcePos.y + sourcePos.height * 0.75;
          endX = targetPos.x + targetPos.width;
          endY = targetPos.y + targetPos.height * 0.75;
        }

        const pathString = generateBezierPath(startX, startY, endX, endY);

        const crossesOtherCards = checkLineCrossesCards(
          startX,
          startY,
          endX,
          endY,
          sourceNode.id,
          targetNode.id,
          allNodes,
          nodePositions
        );

        const isHighlighted =
          (hoveredNodeId && (hoveredNodeId === sourceNode.id || hoveredNodeId === targetNode.id)) ||
          (selectedNode && (selectedNode.id === sourceNode.id || selectedNode.id === targetNode.id)) ||
          (highlightedNpc !== 'all' &&
            sourceNode.npcInteractions.some(n => n.npcId === highlightedNpc) &&
            targetNode.npcInteractions.some(n => n.npcId === highlightedNpc));

        paths.push({
          fromId: sourceNode.id,
          toId: targetNode.id,
          pathString,
          requirement: conn.requirement,
          isHighlighted: !!isHighlighted,
          isSecret: conn.isSecret,
          crossesOtherCards,
        });
      });
    });

    return paths;
  }, [allNodes, nodes, nodePositions, hoveredNodeId, selectedNode, highlightedNpc]);

  // Sort paths so highlighted lines and primary direct routes render on top of dimmed crossing lines
  const sortedConnectionPaths = useMemo(() => {
    return [...connectionPaths].sort((a, b) => {
      if (a.isHighlighted && !b.isHighlighted) return 1;
      if (!a.isHighlighted && b.isHighlighted) return -1;
      if (!a.crossesOtherCards && b.crossesOtherCards) return 1;
      if (a.crossesOtherCards && !b.crossesOtherCards) return -1;
      return 0;
    });
  }, [connectionPaths]);

  // Touch panning and pinch-to-zoom support for mobile screens
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const pinchDistRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-node-card')) return;
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      pinchDistRef.current = null;
    } else if (e.touches.length === 2) {
      pinchDistRef.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchDistRef.current !== null) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / pinchDistRef.current;
      if (Math.abs(ratio - 1) > 0.02) {
        onZoomChange(Math.min(1.8, Math.max(0.4, Number((zoomLevel * ratio).toFixed(2)))));
        pinchDistRef.current = currentDist;
      }
      return;
    }

    if (!touchStartRef.current || e.touches.length !== 1) return;
    const isRotated = typeof document !== 'undefined' && document.body.classList.contains('rotated-landscape');
    const rawDx = e.touches[0].clientX - touchStartRef.current.x;
    const rawDy = e.touches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    const dx = isRotated ? rawDy : rawDx;
    const dy = isRotated ? -rawDx : rawDy;
    onPanChange({
      x: panOffset.x + dx,
      y: panOffset.y + dy,
    });
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    pinchDistRef.current = null;
  };

  // Handle Dragging
  const mouseStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-node-card')) return;
    setIsDragging(true);
    mouseStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !mouseStartRef.current) return;
    const isRotated = typeof document !== 'undefined' && document.body.classList.contains('rotated-landscape');
    const rawDx = e.clientX - mouseStartRef.current.x;
    const rawDy = e.clientY - mouseStartRef.current.y;
    mouseStartRef.current = { x: e.clientX, y: e.clientY };
    const dx = isRotated ? rawDy : rawDx;
    const dy = isRotated ? -rawDx : rawDy;
    onPanChange({
      x: panOffset.x + dx,
      y: panOffset.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    mouseStartRef.current = null;
  };

  // Zoom controls
  const handleZoom = (delta: number) => {
    onZoomChange(Math.min(1.8, Math.max(0.4, zoomLevel + delta)));
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.08 : 0.08;
    handleZoom(zoomDelta);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-[calc(100vh-60px)] bg-[#090a0d] overflow-hidden select-none cursor-grab active:cursor-grabbing border-b border-stone-800 touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Dark Souls Subtle Background Atmospheric Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(180, 120, 50, 0.08) 0%, transparent 60%),
                            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 60px 60px, 60px 60px'
        }}
      />

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-20 sm:bottom-6 right-3 sm:right-6 landscape:bottom-3 landscape:right-3 z-20 flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-[#12141c]/90 border border-stone-700/80 rounded-xl shadow-2xl backdrop-blur-md">
        <button
          onClick={() => handleZoom(0.15)}
          className="p-1.5 sm:p-2 hover:bg-stone-800 rounded-lg text-stone-300 hover:text-amber-300 transition-colors"
          title="放大 (Zoom In)"
          aria-label="放大"
        >
          <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <span className="text-[11px] sm:text-xs font-mono px-1 sm:px-2 text-stone-400">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={() => handleZoom(-0.15)}
          className="p-1.5 sm:p-2 hover:bg-stone-800 rounded-lg text-stone-300 hover:text-amber-300 transition-colors"
          title="缩小 (Zoom Out)"
          aria-label="缩小"
        >
          <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <div className="w-[1px] h-4 bg-stone-700 mx-0.5 sm:mx-1" />
        <button
          onClick={() => onZoomChange(1.0)}
          className="p-1.5 sm:p-2 hover:bg-stone-800 rounded-lg text-stone-300 hover:text-amber-300 transition-colors"
          title="默认比例 100%"
          aria-label="恢复默认比例"
        >
          <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Pan/Zoom Stage Container */}
      <div
        className="absolute transition-transform duration-75 ease-out origin-top-left"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          width: '9400px',
          height: '2300px',
        }}
      >
        {/* Stage Columns Watermarks & Headers */}
        <div className="absolute top-2 left-0 right-0 pointer-events-none flex text-stone-400 font-cinzel text-sm border-b border-stone-800/80 pb-2.5">
          <div className="absolute left-[80px] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-amber-300 font-bold tracking-wider text-sm">阶段一：序章与如蜜枢纽</span>
          </div>
          <div className="absolute left-[1060px] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
            <span className="text-orange-400 font-bold tracking-wider text-sm">阶段二：四大始源之火分支 (罪人 / 铁之古王 / 蜘蛛 / 腐败物)</span>
          </div>
          <div className="absolute left-[4280px] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-blue-400 font-bold tracking-wider text-sm">阶段三：冬之庙与王都多兰古雷格</span>
          </div>
          <div className="absolute left-[5630px] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-purple-400 font-bold tracking-wider text-sm">阶段四：不死灵庙与国王宿命</span>
          </div>
          <div className="absolute left-[6080px] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span className="text-teal-400 font-bold tracking-wider text-sm">阶段五：安第尔之馆与龙祭坛</span>
          </div>
          <div className="absolute left-[7430px] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
            <span className="text-amber-300 font-bold tracking-wider text-sm">阶段六：穿越古昔回忆</span>
          </div>
          <div className="absolute left-[8330px] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-red-400 font-bold tracking-wider text-sm">阶段七：渴望王座决战与双重结局</span>
          </div>
        </div>

        {/* Branch Swimlane Markers on the left */}
        <div className="absolute left-6 top-[70px] flex flex-col gap-2 pointer-events-none opacity-60 text-xs font-mono font-semibold">
          <div className="absolute top-[0px] text-stone-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>罪人塔线 (上)</span>
          </div>
          <div className="absolute top-[270px] text-stone-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            <span>古王熔铁线 (中上)</span>
          </div>
          <div className="absolute top-[830px] text-amber-300 font-bold flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span>王国中枢主干线</span>
          </div>
          <div className="absolute top-[1130px] text-stone-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>辉石镇蜘蛛线 (中下)</span>
          </div>
          <div className="absolute top-[1450px] text-stone-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span>废渊与黑溪谷腐败线 (下)</span>
          </div>
          <div className="absolute top-[1770px] text-indigo-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>失落的王冠 (DLC三部曲)</span>
          </div>
        </div>

        {/* Map Node Cards Layer */}
        {nodes.map(node => {
          const pos = nodePositions.get(node.id);
          if (!pos) return null;

          const isSelected = selectedNode?.id === node.id;
          const isCompleted = userProgress.completedMaps.includes(node.id);
          const hasGreatSoul = node.bosses.some(b => b.isGreatSoul);
          const hasNpcHighlight = highlightedNpc !== 'all' && node.npcInteractions.some(n => n.npcId === highlightedNpc);

          // Checklist completed count
          const completedTasks = node.checklists.filter(c => userProgress.completedChecklists.includes(c.id)).length;
          const totalTasks = node.checklists.length;

          // Collectibles count
          const estusCount = node.keyItems.filter(i => i.type === 'estus_shard').length;
          const boneCount = node.keyItems.filter(i => i.type === 'sublime_bone_dust').length;

          // Merchants present in this location
          const localMerchants = getMerchantsForMap(node.id);

          return (
            <div
              key={node.id}
              className={`interactive-node-card absolute rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-2xl flex flex-col justify-between ${
                isSelected
                  ? 'ring-2 ring-amber-400 bg-[#1e222f] shadow-amber-500/40 scale-[1.02] z-30'
                  : isCompleted
                  ? 'bg-[#121622]/95 border border-emerald-700/70 hover:border-emerald-400 z-10'
                  : hasGreatSoul
                  ? 'bg-gradient-to-b from-[#251918] via-[#1a141c] to-[#121218] border border-orange-500/80 hover:border-orange-400 z-10 shadow-orange-950/40'
                  : 'bg-[#151724]/95 border border-[#4d4032] hover:border-[#c5a165] z-10'
              } ${hasNpcHighlight ? 'ring-2 ring-amber-500 glow-ember' : ''}`}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                width: `${pos.width}px`,
                height: `${pos.height}px`,
              }}
              onClick={() => onSelectNode(node)}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <div>
                {/* Card Top: Stage Tag, Bonfire Count, Checkmark */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-mono px-2 py-0.5 rounded-md bg-black/60 border border-stone-700 text-stone-300 font-semibold">
                      {node.branchName}
                    </span>
                    {node.bonfireCount > 0 && (
                      <span className="flex items-center gap-1 text-xs text-amber-400 font-mono font-medium">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>{node.bonfireCount} 营火</span>
                      </span>
                    )}
                  </div>

                  {/* Map Cleared Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleMapComplete(node.id);
                    }}
                    className={`flex items-center justify-center w-6 h-6 rounded-lg border transition-all active:scale-90 ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm'
                        : 'bg-black/50 border-stone-600 hover:border-amber-400 text-transparent'
                    }`}
                    title={isCompleted ? '已标记为探索完成' : '点击标记为探索完成'}
                    aria-label={`标记 ${node.name} 为完成`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>

                {/* Title & Lore Name (Increased font proportion) */}
                <div className="mb-2.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base sm:text-lg font-cinzel text-stone-100 group-hover:text-amber-300 flex items-center gap-1.5 truncate tracking-wide">
                      {node.name}
                    </h3>
                    {hasGreatSoul && (
                      <span className="px-2 py-0.5 text-[11px] rounded bg-orange-950/90 border border-orange-500 text-orange-200 font-bold tracking-tight shrink-0 flex items-center gap-1 shadow-sm">
                        <Flame className="w-3 h-3 text-orange-400" />
                        始源巨魂
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-stone-400 font-serif italic truncate mt-0.5">
                    {node.nameEn} • <span className="font-mono text-amber-300/90 font-semibold">{node.levelRecommendation}</span>
                  </div>
                </div>

                {/* Boss Badges & Merchant Indicator */}
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {node.bosses.length === 0 ? (
                    <span className="text-xs text-stone-500 italic py-0.5">无首领战 (中继/安全据点)</span>
                  ) : (
                    node.bosses.slice(0, 3).map(boss => (
                      <span
                        key={boss.id}
                        className={`text-xs px-2 py-0.5 rounded-md flex items-center gap-1 font-medium ${
                          userProgress.defeatedBosses.includes(boss.id)
                            ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-400 line-through opacity-75'
                            : boss.isGreatSoul
                            ? 'bg-red-950/70 border border-red-600 text-red-200 font-bold shadow-sm'
                            : boss.isOptional
                            ? 'bg-stone-900 border border-stone-700 text-stone-400'
                            : 'bg-amber-950/50 border border-amber-700/70 text-amber-200'
                        }`}
                      >
                        <Skull className="w-3 h-3 shrink-0" />
                        <span className="truncate max-w-[140px]">{boss.name.split(' (')[0]}</span>
                      </span>
                    ))
                  )}
                  {node.bosses.length > 3 && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800">
                      +{node.bosses.length - 3}
                    </span>
                  )}

                  {/* Merchant Badge if present */}
                  {localMerchants.length > 0 && (
                    <span 
                      className="text-xs px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-500/60 text-amber-300 font-medium flex items-center gap-1 shrink-0"
                      title={`${localMerchants.map(m => `${m.name}(${m.roleLabel})`).join(', ')}`}
                    >
                      <ShoppingBag className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{localMerchants.length}位商人/导师</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Badges: Key Collectibles, NPC indicator, Task progress */}
              <div className="pt-2 border-t border-stone-800/90 flex items-center justify-between text-xs font-mono">
                {/* Collectibles Icons */}
                <div className="flex items-center gap-2.5 text-stone-300">
                  {estusCount > 0 && (
                    <span className="flex items-center gap-1 text-amber-300 font-semibold" title={`原素碎片 × ${estusCount}`}>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{estusCount}</span>
                    </span>
                  )}
                  {boneCount > 0 && (
                    <span className="flex items-center gap-1 text-orange-400 font-semibold" title={`贵人骨灰 × ${boneCount}`}>
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span>{boneCount}</span>
                    </span>
                  )}
                  {node.npcInteractions.length > 0 && (
                    <span className="flex items-center gap-1 text-cyan-300 font-semibold" title={`涉及 ${node.npcInteractions.length} 位NPC交互`}>
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{node.npcInteractions.length}</span>
                    </span>
                  )}
                </div>

                {/* Checklist counter */}
                <div className="flex items-center gap-1.5 text-stone-300 font-sans">
                  <span className="text-stone-400 text-xs">事项:</span>
                  <span className={`font-mono text-xs font-bold ${completedTasks === totalTasks && totalTasks > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {completedTasks}/{totalTasks}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                </div>
              </div>
            </div>
          );
        })}

        {/* SVG Bezier Connection Layer (Floating above cards for clean visibility) */}
        <svg
          className="absolute inset-0 pointer-events-none z-20"
          width="9400"
          height="2300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="arrow-std"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#c59f58" />
            </marker>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#fbbf24" />
            </marker>
          </defs>

          {/* Render Connection Curves */}
          {sortedConnectionPaths.map((conn, idx) => {
            const isDimmed = conn.crossesOtherCards && !conn.isHighlighted;

            return (
              <g key={`${conn.fromId}-${conn.toId}-${idx}`}>
                {/* Outer glow stroke when highlighted */}
                {conn.isHighlighted && (
                  <path
                    d={conn.pathString}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="7"
                    strokeOpacity="0.45"
                    strokeLinecap="round"
                  />
                )}
                {/* Core Path: faint and dashed when crossing other cards in normal state; restores to full gold brightness when highlighted */}
                <path
                  d={conn.pathString}
                  fill="none"
                  stroke={conn.isHighlighted ? '#fbbf24' : '#c59f58'}
                  strokeOpacity={conn.isHighlighted ? 1 : isDimmed ? 0.22 : 0.85}
                  strokeWidth={conn.isHighlighted ? 3.5 : isDimmed ? 1.8 : 2.2}
                  strokeDasharray={conn.isSecret ? '5,5' : isDimmed ? '6,4' : undefined}
                  markerEnd={conn.isHighlighted ? 'url(#arrow-active)' : isDimmed ? undefined : 'url(#arrow-std)'}
                  className="transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

