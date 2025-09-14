import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";
import { pickFromLibrary, pickFromCamera } from "@/services/imagePicker";
import { persistAsset } from "@/services/fileStorage";
import { documentsActions } from "@/store/documentSlice";
import { policiesActions } from "@/store/policiesSlice";
import { Document } from "@/domain/entities/document";
import { Button } from "@/ui/components/Button";
import { Screen } from "@/ui/components/Screen";
import { ErrorView } from "@/ui/feedback/ErrorView";
import { LoadingView } from "@/ui/feedback/LoadingView";

export default function AddDocument() {
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function handleAdd(
    pickFn: typeof pickFromLibrary | typeof pickFromCamera,
    category: Document["category"]
  ) {
    try {
      setBusy(true);
      setError(null);

      const asset = await pickFn();
      if (!asset) return;

      const stored = await persistAsset({
        uri: asset.uri,
        fileName: asset.fileName ?? undefined,
      });

      const fullDoc: Document = {
        ...stored,
        category,
        createdAt: new Date().toISOString(),
      };

      dispatch(documentsActions.upsertDocument(fullDoc));
      dispatch(
        policiesActions.addDocumentToPolicy({
          policyId: id!,
          documentId: fullDoc.id,
        })
      );

      router.back();
    } catch (e: any) {
      setError(e instanceof Error ? e : new Error("Failed to add document"));
    } finally {
      setBusy(false);
    }
  }

  if (busy) {
    return <LoadingView />;
  }

  return (
    <Screen title="Add Document">
      {error && (
        <ErrorView message={error.message} onRetry={() => setError(null)} />
      )}

      <Button
        title="Pick from library"
        onPress={() => handleAdd(pickFromLibrary, "policy")}
        disabled={busy}
      />
      <Button
        title="Take photo"
        onPress={() => handleAdd(pickFromCamera, "policy")}
        disabled={busy}
      />
    </Screen>
  );
}
