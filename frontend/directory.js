// directory.js — Directory zoek + categorie-filter
// ARC AI Agents Website Fabriek

let entries = [];
let categorieen = [];
let activeCategory = 'alle';
let searchTerm = '';

async function loadData() {
    const res = await fetch('../data/entries.json');
    const data = await res.json();
    entries = data.entries;
    categorieen = data.categorieen;
    renderFilters();
    renderEntries();
}

function renderFilters() {
    const container = document.getElementById('categoryFilters');
    container.innerHTML = categorieen.map(cat => `
        <button class="filter-btn" data-cat="${cat}">${cat}</button>
    `).join('');

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.cat;
            renderEntries();
        });
    });
}

function renderEntries() {
    const grid = document.getElementById('entryGrid');

    let filtered = activeCategory === 'alle'
        ? entries
        : entries.filter(e => e.categorie === activeCategory);

    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(e =>
            e.naam.toLowerCase().includes(term) ||
            e.adres.toLowerCase().includes(term)
        );
    }

    if (filtered.length === 0) {
        grid.innerHTML = '<p class="empty">Geen resultaten gevonden.</p>';
        return;
    }

    grid.innerHTML = filtered.map(e => `
        <div class="entry-card">
            <span class="entry-category">${e.categorie}</span>
            <h3>${e.naam}</h3>
            <p class="entry-desc">${e.beschrijving}</p>
            <div class="entry-info">
                <span>${e.adres}</span>
                <span>${e.telefoon}</span>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();

    document.querySelector('.filter-btn[data-cat="alle"]').addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.filter-btn[data-cat="alle"]').classList.add('active');
        activeCategory = 'alle';
        renderEntries();
    });

    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderEntries();
    });
});
