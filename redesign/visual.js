// Original illustrative network. Coordinates are generated, not research observations.
(() => {
  const svg = document.querySelector('#constellation');
  const edges = document.querySelector('#edges');
  const dots = document.querySelector('#dots');
  const button = document.querySelector('#motion');
  button.hidden = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const lowPower = navigator.connection?.saveData || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
  const NS = 'http://www.w3.org/2000/svg';
  let seed = 93;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const hubs = [{x:180,y:180},{x:457,y:315},{x:175,y:410}];
  const nodes = Array.from({length:lowPower ? 100 : 190}, (_, i) => {
    const hub = hubs[i % 3]; const angle = random() * Math.PI * 2;
    const radius = Math.pow(random(), .65) * (i % 3 === 1 ? 135 : 118);
    return {x:hub.x+Math.cos(angle)*radius,y:hub.y+Math.sin(angle)*radius,phase:random()*6.28,r:random()*1.9+.7,group:i%3};
  });
  const el = (name, attrs, parent) => {const n=document.createElementNS(NS,name);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));parent.append(n);return n;};
  const lines = [];
  nodes.forEach((n,i) => {
    n.el=el('circle',{cx:n.x,cy:n.y,r:n.r,fill:['#6de0d0','#e8b970','#b5cce0'][n.group],opacity:.5+random()*.4},dots);
    nodes.slice(i+1).forEach((m,j) => {
      const d = Math.hypot(n.x-m.x,n.y-m.y);
      if(d<57 && random()>.42) lines.push({a:n,b:m,el:el('line',{x1:n.x,y1:n.y,x2:m.x,y2:m.y,stroke:['#6de0d0','#e8b970','#b5cce0'][n.group],'stroke-opacity':.07+(1-d/57)*.2,'stroke-width':.7},edges)});
    });
  });
  [[180,180,457,315],[457,315,175,410],[175,410,180,180]].forEach(([x1,y1,x2,y2])=>el('path',{d:`M ${x1} ${y1} Q 330 235 ${x2} ${y2}`,fill:'none',stroke:'#90b6bd','stroke-opacity':.25,'stroke-dasharray':'2 7'},edges));
  document.querySelector('.layout-controls').hidden=false;
  const layouts=[...document.querySelectorAll('[data-layout]')];
  nodes.forEach(n=>{n.originalX=n.x;n.originalY=n.y});
  layouts.forEach(control=>control.addEventListener('click',()=>{
    layouts.forEach(c=>c.setAttribute('aria-pressed',String(c===control)));
    const mode=control.dataset.layout;
    nodes.forEach((n,i)=>{
      if(mode==='flow'){n.x=70+(i/(nodes.length-1))*510;n.y=275+Math.sin(i*.11)*100+(i%3-1)*28;}
      else if(mode==='structure'){n.x=90+(i%16)*31;n.y=105+Math.floor(i/16)*27;}
      else{n.x=n.originalX;n.y=n.originalY;}
      n.el.setAttribute('cx',n.x);n.el.setAttribute('cy',n.y);
    });
    lines.forEach(l=>{l.el.setAttribute('x1',l.a.x);l.el.setAttribute('y1',l.a.y);l.el.setAttribute('x2',l.b.x);l.el.setAttribute('y2',l.b.y);});
  }));
  let paused = reduced.matches || lowPower, visible = true, frame = null, elapsed=0, previous=0;
  function label(){button.textContent=paused?'Resume motion ▷':'Pause motion Ⅱ';button.setAttribute('aria-pressed',String(paused));}
  function draw(time){
    frame=null;if(paused||!visible||document.hidden){previous=0;return;}
    if(previous)elapsed+=Math.min(time-previous,50);previous=time;
    nodes.forEach(n=>{n.dx=n.x+Math.sin(elapsed*.00022+n.phase)*3;n.dy=n.y+Math.cos(elapsed*.00018+n.phase)*3;n.el.setAttribute('cx',n.dx);n.el.setAttribute('cy',n.dy);});
    lines.forEach(l=>{l.el.setAttribute('x1',l.a.dx);l.el.setAttribute('y1',l.a.dy);l.el.setAttribute('x2',l.b.dx);l.el.setAttribute('y2',l.b.dy);});
    frame=requestAnimationFrame(draw);
  }
  function sync(){label();if(!paused&&visible&&!document.hidden&&frame===null)frame=requestAnimationFrame(draw);}
  button.addEventListener('click',()=>{paused=!paused;sync();});
  reduced.addEventListener('change',()=>{paused=reduced.matches;sync();});
  document.addEventListener('visibilitychange',sync);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.05}).observe(svg);
  document.body.classList.add('ready');sync();
})();
