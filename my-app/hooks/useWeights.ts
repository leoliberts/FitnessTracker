import { useState, useEffect, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { getRange, type WeightRow } from "@/db/weights";

export function useWeights(fromDay: string) {
  const db = useSQLiteContext();
  const [rows, setRows] = useState<WeightRow[]>([]);

  const refresh = useCallback(async () => {
    setRows(await getRange(db, fromDay));
  }, [db, fromDay]);

  useEffect(() => { refresh(); }, [refresh]);

  return { rows, refresh };
}