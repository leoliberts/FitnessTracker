import type { SQLiteDatabase } from "expo-sqlite";

export type WeightRow = {
  day: string;
  kg: number;
  recorded_at: string;
  updated_at: string;
};

function todayLocal(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
export async function upsertWeight(db: SQLiteDatabase, kg: number): Promise<void> {
  const day = todayLocal();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO weight_entries (day, kg, recorded_at, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(day) DO UPDATE SET
       kg = excluded.kg,
       recorded_at = excluded.recorded_at,
       updated_at = excluded.updated_at;`,
    [day, kg, now, now]
  );
}
export async function getRange(db: SQLiteDatabase, fromDay: string): Promise<WeightRow[]> {
  return await db.getAllAsync<WeightRow>(
    `SELECT day, kg, recorded_at, updated_at
     FROM weight_entries
     WHERE day >= ?
     ORDER BY day ASC;`,
    [fromDay]
  );
}
export async function deleteWeight(db: SQLiteDatabase, day: string): Promise<void> {
  await db.runAsync(`DELETE FROM weight_entries WHERE day = ?;`, [day]);
}
export async function seedFakeData(db: SQLiteDatabase) {
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    if (i % 7 === 3) continue; // skip some days — creates gaps

    const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const kg = 80 + Math.sin(i / 6) * 2 + (Math.random() - 0.5);
    const iso = d.toISOString();

    await db.runAsync(
      `INSERT INTO weight_entries (day, kg, recorded_at, updated_at)
       VALUES (?, ?, ?, ?) ON CONFLICT(day) DO UPDATE SET kg = excluded.kg;`,
      [day, Math.round(kg * 10) / 10, iso, iso]
    );
  }
}