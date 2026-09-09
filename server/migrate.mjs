// Migration 0004 may be absent in older D1 exports. Preserve all existing HTML.
export function migrateEditorial(db) {
  db.exec('BEGIN IMMEDIATE');
  try {
    for (const table of ['drafts', 'posts']) {
      const columns = db.prepare(`PRAGMA table_info(${table})`).all();
      if (!columns.length) throw new Error(`Missing imported table: ${table}`);
      if (!columns.some(column => column.name === 'content_markdown')) db.exec(`ALTER TABLE ${table} ADD COLUMN content_markdown TEXT`);
    }
    db.exec('COMMIT');
  } catch (error) { db.exec('ROLLBACK'); throw error; }
}
