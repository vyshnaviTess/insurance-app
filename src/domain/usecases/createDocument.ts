// src/domain/usecases/createDocument.ts
import { Document } from "../entities/document";
import { AppDispatch } from "@/store";
import { documentsActions } from "@/store/documentSlice";
import { policiesActions } from "@/store/policiesSlice";
import { enqueue } from "@/store/offlineQueueSlice";
import NetInfo from "@react-native-community/netinfo";
import { RemoteDocumentRepository } from "@/data/repositories/documentRepository";
import { ApiClient } from "@/data/api/client";
import { API_BASE_URL } from "@/config/env";
import { RemotePolicyRepository } from "@/data/repositories/policyRepository";

const repo = new RemoteDocumentRepository(
  new ApiClient({ baseUrl: API_BASE_URL })
);

export const createDocument =
  (policyId: string, doc: Document) => async (dispatch: AppDispatch) => {
    // Optimistic update
    dispatch(documentsActions.upsertDocument(doc));
    dispatch(policiesActions.addDocumentToPolicy({ policyId, documentId: doc.id }));

    const { isConnected } = await NetInfo.fetch();
    if (isConnected) {
      try {
        await repo.create(doc);
        const policyRepo = new RemotePolicyRepository(new ApiClient({ baseUrl: API_BASE_URL }));
        const updatedPolicy = await policyRepo.updateDocumentRef(policyId, doc.id);
        dispatch(policiesActions.upsertPolicy(updatedPolicy));
      } catch {
        dispatch(enqueue({ type: "CREATE", entity: "document", payload: doc }));
      }
    } else {
      dispatch(enqueue({ type: "CREATE", entity: "document", payload: doc }));
    }
  };
