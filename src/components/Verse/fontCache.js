const DB_NAME = 'FontCache';
const STORE_NAME = 'fonts';
const META_KEY = 'fontMetadata';

class FontCache {
    constructor() {
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);

            request.onerror = () => reject(new Error('Failed to open IndexedDB'));
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore(STORE_NAME);
            };
        });
    }

    async cacheFont(fontKey, fontData) {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        await store.put(fontData, fontKey);

        // Update metadata in localStorage
        const metadata = JSON.parse(localStorage.getItem(META_KEY) || '{}');
        metadata[fontKey] = { timestamp: Date.now() };
        localStorage.setItem(META_KEY, JSON.stringify(metadata));
    }

    async getCachedFont(fontKey) {
        const transaction = this.db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        return new Promise((resolve, reject) => {
            const request = store.get(fontKey);
            request.onerror = () => reject(new Error('Font not found in cache'));
            request.onsuccess = () => resolve(request.result);
        });
    }

    async loadFont(fontKey, fontUrl) {
        try {
            // Check if font is in cache
            const cachedFont = await this.getCachedFont(fontKey);
            if (cachedFont) {
                // Font found in cache, load it
                const font = new FontFace(fontKey, cachedFont);
                await font.load();
                document.fonts.add(font);
                return;
            }
        } catch (error) {
            console.log('Font not in cache, fetching from network');
        }

        // Font not in cache, fetch it
        const response = await fetch(fontUrl);
        const fontData = await response.arrayBuffer();

        // Load the font
        const font = new FontFace(fontKey, fontData);
        await font.load();
        document.fonts.add(font);

        // Cache the font
        await this.cacheFont(fontKey, fontData);

    }

    clearOldFonts(maxAge = 7 * 24 * 60 * 60 * 1000) { // Default to 7 days
        const metadata = JSON.parse(localStorage.getItem(META_KEY) || '{}');
        const now = Date.now();
        let updated = false;

        Object.keys(metadata).forEach(key => {
            if (now - metadata[key].timestamp > maxAge) {
                delete metadata[key];
                updated = true;

                // Also remove from IndexedDB
                const transaction = this.db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                store.delete(key);
            }
        });

        if (updated) {
            localStorage.setItem(META_KEY, JSON.stringify(metadata));
        }
    }
}

export const fontCache = new FontCache();