// src/domain/usecases/syncPolicies.ts
import { AppDispatch } from "../../store";
import { policiesActions } from "../../store/policiesSlice";
import { PolicyRepository } from "../../data/repositories/policyRepository";
import { Result, Ok, Err } from "@/utils/result";
import { InsurancePolicy } from "../entities/insurancePolicy";

export const syncPolicies =
  (repo: PolicyRepository) =>
  async (dispatch: AppDispatch, getState: () => any): Promise<Result<void, Error>> => {
    try {
      const remote = await repo.list();
      const local = getState().policies.entities as Record<string, InsurancePolicy>;

      for (const r of remote) {
        const l = local[r.id];
        if (!l) {
          // new on server → take it
          dispatch(policiesActions.upsertPolicy(r));
        } else if ((l.lastModified ?? 0) > (r.lastModified ?? 0)) {
          // local newer → push up
          await repo.update(l);
        } else if ((r.lastModified ?? 0) > (l.lastModified ?? 0)) {
          // server newer → overwrite local
          dispatch(policiesActions.upsertPolicy(r));
        }
      }

      return Ok(undefined);
    } catch (err: any) {
      return Err(err instanceof Error ? err : new Error("Unknown sync error"));
    }
  };

