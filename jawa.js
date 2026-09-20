(function() {
    const line1Text = "WELCOME TO";
    const line2Text = "XI PPLG";
    const speed = 90;
    const delayBetweenLines = 300;

    function typeText(el, text, index, callback) {
        if (!el) return;
        if (index < text.length) {
            el.textContent += text.charAt(index);
            setTimeout(() => typeText(el, text, index + 1, callback), speed);
        } else if (callback) {
            callback();
        }
    }

    function startTyping() {
        const el1 = document.getElementById('typing-line1');
        const el2 = document.getElementById('typing-line2');
        if (!el1 || !el2) {
            document.documentElement.classList.remove('is-typing');
            return;
        }
        el1.textContent = "";
        el2.textContent = "";
        typeText(el1, line1Text, 0, () => {
            setTimeout(() => {
                typeText(el2, line2Text, 0, () => {
                    document.documentElement.classList.remove('is-typing');
                });
            }, delayBetweenLines);
        });
    }

    window.addEventListener('load', startTyping);
})();

const PHOTO_FOLDER = "galeri";
const PHOTO_EXT = "jpg";

const students = [
    "ABDUL KODIR JAELANI",
    "AGUSTINA RAHMADHANI PUTRI",
    "AIRA SABRINA MEI ISNAINI",
    "ALAN EKA SAPUTRA",
    "ALFATTA NANDA HERYASTAMA",
    "AMALIA ZARINA",
    "BAGAS AL FARIZY",
    "DAVID DWI HANDHIKA",
    "DE ALVIN INSAN BAGJA",
    "DEWI CANDRANINGTYAS",
    "DHANY PRATAMA",
    "DINI FADHILAH FAKHRUNNISA",
    "EFGA VALENTINA KANYA",
    "ENDRI DWI OKTAVIANO",
    "FAHRI ABDILLAH",
    "FARAH DIARI AGASI",
    "FITRI DIAH NUR RIZQI",
    "HAFIYYAN TSAQIF ARROFI",
    "HARDIN RAHMADINA",
    "HELGA YUNI ASTIKA",
    "KHALILA DWI ARYANI",
    "KIRANA AYU ALMASAH",
    "M ZARAHAN ADIS FARRAS",
    "MUHAMMAD ADLI FAUZI",
    "MUHAMMAD ADLU LATIIP",
    "MUHAMMAD FAHMI",
    "MUHAMMAD RAIHAN AL HADI",
    "MUHAMMAD WILDAN MAULANA",
    "NAKEYSA ILMA ALMAIRA",
    "NIHAYATUL AZKIA",
    "QONITA ZOYA ZAKIYYA",
    "RIAN ANDIKA PRATAMA",
    "RISMA AURELIA",
    "SALSABILA AWALIYAH FITRI",
    "SYAFA PUTRI YASA",
    "ZAZKIA AZZAHRA"
];

const specialRoles = {
    1: "Wakil Ketua Kelas",
    24: "Ketua Kelas",
    25: "Bendahara",
    36: "Sekretaris"
};

const carouselViewport = document.getElementById('carousel-viewport');
const carouselPrevBtn = document.getElementById('carousel-prev');
const carouselNextBtn = document.getElementById('carousel-next');

function updateCarouselButtons() {
    if (!carouselViewport || !carouselPrevBtn || !carouselNextBtn) return;
    const maxScroll = carouselViewport.scrollWidth - carouselViewport.clientWidth;
    carouselPrevBtn.disabled = carouselViewport.scrollLeft <= 4;
    carouselNextBtn.disabled = carouselViewport.scrollLeft >= maxScroll - 4;
}

function renderStudents(filter = "") {
    const grid = document.getElementById('student-grid');
    const noResults = document.getElementById('no-results');
    grid.innerHTML = "";
    let count = 0;

    students.forEach((name, index) => {
        const absenNum = index + 1;
        const searchKey = filter.toLowerCase();

        if (name.toLowerCase().includes(searchKey) || absenNum.toString().includes(searchKey)) {
            count++;
            const imgName = `${PHOTO_FOLDER}/absen${absenNum}.${PHOTO_EXT}`;
            const role = specialRoles[absenNum] || "Anggota Kelas";

            const card = document.createElement('div');
            card.className = "card-student";
            card.onclick = () => openModal(name, absenNum, imgName, role);

            card.innerHTML = `
                <div class="card-student-img-box">
                    <img src="${imgName}" loading="lazy" onload="this.classList.add('img-loaded')" onerror="this.onerror=null; this.src='https://placehold.co/300x300/181818/FFD700?text=Absen+${absenNum}'; this.classList.add('img-loaded');" alt="${name}" class="card-student-img">
                    <span class="card-student-absen-badge">${absenNum}</span>
                </div>
                <h4 class="card-student-name">${name}</h4>
                <p class="card-student-role">${role}</p>
            `;
            grid.appendChild(card);
        }
    });

    if (count === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
    }

    if (carouselViewport) {
        carouselViewport.scrollTo({ left: 0 });
    }
    updateCarouselButtons();
}

document.getElementById('search-input').addEventListener('input', (e) => {
    renderStudents(e.target.value);
});

if (carouselPrevBtn && carouselNextBtn && carouselViewport) {
    carouselPrevBtn.addEventListener('click', () => {
        carouselViewport.scrollBy({ left: -carouselViewport.clientWidth, behavior: 'smooth' });
    });

    carouselNextBtn.addEventListener('click', () => {
        carouselViewport.scrollBy({ left: carouselViewport.clientWidth, behavior: 'smooth' });
    });

    carouselViewport.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateCarouselButtons);
    });

    window.addEventListener('resize', updateCarouselButtons);
}

function openModal(name, absen, img, role) {
    document.getElementById('modal-name').innerText = name;
    document.getElementById('modal-absen').innerText = `Absen No. ${absen}`;
    document.getElementById('modal-role').innerText = role;
    const imgEl = document.getElementById('modal-img');
    imgEl.src = img;
    imgEl.onerror = function() {
        this.src = `https://placehold.co/300x300/181818/FFD700?text=Absen+${absen}`;
    };

    const modal = document.getElementById('student-modal');
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('student-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

document.addEventListener('click', (e) => {
    const modal = document.getElementById('student-modal');
    if (e.target === modal) {
        closeModal();
    }
});

document.getElementById('student-modal').addEventListener('click', (e) => {
    if (e.target.id === 'student-modal') {
        closeModal();
    }
});

let currentGalleryIndex = 0;

function getGalleryCards() {
    return Array.from(document.querySelectorAll('.gallery-card'));
}

function showGalleryImage(index) {
    const cards = getGalleryCards();
    if (cards.length === 0) return;

    currentGalleryIndex = (index + cards.length) % cards.length;
    const cardEl = cards[currentGalleryIndex];
    const img = cardEl.querySelector('.gallery-img');
    const title = cardEl.querySelector('.gallery-title');
    const sub = cardEl.querySelector('.gallery-sub');

    document.getElementById('gallery-modal-img').src = img.src;
    document.getElementById('gallery-modal-title').textContent = title ? title.textContent.trim() : "";
    document.getElementById('gallery-modal-sub').textContent = sub ? sub.textContent.trim() : "";
}

function openGalleryImage(cardEl) {
    const cards = getGalleryCards();
    const index = cards.indexOf(cardEl);
    showGalleryImage(index === -1 ? 0 : index);
    document.getElementById('gallery-modal').classList.remove('hidden');
}

function closeGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

document.getElementById('gallery-modal').addEventListener('click', (e) => {
    if (e.target.id === 'gallery-modal') {
        closeGalleryModal();
    }
});

document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('gallery-modal');
    if (modal.classList.contains('hidden')) return;

    if (e.key === 'ArrowRight') {
        showGalleryImage(currentGalleryIndex + 1);
    } else if (e.key === 'ArrowLeft') {
        showGalleryImage(currentGalleryIndex - 1);
    } else if (e.key === 'Escape') {
        closeGalleryModal();
    }
});

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    mobileMenuBtn.classList.toggle('active');
});

document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
    });
});

const THEME_STORAGE_KEY = "pplg-theme";
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeToggleBtnMobile = document.getElementById('theme-toggle-btn-mobile');

function applyThemeIcon(theme) {
    const iconClass = theme === 'light' ? 'fa-sun' : 'fa-moon';
    [themeToggleBtn, themeToggleBtnMobile].forEach((btn) => {
        if (!btn) return;
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = `fas ${iconClass}`;
        }
    });
}

function setTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyThemeIcon(theme);
}

function toggleTheme() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    setTheme(isLight ? 'dark' : 'light');
}

function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    setTheme(savedTheme || (prefersLight ? 'light' : 'dark'));
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}
if (themeToggleBtnMobile) {
    themeToggleBtnMobile.addEventListener('click', toggleTheme);
}

function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
        revealEls.forEach((el) => el.classList.add('reveal-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => observer.observe(el));
}

initTheme();
initScrollReveal();

window.onload = function() {
    renderStudents();
};