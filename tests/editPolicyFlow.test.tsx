import { render, fireEvent } from "@testing-library/react-native";
import EditPolicy from "../app/policy/[id]/editPolicy";
import { Provider } from "react-redux";
import { store } from "../src/store";
import { policiesActions } from "../src/store/policiesSlice";
import { InsurancePolicy } from "../src/domain/entities/insurancePolicy";

// Mock expo-router to return the right policy ID
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({ id: "p1" }), // ✅ make sure EditPolicy sees "p1"
}));

test("edits a policy provider", () => {
  const policy: InsurancePolicy = {
    id: "p1",
    type: "car",
    provider: "Old",
    policyNumber: "123",
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    premium: 100,
    coverage: {},
    documents: [],
    reminders: [],
  };
  store.dispatch(policiesActions.upsertPolicy(policy));

  const { getByText, getByLabelText } = render(
    <Provider store={store}><EditPolicy/></Provider>
  );

  fireEvent.changeText(getByLabelText("Provider"), "New Provider");
  fireEvent.press(getByText("Save"));

  const state: any = store.getState();
  expect(state.policies.entities["p1"].provider).toBe("New Provider");
});
