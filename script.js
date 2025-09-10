document.addEventListener('DOMContentLoaded', () => {

  // --- Particle BG ---
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  function Particle(){
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 1.7 + 0.6;
    this.speed = Math.random() * 0.5 + 0.1;
    this.angle = Math.random() * 2 * Math.PI;
    this.color = ['#2563EB', '#14B8A6', '#F9FAFB'][Math.floor(Math.random()*3)];
  }

  Particle.prototype.move = function(){
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    // wrap around screen edges
    if(this.x < 0) this.x = canvas.width;
    if(this.x > canvas.width) this.x = 0;
    if(this.y < 0) this.y = canvas.height;
    if(this.y > canvas.height) this.y = 0;
  }

  function drawParticles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let p of particles){
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.38;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      p.move();
    }
    requestAnimationFrame(drawParticles);
  }

  function initParticles(){
    particles = [];
    let count = Math.floor(window.innerWidth / 12);
    if (count > 150) count = 150; // Performance cap for large screens
    for(let i=0; i<count; i++) particles.push(new Particle());
  }
  
  resizeCanvas();
  initParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });


  // --- Animate in on scroll (using IntersectionObserver for performance) ---
  const animatedElements = document.querySelectorAll('.animate-in, .project-card, .timeline-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => observer.observe(el));
  
  // --- Active Nav Link on Scroll & Smooth Scroll on Click ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  const activateNavLink = () => {
    let current = 'hero';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if(pageYOffset >= sectionTop - 80){ // 80px offset for fixed navbar height
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(a => {
        a.classList.remove('active');
        if(a.getAttribute('href').includes(current)){
            a.classList.add('active');
        }
    });
  };
  
  window.addEventListener('scroll', activateNavLink);

  navLinks.forEach(link=>{
    link.addEventListener('click', function(e){
      const href = link.getAttribute('href');
      if(href.startsWith('#')){
        e.preventDefault();
        document.querySelector(href).scrollIntoView({behavior:'smooth'});
      }
    });
  });

  // --- Hamburger Menu Toggle ---
  const hamburger = document.querySelector('.hamburger-menu');
  const nav = document.querySelector('.navbar');
  
  hamburger.addEventListener('click', () => {
      nav.classList.toggle('nav-open');
  });

  // Close mobile nav when a link is clicked
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          if (nav.classList.contains('nav-open')) {
              nav.classList.remove('nav-open');
          }
      });
  });

  // --- Contact Form ---
  const form = document.querySelector('.contact-form');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const successMessage = this.querySelector('.form-success');
    successMessage.style.display = 'block';
    this.reset();
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 4000);
  });
});