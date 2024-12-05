import { IDBPDatabase, openDB } from 'idb';

// 非常简陋的idb增删改查，如有问题，请尽情吐槽

export class SpellbookDB {
    private dbPromise: Promise<IDBPDatabase<String>>;

    constructor() {
        this.dbPromise = openDB('spellbook', 1, {
            upgrade(db) {
                db.createObjectStore('mystore', { keyPath: 'uuid' });
            },
        });
    }

    async addItem(newItem: SpellbookItem): Promise<SpellbookItem> {
        const db = await this.dbPromise;
        const tx = db.transaction('mystore', 'readwrite');
        const store = tx.objectStore('mystore');
        if (!newItem.uuid) {
            const uuid = this.generateUUID();
            newItem.uuid = uuid;
        }
        await store.add(newItem);
        await tx.done;
        console.log("addItem中的item是" + JSON.stringify(newItem));
        return newItem;
    }

    async getItem(id: string): Promise<SpellbookItem | undefined> {
        const db = await this.dbPromise;
        const tx = db.transaction('mystore', 'readonly');
        const store = tx.objectStore('mystore');
        console.log("getItem中的uuid是" + id);
        const item = await store.get(id);
        console.log("getItem中的item是" + JSON.stringify(item))
        await tx.done;
        return item;
    }

    async deleteItem(id: string): Promise<void> {
        const db = await this.dbPromise;
        const tx = db.transaction('mystore', 'readwrite');
        const store = tx.objectStore('mystore');
        await store.delete(id);
        await tx.done;
    }

    async updateItem(updatedItem: SpellbookItem): Promise<SpellbookItem> {
        const db = await this.dbPromise;
        const tx = db.transaction('mystore', 'readwrite');
        const store = tx.objectStore('mystore');
        try {
            await store.put(updatedItem);
            await tx.done;
            return updatedItem;
        } catch (error) {
            console.error('Error updating item:', error);
            throw error;
        }
    }

    generateUUID(): string {
        // ... (your UUID generation function) ...
        let d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}

// addItem().then(() => getItem(1)).then(() => deleteItem(1));
