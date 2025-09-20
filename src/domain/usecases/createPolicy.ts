// src/domain/usecases/createPolicy.ts
import { InsurancePolicy } from "../entities/insurancePolicy";
import { AppDispatch } from "../../store";
import { policiesActions } from "../../store/policiesSlice";
import NetInfo from "@react-native-community/netinfo";
import { enqueue } from "../../store/offlineQueueSlice";
import { RemotePolicyRepository } from "../../data/repositories/policyRepository";
import { ApiClient } from "../../data/api/client";
import { API_BASE_URL } from "@/config/env";

const repo = new RemotePolicyRepository(new ApiClient({ baseUrl: API_BASE_URL }));

export const createPolicy =
  (policy: InsurancePolicy) => async (dispatch: AppDispatch) => {
    // ✅ Optimistic update so UI updates instantly
    dispatch(policiesActions.upsertPolicy(policy));

    try {
      const { isConnected } = await NetInfo.fetch();

      if (!isConnected) {
        // Queue for offline sync
        dispatch(enqueue({ type: "CREATE", entity: "policy", payload: policy }));
        return policy;
      } else {
       // Try to save remotely
        await repo.create(policy);
      }
    } catch (error) {
     console.warn("Network failed while creating policy, queuing offline job:", error);
      // Keep optimistic update, but could also enqueue as fallback
      dispatch(enqueue({ type: "CREATE", entity: "policy", payload: policy }));
    }
  };
