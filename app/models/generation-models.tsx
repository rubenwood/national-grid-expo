export type EnergySource = {
  name: string;
  value: number; // %
  colour: string;
  category: "fossil" | "renewable" | "other";
};

export type GridData = {
  demand: number;
  generation: number;
  sources: EnergySource[];
};

export type GroupedEnergyData = {
  fossil: EnergySource[];
  fossil_total: number;
  renewable: EnergySource[];
  renewable_total: number;
  other: EnergySource[];
  other_total: number;
};

export type RegionalData = {
  regionid: string;
  dnoregion: string;
  shortname: string;
  postcode: string;
  data: any;
};

export const CATEGORY_MAP: Record<string, EnergySource["category"]> = {
  gas: "fossil",
  coal: "fossil",
  wind: "renewable",
  solar: "renewable",
  hydro: "renewable",
  biomass: "other",
  nuclear: "other",
  imports: "other",
  other: "other",
};

export const COLOUR_MAP: Record<string, string> = {
  biomass: "#a78bfa",
  coal: "#444",
  imports: "#94a3b8",
  gas: "#f87171",
  nuclear: "#60a5fa",
  other: "#9ca3af",
  hydro: "#38bdf8",
  solar: "#facc15",
  wind: "#4ade80",
};
