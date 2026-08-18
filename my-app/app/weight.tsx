import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useWeights } from "@/hooks/useWeights";
import { toChartData } from "@/lib/chartData";

export default function Weight() {
  const { rows,addWeight } = useWeights("2020-01-01");
  const chart = toChartData(rows,30)

  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  async function handleSubmit(){
    const kg = parseFloat(input.trim().replace(",","."));

    if (!Number.isFinite(kg) || kg<20 || kg > 400){
      setError("Ievadi svaru no 20 līdz 400 kg");
      return;
    }
    await addWeight(kg);
    setInput("");
    setError("");
  }
  return (
    <View style={{ flex: 1, padding: 16, gap:12}}>
      <Text>Svara vēsture</Text>
      <LineChart data={chart.data}
      yAxisOffset={chart.yAxisOffset}
      maxValue={chart.maxValue}
      stepValue={chart.stepValue}
      noOfSections={5} />
      <TextInput
      value={input}
      onChangeText={setInput}
      keyboardType="decimal-pad"
      placeholder="Svars (kg)"
      style={{borderWidth:1,borderRadius:8,padding:12}}
      />
      {error !== "" && <Text style={{color:"red"}}>{error}</Text>}
      <Pressable onPress={handleSubmit} style={{padding:12, backgroundColor:"#333", borderRadius:8}}>
        <Text style={{color:"white",textAlign:"center"}}>Saglabāt</Text>
        </Pressable>

    </View>
  );
}