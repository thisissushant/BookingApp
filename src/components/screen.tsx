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
  blob: { position: "absolute", borderRadius: 999, opacity: 0.22 },
  blobA: {
    width: 280,
    height: 280,
    top: -60,
    right: -90,
    backgroundColor: "#ea2f32",
  },
  blobB: {
    width: 320,
    height: 320,
    bottom: 60,
    left: -140,
    backgroundColor: "#648b67",
  },
});
