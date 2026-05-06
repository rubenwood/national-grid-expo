import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";

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
      <TextInput
        style={[styles.inputField]}
        onChangeText={onChangeText}
        value={inputText}
      ></TextInput>
      <Button
        title={!loading ? "Submit" : "loading..."}
        onPress={onSubmitClicked}
      />
      {!loading ? (
        <ThemedText>{JSON.stringify(regionalData)}</ThemedText>
      ) : null}
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  inputField: {
    borderWidth: 10,
    backgroundColor: "white",
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
