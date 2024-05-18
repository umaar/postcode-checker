import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

async function openDB() {
    return open({
        filename: path.join(process.cwd(), 'database.sqlite'),
        driver: sqlite3.Database
    });
}

async function initializeDatabase() {
    const db = await openDB();
    await db.exec(`CREATE TABLE IF NOT EXISTS searches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        postcode TEXT,
        searchTime TEXT
    )`);
}

async function insertSearch(postcode, searchTime) {
    const db = await openDB();
    await db.run('INSERT INTO searches (postcode, searchTime) VALUES (?, ?)', [postcode, searchTime]);
}

async function retrieveRecentSearches(limit = 5) {
    const db = await openDB();
    return db.all('SELECT postcode, searchTime FROM searches ORDER BY id DESC LIMIT ?', [limit]);
}

export { initializeDatabase, insertSearch, retrieveRecentSearches };
