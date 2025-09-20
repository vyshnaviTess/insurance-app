// src/hooks/usePolicies.ts
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { policiesSelectors } from "@/store/policiesSlice";
import { InsurancePolicy } from "@/domain/entities/insurancePolicy";
import { createPolicy } from "@/domain/usecases/createPolicy";
import { updatePolicy } from "@/domain/usecases/updatePolicy";
import { deletePolicy } from "@/domain/usecases/deletePolicy";
import { syncPolicies } from "@/domain/usecases/syncPolicies";
import { ApiClient } from "@/data/api/client";
import { RemotePolicyRepository } from "@/data/repositories/policyRepository";
import { API_BASE_URL } from "@/config/env";

export function usePolicies() {
  const dispatch = useDispatch<AppDispatch>();
  const policies = useSelector(policiesSelectors.selectAll);

  // Add policy 
 const addPolicy = async (policy: InsurancePolicy) => {
    try {
      await dispatch(createPolicy(policy));
    } catch (err) {
      console.warn("Failed to add policy:", err);
    }
  };

  // Update policy
  const editPolicy = async (policy: InsurancePolicy) => {
    try {
      await dispatch(updatePolicy(policy));
    } catch (err) {
      console.warn("Failed to update policy:", err);
    }
  };

  // Delete policy
  const removePolicy = (id: string) => {
    try { 
    dispatch(deletePolicy(id));
    } catch (err) {
      console.warn("Failed to delete policy:", err);
    }
  };

  // Sync policies with API
  const fetchAndSync = async () => {
    const client = new ApiClient({ baseUrl: API_BASE_URL });
    // const api = new PolicyApi(client);
    const repo = new RemotePolicyRepository(client);
    try {
    await dispatch(syncPolicies(repo));
    } catch (err) {
      console.warn("Policy sync failed:", err);
    }
  };

  return {
    policies,
    addPolicy,
    editPolicy,
    removePolicy,
    fetchAndSync,
  };
}
