import { Tabs } from "expo-router";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { Suspense } from "react";
import { ActivityIndicator, View } from "react-native";

async function migrateDb(db: SQLiteDatabase) {
  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  const result = await db.getFirstAsync<{ user_version: number }>(
    `PRAGMA user_version;`
  );
  let version = result?.user_version ?? 0;

  if (version === 0) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS weight_entries (
        day         TEXT PRIMARY KEY NOT NULL,
        kg          REAL NOT NULL,
        recorded_at TEXT NOT NULL,
        updated_at  TEXT NOT NULL
      );
    `);
    version = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${version};`);
}

export default function RootLayout() {
  return (
    <Suspense fallback={
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    }>
      <SQLiteProvider databaseName="fitness.db" onInit={migrateDb} useSuspense>
        <Tabs>
          <Tabs.Screen name="index" options={{ title: "Sākums" }} />
          <Tabs.Screen name="weight" options={{ title: "Svars" }} />
          <Tabs.Screen name="training" options={{ title: "Treniņi" }} />
        </Tabs>
      </SQLiteProvider>
    </Suspense>
  );
}