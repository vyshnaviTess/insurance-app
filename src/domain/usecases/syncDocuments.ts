// src/domain/usecases/syncDocuments.ts
import { AppDispatch } from "@/store";
import { documentsActions } from "@/store/documentSlice";
import { RemoteDocumentRepository } from "@/data/repositories/documentRepository";
import { Result, Ok, Err } from "@/utils/result";
import type { Document } from "@/domain/entities/document";

export const syncDocuments =
  (repo: RemoteDocumentRepository) =>
  async (dispatch: AppDispatch): Promise<Result<void, Error>> => {
    try {
      const remote: Document[] = await repo.list();
      dispatch(documentsActions.upsertDocuments(remote));
      return Ok(undefined);
    } catch (err: any) {
      return Err(err instanceof Error ? err : new Error("Unknown sync error"));
    }
  };
//TODO
//“Images won’t survive reinstall because only metadata is synced. To fix this, we’d need to upload the file to a backend storage service (S3, Supabase, etc.) and store the remote URL.”