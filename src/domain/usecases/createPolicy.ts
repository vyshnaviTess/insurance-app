import { InsurancePolicy } from "../entities/insurancePolicy";
import { AppDispatch } from "../../store";
import { policiesActions } from "../../store/policiesSlice";
import NetInfo from '@react-native-community/netinfo';
import { enqueue } from '../../store/offlineQueueSlice';
import { RemotePolicyRepository } from '../../data/repositories/policyRepository';
import { ApiClient } from '../../data/api/client';

const repo = new RemotePolicyRepository(new ApiClient({ baseUrl: 'https://mock.api' }));
export const createPolicy =
 (policy: InsurancePolicy) => async (dispatch: AppDispatch) => {
  // optimistic update
   dispatch(policiesActions.upsertPolicy(policy));
   const { isConnected } = await NetInfo.fetch();
   if (isConnected) {
     try { await repo.create(policy); } catch { /* keep optimistic */ }
   } else {
     dispatch(enqueue({ type: 'CREATE', entity: 'policy', payload: policy }));
   }
 };
