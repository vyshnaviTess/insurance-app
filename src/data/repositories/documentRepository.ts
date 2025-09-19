// src/data/repositories/documentRepository.ts
import { ApiClient } from "../api/client";
import { RemoteRepository } from "./remoteRepository";
import { Document } from "../../domain/entities/document";
import { DocumentDTO, documentMapper } from "../mappers/documentMapper";

export class RemoteDocumentRepository extends RemoteRepository<Document, DocumentDTO> {
  constructor(client: ApiClient) {
    super(client, "/documents", documentMapper);
  }
}
