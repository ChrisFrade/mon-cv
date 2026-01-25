// --- VARIABLES ---
const themeBtn = document.getElementById('theme-toggle');
const html = document.documentElement;
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-bar a');

// --- THÈME (JOUR/NUIT) ---
const updateTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('pref-theme', theme);
    const icon = theme === 'light' ? 'fa-sun' : 'fa-moon';
    themeBtn.querySelector('i').className = `fa-solid ${icon}`;
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
    const scrollPos = window.scrollY + 200; // Offset pour détection anticipée

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

// --- MODALE CV ( Si je réactive le bouton CV plus tard) ---
const modal = document.getElementById('cvModal');
const btnCV = document.getElementById('openCV');
const closeCV = document.querySelector('.close-modal');

if(btnCV) {
    btnCV.onclick = () => modal.style.display = "flex";
    closeCV.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
}