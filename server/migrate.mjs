// Migration 0004 may be absent in older D1 exports. Preserve all existing HTML.
export function migrateEditorial(db) {
  db.exec('BEGIN IMMEDIATE');
  try {
    for (const table of ['drafts', 'posts']) {
      const columns = db.prepare(`PRAGMA table_info(${table})`).all();
      if (!columns.length) throw new Error(`Missing imported table: ${table}`);
      if (!columns.some(column => column.name === 'content_markdown')) db.exec(`ALTER TABLE ${table} ADD COLUMN content_markdown TEXT`);
      if (!columns.some(column => column.name === 'image_meta_json')) db.exec(`ALTER TABLE ${table} ADD COLUMN image_meta_json TEXT`);
    }
    // Sync covers have always been generated at this fixed size. Backfill only
    // those immutable assets; manually uploaded legacy covers remain unknown.
    const postColumns = db.prepare('PRAGMA table_info(posts)').all();
    if (postColumns.some(column => column.name === 'image_url')) {
      db.prepare("UPDATE posts SET image_meta_json=? WHERE (image_meta_json IS NULL OR image_meta_json='') AND image_url LIKE '%/sync/%'")
        .run(JSON.stringify({ width: 1536, height: 1024, mime: 'image/png' }));
    }
    db.exec('COMMIT');
  } catch (error) { db.exec('ROLLBACK'); throw error; }
}
