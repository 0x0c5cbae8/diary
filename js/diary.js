const entryElem = document.getElementById('entry');
const dateElem = document.getElementById('date');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let currentDate = new Date();

// format YYYY-MM-DD
function formatDate(d) {
    return d.toISOString().slice(0, 10);
}

async function loadEntry(dateStr) {
    const path = `entries/${dateStr}.md`;
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error('Not found');
        const md = await res.text();
        const html = marked.parse(md);
        const safe = DOMPurify.sanitize(html);
        entryElem.innerHTML = safe;
        dateElem.textContent = dateStr;
    } catch (err) {
        entryElem.textContent = 'No entry for this day yet.';
        dateElem.textContent = dateStr;
    }
}

function changeDay(offset) {
    currentDate.setDate(currentDate.getDate() + offset);
    loadEntry(formatDate(currentDate));
}

prevBtn.addEventListener('click', () => changeDay(-1));
nextBtn.addEventListener('click', () => changeDay(1));

loadEntry(formatDate(currentDate));
