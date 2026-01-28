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
