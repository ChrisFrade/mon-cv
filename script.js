// --- VARIABLES ---
const themeBtn = document.getElementById('theme-toggle');
const html = document.documentElement;
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-bar a');

// Variable pour la couleur des particules (R, G, B)
// Par défaut : Turquoise clair
let particleColorRGB = '94, 234, 212'; 

// --- THÈME (JOUR/NUIT) ---
const updateTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('pref-theme', theme);
    const icon = theme === 'light' ? 'fa-sun' : 'fa-moon';
    themeBtn.querySelector('i').className = `fa-solid ${icon}`;

    // --- LOGIQUE DE CHANGEMENT DE COULEUR DES PARTICULES ---
    if (theme === 'light') {
        // Mode Jour : On met les particules en BLEU FONCÉ (presque noir)
        particleColorRGB = '11, 17, 33'; 
    } else {
        // Mode Nuit : On remet les particules en TURQUOISE CLAIR
        particleColorRGB = '94, 234, 212';
    }
};

// Init Thème
const saved = localStorage.getItem('pref-theme');
if (saved) updateTheme(saved);
else updateTheme(new Date().getHours() >= 19 || new Date().getHours() < 7 ? 'dark' : 'light');

themeBtn.onclick = (e) => {
    e.preventDefault();
    updateTheme(html.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
};

// --- SCROLL ACTIVE LINK ---
window.addEventListener('scroll', () => {
    let current = "";
    const scrollPos = window.scrollY + 200; 

    sections.forEach(section => {
        if (scrollPos >= section.offsetTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// --- MODALE CV ---
const modal = document.getElementById('cvModal');
const btnCV = document.getElementById('openCV');
const closeCV = document.querySelector('.close-modal');

if(btnCV) {
    btnCV.onclick = () => modal.style.display = "flex";
    closeCV.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
}


/* ========================================= */
/* ANIMATION CANVAS (PARTICULES)             */
/* ========================================= */

const canvas = document.getElementById('canvas-bg');
// Vérification de sécurité au cas où le canvas n'est pas dans le HTML
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 100; 
    const connectionDistance = 150; 
    const mouse = { x: null, y: null };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.radius = 2;
        }

        draw() {
            // Utilisation de la variable dynamique particleColorRGB
            ctx.fillStyle = `rgba(${particleColorRGB}, 0.8)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        update() {
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            this.x += this.vx;
            this.y += this.vy;
            this.draw();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            
            // Interaction Souris
            let dxMouse = particles[i].x - mouse.x;
            let dyMouse = particles[i].y - mouse.y;
            let distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
            if (distMouse < connectionDistance) {
                // Lignes dynamiques vers la souris
                ctx.strokeStyle = `rgba(${particleColorRGB}, ${1 - distMouse/connectionDistance})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }

            // Lignes entre particules
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    // Lignes dynamiques entre points
                    ctx.strokeStyle = `rgba(${particleColorRGB}, ${1 - distance/connectionDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
}
