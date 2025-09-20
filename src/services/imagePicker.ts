import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from "expo-document-picker";

export async function pickFromCamera() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') throw new Error('Camera permission denied');
  const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
  if (result.canceled) return null;
  return result.assets[0]; // { uri, fileName, mimeType, fileSize }
}

export async function pickFromLibrary() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') throw new Error('Library permission denied');
  const result = await ImagePicker.launchImageLibraryAsync({ quality: 1, selectionLimit: 1 });
  if (result.canceled) return null;
  return result.assets[0];
}

export async function pickFromDocuments() {
  const result = await DocumentPicker.getDocumentAsync({
    type: "*/*", // allow all file formats
    copyToCacheDirectory: true,
    multiple: false,
  });

  // ✅ New API: result.canceled
  if (result.canceled) return null;

  const doc = result.assets[0]; // first file selected

  return {
    uri: doc.uri,
    name: doc.name ?? `file-${Date.now()}`,
    mime: doc.mimeType ?? "application/octet-stream",
    size: doc.size,
  };
}