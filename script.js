// ── SPLASH ──
window.addEventListener('load',()=>{
  const fill=document.getElementById('progress-fill');
  const splash=document.getElementById('splash');
  setTimeout(()=>fill.style.width='100%',50);
  setTimeout(()=>splash.classList.add('hidden'),1700);
});

// ── CANVAS PARTICLES ──
const canvas=document.getElementById('bg-canvas');
const ctx=canvas.getContext('2d');
let W,H,particles=[],lines=[],frame;
const isMobile=()=>window.innerWidth<768;

function resize(){
  W=canvas.width=window.innerWidth;
  H=canvas.height=window.innerHeight;
}
resize();
window.addEventListener('resize',()=>{resize();init()});

class Particle{
  constructor(){this.reset()}
  reset(){
    this.x=Math.random()*W;this.y=Math.random()*H;
    this.vx=(Math.random()-0.5)*0.25;this.vy=(Math.random()-0.5)*0.25;
    this.r=Math.random()*1.5+0.5;this.alpha=Math.random()*0.5+0.1;
    this.color=Math.random()>0.5?'6,182,212':'139,92,246'
  }
  update(){
    this.x+=this.vx;this.y+=this.vy;
    if(this.x<0||this.x>W||this.y<0||this.y>H)this.reset()
  }
  draw(){
    ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(${this.color},${this.alpha})`;ctx.fill()
  }
}

function init(){
  const count=isMobile()?40:100;
  particles=Array.from({length:count},()=>new Particle());
}
init();

let mx=-9999,my=-9999;
window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});

function drawConnections(){
  const maxDist=isMobile()?80:120;
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<maxDist){
        ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);
        ctx.strokeStyle=`rgba(6,182,212,${0.05*(1-d/maxDist)})`;ctx.lineWidth=0.5;ctx.stroke()
      }
    }
    // mouse attraction
    const dx=particles[i].x-mx,dy=particles[i].y-my;
    const d=Math.sqrt(dx*dx+dy*dy);
    if(d<150){
      ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(mx,my);
      ctx.strokeStyle=`rgba(6,182,212,${0.1*(1-d/150)})`;ctx.lineWidth=0.5;ctx.stroke()
    }
  }
}

// Mesh gradient blobs
const blobs=[
  {x:0.2,y:0.3,r:300,c:'6,182,212'},
  {x:0.8,y:0.7,r:350,c:'139,92,246'},
  {x:0.5,y:0.1,r:200,c:'6,182,212'}
];
let t=0;
function drawMesh(){
  blobs.forEach((b,i)=>{
    const bx=W*(b.x+0.03*Math.sin(t*0.3+i)),by=H*(b.y+0.03*Math.cos(t*0.4+i));
    const g=ctx.createRadialGradient(bx,by,0,bx,by,b.r);
    g.addColorStop(0,`rgba(${b.c},0.04)`);g.addColorStop(1,'transparent');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H)
  })
}

function loop(){
  frame=requestAnimationFrame(loop);
  ctx.clearRect(0,0,W,H);
  t+=0.01;
  drawMesh();
  particles.forEach(p=>{p.update();p.draw()});
  drawConnections();
}
loop();

// ── SCROLL PROGRESS ──
window.addEventListener('scroll',()=>{
  const prog=document.getElementById('scroll-progress');
  const pct=window.scrollY/(document.body.scrollHeight-window.innerHeight);
  prog.style.transform=`scaleX(${pct})`;
},{ passive:true });

// ── SCROLL REVEAL ──
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// ── MOBILE MENU ──
function toggleMobile(){
  const m=document.getElementById('mobile-menu');
  m.classList.toggle('open')
}
function closeMobile(){
  document.getElementById('mobile-menu').classList.remove('open')
}

// ── ENHANCEMENTS ──

// Typing effect for hero role
const heroRole = document.querySelector('.hero-role');
const text = heroRole.textContent;
heroRole.textContent = '';
let i = 0;
function typeWriter() {
  if (i < text.length) {
    heroRole.textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, 50);
  }
}
setTimeout(typeWriter, 2000); // Start after splash

// Parallax effect
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const rate = scrolled * -0.5;
  canvas.style.transform = `translateY(${rate}px)`;
});

// Theme toggle
const themeToggle = document.createElement('div');
themeToggle.id = 'theme-toggle';
themeToggle.innerHTML = '🌙';
document.body.appendChild(themeToggle);

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  themeToggle.innerHTML = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Add particle explosion on click
canvas.addEventListener('click', (e) => {
  for (let i = 0; i < 10; i++) {
    const p = new Particle();
    p.x = e.clientX;
    p.y = e.clientY;
    p.vx = (Math.random() - 0.5) * 2;
    p.vy = (Math.random() - 0.5) * 2;
    particles.push(p);
  }
  setTimeout(() => {
    particles = particles.slice(0, isMobile() ? 40 : 100);
  }, 2000);
});

// Random color change for gradient on hover
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    const colors = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    btn.style.background = `linear-gradient(135deg, ${randomColor}, #8b5cf6)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = 'linear-gradient(135deg, var(--cyan), var(--purple))';
  });
});