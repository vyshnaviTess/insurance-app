// src/domain/usecases/deletePolicy.ts
import { AppDispatch } from "@/store";
import { policiesActions } from "@/store/policiesSlice";
import { enqueue } from "@/store/offlineQueueSlice";
import NetInfo from "@react-native-community/netinfo";
import { RemotePolicyRepository } from "@/data/repositories/policyRepository";
import { ApiClient } from "@/data/api/client";
import { API_BASE_URL } from "@/config/env";

const repo = new RemotePolicyRepository(new ApiClient({ baseUrl: API_BASE_URL }));

export const deletePolicy =
  (id: string) => async (dispatch: AppDispatch) => {
    // Optimistic remove locally
    dispatch(policiesActions.removePolicy(id));

    const { isConnected } = await NetInfo.fetch();
    if (isConnected) {
      try {
        await repo.remove(id);   // ✅ DELETE /policies/:id
      } catch {
        // If backend fails → queue it
        dispatch(enqueue({ type: "DELETE", entity: "policy", payload: { id } }));
      }
    } else {
      // Offline → enqueue delete
      dispatch(enqueue({ type: "DELETE", entity: "policy", payload: { id } }));
    }
  };
