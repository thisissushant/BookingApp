import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { StyleSheet, useColorScheme, View, type ViewProps } from "react-native";

import { Spacing } from "@/constants/theme";

export function GlassCard({ style, children, ...rest }: ViewProps) {
  const dark = useColorScheme() === "dark";
  const surface = dark
    ? {
        backgroundColor: "rgba(30,41,59,0.55)",
        borderColor: "rgba(255,255,255,0.14)",
      }
    : {
        backgroundColor: "rgba(255,255,255,0.72)",
        borderColor: "rgba(15,23,42,0.08)",
      };

  if (isLiquidGlassAvailable()) {
    return (
      <GlassView style={[styles.card, surface, style]} {...rest}>
        {children}
      </GlassView>
    );
  }
  return (
    <View style={[styles.card, surface, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: Spacing.three,
    borderWidth: 1,
    overflow: "hidden",
  },
});
