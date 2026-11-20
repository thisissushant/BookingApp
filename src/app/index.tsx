import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

import { apiFetch, fetchBookings, type Booking } from "@/api/bookings";
import { AppButton } from "@/components/app-button";
import { GlassCard } from "@/components/glass-card";
import { Screen } from "@/components/screen";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { formatTime } from "@/lib/format";

type Status = "loading" | "error" | "ready";

export default function BookingsList() {
  const router = useRouter();
  const dark = useColorScheme() === "dark";
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    try {
      setBookings(await fetchBookings(apiFetch));
      setStatus("ready");
      setUpdatedAt(new Date());
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? bookings.filter((b) => b.title.toLowerCase().includes(q))
      : bookings;
  }, [bookings, query]);

  if (status === "loading") {
    return (
      <Screen>
        <ActivityIndicator style={{ marginTop: 80 }} />
      </Screen>
    );
  }

  if (status === "error") {
    return (
      <Screen>
        <GlassCard style={styles.center}>
          <ThemedText>Could not load bookings</ThemedText>
          <AppButton
            title="Try again"
            onPress={() => {
              setStatus("loading");
              load();
            }}
          />
        </GlassCard>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <ThemedText type="title">Bookings</ThemedText>
        <ThemedText type="small" style={styles.muted}>
          Updated {updatedAt ? updatedAt.toLocaleTimeString() : "-"}
        </ThemedText>
      </View>

      <GlassCard style={styles.searchCard}>
        <TextInput
          accessibilityLabel="Search bookings"
          placeholder="Search bookings"
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          style={[styles.input, { color: dark ? "#fff" : "#000" }]}
        />
      </GlassCard>

      <FlatList
        data={filtered}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ gap: Spacing.two }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <ThemedText>
            {bookings.length === 0 ? "No bookings" : "No bookings match"}
          </ThemedText>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/bookings/[id]",
                params: { id: item.id },
              })
            }
          >
            <GlassCard style={styles.row}>
              <View style={styles.rowText}>
                <ThemedText style={styles.rowTitle}>{item.title}</ThemedText>
                <ThemedText type="small" style={styles.muted}>
                  {item.timezone}
                </ThemedText>
              </View>
              <ThemedText style={styles.time}>
                {formatTime(item.startsAt, item.timezone)}
              </ThemedText>
            </GlassCard>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", gap: Spacing.two, marginTop: 80 },
  header: { gap: 2, paddingTop: Spacing.two },
  muted: { opacity: 0.6 },
  searchCard: { paddingVertical: Spacing.one },
  input: { fontSize: 16, paddingVertical: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 17, fontWeight: "600" },
  time: { fontSize: 15, fontWeight: "600", color: "#2F5BEA" },
});
