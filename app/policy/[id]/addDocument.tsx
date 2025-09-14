import { useDispatch } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";
import { pickFromLibrary, pickFromCamera } from "@/services/imagePicker";
import { persistAsset } from "@/services/fileStorage";
import { documentsActions } from "@/store/documentSlice";
import { policiesActions } from "@/store/policiesSlice";
import { Document } from "@/domain/entities/document";
import { Button } from "@/ui/components/Button";
import { Screen } from "@/ui/components/Screen";

export default function AddDocument() {
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  async function handleAdd(pickFn: typeof pickFromLibrary | typeof pickFromCamera, category: Document["category"]) {
    const asset = await pickFn();
    if (!asset) return;

    const stored = await persistAsset({ uri: asset.uri, fileName: asset.fileName ?? undefined });

    const fullDoc: Document = {
      ...stored,
      category,
      createdAt: new Date().toISOString(),
    };

    dispatch(documentsActions.upsertDocument(fullDoc));
    dispatch(policiesActions.addDocumentToPolicy({ policyId: id!, documentId: fullDoc.id }));
    router.back();
  }

  return (
    <Screen title="Add Document">
      <Button title="Pick from library" onPress={() => handleAdd(pickFromLibrary, "policy")} />
      <Button title="Take photo" onPress={() => handleAdd(pickFromCamera, "policy")} />
    </Screen>
  );
}
