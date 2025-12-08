import fs from 'fs/promises';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error('Missing GEMINI_API_KEY');

function randomFromDate(date) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i <date.length; i++) {
        h = Math.imul(h ^date.charCodeAt(i), 16777619);
    }
    
    h += h << 13;
    h ^= h >>> 7;
    h += h << 3;
    h ^= h >>> 17;
    
    return (h >>> 0) / 4294967296;
}

async function gen(date) {
    const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });

    const wordlist = JSON.parse(await fs.readFile("scripts/words.json", "utf8"));

    const wordIndex = Math.floor(randomFromDate(date) * wordlist.length);

    if (wordIndex === wordlist.length) wordIndex--;

    console.log(`Word: ${wordlist[wordIndex]}`);

    const payload = {
        contents: [
            {
                parts: [
                    { text: `You are Trevor, a Caltech undergraduate freshman. Write a diary entry for ${date} (${dayName}). Start with "Dear diary" and end with "-Trevor". Additionally, your entry must be related to the word "${wordlist[wordIndex]}".` },
                ],
            },
        ],
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const txt = await response.text();
        throw new Error(`Gemini API error: ${response.status} ${txt}`);
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return content;
}

async function main() {
    const argDate = process.argv[2];
    const date = argDate || new Date().toISOString().slice(0, 10);
    const markdown = await gen(date);
    const path = `entries/${date}.md`;
    await fs.mkdir('entries', { recursive: true });
    await fs.writeFile(path, markdown, 'utf8');
    console.log('Wrote', path);
}

main().catch(console.error);

