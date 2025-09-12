import { useDispatch } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";
import { pickFromLibrary } from "../../../src/services/imagePicker";
import { persistAsset } from "../../../src/services/fileStorage";
import { documentsActions } from "../../../src/store/documentSlice";
import { policiesActions } from "../../../src/store/policiesSlice";
import { Document } from "../../../src/domain/entities/insurancePolicy";
import { Button } from "../../../src/ui/components/Button";
import { Screen } from "../../../src/ui/components/Screen";

export default function AddDocument() {
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const handleAdd = async () => {
    const asset = await pickFromLibrary();
    if (!asset) return;

    // ✅ fix #1
    const stored = await persistAsset({
      uri: asset.uri,
      fileName: asset.fileName ?? undefined,
    });

    // ✅ fix #2
    const fullDoc: Document = {
      ...stored,
      category: "policy",
      createdAt: new Date().toISOString(),
    };

    dispatch(documentsActions.upsertDocument(fullDoc));
    dispatch(policiesActions.addDocumentToPolicy({ policyId: id!, documentId: fullDoc.id }));
    router.back();
  };

  return (
    <Screen title="Add Document">
      <Button title="Pick from library" onPress={handleAdd} />
    </Screen>
  );
}
