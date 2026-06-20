(function(){
  const canvas = document.getElementById('particleCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const maxParticles = prefersReduced ? 30 : 120;
  const particles = [];
  const palettes = {
    default: ['rgba(255,255,255,0.06)','rgba(255,255,255,0.03)'],
    galactic: ['rgba(167,139,250,0.18)','rgba(124,58,237,0.10)','rgba(99,102,241,0.06)']
  };
  palettes.neon = ['rgba(6,182,212,0.14)','rgba(99,102,241,0.06)','rgba(124,58,237,0.06)'];
  let currentPalette = palettes.default;

  function rand(min,max){return Math.random()*(max-min)+min}
  function create(){
    return {
      x: rand(0,w), y: rand(0,h),
      vx: rand(-0.2,0.2), vy: rand(-0.05,0.05),
      r: rand(0.6,3.6),
      hueIdx: Math.floor(rand(0,currentPalette.length))
    };
  }
  function init(){
    particles.length=0;
    for(let i=0;i<maxParticles;i++) particles.push(create());
  }
  function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; init(); }
  function step(){
    ctx.clearRect(0,0,w,h);
    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x < -20) p.x = w+20; if(p.x > w+20) p.x = -20;
      if(p.y < -20) p.y = h+20; if(p.y > h+20) p.y = -20;
      const col = currentPalette[p.hueIdx % currentPalette.length];
      ctx.beginPath();
      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*8);
      g.addColorStop(0,col);
      g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(step);
  }
  window.Particles = {
    setPalette(name){
      currentPalette = palettes[name] || palettes.default;
      // recolor particles
      for(const p of particles) p.hueIdx = Math.floor(rand(0,currentPalette.length));
    }
  };
  window.addEventListener('resize', resize);
  init();
  step();
})();
