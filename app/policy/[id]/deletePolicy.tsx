import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { policiesActions } from "@/store/policiesSlice";
import { Screen } from "@/ui/components/Screen";
import { Button } from "@/ui/components/Button";

export default function DeletePolicy() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useDispatch();
  const router = useRouter();

  function handleDelete() {
    dispatch(policiesActions.removePolicy(id!));
    router.replace("/");
  }

  return (
    <Screen title="Delete Policy">
      <Button title="Confirm Delete" onPress={handleDelete} />
      <Button title="Cancel" onPress={() => router.back()} />
    </Screen>
  );
}
