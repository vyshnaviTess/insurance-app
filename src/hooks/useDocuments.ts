import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { documentsSelectors } from "@/store/documentSlice";
import { ApiClient } from "@/data/api/client";
import { RemoteDocumentRepository } from "@/data/repositories/documentRepository";
import { syncDocuments } from "@/domain/usecases/syncDocuments";
import { API_BASE_URL } from "@/config/env";
import { useCallback } from "react";

export function useDocuments() {
  const dispatch = useDispatch<AppDispatch>();
  const documents = useSelector(documentsSelectors.selectAll);

  const fetchAndSyncDocuments = useCallback(async () => {
    const client = new ApiClient({ baseUrl: API_BASE_URL });
    const repo = new RemoteDocumentRepository(client);
    try {
    await dispatch(syncDocuments(repo));
    } catch (err) {
      console.warn("Document sync failed:", err);
    }
  }, [dispatch]);

  return {
    documents,
    fetchAndSyncDocuments,
  };
}
