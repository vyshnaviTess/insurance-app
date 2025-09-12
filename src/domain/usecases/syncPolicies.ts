import { AppDispatch } from "../../store";
import { policiesActions } from "../../store/policiesSlice";
import { PolicyRepository } from "../../data/repositories/policyRepository";

// naive sync: fetch remote list and overwrite
export const syncPolicies =
  (repo: PolicyRepository) => async (dispatch: AppDispatch) => {
    const remote = await repo.list();
    dispatch(policiesActions.upsertPolicies(remote));
  };
//TODO: not used yet