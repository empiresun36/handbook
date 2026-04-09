/* ══════════════════════════════════════
   社區管理規劃手冊 - 共用 JavaScript
   修改此檔案會影響所有頁面互動
══════════════════════════════════════ */

/* 抽屜選單開關 */
function openNav() {
  document.getElementById('navDrawer').classList.add('open');
  document.getElementById('navOverlay').classList.add('open');
}
function closeNav() {
  document.getElementById('navDrawer').classList.remove('open');
  document.getElementById('navOverlay').classList.remove('open');
}

/* 章節折疊/展開 */
function toggleChapter(id) {
  const card = document.getElementById(id);
  card.classList.toggle('open');
}

/* Tab 切換 */
function switchTab(btn, targetId) {
  btn.closest('.tab-bar').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(targetId).classList.add('active');
}

/* 標記底部導覽列目前頁面 */
function markActiveNav(pageId) {
  document.querySelectorAll('.bottom-nav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.page === pageId);
  });
}


/* ══════════════════════════════════════
   Android PWA 安裝引導橫幅
   Chrome 觸發 beforeinstallprompt 時顯示
══════════════════════════════════════ */
let deferredInstallPrompt = null;

(function injectInstallBanner() {
  const banner = document.createElement('div');
  banner.id = 'install-banner';
  banner.innerHTML = `
    <div id="install-banner-inner">
      <div id="install-banner-icon">📱</div>
      <div id="install-banner-text">
        <strong>加入主畫面</strong>
        <span>像 App 一樣快速開啟，支援離線瀏覽</span>
      </div>
      <button id="install-btn" onclick="installPWA()">安裝</button>
      <button id="install-close" onclick="dismissBanner()">✕</button>
    </div>`;
  document.body.appendChild(banner);
})();

(function injectInstallStyle() {
  const s = document.createElement('style');
  s.textContent = [
    '#install-banner{position:fixed;bottom:calc(64px + env(safe-area-inset-bottom,0px));left:12px;right:12px;z-index:199;transform:translateY(120%);transition:transform .4s cubic-bezier(.4,0,.2,1);pointer-events:none}',
    '#install-banner.show{transform:translateY(0);pointer-events:all}',
    '#install-banner-inner{background:#fff;border:1px solid #e0ddd5;border-radius:16px;padding:12px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 24px rgba(26,58,42,.18)}',
    '#install-banner-icon{font-size:28px;flex-shrink:0}',
    '#install-banner-text{flex:1;display:flex;flex-direction:column;gap:1px}',
    '#install-banner-text strong{font-size:14px;color:#1a3a2a;font-family:"Noto Sans TC",sans-serif;font-weight:500}',
    '#install-banner-text span{font-size:11px;color:#9a9a90;font-family:"Noto Sans TC",sans-serif}',
    '#install-btn{background:#1a3a2a;color:#e8d5a8;border:none;border-radius:10px;padding:8px 14px;font-size:13px;font-weight:500;font-family:"Noto Sans TC",sans-serif;cursor:pointer;flex-shrink:0}',
    '#install-btn:hover{background:#2d5a42}',
    '#install-close{background:none;border:none;color:#9a9a90;font-size:16px;cursor:pointer;padding:4px;flex-shrink:0}'
  ].join('');
  document.head.appendChild(s);
})();

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  setTimeout(() => {
    const b = document.getElementById('install-banner');
    if (b) b.classList.add('show');
  }, 2000);
});

function installPWA() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then(() => { deferredInstallPrompt = null; });
  }
  dismissBanner();
}

function dismissBanner() {
  const b = document.getElementById('install-banner');
  if (b) b.remove();
}

window.addEventListener('appinstalled', () => {
  dismissBanner();
  deferredInstallPrompt = null;
});

/* ══════════════════════════════════════
   背景音樂播放器
   ── 使用 Pixabay 免費鋼琴音樂（CC0）──
   ── 如需換曲，修改 TRACKS 陣列中的 url ──
══════════════════════════════════════ */
const TRACKS = [
  {
    title: '🎹 輕柔鋼琴 - Relaxing Piano',
    url: '1.mp3'
  },
  {
    title: '🎹 寧靜時光 - Peaceful Moment',
    url: '2.mp3'
  },
  {
    title: '🎹 溫柔旋律 - Gentle Melody',
    url: '3.mp3'
  }
];

let trackIndex  = 0;
let bgmStarted  = false;
let bgmPlaying  = false;
let volumeOpen  = false;

/* 注入播放器 HTML 到 body */
(function injectPlayer() {
  const html = `
    <audio id="bgm" preload="auto"></audio>
    <div id="music-toast"></div>
    <div id="music-player">
      <div id="music-volume-wrap">
        <label>音量</label>
        <input id="music-volume" type="range" min="0" max="1" step="0.05" value="0.35"
               orient="vertical" oninput="setVolume(this.value)">
      </div>
      <button id="music-btn" onclick="toggleMusic()" oncontextmenu="toggleVolume(event)" title="點擊播放／暫停｜長按調音量">
        <span id="music-icon">🎵</span>
      </button>
      <div id="music-label">背景音樂</div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);

  /* 長按顯示音量 */
  let holdTimer;
  const btn = document.getElementById('music-btn');
  btn.addEventListener('touchstart', () => { holdTimer = setTimeout(toggleVolume, 600); });
  btn.addEventListener('touchend',   () => clearTimeout(holdTimer));
})();

/* 載入指定曲目 */
function loadTrack(idx) {
  const audio = document.getElementById('bgm');
  audio.src = TRACKS[idx].url;
  audio.volume = parseFloat(document.getElementById('music-volume').value);
  audio.onended = nextTrack;
}

/* 下一首 */
function nextTrack() {
  trackIndex = (trackIndex + 1) % TRACKS.length;
  loadTrack(trackIndex);
  document.getElementById('bgm').play().catch(() => {});
  showToast(TRACKS[trackIndex].title);
}

/* 播放 / 暫停切換 */
function toggleMusic() {
  const audio = document.getElementById('bgm');
  const btn   = document.getElementById('music-btn');
  const icon  = document.getElementById('music-icon');

  if (!bgmStarted) {
    loadTrack(trackIndex);
    bgmStarted = true;
  }

  if (bgmPlaying) {
    audio.pause();
    btn.classList.remove('playing');
    icon.textContent = '🎵';
    document.getElementById('music-label').textContent = '背景音樂';
  } else {
    audio.play().then(() => {
      btn.classList.add('playing');
      icon.textContent = '🔉';
      document.getElementById('music-label').textContent = '播放中';
      showToast(TRACKS[trackIndex].title);
    }).catch(() => {});
  }
  bgmPlaying = !bgmPlaying;
}

/* 音量控制 */
function setVolume(val) {
  const audio = document.getElementById('bgm');
  if (audio) audio.volume = parseFloat(val);
}

function toggleVolume(e) {
  if (e) e.preventDefault();
  volumeOpen = !volumeOpen;
  document.getElementById('music-volume-wrap').classList.toggle('show', volumeOpen);
}

/* 曲目名稱提示泡泡 */
function showToast(msg) {
  const toast = document.getElementById('music-toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* 頁面首次互動後自動嘗試播放（繞過瀏覽器限制） */
function attemptAutoPlay() {
  if (bgmStarted) return;
  bgmStarted = true;
  loadTrack(trackIndex);
  const audio = document.getElementById('bgm');
  audio.play().then(() => {
    bgmPlaying = true;
    document.getElementById('music-btn').classList.add('playing');
    document.getElementById('music-icon').textContent = '🔉';
    document.getElementById('music-label').textContent = '播放中';
    showToast(TRACKS[trackIndex].title);
  }).catch(() => {
    /* 瀏覽器阻擋時靜默失敗，等使用者點按鈕 */
    bgmStarted = false;
  });
  document.removeEventListener('touchstart', attemptAutoPlay);
  document.removeEventListener('click',      attemptAutoPlay);
}

/* 綁定首次互動事件 */
document.addEventListener('DOMContentLoaded', () => {
  /* 桌機：0.5秒後嘗試自動播放 */
  setTimeout(attemptAutoPlay, 500);
  /* 手機：等第一次觸碰 */
  document.addEventListener('touchstart', attemptAutoPlay, { once: true });
  document.addEventListener('click',      attemptAutoPlay, { once: true });
});
