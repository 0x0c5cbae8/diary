import fs from 'fs/promises';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error('Missing GEMINI_API_KEY');

async function gen(date) {
    const payload = {
        contents: [
            {
                parts: [
                    { text: 'How AI does work?' },
                ],
            },
        ],
    };

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    const options = {
        method: 'POST',
        contentType: 'application/json',
        headers: {
            'x-goog-api-key': apiKey,
        },
        payload: JSON.stringify(payload)
    };

    const response = await fetch(url, options);
    const data = await response.json();
    const content = data['candidates'][0]['content']['parts'][0]['text'];
    return content;
}

async function main() {
    const date = new Date().toISOString().slice(0, 10);
    const markdown = await generateMarkdown(date);
    const path = `entries/${date}.md`;
    await fs.mkdir('entries', { recursive: true });
    await fs.writeFile(path, markdown, 'utf8');
    console.log('Wrote', path);
}

main();
