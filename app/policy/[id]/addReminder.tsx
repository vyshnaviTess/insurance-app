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

export default function AddReminder() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString());
  const [type, setType] = useState<"renewal" | "payment" | "custom">("custom");
  const dispatch = useDispatch<AppDispatch>();

  function saveReminder() {
    const reminderId = nanoid();
    dispatch(scheduleReminder({ id: reminderId, title, dueAt: date }));
    dispatch(policiesActions.addReminderToPolicy({ policyId: id!, reminderId }));
    router.back();
  }

  return (
    <Screen title="Add Reminder">
      <TextField label="Reminder Title" value={title} onChangeText={setTitle} />
      <TextField label="Due Date (ISO)" value={date} onChangeText={setDate} />
      <Select
        label="Type"
        value={type}
        options={[
          { label: "Renewal", value: "renewal" },
          { label: "Payment", value: "payment" },
          { label: "Custom", value: "custom" },
        ]}
        onValueChange={(val) => setType(val as "renewal" | "payment" | "custom")}
      />
      <Button title="Save" onPress={saveReminder} />
    </Screen>
  );
}
