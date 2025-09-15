import { AppDispatch } from "../../store";
import { policiesActions } from "../../store/policiesSlice";

export const deletePolicy =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(policiesActions.removePolicy(id));
  };
  