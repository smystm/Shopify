const fs = require('fs');
const path = require('path');

const SKINS_DIR = path.join(__dirname, '..', '..', '..', 'public', 'images', 'weapons-real', 'skins');

function getCategories() {
    try {
        const entries = fs.readdirSync(SKINS_DIR, { withFileTypes: true });
        const folders = entries
            .filter(e => e.isDirectory())
            .map(e => e.name)
            .sort();

        return folders.map((name, index) => ({
            id: index + 1,
            value: name,
        }));
    } catch (err) {
        return [];
    }
}

function getImagesForCategory(categoryValue) {
    try {
        const categoryPath = path.join(SKINS_DIR, categoryValue);
        const files = fs.readdirSync(categoryPath, { withFileTypes: true })
            .filter(e => e.isFile() && e.name.endsWith('.png'))
            .map(e => `/images/weapons-real/skins/${categoryValue}/${e.name}`)
            .sort();
        return files;
    } catch (err) {
        return [];
    }
}

function getImageForCategory(categoryValue) {
    const images = getImagesForCategory(categoryValue);
    if (images.length === 0) return null;
    return images[0];
}

const TITLE_TO_CATEGORY = {
    deserteagle: 'deagle',
    dualberettas: 'dual',
    m4a4: 'm4a1',
    sg553: 'sg556',
};

function categoryForTitle(title) {
    const normalized = String(title ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const categories = getCategories();

    const mapped = TITLE_TO_CATEGORY[normalized];
    if (mapped) {
        const found = categories.find((c) => c.value === mapped);
        if (found) return found;
    }

    for (const cat of categories) {
        const catNormalized = cat.value.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (normalized.includes(catNormalized) || catNormalized.includes(normalized)) {
            return cat;
        }
    }

    return null;
}

module.exports = { getCategories, getImagesForCategory, getImageForCategory, categoryForTitle };
