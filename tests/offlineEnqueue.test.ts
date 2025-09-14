import NetInfo from "@react-native-community/netinfo";
import { store } from "../src/store";
import { createPolicy } from "../src/domain/usecases/createPolicy";
import { InsurancePolicy } from "../src/domain/entities/insurancePolicy";

// integration test of the use-case layer, making sure createPolicy dispatches the enqueue action under offline conditions.
jest.mock("@react-native-community/netinfo", () => ({ fetch: jest.fn() }));

test("createPolicy enqueues when offline", async () => {
  (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: false });
  const policy: InsurancePolicy = {
    id: "x", type: "car", provider: "Offline", policyNumber: "POFF",
    startDate: "2024-01-01", endDate: "2025-01-01", premium: 1, coverage: {}, documents: [], reminders: []
  };
  await createPolicy(policy)(store.dispatch);
  const state: any = store.getState();
  expect(state.offlineQueue.length).toBe(1);
});
