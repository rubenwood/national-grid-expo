import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput } from "react-native";
import { PieChart } from "react-native-gifted-charts";

import {
  COLOUR_MAP,
  EnergySource,
  RegionalData,
} from "../models/generation-models";
import {
  formateDateTime,
  mapEnergySourceChartData,
  normaliseGenerationData,
} from "../utils/data-formatting";

export function RegionalOutput(props: any) {
  return (
    <ThemedView>
      {/* <ThemedText>{JSON.stringify(props.rd)}</ThemedText> */}
      <ThemedView style={[styles.empty]}></ThemedView>
      <ThemedText>Region: {props.rd.shortname}</ThemedText>
      <ThemedView style={[styles.empty]}></ThemedView>
      <ThemedText>
        Timeframe: {formateDateTime(props.rd.data[0].from)} -{" "}
        {formateDateTime(props.rd.data[0].to)}
      </ThemedText>
      <ThemedView style={[styles.empty]}></ThemedView>
      <ThemedText>
        Intensity: {props.rd.data[0].intensity.forecast} gCO2/kWh (index:{" "}
        {props.rd.data[0].intensity.index})
      </ThemedText>
      <ThemedView style={[styles.empty]}></ThemedView>
      <ThemedText>Generation:</ThemedText>
      <PieChart
        data={props.cd}
        strokeWidth={1}
        strokeColor="black"
        labelsPosition="mid"
        showText
        textColor="white"
        radius={160}
        innerRadius={0}
        textSize={10}
      />
    </ThemedView>
  );
}

export default function RegionalForm() {
  const [inputText, onChangeText] = useState("");

  const [loading, setLoading] = useState(false);
  const [regionalData, setRegionalData] = useState<RegionalData | null>(null);

  const [normalisedData, setNormalisedData] = useState<EnergySource[] | null>(
    null,
  );
  const [chartData, setChartData] = useState<any[]>([]);

  const onSubmitClicked = async () => {
    setLoading(true);
    const resp = await fetch(
      `https://api.carbonintensity.org.uk/regional/postcode/${inputText}`,
    );
    const respJson = await resp.json();

    const inRegionalData = respJson.data[0];

    setRegionalData(inRegionalData);

    const normalisedData = normaliseGenerationData(
      inRegionalData.data[0].generationmix,
    );
    setNormalisedData(normalisedData);

    const inChartData = mapEnergySourceChartData(normalisedData);
    setChartData(inChartData);

    setLoading(false);
  };

  return (
    <ThemedView>
      <ThemedText>Enter your postcode (e.g: RG10, M6):</ThemedText>
      <ThemedView style={[styles.empty]}></ThemedView>
      <TextInput
        style={[styles.inputField]}
        onChangeText={onChangeText}
        value={inputText}
      ></TextInput>

      <ThemedView style={[styles.empty]}></ThemedView>
      <Pressable style={[styles.submitButton]} onPress={onSubmitClicked}>
        <ThemedText>{!loading ? "Submit" : "loading..."}</ThemedText>
      </Pressable>
      <ThemedView style={[styles.empty]}></ThemedView>

      {!loading && regionalData ? (
        <>
          <RegionalOutput rd={regionalData} cd={chartData} />
        </>
      ) : null}
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  inputField: {
    flex: 1,
    justifyContent: "center",
    padding: 15,
    borderRadius: 6,
    backgroundColor: "white",
  },
  submitButton: {
    flex: 1,
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: COLOUR_MAP["nuclear"],
  },
  empty: {
    padding: 15,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
