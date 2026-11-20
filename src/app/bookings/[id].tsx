import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
} from "react-native";

import { apiFetch, fetchBookings, type Booking } from "@/api/bookings";
import { GlassCard } from "@/components/glass-card";
import { Screen } from "@/components/screen";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { canCheckIn } from "@/lib/check-in";
import { formatDate, formatTime } from "@/lib/format";
import { loadNote, saveNote } from "@/lib/notes";

export default function BookingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dark = useColorScheme() === "dark";

  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);
  const [now, setNow] = useState(new Date());
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBookings(apiFetch)
      .then((list) => setBooking(list.find((b) => b.id === id) ?? null))
      .catch(() => setBooking(null));
    loadNote(id).then(setNote);
  }, [id]);

  // re-evaluate check-in availability while the screen is open
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(t);
  }, []);

  const onSave = async () => {
    if (note.trim() === "") return setMessage("Enter a note");
    if (note.length > 140)
      return setMessage("Keep the note under 140 characters");
    await saveNote(id, note);
    setMessage("Note saved");
  };

  const back = <Button title="‹ Back" onPress={() => router.back()} />;

  if (booking === undefined) {
    return (
      <Screen>
        <ActivityIndicator style={{ marginTop: 80 }} />
      </Screen>
    );
  }
  if (booking === null) {
    return (
      <Screen>
        {back}
        <ThemedText>Booking not found</ThemedText>
      </Screen>
    );
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            gap: Spacing.three,
            paddingBottom: Spacing.four,
          }}
        >
          {back}
          <GlassCard style={{ gap: Spacing.one }}>
            <ThemedText type="title">{booking.title}</ThemedText>
            <ThemedText>
              {formatDate(booking.startsAt, booking.timezone)}
            </ThemedText>
            <ThemedText>
              {formatTime(booking.startsAt, booking.timezone)}
            </ThemedText>
            <ThemedText type="small">{booking.timezone}</ThemedText>
          </GlassCard>

          <Button
            title="Check in"
            disabled={!canCheckIn(now, new Date(booking.startsAt))}
            onPress={() => setMessage("Checked in")}
          />

          <GlassCard style={{ gap: Spacing.two }}>
            <ThemedText type="small">Note</ThemedText>
            <TextInput
              accessibilityLabel="Note"
              placeholder="Note"
              placeholderTextColor="#888"
              value={note}
              onChangeText={(t) => {
                setNote(t);
                setMessage("");
              }}
              multiline
              style={[styles.input, { color: dark ? "#fff" : "#000" }]}
            />
            <Button title="Save note" onPress={onSave} />
            {message !== "" && <ThemedText type="small">{message}</ThemedText>}
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { minHeight: 64, fontSize: 16, textAlignVertical: "top" },
});
