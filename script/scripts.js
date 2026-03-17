tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: "#b91c1c", crimson: "#8b0000",
                gold: "#c9a84c", dark: "#0a0a0a", charcoal: "#1a1a1a",
            },
            fontFamily: {
                display: ['Playfair Display', 'Georgia', 'serif'],
                body: ['Cormorant Garamond', 'Georgia', 'serif'],
                sans: ['Raleway', 'sans-serif'],
            }
        }
    }
}


/* ── Navbar ── */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

    /* ── Mobile menu ── */
    document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.add('open');
    document.body.style.overflow = 'hidden';
});
    document.getElementById('mobile-close').addEventListener('click', closeMobile);
    function closeMobile() {
    document.getElementById('mobile-menu').classList.remove('open');
    document.body.style.overflow = '';
}

    /* ── Reveal on scroll ── */
    const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    document.querySelectorAll('#hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 300 + i * 180);
});

    /* ── Tabs ── */
    function showMenu(id, btn) {
    document.querySelectorAll('.menu-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('menu-' + id).classList.add('active');
    if (btn) btn.classList.add('active');
    // reset posición del carrusel al cambiar tab
    const track = document.getElementById('mc-' + id);
    if (track) { track.style.transform = 'translateX(0)'; mcPos['mc-' + id] = 0; }
}

    /* ── Carrusel carta ──
    Los botones viven en .mc-shell (padding:0 44px).
    El clip real es .menu-carousel-wrap (overflow:hidden).
    El track se traslada con translateX.
    */
    const mcPos = {};

    function moveCarousel(trackId, dir) {
    const track = document.getElementById(trackId);
    if (!track) return;
    const cards = track.querySelectorAll('.dish-card-c');
    if (!cards.length) return;

    // gap real del track
    const gap   = parseFloat(getComputedStyle(track).columnGap) || 20;
    const cardW = cards[0].offsetWidth + gap;
    const wrapW = track.parentElement.offsetWidth;          // .menu-carousel-wrap
    const vis   = Math.max(1, Math.floor(wrapW / cardW));
    const maxIdx = Math.max(0, cards.length - vis);

    mcPos[trackId] = mcPos[trackId] || 0;
    mcPos[trackId] = Math.min(Math.max(mcPos[trackId] + dir, 0), maxIdx);
    track.style.transform = `translateX(-${mcPos[trackId] * cardW}px)`;

    // estado disabled de los botones (hermanos en .mc-shell)
    const shell = track.closest('.mc-shell');
    if (shell) {
    shell.querySelector('.mc-btn.prev').disabled = (mcPos[trackId] === 0);
    shell.querySelector('.mc-btn.next').disabled = (mcPos[trackId] >= maxIdx);
}
}

    /* Touch swipe en carruseles de carta */
    document.querySelectorAll('.menu-carousel-track').forEach(track => {
    let sx = 0;
    track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 35) moveCarousel(track.id, dx < 0 ? 1 : -1);
});
});

    /* Inicializar: deshabilitar todos los "prev" al cargar */
    window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.mc-shell .mc-btn.prev').forEach(btn => btn.disabled = true);
});

    /* ── Carrusel galería Nosotros ── */
    (function () {
    const track  = document.getElementById('gallery-track');
    const slides = track.querySelectorAll('.gallery-slide');
    const dotsEl = document.getElementById('gallery-dots');
    let cur = 0, timer;

    slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'gallery-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
});

    function goTo(idx) {
    dotsEl.children[cur].classList.remove('active');
    cur = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${cur * 100}%)`;
    dotsEl.children[cur].classList.add('active');
    clearInterval(timer);
    timer = setInterval(() => goTo(cur + 1), 4500);
}

    document.getElementById('gallery-prev').addEventListener('click', () => goTo(cur - 1));
    document.getElementById('gallery-next').addEventListener('click', () => goTo(cur + 1));

    let sx = 0;
    track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? cur + 1 : cur - 1);
});

    timer = setInterval(() => goTo(cur + 1), 4500);
})();

// ── Carrusel de Áreas ──
(function () {
    const track  = document.getElementById('areas-track');
    const dotsEl = document.getElementById('areas-dots');
    if (!track || !dotsEl) return;

    const cards  = track.querySelectorAll('.area-card');
    const total  = cards.length;
    let cur = 0, timer;
    const GAP = 20; // px — debe coincidir con el gap del CSS

    function cardW() {
        return cards[0] ? cards[0].offsetWidth + GAP : 260;
    }
    function visible() {
        return Math.max(1, Math.floor(track.parentElement.offsetWidth / cardW()));
    }

    // Crear dots
    cards.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'gallery-dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(d);
    });

    function goTo(idx) {
        const maxIdx = Math.max(0, total - visible());
        const next   = Math.min(Math.max(idx, 0), maxIdx);
        if (dotsEl.children[cur]) dotsEl.children[cur].classList.remove('active');
        cur = next;
        track.style.transform = `translateX(-${cur * cardW()}px)`;
        if (dotsEl.children[cur]) dotsEl.children[cur].classList.add('active');
        clearInterval(timer);
        timer = setInterval(() => goTo(cur + 1 > Math.max(0, total - visible()) ? 0 : cur + 1), 5000);
    }

    document.getElementById('areas-prev').addEventListener('click', () => goTo(cur - 1));
    document.getElementById('areas-next').addEventListener('click', () => goTo(cur + 1 > Math.max(0, total - visible()) ? 0 : cur + 1));

    // Touch / swipe
    let sx = 0;
    track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 35) goTo(dx < 0 ? cur + 1 : cur - 1);
    });

    timer = setInterval(() => goTo(cur + 1 > Math.max(0, total - visible()) ? 0 : cur + 1), 5000);
})();

(function () {
    const TRACK_ID = 'mc-chef';
    let pos = 0;

    window.moveCarousel = (function (original) {
        return function (trackId, dir) {
            if (trackId !== TRACK_ID) return original(trackId, dir);

            const track = document.getElementById(trackId);
            if (!track) return;
            const cards = track.querySelectorAll('.chef-card');
            if (!cards.length) return;

            const gap    = parseFloat(getComputedStyle(track).columnGap) || 20;
            const cardW  = cards[0].offsetWidth + gap;
            const wrapW  = track.parentElement.offsetWidth;
            const vis    = Math.max(1, Math.floor(wrapW / cardW));
            const maxIdx = Math.max(0, cards.length - vis);

            pos = Math.min(Math.max(pos + dir, 0), maxIdx);
            track.style.transform = `translateX(-${pos * cardW}px)`;

            const shell = track.closest('.mc-shell');
            if (shell) {
                shell.querySelector('.mc-btn.prev').disabled = (pos === 0);
                shell.querySelector('.mc-btn.next').disabled = (pos >= maxIdx);
            }
        };
    })(window.moveCarousel);

    // Deshabilitar prev al inicio
    document.addEventListener('DOMContentLoaded', () => {
        const track = document.getElementById(TRACK_ID);
        if (!track) return;
        const shell = track.closest('.mc-shell');
        if (shell) shell.querySelector('.mc-btn.prev').disabled = true;
    });
})();