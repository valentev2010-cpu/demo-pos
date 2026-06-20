(function(){
  // Update CSS variables for spotlight and simple parallax on panels
  const root = document.documentElement;
  let mouse = {x: window.innerWidth/2, y: window.innerHeight/2};
  let raf = null;

  function onMove(e){
    mouse.x = e.clientX || (e.touches && e.touches[0].clientX) || mouse.x;
    mouse.y = e.clientY || (e.touches && e.touches[0].clientY) || mouse.y;
    if(!raf) raf = requestAnimationFrame(update);
  }

  function update(){
    raf = null;
    const xPct = (mouse.x / window.innerWidth) * 100;
    const yPct = (mouse.y / window.innerHeight) * 100;
    root.style.setProperty('--mouse-x', xPct + '%');
    root.style.setProperty('--mouse-y', yPct + '%');

    // Parallax tilt for visible panels
    const tiltAmount = 12; // px
    const rotateAmount = 6; // deg
    const nx = (xPct - 50) / 50; // -1..1
    const ny = (yPct - 50) / 50;
    const panels = document.querySelectorAll('.hero-panel, .card');
    panels.forEach((el, i) => {
      const depth = 1 + (i % 5) * 0.06; // subtle depth variation
      const tx = -nx * tiltAmount * depth;
      const ty = -ny * tiltAmount * depth;
      const rz = nx * rotateAmount * depth;
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateZ(${rz}deg)`;
      el.classList.add('parallax-tilt');
    });
  }

  window.addEventListener('mousemove', onMove, {passive:true});
  window.addEventListener('touchmove', onMove, {passive:true});
  window.addEventListener('resize', () => { /* reset on resize */ root.style.setProperty('--mouse-x','50%'); root.style.setProperty('--mouse-y','50%'); });

  // Cinematic toggle
  const cinemaToggle = document.getElementById('cinemaToggle');
  if(cinemaToggle){
    cinemaToggle.addEventListener('change', (e)=>{
      if(e.target.checked) document.documentElement.classList.add('cinematic');
      else document.documentElement.classList.remove('cinematic');
    });
  }

  // Galactic theme toggle (preserve animations)
  const colorBtn = document.getElementById('changeColorBtn');
  const THEME_KEY = 'themeGalactic';
  function setTheme(active){
    if(active) document.documentElement.classList.add('theme-galactic');
    else document.documentElement.classList.remove('theme-galactic');
    if(colorBtn) colorBtn.textContent = active ? 'Restablecer color' : 'Cambiar color de la app';
  }
  if(colorBtn){
    colorBtn.addEventListener('click', ()=>{
      const isActive = !document.documentElement.classList.contains('theme-galactic');
      setTheme(isActive);
      try{ localStorage.setItem(THEME_KEY, isActive ? '1' : '0'); }catch(e){}
    });
  }
  // Floating button also toggles theme (visible alternative)
  const colorBtnFloat = document.getElementById('changeColorBtnFloat');
  if(colorBtnFloat){
    colorBtnFloat.addEventListener('click', ()=>{
      const isActive = !document.documentElement.classList.contains('theme-galactic');
      setTheme(isActive);
      try{ localStorage.setItem(THEME_KEY, isActive ? '1' : '0'); }catch(e){}
    });
  }
  // Theme cycle button (cycles multiple palettes)
  const themeCycleBtn = document.getElementById('themeCycleBtn');
  const THEMES = ['default','galactic','neon'];
  function applyTheme(name){
    // remove known theme classes
    document.documentElement.classList.remove('theme-galactic','theme-neon');
    if(name && name !== 'default') document.documentElement.classList.add(`theme-${name}`);
    if(window.Particles){
      if(name === 'galactic') window.Particles.setPalette('galactic');
      else if(name === 'neon') window.Particles.setPalette('neon');
      else window.Particles.setPalette('default');
    }
    if(themeCycleBtn){
      themeCycleBtn.textContent = name === 'default' ? 'Cambiar color' : `Tema: ${name}`;
    }
    try{ localStorage.setItem('themeSelected', name); }catch(e){}
  }
  if(themeCycleBtn){
    themeCycleBtn.addEventListener('click', ()=>{
      const cur = localStorage.getItem('themeSelected') || 'default';
      const idx = Math.max(0, THEMES.indexOf(cur));
      const next = THEMES[(idx+1) % THEMES.length];
      applyTheme(next);
    });
  }
  try{
    const saved = localStorage.getItem('themeSelected');
    if(saved) applyTheme(saved);
    else {
      const cinemaSaved = localStorage.getItem(THEME_KEY);
      if(cinemaSaved === '1') setTheme(true);
    }
  }catch(e){}
  // Update particle palette when theme changes
  const obs = new MutationObserver(()=>{
    if(window.Particles){
      const active = document.documentElement.classList.contains('theme-galactic');
      window.Particles.setPalette(active ? 'galactic' : 'default');
    }
  });
  obs.observe(document.documentElement,{attributes:true,attributeFilter:['class']});

  // Entrance animation: add 'loaded' to body when window finishes loading
  window.addEventListener('load', ()=>{
    setTimeout(()=> document.body.classList.add('loaded'), 80);
  });

  // Gentle idle animation to nudge panels back to neutral occasionally
  let idleTimer = null;
  function resetPanels(){
    const panels = document.querySelectorAll('.hero-panel, .card');
    panels.forEach(el=> el.style.transform='translate3d(0,0,0) rotateZ(0deg)');
  }
  document.addEventListener('mouseout', ()=>{ idleTimer = setTimeout(resetPanels, 1200); });
  document.addEventListener('mouseover', ()=>{ if(idleTimer) clearTimeout(idleTimer); });

  // Initialize positions
  root.style.setProperty('--mouse-x','50%');
  root.style.setProperty('--mouse-y','50%');
})();
