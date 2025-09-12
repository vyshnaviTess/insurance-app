import { InsurancePolicy } from "../entities/insurancePolicy";
import { AppDispatch } from "../../store";
import { policiesActions } from "../../store/policiesSlice";

export const createPolicy =
  (policy: InsurancePolicy) => async (dispatch: AppDispatch) => {
    dispatch(policiesActions.upsertPolicy(policy));
    // Could add API call here or enqueue offline job
  };
//TODO: not used yet