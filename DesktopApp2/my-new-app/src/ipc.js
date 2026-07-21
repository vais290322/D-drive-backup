import { ipcMain } from 'electron';
import db from './db.js';

// TEST: save data
ipcMain.handle('offline:test-save', () => {
  const stmt = db.prepare(`
    INSERT INTO offline_data (type, payload)
    VALUES (?, ?)
  `);

  stmt.run(
    'test',
    JSON.stringify({ message: 'Offline DB working!', time: Date.now() })
  );

  return { success: true };
});

// TEST: get data
ipcMain.handle('offline:test-get', () => {
  return db.prepare('SELECT * FROM offline_data').all();
});


/**
 * CREATE test data
 */
ipcMain.handle('test:create', (_, payload) => {
  const stmt = db.prepare(`
    INSERT INTO test_data (name, amount)
    VALUES (?, ?)
  `);

  stmt.run(payload.name, payload.amount);

  return { success: true };
});

/**
 * GET all test data
 */
ipcMain.handle('test:get', () => {
  return db.prepare(`
    SELECT * FROM test_data ORDER BY id DESC
  `).all();
});