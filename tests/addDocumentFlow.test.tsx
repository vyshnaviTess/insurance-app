import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AddDocument from "../app/policy/[id]/addDocument";
import { Provider } from "react-redux";
import { store } from "../src/store";
import * as picker from "../src/services/imagePicker";
import * as storage from "../src/services/fileStorage";

jest.spyOn(picker, "pickFromLibrary").mockResolvedValue({ uri: "mock://file", fileName: "test.jpg" } as any);
jest.spyOn(storage, "persistAsset").mockResolvedValue({ id: "d1", uri: "mock://file", name: "test.jpg" } as any);

test("adds document to store", async () => {
  const { getByText } = render(
    <Provider store={store}><AddDocument/></Provider>
  );
  fireEvent.press(getByText("Pick from library"));
  await waitFor(() => {
    const state: any = store.getState();
    expect(Object.values(state.documents.entities)).toHaveLength(1);
  });
});
