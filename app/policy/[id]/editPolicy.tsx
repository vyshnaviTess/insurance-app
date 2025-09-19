import { useState } from "react";
import { Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { policiesSelectors } from "@/store/policiesSlice";
import { Screen } from "@/ui/components/Screen";
import { TextField } from "@/ui/components/TextField";
import { Button } from "@/ui/components/Button";
import { updatePolicy } from "@/domain/usecases/updatePolicy";
import { AppDispatch } from "@/store";
import { usePolicies } from "@/hooks/usePolicies";

export default function EditPolicy() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const policy = useSelector((s: any) => policiesSelectors.selectById(s, id!));
  const [provider, setProvider] = useState(policy?.provider ?? "");
   const { editPolicy } = usePolicies(); 
  const router = useRouter();

  if (!policy) return <Screen title="Edit Policy"><Text>Not found</Text></Screen>;

  function handleSave() {
   editPolicy({ ...policy, provider, lastModified: Date.now() });
    router.back();
  }

  return (
    <Screen title="Edit Policy">
      <TextField label="Provider" value={provider} onChangeText={setProvider} />
      <Button title="Save" onPress={handleSave} />
    </Screen>
  );
}
