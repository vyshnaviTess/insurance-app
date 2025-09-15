import { AppDispatch } from "../../store";
import { policiesActions } from "../../store/policiesSlice";
import { PolicyRepository } from "../../data/repositories/policyRepository";
import { Result, Ok, Err } from "@/utils/result";

export const syncPolicies =
  (repo: PolicyRepository) => async (dispatch: AppDispatch): Promise<Result<void, Error>> => {
    try {
      const remote = await repo.list();
      dispatch(policiesActions.upsertPolicies(remote));
      return Ok(undefined);
    } catch (err: any) {
      return Err(err instanceof Error ? err : new Error("Unknown sync error"));
    }
  };
//TODO: not used yet