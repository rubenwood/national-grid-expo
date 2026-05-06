import {
    CATEGORY_MAP,
    COLOUR_MAP,
    EnergySource,
} from "../models/generation-models";

export function normaliseGenerationData(data: any[]): EnergySource[] {
  return data.map((item) => ({
    name: item.fuel,
    value: item.perc,
    colour: COLOUR_MAP[item.fuel] ?? "#999",
    category: CATEGORY_MAP[item.fuel] ?? "other",
  }));
}

export function mapEnergySourceChartData(data: EnergySource[]) {
  const categoryOrder = ["fossil", "renewable", "other"];
  const sorted = [...data].sort((a, b) => {
    return (
      categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
    );
  });

  const chartData = sorted.map((item: EnergySource) => ({
    value: item.value,
    color: COLOUR_MAP[item.name] ?? "#999",
    text: `${item.name} (${item.value}%)`,
  }));
  return chartData;
}

export function formateDateTime(dateTimestamp: string) {
  const date = dateTimestamp.split("T")[0];
  const time = dateTimestamp.split("T")[1].replace("Z", "");

  return `${date} @ ${time}`;
}
