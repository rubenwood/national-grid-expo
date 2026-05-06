import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import {
  COLOUR_MAP,
  EnergySource,
  GroupedEnergyData,
} from "../models/generation-models";
import {
  mapEnergySourceChartData,
  normaliseGenerationData,
} from "../utils/data-formatting";

export function LoadingText() {
  return (
    <ThemedView>
      <ThemedText>Loading...</ThemedText>
    </ThemedView>
  );
}

export function EnergySourceList(props: any) {
  return (
    <>
      {props.data.map((item: EnergySource) => (
        <ThemedView key={`energy-${item.name}`} style={styles.sectionBody}>
          <ThemedView
            style={[styles.colourSquare, { backgroundColor: item.colour }]}
          />
          <ThemedText style={[styles.sectionText]}>
            {item.value}% {item.name}
          </ThemedText>
        </ThemedView>
      ))}
    </>
  );
}

export default function GenerationWheel() {
  const [normalisedData, setNormalisedData] = useState<EnergySource[] | null>(
    null,
  );
  const [chartData, setChartData] = useState<any[]>([]);
  const [groupedData, setGroupedData] = useState<GroupedEnergyData>();
  const [groupedChartData, setGroupedChartData] = useState<any[]>([]);

  const fetchGenerationData = async () => {
    const resp = await fetch("https://api.carbonintensity.org.uk/generation");
    const respJson = await resp.json();

    const normalisedData = normaliseGenerationData(respJson.data.generationmix);
    setNormalisedData(normalisedData);

    const inChartData = mapEnergySourceChartData(normalisedData);
    setChartData(inChartData);

    const inGroupedData = groupData(normalisedData);
    setGroupedData(inGroupedData);

    const inGroupedChartData = mapGroupedChartData(inGroupedData);
    setGroupedChartData(inGroupedChartData);
  };

  function groupData(data: EnergySource[]): GroupedEnergyData {
    const grouped: GroupedEnergyData = {
      fossil: [],
      fossil_total: 0,
      renewable: [],
      renewable_total: 0,
      other: [],
      other_total: 0,
    };

    for (const item of data) {
      const category = item.category;

      grouped[category].push(item);
      grouped[`${category}_total`] += item.value;
    }

    grouped.fossil.sort((a, b) => b.value - a.value);
    grouped.renewable.sort((a, b) => b.value - a.value);
    grouped.other.sort((a, b) => b.value - a.value);
    return grouped;
  }

  function mapGroupedChartData(data: GroupedEnergyData) {
    const chartData = [
      {
        value: data.fossil_total,
        color: COLOUR_MAP["gas"],
        text: `fossil`,
      },
      {
        value: data.renewable_total,
        color: COLOUR_MAP["wind"],
        text: `renewable`,
      },
      {
        value: data.other_total,
        color: COLOUR_MAP["nuclear"],
        text: `other`,
      },
    ];

    return chartData;
  }

  useEffect(() => {
    console.log("mount");
    fetchGenerationData();
  }, []); // make sure we only fetch once

  if (!groupedData) {
    return <LoadingText />;
  }

  return (
    <ThemedView>
      {/* <ThemedText>{JSON.stringify(groupedData)}</ThemedText> */}
      <PieChart
        data={chartData}
        strokeWidth={1}
        strokeColor="black"
        labelsPosition="mid"
        showText
        textColor="white"
        radius={160}
        innerRadius={0}
        textSize={10}
      />
      <PieChart
        data={groupedChartData}
        strokeWidth={1}
        strokeColor="black"
        labelsPosition="mid"
        showText
        textColor="white"
        radius={160}
        innerRadius={0}
        textSize={10}
      />
      <ThemedView>
        <ThemedText style={[styles.sectionStyle, styles.fossil]}>
          {groupedData.fossil_total.toFixed(2)}% Fossil Fuels
        </ThemedText>
        <EnergySourceList data={groupedData.fossil} />
        <ThemedText style={[styles.sectionStyle, styles.renewable]}>
          {groupedData.renewable_total.toFixed(2)}% Renewables
        </ThemedText>
        <EnergySourceList data={groupedData.renewable} />
        <ThemedText style={[styles.sectionStyle, styles.other]}>
          {groupedData.other_total.toFixed(2)}% Other
        </ThemedText>
        <EnergySourceList data={groupedData.other} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  sectionStyle: {
    marginTop: 20,
    padding: 16,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    backgroundColor: "#1c1c1e",
  },
  fossil: {
    backgroundColor: COLOUR_MAP["gas"],
  },
  renewable: {
    backgroundColor: COLOUR_MAP["wind"],
  },
  other: {
    backgroundColor: COLOUR_MAP["nuclear"],
  },
  sectionBody: {
    padding: 16,
    backgroundColor: "#38383a",
    alignItems: "center",
    flexDirection: "row",
  },
  sectionText: {
    paddingLeft: 6,
  },
  colourSquare: {
    width: 20,
    height: 20,
  },
});
