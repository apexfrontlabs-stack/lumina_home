import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, 'src', 'data'); 
const publicImagesPath = path.resolve(__dirname, 'public', 'images');

console.log(" Starting Universal Sync for all data files inside:", dataDir);

if (!fs.existsSync(dataDir)) {
    console.log(" Error: 'src/data' folder nahi mila!");
    process.exit(1);
}

const activeAssets = new Set();
function walkAssets(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    items.forEach(item => {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            walkAssets(fullPath);
        } else if (['.webp', '.png', '.jpg', '.jpeg', '.svg', '.gif'].includes(path.extname(item).toLowerCase())) {
            const relPath = '/' + path.relative(path.resolve(__dirname, 'public'), fullPath).replace(/\\/g, '/');
            activeAssets.add(relPath);
        }
    });
}
walkAssets(publicImagesPath);

const productCategoryMap = {};
const prodSubDir = path.join(publicImagesPath, 'products');
if (fs.existsSync(prodSubDir)) {
    fs.readdirSync(prodSubDir).forEach(folder => {
        const folderPath = path.join(prodSubDir, folder);
        if (fs.statSync(folderPath).isDirectory()) {
            productCategoryMap[folder] = fs.readdirSync(folderPath).filter(f => f.endsWith('.webp'));
        }
    });
}

const dataFiles = fs.readdirSync(dataDir).filter(file => file.endsWith('.js'));

dataFiles.forEach(file => {
    const filePath = path.join(dataDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let isModified = false;

    console.log(`\nScanning content structure: ${file}...`);

    if (file === 'productData.js') {
        const updated = content.replace(/(category:\s*['"]([^'"]+)['"],[^]*?)(imagesCount:\s*\d+,)/g, (matchStr, prefix, category) => {
            if (productCategoryMap[category]) {
                isModified = true;
                return `${prefix}images: ${JSON.stringify(productCategoryMap[category])},`;
            }
            return matchStr;
        });
        content = updated;
    }

    const imagePathRegex = /(['"])(\/images\/[^'"]+)\1/g;
    content = content.replace(imagePathRegex, (match, quote, imgPath) => {
      
        if (!activeAssets.has(imgPath)) {
            console.log(`         Missing Image Found: ${imgPath} inside ${file}`);
            isModified = true;
            return 'null'; 
        }
        return match;
    });

    if (isModified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`     Successfully updated and cleaned up: ${file}`);
    } else {
        console.log(`    ℹ No clean-up required for: ${file} (All assets matched)`);
    }
});

