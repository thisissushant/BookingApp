import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
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
  const [noteMessage, setNoteMessage] = useState("");
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    fetchBookings(apiFetch)
      .then((list) => setBooking(list.find((b) => b.id === id) ?? null))
      .catch(() => setBooking(null));
    loadNote(id).then(setNote);
  }, [id]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(t);
  }, []);

  const onSave = async () => {
    if (note.trim() === "") return setNoteMessage("Enter a note");
    if (note.length > 140)
      return setNoteMessage("Keep the note under 140 characters");
    await saveNote(id, note);
    setNoteMessage("Note saved");
  };

  const back = (
    <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
      <ThemedText style={styles.backText}>‹ Bookings</ThemedText>
    </Pressable>
  );

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

  const checkInEnabled = canCheckIn(now, new Date(booking.startsAt));
  const saved = noteMessage === "Note saved";

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: Spacing.three,
            paddingBottom: Spacing.four,
          }}
        >
          {back}

          <GlassCard style={{ gap: Spacing.three }}>
            <ThemedText type="title" style={{ fontSize: 28 }}>
              {booking.title}
            </ThemedText>
            <Field
              label="Date"
              value={formatDate(booking.startsAt, booking.timezone)}
            />
            <Field
              label="Local time"
              value={formatTime(booking.startsAt, booking.timezone)}
            />
            <Field label="Timezone" value={booking.timezone} />
          </GlassCard>

          <View style={{ gap: Spacing.two }}>
            <AppButton
              title="Check in"
              disabled={!checkInEnabled || checkedIn}
              onPress={() => setCheckedIn(true)}
            />
            {checkedIn && (
              <ThemedText type="small" style={styles.success}>
                Checked in
              </ThemedText>
            )}
          </View>

          <GlassCard style={{ gap: Spacing.two }}>
            <ThemedText type="small" style={styles.label}>
              Note
            </ThemedText>
            <TextInput
              accessibilityLabel="Note"
              placeholder="Note"
              placeholderTextColor="#888"
              value={note}
              onChangeText={(t) => {
                setNote(t);
                setNoteMessage("");
              }}
              multiline
              style={[
                styles.input,
                {
                  color: dark ? "#fff" : "#000",
                  borderColor: dark
                    ? "rgba(255,255,255,0.18)"
                    : "rgba(15,23,42,0.12)",
                },
              ]}
            />
            <View style={styles.counterRow}>
              <ThemedText
                type="small"
                style={
                  noteMessage !== "" && !saved ? styles.error : styles.success
                }
              >
                {noteMessage}
              </ThemedText>
              <ThemedText type="small" style={styles.label}>
                {note.length}/140
              </ThemedText>
            </View>
            <AppButton title="Save note" onPress={onSave} />
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 2 }}>
      <ThemedText type="small" style={styles.label}>
        {label}
      </ThemedText>
      <ThemedText style={{ fontSize: 17, fontWeight: "500" }}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: "flex-start", paddingTop: Spacing.two },
  backText: { color: "#2F5BEA", fontSize: 17, fontWeight: "600" },
  label: { opacity: 0.6 },
  input: {
    minHeight: 88,
    fontSize: 16,
    textAlignVertical: "top",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  counterRow: { flexDirection: "row", justifyContent: "space-between" },
  success: { color: "#16A34A" },
  error: { color: "#DC2626" },
});
