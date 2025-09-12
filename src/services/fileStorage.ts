import * as FileSystem from 'expo-file-system/legacy';
import { nanoid } from '@reduxjs/toolkit';

export async function persistAsset(asset: { uri: string; fileName?: string }) {
  const id = nanoid();
  const ext = asset.fileName?.split('.').pop() ?? 'jpg';
  const dest = `${FileSystem.documentDirectory}docs/${id}.${ext}`;

  await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}docs`, { intermediates: true });
  await FileSystem.copyAsync({ from: asset.uri, to: dest });

  const info = await FileSystem.getInfoAsync(dest);

  return {
    id,
    uri: dest,
    name: asset.fileName ?? `document-${id}.${ext}`,
    size: info.exists ? info.size ?? 0 : 0,
  };
}
