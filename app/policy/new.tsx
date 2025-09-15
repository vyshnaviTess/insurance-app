import { useState } from "react";
import { useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { useRouter } from "expo-router";
import { Screen } from "../../src/ui/components/Screen";
import { TextField } from "../../src/ui/components/TextField";
import { Button } from "../../src/ui/components/Button";
import { Select } from "../../src/ui/components/Select"; // 👈 new import
import { createPolicy } from "@/domain/usecases/createPolicy";
import { AppDispatch } from "@/store";

export default function NewPolicy() {
  const [provider, setProvider] = useState("");
  const [type, setType] = useState<"car" | "van" | "motorbike" | "house">("car"); // 👈 new state
   const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  function handleSave() {
    const id = nanoid();
    const newPolicy = {
    id,
    type,
    provider,
    policyNumber: "ABC-123",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400 * 1000 * 100).toISOString(),
    premium: 500,
    coverage: {},
    documents: [],
    reminders: [],
  };

  dispatch(createPolicy(newPolicy));
    router.replace(`/policy/${id}`);
  }

  return (
    <Screen title="Add Policy">
      <TextField label="Provider" value={provider} onChangeText={setProvider} />

<Select
  label="Insurance Type"
  value={type}
  options={[
    { label: "Car", value: "car" },
    { label: "Van", value: "van" },
    { label: "Motorbike", value: "motorbike" },
    { label: "House", value: "house" },
  ]}
  onValueChange={(val) =>
    setType(val as "car" | "van" | "motorbike" | "house")
  }
/>

      <Button title="Save" onPress={handleSave} />
    </Screen>
  );
}
