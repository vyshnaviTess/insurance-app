import { render, fireEvent } from "@testing-library/react-native";
import AddReminder from "../app/policy/[id]/addReminder";
import { Provider } from "react-redux";
import { store } from "../src/store";

test("adds reminder to store", () => {
  const { getByText, getByLabelText } = render(
    <Provider store={store}><AddReminder/></Provider>
  );
  fireEvent.changeText(getByLabelText("Reminder Title"), "Test Reminder");
  fireEvent.press(getByText("Save"));

  const state: any = store.getState();
  const reminders = Object.values(state.reminders.entities);
  expect(reminders.length).toBeGreaterThan(0);
  expect((reminders[0] as any).title).toBe("Test Reminder");
});
