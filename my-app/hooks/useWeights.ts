import { useState, useEffect, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { getRange, upsertWeight, type WeightRow } from "@/db/weights";

export function useWeights(fromDay: string) {
  const db = useSQLiteContext();
  const [rows, setRows] = useState<WeightRow[]>([]);

  const refresh = useCallback(async () => {
    setRows(await getRange(db, fromDay));
  }, [db, fromDay]);
  
  const addWeight = useCallback(async(kg:number) =>{
    await upsertWeight(db,kg);
    await refresh();
  }, [db,refresh]);
  useEffect(() => { refresh(); }, [refresh]);

  return { rows, refresh, addWeight };
}