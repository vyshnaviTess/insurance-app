import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AddDocument from "../app/policy/[id]/addDocument";
import { Provider } from "react-redux";
import { store } from "../src/store";
import * as filePicker  from "../src/services/imagePicker";
import * as storage from "../src/services/fileStorage";

// Mock the document picker to return a fake file
jest.spyOn(filePicker, "pickFromDocuments").mockResolvedValue({
  uri: "mock://file",
  name: "test.pdf",
  mime: "application/pdf",
  size: 12345,
} as any);

// Mock persistAsset to simulate storing the file
jest.spyOn(storage, "persistAsset").mockResolvedValue({
  id: "d1",
  uri: "mock://file",
  name: "test.pdf",
} as any);

test("adds document to store", async () => {
  const { getByText } = render(
    <Provider store={store}>
      <AddDocument />
    </Provider>
  );

  // Button label changed to "Pick a file"
  fireEvent.press(getByText("Pick a file"));

  await waitFor(() => {
    const state: any = store.getState();
    expect(Object.values(state.documents.entities)).toHaveLength(1);
  });
});
