import * as ImagePicker from 'expo-image-picker';

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
