const entryElem = document.getElementById('entry');
const dateElem = document.getElementById('date');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let currentDate = new Date();

// format YYYY-MM-DD
function formatDate(d) {
    return d.toISOString().slice(0, 10);
}

function changeDay(offset) {
    currentDate.setDate(currentDate.getDate() + offset);
    loadEntry(formatDate(currentDate));
}

async function getEntry(dateStr){
    const path = `entries/${dateStr}.md`;
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error('Not found');
        const md = await res.text();
        const html = marked.parse(md);
        const safe = DOMPurify.sanitize(html);
        return safe;
    } catch (err) {
        return undefined;
    }
}

async function loadEntry(dateStr) {
    const entry = getEntry(dateStr);
    if(entry){
        entryElem.innerHTML = entry;
        dateElem.textContent = dateStr;
    }else{
        entryElem.textContent = 'No entry for this day yet.';
        dateElem.textContent = dateStr;
    }
}

prevBtn.addEventListener('click', () => changeDay(-1));
nextBtn.addEventListener('click', () => changeDay(1));

while(!getEntry(formatDate(currentDate))){
    currentDate.setDate(currentDate.getDate() - 1);
}

loadEntry(formatDate(currentDate));
