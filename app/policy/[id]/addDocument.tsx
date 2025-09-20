import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";
import { pickFromDocuments, pickFromCamera } from "@/services/imagePicker";
import { persistAsset } from "@/services/fileStorage";
import { Document } from "@/domain/entities/document";
import { Button } from "@/ui/components/Button";
import { Screen } from "@/ui/components/Screen";
import { ErrorView } from "@/ui/feedback/ErrorView";
import { LoadingView } from "@/ui/feedback/LoadingView";
import { createDocument } from "@/domain/usecases/createDocument";
import { AppDispatch } from "@/store";

export default function AddDocument() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function handleAdd(
    pickFn: () => Promise<{
      uri: string;
      name?: string;
      mime?: string;
      size?: number;
    } | null>,
    category: Document["category"]
  ) {
    try {
      setBusy(true);
      setError(null);

      const asset = await pickFn();
      if (!asset) return;

      const stored = await persistAsset({
        uri: asset.uri,
        fileName: asset.name ?? undefined, // 👈 use `name` instead of fileName
      });

      const fullDoc: Document = {
        ...stored,
        category,
        createdAt: new Date().toISOString(),
        size: asset.size,
        mime: asset.mime,
      };

     await dispatch(createDocument(id!, fullDoc));
      router.back();
    } catch (e: any) {
      setError(e instanceof Error ? e : new Error("Failed to add document"));
    } finally {
      setBusy(false);
    }
  }

  if (busy) return <LoadingView />;

  return (
    <Screen title="Add Document">
      {error && (
        <ErrorView message={error.message} onRetry={() => setError(null)} />
      )}

      <Button
        title="Pick a file"
        onPress={() => handleAdd(pickFromDocuments, "policy")}
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
