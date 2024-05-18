import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function initDB() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS searches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postcode TEXT NOT NULL,
      searchTime TEXT NOT NULL
    )
  `);

  console.log('Database initialized successfully');
}

initDB().catch(error => {
  console.error('Error initializing database:', error);
});
