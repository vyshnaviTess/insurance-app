import { InsurancePolicy } from "../entities/insurancePolicy";
import { AppDispatch } from "../../store";
import { policiesActions } from "../../store/policiesSlice";

export const updatePolicy =
  (policy: InsurancePolicy) => async (dispatch: AppDispatch) => {
    dispatch(policiesActions.upsertPolicy(policy));
  };
