import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../../public/images');

const placeholders = [
    { name: 'gideons_tiny_army', title: "Gideon's Army" },
    { name: 'samson_strong_man', title: "Samson" },
    { name: 'ruth_friend', title: "Ruth & Naomi" },
    { name: 'samuel_hears_god', title: "Samuel" },
    { name: 'elisha_fire_horses', title: "Elisha's Horses" },
    { name: 'queen_esther', title: "Queen Esther" },
    { name: 'fiery_furnace', title: "Fiery Furnace" },
    { name: 'jesus_baptized', title: "Jesus Baptized" },
    { name: 'helping_friend', title: "Friend on Roof" },
    { name: 'farmers_seeds', title: "Farmer's Seeds" },
    { name: 'lost_coin', title: "Lost Coin" },
    { name: 'fruit_of_spirit', title: "Fruit of Spirit" },
];

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

placeholders.forEach(p => {
    const color = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const title = escapeXml(p.title);
    const content = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#${color}" />
  <text x="50%" y="50%" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dy=".3em">${title}</text>
  <text x="50%" y="60%" font-family="Arial" font-size="20" fill="white" text-anchor="middle" dy=".3em">PlaceHolder</text>
</svg>`;
    fs.writeFileSync(path.join(outDir, `${p.name}.svg`), content);
    console.log(`Created ${p.name}.svg`);
});
