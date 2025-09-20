import { useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import * as FileSystem from "expo-file-system/legacy";
import FileViewer from "react-native-file-viewer";
import { documentsSelectors } from "@/store/documentSlice";
import { Screen } from "@/ui/components/Screen";
import { Text, Alert, Image, ScrollView } from "react-native";
import { Button } from "@/ui/components/Button";
import { ReactNode, useEffect, useState } from "react";

export default function DocumentViewer() {
  const { documentId } = useLocalSearchParams<{ documentId: string }>();
  const doc = useSelector((s: any) => documentsSelectors.selectById(s, documentId!));

  const [textContent, setTextContent] = useState<string>("");

  useEffect(() => {
    if (doc) {
      const ext = doc.name.split(".").pop()?.toLowerCase();
      if (ext === "txt") {
        (async () => {
          try {
            const data = await FileSystem.readAsStringAsync(doc.uri);
            setTextContent(data);
          } catch {
            setTextContent("Unable to read text file");
          }
        })();
      }
    }
  }, [doc]);

  async function handleDownload() {
    if (!doc) return;
    const dest = FileSystem.documentDirectory + doc.name;
    await FileSystem.copyAsync({ from: doc.uri, to: dest });
    Alert.alert("Downloaded", `Saved to ${dest}`);
  }

  if (!doc) return <Screen title="Document"><Text>Not found</Text></Screen>;

  const ext = doc.name.split(".").pop()?.toLowerCase();

 let content: ReactNode = null;

  if (ext === "jpg" || ext === "jpeg" || ext === "png") {
    content = (
      <Image
        source={{ uri: doc.uri }}
        style={{ width: "100%", height: 400, resizeMode: "contain", marginVertical: 12 }}
      />
    );
  } else if (ext === "txt") {
    content = (
      <ScrollView style={{ marginVertical: 12 }}>
        <Text>{textContent}</Text>
      </ScrollView>
    );
  }
    else if (["pdf", "doc", "docx"].includes(ext!)) {
    content = (
    <Button
      title={`Open ${ext?.toUpperCase()} in viewer`}
      onPress={async () => {
        try {
          await FileViewer.open(doc.uri); // 👈 correct API for react-native-file-viewer
        } catch (err) {
          Alert.alert("Error", "Unable to open file in viewer.");
          console.error("File open error:", err);
        }
      }}
    />
  );
  } else {
    content = <Text>Preview not available for this file type.</Text>;
  }

  return (
    <Screen title="Document Viewer">
     <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>{doc.name}</Text>
        <Text>Category: {doc.category}</Text>
        <Text>Size: {doc.size ?? 0} bytes</Text>

        {content}

        <Button title="Download" onPress={handleDownload} />
      </ScrollView>
    </Screen>
  );
}
