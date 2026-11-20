import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { StyleSheet, View, type ViewProps } from "react-native";

import { Spacing } from "@/constants/theme";

// Real liquid glass on iOS 26+; translucent fallback elsewhere.
export function GlassCard({ style, children, ...rest }: ViewProps) {
  if (isLiquidGlassAvailable()) {
    return (
      <GlassView style={[styles.card, style]} {...rest}>
        {children}
      </GlassView>
    );
  }
  return (
    <View style={[styles.card, styles.fallback, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: Spacing.three,
    overflow: "hidden",
  },
  fallback: {
    backgroundColor: "rgba(128,128,128,0.18)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.35)",
  },
});
