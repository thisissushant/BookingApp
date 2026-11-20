import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export function AppButton({
  title,
  onPress,
  disabled,
  variant = "primary",
}: Props) {
  const primary = variant === "primary";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        primary ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, !primary && styles.secondaryText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: "stretch",
    minHeight: 50,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: "#2F5BEA" },
  secondary: { borderWidth: 1.5, borderColor: "#2F5BEA" },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.85 },
  text: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  secondaryText: { color: "#2F5BEA" },
});
