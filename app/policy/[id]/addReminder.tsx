import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { scheduleReminder } from "@/domain/usecases/scheduleReminder";
import { policiesActions } from "@/store/policiesSlice";
import { Screen } from "@/ui/components/Screen";
import { TextField } from "@/ui/components/TextField";
import { Button } from "@/ui/components/Button";
import { Select } from "@/ui/components/Select";
import { Pressable, Text, View, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Notifications from "expo-notifications";
import { formatDate } from "@/utils/dates";

export default function AddReminder() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date>(new Date(Date.now() + 86400000)); // tomorrow
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [type, setType] = useState<"renewal" | "payment" | "custom">("custom");
  const dispatch = useDispatch<AppDispatch>();

  async function saveReminder() {
    let dueDate = date;
    if (dueDate.getTime() <= Date.now()) {
      dueDate = new Date(Date.now() + 60 * 1000);
    }

    const reminderId = nanoid();
    dispatch(
      scheduleReminder({
        id: reminderId,
        title,
        dueAt: dueDate.toISOString(),
        type,
      })
    );
    dispatch(
      policiesActions.addReminderToPolicy({
        policyId: id!,
        reminderId,
      })
    );

    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log("✅ Scheduled reminders:", JSON.stringify(scheduled, null, 2));

    router.back();
  }

  return (
    <Screen title="Add Reminder">
      {/* Reminder Title */}
      <TextField
        label="Reminder Title"
        value={title}
        onChangeText={setTitle}
      />

      {/* Date Picker */}
      <View style={{ marginBottom: 16 }}>
        <Text style={styles.label}>Due Date</Text>
        <Pressable style={styles.dateBox} onPress={() => setPickerVisible(true)}>
          <Text>{formatDate(date)}</Text>
        </Pressable>

        <DateTimePickerModal
          isVisible={isPickerVisible}
          mode="datetime"
          date={date}
          minimumDate={new Date()}
          onConfirm={(selectedDate) => {
            setDate(selectedDate);
            setPickerVisible(false);
          }}
          onCancel={() => setPickerVisible(false)}
        />
      </View>

      {/* Type Picker */}
      <Select
        label="Type"
        value={type}
        options={[
          { label: "Renewal", value: "renewal" },
          { label: "Payment", value: "payment" },
          { label: "Custom", value: "custom" },
        ]}
        onValueChange={(val) =>
          setType(val as "renewal" | "payment" | "custom")
        }
      />

      {/* Save */}
      <Button title="Save" onPress={saveReminder} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: "600",
    marginBottom: 6,
  },
  dateBox: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#ccc",
  },
});
