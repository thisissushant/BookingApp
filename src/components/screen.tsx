import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <ThemedView style={styles.root}>
      <View style={[styles.blob, styles.blobA]} />
      <View style={[styles.blob, styles.blobB]} />
      <SafeAreaView style={styles.safe}>{children}</SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: Spacing.three, gap: Spacing.three },
  blob: { position: "absolute", borderRadius: 999, opacity: 0.55 },
  blobA: {
    width: 260,
    height: 260,
    top: -40,
    right: -80,
    backgroundColor: "#5B8DEF",
  },
  blobB: {
    width: 300,
    height: 300,
    bottom: 40,
    left: -120,
    backgroundColor: "#9B6BFF",
  },
});
