import { store } from "../src/store";
import { __clearOfflineSync } from "../src/store/middleware/offlineSync";
import { enqueue } from "../src/store/offlineQueueSlice";

afterEach(() => {
  __clearOfflineSync();
});
//unit test of the slice itself (pure Redux reducer/middleware)
test("enqueue and dequeue offline jobs", () => {
  store.dispatch(enqueue({ type: "CREATE", entity: "policy", payload: { id: "p1" } }));
  let state: any = store.getState();
  expect(state.offlineQueue.length).toBe(1);

  const jobId = state.offlineQueue[0].id;
  store.dispatch({ type: "offlineQueue/dequeue", payload: jobId });

  state = store.getState();
  expect(state.offlineQueue.length).toBe(0);
});
