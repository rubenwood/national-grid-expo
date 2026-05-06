import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput } from "react-native";

import { COLOUR_MAP } from "../models/generation-models";

export default function RegionalForm() {
  const [inputText, onChangeText] = useState("");

  const [loading, setLoading] = useState(false);
  const [regionalData, setRegionalData] = useState(null);

  const onSubmitClicked = async () => {
    setLoading(true);
    const resp = await fetch(
      `https://api.carbonintensity.org.uk/regional/postcode/${inputText}`,
    );
    const respJson = await resp.json();

    setRegionalData(respJson);
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
      {!loading ? (
        <ThemedText>{JSON.stringify(regionalData)}</ThemedText>
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
