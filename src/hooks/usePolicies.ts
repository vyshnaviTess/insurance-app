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
  const addPolicy = (policy: InsurancePolicy) =>
    dispatch(createPolicy(policy));

  // Update policy
  const editPolicy = (policy: InsurancePolicy) =>
    dispatch(updatePolicy(policy));

  // Delete policy
  const removePolicy = (id: string) =>
    dispatch(deletePolicy(id));

  // Sync policies with API
  const fetchAndSync = () => {
    const client = new ApiClient({ baseUrl: API_BASE_URL });
    // const api = new PolicyApi(client);
    const repo = new RemotePolicyRepository(client);
    dispatch(syncPolicies(repo));
  };

  return {
    policies,
    addPolicy,
    editPolicy,
    removePolicy,
    fetchAndSync,
  };
}
