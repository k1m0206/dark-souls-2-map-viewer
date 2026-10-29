import hbSDK from '@heybox/hb-sdk';
import {
  createIcons,
  Compass,
  Footprints,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  RotateCcw,
  Menu,
  X,
  Search,
  Sparkles,
  Flame,
  Home,
  LogOut,
  Settings,
  Maximize2
} from 'lucide';
import { MAPS, MAP_DICT } from './maps';
import { loadDecodedMap, releaseDecodedMap } from './format';
import { DS2Scene } from './scene';
import { distanceToRegion, linkedRegions, nearbyRegions } from './seamless';
import { CameraControls } from './controls';
import { installErrorLogging, recordAppError } from './error-log';
import './styles.css';

installErrorLogging();

const lucideIcons = {
  Compass,
  Footprints,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  RotateCcw,
  Menu,
  X,
  Search,
  Sparkles,
  Flame,
  Home,
  LogOut,
  Settings,
  Maximize2
};

function refreshIcons() {
  createIcons({ icons: lucideIcons });
}

function renderAppHtml(): string {
  return `
    <!-- 1. 竖屏欢迎与地图选择主页 (魂1同款) -->
    <section id="welcome">
      <div class="welcome-scroll-wrap">
        <div class="welcome-hero">
          <h2>多兰古雷格<em>地图志</em></h2>
        </div>

        <div class="welcome-map-section">
          <div class="welcome-map-head">
            <label class="welcome-section-label">地图</label>
            <div class="welcome-search-box">
              <i data-lucide="search"></i>
              <input id="welcome-search" type="search" placeholder="搜索" />
            </div>
          </div>
          <div id="welcome-map-list" class="welcome-map-grid"></div>
        </div>
      </div>

      <!-- 底部固定栏 -->
      <div class="welcome-fixed-bar">
        <button id="start" type="button" class="btn-welcome-start" title="进入地图">
          <i data-lucide="flame"></i>
          <span id="welcome-start-label">进入</span>
          <i data-lucide="arrow-up" style="transform: rotate(90deg)"></i>
        </button>
      </div>
    </section>

    <!-- 2. 横屏 3D 探索舞台 (魂1同款架构) -->
    <div id="explore-stage">
      <canvas id="world" aria-label="多兰古雷格三维地图，按住拖动调整视角"></canvas>

      <!-- 顶部紧凑导航栏 -->
      <header>
        <div class="header-left">
          <button id="btn-exit" class="btn-exit" title="主页">
            <i data-lucide="log-out"></i>
            <span>主页</span>
          </button>
          <div class="top-mode-segmented" role="radiogroup" aria-label="视角切换">
            <button id="btn-top-walk" type="button" class="top-mode-seg-btn active" data-mode="walk" title="漫步">
              <i data-lucide="footprints"></i>
              <span>漫步</span>
            </button>
            <button id="btn-top-flight" type="button" class="top-mode-seg-btn" data-mode="flight" title="飞行">
              <i data-lucide="compass"></i>
              <span>飞行</span>
            </button>
          </div>
        </div>

        <div class="header-center">
          <span id="current-badge" class="current-badge">
            <i data-lucide="flame" class="badge-icon"></i>
            <strong id="area-title">如蜜</strong>
          </span>
        </div>

        <div class="header-actions">
          <button id="btn-wire-toggle" class="btn-ghost" title="显示模式">
            <i data-lucide="eye"></i>
            <span id="wire-text">线框</span>
          </button>
          <button id="btn-hide-ui" class="btn-ghost" title="隐藏界面">
            <i data-lucide="eye-off"></i>
            <span>隐藏</span>
          </button>
          <button id="menu" aria-expanded="false">
            <i data-lucide="menu"></i>
            <span>菜单</span>
          </button>
        </div>
      </header>

      <!-- 侧滑抽屉面板 (双列地图与设置) -->
      <aside id="panel" hidden>
        <div class="panel-backdrop"></div>
        <div class="panel-modal">
          <!-- 左列: 地图选择与搜索 -->
          <div class="panel-col-maps">
            <div class="panel-col-head">
              <div>
                <h2>地图</h2>
              </div>
              <button id="btn-return-welcome" type="button" class="btn-panel-home" title="主页">
                <i data-lucide="home"></i>
                <span>主页</span>
              </button>
            </div>
            <div class="search-box">
              <i data-lucide="search" class="search-icon"></i>
              <input id="search" type="search" placeholder="搜索" />
            </div>
            <div id="map-list" class="map-grid"></div>
          </div>

          <!-- 右列: 视角与显示设置 -->
          <div class="panel-col-settings">
            <div class="settings-col-head">
              <h2>设置</h2>
              <button id="close" class="btn-panel-close" aria-label="关闭面板">
                <i data-lucide="x"></i>
              </button>
            </div>

            <div class="settings-content">
              <div class="setting-card-group">
                <label class="group-label">模式</label>
                <div class="mode-cards">
                  <button type="button" class="mode-card-btn" id="btn-mode-flight" data-mode="flight">
                    <i data-lucide="compass"></i>
                    <div class="mode-card-text">
                      <strong>飞行</strong>
                    </div>
                  </button>
                  <button type="button" class="mode-card-btn active" id="btn-mode-walk" data-mode="walk">
                    <i data-lucide="footprints"></i>
                    <div class="mode-card-text">
                      <strong>漫步</strong>
                    </div>
                  </button>
                </div>
              </div>

              <div class="setting-card-group">
                <label class="group-label">视角</label>
                <div class="setting-row-item">
                  <div class="row-label-wrap">
                    <span>视野</span>
                    <strong id="fov-display">75°</strong>
                  </div>
                  <input id="fov-slider" type="range" min="50" max="105" value="75" />
                </div>
                <div class="setting-row-item">
                  <div class="row-label-wrap">
                    <span>视高</span>
                    <strong id="eye-height-display">1.5m</strong>
                  </div>
                  <input id="eye-height-slider" type="range" min="10" max="22" value="15" step="1" />
                </div>
                <div class="quick-view-actions">
                  <button id="btn-fix-view" type="button" class="btn-setting-action">
                    <i data-lucide="compass"></i>
                    <span>归正</span>
                  </button>
                  <button id="btn-reset-pos" type="button" class="btn-setting-action">
                    <i data-lucide="rotate-ccw"></i>
                    <span>起点</span>
                  </button>
                </div>
              </div>

              <div class="setting-card-group">
                <label class="group-label">显示</label>
                <div class="setting-select-row">
                  <span>模式</span>
                  <select id="display-mode-select">
                    <option value="solid" selected>素模</option>
                    <option value="wire">线框</option>
                  </select>
                </div>
              </div>
              <div class="setting-card-group">
                <label class="group-label">加载</label>
                <label class="setting-select-row" for="seamless-mode">
                  <span>无缝探索</span>
                  <input id="seamless-mode" type="checkbox" checked />
                </label>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 底部 HUD (坐标与帧率) -->
      <footer>
        <div class="hud-status">
          <div id="hud-coords" class="hud-coords" title="当前三维坐标">
            <strong id="coord-val">X: --  Y: --  Z: --</strong>
          </div>
          <span id="status" class="hud-fps">60 FPS</span>
        </div>
      </footer>

      <!-- 移动摇杆 (魂1同款) -->
      <div id="joystick" aria-label="移动摇杆">
        <span></span>
      </div>

      <!-- 右侧动作按键 (魂1同款) -->
      <div id="right-controls">
        <div id="action-controls">
          <button id="reset" class="ctrl-btn-pill" title="回到起点">
            <i data-lucide="rotate-ccw"></i>
            <span>起点</span>
          </button>
          <div id="altitude" class="altitude-cluster" style="display: none;">
            <button data-rise="1" class="ctrl-btn-elevate" id="btn-elevate-up" title="升高视角">
              <i data-lucide="chevron-up"></i>
              <span>升高</span>
            </button>
            <button data-rise="-1" class="ctrl-btn-elevate" id="btn-elevate-down" title="降低视角">
              <i data-lucide="chevron-down"></i>
              <span>降低</span>
            </button>
          </div>
          <button id="btn-jump" data-action="jump" class="ctrl-btn-jump" title="跳跃">
            <i data-lucide="arrow-up"></i>
            <span>跳跃</span>
          </button>
        </div>
      </div>

      <div id="crosshair">+</div>

      <!-- 加载遮罩 -->
      <section id="loading" hidden aria-live="polite">
        <span class="spinner"></span>
        <h2 id="load-title">多兰古雷格</h2>
        <progress id="progress" max="1" value="0"></progress>
      </section>

      <!-- 错误提示 -->
      <section id="error" hidden role="alert">
        <h2>加载失败</h2>
        <p id="error-detail"></p>
        <button id="retry" class="btn-welcome-start" style="margin: 14px auto 8px; max-width: 200px; height: 38px;">重试</button>
        <button id="error-close" class="ctrl-btn-pill" style="margin: 0 auto;">主页</button>
      </section>

    </div>
  `;
}

async function bootstrap() {
  const appContainer = document.getElementById('app')!;
  appContainer.innerHTML = renderAppHtml();
  refreshIcons();

  const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

  const canvas = el<HTMLCanvasElement>('world');
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: true,
    depth: true,
    stencil: false,
    powerPreference: 'high-performance'
  });

  if (!gl) {
    recordAppError(new Error('WebGL2 not supported'), 'bootstrap');
    appContainer.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:#0d0e0b;color:#e6dbbf;padding:24px;text-align:center;font-family:sans-serif;box-sizing:border-box;">
        <h2 style="margin:0 0 12px;color:#f0ad4e;font-size:20px;">当前设备不支持 WebGL2</h2>
        <p style="color:#aaa;max-width:380px;line-height:1.6;font-size:14px;">本 3D 碰撞白模查看器需要 WebGL2 图形加速支持。请检查手机系统 WebView 或客户端版本。</p>
      </div>
    `;
    return;
  }

  const joystickZone = el('joystick');
  const scene = new DS2Scene(gl);
  const controls = new CameraControls(canvas, joystickZone);

  // Application State
  let selected = 'm10_04'; // Default: Majula (如蜜)
  let isWireframe = false;
  let fov = 75;
  let isUIHidden = false;
  let activeAbortController: AbortController | null = null;
  let seamlessEnabled = true;
  let seamlessAbort: AbortController | null = null;
  let seamlessGeneration = 0;
  let seamlessBusy = false;
  let lastSeamlessScan = 0;

  function cancelSeamlessLoad() {
    seamlessGeneration++;
    seamlessAbort?.abort();
    seamlessAbort = null;
    seamlessBusy = false;
  }

  function updateCurrentRegion(mapId: string) {
    if (mapId === selected) return;
    selected = mapId;
    scene.setActiveMap(mapId);
    const mapDef = MAP_DICT.get(mapId);
    if (!mapDef) return;
    el('area-title').textContent = mapDef.name;
    if (!el('panel').hidden) drawList();
    const spawn = controls.mode === 'walk' ? mapDef.spawnWalk : mapDef.spawnFly;
    controls.spawnPos[0] = spawn[0];
    controls.spawnPos[1] = spawn[1];
    controls.spawnPos[2] = spawn[2];
  }

  async function maintainSeamlessRegions() {
    if (!seamlessEnabled || seamlessBusy || !scene.hasMap(selected) || !document.body.classList.contains('map-view')) return;
    seamlessBusy = true;
    const generation = seamlessGeneration;
    const abortCtrl = new AbortController();
    seamlessAbort = abortCtrl;
    try {
      const point = [controls.position[0], controls.position[1], controls.position[2]];
      const feetY = point[1] - controls.eyeHeight;
      if (controls.mode === 'walk') {
        const currentGround = scene.mapGroundHeight(selected, point[0], feetY, point[2]);
        if (!currentGround || Math.abs(currentGround.groundY - feetY) > 1.5) {
          for (const id of scene.loadedMapIds()) {
            if (id === selected || !linkedRegions(selected).includes(id)) continue;
            const ground = scene.mapGroundHeight(id, point[0], feetY, point[2]);
            if (ground && Math.abs(ground.groundY - feetY) <= 1.5) {
              updateCurrentRegion(id);
              break;
            }
          }
        }
      } else {
        const currentDistance = distanceToRegion(selected, point);
        const other = scene.loadedMapIds()
          .filter((id) => id !== selected && linkedRegions(selected).includes(id))
          .sort((a, b) => distanceToRegion(a, point) - distanceToRegion(b, point))[0];
        if (other && currentDistance > 30 && distanceToRegion(other, point) + 15 < currentDistance) {
          updateCurrentRegion(other);
        }
      }

      const desired = [selected, ...nearbyRegions(selected, point)];
      for (const id of scene.loadedMapIds()) {
        if (!desired.includes(id)) {
          scene.removeMap(id);
          releaseDecodedMap(id);
        }
      }
      controls.collider = scene.collider;

      for (const id of desired) {
        if (scene.hasMap(id)) continue;
        const decoded = await loadDecodedMap(id, abortCtrl.signal);
        if (generation !== seamlessGeneration || abortCtrl.signal.aborted) return;
        scene.addMap(decoded);
        controls.collider = scene.collider;
      }
    } catch (error) {
      if ((error as Error)?.name !== 'AbortError') recordAppError(error, 'seamless-load');
    } finally {
      if (generation === seamlessGeneration) {
        seamlessBusy = false;
        seamlessAbort = null;
      }
    }
  }

  // Safe Area & Insets Sync
  let insetRequest = 0;
  async function syncInsets() {
    const req = ++insetRequest;
    try {
      if (typeof hbSDK !== 'undefined' && hbSDK.viewport?.getWindowInfo) {
        const info = await hbSDK.viewport.getWindowInfo();
        if (req !== insetRequest) return;
        if (info && info.safeArea) {
          const insets = {
            top: info.safeArea.top,
            right: info.windowWidth - info.safeArea.right,
            bottom: info.windowHeight - info.safeArea.bottom,
            left: info.safeArea.left
          };
          for (const [edge, value] of Object.entries(insets)) {
            document.documentElement.style.setProperty(`--safe-${edge}`, `${Math.max(0, value)}px`);
            document.documentElement.style.setProperty(`--device-safe-${edge}`, `${Math.max(0, value)}px`);
          }
        }
      }
    } catch {}
  }

  // Viewport Orientation
  function syncViewportOrientationClass() {
    const landscape = window.innerWidth >= window.innerHeight;
    document.body.classList.toggle('orientation-landscape', landscape);
    document.body.classList.toggle('orientation-portrait', !landscape);
    document.body.classList.toggle('rotated-landscape', document.body.classList.contains('map-view'));
  }

  function handleResize() {
    syncViewportOrientationClass();
    void syncInsets();

    const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
    const width = Math.max(1, Math.floor((canvas.clientWidth || window.innerWidth || 300) * dpr));
    const height = Math.max(1, Math.floor((canvas.clientHeight || window.innerHeight || 150) * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', () => setTimeout(handleResize, 100));

  try {
    if (typeof hbSDK !== 'undefined' && hbSDK.on) {
      hbSDK.on('viewport_change', handleResize);
      hbSDK.on('display_change', handleResize);
      hbSDK.on('show', handleResize);
    }
  } catch {}

  // Mode UI update
  function updateModeUI(mode: 'walk' | 'flight', silent = false) {
    controls.setMode(mode);
    const isWalk = mode === 'walk';

    const jumpBtn = el('btn-jump');
    const altitude = el('altitude');
    if (jumpBtn) jumpBtn.style.display = isWalk ? 'flex' : 'none';
    if (altitude) altitude.style.display = isWalk ? 'none' : 'flex';

    document.body.classList.toggle('mode-walk', isWalk);
    document.body.classList.toggle('mode-flight', !isWalk);

    el('btn-top-walk')?.classList.toggle('active', isWalk);
    el('btn-top-flight')?.classList.toggle('active', !isWalk);
    el('btn-mode-walk')?.classList.toggle('active', isWalk);
    el('btn-mode-flight')?.classList.toggle('active', !isWalk);

    void silent;
  }

  // Panel Drawer State
  function setPanel(open: boolean) {
    controls.clear();
    el('panel').hidden = !open;
    el('menu').setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    if (open) {
      refreshIcons();
      drawList();
      const isWalk = controls.mode === 'walk';
      el('btn-mode-flight')?.classList.toggle('active', !isWalk);
      el('btn-mode-walk')?.classList.toggle('active', isWalk);
    }
  }

  // Draw Welcome Map Cards
  function drawWelcomeList() {
    const searchVal = el<HTMLInputElement>('welcome-search')?.value.trim() || '';
    const container = el('welcome-map-list');
    if (!container) return;
    container.replaceChildren();

    const filtered = MAPS.filter((m) =>
      m.name.includes(searchVal) ||
      m.enName.toLowerCase().includes(searchVal.toLowerCase()) ||
      m.category.includes(searchVal)
    );

    filtered.forEach((m) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `welcome-map-card ${selected === m.id ? 'active' : ''}`;
      const originIdx = MAPS.findIndex((item) => item.id === m.id) + 1;
      card.innerHTML = `
        <span class="welcome-map-num">${String(originIdx).padStart(2, '0')}</span>
        <div class="welcome-map-info">
          <strong>${m.name}</strong>
        </div>
      `;

      card.onclick = () => {
        selected = m.id;
        drawWelcomeList();
        const startText = el('welcome-start-label');
        if (startText) startText.textContent = m.name;
      };

      card.ondblclick = () => {
        selected = m.id;
        void enterMapFromWelcome();
      };

      container.append(card);
    });

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'welcome-map-empty';
      empty.textContent = '无结果';
      container.append(empty);
    }
  }

  // Draw Drawer Map Cards
  function drawList() {
    const searchVal = el<HTMLInputElement>('search')?.value.trim() || '';
    const container = el('map-list');
    if (!container) return;
    container.replaceChildren();

    const filtered = MAPS.filter((m) =>
      m.name.includes(searchVal) ||
      m.enName.toLowerCase().includes(searchVal.toLowerCase()) ||
      m.category.includes(searchVal)
    );

    filtered.forEach((m) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'map-card';
      btn.setAttribute('aria-pressed', String(selected === m.id));
      const originIdx = MAPS.findIndex((item) => item.id === m.id) + 1;
      btn.innerHTML = `
        <span class="map-number">${String(originIdx).padStart(2, '0')}</span>
        <div>
          <strong>${m.name}</strong>
        </div>
      `;

      btn.onclick = () => {
        selected = m.id;
        setPanel(false);
        void switchMap(m.id);
      };

      container.append(btn);
    });

    if (filtered.length === 0) {
      container.textContent = '无结果';
    }
  }

  // Load Map Pipeline
  async function switchMap(mapId: string) {
    controls.clear();
    cancelSeamlessLoad();
    if (activeAbortController) {
      activeAbortController.abort();
    }
    const abortCtrl = new AbortController();
    activeAbortController = abortCtrl;

    const mapDef = MAP_DICT.get(mapId) || MAPS[0];
    selected = mapDef.id;

    el('area-title').textContent = mapDef.name;
    el('loading').hidden = false;
    el('error').hidden = true;
    el('load-title').textContent = mapDef.name;
    const progressEl = el<HTMLProgressElement>('progress');
    if (progressEl) progressEl.value = 0.15;

    try {
      const decoded = await loadDecodedMap(mapId, abortCtrl.signal, (_stage, pct) => {
        if (progressEl) progressEl.value = pct / 100;
      });
      if (abortCtrl.signal.aborted) return;

      if (progressEl) progressEl.value = 0.85;
      await new Promise((r) => setTimeout(r, 16));

      const previousMaps = scene.loadedMapIds();
      scene.loadMap(decoded, (progress) => {
        if (progressEl) progressEl.value = 0.85 + progress * 0.15;
      });
      for (const id of previousMaps) if (id !== mapId) releaseDecodedMap(id);

      controls.collider = scene.collider;

      // Position camera
      const spawn = controls.mode === 'walk' ? mapDef.spawnWalk : mapDef.spawnFly;
      controls.restoreState(spawn, 0, 0);

      if (progressEl) progressEl.value = 1.0;
      await new Promise((r) => setTimeout(r, 120));
      el('loading').hidden = true;
      lastSeamlessScan = 0;
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') return;
      recordAppError(err, 'switchMap');
      el('loading').hidden = true;
      el('error').hidden = false;
      el('error-detail').textContent = (err as Error)?.message || '地图几何加载异常';
    } finally {
      if (activeAbortController === abortCtrl) {
        activeAbortController = null;
      }
    }
  }

  // Enter Map View from Welcome Screen
  let entering = false;
  async function enterMapFromWelcome() {
    if (entering) return;
    entering = true;
    try {
      controls.clear();
      document.body.classList.add('map-view');
      document.body.classList.add('exploring');
      syncViewportOrientationClass();
      void syncInsets();
      handleResize();

      el('welcome').hidden = true;
      await switchMap(selected);
    } finally {
      entering = false;
    }
  }

  // Return to Welcome Screen
  function returnToWelcome() {
    controls.clear();
    cancelSeamlessLoad();
    setPanel(false);
    if (activeAbortController) {
      activeAbortController.abort();
      activeAbortController = null;
    }
    for (const id of scene.loadedMapIds()) releaseDecodedMap(id);
    scene.destroyBuffers();
    controls.collider = null;
    document.body.classList.remove('exploring');
    document.body.classList.remove('map-view');
    el('loading').hidden = true;
    el('error').hidden = true;
    el('welcome').hidden = false;

    syncViewportOrientationClass();
    void syncInsets();
    handleResize();
    drawWelcomeList();
    refreshIcons();
  }

  // UI Hidden Mode
  function setUIHidden(hidden: boolean) {
    isUIHidden = hidden;
    document.body.classList.toggle('ui-hidden', hidden);
    document.querySelector('header')?.classList.toggle('hidden', hidden);
    document.querySelector('footer')?.classList.toggle('hidden', hidden);
    el('joystick').style.display = hidden ? 'none' : 'flex';
    el('right-controls').style.display = hidden ? 'none' : 'flex';
    if (!hidden) {
      refreshIcons();
    }
  }

  // Wireframe toggle
  function toggleWireframe() {
    isWireframe = !isWireframe;
    const wireBtn = el('btn-wire-toggle');
    const wireText = el('wire-text');
    wireBtn?.classList.toggle('active', isWireframe);
    if (wireText) wireText.textContent = isWireframe ? '素模' : '线框';
    const sel = el<HTMLSelectElement>('display-mode-select');
    if (sel) sel.value = isWireframe ? 'wire' : 'solid';
  }

  // Bind Event Handlers
  el('start').onclick = () => void enterMapFromWelcome();
  el('btn-exit').onclick = returnToWelcome;
  el('btn-return-welcome').onclick = returnToWelcome;
  el('error-close').onclick = returnToWelcome;
  el('retry').onclick = () => void switchMap(selected);

  el('welcome-search').oninput = drawWelcomeList;
  el('search').oninput = drawList;

  // Segmented walk/flight buttons
  el('btn-top-walk').onclick = () => updateModeUI('walk');
  el('btn-top-flight').onclick = () => updateModeUI('flight');
  el('btn-mode-walk').onclick = () => updateModeUI('walk');
  el('btn-mode-flight').onclick = () => updateModeUI('flight');

  // Wireframe
  el('btn-wire-toggle').onclick = toggleWireframe;
  el<HTMLSelectElement>('display-mode-select').onchange = (e) => {
    isWireframe = (e.target as HTMLSelectElement).value === 'wire';
    const wireBtn = el('btn-wire-toggle');
    const wireText = el('wire-text');
    wireBtn?.classList.toggle('active', isWireframe);
    if (wireText) wireText.textContent = isWireframe ? '素模' : '线框';
  };
  el<HTMLInputElement>('seamless-mode').onchange = (event) => {
    seamlessEnabled = (event.target as HTMLInputElement).checked;
    cancelSeamlessLoad();
    if (!seamlessEnabled) {
      for (const id of scene.loadedMapIds()) {
        if (id !== selected) {
          scene.removeMap(id);
          releaseDecodedMap(id);
        }
      }
      controls.collider = scene.collider;
    } else {
      lastSeamlessScan = 0;
      void maintainSeamlessRegions();
    }
  };

  // Hide UI
  el('btn-hide-ui').onclick = (e) => {
    e.stopPropagation();
    setUIHidden(true);
  };
  window.addEventListener(
    'pointerdown',
    () => {
      if (isUIHidden) setUIHidden(false);
    },
    true
  );

  // Panel Drawer
  el('menu').onclick = () => setPanel(true);
  el('close').onclick = () => setPanel(false);
  document.querySelector('.panel-backdrop')?.addEventListener('click', () => setPanel(false));

  // Quick Action Buttons
  el('btn-fix-view').onclick = () => {
    controls.levelHorizon();
  };
  el('btn-reset-pos').onclick = () => {
    controls.resetToSpawn();
  };
  el('reset').onclick = () => {
    controls.resetToSpawn();
  };

  // FOV & Eye Height
  const fovSlider = el<HTMLInputElement>('fov-slider');
  const fovDisplay = el('fov-display');
  fovSlider.oninput = () => {
    fov = Number(fovSlider.value);
    if (fovDisplay) fovDisplay.textContent = `${fov}°`;
  };

  const eyeSlider = el<HTMLInputElement>('eye-height-slider');
  const eyeDisplay = el('eye-height-display');
  eyeSlider.oninput = () => {
    controls.eyeHeight = Number(eyeSlider.value) / 10;
    if (eyeDisplay) eyeDisplay.textContent = `${controls.eyeHeight.toFixed(1)}m`;
  };

  // Initial UI Setup
  drawWelcomeList();
  updateModeUI('walk', true);
  handleResize();

  // Main Render Loop
  let lastTime = performance.now();
  let frameCount = 0;
  let fpsTimer = performance.now();
  let currentFps = 60;

  function loop(currentTime: number) {
    const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
    lastTime = currentTime;

    frameCount++;
    if (currentTime - fpsTimer >= 500) {
      currentFps = Math.round((frameCount * 1000) / (currentTime - fpsTimer));
      frameCount = 0;
      fpsTimer = currentTime;
    }

    if (document.body.classList.contains('map-view')) {
      controls.update(dt);
      if (seamlessEnabled && currentTime - lastSeamlessScan >= 600) {
        lastSeamlessScan = currentTime;
        void maintainSeamlessRegions();
      }

      scene.render(
        [controls.position[0], controls.position[1], controls.position[2]],
        controls.yaw,
        controls.pitch,
        canvas.width,
        canvas.height,
        isWireframe,
        fov
      );

      // Update telemetry
      const coordEl = el('coord-val');
      if (coordEl) {
        coordEl.textContent = `X: ${controls.position[0].toFixed(1)}  Y: ${controls.position[1].toFixed(1)}  Z: ${controls.position[2].toFixed(1)}`;
      }
      const statusEl = el('status');
      if (statusEl) {
        statusEl.textContent = `${currentFps} FPS`;
      }
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

async function runBootstrap() {
  try {
    await bootstrap();
  } catch (err: unknown) {
    recordAppError(err, 'bootstrap_root');
    const appContainer = document.getElementById('app') || document.body;
    appContainer.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:#0d0e0b;color:#e6dbbf;padding:24px;text-align:center;font-family:sans-serif;box-sizing:border-box;">
        <h2 style="margin:0 0 12px;color:#d9534f;font-size:20px;">多兰古雷格地图志 加载异常</h2>
        <p style="margin:0 0 16px;color:#aaa;font-size:14px;max-width:400px;line-height:1.6;">${(err as Error)?.message || '应用初始化遇到未知错误'}</p>
        <button onclick="location.reload()" style="background:#c5a04a;color:#111;border:none;border-radius:6px;padding:8px 20px;font-size:14px;cursor:pointer;font-weight:600;">重试</button>
      </div>
    `;
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    void runBootstrap();
  });
} else {
  void runBootstrap();
}
