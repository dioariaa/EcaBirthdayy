// script.js — per‑page audio with smart autoplay (v2)
// HOW TO USE:
// 1) In every page, set <body data-audio="assets/audio/trackX.mp3">
// 2) Keep a <button class="btn-play">▶</button> in the hero.
// 3) For links that should auto‑play next page, add attribute: data-autoplay-next
//    Example: <a href="track2.html" data-autoplay-next>Next →</a>

(function(){
  const btn = document.querySelector('.btn-play');
  const src = document.body.getAttribute('data-audio');
  if(!src) return; // nothing to play on this page

  const audio = new Audio();
  audio.src = src;
  audio.preload = 'metadata';
  audio.volume = 0.9;

  // cross-page allow flag
  const allowKey = 'autoPlayAllowed';
  const nextKey  = 'autoPlayNext';

  const setIcon = () => {
    if(!btn) return;
    btn.textContent = audio.paused ? '▶' : '❚❚';
    btn.setAttribute('aria-pressed', audio.paused ? 'false' : 'true');
  };

  const allowAutoplay = () => localStorage.getItem(allowKey) === '1';
  const markAllowed   = () => localStorage.setItem(allowKey,'1');

  const tryPlay = () => {
    // if user has interacted before, try normal play
    if(allowAutoplay()){
      audio.play().then(setIcon).catch(()=>{});
      return;
    }
    // silent autoplay hack (muted > unmuted)
    audio.muted = true;
    audio.play().then(()=>{
      setTimeout(()=>{ audio.muted = false; setIcon(); }, 150);
      // if this worked, remember it
      markAllowed();
    }).catch(()=>{ /* ignore until user clicks */ });
  };

  // Button toggle
  if(btn){
    btn.addEventListener('click', () => {
      markAllowed();
      if(audio.paused){ audio.play().catch(()=>{}); }
      else { audio.pause(); }
      setIcon();
    });
  }

  // Stop when leaving the page / tab hidden
  window.addEventListener('pagehide', ()=> audio.pause());
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden) audio.pause();
    setIcon();
  });

  // Spacebar toggles play (unless typing)
  document.addEventListener('keydown', (e)=>{
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    if(e.code === 'Space' && tag !== 'input' && tag !== 'textarea'){
      e.preventDefault();
      if(btn) btn.click();
    }
  });

  // Links that should trigger autoplay on the next page
  document.querySelectorAll('a[data-autoplay-next]').forEach(a=>{
    a.addEventListener('click', ()=>{
      localStorage.setItem(nextKey, '1');
      markAllowed();
    });
  });

  // If coming from a page that set autoplay-next, try to play immediately
  if(localStorage.getItem(nextKey) === '1'){
    localStorage.removeItem(nextKey);
    markAllowed();
    tryPlay();
  } else {
    // otherwise, attempt silent autoplay once
    tryPlay();
  }

  setIcon();
})();

// simple sidebar toggle for mobile
document.addEventListener('click', (e)=>{
  const toggle = document.getElementById('navToggle');
  const sidebar = document.querySelector('.sidebar');
  if(!toggle || !sidebar) return;
});
(function(){
  const btn = document.getElementById('navToggle');
  const sidebar = document.querySelector('.sidebar');
  if(!btn || !sidebar) return;
  btn.addEventListener('click', ()=> {
    sidebar.classList.toggle('open');
    // if using CSS to show .sidebar.open on mobile:
  });
})();



