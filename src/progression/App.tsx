/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { FlowchartCanvas } from './components/FlowchartCanvas';
import { MapDetailPage } from './components/MapDetailPage';
import { NavigationMenuDrawer } from './components/NavigationMenuDrawer';
import { NPCQuestTrackerModal } from './components/NPCQuestTrackerModal';
import { EndingsGuideModal } from './components/EndingsGuideModal';
import { ProgressSummaryModal } from './components/ProgressSummaryModal';
import { SpoilerPromptModal } from './components/SpoilerPromptModal';
import { MerchantCatalogModal } from './components/MerchantCatalogModal';
import { StageQuickNav } from './components/StageQuickNav';
import { MAP_NODES } from './data/soulsData';
import { MapNode, NPCId, UserProgress } from './types/souls';
import { 
  filterMapNodes, 
  calculateProgressStats, 
  calculateNodePosition, 
  getInitialProgress,
  normalizeProgress,
  RouteFilterType 
} from './utils/progressionLogic';

const STORAGE_KEY = 'ds2_progression_progress_v1';
const SPOILER_KEY = 'ds2_spoiler_protection_v1';
const HAS_SEEN_SPOILER_PROMPT_KEY = 'ds2_has_seen_spoiler_prompt_v1';

export interface ProgressionAppProps {
  onBack?: () => void;
  onOpenMap?: (mapId: string) => void;
}

export default function App({ onBack, onOpenMap }: ProgressionAppProps = {}) {
  // Load saved progress from localStorage
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return normalizeProgress(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to parse localStorage progression state', e);
    }
    return getInitialProgress();
  });

  // Spoiler protection state (default true for spoiler safety)
  const [isSpoilerProtectionOn, setIsSpoilerProtectionOn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SPOILER_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
    } catch (e) {
      console.warn('Failed to parse spoiler protection state', e);
    }
    return true;
  });

  // Onboarding prompt modal when visiting the app for the first time
  const [showSpoilerPrompt, setShowSpoilerPrompt] = useState<boolean>(() => {
    try {
      return localStorage.getItem(HAS_SEEN_SPOILER_PROMPT_KEY) === null;
    } catch {
      return false;
    }
  });

  const handleSelectSpoilerPreference = (enableProtection: boolean) => {
    setIsSpoilerProtectionOn(enableProtection);
    setShowSpoilerPrompt(false);
    try {
      localStorage.setItem(HAS_SEEN_SPOILER_PROMPT_KEY, 'true');
      localStorage.setItem(SPOILER_KEY, String(enableProtection));
    } catch (e) {
      console.warn('Failed to store spoiler preference in localStorage', e);
    }
  };

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    } catch (e) {
      console.error('Failed to save progression state to localStorage', e);
    }
  }, [userProgress]);

  useEffect(() => {
    try {
      localStorage.setItem(SPOILER_KEY, String(isSpoilerProtectionOn));
    } catch (e) {
      console.error('Failed to save spoiler state to localStorage', e);
    }
  }, [isSpoilerProtectionOn]);

  // Filters & Search
  const [routeFilter, setRouteFilter] = useState<RouteFilterType>('all');
  const [npcFilter, setNpcFilter] = useState<NPCId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Menu Drawer State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Selected Map Node for Full Page Location View
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);

  // Modals
  const [isNpcModalOpen, setIsNpcModalOpen] = useState(false);
  const [isEndingsModalOpen, setIsEndingsModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isMerchantModalOpen, setIsMerchantModalOpen] = useState(false);

  // Canvas Viewport Pan & Zoom (Optimized for widescreen landscape flowchart)
  const [panOffset, setPanOffset] = useState({ x: 40, y: -650 });
  const [zoomLevel, setZoomLevel] = useState(0.85);

  // Filtered Map Nodes
  const filteredNodes = useMemo(() => {
    return filterMapNodes(MAP_NODES, {
      routeFilter,
      npcFilter,
      searchQuery,
    });
  }, [routeFilter, npcFilter, searchQuery]);

  // Calculate overall stats
  const stats = useMemo(() => {
    return calculateProgressStats(MAP_NODES, userProgress);
  }, [userProgress]);

  // Handlers for interactive progress tracking
  const handleToggleChecklist = (taskId: string) => {
    setUserProgress(prev => {
      const exists = prev.completedChecklists.includes(taskId);
      const updated = exists
        ? prev.completedChecklists.filter(id => id !== taskId)
        : [...prev.completedChecklists, taskId];
      return { ...prev, completedChecklists: updated };
    });
  };

  const handleToggleBoss = (bossId: string) => {
    setUserProgress(prev => {
      const exists = prev.defeatedBosses.includes(bossId);
      const updated = exists
        ? prev.defeatedBosses.filter(id => id !== bossId)
        : [...prev.defeatedBosses, bossId];

      const isVendrick = bossId === 'vendrick' || bossId === 'vendrick_fight';
      return {
        ...prev,
        defeatedBosses: updated,
        vendrickDefeated: isVendrick ? !exists : prev.vendrickDefeated,
      };
    });
  };

  const handleToggleItem = (itemId: string) => {
    setUserProgress(prev => {
      const exists = prev.obtainedItems.includes(itemId);
      const updated = exists
        ? prev.obtainedItems.filter(id => id !== itemId)
        : [...prev.obtainedItems, itemId];
      return { ...prev, obtainedItems: updated };
    });
  };

  const handleToggleMapComplete = (mapId: string) => {
    setUserProgress(prev => {
      const exists = prev.completedMaps.includes(mapId);
      const updated = exists
        ? prev.completedMaps.filter(id => id !== mapId)
        : [...prev.completedMaps, mapId];
      return { ...prev, completedMaps: updated };
    });
  };

  const handleResetProgress = () => {
    const fresh = getInitialProgress();
    setUserProgress(fresh);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Jump camera to coordinates
  const handleJumpToStage = (stageX: number, stageY: number = -650) => {
    setPanOffset({ x: stageX, y: stageY });
  };

  const handleResetView = () => {
    setPanOffset({ x: 40, y: -650 });
    setZoomLevel(0.85);
  };

  // Navigate to and center on a specific node (also opens it if navigated from within detail page)
  const handleNavigateToNode = (nodeId: string) => {
    const targetNode = MAP_NODES.find(n => n.id === nodeId);
    if (targetNode) {
      setSelectedNode(targetNode);
      const pos = calculateNodePosition(targetNode);
      const vpW = Math.max(window.innerWidth, window.innerHeight);
      const vpH = Math.min(window.innerWidth, window.innerHeight);
      setPanOffset({
        x: -pos.x * zoomLevel + vpW / 3,
        y: -pos.y * zoomLevel + vpH / 2.5,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#d1c7b7] flex flex-col overflow-hidden relative max-w-full">
      {/* Streamlined Top Header */}
      <Header
        routeFilter={routeFilter}
        onSelectRouteFilter={setRouteFilter}
        npcFilter={npcFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenMenu={() => setIsMenuOpen(true)}
        onResetView={handleResetView}
        completionPercentage={stats.totalProgressPercentage}
        isSpoilerProtectionOn={isSpoilerProtectionOn}
        onSelectMapNode={handleNavigateToNode}
        onOpenMerchantCatalog={() => setIsMerchantModalOpen(true)}
        onBack={onBack}
      />

      {/* Main Interactive Flowchart Canvas */}
      <main className="flex-1 relative overflow-hidden">
        <FlowchartCanvas
          nodes={filteredNodes}
          allNodes={MAP_NODES}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
          userProgress={userProgress}
          onToggleMapComplete={handleToggleMapComplete}
          highlightedNpc={npcFilter}
          panOffset={panOffset}
          zoomLevel={zoomLevel}
          onPanChange={setPanOffset}
          onZoomChange={setZoomLevel}
        />
      </main>

      {/* Full-Page Location Detail View (User Request: 地点详情页为一整个页面查看地点详情 而不是放到右边一个小窗口) */}
      {selectedNode && (
        <MapDetailPage
          node={selectedNode}
          allNodes={MAP_NODES}
          onBackToFlowchart={() => setSelectedNode(null)}
          userProgress={userProgress}
          onToggleChecklist={handleToggleChecklist}
          onToggleBoss={handleToggleBoss}
          onToggleItem={handleToggleItem}
          onToggleMapComplete={handleToggleMapComplete}
          onNavigateToNode={handleNavigateToNode}
          isSpoilerProtectionOn={isSpoilerProtectionOn}
          onOpenMap={onOpenMap}
        />
      )}

      {/* Dedicated Navigation Menu Drawer (User Request: 做一个菜单栏 不要把所有选项都放在上面一栏) */}
      <NavigationMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        routeFilter={routeFilter}
        onSelectRouteFilter={(filter) => {
          setRouteFilter(filter);
        }}
        npcFilter={npcFilter}
        onSelectNpcFilter={(npc) => {
          setNpcFilter(npc);
        }}
        isSpoilerProtectionOn={isSpoilerProtectionOn}
        onToggleSpoilerProtection={() => setIsSpoilerProtectionOn(prev => !prev)}
        onOpenNpcModal={() => setIsNpcModalOpen(true)}
        onOpenEndingsModal={() => setIsEndingsModalOpen(true)}
        onOpenProgressModal={() => setIsProgressModalOpen(true)}
        onOpenMerchantModal={() => setIsMerchantModalOpen(true)}
        onResetView={handleResetView}
        completionPercentage={stats.totalProgressPercentage}
        defeatedBossCount={stats.defeatedBossesCount}
        totalBossCount={stats.totalBosses}
        onBack={onBack}
      />

      {/* Quick Stage Jump Dock at Bottom */}
      {!selectedNode && (
        <StageQuickNav onJumpToStage={handleJumpToStage} />
      )}

      {/* Merchant & Spell Catalog Modal */}
      <MerchantCatalogModal
        isOpen={isMerchantModalOpen}
        onClose={() => setIsMerchantModalOpen(false)}
        onNavigateToMap={handleNavigateToNode}
      />

      {/* NPC Questlines Modal */}
      <NPCQuestTrackerModal
        isOpen={isNpcModalOpen}
        onClose={() => setIsNpcModalOpen(false)}
        onSelectMapNode={handleNavigateToNode}
        onFilterByNpc={(npcId) => {
          setNpcFilter(npcId);
          setIsNpcModalOpen(false);
        }}
      />

      {/* Endings Guide Modal */}
      <EndingsGuideModal
        isOpen={isEndingsModalOpen}
        onClose={() => setIsEndingsModalOpen(false)}
        userProgress={userProgress}
        onNavigateToNode={handleNavigateToNode}
        isSpoilerProtectionOn={isSpoilerProtectionOn}
      />

      {/* Progress & Boss Checklist Modal */}
      <ProgressSummaryModal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        nodes={MAP_NODES}
        userProgress={userProgress}
        onToggleBoss={handleToggleBoss}
        onResetProgress={handleResetProgress}
      />

      {/* Initial Entry Spoiler Protection Choice Modal */}
      <SpoilerPromptModal
        isOpen={showSpoilerPrompt}
        onSelectOption={handleSelectSpoilerPreference}
      />
    </div>
  );
}
