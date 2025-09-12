import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../src/store";
import { scheduleReminder } from "../../../src/domain/usecases/scheduleReminder";
import { policiesActions } from "../../../src/store/policiesSlice";
import { Screen } from "../../../src/ui/components/Screen";
import { TextField } from "../../../src/ui/components/TextField";
import { Button } from "../../../src/ui/components/Button";

export default function AddReminder() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString());

  const dispatch = useDispatch<AppDispatch>(); // ✅ fix

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
      <Button title="Save" onPress={saveReminder} />
    </Screen>
  );
}
