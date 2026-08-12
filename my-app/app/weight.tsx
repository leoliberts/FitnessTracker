import { Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useWeights } from "@/hooks/useWeights";
import { toChartData } from "@/lib/chartData";

export default function Weight() {
  const { rows } = useWeights("2020-01-01");
  const chart = toChartData(rows,30)
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Svara vēsture</Text>
      <LineChart data={chart.data}
      yAxisOffset={chart.yAxisOffset}
      maxValue={chart.maxValue}
      stepValue={chart.stepValue}
      noOfSections={5} />
    </View>
  );
}